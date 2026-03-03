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
import ActionResultModal from "@/components/ui/ActionResultModal";

interface ApproveRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: () => void;
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
  branch?:
    | number
    | { id?: number; branch_name?: string; city?: string }
    | null;
  "branch.branch_name"?: string | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
}

type Step = 1 | 2 | 3 | 4;

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
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [operationLogs, setOperationLogs] = useState<ApprovalOperationLog[]>(
    [],
  );
  const [shippingAddresses, setShippingAddresses] = useState<
    CustomerRegisterAddressApiResponse[]
  >([]);
  const [nationalBrands, setNationalBrands] = useState<NationalBrandRow[]>([]);
  const [existingGp, setExistingGp] = useState<GroupParentRow | null>(null);
  const [createdGp, setCreatedGp] = useState<GroupParentRow | null>(null);
  const [groupParents, setGroupParents] = useState<GroupParentRow[]>([]);
  const [groupCustomers, setGroupCustomers] = useState<GroupCustomerRow[]>([]);
  const [branchCustomers, setBranchCustomers] = useState<BranchCustomerRow[]>(
    [],
  );

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

  const existingGpid = registration?.gp_id;
  const existingGcid = registration?.gc_id;
  const existingBcid = registration?.bc_id;
  const existingNbid = registration?.master_links?.nb_id;
  const isCreatingNewGpFlow = Boolean(
    !existingGpid && !selectedGpid && gpMode === "create",
  );
  const canSearchExistingGc = Boolean(
    !isCreatingNewGpFlow && (existingGpid || selectedGpid),
  );
  const canSearchExistingBc = Boolean(
    !isCreatingNewGpFlow && (existingGcid || selectedGcid),
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
    const effectiveGpid = canSearchExistingGc ? existingGpid || selectedGpid : 0;
    const base = effectiveGpid
      ? groupCustomers.filter(
          (row) => Number(row.gpid || 0) === Number(effectiveGpid),
        )
      : groupCustomers;
    if (!qGc) return base.slice(0, 20);
    return base.filter((row) => {
      const label = `${row.gc_name || ""} ${row.name || ""}`.toLowerCase();
      return label.includes(qGc);
    });
  }, [gcSearch, groupCustomers, selectedGpid, existingGpid, canSearchExistingGc]);

  const filteredBranchCustomers = useMemo(() => {
    const q = bcSearch.trim().toLowerCase();
    const effectiveGcid = canSearchExistingBc ? selectedGcid || existingGcid : 0;
    const base = effectiveGcid
      ? branchCustomers.filter(
          (row) => Number(row.gcid || 0) === Number(effectiveGcid),
        )
      : branchCustomers;
    if (!q) return base.slice(0, 20);
    return base.filter((row) => {
      const label = `${row.bcid_name || ""} ${row.name || ""}`.toLowerCase();
      return label.includes(q);
    });
  }, [
    bcSearch,
    branchCustomers,
    selectedGcid,
    existingGcid,
    canSearchExistingBc,
  ]);

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
      setSuccessMessage(null);
      setOperationLogs([]);
      setNationalBrands([]);
      setExistingGp(null);
      setCreatedGp(null);
      setGroupParents([]);
      setGroupCustomers([]);
      setBranchCustomers([]);
      setNbSearch("");
      setSelectedNbid(existingNbid || null);

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
        const gpSpec = {
          fields: ["id", "name", "gp_name", "nbid"],
          limit: 1000000,
        };
        const nbSpec = {
          fields: ["id", "name", "nb_name"],
          limit: 1000000,
        };
        const gcSpec = {
          fields: ["id", "name", "gc_name", "gpid"],
          limit: 1000000,
        };
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

        const [shippingRes, gpListRes, nbListRes, gcListRes, bcListRes] =
          await Promise.all([
            apiFetch(
              getQueryUrl(
                API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS,
                shippingSpec,
              ),
              { method: "GET", cache: "no-store" },
              token,
            ),
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpSpec),
              { method: "GET", cache: "no-store" },
              token,
            ),
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, nbSpec),
              { method: "GET", cache: "no-store" },
              token,
            ),
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gcSpec),
              { method: "GET", cache: "no-store" },
              token,
            ),
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bcSpec),
              { method: "GET", cache: "no-store" },
              token,
            ),
          ]);

        const [shippingJson, gpListJson, nbListJson, gcListJson, bcListJson] =
          await Promise.all([
            shippingRes.json().catch(() => null),
            gpListRes.json().catch(() => null),
            nbListRes.json().catch(() => null),
            gcListRes.json().catch(() => null),
            bcListRes.json().catch(() => null),
          ]);

        if (!cancelled) {
          setShippingAddresses(
            Array.isArray(shippingJson?.data) ? shippingJson.data : [],
          );
          setGroupParents(
            Array.isArray(gpListJson?.data) ? gpListJson.data : [],
          );
          setNationalBrands(
            Array.isArray(nbListJson?.data) ? nbListJson.data : [],
          );
          setGroupCustomers(
            Array.isArray(gcListJson?.data) ? gcListJson.data : [],
          );
          setBranchCustomers(
            Array.isArray(bcListJson?.data) ? bcListJson.data : [],
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
  }, [isOpen, registration, token, existingNbid]);

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
    if (!canSearchExistingGc) {
      setGcMode("create");
      setSelectedGcid(null);
    }
  }, [step, existingGcid, canSearchExistingGc]);

  useEffect(() => {
    if (step !== 4 || existingBcid) return;
    if (!canSearchExistingBc) {
      setBcMode("create");
      setSelectedBcid(null);
    }
  }, [step, existingBcid, canSearchExistingBc]);

  useEffect(() => {
    if (!isCreatingNewGpFlow) return;
    setSelectedGcid(null);
    setSelectedBcid(null);
    if (step >= 3) setGcMode("create");
    if (step >= 4) setBcMode("create");
  }, [isCreatingNewGpFlow, step]);

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
        normalizePhone(registration.branch_owner?.phone || registration.user.phone) ||
        undefined;

      const officeAddress = {
        type: "office",
        label: "Office",
        address: registration.address.full_address,
        city: registration.address.city_name,
        district: registration.address.district_name,
        province: registration.address.province_name,
        postal_code: registration.address.postal_code,
      };

      const warehouseAddressesFromShipping = effectiveShippingAddresses.map((addr) => ({
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
      }));

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
          normalizePhone(firstShipping?.pic_phone || undefined) || branchOwnerPhone,
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
    (ids: ApprovalResult) => {
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
        same_as_company_address: registration?.same_as_company_address ? 1 : 0,
        gpid: ids.gpid,
        gcid: ids.gcid,
        bcid: ids.bcid,
        nbid: ids.nbid ?? null,
        customer_shipping_address: shippingPayload,
      };
    },
    [effectiveShippingAddresses, registration?.same_as_company_address],
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
        if (!normalizeEntityName(gpName)) return "Nama Group Parent wajib diisi";
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
      if (canSearchExistingBc && selectedBcid) return null;
      if (bcMode === "create" || !canSearchExistingBc) {
        return null;
      }
      if (bcMode === "idle" || bcMode === "search") {
        return "Pilih Branch Customer yang ada atau klik 'Create New' untuk membuat baru";
      }
    }

    return null;
  };

  const handleNextStep = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((prev) => Math.min(4, prev + 1) as Step);
  };

  const handleSubmitApproval = async () => {
    if (!registration || !token) {
      setError("Data tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let nbid: number | undefined = existingNbid;
      if (!nbid && selectedNbid) {
        nbid = selectedNbid;
      }

      let gpid: number;
      if (existingGpid) {
        gpid = existingGpid;
      } else if (selectedGpid) {
        gpid = selectedGpid;
      } else {
        if (createNationalBrand) {
          const nbJson = await apiJsonRequest(
            "creating National Brand",
            getApiUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND),
            "POST",
            { nb_name: normalizeEntityName(nbName) },
          );
          const createdNbid = extractIdFromResourceResponse(nbJson);
          if (!createdNbid)
            throw new Error("Failed creating National Brand (missing id)");
          nbid = createdNbid;
        }

        const gpPayload = {
          gp_name: normalizeEntityName(gpName),
          ...(nbid ? { nbid } : {}),
        };
        const gpJson = await apiJsonRequest(
          "creating Group Parent",
          getApiUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT),
          "POST",
          gpPayload,
        );
        const createdGpid = extractIdFromResourceResponse(gpJson);
        if (!createdGpid)
          throw new Error("Failed creating Group Parent (missing id)");
        gpid = createdGpid;

        if (
          gpJson &&
          typeof gpJson === "object" &&
          "data" in gpJson &&
          gpJson.data &&
          typeof gpJson.data === "object"
        ) {
          const row = gpJson.data as GroupParentRow;
          setCreatedGp({
            id: createdGpid,
            name: row.name,
            gp_name: row.gp_name,
            nbid: row.nbid,
          });
        }
      }

      let gcid: number;
      if (existingGcid) {
        gcid = existingGcid;
      } else if (selectedGcid) {
        const selectedGc = groupCustomers.find(
          (row) => Number(row.id) === Number(selectedGcid),
        );
        if (selectedGc?.gpid && Number(selectedGc.gpid) !== Number(gpid)) {
          throw new Error(
            "GC yang dipilih tidak berada di Group Parent yang dipilih.",
          );
        }
        gcid = selectedGcid;
      } else {
        const gcPayload = buildGroupCustomerPayload(gpid);
        if (!gcPayload) throw new Error("Payload Group Customer tidak valid");
        const gcJson = await apiJsonRequest(
          "creating Group Customer",
          getApiUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER),
          "POST",
          gcPayload,
        );
        const createdGcid = extractIdFromResourceResponse(gcJson);
        if (!createdGcid)
          throw new Error("Failed creating Group Customer (missing id)");
        gcid = createdGcid;
      }

      let bcid: number;
      if (existingBcid) {
        bcid = existingBcid;
      } else if (selectedBcid) {
        const selectedBc = branchCustomers.find(
          (row) => Number(row.id) === Number(selectedBcid),
        );
        if (selectedBc?.gcid && Number(selectedBc.gcid) !== Number(gcid)) {
          throw new Error(
            "BC yang dipilih tidak berada di Group Customer yang dipilih.",
          );
        }
        bcid = selectedBcid;
      } else {
        const bcPayload = buildBranchCustomerPayload(gcid);
        if (!bcPayload) throw new Error("Payload Branch Customer tidak valid");
        const bcJson = await apiJsonRequest(
          "creating Branch Customer",
          getApiUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2),
          "POST",
          bcPayload,
        );
        const createdBcid = extractIdFromResourceResponse(bcJson);
        if (!createdBcid)
          throw new Error("Failed creating Branch Customer (missing id)");
        bcid = createdBcid;
      }

      const userId =
        Number(registration.ekaplus_user?.id ?? registration.user.user_id) || 0;
      if (userId > 0) {
        try {
          await apiJsonRequest(
            "creating member_of owner gpid",
            getApiUrl(API_CONFIG.ENDPOINTS.MEMBER_OF),
            "POST",
            { user: userId, ref_type: "gpid", ref_id: gpid, is_owner: 1 },
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
      }

      const finalResult: ApprovalResult = { nbid, gpid, gcid, bcid };
      const updatePayload = buildCustomerRegisterApprovePayload(finalResult);
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

      setSuccessMessage(
        `Registrasi "${registration.company.name}" berhasil diapprove.\n\n` +
          `GP ID: ${gpid}\nGC ID: ${gcid}\nBC ID: ${bcid}${nbid ? `\nNB ID: ${nbid}` : ""}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal approve registrasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

  const gpDisplay = createdGp || existingGp;
  const selectedGpRow = groupParents.find(
    (gp) => Number(gp.id) === Number(selectedGpid),
  );
  const selectedGcRow = groupCustomers.find(
    (gc) => Number(gc.id) === Number(selectedGcid),
  );
  const selectedBcRow = branchCustomers.find(
    (bc) => Number(bc.id) === Number(selectedBcid),
  );
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
              setBcMode("idle");
              setBcSearch("");
            }}
          >
            Ganti
          </button>
        </div>
        <div className="text-xs text-blue-700">
          PIC Branch: {selectedBcRow?.branch_owner || "-"} ({selectedBcRow?.branch_owner_phone || "-"})
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
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
                          <div className="text-xs font-semibold text-gray-500">Business Type</div>
                          <div className="font-medium text-black">{registration.company.business_type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">Location</div>
                          <div className="font-medium text-black">{registration.company.branch_name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-700" />
                        <div className="flex flex-col items-start">
                          <div className="text-xs font-semibold text-gray-500">Contact Person</div>
                          <div className="flex flex-col font-medium text-black">
                            {registration.user.full_name}
                            <span className="text-blue-600">{registration.user.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <div className="md:col-span-8 rounded-xl border border-gray-200 bg-white p-4 space-y-4">
                    <h3 className="text-base font-bold text-gray-900">National Brand (Optional)</h3>
                    <p className="text-sm text-gray-600">
                      Step ini opsional. Anda bisa lanjut tanpa membuat National Brand.
                    </p>
                    {existingNbid ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-sm text-green-900">
                        <p className="font-semibold">National Brand sudah terpasang di registrasi.</p>
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
                              {nbSearch.trim() ? "HASIL PENCARIAN NATIONAL BRAND" : "DAFTAR NATIONAL BRAND"}
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
                                      checked={Number(selectedNbid) === Number(nb.id)}
                                      onClick={(e) => {
                                        if (Number(selectedNbid) === Number(nb.id)) {
                                          e.preventDefault();
                                          setSelectedNbid(null);
                                        }
                                      }}
                                      onChange={() => {
                                        setSelectedNbid(nb.id);
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
                                if (!nbName.trim() && nbSearch.trim()) {
                                  setNbName(normalizeEntityName(nbSearch));
                                }
                              }
                            }}
                            />
                            <span className="text-sm">Buat National Brand baru</span>
                          </label>
                          {!createNationalBrand && selectedNbid && (
                            <button
                              type="button"
                              onClick={() => setSelectedNbid(null)}
                              className="text-xs font-medium text-gray-600 hover:text-red-600 hover:underline"
                            >
                              Hapus pilihan NB
                            </button>
                          )}
                        </div>
                        {createNationalBrand && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              National Brand Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              value={nbName}
                              onChange={(e) => setNbName(e.target.value)}
                              onBlur={() =>
                                setNbName((prev) => normalizeEntityName(prev))
                              }
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl"
                              placeholder="Contoh: Yuda Prayoga"
                            />
                          </div>
                        )}
                        {!createNationalBrand && (
                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                            Anda bisa pilih NB existing dari list, atau klik <span className="font-semibold">Next</span> untuk lanjut tanpa NB.
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
                                {gpSearch.trim() ? "HASIL PENCARIAN" : "DAFTAR GROUP PARENT"}
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
                              ) : (
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
                                  setGpMode("create");
                                }}
                                    className="w-full py-2 rounded-xl border-2 border-green-300 text-green-700 text-sm font-medium hover:border-green-500 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                                  >
                                    <FaPlusCircle className="w-4 h-4" />
                                    Buat GP Baru
                                  </button>
                                </div>
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
                                onChange={(e) => setGpName(e.target.value)}
                                onBlur={() =>
                                  setGpName((prev) => normalizeEntityName(prev))
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white"
                                placeholder="Contoh: Yuda Prayoga GP"
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
                  <aside className="md:col-span-4 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      Group Parent
                    </p>
                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-gray-400" />
                      <div className="flex flex-col items-start">
                        <div className="text-xs font-semibold text-gray-500">
                          GP Name
                        </div>
                        <div className="font-medium text-black">
                          {selectedGpRow?.gp_name ||
                            gpDisplay?.gp_name ||
                            registration.gp_name ||
                            gpName ||
                            "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <div className="flex flex-col items-start">
                        <div className="text-xs font-semibold text-gray-500">
                          GPID
                        </div>
                        <div className="font-medium text-black">
                          {selectedGpRow?.name ||
                            gpDisplay?.name ||
                            registration.gp_name ||
                            "-"}
                        </div>
                      </div>
                    </div>
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
                            Karena Group Parent akan dibuat baru, Group Customer harus dibuat baru (tidak bisa pilih existing).
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
                                {gcSearch.trim() ? "HASIL PENCARIAN" : "DAFTAR GROUP CUSTOMER"}
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
                                      setGcName(normalizeEntityName(gcSearch));
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
                                GC Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                value={gcName}
                                onChange={(e) => setGcName(e.target.value)}
                                onBlur={() =>
                                  setGcName((prev) => normalizeEntityName(prev))
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white"
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
                  <aside className="md:col-span-4 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      Group Customer
                    </p>
                    <div className="flex items-center gap-2">
                      <FaBuilding className="text-gray-400" />
                      <div className="flex flex-col items-start">
                        <div className="text-xs font-semibold text-gray-500">
                          GC Name
                        </div>
                        <div className="font-medium text-black">
                          {selectedGcRow?.gc_name ||
                            registration.gc_name ||
                            gcName ||
                            "-"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <div className="flex flex-col items-start">
                        <div className="text-xs font-semibold text-gray-500">
                          GCID
                        </div>
                        <div className="font-medium text-black">
                          {selectedGcRow?.name || registration.gc_name || "-"}
                        </div>
                      </div>
                    </div>
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
                            Karena Group Customer akan dibuat baru, Branch Customer harus dibuat baru (tidak bisa pilih existing).
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
                                {bcSearch.trim() ? "HASIL PENCARIAN" : "DAFTAR BRANCH CUSTOMER"}
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
                                        setBcMode("idle");
                                        setBcSearch("");
                                      }}
                                    >
                                      <span className="flex flex-col">
                                        <span className="text-sm text-gray-800">
                                          {getBcPreviewLabel(bc)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          PIC: {bc.branch_owner || "-"} ({bc.branch_owner_phone || "-"})
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

              {step < 4 ? (
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  onClick={handleNextStep}
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
          <ActionResultModal
            isOpen={Boolean(successMessage)}
            type="success"
            title="Approve Berhasil"
            message={successMessage || ""}
            onClose={() => {
              setSuccessMessage(null);
              onSuccess();
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
