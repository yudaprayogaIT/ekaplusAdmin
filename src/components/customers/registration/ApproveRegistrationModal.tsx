"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
  FaListUl,
  FaSearch,
  FaPlusCircle,
  FaUser,
} from "react-icons/fa";
import type {
  ApprovalOperationLog,
  ApprovalResult,
  CustomerRegistration,
} from "@/types/customerRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getApiUrl, getQueryUrl } from "@/config/api";

interface ApproveRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: (message: string) => void;
}

interface CustomerRegisterAddressApiResponse {
  id: number;
  parent_id: number;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  postal_code?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nbid?: number | null;
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

interface GroupCustomerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gpid?: number | null;
}

interface BranchCustomerRow {
  id: number;
  name?: string | null;
  bcid_name?: string | null;
  gcid?: number | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
  "branch.branch_name"?: string | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
}

type Step = 1 | 2 | 3 | 4 | 5;

// "idle"   = nothing shown yet (initial state)
// "search" = user is searching (show results only when query exists)
// "create" = user wants to create new (show create form)
type PanelMode = "idle" | "search" | "create";

function normalizePhone(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits || undefined;
}

function normalizeDate(value?: string): string | undefined {
  if (!value || value === "-") return undefined;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return value.split("T")[0];
}

function normalizeEntityName(value?: string): string {
  if (!value) return "";
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function toUpperInput(value?: string): string {
  return (value || "").toUpperCase();
}

function extractUserIdFromDisplay(value?: string): number {
  if (!value) return 0;
  const m = value.match(/(\d+)\s*$/);
  if (!m) return 0;
  const parsed = Number.parseInt(m[1], 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function extractIdFromResourceResponse(json: unknown): number | undefined {
  if (
    json &&
    typeof json === "object" &&
    "data" in json &&
    json.data &&
    typeof json.data === "object" &&
    "id" in json.data
  ) {
    const raw = (json.data as { id?: unknown }).id;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") {
      const parsed = Number.parseInt(raw, 10);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

export function ApproveRegistrationModal({
  isOpen,
  onClose,
  registration,
  onSuccess,
}: ApproveRegistrationModalProps) {
  const { token } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [createNationalBrand, setCreateNationalBrand] = useState(false);
  const [nbName, setNbName] = useState("");
  const [gpName, setGpName] = useState("");
  const [gcName, setGcName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationLogs, setOperationLogs] = useState<ApprovalOperationLog[]>(
    [],
  );
  const [shippingAddresses, setShippingAddresses] = useState<
    CustomerRegisterAddressApiResponse[]
  >([]);
  const [nationalBrands, setNationalBrands] = useState<NationalBrandRow[]>([]);
  const [createdNb, setCreatedNb] = useState<NationalBrandRow | null>(null);
  const [existingGp, setExistingGp] = useState<GroupParentRow | null>(null);
  const [createdGp, setCreatedGp] = useState<GroupParentRow | null>(null);
  const [groupParents, setGroupParents] = useState<GroupParentRow[]>([]);
  const [groupCustomers, setGroupCustomers] = useState<GroupCustomerRow[]>([]);
  const [createdGc, setCreatedGc] = useState<GroupCustomerRow | null>(null);
  const [branchCustomers, setBranchCustomers] = useState<BranchCustomerRow[]>(
    [],
  );
  const [createdBc, setCreatedBc] = useState<BranchCustomerRow | null>(null);

  // --- GP state ---
  const [gpMode, setGpMode] = useState<PanelMode>("idle");
  const [gpSearch, setGpSearch] = useState("");
  const [selectedGpid, setSelectedGpid] = useState<number | null>(null);

  // --- GC state ---
  const [gcMode, setGcMode] = useState<PanelMode>("idle");
  const [gcSearch, setGcSearch] = useState("");
  const [selectedGcid, setSelectedGcid] = useState<number | null>(null);

  // --- BC state ---
  const [bcMode, setBcMode] = useState<PanelMode>("idle");
  const [bcSearch, setBcSearch] = useState("");
  const [selectedBcid, setSelectedBcid] = useState<number | null>(null);
  const [nbSearch, setNbSearch] = useState("");
  const [selectedNbid, setSelectedNbid] = useState<number | null>(null);
  const [createdNbid, setCreatedNbid] = useState<number | null>(null);
  const [createdGpid, setCreatedGpid] = useState<number | null>(null);
  const [createdGcid, setCreatedGcid] = useState<number | null>(null);
  const [createdBcid, setCreatedBcid] = useState<number | null>(null);
  const [gpCreatedViaCreateFlow, setGpCreatedViaCreateFlow] = useState(false);
  const [nbCreatedViaCreateFlow, setNbCreatedViaCreateFlow] = useState(false);

  const existingGpid = registration?.gp_id;
  const existingGcid = registration?.gc_id;
  const existingBcid = registration?.bc_id;
  const existingNbid = registration?.master_links?.nb_id;
  const effectiveNbid = existingNbid || selectedNbid || undefined;
  const effectiveGpid = existingGpid || selectedGpid || undefined;
  const effectiveGcid = existingGcid || selectedGcid || undefined;
  const effectiveBcid = existingBcid || selectedBcid || undefined;
  const isGcCreatedInFlow = Boolean(createdGcid || createdGc);
  const isCreatingNewGpFlow = Boolean(
    gpCreatedViaCreateFlow ||
    (!existingGpid && !selectedGpid && gpMode === "create"),
  );
  const canSearchExistingGc = Boolean(
    !isCreatingNewGpFlow && (existingGpid || selectedGpid),
  );
  const canSearchExistingBc = Boolean(
    !isCreatingNewGpFlow && !isGcCreatedInFlow && (existingGcid || selectedGcid),
  );

  // ---- Filtered lists (only meaningful when mode === "search" and query is non-empty) ----
  const filteredGroupParents = useMemo(() => {
    const q = gpSearch.trim().toLowerCase();
    if (!q) return groupParents.slice(0, 20);
    return groupParents.filter((row) => {
      const label = `${row.gp_name || ""} ${row.name || ""}`.toLowerCase();
      return label.includes(q);
    });
  }, [gpSearch, groupParents]);

  const filteredNationalBrands = useMemo(() => {
    const q = nbSearch.trim().toLowerCase();
    if (!q) return nationalBrands.slice(0, 20);
    return nationalBrands.filter((row) => {
      const label = `${row.nb_name || ""} ${row.name || ""}`.toLowerCase();
      return label.includes(q);
    });
  }, [nbSearch, nationalBrands]);

  const filteredGroupCustomers = useMemo(() => {
    const qGc = gcSearch.trim().toLowerCase();
    const effectiveGpidForFilter = canSearchExistingGc ? effectiveGpid : 0;
    const base = effectiveGpidForFilter
      ? groupCustomers.filter(
          (row) => Number(row.gpid || 0) === Number(effectiveGpidForFilter),
        )
      : groupCustomers;
    if (!qGc) return base.slice(0, 20);
    return base.filter((row) => {
      const label = `${row.gc_name || ""} ${row.name || ""}`.toLowerCase();
      return label.includes(qGc);
    });
  }, [gcSearch, groupCustomers, effectiveGpid, canSearchExistingGc]);

  const filteredBranchCustomers = useMemo(() => {
    const q = bcSearch.trim().toLowerCase();
    const effectiveGcidForFilter = canSearchExistingBc ? effectiveGcid : 0;
    const base = effectiveGcidForFilter
      ? branchCustomers.filter(
          (row) => Number(row.gcid || 0) === Number(effectiveGcidForFilter),
        )
      : branchCustomers;
    if (!q) return base.slice(0, 20);
    return base.filter((row) => {
      const label = `${row.bcid_name || ""} ${row.name || ""}`.toLowerCase();
      return label.includes(q);
    });
  }, [bcSearch, branchCustomers, effectiveGcid, canSearchExistingBc]);

  const effectiveShippingAddresses = useMemo(() => {
    if (!registration) return [] as CustomerRegisterAddressApiResponse[];
    if (registration.same_as_company_address) {
      if (shippingAddresses.length > 0) {
        return shippingAddresses;
      }
      return [
        {
          id: -1,
          parent_id: Number(registration.id),
          label: "Alamat Perusahaan",
          address: registration.address.full_address,
          city: registration.address.city_name,
          province: registration.address.province_name,
          district: registration.address.district_name,
          postal_code: registration.address.postal_code,
          pic_name:
            registration.branch_owner?.full_name || registration.user.full_name,
          pic_phone:
            registration.branch_owner?.phone || registration.user.phone,
          is_default: 1,
        },
      ];
    }
    return shippingAddresses;
  }, [registration, shippingAddresses]);

  const pushLog = useCallback((log: ApprovalOperationLog) => {
    setOperationLogs((prev) => [...prev, log]);
    console.log("[ApproveFlow]", log);
  }, []);

  const apiJsonRequest = useCallback(
    async (
      stage: string,
      url: string,
      method: "GET" | "POST" | "PUT",
      body?: unknown,
    ) => {
      pushLog({
        stage,
        status: "started",
        message: `${method} ${url}`,
        payload: body,
      });

      const res = await apiFetch(
        url,
        {
          method,
          cache: "no-store",
          ...(body ? { body: JSON.stringify(body) } : {}),
        },
        token,
      );

      let json: unknown = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        const serverMessage =
          json &&
          typeof json === "object" &&
          "message" in json &&
          typeof json.message === "string"
            ? json.message
            : "";
        const message = `Failed ${stage} (HTTP ${res.status})${
          serverMessage ? `: ${serverMessage}` : ""
        }`;
        pushLog({
          stage,
          status: "failed",
          message,
          response: json,
          http_status: res.status,
        });
        throw new Error(message);
      }

      pushLog({
        stage,
        status: "success",
        message: `${stage} success`,
        response: json,
        http_status: res.status,
      });
      return json;
    },
    [pushLog, token],
  );

  const refreshReferenceLists = useCallback(async () => {
    if (!token) return;
    const gpSpec = { fields: ["id", "name", "gp_name", "nbid"], limit: 1000000 };
    const nbSpec = { fields: ["id", "name", "nb_name"], limit: 1000000 };
    const gcSpec = { fields: ["id", "name", "gc_name", "gpid"], limit: 1000000 };
    const bcSpec = {
      fields: [
        "id",
        "name",
        "bcid_name",
        "gcid",
        "branch",
        "branch.branch_name",
        "branch_owner",
        "branch_owner_phone",
      ],
      limit: 1000000,
    };

    const [gpListRes, nbListRes, gcListRes, bcListRes] = await Promise.all([
      apiFetch(getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpSpec), { method: "GET", cache: "no-store" }, token),
      apiFetch(getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, nbSpec), { method: "GET", cache: "no-store" }, token),
      apiFetch(getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gcSpec), { method: "GET", cache: "no-store" }, token),
      apiFetch(getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bcSpec), { method: "GET", cache: "no-store" }, token),
    ]);

    const [gpListJson, nbListJson, gcListJson, bcListJson] = await Promise.all([
      gpListRes.json().catch(() => null),
      nbListRes.json().catch(() => null),
      gcListRes.json().catch(() => null),
      bcListRes.json().catch(() => null),
    ]);

    setGroupParents(Array.isArray(gpListJson?.data) ? gpListJson.data : []);
    setNationalBrands(Array.isArray(nbListJson?.data) ? nbListJson.data : []);
    setGroupCustomers(Array.isArray(gcListJson?.data) ? gcListJson.data : []);
    setBranchCustomers(Array.isArray(bcListJson?.data) ? bcListJson.data : []);
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    async function loadPreparationData() {
      if (!isOpen || !registration || !token) return;

      setStep(1);
      setCreateNationalBrand(false);
      setNbName(normalizeEntityName(registration.user.full_name || ""));
      setGpName(
        normalizeEntityName(
          `${registration.user.full_name || registration.company.name} GP`,
        ),
      );
      setGcName(normalizeEntityName(registration.company.name || ""));
      setIsSubmitting(false);
      setError(null);
      setOperationLogs([]);
      setNationalBrands([]);
      setExistingGp(null);
      setCreatedGp(null);
      setCreatedNb(null);
      setCreatedGc(null);
      setCreatedBc(null);
      setGroupParents([]);
      setGroupCustomers([]);
      setBranchCustomers([]);
      setNbSearch("");
      setSelectedNbid(existingNbid || null);
      setCreatedNbid(null);
      setCreatedGpid(null);
      setCreatedGcid(null);
      setCreatedBcid(null);
      setCreatedNb(null);
      setCreatedGc(null);
      setCreatedBc(null);
      setGpCreatedViaCreateFlow(false);
      setNbCreatedViaCreateFlow(false);

      // Reset all modes & searches
      setGpMode("search");
      setGpSearch("");
      setSelectedGpid(null);
      setGcMode("idle");
      setGcSearch("");
      setSelectedGcid(null);
      setBcMode("idle");
      setBcSearch("");
      setSelectedBcid(null);

      setIsPreparing(true);

      try {
        const regId = Number(registration.id);
        const shippingSpec = {
          fields: ["*"],
          filters: [
            ["parent_id", "=", regId],
            ["parent_type", "=", "customer_register"],
          ],
        };
        const shippingRes = await apiFetch(
          getQueryUrl(
            API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS,
            shippingSpec,
          ),
          { method: "GET", cache: "no-store" },
          token,
        );
        const shippingJson = await shippingRes.json().catch(() => null);
        await refreshReferenceLists();

        if (!cancelled) {
          setShippingAddresses(
            Array.isArray(shippingJson?.data) ? shippingJson.data : [],
          );
        }

        if (registration.gp_id) {
          const gpRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
              fields: ["*"],
              filters: [["id", "=", registration.gp_id]],
              limit: 1,
            }),
            { method: "GET", cache: "no-store" },
            token,
          );
          const gpJson = await gpRes.json();
          const gpRow = Array.isArray(gpJson?.data) ? gpJson.data[0] : null;
          if (!cancelled && gpRow) setExistingGp(gpRow);
        } else if (!cancelled) {
          setExistingGp(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mempersiapkan data approval",
          );
        }
      } finally {
        if (!cancelled) setIsPreparing(false);
      }
    }

    loadPreparationData();
    return () => {
      cancelled = true;
    };
  }, [isOpen, registration, token, existingNbid, refreshReferenceLists]);

  useEffect(() => {
    if (!isOpen || !token || isPreparing) return;
    void refreshReferenceLists();
  }, [isOpen, token, step, isPreparing, refreshReferenceLists]);

  useEffect(() => {
    if (!selectedGpid) return;
    const selectedGc = groupCustomers.find(
      (row) => Number(row.id) === Number(selectedGcid),
    );
    if (selectedGc && Number(selectedGc.gpid || 0) !== Number(selectedGpid)) {
      setSelectedGcid(null);
    }
  }, [selectedGpid, selectedGcid, groupCustomers]);

  useEffect(() => {
    if (!selectedBcid) return;
    const effectiveGcid = selectedGcid || existingGcid;
    const selectedBc = branchCustomers.find(
      (row) => Number(row.id) === Number(selectedBcid),
    );
    if (
      selectedBc &&
      effectiveGcid &&
      Number(selectedBc.gcid || 0) !== Number(effectiveGcid)
    ) {
      setSelectedBcid(null);
    }
  }, [selectedBcid, selectedGcid, existingGcid, branchCustomers]);

  useEffect(() => {
    if (step !== 3 || existingGcid) return;
    if (!selectedGcid && canSearchExistingGc) {
      setGcMode("search");
      return;
    }
    if (!canSearchExistingGc) {
      setGcMode("create");
      setSelectedGcid(null);
    }
  }, [step, existingGcid, canSearchExistingGc, selectedGcid]);

  useEffect(() => {
    if (step !== 4 || existingBcid) return;
    if (!canSearchExistingBc) {
      setBcMode("create");
      setSelectedBcid(null);
      setBcSearch("");
    }
  }, [step, existingBcid, canSearchExistingBc]);

  useEffect(() => {
    if (!isCreatingNewGpFlow) return;
    if (step >= 3 && !existingGcid && !selectedGcid) {
      setGcMode("create");
    }
    if (step >= 4 && !existingBcid && !selectedBcid) {
      setBcMode("create");
    }
  }, [
    isCreatingNewGpFlow,
    step,
    existingGcid,
    selectedGcid,
    existingBcid,
    selectedBcid,
  ]);

  const buildGroupCustomerPayload = useCallback(
    (gpid: number) => {
      if (!registration) return null;
      return {
        gc_name: normalizeEntityName(gcName),
        gpid,
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
    [gcName, registration],
  );

  const buildBranchCustomerPayload = useCallback(
    (gcid: number) => {
      if (!registration) return null;
      const branchOwnerName =
        registration.branch_owner?.full_name || registration.user.full_name;
      const branchOwnerPhone =
        normalizePhone(
          registration.branch_owner?.phone || registration.user.phone,
        ) || undefined;

      const officeAddress = {
        type: "office",
        label: "Office",
        address: registration.address.full_address,
        city: registration.address.city_name,
        district: registration.address.district_name,
        province: registration.address.province_name,
        postal_code: registration.address.postal_code,
      };

      const warehouseAddressesFromShipping = effectiveShippingAddresses.map(
        (addr) => ({
          type: "warehouse",
          label: addr.label || "Warehouse",
          address: addr.address || "",
          city: addr.city || "",
          district: addr.district || "",
          province: addr.province || "",
          postal_code: addr.postal_code || "",
          pic_name: addr.pic_name || undefined,
          pic_phone: normalizePhone(addr.pic_phone || undefined),
          is_default: addr.is_default ? 1 : undefined,
        }),
      );

      const firstShipping = effectiveShippingAddresses[0];
      const warehouseCopyFromOffice = {
        type: "warehouse",
        label: firstShipping?.label || "Warehouse",
        address: registration.address.full_address,
        city: registration.address.city_name,
        district: registration.address.district_name,
        province: registration.address.province_name,
        postal_code: registration.address.postal_code,
        pic_name: firstShipping?.pic_name || branchOwnerName || undefined,
        pic_phone:
          normalizePhone(firstShipping?.pic_phone || undefined) ||
          branchOwnerPhone,
        is_default: 1,
      };

      const customerAddress = registration.same_as_company_address
        ? [officeAddress, warehouseCopyFromOffice]
        : [officeAddress, ...warehouseAddressesFromShipping];

      return {
        gcid,
        branch: registration.company.branch_id,
        product_need: registration.company.product_need,
        branch_owner: branchOwnerName,
        branch_owner_email:
          registration.branch_owner?.email || registration.user.email,
        branch_owner_phone: branchOwnerPhone,
        branch_owner_place_of_birth:
          registration.branch_owner?.place_of_birth ||
          registration.user.place_of_birth,
        branch_owner_date_of_birth: normalizeDate(
          registration.branch_owner?.date_of_birth ||
            registration.user.date_of_birth,
        ),
        customer_register: Number(registration.id),
        customer_address: customerAddress,
      };
    },
    [effectiveShippingAddresses, registration],
  );

  const buildCustomerRegisterApprovePayload = useCallback(
    (ids: ApprovalResult, gpManualName?: string, nbManualName?: string) => {
      const rawApplicantOwnerId = registration?.ekaplus_user?.id;
      const applicantOwnerId =
        typeof rawApplicantOwnerId === "number"
          ? rawApplicantOwnerId
          : Number.parseInt(String(rawApplicantOwnerId || ""), 10);
      const fallbackOwnerId =
        Number(registration?.created_by_id || 0);

      const shippingPayload = effectiveShippingAddresses.map((addr) => ({
        label: addr.label || "Warehouse",
        pic_name: addr.pic_name || undefined,
        pic_phone: normalizePhone(addr.pic_phone || undefined),
        address: addr.address || "",
        city: addr.city || "",
        district: addr.district || "",
        postal_code: addr.postal_code || "",
        province: addr.province || "",
        is_default: addr.is_default ? 1 : undefined,
      }));

      return {
        status: "Approved",
        docstatus: 1,
        owner:
          Number.isFinite(applicantOwnerId) && applicantOwnerId > 0
            ? applicantOwnerId
            : fallbackOwnerId > 0
              ? fallbackOwnerId
              : undefined,
        same_as_company_address: registration?.same_as_company_address ? 1 : 0,
        gpid: ids.gpid,
        gcid: ids.gcid,
        bcid: ids.bcid,
        nbid: ids.nbid ?? null,
        ...(gpManualName ? { gp_manual: gpManualName } : {}),
        ...(nbManualName ? { nb_manual: nbManualName } : {}),
        customer_shipping_address: shippingPayload,
      };
    },
    [
      effectiveShippingAddresses,
      registration?.same_as_company_address,
      registration?.ekaplus_user?.id,
      registration?.created_by_id,
    ],
  );

  const validateCurrentStep = (): string | null => {
    // Step 1: National Brand (optional)
    if (step === 1) {
      if (createNationalBrand && !normalizeEntityName(nbName)) {
        return "Nama National Brand wajib diisi";
      }
    }

    // Step 2: Group Parent
    if (step === 2 && !existingGpid) {
      if (selectedGpid) return null;
      if (gpMode === "create") {
        if (!normalizeEntityName(gpName))
          return "Nama Group Parent wajib diisi";
      } else if (gpMode === "idle" || gpMode === "search") {
        return "Pilih Group Parent yang ada atau klik 'Create New' untuk membuat baru";
      }
    }

    // Step 3: Group Customer
    if (step === 3 && !existingGcid) {
      if (canSearchExistingGc && selectedGcid) return null;
      if (gcMode === "create" || !canSearchExistingGc) {
        if (!normalizeEntityName(gcName)) return "GC Name wajib diisi";
      } else if (gcMode === "idle" || gcMode === "search") {
        return "Pilih Group Customer yang ada atau klik 'Create New' untuk membuat baru";
      }
    }

    // Step 4: Branch Customer
    if (step === 4 && !existingBcid) {
      return null;
    }

    return null;
  };

  const handleNextStep = async () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!registration || !token) {
      setError("Data tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (step === 1) {
        if (createNationalBrand && !effectiveNbid) {
          const nbJson = await apiJsonRequest(
            "creating National Brand",
            getApiUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND),
            "POST",
            { nb_name: normalizeEntityName(nbName) },
          );
          const newNbid = extractIdFromResourceResponse(nbJson);
          if (!newNbid)
            throw new Error("Failed creating National Brand (missing id)");
          setCreatedNbid(newNbid);
          setSelectedNbid(newNbid);
          setNbCreatedViaCreateFlow(true);
          if (
            nbJson &&
            typeof nbJson === "object" &&
            "data" in nbJson &&
            nbJson.data &&
            typeof nbJson.data === "object"
          ) {
            const row = nbJson.data as NationalBrandRow;
            setCreatedNb({
              id: newNbid,
              name: row.name,
              nb_name: row.nb_name,
            });
          }
          setCreateNationalBrand(false);
        }
      } else if (step === 2) {
        if (!effectiveGpid) {
          const gpPayload = {
            gp_name: normalizeEntityName(gpName),
            ...(effectiveNbid ? { nbid: effectiveNbid } : {}),
          };
          const gpJson = await apiJsonRequest(
            "creating Group Parent",
            getApiUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT),
            "POST",
            gpPayload,
          );
          const newGpid = extractIdFromResourceResponse(gpJson);
          if (!newGpid)
            throw new Error("Failed creating Group Parent (missing id)");

          setCreatedGpid(newGpid);
          setSelectedGpid(newGpid);
          setGpCreatedViaCreateFlow(true);

          if (
            gpJson &&
            typeof gpJson === "object" &&
            "data" in gpJson &&
            gpJson.data &&
            typeof gpJson.data === "object"
          ) {
            const row = gpJson.data as GroupParentRow;
            setCreatedGp({
              id: newGpid,
              name: row.name,
              gp_name: row.gp_name,
              nbid: row.nbid,
            });
          }
        }
      } else if (step === 3) {
        if (!effectiveGcid) {
          if (!effectiveGpid) {
            throw new Error(
              "GP belum tersedia. Selesaikan step Group Parent terlebih dahulu.",
            );
          }
          const gcPayload = buildGroupCustomerPayload(effectiveGpid);
          if (!gcPayload) throw new Error("Payload Group Customer tidak valid");

          const gcJson = await apiJsonRequest(
            "creating Group Customer",
            getApiUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER),
            "POST",
            gcPayload,
          );
          const newGcid = extractIdFromResourceResponse(gcJson);
          if (!newGcid)
            throw new Error("Failed creating Group Customer (missing id)");
          setCreatedGcid(newGcid);
          setSelectedGcid(newGcid);
          if (
            gcJson &&
            typeof gcJson === "object" &&
            "data" in gcJson &&
            gcJson.data &&
            typeof gcJson.data === "object"
          ) {
            const row = gcJson.data as GroupCustomerRow;
            setCreatedGc({
              id: newGcid,
              name: row.name,
              gc_name: row.gc_name,
              gpid: row.gpid,
            });
          }
        }
      } else if (step === 4) {
        if (!effectiveGcid) {
          throw new Error(
            "GC belum tersedia. Selesaikan step Group Customer terlebih dahulu.",
          );
        }
        // BC will be created/resolved on final commit (Step 5).
      }

      setStep((prev) => Math.min(5, prev + 1) as Step);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses step");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitApproval = async () => {
    if (!registration || !token) {
      setError("Data tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const nbid = effectiveNbid;
      const gpid = effectiveGpid;
      const gcid = effectiveGcid;
      let bcid = effectiveBcid;

      if (!gpid || !gcid) {
        throw new Error(
          "Relasi GP/GC belum lengkap. Pastikan step sebelumnya sudah selesai.",
        );
      }

      const rawEkaplusUserId = registration.ekaplus_user?.id;
      const ekaplusUserId =
        typeof rawEkaplusUserId === "number"
          ? rawEkaplusUserId
          : Number.parseInt(String(rawEkaplusUserId || ""), 10);
      const createdById =
        typeof registration.created_by_id === "number"
          ? registration.created_by_id
          : extractUserIdFromDisplay(registration.created_by);
      const userId =
        Number.isFinite(ekaplusUserId) && ekaplusUserId > 0
          ? ekaplusUserId
          : createdById;
      if (!Number.isFinite(userId) || userId <= 0) {
        throw new Error("User pengaju tidak tersedia (ekaplus_user/created_by).");
      }

      if (!bcid) {
        const bcPayload = buildBranchCustomerPayload(gcid);
        if (!bcPayload) throw new Error("Payload Branch Customer tidak valid");

        try {
          const bcJson = await apiJsonRequest(
            "creating Branch Customer",
            getApiUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2),
            "POST",
            bcPayload,
          );
          const newBcid = extractIdFromResourceResponse(bcJson);
          if (!newBcid)
            throw new Error("Failed creating Branch Customer (missing id)");
          bcid = newBcid;
          setCreatedBcid(newBcid);
          setSelectedBcid(newBcid);
          if (
            bcJson &&
            typeof bcJson === "object" &&
            "data" in bcJson &&
            bcJson.data &&
            typeof bcJson.data === "object"
          ) {
            const row = bcJson.data as BranchCustomerRow;
            setCreatedBc({
              id: newBcid,
              name: row.name,
              bcid_name: row.bcid_name,
              gcid: row.gcid,
              branch: row.branch,
              "branch.branch_name": row["branch.branch_name"],
              branch_owner: row.branch_owner,
              branch_owner_phone: row.branch_owner_phone,
            });
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message.toLowerCase() : "";
          const isDuplicate =
            msg.includes("unique") ||
            msg.includes("duplicate") ||
            msg.includes("sudah terdaftar");
          if (!isDuplicate) throw err;

          const findSpec = {
            fields: [
              "id",
              "name",
              "bcid_name",
              "gcid",
              "branch",
              "branch.branch_name",
              "branch_owner",
              "branch_owner_phone",
            ],
            filters: [
              ["gcid", "=", gcid],
              ["branch", "=", registration.company.branch_id],
            ],
            limit: 1,
          };
          const findRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, findSpec),
            { method: "GET", cache: "no-store" },
            token,
          );
          const findJson = findRes.ok ? await findRes.json().catch(() => null) : null;
          const row =
            findJson && Array.isArray(findJson.data) ? findJson.data[0] : null;
          const recoveredId =
            row && typeof row.id === "number"
              ? row.id
              : Number.parseInt(String(row?.id || ""), 10);
          if (!Number.isFinite(recoveredId) || recoveredId <= 0) {
            throw err;
          }
          bcid = recoveredId;
          setSelectedBcid(recoveredId);
          setCreatedBcid(recoveredId);
          setCreatedBc({
            id: recoveredId,
            name: row?.name,
            bcid_name: row?.bcid_name,
            gcid: row?.gcid,
            branch: row?.branch,
            "branch.branch_name": row?.["branch.branch_name"],
            branch_owner: row?.branch_owner,
            branch_owner_phone: row?.branch_owner_phone,
          });
          pushLog({
            stage: "creating Branch Customer",
            status: "success",
            message:
              "Duplicate branch_customer terdeteksi, menggunakan BC existing.",
          });
        }
      }

      try {
        await apiJsonRequest(
          "creating member_of owner gpid",
          getApiUrl(API_CONFIG.ENDPOINTS.MEMBER_OF),
          "POST",
          {
            user: userId,
            owner: userId,
            ref_type: "gpid",
            ref_id: gpid,
            is_owner: 1,
          },
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message.toLowerCase() : "";
        if (
          !msg.includes("duplicate") &&
          !msg.includes("unique") &&
          !msg.includes("already") &&
          !msg.includes("terdaftar") &&
          !msg.includes("conflict")
        ) {
          throw err;
        }
        pushLog({
          stage: "creating member_of owner gpid",
          status: "success",
          message: "Duplicate member_of treated as success",
        });
      }

      if (!bcid) {
        throw new Error("BC belum tersedia. Gagal menyelesaikan approve.");
      }
      const finalResult: ApprovalResult = { nbid, gpid, gcid, bcid };
      const updatePayload = buildCustomerRegisterApprovePayload(
        finalResult,
        gpCreatedViaCreateFlow ? normalizeEntityName(gpName) : undefined,
        nbCreatedViaCreateFlow ? normalizeEntityName(nbName) : undefined,
      );
      await apiJsonRequest(
        "updating customer_register approved",
        getQueryUrl(
          `${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`,
          { fields: ["*"] },
        ),
        "PUT",
        updatePayload,
      );

      window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
      window.dispatchEvent(new Event("ekatalog:gp_update"));
      window.dispatchEvent(new Event("ekatalog:gc_update"));
      window.dispatchEvent(new Event("ekatalog:bc_update"));

      const gpCode =
        createdGp?.name ||
        groupParents.find((row) => Number(row.id) === Number(gpid))?.name ||
        `GP${gpid}`;
      const gcCode =
        createdGc?.name ||
        groupCustomers.find((row) => Number(row.id) === Number(gcid))?.name ||
        `GC${gcid}`;
      const bcCode =
        createdBc?.name ||
        branchCustomers.find((row) => Number(row.id) === Number(bcid))?.name ||
        `BC${bcid}`;
      const nbCode =
        (nbid
          ? createdNb?.name ||
            nationalBrands.find((row) => Number(row.id) === Number(nbid))?.name
          : null) || undefined;

      onSuccess(
        `Registrasi "${registration.company.name}" berhasil diapprove.\n\nGROUP PARENT: ${gpCode}\nGROUP CUSTOMER: ${gcCode}\nBRANCH CUSTOMER: ${bcCode}${
          nbCode ? `\nNATIONAL BRAND: ${nbCode}` : ""
        }`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal approve registrasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

  const gpDisplay = createdGp || existingGp;
  const selectedNbRow = nationalBrands.find(
    (nb) => Number(nb.id) === Number(selectedNbid),
  );
  const nbDisplayRow = selectedNbRow || createdNb;
  const selectedGpRow = groupParents.find(
    (gp) => Number(gp.id) === Number(selectedGpid),
  );
  const gpResolvedRow = selectedGpRow || gpDisplay;
  const selectedGcRow = groupCustomers.find(
    (gc) => Number(gc.id) === Number(selectedGcid),
  );
  const gcDisplayRow = selectedGcRow || createdGc;
  const selectedBcRow = branchCustomers.find(
    (bc) => Number(bc.id) === Number(selectedBcid),
  );
  const bcDisplayRow = selectedBcRow || createdBc;
  const previewGcName = (
    selectedGcRow?.gc_name ||
    registration.gc_name ||
    gcName ||
    registration.company.name ||
    "-"
  ).trim();
  const previewBcCity =
    registration.company.branch_city || registration.address.city_name || "-";
  const previewBcName = `${normalizeEntityName(previewGcName)} - ${previewBcCity}`;
  const historyNbName =
    nbDisplayRow?.nb_name ||
    registration.master_links?.nb_name ||
    (nbCreatedViaCreateFlow ? normalizeEntityName(nbName) : "") ||
    "-";
  const historyNbCode =
    nbDisplayRow?.name ||
    (effectiveNbid ? `NB${effectiveNbid}` : "-");
  const historyGpName =
    gpResolvedRow?.gp_name ||
    registration.gp_name ||
    (gpCreatedViaCreateFlow ? normalizeEntityName(gpName) : "") ||
    "-";
  const historyGpCode =
    gpResolvedRow?.name ||
    (effectiveGpid ? `GP${effectiveGpid}` : "-");
  const historyGcName =
    gcDisplayRow?.gc_name ||
    registration.gc_name ||
    (effectiveGcid ? normalizeEntityName(gcName) : "") ||
    "-";
  const historyGcCode =
    gcDisplayRow?.name ||
    (effectiveGcid ? `GC${effectiveGcid}` : "-");
  const historyBcName =
    bcDisplayRow?.bcid_name ||
    registration.bc_name ||
    (effectiveBcid ? previewBcName : "") ||
    "-";
  const historyBcCode =
    bcDisplayRow?.name ||
    (effectiveBcid ? `BC${effectiveBcid}` : "-");

  const renderProcessHistory = ({
    showNb,
    showGp,
    showGc,
    showBc,
  }: {
    showNb: boolean;
    showGp: boolean;
    showGc: boolean;
    showBc: boolean;
  }) => (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
        Histori Proses
      </p>
      {showNb && (
        <div className="rounded-lg bg-white border border-gray-200 px-3 py-2">
          <div className="text-xs font-semibold text-gray-500">NB Name</div>
          <div className="text-sm font-medium text-gray-900">{historyNbName}</div>
          <div className="text-xs text-gray-500 mt-0.5">NBID: {historyNbCode}</div>
        </div>
      )}
      {showGp && (
        <div className="rounded-lg bg-white border border-gray-200 px-3 py-2">
          <div className="text-xs font-semibold text-gray-500">GP Name</div>
          <div className="text-sm font-medium text-gray-900">{historyGpName}</div>
          <div className="text-xs text-gray-500 mt-0.5">GPID: {historyGpCode}</div>
        </div>
      )}
      {showGc && (
        <div className="rounded-lg bg-white border border-gray-200 px-3 py-2">
          <div className="text-xs font-semibold text-gray-500">GC Name</div>
          <div className="text-sm font-medium text-gray-900">{historyGcName}</div>
          <div className="text-xs text-gray-500 mt-0.5">GCID: {historyGcCode}</div>
        </div>
      )}
      {showBc && (
        <div className="rounded-lg bg-white border border-gray-200 px-3 py-2">
          <div className="text-xs font-semibold text-gray-500">BC Name</div>
          <div className="text-sm font-medium text-gray-900">{historyBcName}</div>
          <div className="text-xs text-gray-500 mt-0.5">BCID: {historyBcCode}</div>
        </div>
      )}
    </div>
  );

  const getBranchNameFromBc = (row?: BranchCustomerRow | null): string => {
    if (!row) return "-";
    if (
      row.branch &&
      typeof row.branch === "object" &&
      "branch_name" in row.branch &&
      typeof row.branch.branch_name === "string"
    ) {
      return row.branch.branch_name;
    }
    return row["branch.branch_name"] || "-";
  };

  const getBcPreviewLabel = (row?: BranchCustomerRow | null): string => {
    if (!row) return "-";
    return `${row.bcid_name || row.name || `BC${row.id}`} - ${getBranchNameFromBc(row)}`;
  };

  // ---- Helpers for rendering selected state badge ----
  const renderSelectedGpBadge = () => {
    if (!selectedGpid) return null;
    return (
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm">
        <span className="text-blue-800 font-medium">
          {selectedGpRow?.gp_name || "-"}{" "}
          <span className="text-blue-500">
            ({selectedGpRow?.name || `GP${selectedGpid}`})
          </span>
        </span>
        <button
          type="button"
          className="text-xs text-red-500 hover:underline ml-2"
          onClick={() => {
            setSelectedGpid(null);
            setCreatedGpid(null);
            setGpCreatedViaCreateFlow(false);
            setSelectedGcid(null);
            setCreatedGcid(null);
            setSelectedBcid(null);
            setCreatedBcid(null);
            setGcMode("idle");
            setBcMode("idle");
            setGpMode("search");
            setGpSearch("");
          }}
        >
          Ganti
        </button>
      </div>
    );
  };

  const renderSelectedGcBadge = () => {
    if (!selectedGcid) return null;
    return (
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm">
        <span className="text-blue-800 font-medium">
          {selectedGcRow?.gc_name || "-"}{" "}
          <span className="text-blue-500">
            ({selectedGcRow?.name || `GC${selectedGcid}`})
          </span>
        </span>
        <button
          type="button"
          className="text-xs text-red-500 hover:underline ml-2"
          onClick={() => {
            setSelectedGcid(null);
            setCreatedGcid(null);
            setSelectedBcid(null);
            setCreatedBcid(null);
            setBcMode("idle");
            setGcMode("idle");
            setGcSearch("");
          }}
        >
          Ganti
        </button>
      </div>
    );
  };

  const renderSelectedBcBadge = () => {
    if (!selectedBcid) return null;
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-3 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-blue-800 font-medium">
            {getBcPreviewLabel(selectedBcRow)}
          </span>
          <button
            type="button"
            className="text-xs text-red-500 hover:underline ml-2"
            onClick={() => {
              setSelectedBcid(null);
              setCreatedBcid(null);
              setBcMode("idle");
              setBcSearch("");
            }}
          >
            Ganti
          </button>
        </div>
        <div className="text-xs text-blue-700">
          PIC Branch: {selectedBcRow?.branch_owner || "-"} (
          {selectedBcRow?.branch_owner_phone || "-"})
        </div>
      </div>
    );
  };

  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    if (isSubmitting || isPreparing) return;

    const target = e.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase() || "";
    if (tag === "textarea" || tag === "button") return;

    e.preventDefault();
    e.stopPropagation();
    if (step < 5) {
      void handleNextStep();
      return;
    }
    void handleSubmitApproval();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onKeyDown={handleModalKeyDown}
            tabIndex={-1}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5 flex items-center gap-3">
              <FaCheckCircle className="w-7 h-7 text-white" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  Approve Registrasi Customer
                </h2>
                <p className="text-sm text-green-100 mt-0.5">
                  Step {step}: {step === 1 && "National Brand"}
                  {step === 2 && "Group Parent"}
                  {step === 3 && "Group Customer"}
                  {step === 4 && "Branch Customer"}
                  {step === 5 && "Finalize Approve"}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  Registrasi Customer
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {registration.company.name}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <FaBuilding className="w-3.5 h-3.5" />
                    <span>{registration.company.business_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-3.5 h-3.5" />
                    <span>{registration.company.branch_name}</span>
                  </div>
                </div>
              </div>

              {isPreparing && (
                <div className="text-sm text-gray-600">
                  Menyiapkan data approval...
                </div>
              )}

              {/* ===================== STEP 1: NATIONAL BRAND ===================== */}
              {!isPreparing && step === 1 && (
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <aside className="md:col-span-4 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      Registration Details
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {registration.company.name}
                    </p>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">
                            Business Type
                          </div>
                          <div className="font-medium text-black">
                            {registration.company.business_type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">
                            Location
                          </div>
                          <div className="font-medium text-black">
                            {registration.company.branch_name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">
                            Contact Person
                          </div>
                          <div className="flex flex-col font-medium text-black">
                            {registration.user.full_name}
                            <span className="text-blue-600">
                              {registration.user.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {renderProcessHistory({
                      showNb: true,
                      showGp: false,
                      showGc: false,
                      showBc: false,
                    })}
                  </aside>
                  <div className="md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                    <h3 className="text-base font-bold text-gray-900">
                      National Brand (Optional)
                    </h3>
                    <p className="text-sm text-gray-600">
                      Step ini opsional. Anda bisa lanjut tanpa membuat National
                      Brand.
                    </p>
                    {existingNbid ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                        <p className="font-semibold">
                          National Brand sudah terpasang di registrasi.
                        </p>
                        <p className="mt-1">NB ID: {existingNbid}</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="relative">
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                            <input
                              value={nbSearch}
                              onChange={(e) => setNbSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                              placeholder="Cari National Brand (nama / kode)..."
                            />
                          </div>
                          <div className="rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b">
                              {nbSearch.trim()
                                ? "HASIL PENCARIAN NATIONAL BRAND"
                                : "DAFTAR NATIONAL BRAND"}
                            </div>
                            {filteredNationalBrands.length > 0 ? (
                              <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                                {filteredNationalBrands.map((nb) => (
                                  <label
                                    key={nb.id}
                                    className="flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 cursor-pointer"
                                  >
                                    <span className="text-sm text-gray-800">
                                      {nb.nb_name || "-"}{" "}
                                      <span className="text-gray-500">
                                        (NBID: {nb.name || `NB${nb.id}`})
                                      </span>
                                    </span>
                                    <input
                                      type="radio"
                                      name="select-nb"
                                      checked={
                                        Number(selectedNbid) === Number(nb.id)
                                      }
                                      onClick={(e) => {
                                        if (
                                          Number(selectedNbid) === Number(nb.id)
                                        ) {
                                          e.preventDefault();
                                          setSelectedNbid(null);
                                        }
                                      }}
                                      onChange={() => {
                                        setSelectedNbid(nb.id);
                                            setCreatedNbid(null);
                                            setCreatedNb(null);
                                            setNbCreatedViaCreateFlow(false);
                                        setCreateNationalBrand(false);
                                      }}
                                    />
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <p className="px-3 py-3 text-xs text-gray-500">
                                National Brand tidak ditemukan.
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={createNationalBrand}
                              onChange={(e) => {
                                setCreateNationalBrand(e.target.checked);
                                if (e.target.checked) {
                                  setSelectedNbid(null);
                                      setCreatedNbid(null);
                                      setCreatedNb(null);
                                      setNbCreatedViaCreateFlow(false);
                                  if (!nbName.trim() && nbSearch.trim()) {
                                    setNbName(normalizeEntityName(nbSearch));
                                  }
                                } else {
                                  setNbCreatedViaCreateFlow(false);
                                }
                              }}
                            />
                            <span className="text-sm">
                              Buat National Brand baru
                            </span>
                          </label>
                          {!createNationalBrand && selectedNbid && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedNbid(null);
                                setCreatedNbid(null);
                                setCreatedNb(null);
                                setNbCreatedViaCreateFlow(false);
                              }}
                              className="text-xs font-medium text-gray-600 hover:text-red-600 hover:underline"
                            >
                              Hapus pilihan NB
                            </button>
                          )}
                        </div>
                        {createNationalBrand && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              National Brand Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={nbName}
                              onChange={(e) =>
                                setNbName(toUpperInput(e.target.value))
                              }
                              onBlur={() =>
                                setNbName((prev) => normalizeEntityName(prev))
                              }
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                              placeholder="Contoh: EKATUNGGAL"
                            />
                          </div>
                        )}
                        {!createNationalBrand && (
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                            Anda bisa pilih NB existing dari list, atau klik{" "}
                            <span className="font-semibold">Next</span> untuk
                            lanjut tanpa NB.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* ===================== STEP 2: GROUP PARENT ===================== */}
              {!isPreparing && step === 2 && (
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <aside className="md:col-span-4 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      Registration Details
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {registration.company.name}
                    </p>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">
                            Business Type
                          </div>
                          <div className="font-medium text-black">
                            {registration.company.business_type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">
                            Location
                          </div>
                          <div className="font-medium text-black">
                            {registration.company.branch_name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">
                            Contact Person
                          </div>
                          <div className="flex flex-col font-medium text-black">
                            {registration.user.full_name}
                            <span className="text-blue-600">
                              {registration.user.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>

                  <div className="md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                    <h3 className="text-base font-bold text-gray-900">
                      Select Group Parent
                    </h3>

                    {existingGpid ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                        <p className="font-semibold">
                          Group Parent sudah ada, tidak bisa membuat baru.
                        </p>
                        <p className="mt-1">
                          {gpDisplay?.gp_name || registration.gp_name || "-"}{" "}
                          (GPID:{" "}
                          {gpDisplay?.name ||
                            registration.gp_name ||
                            `GP${existingGpid}`}
                          )
                        </p>
                      </div>
                    ) : selectedGpid ? (
                      // GP already selected — show badge only
                      renderSelectedGpBadge()
                    ) : (
                      <>
                        {/* Idle: single search button */}

                        {/* SEARCH mode — create option appears inline when no results */}
                        {gpMode !== "create" && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                                <input
                                  autoFocus
                                  value={gpSearch}
                                  onChange={(e) => setGpSearch(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  placeholder="Ketik nama GP atau kode..."
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setGpMode("search");
                                  setGpSearch("");
                                }}
                                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-all"
                              >
                                Batal
                              </button>
                            </div>

                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                              <div className="px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b">
                                {gpSearch.trim()
                                  ? "HASIL PENCARIAN"
                                  : "DAFTAR GROUP PARENT"}
                              </div>
                              {filteredGroupParents.length > 0 ? (
                                <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                                  {filteredGroupParents.map((gp) => (
                                    <button
                                      key={gp.id}
                                      type="button"
                                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left transition-colors"
                                      onClick={() => {
                                        setSelectedGpid(gp.id);
                                        setCreatedGpid(null);
                                        setGpCreatedViaCreateFlow(false);
                                        setSelectedGcid(null);
                                        setCreatedGcid(null);
                                        setCreatedGc(null);
                                        setSelectedBcid(null);
                                        setCreatedBcid(null);
                                        setCreatedBc(null);
                                        setGcMode("idle");
                                        setBcMode("idle");
                                        setGpMode("search");
                                        setGpSearch("");
                                      }}
                                    >
                                      <span className="text-sm text-gray-800">
                                        {gp.gp_name || "-"}{" "}
                                        <span className="text-gray-500">
                                          (GPID: {gp.name || `GP${gp.id}`})
                                        </span>
                                      </span>
                                      <span className="text-xs text-blue-600 font-medium">
                                        Pilih
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : gpSearch.trim() ? (
                                <div className="px-3 py-3 space-y-2.5">
                                  <p className="text-xs text-gray-500">
                                    GP tidak ditemukan untuk &quot;
                                    <span className="font-medium">
                                      {gpSearch}
                                    </span>
                                    &quot;
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGpName(normalizeEntityName(gpSearch));
                                      setSelectedGpid(null);
                                      setCreatedGpid(null);
                                      setGpCreatedViaCreateFlow(false);
                                      setSelectedGcid(null);
                                      setCreatedGcid(null);
                                      setCreatedGc(null);
                                      setSelectedBcid(null);
                                      setCreatedBcid(null);
                                      setCreatedBc(null);
                                      setGcMode("idle");
                                      setBcMode("idle");
                                      setGpMode("create");
                                    }}
                                    className="w-full py-2 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                                  >
                                    <FaPlusCircle className="w-4 h-4" />
                                    Buat GP Baru
                                  </button>
                                </div>
                              ) : (
                                <p className="px-3 py-3 text-xs text-gray-400">
                                  Menampilkan 20 data GP terbaru.
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CREATE mode */}
                        {gpMode === "create" && (
                          <div className="space-y-3 border-2 border-green-200 rounded-xl p-4 bg-green-50">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-green-800">
                                Buat Group Parent Baru
                              </p>
                              <button
                                type="button"
                                onClick={() => setGpMode("search")}
                                className="text-xs text-gray-500 hover:underline"
                              >
                                Batal
                              </button>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Group Parent Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                value={gpName}
                                onChange={(e) =>
                                  setGpName(toUpperInput(e.target.value))
                                }
                                onBlur={() =>
                                  setGpName((prev) => normalizeEntityName(prev))
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white"
                                placeholder="Contoh: EKATUNGGAL GP"
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* ===================== STEP 3: GROUP CUSTOMER ===================== */}
              {!isPreparing && step === 3 && (
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <aside className="md:col-span-4 space-y-3">
                    {renderProcessHistory({
                      showNb: true,
                      showGp: true,
                      showGc: false,
                      showBc: false,
                    })}
                  </aside>

                  <div className="md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                    <h3 className="text-base font-bold text-gray-900">
                      Select Group Customer
                    </h3>

                    {existingGcid ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                        <p className="font-semibold">
                          Group Customer sudah ada.
                        </p>
                        <p className="mt-1">GC ID: {existingGcid}</p>
                      </div>
                    ) : selectedGcid ? (
                      <>
                        {renderSelectedGcBadge()}
                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm space-y-1">
                          <p>
                            <span className="font-semibold">Owner:</span>{" "}
                            {registration.user.full_name}
                          </p>
                          <p>
                            <span className="font-semibold">Phone:</span>{" "}
                            {registration.user.phone}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{" "}
                            {registration.user.email}
                          </p>
                          <p>
                            <span className="font-semibold">Company:</span>{" "}
                            {registration.company.name}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {!canSearchExistingGc && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            Karena Group Parent akan dibuat baru, Group Customer
                            harus dibuat baru (tidak bisa pilih existing).
                          </div>
                        )}

                        {/* Idle: single search button */}
                        {gcMode === "idle" && canSearchExistingGc && (
                          <button
                            type="button"
                            onClick={() => setGcMode("search")}
                            className="w-full py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                          >
                            <FaSearch className="w-4 h-4" />
                            Cari Group Customer yang Ada
                          </button>
                        )}

                        {gcMode === "idle" && !canSearchExistingGc && (
                          <button
                            type="button"
                            onClick={() => setGcMode("create")}
                            className="w-full py-2.5 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                          >
                            <FaPlusCircle className="w-4 h-4" />
                            Buat Group Customer Baru
                          </button>
                        )}

                        {/* SEARCH mode */}
                        {gcMode === "search" && canSearchExistingGc && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                                <input
                                  autoFocus
                                  value={gcSearch}
                                  onChange={(e) => setGcSearch(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  placeholder="Ketik nama GC atau kode..."
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setGcMode("idle");
                                  setGcSearch("");
                                }}
                                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-all"
                              >
                                Batal
                              </button>
                            </div>

                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                              <div className="px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b">
                                {gcSearch.trim()
                                  ? "HASIL PENCARIAN"
                                  : "DAFTAR GROUP CUSTOMER"}
                              </div>
                              {filteredGroupCustomers.length > 0 ? (
                                <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                                  {filteredGroupCustomers.map((gc) => (
                                    <button
                                      key={gc.id}
                                      type="button"
                                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left transition-colors"
                                      onClick={() => {
                                        setSelectedGcid(gc.id);
                                        setCreatedGcid(null);
                                        setSelectedBcid(null);
                                        setCreatedBcid(null);
                                        setCreatedBc(null);
                                        setBcMode("idle");
                                        setGcMode("idle");
                                        setGcSearch("");
                                      }}
                                    >
                                      <span className="text-sm text-gray-800">
                                        {gc.gc_name || "-"}{" "}
                                        <span className="text-gray-500">
                                          (GCID: {gc.name || `GC${gc.id}`})
                                        </span>
                                      </span>
                                      <span className="text-xs text-blue-600 font-medium">
                                        Pilih
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : gcSearch.trim() ? (
                                <div className="px-3 py-3 space-y-2.5">
                                  <p className="text-xs text-gray-500">
                                    GC tidak ditemukan untuk &quot;
                                    <span className="font-medium">
                                      {gcSearch}
                                    </span>
                                    &quot;
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGcName(
                                        normalizeEntityName(
                                          registration.company.name || "",
                                        ),
                                      );
                                      setSelectedGcid(null);
                                      setCreatedGcid(null);
                                      setSelectedBcid(null);
                                      setCreatedBcid(null);
                                      setBcMode("idle");
                                      setGcMode("create");
                                    }}
                                    className="w-full py-2 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                                  >
                                    <FaPlusCircle className="w-4 h-4" />
                                    Buat GC Baru
                                  </button>
                                </div>
                              ) : (
                                <p className="px-3 py-3 text-xs text-gray-400">
                                  Menampilkan 20 data GC terbaru.
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CREATE mode */}
                        {gcMode === "create" && (
                          <div className="space-y-3 border-2 border-green-200 rounded-xl p-4 bg-green-50">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-green-800">
                                Buat Group Customer Baru
                              </p>
                              <button
                                type="button"
                                onClick={() => setGcMode("idle")}
                                className="text-xs text-gray-500 hover:underline"
                              >
                                Batal
                              </button>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                GC Name (otomatis dari company){" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                value={gcName}
                                readOnly
                                onBlur={() =>
                                  setGcName((prev) => normalizeEntityName(prev))
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-100 text-gray-800"
                              />
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-3 text-sm space-y-1">
                              <p>
                                <span className="font-semibold">Owner:</span>{" "}
                                {registration.user.full_name}
                              </p>
                              <p>
                                <span className="font-semibold">Phone:</span>{" "}
                                {registration.user.phone}
                              </p>
                              <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {registration.user.email}
                              </p>
                              <p>
                                <span className="font-semibold">Company:</span>{" "}
                                {registration.company.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              )}

              {/* ===================== STEP 4: BRANCH CUSTOMER ===================== */}
              {!isPreparing && step === 4 && (
                <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <aside className="md:col-span-4 space-y-3">
                    {renderProcessHistory({
                      showNb: true,
                      showGp: true,
                      showGc: true,
                      showBc: false,
                    })}
                  </aside>

                  <div className="md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                    <h3 className="text-base font-bold text-gray-900">
                      Select Branch Customer
                    </h3>

                    {existingBcid ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                        <p className="font-semibold">
                          Branch Customer sudah ada.
                        </p>
                        <p className="mt-1">BC ID: {existingBcid}</p>
                      </div>
                    ) : selectedBcid ? (
                      renderSelectedBcBadge()
                    ) : (
                      <>
                        {!canSearchExistingBc && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            Karena Group Customer akan dibuat baru, Branch
                            Customer harus dibuat baru (tidak bisa pilih
                            existing).
                          </div>
                        )}
                        {/* Idle: single search button */}
                        {bcMode === "idle" && canSearchExistingBc && (
                          <button
                            type="button"
                            onClick={() => setBcMode("search")}
                            className="w-full py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                          >
                            <FaSearch className="w-4 h-4" />
                            Cari Branch Customer yang Ada
                          </button>
                        )}

                        {bcMode === "idle" && !canSearchExistingBc && (
                          <button
                            type="button"
                            onClick={() => setBcMode("create")}
                            className="w-full py-2.5 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                          >
                            <FaPlusCircle className="w-4 h-4" />
                            Buat Branch Customer Baru
                          </button>
                        )}

                        {/* SEARCH mode */}
                        {bcMode === "search" && canSearchExistingBc && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                                <input
                                  autoFocus
                                  value={bcSearch}
                                  onChange={(e) => setBcSearch(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  placeholder="Ketik nama BC atau kode..."
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setBcMode("idle");
                                  setBcSearch("");
                                }}
                                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-100 transition-all"
                              >
                                Batal
                              </button>
                            </div>

                            <div className="rounded-xl border border-gray-200 overflow-hidden">
                              <div className="px-3 py-2 text-xs font-bold text-gray-500 bg-gray-50 border-b">
                                {bcSearch.trim()
                                  ? "HASIL PENCARIAN"
                                  : "DAFTAR BRANCH CUSTOMER"}
                              </div>
                              {filteredBranchCustomers.length > 0 ? (
                                <div className="max-h-56 overflow-y-auto divide-y divide-gray-100">
                                  {filteredBranchCustomers.map((bc) => (
                                    <button
                                      key={bc.id}
                                      type="button"
                                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-blue-50 text-left transition-colors"
                                      onClick={() => {
                                        setSelectedBcid(bc.id);
                                        setCreatedBcid(null);
                                        setBcMode("idle");
                                        setBcSearch("");
                                      }}
                                    >
                                      <span className="flex flex-col">
                                        <span className="text-sm text-gray-800">
                                          {getBcPreviewLabel(bc)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          PIC: {bc.branch_owner || "-"} (
                                          {bc.branch_owner_phone || "-"})
                                        </span>
                                      </span>
                                      <span className="text-xs text-blue-600 font-medium">
                                        Pilih
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              ) : bcSearch.trim() ? (
                                <div className="px-3 py-3 space-y-2.5">
                                  <p className="text-xs text-gray-500">
                                    BC tidak ditemukan untuk &quot;
                                    <span className="font-medium">
                                      {bcSearch}
                                    </span>
                                    &quot;
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setBcMode("create")}
                                    className="w-full py-2 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                                  >
                                    <FaPlusCircle className="w-4 h-4" />
                                    Buat BC Baru
                                  </button>
                                </div>
                              ) : (
                                <p className="px-3 py-3 text-xs text-gray-400">
                                  Menampilkan 20 data BC terbaru.
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* CREATE mode */}
                        {bcMode === "create" && (
                          <div className="space-y-3 border-2 border-green-200 rounded-xl p-4 bg-green-50">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-green-800">
                                Buat Branch Customer Baru
                              </p>
                              <button
                                type="button"
                                onClick={() => setBcMode("idle")}
                                className="text-xs text-gray-500 hover:underline"
                              >
                                Batal
                              </button>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-3 text-sm space-y-1">
                              <p className="font-semibold text-gray-700 mb-1">
                                Data yang akan dibuat:
                              </p>
                              <p>
                                <span className="font-semibold">Preview:</span>{" "}
                                {previewBcName}
                              </p>
                              <p>
                                <span className="font-semibold">Branch:</span>{" "}
                                {registration.company.branch_id}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Product Need:
                                </span>{" "}
                                {registration.company.product_need || "-"}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Branch Owner:
                                </span>{" "}
                                {registration.branch_owner?.full_name ||
                                  registration.user.full_name}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  No. Branch Owner:
                                </span>{" "}
                                {registration.branch_owner?.phone ||
                                  registration.user.phone}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Shipping Rows:
                                </span>{" "}
                                {effectiveShippingAddresses.length}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </section>
              )}

              {!isPreparing && step === 5 && (
                <section className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-800">
                      Semua resource sudah diproses.
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Klik <span className="font-semibold">Commit Approve</span>{" "}
                      untuk membuat member_of dan update status customer
                      register menjadi Approved.
                    </p>
                  </div>
                  {renderProcessHistory({
                    showNb: true,
                    showGp: true,
                    showGc: true,
                    showBc: true,
                  })}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-sm space-y-1">
                    {nbCreatedViaCreateFlow && (
                      <p>
                        <span className="font-semibold">NB Manual:</span>{" "}
                        {normalizeEntityName(nbName)}
                      </p>
                    )}
                    {gpCreatedViaCreateFlow && (
                      <p>
                        <span className="font-semibold">GP Manual:</span>{" "}
                        {normalizeEntityName(gpName)}
                      </p>
                    )}
                    {createdGcid && (
                      <p>
                        <span className="font-semibold">GC Manual:</span>{" "}
                        {normalizeEntityName(gcName)}
                      </p>
                    )}
                    {(createdNbid || createdGpid || createdBcid) && (
                      <p className="text-xs text-gray-500 pt-1">
                        Ref IDs:
                        {createdNbid ? ` NB:${createdNbid}` : ""}
                        {createdGpid ? ` GP:${createdGpid}` : ""}
                        {createdBcid ? ` BC:${createdBcid}` : ""}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {operationLogs.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaListUl className="w-4 h-4" />
                    Operation Log
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {operationLogs.map((log, idx) => (
                      <div key={`${log.stage}-${idx}`} className="text-xs">
                        <span
                          className={`font-semibold ${
                            log.status === "failed"
                              ? "text-red-600"
                              : log.status === "success"
                                ? "text-green-600"
                                : "text-blue-600"
                          }`}
                        >
                          [{log.status.toUpperCase()}]
                        </span>{" "}
                        <span className="text-gray-700">{log.stage}</span>{" "}
                        <span className="text-gray-500">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-between gap-3 border-t border-gray-200">
              {step > 1 ? (
                <button
                  onClick={() =>
                    setStep((prev) => Math.max(1, prev - 1) as Step)
                  }
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
              )}

              {step < 5 ? (
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  onClick={() => void handleNextStep()}
                  disabled={isSubmitting || isPreparing}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  onClick={handleSubmitApproval}
                  disabled={isSubmitting || isPreparing}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="w-4 h-4" />
                      <span>Commit Approve</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
