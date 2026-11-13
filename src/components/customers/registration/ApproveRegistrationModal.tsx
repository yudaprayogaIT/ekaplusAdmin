"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBuilding,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { API_CONFIG, apiFetch, getApiUrl, getQueryUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import type {
  ApprovalCheckpoint,
  ApprovalCommitStage,
  ApprovalOperationLog,
  ApprovalResult,
  CustomerRegistration,
} from "@/types/customerRegistration";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

interface ApproveRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: (message: string) => void;
  demoMode?: boolean;
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nbid?: number | null;
}

interface GroupCustomerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gpid?: number | null;
}

interface CustomerRegisterAddressApiResponse {
  id: number;
  parent_id: number;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  village?: string | null;
  postal_code?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
}

type RequiredMasterDraft =
  | { mode: "existing"; id: number; name: string; code?: string }
  | { mode: "create"; name: string };
type NationalBrandDraft = RequiredMasterDraft | { mode: "none" };
type ApprovalDraft = {
  nb: NationalBrandDraft;
  gp: RequiredMasterDraft | null;
  gc: RequiredMasterDraft | null;
  bc: { mode: "saga_resolve"; branchId: number };
};
type EntityKey = "nb" | "gp" | "gc";

const CHECKPOINT_TTL = 24 * 60 * 60 * 1000;
const MAROON = "#7f1d1d";

function normalizeEntityName(value?: string | null): string {
  return (value || "").trim().replace(/\s+/g, " ").toUpperCase();
}

function normalizePhone(value?: string | null): string | undefined {
  const digits = (value || "").replace(/\D/g, "");
  return digits || undefined;
}

function normalizeDate(value?: string | null): string | undefined {
  if (!value || value === "-") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value.split("T")[0]
    : date.toISOString().slice(0, 10);
}

function extractIdFromResourceResponse(json: unknown): number | undefined {
  if (!json || typeof json !== "object" || !("data" in json)) return undefined;
  const data = json.data;
  if (!data || typeof data !== "object" || !("id" in data)) return undefined;
  const id = Number(data.id);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

function buildCreditPolicyPayload(source?: {
  credit_limit_active?: unknown;
  credit_limit?: unknown;
  payment_term_active?: unknown;
  payment_term?: unknown;
  limit_customer_overdue_active?: unknown;
  limit_customer_overdue?: unknown;
}) {
  return {
    credit_limit_active: Number(source?.credit_limit_active || 0),
    credit_limit:
      source?.credit_limit == null ? null : Number(source.credit_limit),
    payment_term_active: Number(source?.payment_term_active || 0),
    payment_term:
      source?.payment_term == null ? null : Number(source.payment_term),
    limit_customer_overdue_active: Number(
      source?.limit_customer_overdue_active || 0,
    ),
    limit_customer_overdue:
      source?.limit_customer_overdue == null
        ? null
        : Number(source.limit_customer_overdue),
  };
}

function hashFingerprint(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function draftFingerprint(
  registrationId: string,
  draft: ApprovalDraft,
): string {
  return hashFingerprint(
    JSON.stringify({
      registrationId,
      nb:
        draft.nb.mode === "existing"
          ? ["existing", draft.nb.id]
          : [draft.nb.mode, draft.nb.mode === "create" ? draft.nb.name : ""],
      gp:
        draft.gp?.mode === "existing"
          ? ["existing", draft.gp.id]
          : [draft.gp?.mode, draft.gp?.mode === "create" ? draft.gp.name : ""],
      gc:
        draft.gc?.mode === "existing"
          ? ["existing", draft.gc.id]
          : [draft.gc?.mode, draft.gc?.mode === "create" ? draft.gc.name : ""],
      bc: ["saga_resolve", draft.bc.branchId],
    }),
  );
}

function checkpointKey(registrationId: string): string {
  return `customer-register-approval:v1:${registrationId}`;
}

class RequestError extends Error {
  status?: number;
  outcomeUnknown: boolean;

  constructor(message: string, status?: number, outcomeUnknown = false) {
    super(message);
    this.name = "RequestError";
    this.status = status;
    this.outcomeUnknown = outcomeUnknown;
  }
}

const statusLabel: Record<ApprovalOperationLog["status"], string> = {
  pending: "Pending",
  checking: "Checking",
  started: "Berjalan",
  success: "Created / Resolved",
  failed: "Failed",
  unknown: "Unknown",
  submitted: "Submitted",
};

export function ApproveRegistrationModal({
  isOpen,
  onClose,
  registration,
  onSuccess,
  demoMode = false,
}: ApproveRegistrationModalProps) {
  const { token } = useAuth();
  const inFlightRef = useRef(false);
  const lookupRequestRef = useRef<Record<EntityKey, number>>({
    nb: 0,
    gp: 0,
    gc: 0,
  });
  const initializedRegistrationRef = useRef<string | null>(null);
  const [draft, setDraft] = useState<ApprovalDraft | null>(null);
  const [queries, setQueries] = useState<Record<EntityKey, string>>({
    nb: "",
    gp: "",
    gc: "",
  });
  const [createEditor, setCreateEditor] = useState<EntityKey | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<EntityKey, boolean>
  >({
    nb: false,
    gp: false,
    gc: false,
  });
  const [createName, setCreateName] = useState("");
  const [nationalBrands, setNationalBrands] = useState<NationalBrandRow[]>([]);
  const [groupParents, setGroupParents] = useState<GroupParentRow[]>([]);
  const [groupCustomers, setGroupCustomers] = useState<GroupCustomerRow[]>([]);
  const [branchCode, setBranchCode] = useState("");
  const [shippingAddresses, setShippingAddresses] = useState<
    CustomerRegisterAddressApiResponse[]
  >([]);
  const [shippingLoaded, setShippingLoaded] = useState(false);
  const [loading, setLoading] = useState<Record<EntityKey, boolean>>({
    nb: false,
    gp: false,
    gc: false,
  });
  const [loadErrors, setLoadErrors] = useState<
    Partial<Record<EntityKey, string>>
  >({});
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [commitStage, setCommitStage] = useState<ApprovalCommitStage>("idle");
  const [operationLogs, setOperationLogs] = useState<ApprovalOperationLog[]>(
    [],
  );
  const [checkpoint, setCheckpoint] = useState<ApprovalCheckpoint | null>(null);

  const creditSource = registration as
    | (CustomerRegistration & Parameters<typeof buildCreditPolicyPayload>[0])
    | null;

  const persistCheckpoint = useCallback(
    (next: ApprovalCheckpoint | null) => {
      setCheckpoint(next);
      if (typeof window === "undefined" || !registration) return;
      const key = checkpointKey(registration.id);
      if (next) sessionStorage.setItem(key, JSON.stringify(next));
      else sessionStorage.removeItem(key);
    },
    [registration],
  );

  const updateCheckpoint = useCallback(
    (current: ApprovalCheckpoint, patch: Partial<ApprovalCheckpoint>) => {
      const next = { ...current, ...patch, updatedAt: Date.now() };
      persistCheckpoint(next);
      return next;
    },
    [persistCheckpoint],
  );

  const requestJson = useCallback(
    async (
      stage: string,
      url: string,
      method: "GET" | "POST" | "PUT",
      body?: unknown,
    ) => {
      if (demoMode) return { data: {} };
      try {
        const response = await apiFetch(
          url,
          {
            method,
            cache: "no-store",
            ...(body === undefined ? {} : { body: JSON.stringify(body) }),
          },
          token,
        );
        const json = await response.json().catch(() => null);
        if (!response.ok) {
          const serverMessage =
            json &&
            typeof json === "object" &&
            "message" in json &&
            typeof json.message === "string"
              ? json.message
              : "";
          throw new RequestError(
            `${stage} gagal (HTTP ${response.status})${serverMessage ? `: ${serverMessage}` : ""}`,
            response.status,
          );
        }
        return json;
      } catch (caught) {
        if (caught instanceof RequestError) throw caught;
        throw new RequestError(
          `${stage} tidak dapat dipastikan karena koneksi terputus`,
          undefined,
          method === "POST" || method === "PUT",
        );
      }
    },
    [demoMode, token],
  );

  const loadRows = useCallback(
    async <T,>(
      key: EntityKey,
      endpoint: string,
      fields: string[],
      filters?: Array<[string, string, unknown]>,
      search?: string,
    ): Promise<T[] | null> => {
      if (demoMode) return [];
      if (!token) throw new Error("Sesi tidak tersedia");
      const requestId = lookupRequestRef.current[key] + 1;
      lookupRequestRef.current[key] = requestId;
      setLoading((previous) => ({ ...previous, [key]: true }));
      setLoadErrors((previous) => ({ ...previous, [key]: undefined }));
      try {
        const response = await apiFetch(
          getQueryUrl(endpoint, {
            fields,
            ...(filters ? { filters } : {}),
            ...(search?.trim() ? { search: search.trim() } : {}),
            limit: 20,
            page: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        );
        if (!response.ok) {
          throw new Error(
            `Pencarian ${key.toUpperCase()} gagal (${response.status})`,
          );
        }
        const json = await response.json();
        if (lookupRequestRef.current[key] !== requestId) return null;
        return Array.isArray(json?.data) ? (json.data as T[]) : [];
      } catch (caught) {
        const message =
          caught instanceof Error ? caught.message : "Pencarian gagal";
        if (lookupRequestRef.current[key] === requestId) {
          setLoadErrors((previous) => ({ ...previous, [key]: message }));
        }
        throw caught;
      } finally {
        if (lookupRequestRef.current[key] === requestId) {
          setLoading((previous) => ({ ...previous, [key]: false }));
        }
      }
    },
    [demoMode, token],
  );

  const loadNationalBrands = useCallback(async (search = "") => {
    try {
      const rows = await loadRows<NationalBrandRow>(
        "nb",
        API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
        ["id", "name", "nb_name"],
        undefined,
        search,
      );
      if (rows) setNationalBrands(rows);
      return rows;
    } catch {
      return null;
    }
  }, [loadRows]);

  const loadGroupParents = useCallback(
    async (nbid: number | null, search = "") => {
      try {
        const rows = await loadRows<GroupParentRow>(
          "gp",
          API_CONFIG.ENDPOINTS.GROUP_PARENT,
          ["id", "name", "gp_name", "nbid"],
          [["nbid", "=", nbid]],
          search,
        );
        if (rows) setGroupParents(rows);
        return rows;
      } catch {
        return null;
      }
    },
    [loadRows],
  );

  const loadGroupCustomers = useCallback(
    async (gpid: number, search = "") => {
      try {
        const rows = await loadRows<GroupCustomerRow>(
          "gc",
          API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
          ["id", "name", "gc_name", "gpid"],
          [["gpid", "=", gpid]],
          search,
        );
        if (rows) setGroupCustomers(rows);
        return rows;
      } catch {
        return null;
      }
    },
    [loadRows],
  );

  useEffect(() => {
    if (!isOpen) {
      initializedRegistrationRef.current = null;
      return;
    }
    if (!registration) return;
    if (!demoMode && !token) return;
    const initializationKey = `${registration.id}:${demoMode ? "demo" : "auth"}`;
    if (initializedRegistrationRef.current === initializationKey) return;
    initializedRegistrationRef.current = initializationKey;
    let cancelled = false;
    const initialGpId = registration.master_links?.gp_id ?? registration.gp_id;
    const initialGcId = registration.master_links?.gc_id ?? registration.gc_id;
    const initialDraft: ApprovalDraft = {
      nb: registration.master_links?.nb_id
        ? {
            mode: "existing",
            id: registration.master_links.nb_id,
            name:
              registration.master_links.nb_name ||
              `NB${registration.master_links.nb_id}`,
          }
        : { mode: "none" },
      gp: initialGpId
        ? {
            mode: "existing",
            id: initialGpId,
            name:
              registration.master_links?.gp_name ||
              registration.gp_name ||
              `GP${initialGpId}`,
          }
        : registration.master_links?.gp_manual
          ? {
              mode: "create",
              name: normalizeEntityName(registration.master_links.gp_manual),
            }
          : null,
      gc: initialGcId
        ? {
            mode: "existing",
            id: initialGcId,
            name:
              registration.master_links?.gc_name ||
              registration.gc_name ||
              `GC${initialGcId}`,
          }
        : null,
      bc: {
        mode: "saga_resolve",
        branchId: Number(registration.company.branch_id),
      },
    };
    setDraft(initialDraft);
    setQueries({ nb: "", gp: "", gc: "" });
    setCreateEditor(null);
    setExpandedSections({ nb: false, gp: false, gc: false });
    setError(null);
    setWarning(null);
    setShowConfirm(false);
    setShowCloseConfirm(false);
    setCommitStage("idle");
    setOperationLogs([]);
    setNationalBrands([]);
    setGroupParents([]);
    setGroupCustomers([]);
    lookupRequestRef.current = {
      nb: lookupRequestRef.current.nb + 1,
      gp: lookupRequestRef.current.gp + 1,
      gc: lookupRequestRef.current.gc + 1,
    };
    setLoading({ nb: false, gp: false, gc: false });
    setBranchCode(normalizeEntityName(registration.company.branch_code));
    setShippingAddresses(
      (registration.shipping_addresses || []).map((address, index) => ({
        id: address.id || index + 1,
        parent_id: address.parent_id || Number(registration.id),
        label: address.label,
        address: address.address,
        city: address.city,
        province: address.province,
        district: address.district,
        village: address.village,
        postal_code: address.postal_code,
        pic_name: address.pic_name,
        pic_phone: address.pic_phone,
        is_default: address.is_default,
      })),
    );
    setShippingLoaded(
      Boolean(
        registration.same_as_company_address ||
        registration.shipping_addresses?.length,
      ),
    );
    setLoadErrors({});
    // Draft UI is already usable. Reference/address requests continue in the
    // background and expose their own loading/error states per section.
    setIsPreparing(false);

    async function prepare() {
      if (!registration) return;
      if (demoMode) {
        setNationalBrands([
          { id: 9101, name: "NB9101", nb_name: "EKA TOUR" },
          { id: 9102, name: "NB9102", nb_name: "EKA DISTRIBUTOR" },
        ]);
        setGroupParents([
          {
            id: 9201,
            name: "GP9201",
            gp_name: "DEMO SEJAHTERA GROUP",
            nbid: 9101,
          },
        ]);
        setShippingAddresses([]);
        setBranchCode("DEMO");
        setShippingLoaded(true);
        setIsPreparing(false);
        return;
      }
      const shippingPromise = requestJson(
        "Memuat alamat pengiriman",
        getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, {
          fields: [
            "id",
            "parent_id",
            "label",
            "address",
            "city",
            "province",
            "district",
            "village",
            "postal_code",
            "pic_name",
            "pic_phone",
            "is_default",
          ],
          filters: [
            ["parent_id", "=", Number(registration.id)],
            ["parent_type", "=", "customer_register"],
          ],
        }),
        "GET",
      )
        .then((shipping) => {
          if (cancelled) return;
          const data =
            shipping && typeof shipping === "object" && "data" in shipping
              ? shipping.data
              : [];
          setShippingAddresses(Array.isArray(data) ? data : []);
          setShippingLoaded(true);
        })
        .catch(() => {
          if (cancelled) return;
          setShippingLoaded(Boolean(registration.same_as_company_address));
          setWarning(
            "Alamat pengiriman belum berhasil dimuat. Muat ulang modal sebelum Commit.",
          );
        });
      const branchCodePromise = (registration.company.branch_code
        ? Promise.resolve([{ name: registration.company.branch_code }])
        : fetchAllQueryRows<{ name?: string | null }>({
            endpoint: API_CONFIG.ENDPOINTS.BRANCH,
            spec: {
              fields: ["id", "name"],
              filters: [["id", "=", registration.company.branch_id]],
              limit: 1,
            },
            token: token || "",
            errorMessage: "Kode branch gagal dimuat",
          }))
        .then((rows) => {
          if (!cancelled) {
            setBranchCode(normalizeEntityName(rows[0]?.name));
          }
        })
        .catch(() => {
          if (!cancelled) {
            setError("Kode/prefix Branch belum berhasil dimuat");
          }
        });
      await Promise.allSettled([shippingPromise, branchCodePromise]);
      if (!cancelled) setIsPreparing(false);
    }

    void prepare();
    const raw = sessionStorage.getItem(checkpointKey(registration.id));
    if (raw) {
      try {
        const saved = JSON.parse(raw) as ApprovalCheckpoint;
        const fingerprint = draftFingerprint(registration.id, initialDraft);
        if (
          saved.version === 1 &&
          Date.now() - saved.updatedAt <= CHECKPOINT_TTL &&
          saved.status !== "submitted"
        ) {
          setCheckpoint(saved);
          setCommitStage(saved.status === "unknown" ? "unknown" : "failed");
          setWarning(
            saved.fingerprint === fingerprint
              ? "Checkpoint approval ditemukan. Coba Lanjutkan akan melewati operasi yang sudah berhasil."
              : "Checkpoint berasal dari hierarki draft berbeda. Approval diblokir sampai hasil master direkonsiliasi secara manual.",
          );
        } else {
          sessionStorage.removeItem(checkpointKey(registration.id));
          setCheckpoint(null);
        }
      } catch {
        sessionStorage.removeItem(checkpointKey(registration.id));
        setCheckpoint(null);
      }
    } else {
      setCheckpoint(null);
    }
    return () => {
      cancelled = true;
    };
  }, [
    demoMode,
    isOpen,
    registration,
    requestJson,
    token,
  ]);

  const selectedExistingGpid =
    draft?.gp?.mode === "existing" ? draft.gp.id : undefined;
  const selectedExistingNbid =
    draft?.nb.mode === "existing" ? draft.nb.id : null;

  useEffect(() => {
    if (!isOpen || !selectedExistingGpid) {
      setGroupCustomers([]);
    }
  }, [isOpen, selectedExistingGpid]);

  useEffect(() => {
    if (!isOpen || demoMode || !expandedSections.nb) return;
    const timeoutId = window.setTimeout(
      () => void loadNationalBrands(queries.nb),
      queries.nb.trim() ? 300 : 0,
    );
    return () => window.clearTimeout(timeoutId);
  }, [
    demoMode,
    expandedSections.nb,
    isOpen,
    loadNationalBrands,
    queries.nb,
  ]);

  useEffect(() => {
    if (
      !isOpen ||
      demoMode ||
      !expandedSections.gp ||
      draft?.nb.mode === "create"
    )
      return;
    const timeoutId = window.setTimeout(
      () => void loadGroupParents(selectedExistingNbid, queries.gp),
      queries.gp.trim() ? 300 : 0,
    );
    return () => window.clearTimeout(timeoutId);
  }, [
    demoMode,
    draft?.nb.mode,
    expandedSections.gp,
    isOpen,
    loadGroupParents,
    queries.gp,
    selectedExistingNbid,
  ]);

  useEffect(() => {
    if (
      !isOpen ||
      demoMode ||
      !expandedSections.gc ||
      !selectedExistingGpid
    )
      return;
    const timeoutId = window.setTimeout(
      () => void loadGroupCustomers(selectedExistingGpid, queries.gc),
      queries.gc.trim() ? 300 : 0,
    );
    return () => window.clearTimeout(timeoutId);
  }, [
    demoMode,
    expandedSections.gc,
    isOpen,
    loadGroupCustomers,
    queries.gc,
    selectedExistingGpid,
  ]);

  useEffect(() => {
    setDraft((current) => {
      if (!current) return current;
      const nbRow =
        current.nb.mode === "existing"
          ? nationalBrands.find(
              (row) =>
                Number(row.id) ===
                Number(current.nb.mode === "existing" ? current.nb.id : 0),
            )
          : undefined;
      const gpRow =
        current.gp?.mode === "existing"
          ? groupParents.find(
              (row) =>
                Number(row.id) ===
                Number(current.gp?.mode === "existing" ? current.gp.id : 0),
            )
          : undefined;
      const gcRow =
        current.gc?.mode === "existing"
          ? groupCustomers.find(
              (row) =>
                Number(row.id) ===
                Number(current.gc?.mode === "existing" ? current.gc.id : 0),
            )
          : undefined;
      const nb =
        current.nb.mode === "existing" && nbRow
          ? {
              ...current.nb,
              name: nbRow.nb_name || current.nb.name,
              code: nbRow.name || current.nb.code,
            }
          : current.nb;
      const gp =
        current.gp?.mode === "existing" && gpRow
          ? {
              ...current.gp,
              name: gpRow.gp_name || current.gp.name,
              code: gpRow.name || current.gp.code,
            }
          : current.gp;
      const gc =
        current.gc?.mode === "existing" && gcRow
          ? {
              ...current.gc,
              name: gcRow.gc_name || current.gc.name,
              code: gcRow.name || current.gc.code,
            }
          : current.gc;
      if (nb === current.nb && gp === current.gp && gc === current.gc)
        return current;
      return { ...current, nb, gp, gc };
    });
  }, [groupCustomers, groupParents, nationalBrands]);

  const effectiveShippingAddresses = useMemo(() => {
    if (!registration) return [];
    if (!registration.same_as_company_address) return shippingAddresses;
    if (shippingAddresses.length) return shippingAddresses;
    return [
      {
        id: -1,
        parent_id: Number(registration.id),
        label: "Alamat Perusahaan",
        address: registration.address.full_address,
        city: registration.address.city_name,
        province: registration.address.province_name,
        district: registration.address.district_name,
        village: registration.address.village_name,
        postal_code: registration.address.postal_code,
        pic_name:
          registration.branch_owner?.full_name || registration.user.full_name,
        pic_phone: registration.branch_owner?.phone || registration.user.phone,
        is_default: 1,
      },
    ];
  }, [registration, shippingAddresses]);

  const filterRows = useCallback(
    <T,>(rows: T[], query: string, getText: (row: T) => string) => {
      const normalized = query.trim().toLocaleLowerCase("id-ID");
      return rows
        .filter(
          (row) =>
            !normalized ||
            getText(row).toLocaleLowerCase("id-ID").includes(normalized),
        )
        .slice(0, 20);
    },
    [],
  );

  const filteredNb = useMemo(
    () =>
      filterRows(
        nationalBrands,
        queries.nb,
        (row) => `${row.nb_name || ""} ${row.name || ""}`,
      ),
    [filterRows, nationalBrands, queries.nb],
  );
  const filteredGp = useMemo(() => {
    if (!draft) return [];
    const targetNbid = draft.nb.mode === "existing" ? draft.nb.id : null;
    return filterRows(
      groupParents.filter(
        (row) => Number(row.nbid || 0) === Number(targetNbid || 0),
      ),
      queries.gp,
      (row) => `${row.gp_name || ""} ${row.name || ""}`,
    );
  }, [draft, filterRows, groupParents, queries.gp]);
  const filteredGc = useMemo(
    () =>
      filterRows(
        groupCustomers,
        queries.gc,
        (row) => `${row.gc_name || ""} ${row.name || ""}`,
      ),
    [filterRows, groupCustomers, queries.gc],
  );
  const exactDuplicate = useMemo(() => {
    const name = normalizeEntityName(createName);
    if (!name || !createEditor) return false;
    if (createEditor === "nb")
      return nationalBrands.some(
        (row) => normalizeEntityName(row.nb_name) === name,
      );
    if (createEditor === "gp")
      return filteredGp.some(
        (row) => normalizeEntityName(row.gp_name) === name,
      );
    return groupCustomers.some(
      (row) => normalizeEntityName(row.gc_name) === name,
    );
  }, [createEditor, createName, filteredGp, groupCustomers, nationalBrands]);

  const isDraftLocked = Boolean(checkpoint?.completedStages.length);

  const replaceDraft = useCallback(
    (updater: (current: ApprovalDraft) => ApprovalDraft) => {
      if (isDraftLocked) {
        setWarning(
          "Draft dikunci karena sebagian operasi sudah berhasil. Lanjutkan checkpoint ini atau tutup dan periksa master secara manual.",
        );
        return;
      }
      setDraft((current) => (current ? updater(current) : current));
      setError(null);
      setShowConfirm(false);
    },
    [isDraftLocked],
  );

  const selectNationalBrand = (selection: NationalBrandDraft) => {
    replaceDraft((current) => {
      const newNbid = selection.mode === "existing" ? selection.id : null;
      const existingGp =
        current.gp?.mode === "existing"
          ? groupParents.find(
              (row) =>
                Number(row.id) ===
                Number(current.gp?.mode === "existing" ? current.gp.id : 0),
            )
          : null;
      const compatible =
        existingGp && Number(existingGp.nbid || 0) === Number(newNbid || 0);
      return {
        ...current,
        nb: selection,
        gp: compatible ? current.gp : null,
        gc: compatible ? current.gc : null,
        bc: compatible
          ? current.bc
          : {
              mode: "saga_resolve",
              branchId: Number(registration?.company.branch_id || 0),
            },
      };
    });
    setExpandedSections((current) => ({ ...current, nb: false }));
  };

  const selectGroupParent = (selection: RequiredMasterDraft) => {
    replaceDraft((current) => ({
      ...current,
      gp: selection,
      gc:
        current.gp?.mode === "existing" &&
        selection.mode === "existing" &&
        current.gp.id === selection.id
          ? current.gc
          : null,
      bc: {
        mode: "saga_resolve",
        branchId: Number(registration?.company.branch_id || 0),
      },
    }));
    setExpandedSections((current) => ({ ...current, gp: false }));
  };

  const selectGroupCustomer = (selection: RequiredMasterDraft) => {
    replaceDraft((current) => ({
      ...current,
      gc: selection,
      bc:
        current.gc?.mode === "existing" &&
        selection.mode === "existing" &&
        current.gc.id === selection.id
          ? current.bc
          : {
              mode: "saga_resolve",
              branchId: Number(registration?.company.branch_id || 0),
            },
    }));
    setExpandedSections((current) => ({ ...current, gc: false }));
  };

  const toggleSection = (entity: EntityKey) => {
    setExpandedSections((current) => ({
      ...current,
      [entity]: !current[entity],
    }));
  };

  const openCreate = (entity: EntityKey) => {
    if (loadErrors[entity]) {
      setError(
        "Pencarian referensi gagal. Muat ulang data sebelum membuat master baru.",
      );
      return;
    }
    setCreateEditor(entity);
    const fallback =
      entity === "nb"
        ? registration?.master_links?.nb_manual || queries.nb
        : entity === "gp"
          ? registration?.master_links?.gp_manual ||
            queries.gp ||
            `${registration?.user.full_name || registration?.company.name} GP`
          : queries.gc || registration?.company.name || "";
    setCreateName(normalizeEntityName(fallback));
  };

  const useCreateName = () => {
    const name = normalizeEntityName(createName);
    if (!createEditor || !name || exactDuplicate) return;
    if (createEditor === "nb") selectNationalBrand({ mode: "create", name });
    if (createEditor === "gp") selectGroupParent({ mode: "create", name });
    if (createEditor === "gc") selectGroupCustomer({ mode: "create", name });
    setCreateEditor(null);
    setCreateName("");
  };

  const validationError = useMemo(() => {
    if (!registration || !draft) return "Data registrasi belum siap";
    const status = registration.status.toLowerCase();
    if (!demoMode && registration.docstatus === 1)
      return "Registrasi sudah Submitted";
    if (!demoMode && status !== "draft" && status !== "request")
      return "Status registrasi tidak eligible untuk approval";
    if (!draft.gp) return "Group Parent wajib dipilih atau dibuat";
    if (!draft.gc) return "Group Customer wajib dipilih atau dibuat";
    if (!branchCode) return "Kode/prefix Branch belum berhasil dimuat";
    if (draft.gp.mode === "create" && !normalizeEntityName(draft.gp.name))
      return "Nama Group Parent wajib diisi";
    if (draft.gc.mode === "create" && !normalizeEntityName(draft.gc.name))
      return "Nama Group Customer wajib diisi";
    if (draft.nb.mode === "create" && !normalizeEntityName(draft.nb.name))
      return "Nama National Brand wajib diisi";
    if (
      loadErrors.nb ||
      loadErrors.gp ||
      (draft.gp.mode === "existing" && loadErrors.gc)
    ) {
      return "Data referensi belum berhasil dimuat";
    }
    if (!registration.same_as_company_address && !shippingLoaded) {
      return "Alamat pengiriman belum selesai dimuat";
    }
    if (
      checkpoint &&
      checkpoint.fingerprint !== draftFingerprint(registration.id, draft)
    ) {
      return "Checkpoint tidak cocok dengan draft saat ini; rekonsiliasi master diperlukan";
    }
    return null;
  }, [
    branchCode,
    checkpoint,
    demoMode,
    draft,
    loadErrors,
    registration,
    shippingLoaded,
  ]);

  const addLog = useCallback((log: ApprovalOperationLog) => {
    setOperationLogs((previous) => {
      const index = previous.findIndex((item) => item.stage === log.stage);
      if (index < 0) return [...previous, log];
      return previous.map((item, itemIndex) =>
        itemIndex === index ? log : item,
      );
    });
  }, []);

  const fetchFreshRows = useCallback(
    async <T,>(
      endpoint: string,
      fields: string[],
      filters?: Array<[string, string, unknown]>,
    ): Promise<T[]> => {
      if (demoMode) return [];
      if (!token) throw new Error("Sesi tidak tersedia");
      return fetchAllQueryRows<T>({
        endpoint,
        spec: { fields, ...(filters ? { filters } : {}) },
        token,
        errorMessage: "Validasi referensi gagal",
      });
    },
    [demoMode, token],
  );

  const verifyCreated = useCallback(
    async (
      entity: EntityKey,
      name: string,
      parentId?: number,
    ): Promise<number | undefined> => {
      const config =
        entity === "nb"
          ? {
              endpoint: API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
              field: "nb_name",
              fields: ["id", "nb_name"],
            }
          : entity === "gp"
            ? {
                endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
                field: "gp_name",
                fields: ["id", "gp_name", "nbid"],
              }
            : {
                endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
                field: "gc_name",
                fields: ["id", "gc_name", "gpid"],
              };
      const rows = await fetchFreshRows<Record<string, unknown>>(
        config.endpoint,
        config.fields,
        [[config.field, "=", normalizeEntityName(name)]],
      );
      const matches = rows.filter((row) => {
        const sameName =
          normalizeEntityName(String(row[config.field] || "")) ===
          normalizeEntityName(name);
        if (!sameName || entity === "nb") return sameName;
        const parentField = entity === "gp" ? "nbid" : "gpid";
        return Number(row[parentField] || 0) === Number(parentId || 0);
      });
      return matches.length === 1 ? Number(matches[0].id) : undefined;
    },
    [fetchFreshRows],
  );

  const preflight = useCallback(async () => {
    if (!registration || !draft || !draft.gp || !draft.gc)
      throw new Error("Draft approval belum lengkap");
    const nbDraft = draft.nb;
    const gpDraft = draft.gp;
    const gcDraft = draft.gc;
    addLog({
      stage: "checking",
      status: "checking",
      message: "Memvalidasi status, duplikasi, dan relasi master",
    });
    if (!demoMode) {
      const currentJson = await requestJson(
        "Memeriksa status registrasi",
        getQueryUrl(
          `${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`,
          { fields: ["*"] },
        ),
        "GET",
      );
      const current =
        currentJson && typeof currentJson === "object" && "data" in currentJson
          ? currentJson.data
          : null;
      if (current && typeof current === "object") {
        const currentStatus = String(
          "status" in current ? current.status : "",
        ).toLowerCase();
        const currentDocstatus = Number(
          "docstatus" in current ? current.docstatus : 0,
        );
        if (
          currentDocstatus === 1 ||
          (currentStatus !== "draft" && currentStatus !== "request")
        ) {
          throw new Error(
            "Status registrasi berubah dan tidak lagi eligible untuk approval",
          );
        }
      }
    }

    const freshNb =
      nbDraft.mode === "none"
        ? []
        : await fetchFreshRows<NationalBrandRow>(
            API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
            ["id", "name", "nb_name"],
            nbDraft.mode === "existing"
              ? [["id", "=", nbDraft.id]]
              : [["nb_name", "=", normalizeEntityName(nbDraft.name)]],
          );
    const expectedNbid =
      nbDraft.mode === "existing" ? nbDraft.id : checkpoint?.nbid;
    const freshGp = await fetchFreshRows<GroupParentRow>(
      API_CONFIG.ENDPOINTS.GROUP_PARENT,
      ["id", "name", "gp_name", "nbid"],
      gpDraft.mode === "existing"
        ? [["id", "=", gpDraft.id]]
        : [
            ["gp_name", "=", normalizeEntityName(gpDraft.name)],
            ...(expectedNbid
              ? ([
                  ["nbid", "=", expectedNbid],
                ] as Array<[string, string, unknown]>)
              : []),
          ],
    );
    if (
      nbDraft.mode === "existing" &&
      !freshNb.some((row) => Number(row.id) === nbDraft.id)
    )
      throw new Error("National Brand yang dipilih sudah tidak tersedia");
    if (
      nbDraft.mode === "create" &&
      freshNb.some(
        (row) =>
          normalizeEntityName(row.nb_name) ===
            normalizeEntityName(nbDraft.name) &&
          Number(row.id) !== Number(checkpoint?.nbid || 0),
      )
    )
      throw new Error(
        "National Brand dengan nama identik sudah ada. Pilih data existing.",
      );
    if (gpDraft.mode === "existing") {
      const row = freshGp.find((item) => Number(item.id) === gpDraft.id);
      if (!row)
        throw new Error("Group Parent yang dipilih sudah tidak tersedia");
      if (Number(row.nbid || 0) !== Number(expectedNbid || 0))
        throw new Error(
          "Relasi National Brand dan Group Parent tidak konsisten",
        );
    } else {
      const duplicate = freshGp.some(
        (row) =>
          normalizeEntityName(row.gp_name) ===
            normalizeEntityName(gpDraft.name) &&
          Number(row.nbid || 0) === Number(expectedNbid || 0) &&
          Number(row.id) !== Number(checkpoint?.gpid || 0),
      );
      if (duplicate)
        throw new Error(
          "Group Parent dengan nama dan parent identik sudah ada. Pilih data existing.",
        );
    }
    const resolvedPreflightGpid =
      gpDraft.mode === "existing" ? gpDraft.id : checkpoint?.gpid;
    if (resolvedPreflightGpid) {
      const freshGc = await fetchFreshRows<GroupCustomerRow>(
        API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
        ["id", "name", "gc_name", "gpid"],
        gcDraft.mode === "existing"
          ? [
              ["id", "=", gcDraft.id],
              ["gpid", "=", resolvedPreflightGpid],
            ]
          : [
              ["gc_name", "=", normalizeEntityName(gcDraft.name)],
              ["gpid", "=", resolvedPreflightGpid],
            ],
      );
      if (
        gcDraft.mode === "existing" &&
        !freshGc.some((row) => Number(row.id) === gcDraft.id)
      )
        throw new Error(
          "Group Customer tidak tersedia di bawah Group Parent terpilih",
        );
      if (
        gcDraft.mode === "create" &&
        freshGc.some(
          (row) =>
            normalizeEntityName(row.gc_name) ===
              normalizeEntityName(gcDraft.name) &&
            Number(row.id) !== Number(checkpoint?.gcid || 0),
        )
      )
        throw new Error(
          "Group Customer dengan nama identik sudah ada. Pilih data existing.",
        );
    } else if (gcDraft.mode === "existing") {
      throw new Error(
        "Group Customer existing tidak dapat dipilih di bawah Group Parent baru",
      );
    }
    addLog({
      stage: "checking",
      status: "success",
      message: "Preflight valid",
    });
  }, [
    addLog,
    checkpoint,
    demoMode,
    draft,
    fetchFreshRows,
    registration,
    requestJson,
  ]);

  const buildGroupCustomerPayload = useCallback(
    (gpid: number, name: string) => {
      if (!registration) throw new Error("Data registrasi tidak tersedia");
      return {
        gc_name: normalizeEntityName(name),
        gpid,
        ...buildCreditPolicyPayload(creditSource || undefined),
        owner_full_name: registration.user.full_name,
        owner_phone: normalizePhone(registration.user.phone),
        owner_email: registration.user.email,
        owner_place_of_birth: registration.user.place_of_birth,
        owner_date_of_birth: normalizeDate(registration.user.date_of_birth),
        company_type: registration.company.company_type,
        company_title: registration.company.company_title,
        company_name: registration.company.name,
      };
    },
    [creditSource, registration],
  );

  const buildCustomerRegisterApprovePayload = useCallback(
    (ids: ApprovalResult) => {
      if (!registration) throw new Error("Data registrasi tidak tersedia");
      const applicantOwnerId = Number(registration.ekaplus_user?.id || 0);
      const fallbackOwnerId = Number(registration.created_by_id || 0);
      return {
        status: "Syncing",
        docstatus: 1,
        owner:
          applicantOwnerId > 0
            ? applicantOwnerId
            : fallbackOwnerId > 0
              ? fallbackOwnerId
              : undefined,
        same_as_company_address: registration.same_as_company_address ? 1 : 0,
        gpid: ids.gpid,
        gcid: ids.gcid,
        bcid: ids.bcid ?? null,
        nbid: ids.nbid ?? null,
        ...(draft?.gp?.mode === "create"
          ? { gp_manual: normalizeEntityName(draft.gp.name) }
          : {}),
        ...(draft?.nb.mode === "create"
          ? { nb_manual: normalizeEntityName(draft.nb.name) }
          : {}),
        payment_method: registration.support_data.payment_method || undefined,
        payment_account: registration.support_data.payment_account || undefined,
        tax_status: registration.company.tax_status ?? 0,
        npwp:
          registration.company.tax_status === 1
            ? registration.company.npwp || undefined
            : undefined,
        erp_customer_group:
          registration.support_data.erp_customer_group || undefined,
        notes: registration.support_data.more_information || undefined,
        sales_team: registration.support_data.sales_team || undefined,
        customer_shipping_address: effectiveShippingAddresses.map(
          (address) => ({
            label: address.label || "Warehouse",
            pic_name: address.pic_name || undefined,
            pic_phone: normalizePhone(address.pic_phone),
            address: address.address || "",
            city: address.city || "",
            district: address.district || "",
            village: address.village || "",
            province: address.province || "",
            is_default: address.is_default ? 1 : undefined,
          }),
        ),
      };
    },
    [draft, effectiveShippingAddresses, registration],
  );

  const resolveCreatedResource = useCallback(
    async (
      entity: EntityKey,
      name: string,
      url: string,
      payload: unknown,
      parentId?: number,
    ) => {
      try {
        const response = await requestJson(
          `Membuat ${entity.toUpperCase()}`,
          url,
          "POST",
          payload,
        );
        const id = extractIdFromResourceResponse(response);
        if (!id)
          throw new RequestError(
            `${entity.toUpperCase()} berhasil direspons tetapi ID tidak tersedia`,
            undefined,
            true,
          );
        return id;
      } catch (caught) {
        const requestError =
          caught instanceof RequestError
            ? caught
            : new RequestError("Operasi gagal");
        if (
          requestError.outcomeUnknown ||
          requestError.status === 409 ||
          requestError.status === 422
        ) {
          const verifiedId = await verifyCreated(entity, name, parentId).catch(
            () => undefined,
          );
          if (verifiedId) return verifiedId;
          if (requestError.outcomeUnknown) throw requestError;
        }
        throw requestError;
      }
    },
    [requestJson, verifyCreated],
  );

  const submitApproval = async () => {
    if (inFlightRef.current || !registration || !draft) return;
    if (validationError) {
      setError(validationError);
      return;
    }
    inFlightRef.current = true;
    setIsSubmitting(true);
    setShowConfirm(false);
    setError(null);
    setWarning(null);
    setOperationLogs([]);
    const gpDraft = draft.gp;
    const gcDraft = draft.gc;
    if (!gpDraft || !gcDraft) {
      setError("Relasi GP/GC belum lengkap");
      inFlightRef.current = false;
      setIsSubmitting(false);
      return;
    }
    let activeStage: ApprovalCommitStage = "checking";
    const fingerprint = draftFingerprint(registration.id, draft);
    let current =
      checkpoint?.fingerprint === fingerprint
        ? checkpoint
        : {
            version: 1 as const,
            registrationId: registration.id,
            fingerprint,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            completedStages: [],
            status: "in_progress" as const,
          };
    persistCheckpoint(current);
    try {
      if (demoMode) {
        setCommitStage("checking");
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        addLog({
          stage: "checking",
          status: "success",
          message: "Preflight demo valid",
        });
        addLog({
          stage: "register",
          status: "submitted",
          message: "Demo Submitted / Syncing (tanpa request aktual)",
        });
        setCommitStage("completed");
        persistCheckpoint(null);
        onSuccess(
          `Registrasi "${registration.company.name}" berhasil disimulasikan ke Submitted / Syncing. Tidak ada POST/PUT aktual pada mode demo.`,
        );
        return;
      }

      activeStage = "checking";
      setCommitStage(activeStage);
      await preflight();

      let nbid = draft.nb.mode === "existing" ? draft.nb.id : current.nbid;
      if (draft.nb.mode === "create" && !nbid) {
        activeStage = "nb";
        setCommitStage(activeStage);
        addLog({
          stage: "nb",
          status: "started",
          message: "Membuat National Brand",
        });
        nbid = await resolveCreatedResource(
          "nb",
          draft.nb.name,
          getApiUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND),
          {
            nb_name: normalizeEntityName(draft.nb.name),
            ...buildCreditPolicyPayload(creditSource || undefined),
          },
        );
        current = updateCheckpoint(current, {
          nbid,
          completedStages: [
            ...new Set([...current.completedStages, "nb" as const]),
          ],
        });
        addLog({
          stage: "nb",
          status: "success",
          message: `National Brand resolved (ID ${nbid})`,
        });
      } else {
        addLog({
          stage: "nb",
          status: "success",
          message:
            draft.nb.mode === "none"
              ? "Tanpa National Brand"
              : `National Brand existing (ID ${nbid})`,
        });
      }

      let gpid = gpDraft.mode === "existing" ? gpDraft.id : current.gpid;
      if (gpDraft.mode === "create" && !gpid) {
        activeStage = "gp";
        setCommitStage(activeStage);
        addLog({
          stage: "gp",
          status: "started",
          message: "Membuat Group Parent",
        });
        gpid = await resolveCreatedResource(
          "gp",
          gpDraft.name,
          getApiUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT),
          {
            gp_name: normalizeEntityName(gpDraft.name),
            ...(nbid ? { nbid } : {}),
            ...buildCreditPolicyPayload(creditSource || undefined),
          },
          nbid,
        );
        current = updateCheckpoint(current, {
          gpid,
          completedStages: [
            ...new Set([...current.completedStages, "gp" as const]),
          ],
        });
        addLog({
          stage: "gp",
          status: "success",
          message: `Group Parent resolved (ID ${gpid})`,
        });
      } else {
        addLog({
          stage: "gp",
          status: "success",
          message: `Group Parent existing/checkpoint (ID ${gpid})`,
        });
      }
      if (!gpid) throw new Error("ID Group Parent tidak valid");

      let gcid = gcDraft.mode === "existing" ? gcDraft.id : current.gcid;
      if (gcDraft.mode === "create" && !gcid) {
        activeStage = "gc";
        setCommitStage(activeStage);
        addLog({
          stage: "gc",
          status: "started",
          message: "Membuat Group Customer",
        });
        gcid = await resolveCreatedResource(
          "gc",
          gcDraft.name,
          getApiUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER),
          buildGroupCustomerPayload(gpid, gcDraft.name),
          gpid,
        );
        current = updateCheckpoint(current, {
          gcid,
          completedStages: [
            ...new Set([...current.completedStages, "gc" as const]),
          ],
        });
        addLog({
          stage: "gc",
          status: "success",
          message: `Group Customer resolved (ID ${gcid})`,
        });
      } else {
        addLog({
          stage: "gc",
          status: "success",
          message: `Group Customer existing/checkpoint (ID ${gcid})`,
        });
      }
      if (!gcid) throw new Error("ID Group Customer tidak valid");

      activeStage = "bc";
      setCommitStage(activeStage);
      const bcid = undefined;
      const resolvedBcName = `${normalizeEntityName(gcDraft.name)} - ${branchCode}`;
      current = updateCheckpoint(current, {
        completedStages: [
          ...new Set([...current.completedStages, "bc" as const]),
        ],
      });
      addLog({
        stage: "bc",
        status: "success",
        message: `Branch Customer “${resolvedBcName}” akan dibuat/di-resolve oleh Saga`,
      });

      activeStage = "register";
      setCommitStage(activeStage);
      if (!current.completedStages.includes("register")) {
        addLog({
          stage: "register",
          status: "started",
          message: "Mengirim approval Customer Register",
        });
        try {
          await requestJson(
            "Submit Customer Register",
            getQueryUrl(
              `${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`,
              { fields: ["*"] },
            ),
            "PUT",
            buildCustomerRegisterApprovePayload({ nbid, gpid, gcid, bcid }),
          );
        } catch (caught) {
          const requestError = caught instanceof RequestError ? caught : null;
          if (!requestError?.outcomeUnknown) throw caught;
          const verify = await requestJson(
            "Memeriksa hasil submit",
            getQueryUrl(
              `${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`,
              { fields: ["id", "status", "docstatus"] },
            ),
            "GET",
          ).catch(() => null);
          const row =
            verify && typeof verify === "object" && "data" in verify
              ? verify.data
              : null;
          const submitted =
            row &&
            typeof row === "object" &&
            Number("docstatus" in row ? row.docstatus : 0) === 1;
          if (!submitted) throw requestError;
        }
        current = updateCheckpoint(current, {
          completedStages: [
            ...new Set([...current.completedStages, "register" as const]),
          ],
          status: "submitted",
        });
      }
      addLog({
        stage: "register",
        status: "submitted",
        message: "Customer Register Submitted; sinkronisasi Saga berjalan",
      });
      setCommitStage("completed");
      persistCheckpoint(null);
      window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
      window.dispatchEvent(new Event("ekatalog:gp_update"));
      window.dispatchEvent(new Event("ekatalog:gc_update"));
      window.dispatchEvent(new Event("ekatalog:bc_update"));
      onSuccess(
        `Approval registrasi "${registration.company.name}" berhasil dikirim — sinkronisasi berjalan.`,
      );
    } catch (caught) {
      const requestError = caught instanceof RequestError ? caught : null;
      const unknown = Boolean(requestError?.outcomeUnknown);
      const stage = activeStage;
      if (!unknown && current.completedStages.length === 0) {
        persistCheckpoint(null);
      } else {
        current = updateCheckpoint(current, {
          status: unknown ? "unknown" : "failed",
          ...(unknown &&
          (stage === "nb" ||
            stage === "gp" ||
            stage === "gc" ||
            stage === "register")
            ? { unknownStage: stage }
            : {}),
        });
      }
      setCommitStage(unknown ? "unknown" : "failed");
      addLog({
        stage,
        status: unknown ? "unknown" : "failed",
        message: caught instanceof Error ? caught.message : "Approval gagal",
      });
      setError(
        unknown
          ? `${caught instanceof Error ? caught.message : "Hasil request tidak diketahui"}. Periksa status; retry otomatis diblokir sampai outcome dapat diverifikasi.`
          : caught instanceof Error
            ? caught.message
            : "Approval gagal",
      );
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  const checkUnknownOutcome = async () => {
    if (
      !registration ||
      !draft ||
      !checkpoint?.unknownStage ||
      inFlightRef.current
    )
      return;
    inFlightRef.current = true;
    setIsSubmitting(true);
    setError(null);
    const stage = checkpoint.unknownStage;
    try {
      if (stage === "register") {
        const response = await requestJson(
          "Memeriksa status submit",
          getQueryUrl(
            `${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`,
            {
              fields: ["id", "status", "docstatus"],
            },
          ),
          "GET",
        );
        const row =
          response && typeof response === "object" && "data" in response
            ? response.data
            : null;
        const submitted =
          row &&
          typeof row === "object" &&
          Number("docstatus" in row ? row.docstatus : 0) === 1;
        if (!submitted) {
          throw new Error(
            "Server belum menunjukkan status Submitted. Jangan mengulang PUT sebelum status dipastikan manual.",
          );
        }
        addLog({
          stage: "register",
          status: "submitted",
          message:
            "Submit terverifikasi dari status server; sinkronisasi berjalan",
        });
        setCommitStage("completed");
        persistCheckpoint(null);
        window.dispatchEvent(
          new Event("ekatalog:customer_registrations_update"),
        );
        onSuccess(
          `Approval registrasi "${registration.company.name}" terverifikasi Submitted — sinkronisasi berjalan.`,
        );
        return;
      }

      const entityDraft =
        stage === "nb" ? draft.nb : stage === "gp" ? draft.gp : draft.gc;
      if (!entityDraft || entityDraft.mode !== "create")
        throw new Error(
          "Draft master tidak lagi cocok dengan operasi yang hasilnya unknown",
        );
      const parentId =
        stage === "gp"
          ? draft.nb.mode === "existing"
            ? draft.nb.id
            : checkpoint.nbid
          : stage === "gc"
            ? draft.gp?.mode === "existing"
              ? draft.gp.id
              : checkpoint.gpid
            : undefined;
      const verifiedId = await verifyCreated(stage, entityDraft.name, parentId);
      if (!verifiedId)
        throw new Error(
          "Master belum dapat diverifikasi secara unik. Periksa master secara manual sebelum melanjutkan.",
        );
      const idPatch =
        stage === "nb"
          ? { nbid: verifiedId }
          : stage === "gp"
            ? { gpid: verifiedId }
            : { gcid: verifiedId };
      updateCheckpoint(checkpoint, {
        ...idPatch,
        completedStages: [...new Set([...checkpoint.completedStages, stage])],
        status: "failed",
        unknownStage: undefined,
      });
      addLog({
        stage,
        status: "success",
        message: `${stage.toUpperCase()} terverifikasi (ID ${verifiedId}); proses aman untuk dilanjutkan`,
      });
      setCommitStage("failed");
      setWarning(
        "Outcome sudah terverifikasi. Klik Coba Lanjutkan untuk meneruskan dari tahap berikutnya.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Status belum dapat diverifikasi",
      );
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (!registration || !draft) return null;

  const automaticBcName =
    draft.gc?.name && branchCode
      ? `${normalizeEntityName(draft.gc.name)} - ${branchCode}`
      : "Menunggu Group Customer dan kode Branch";

  const summaryItems = [
    {
      label: "National Brand",
      value: draft.nb.mode === "none" ? "Tanpa National Brand" : draft.nb.name,
      badge:
        draft.nb.mode === "none"
          ? "Tanpa NB"
          : draft.nb.mode === "create"
            ? "Akan Dibuat"
            : "Existing",
    },
    {
      label: "Group Parent",
      value: draft.gp?.name || "Belum dipilih",
      badge:
        draft.gp?.mode === "create"
          ? "Akan Dibuat"
          : draft.gp
            ? "Existing"
            : "Wajib",
    },
    {
      label: "Group Customer",
      value: draft.gc?.name || "Belum dipilih",
      badge:
        draft.gc?.mode === "create"
          ? "Akan Dibuat"
          : draft.gc
            ? "Existing"
            : "Wajib",
    },
    { label: "Branch Customer", value: automaticBcName, badge: "Otomatis" },
  ];
  const newMasterCount = [draft.nb, draft.gp, draft.gc].filter(
    (item) => item?.mode === "create",
  ).length;

  const selectedCard = (
    selection: NationalBrandDraft | RequiredMasterDraft | null,
    onChange: () => void,
  ) => {
    if (!selection) return null;
    const none = selection.mode === "none";
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {none ? "Tanpa National Brand" : selection.name}
            </p>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-rose-800 ring-1 ring-rose-200">
              {none
                ? "Tanpa NB"
                : selection.mode === "create"
                  ? "Akan Dibuat"
                  : "Existing"}
            </span>
          </div>
        </div>
        {!none && (
          <button
            type="button"
            disabled={isDraftLocked || isSubmitting}
            onClick={onChange}
            className="shrink-0 text-xs font-semibold text-rose-800 hover:underline disabled:opacity-50"
          >
            Reset
          </button>
        )}
      </div>
    );
  };

  const createPanel = (entity: EntityKey, label: string) =>
    createEditor === entity && (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <label
          htmlFor={`create-${entity}`}
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Nama {label}
        </label>
        <input
          id={`create-${entity}`}
          autoFocus
          value={createName}
          onChange={(event) => setCreateName(event.target.value.toUpperCase())}
          onBlur={() => setCreateName((value) => normalizeEntityName(value))}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-200"
        />
        {exactDuplicate && (
          <p role="alert" className="mt-2 text-xs font-semibold text-red-700">
            Nama identik ditemukan. Pilih master existing untuk mencegah
            duplikasi.
          </p>
        )}
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setCreateEditor(null)}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-white"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!normalizeEntityName(createName) || exactDuplicate}
            onClick={useCreateName}
            className="rounded-lg bg-amber-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Gunakan Nama Ini
          </button>
        </div>
        <p className="mt-2 text-xs text-amber-800">
          Disimpan sebagai draft lokal. Belum ada POST.
        </p>
      </div>
    );

  const searchState = (
    key: EntityKey,
    rowsLength: number,
    retry: () => void,
  ) => {
    if (loading[key])
      return <p className="px-3 py-4 text-sm text-gray-500">Mencari...</p>;
    if (loadErrors[key])
      return (
        <div className="px-3 py-4 text-sm text-red-700">
          <p>Pencarian gagal. Hasil kosong tidak dapat diasumsikan.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-2 font-semibold underline"
          >
            Coba lagi
          </button>
        </div>
      );
    if (!rowsLength)
      return (
        <p className="px-3 py-4 text-sm text-gray-500">Tidak ditemukan.</p>
      );
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-0 sm:p-4"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            !isSubmitting &&
            setShowCloseConfirm(true)
          }
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="approve-registration-title"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex h-full max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden bg-gray-50 shadow-2xl sm:h-auto sm:max-h-[94vh] sm:rounded-2xl"
          >
            <header
              className="flex items-start gap-3 px-5 py-4 text-white sm:px-6"
              style={{
                background: `linear-gradient(135deg, ${MAROON}, #991b1b)`,
              }}
            >
              <FaCheckCircle className="mt-1 h-6 w-6 shrink-0" />
              <div className="min-w-0 flex-1">
                <h2
                  id="approve-registration-title"
                  className="text-lg font-bold sm:text-xl"
                >
                  Approve Customer
                </h2>
                <p className="truncate text-sm text-rose-100">
                  {registration.company.name} •{" "}
                  {registration.company.branch_name}
                </p>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize">
                {registration.status}
              </span>
              <button
                type="button"
                aria-label="Tutup"
                disabled={isSubmitting}
                onClick={() => setShowCloseConfirm(true)}
                className="rounded-lg p-2 hover:bg-white/10 disabled:opacity-40"
              >
                <FaTimes />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-5 p-4 pb-28 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-6 lg:pb-8">
                <main className="space-y-3">
                  {demoMode && (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      Mode demo aktif—tidak ada request POST/PUT aktual.
                    </div>
                  )}
                  <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                      <span className="flex items-center gap-2">
                        <FaBuilding className="text-rose-800" />
                        {registration.company.business_type}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-rose-800" />
                        {registration.address.city_name}
                      </span>
                      <span className="font-mono text-xs text-gray-500">
                        {registration.registration_number ||
                          `ID ${registration.id}`}
                      </span>
                    </div>
                  </div>

                  {isPreparing ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                      Menyiapkan data approval...
                    </div>
                  ) : (
                    <>
                      <section
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                        aria-labelledby="section-nb"
                      >
                        <button
                          type="button"
                          aria-expanded={expandedSections.nb}
                          onClick={() => toggleSection("nb")}
                          className="flex w-full items-center justify-between gap-4 text-left"
                        >
                          <div>
                            <h3
                              id="section-nb"
                              className="font-bold text-gray-900"
                            >
                              National Brand{" "}
                              <span className="font-normal text-gray-500">
                                (opsional)
                              </span>
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {draft.nb.mode === "none"
                                ? "Tanpa National Brand"
                                : draft.nb.name}
                            </p>
                          </div>
                          {expandedSections.nb ? (
                            <FaChevronUp className="shrink-0 text-gray-400" />
                          ) : (
                            <FaChevronDown className="shrink-0 text-gray-400" />
                          )}
                        </button>
                        {expandedSections.nb && (
                          <>
                            <div className="mt-2">
                              {selectedCard(draft.nb, () => {
                                replaceDraft((current) => ({
                                  ...current,
                                  nb: { mode: "none" },
                                  gp: null,
                                  gc: null,
                                  bc: {
                                    mode: "saga_resolve",
                                    branchId: registration.company.branch_id,
                                  },
                                }));
                                setQueries((current) => ({
                                  ...current,
                                  nb: "",
                                }));
                              })}
                            </div>
                            <div className="mt-3 space-y-3">
                              <div className="relative">
                                <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                                <label htmlFor="search-nb" className="sr-only">
                                  Cari National Brand
                                </label>
                                <input
                                  id="search-nb"
                                  value={queries.nb}
                                  onChange={(event) =>
                                    setQueries((current) => ({
                                      ...current,
                                      nb: event.target.value,
                                    }))
                                  }
                                  placeholder="Cari nama atau kode National Brand..."
                                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-200"
                                />
                              </div>
                              <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200">
                                {searchState(
                                  "nb",
                                  filteredNb.length,
                                  () => void loadNationalBrands(queries.nb),
                                ) ||
                                  filteredNb.map((row) => (
                                    <button
                                      key={row.id}
                                      type="button"
                                      onClick={() =>
                                        selectNationalBrand({
                                          mode: "existing",
                                          id: row.id,
                                          name:
                                            row.nb_name ||
                                            row.name ||
                                            `NB${row.id}`,
                                          code: row.name || undefined,
                                        })
                                      }
                                      className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left last:border-0 hover:bg-rose-50"
                                    >
                                      <span>
                                        <span className="block text-sm font-medium text-gray-900">
                                          {row.nb_name || "-"}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {row.name || `ID ${row.id}`}
                                        </span>
                                      </span>
                                      <FaCheck
                                        className={
                                          draft.nb.mode === "existing" &&
                                          draft.nb.id === row.id
                                            ? "text-rose-800"
                                            : "text-transparent"
                                        }
                                      />
                                    </button>
                                  ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  disabled={
                                    Boolean(loadErrors.nb) || isDraftLocked
                                  }
                                  onClick={() => openCreate("nb")}
                                  className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-50 disabled:opacity-50"
                                >
                                  <FaPlus className="mr-2 inline" />
                                  Buat National Brand Baru
                                </button>
                                <button
                                  type="button"
                                  disabled={isDraftLocked}
                                  onClick={() =>
                                    selectNationalBrand({ mode: "none" })
                                  }
                                  className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                >
                                  Tanpa National Brand
                                </button>
                              </div>
                              {createPanel("nb", "National Brand")}
                            </div>
                          </>
                        )}
                      </section>

                      <section
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                        aria-labelledby="section-gp"
                      >
                        <button
                          type="button"
                          aria-expanded={expandedSections.gp}
                          onClick={() => toggleSection("gp")}
                          className="flex w-full items-center justify-between gap-4 text-left"
                        >
                          <div>
                            <h3
                              id="section-gp"
                              className="font-bold text-gray-900"
                            >
                              Group Parent{" "}
                              <span className="text-red-600">*</span>
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {draft.gp?.name ||
                                "Belum dipilih — klik untuk memilih"}
                            </p>
                          </div>
                          {expandedSections.gp ? (
                            <FaChevronUp className="shrink-0 text-gray-400" />
                          ) : (
                            <FaChevronDown className="shrink-0 text-gray-400" />
                          )}
                        </button>
                        {expandedSections.gp && (
                          <>
                            <div className="mt-2">
                              {selectedCard(draft.gp, () => {
                                replaceDraft((current) => ({
                                  ...current,
                                  gp: null,
                                  gc: null,
                                  bc: {
                                    mode: "saga_resolve",
                                    branchId: registration.company.branch_id,
                                  },
                                }));
                                setQueries((current) => ({
                                  ...current,
                                  gp: "",
                                }));
                              })}
                            </div>
                            {draft.nb.mode === "create" ? (
                              <div className="mt-3 rounded-xl bg-gray-100 p-3 text-sm text-gray-600">
                                NB masih berupa draft baru, sehingga GP existing
                                tidak dapat memiliki relasi ke NB ini. Buat GP
                                baru.
                              </div>
                            ) : (
                              <div className="mt-3 space-y-3">
                                <div className="relative">
                                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                                  <label
                                    htmlFor="search-gp"
                                    className="sr-only"
                                  >
                                    Cari Group Parent
                                  </label>
                                  <input
                                    id="search-gp"
                                    value={queries.gp}
                                    onChange={(event) =>
                                      setQueries((current) => ({
                                        ...current,
                                        gp: event.target.value,
                                      }))
                                    }
                                    placeholder="Cari nama atau kode Group Parent..."
                                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-200"
                                  />
                                </div>
                                <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200">
                                  {searchState(
                                    "gp",
                                    filteredGp.length,
                                    () =>
                                      void loadGroupParents(
                                        selectedExistingNbid,
                                        queries.gp,
                                      ),
                                  ) ||
                                    filteredGp.map((row) => (
                                      <button
                                        key={row.id}
                                        type="button"
                                        onClick={() =>
                                          selectGroupParent({
                                            mode: "existing",
                                            id: row.id,
                                            name:
                                              row.gp_name ||
                                              row.name ||
                                              `GP${row.id}`,
                                            code: row.name || undefined,
                                          })
                                        }
                                        className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left last:border-0 hover:bg-rose-50"
                                      >
                                        <span>
                                          <span className="block text-sm font-medium text-gray-900">
                                            {row.gp_name || "-"}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {row.name || `ID ${row.id}`} • NB ID{" "}
                                            {row.nbid || "-"}
                                          </span>
                                        </span>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                            <button
                              type="button"
                              disabled={Boolean(loadErrors.gp) || isDraftLocked}
                              onClick={() => openCreate("gp")}
                              className="mt-3 rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-50 disabled:opacity-50"
                            >
                              <FaPlus className="mr-2 inline" />
                              Buat Group Parent Baru
                            </button>
                            <div className="mt-3">
                              {createPanel("gp", "Group Parent")}
                            </div>
                          </>
                        )}
                      </section>

                      <section
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                        aria-labelledby="section-gc"
                      >
                        <button
                          type="button"
                          aria-expanded={expandedSections.gc}
                          onClick={() => toggleSection("gc")}
                          className="flex w-full items-center justify-between gap-4 text-left"
                        >
                          <div>
                            <h3
                              id="section-gc"
                              className="font-bold text-gray-900"
                            >
                              Group Customer{" "}
                              <span className="text-red-600">*</span>
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {draft.gc?.name ||
                                "Belum dipilih — klik untuk memilih"}
                            </p>
                          </div>
                          {expandedSections.gc ? (
                            <FaChevronUp className="shrink-0 text-gray-400" />
                          ) : (
                            <FaChevronDown className="shrink-0 text-gray-400" />
                          )}
                        </button>
                        {expandedSections.gc && (
                          <>
                            <div className="mt-2">
                              {selectedCard(draft.gc, () => {
                                replaceDraft((current) => ({
                                  ...current,
                                  gc: null,
                                  bc: {
                                    mode: "saga_resolve",
                                    branchId: registration.company.branch_id,
                                  },
                                }));
                                setQueries((current) => ({
                                  ...current,
                                  gc: "",
                                }));
                              })}
                            </div>
                            {!draft.gp ? (
                              <div className="mt-3 rounded-xl bg-gray-100 p-3 text-sm text-gray-600">
                                Pilih atau buat Group Parent terlebih dahulu.
                              </div>
                            ) : draft.gp.mode === "create" ? (
                              <div className="mt-3 rounded-xl bg-gray-100 p-3 text-sm text-gray-600">
                                GP masih berupa draft baru. Group Customer harus
                                dibuat baru.
                              </div>
                            ) : (
                              <div className="mt-3 space-y-3">
                                <div className="relative">
                                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                                  <label
                                    htmlFor="search-gc"
                                    className="sr-only"
                                  >
                                    Cari Group Customer
                                  </label>
                                  <input
                                    id="search-gc"
                                    value={queries.gc}
                                    onChange={(event) =>
                                      setQueries((current) => ({
                                        ...current,
                                        gc: event.target.value,
                                      }))
                                    }
                                    placeholder="Cari nama atau kode Group Customer..."
                                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-rose-700 focus:ring-2 focus:ring-rose-200"
                                  />
                                </div>
                                <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200">
                                  {searchState(
                                    "gc",
                                    filteredGc.length,
                                    () =>
                                      draft.gp?.mode === "existing" &&
                                      void loadGroupCustomers(
                                        draft.gp.id,
                                        queries.gc,
                                      ),
                                  ) ||
                                    filteredGc.map((row) => (
                                      <button
                                        key={row.id}
                                        type="button"
                                        onClick={() =>
                                          selectGroupCustomer({
                                            mode: "existing",
                                            id: row.id,
                                            name:
                                              row.gc_name ||
                                              row.name ||
                                              `GC${row.id}`,
                                            code: row.name || undefined,
                                          })
                                        }
                                        className="flex w-full items-center justify-between border-b border-gray-100 px-3 py-2 text-left last:border-0 hover:bg-rose-50"
                                      >
                                        <span>
                                          <span className="block text-sm font-medium text-gray-900">
                                            {row.gc_name || "-"}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {row.name || `ID ${row.id}`} • GP ID{" "}
                                            {row.gpid}
                                          </span>
                                        </span>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            )}
                            <button
                              type="button"
                              disabled={
                                !draft.gp ||
                                Boolean(loadErrors.gc) ||
                                isDraftLocked
                              }
                              onClick={() => openCreate("gc")}
                              className="mt-3 rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-50 disabled:opacity-50"
                            >
                              <FaPlus className="mr-2 inline" />
                              Buat Group Customer Baru
                            </button>
                            <div className="mt-3">
                              {createPanel("gc", "Group Customer")}
                            </div>
                          </>
                        )}
                      </section>

                      <section
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                        aria-labelledby="section-bc"
                      >
                        <div className="mb-3">
                          <h3
                            id="section-bc"
                            className="font-bold text-gray-900"
                          >
                            Branch Customer
                          </h3>
                          <p className="text-xs text-gray-500">
                            Nama dibentuk otomatis dari nama Group Customer dan
                            kode Branch. Tidak ada pencarian atau pembuatan BC
                            dari modal.
                          </p>
                        </div>
                        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-violet-700">
                            Nama Branch Customer otomatis
                          </p>
                          <p className="mt-1 text-base font-semibold text-violet-950">
                            {automaticBcName}
                          </p>
                          <div className="mt-3 grid gap-2 text-xs text-violet-800 sm:grid-cols-2">
                            <p>
                              GC:{" "}
                              <span className="font-semibold">
                                {draft.gc?.name || "Belum dipilih"}
                              </span>
                            </p>
                            <p>
                              Prefix Branch:{" "}
                              <span className="font-semibold">
                                {branchCode || "Belum tersedia"}
                              </span>
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-gray-500">
                          BC akan dibuat atau di-resolve oleh proses
                          sinkronisasi/Saga setelah approval dikirim.
                        </p>
                      </section>
                    </>
                  )}

                  {(error || warning) && (
                    <div
                      role="alert"
                      className={`rounded-xl border p-4 text-sm ${error ? "border-red-300 bg-red-50 text-red-800" : "border-amber-300 bg-amber-50 text-amber-900"}`}
                    >
                      <div className="flex gap-2">
                        <FaExclamationTriangle className="mt-0.5 shrink-0" />
                        <p>{error || warning}</p>
                      </div>
                    </div>
                  )}
                  {operationLogs.length > 0 && (
                    <section className="rounded-xl border border-gray-200 bg-white p-4">
                      <h3 className="mb-3 font-bold text-gray-900">
                        Progres Commit
                      </h3>
                      <div className="space-y-2">
                        {operationLogs.map((log) => (
                          <div
                            key={log.stage}
                            className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-semibold uppercase text-gray-800">
                                {log.stage}
                              </p>
                              <p className="text-xs text-gray-600">
                                {log.message}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${log.status === "failed" || log.status === "unknown" ? "bg-red-100 text-red-800" : log.status === "submitted" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}
                            >
                              {statusLabel[log.status]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </main>

                <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-0">
                  <h3 className="font-bold text-gray-900">
                    Ringkasan Approval
                  </h3>
                  <div className="mt-4 space-y-3">
                    {summaryItems.map((item) => (
                      <div
                        key={item.label}
                        className="border-b border-gray-100 pb-3 last:border-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {item.label}
                          </p>
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                            {item.badge}
                          </span>
                        </div>
                        <p className="mt-1 break-words text-sm font-medium text-gray-900">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    {newMasterCount > 0 ? (
                      <>
                        <strong>{newMasterCount}</strong> master NB/GP/GC akan
                        dibuat saat Commit
                      </>
                    ) : (
                      "Tidak ada master NB/GP/GC baru yang akan dibuat"
                    )}
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Submit menghasilkan docstatus=1 dan status=Syncing. Sukses
                    Saga dipantau terpisah.
                  </p>
                </aside>
              </div>
            </div>

            <footer className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] sm:px-6">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowCloseConfirm(true)}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                Batal
              </button>
              <div className="text-right">
                {commitStage === "unknown" ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => void checkUnknownOutcome()}
                    className="rounded-xl bg-amber-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-800 disabled:opacity-40"
                  >
                    {isSubmitting ? "Memeriksa..." : "Periksa Status"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={
                      Boolean(validationError) || isPreparing || isSubmitting
                    }
                    onClick={() => setShowConfirm(true)}
                    className="rounded-xl bg-rose-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting
                      ? "Memproses..."
                      : checkpoint?.completedStages.length
                        ? "Coba Lanjutkan"
                        : "Commit Approve"}
                  </button>
                )}
                {validationError && (
                  <p className="mt-1 hidden text-xs text-red-600 sm:block">
                    {validationError}
                  </p>
                )}
              </div>
            </footer>

            {showConfirm && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 p-4">
                <div
                  role="alertdialog"
                  aria-modal="true"
                  className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
                >
                  <h3 className="text-lg font-bold text-gray-900">
                    Konfirmasi Commit Approval
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Master baru: {newMasterCount}. Setelah dimulai, draft
                    dikunci dan pembuatan berjalan berurutan NB → GP → GC →
                    Customer Register.
                  </p>
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirm(false)}
                      className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      Kembali Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void submitApproval()}
                      className="rounded-lg bg-rose-900 px-4 py-2 text-sm font-bold text-white"
                    >
                      Ya, Commit Approve
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showCloseConfirm && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-4">
                <div
                  role="alertdialog"
                  aria-modal="true"
                  className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
                >
                  <h3 className="font-bold text-gray-900">Tutup approval?</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Draft yang belum di-commit tidak membuat master. Checkpoint
                    operasi yang sudah berhasil tetap disimpan untuk retry aman.
                  </p>
                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCloseConfirm(false)}
                      className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      Kembali
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCloseConfirm(false);
                        onClose();
                      }}
                      className="rounded-lg bg-rose-900 px-4 py-2 text-sm font-bold text-white"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
