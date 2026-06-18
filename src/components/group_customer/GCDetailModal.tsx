"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowDown,
  FaArrowUp,
  FaBan,
  FaBuilding,
  FaCheckCircle,
  FaChevronRight,
  FaClock,
  FaEdit,
  FaSave,
  FaTags,
  FaTimes,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type {
  BranchCustomer,
  GroupCustomer,
  GroupParent,
} from "@/types/customer";
import {
  API_CONFIG,
  apiFetch,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

interface GCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gc: GroupCustomer | null;
  onGCUpdate?: (updatedGC: GroupCustomer) => void;
  onViewGP?: (gp: GroupParent) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nbid?:
    | number
    | { id?: number | string; name?: string; nb_name?: string }
    | null;
  credit_limit_active?: number | null;
  credit_limit?: number | null;
  payment_term_active?: number | null;
  payment_term?: number | null;
  limit_customer_overdue_active?: number | null;
  limit_customer_overdue?: number | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

interface BranchCustomerRow {
  id: number;
  name?: string | null;
  bcid_name?: string | null;
  gcid?: number | { id?: number; name?: string; gc_name?: string } | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
  credit_limit_active?: number | null;
  credit_limit?: number | null;
  payment_term_active?: number | null;
  payment_term?: number | null;
  limit_customer_overdue_active?: number | null;
  limit_customer_overdue?: number | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
  branch_owner_email?: string | null;
  receipt_delivery_method?: string | null;
  receipt_issued_at?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface BranchLookupRow {
  id: number;
  branch_name?: string | null;
  city?: string | null;
}

interface GroupCustomerDetailRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  description?: string | null;
  company_name?: string | null;
  company_title?: string | null;
  company_type?: string | null;
  credit_limit_active?: number | null;
  credit_limit?: number | null;
  payment_term_active?: number | null;
  payment_term?: number | null;
  limit_customer_overdue_active?: number | null;
  limit_customer_overdue?: number | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  owner_place_of_birth?: string | null;
  owner_date_of_birth?: string | null;
}

type DetailTab = "company" | "owner" | "finance" | "hierarchy" | "activity";

const COMPANY_TYPE_OPTIONS = ["Company", "Individual"];
const COMPANY_TITLE_OPTIONS_BY_TYPE: Record<string, string[]> = {
  Individual: ["Home Industri", "Toko", "Freelance"],
  Company: ["PT", "CV", "UD"],
};
const COMPANY_SUFFIX_OPTIONS_BY_TITLE: Record<string, string[]> = {
  "Home Industri": ["HI"],
  Toko: ["TK"],
  Freelance: ["BP", "IBU"],
  PT: ["PT"],
  CV: ["CV"],
  UD: ["UD"],
};

function buildCompanyName(base: string, suffix: string) {
  return `${(base || "").trim()} ${(suffix || "").trim()}`.trim();
}

function splitCompanyName(fullName: string, title: string) {
  const full = (fullName || "").trim();
  const titleOptions = COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [];
  if (!full) {
    return {
      company_name_base: "",
      company_name_suffix: titleOptions[0] || "",
      company_name: "",
    };
  }

  for (const suffix of titleOptions) {
    if (full.toUpperCase().endsWith(` ${suffix.toUpperCase()}`)) {
      const base = full.slice(0, full.length - suffix.length).trim();
      return {
        company_name_base: base,
        company_name_suffix: suffix,
        company_name: buildCompanyName(base, suffix),
      };
    }
  }

  return {
    company_name_base: full,
    company_name_suffix: titleOptions[0] || "",
    company_name: buildCompanyName(full, titleOptions[0] || ""),
  };
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function resolveUserName(
  directName: string | null | undefined,
  value: number | { full_name?: string } | null | undefined,
): string | undefined {
  if (directName) return directName;
  if (value && typeof value === "object" && value.full_name)
    return value.full_name;
  return undefined;
}

function formatNullableNumber(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID").format(Number(value));
}

function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function GCDetailModal({
  isOpen,
  onClose,
  gc,
  onGCUpdate,
  onViewGP,
  onViewBC,
}: GCDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DetailTab>("company");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedCompanyType, setEditedCompanyType] = useState("");
  const [editedCompanyTitle, setEditedCompanyTitle] = useState("");
  const [editedCompanyNameBase, setEditedCompanyNameBase] = useState("");
  const [editedCompanyNameSuffix, setEditedCompanyNameSuffix] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedOwnerName, setEditedOwnerName] = useState("");
  const [editedOwnerPhone, setEditedOwnerPhone] = useState("");
  const [editedOwnerEmail, setEditedOwnerEmail] = useState("");
  const [editedOwnerPlaceOfBirth, setEditedOwnerPlaceOfBirth] = useState("");
  const [editedOwnerDateOfBirth, setEditedOwnerDateOfBirth] = useState("");
  const [creditPolicyFields, setCreditPolicyFields] = useState({
    credit_limit_active: 0,
    credit_limit: null as number | null,
    payment_term_active: 0,
    payment_term: null as number | null,
    limit_customer_overdue_active: 0,
    limit_customer_overdue: null as number | null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [parentGP, setParentGP] = useState<GroupParent | null>(null);
  const [linkedNB, setLinkedNB] = useState<{
    id: number;
    code: string;
    name: string;
  } | null>(null);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);

  const loadRelations = useCallback(async () => {
    if (!isOpen || !gc || !isAuthenticated || !token) return;

    const gcDetailRes = await apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
        fields: [
          "id",
          "name",
          "gc_name",
          "description",
          "company_name",
          "company_title",
          "company_type",
          "credit_limit_active",
          "credit_limit",
          "payment_term_active",
          "payment_term",
          "limit_customer_overdue_active",
          "limit_customer_overdue",
          "owner_full_name",
          "owner_phone",
          "owner_email",
          "owner_place_of_birth",
          "owner_date_of_birth",
        ],
        filters: [["id", "=", gc.id]],
        limit: 1,
      }),
      { method: "GET", cache: "no-store" },
      token,
    );
    const gcDetailJson = gcDetailRes.ok
      ? await gcDetailRes.json()
      : { data: [] };
    const gcDetailRow: GroupCustomerDetailRow | undefined = Array.isArray(
      gcDetailJson?.data,
    )
      ? gcDetailJson.data[0]
      : undefined;

    const rawCompanyType = gcDetailRow?.company_type || "";
    const rawCompanyTitle = gcDetailRow?.company_title || "";
    const rawCompanyName =
      gcDetailRow?.company_name || gcDetailRow?.gc_name || gc.name || "";
    const companySplit = splitCompanyName(rawCompanyName, rawCompanyTitle);
    setEditedCompanyType(rawCompanyType);
    setEditedCompanyTitle(rawCompanyTitle);
    setEditedCompanyNameBase(companySplit.company_name_base);
    setEditedCompanyNameSuffix(companySplit.company_name_suffix);
    setEditedName(companySplit.company_name || rawCompanyName);
    setEditedDescription(gcDetailRow?.description || gc.description || "");
    setEditedOwnerName(gcDetailRow?.owner_full_name || gc.owner_name || "");
    setEditedOwnerPhone(gcDetailRow?.owner_phone || gc.owner_phone || "");
    setEditedOwnerEmail(gcDetailRow?.owner_email || gc.owner_email || "");
    setEditedOwnerPlaceOfBirth(gcDetailRow?.owner_place_of_birth || "");
    setEditedOwnerDateOfBirth(
      gcDetailRow?.owner_date_of_birth?.split("T")[0] || "",
    );
    setCreditPolicyFields({
      credit_limit_active: Number(gcDetailRow?.credit_limit_active || 0),
      credit_limit: gcDetailRow?.credit_limit ?? null,
      payment_term_active: Number(gcDetailRow?.payment_term_active || 0),
      payment_term: gcDetailRow?.payment_term ?? null,
      limit_customer_overdue_active: Number(
        gcDetailRow?.limit_customer_overdue_active || 0,
      ),
      limit_customer_overdue: gcDetailRow?.limit_customer_overdue ?? null,
    });

    if (gc.gp_id) {
      const gpRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
          filters: [["id", "=", gc.gp_id]],
          limit: 1,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const gpJson = gpRes.ok ? await gpRes.json() : { data: [] };
      const row: GroupParentRow | undefined = Array.isArray(gpJson?.data)
        ? gpJson.data[0]
        : undefined;

      setParentGP(
        row
          ? {
              id: Number(row.id),
              code: row.name || undefined,
              name: row.gp_name || row.name || "-",
              credit_limit_active: Number(row.credit_limit_active || 0),
              credit_limit: row.credit_limit ?? null,
              payment_term_active: Number(row.payment_term_active || 0),
              payment_term: row.payment_term ?? null,
              limit_customer_overdue_active: Number(
                row.limit_customer_overdue_active || 0,
              ),
              limit_customer_overdue: row.limit_customer_overdue ?? null,
              created_at: row.created_at || new Date(0).toISOString(),
              updated_at:
                row.updated_at || row.created_at || new Date(0).toISOString(),
              created_by: resolveUserName(
                row["created_by.full_name"],
                row.created_by,
              ),
              updated_by: resolveUserName(
                row["updated_by.full_name"],
                row.updated_by,
              ),
              disabled: Number(row.disabled || 0),
            }
          : null,
      );

      const nbId =
        row && typeof row.nbid === "number"
          ? row.nbid
          : row?.nbid && typeof row.nbid === "object"
            ? toNumber(row.nbid.id)
            : undefined;
      if (!nbId) {
        setLinkedNB(null);
      } else {
        const nbRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
            fields: ["id", "name", "nb_name"],
            filters: [["id", "=", nbId]],
            limit: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        );
        const nbJson = nbRes.ok ? await nbRes.json() : { data: [] };
        const nbRow: NationalBrandRow | undefined = Array.isArray(nbJson?.data)
          ? nbJson.data[0]
          : undefined;
        setLinkedNB(
          nbRow
            ? {
                id: Number(nbRow.id),
                code: nbRow.name || `NB${nbRow.id}`,
                name: nbRow.nb_name || nbRow.name || "-",
              }
            : null,
        );
      }
    } else {
      setParentGP(null);
      setLinkedNB(null);
    }

    const rows = await fetchAllQueryRows<BranchCustomerRow>({
      endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
      spec: {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["gcid", "=", gc.id]],
      },
      token,
      errorMessage: "Gagal memuat child branch customer",
    });

    const branchIds = Array.from(
      new Set(
        rows
          .map((row) =>
            row.branch && typeof row.branch === "object"
              ? toNumber(row.branch.id)
              : toNumber(row.branch),
          )
          .filter((id): id is number => typeof id === "number"),
      ),
    );

    const branchMap = new Map<number, { name?: string; city?: string }>();
    if (branchIds.length > 0) {
      const branchRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
          fields: ["id", "branch_name", "city"],
          filters: [["id", "in", branchIds]],
          limit: branchIds.length,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      if (branchRes.ok) {
        const branchJson = await branchRes.json();
        const branchRows: BranchLookupRow[] = Array.isArray(branchJson?.data)
          ? branchJson.data
          : [];
        branchRows.forEach((row) => {
          branchMap.set(Number(row.id), {
            name: row.branch_name || undefined,
            city: row.city || undefined,
          });
        });
      }
    }

    const mapped: BranchCustomer[] = rows.map((row) => {
      const branchId =
        row.branch && typeof row.branch === "object"
          ? toNumber(row.branch.id) || 0
          : toNumber(row.branch) || 0;
      const branchRef = branchMap.get(branchId);
      const directBranchName =
        row.branch && typeof row.branch === "object"
          ? row.branch.branch_name
          : undefined;
      const directBranchCity =
        row.branch && typeof row.branch === "object"
          ? row.branch.city
          : undefined;

      return {
        id: Number(row.id),
        code: row.name || undefined,
        name:
          row.bcid_name ||
          row.name ||
          `${gc.name} - ${directBranchCity || branchRef?.city || "-"}`,
        gc_id: gc.id,
        gc_name: gc.name,
        gc_code: gc.code,
        gp_name: gc.gp_name,
        gp_code: gc.gp_code,
        credit_limit_active: Number(row.credit_limit_active || 0),
        credit_limit: row.credit_limit ?? null,
        payment_term_active: Number(row.payment_term_active || 0),
        payment_term: row.payment_term ?? null,
        limit_customer_overdue_active: Number(
          row.limit_customer_overdue_active || 0,
        ),
        limit_customer_overdue: row.limit_customer_overdue ?? null,
        branch_id: branchId,
        branch_name: directBranchName || branchRef?.name,
        branch_city: directBranchCity || branchRef?.city,
        owner_name: row.branch_owner || undefined,
        owner_phone: row.branch_owner_phone || undefined,
        owner_email: row.branch_owner_email || undefined,
        receipt_delivery_method: row.receipt_delivery_method || undefined,
        receipt_issued_at: row.receipt_issued_at || undefined,
        created_at: row.created_at || new Date(0).toISOString(),
        updated_at:
          row.updated_at || row.created_at || new Date(0).toISOString(),
        created_by: resolveUserName(
          row["created_by.full_name"],
          row.created_by,
        ),
        updated_by: resolveUserName(
          row["updated_by.full_name"],
          row.updated_by,
        ),
        disabled: Number(row.disabled || 0),
      };
    });

    setChildBCs(mapped);
  }, [gc, isAuthenticated, isOpen, token]);

  useEffect(() => {
    if (isOpen && gc) {
      setActiveTab("company");
      setIsEditMode(false);
      setEditedName(gc.name || "");
      const split = splitCompanyName(gc.name || "", "");
      setEditedCompanyType("");
      setEditedCompanyTitle("");
      setEditedCompanyNameBase(split.company_name_base);
      setEditedCompanyNameSuffix(split.company_name_suffix);
      setEditedDescription(gc.description || "");
      setEditedOwnerName(gc.owner_name || "");
      setEditedOwnerPhone(gc.owner_phone || "");
      setEditedOwnerEmail(gc.owner_email || "");
      setEditedOwnerPlaceOfBirth("");
      setEditedOwnerDateOfBirth("");
    }
  }, [gc, isOpen]);

  useEffect(() => {
    void loadRelations();
  }, [loadRelations]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const companyTitleOptions =
    COMPANY_TITLE_OPTIONS_BY_TYPE[editedCompanyType] || [];
  const companySuffixOptions =
    COMPANY_SUFFIX_OPTIONS_BY_TITLE[editedCompanyTitle] || [];
  const isSuffixEditable = editedCompanyTitle === "Freelance";

  const setCompanyType = (type: string) => {
    const nextTitles = COMPANY_TITLE_OPTIONS_BY_TYPE[type] || [];
    const nextTitle = type ? nextTitles[0] || "" : "";
    const nextSuffix = nextTitle
      ? (COMPANY_SUFFIX_OPTIONS_BY_TITLE[nextTitle] || [])[0] || ""
      : "";
    setEditedCompanyType(type);
    setEditedCompanyTitle(nextTitle);
    setEditedCompanyNameSuffix(nextSuffix);
    setEditedName(buildCompanyName(editedCompanyNameBase, nextSuffix));
  };

  const setCompanyTitle = (title: string) => {
    const nextSuffix = (COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [])[0] || "";
    setEditedCompanyTitle(title);
    setEditedCompanyNameSuffix(nextSuffix);
    setEditedName(buildCompanyName(editedCompanyNameBase, nextSuffix));
  };

  const setCompanyNameBase = (base: string) => {
    setEditedCompanyNameBase(base);
    setEditedName(buildCompanyName(base, editedCompanyNameSuffix));
  };

  const setCompanyNameSuffix = (suffix: string) => {
    setEditedCompanyNameSuffix(suffix);
    setEditedName(buildCompanyName(editedCompanyNameBase, suffix));
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setActiveTab("company");
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    void loadRelations();
  };

  const handleSaveEdit = async () => {
    const finalName = buildCompanyName(
      editedCompanyNameBase,
      editedCompanyNameSuffix,
    );
    if (
      !gc ||
      !token ||
      !isAuthenticated ||
      !editedCompanyType ||
      !editedCompanyTitle ||
      !finalName
    ) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        gc_name: finalName,
        description: editedDescription.trim() || null,
        company_name: finalName,
        company_title: editedCompanyTitle,
        company_type: editedCompanyType,
        credit_limit_active: creditPolicyFields.credit_limit_active,
        credit_limit: creditPolicyFields.credit_limit,
        payment_term_active: creditPolicyFields.payment_term_active,
        payment_term: creditPolicyFields.payment_term,
        limit_customer_overdue_active:
          creditPolicyFields.limit_customer_overdue_active,
        limit_customer_overdue: creditPolicyFields.limit_customer_overdue,
        owner_full_name: editedOwnerName.trim() || null,
        owner_phone: editedOwnerPhone.trim() || null,
        owner_email: editedOwnerEmail.trim() || null,
        owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
        owner_date_of_birth: editedOwnerDateOfBirth
          ? `${editedOwnerDateOfBirth}T00:00:00Z`
          : null,
      };
      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gc.id),
        { method: "PUT", body: JSON.stringify(payload), cache: "no-store" },
        token,
      );

      if (!res.ok) {
        throw new Error(`Failed to update Group Customer (${res.status})`);
      }

      onGCUpdate?.({
        ...gc,
        name: finalName,
        description: editedDescription.trim() || undefined,
        credit_limit_active: creditPolicyFields.credit_limit_active,
        credit_limit: creditPolicyFields.credit_limit,
        payment_term_active: creditPolicyFields.payment_term_active,
        payment_term: creditPolicyFields.payment_term,
        limit_customer_overdue_active:
          creditPolicyFields.limit_customer_overdue_active,
        limit_customer_overdue: creditPolicyFields.limit_customer_overdue,
        owner_name: editedOwnerName.trim() || undefined,
        owner_phone: editedOwnerPhone.trim() || undefined,
        owner_email: editedOwnerEmail.trim() || undefined,
        updated_at: new Date().toISOString(),
      });
      setIsEditMode(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Gagal update Group Customer",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const detailTabs = useMemo(
    () => [
      {
        key: "company" as const,
        label: "Data Perusahaan",
        caption: "Company profile",
        icon: <FaBuilding className="h-4 w-4" />,
      },
      {
        key: "owner" as const,
        label: "Data Pemilik",
        caption: "Owner details",
        icon: <FaUser className="h-4 w-4" />,
      },
      {
        key: "finance" as const,
        label: "Data Keuangan",
        caption: "Credit & term",
        icon: <FaTags className="h-4 w-4" />,
      },
      {
        key: "hierarchy" as const,
        label: "Hierarki",
        caption: "Parent & branch",
        icon: <FaUsers className="h-4 w-4" />,
      },
      {
        key: "activity" as const,
        label: "Aktivitas",
        caption: "Riwayat data",
        icon: <FaClock className="h-4 w-4" />,
      },
    ],
    [],
  );

  if (!gc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="border-b border-blue-200 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-blue-900/20 backdrop-blur-sm">
                    <FaBuilding className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">
                        Group Customer Details
                      </h2>
                      {gc.disabled === 1 ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                          <FaBan className="h-3.5 w-3.5" />
                          Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                          <FaCheckCircle className="h-3.5 w-3.5" />
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-100">
                      GCID: {gc.code || `GC${gc.id}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditMode && (
                    <button
                      onClick={handleEditClick}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-50"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                      Edit Details
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
                  >
                    <HiXMark className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 md:p-6">
              <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
                <aside className="space-y-3">
                  {detailTabs.map((tab) => {
                    const active = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                          active
                            ? "border-blue-500 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/70"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-blue-600"
                            }`}
                          >
                            {tab.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{tab.label}</p>
                            <p
                              className={`text-xs ${
                                active ? "text-blue-100" : "text-slate-500"
                              }`}
                            >
                              {tab.caption}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </aside>

                <div className="space-y-6">
                  <section className="rounded-3xl border border-white bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">
                          Group Customer
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900">
                          {editedName || gc.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Entitas customer level perusahaan yang terhubung ke GP
                          dan branch customer.
                        </p>
                      </div>

                      <div className="grid min-w-[240px] gap-3">
                        {linkedNB && (
                          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
                              National Brand
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                              {linkedNB.name}
                            </p>
                            <p className="text-sm text-indigo-600">
                              NBID: {linkedNB.code}
                            </p>
                          </div>
                        )}
                        {parentGP && (
                          <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-600">
                              Group Parent
                            </p>
                            <p className="mt-2 font-bold text-slate-900">
                              {parentGP.name}
                            </p>
                            <p className="text-sm text-purple-600">
                              GPID: {parentGP.code || `GP${parentGP.id}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {activeTab === "company" && (
                    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                        Data Perusahaan
                      </p>
                      {isEditMode ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Jenis Perusahaan
                            </label>
                            <select
                              value={editedCompanyType}
                              onChange={(e) => setCompanyType(e.target.value)}
                              className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm"
                              disabled={isSaving}
                            >
                              <option value="">Pilih Jenis Perusahaan</option>
                              {COMPANY_TYPE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Gelar Perusahaan
                            </label>
                            <select
                              value={editedCompanyTitle}
                              onChange={(e) => setCompanyTitle(e.target.value)}
                              className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm"
                              disabled={isSaving || !editedCompanyType}
                            >
                              <option value="">Pilih Gelar Perusahaan</option>
                              {companyTitleOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Nama Perusahaan
                            </label>
                            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]">
                              <input
                                type="text"
                                value={editedCompanyNameBase}
                                onChange={(e) =>
                                  setCompanyNameBase(e.target.value)
                                }
                                className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm"
                                placeholder="Nama inti perusahaan"
                                disabled={isSaving}
                              />
                              {isSuffixEditable ? (
                                <select
                                  value={editedCompanyNameSuffix}
                                  onChange={(e) =>
                                    setCompanyNameSuffix(e.target.value)
                                  }
                                  className="rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm"
                                  disabled={isSaving}
                                >
                                  <option value="">Pilih Sebutan</option>
                                  {companySuffixOptions.map((suffix) => (
                                    <option key={suffix} value={suffix}>
                                      {suffix}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={editedCompanyNameSuffix}
                                  readOnly
                                  className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm"
                                  placeholder="Sebutan"
                                />
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Nama Final
                            </label>
                            <input
                              type="text"
                              value={editedName}
                              readOnly
                              className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Description
                            </label>
                            <textarea
                              value={editedDescription}
                              onChange={(e) => setEditedDescription(e.target.value)}
                              className="min-h-[96px] w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm"
                              placeholder="Deskripsi group customer"
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Group Customer ID
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {gc.code || `GC${gc.id}`}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Status
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {gc.disabled === 1 ? "Disabled" : "Active"}
                            </p>
                          </div>
                          <div className="sm:col-span-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Description
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-slate-900">
                              {editedDescription || gc.description || "-"}
                            </p>
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {activeTab === "owner" && (
                    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
                          <FaUser className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                            Data Pemilik
                          </p>
                          <h4 className="text-xl font-bold text-slate-900">
                            Owner Information
                          </h4>
                        </div>
                      </div>

                      {isEditMode ? (
                        <div className="grid gap-4 md:grid-cols-2">
                          <input
                            type="text"
                            value={editedOwnerName}
                            onChange={(e) => setEditedOwnerName(e.target.value)}
                            placeholder="Nama owner"
                            className="rounded-2xl border border-blue-200 px-4 py-3 text-sm"
                            disabled={isSaving}
                          />
                          <input
                            type="text"
                            value={editedOwnerPhone}
                            onChange={(e) => setEditedOwnerPhone(e.target.value)}
                            placeholder="No. Telepon"
                            className="rounded-2xl border border-blue-200 px-4 py-3 text-sm"
                            disabled={isSaving}
                          />
                          <input
                            type="email"
                            value={editedOwnerEmail}
                            onChange={(e) => setEditedOwnerEmail(e.target.value)}
                            placeholder="Email"
                            className="rounded-2xl border border-blue-200 px-4 py-3 text-sm"
                            disabled={isSaving}
                          />
                          <input
                            type="text"
                            value={editedOwnerPlaceOfBirth}
                            onChange={(e) =>
                              setEditedOwnerPlaceOfBirth(e.target.value)
                            }
                            placeholder="Tempat lahir"
                            className="rounded-2xl border border-blue-200 px-4 py-3 text-sm"
                            disabled={isSaving}
                          />
                          <input
                            type="date"
                            value={editedOwnerDateOfBirth}
                            onChange={(e) =>
                              setEditedOwnerDateOfBirth(e.target.value)
                            }
                            className="rounded-2xl border border-blue-200 px-4 py-3 text-sm"
                            disabled={isSaving}
                          />
                        </div>
                      ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Nama
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {editedOwnerName || "-"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Telepon
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {editedOwnerPhone || "-"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Email
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {editedOwnerEmail || "-"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              TTL
                            </p>
                            <p className="mt-2 font-semibold text-slate-900">
                              {editedOwnerPlaceOfBirth || "-"},{" "}
                              {editedOwnerDateOfBirth || "-"}
                            </p>
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {activeTab === "finance" && (
                    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
                      <div className="mb-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                          Data Keuangan
                        </p>
                        <h4 className="mt-2 text-xl font-bold text-slate-900">
                          Credit Policy
                        </h4>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-700">
                              Credit Limit
                            </p>
                            {isEditMode && (
                              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={
                                    creditPolicyFields.credit_limit_active === 1
                                  }
                                  onChange={(e) =>
                                    setCreditPolicyFields((prev) => ({
                                      ...prev,
                                      credit_limit_active: e.target.checked
                                        ? 1
                                        : 0,
                                    }))
                                  }
                                  disabled={isSaving}
                                />
                                Active
                              </label>
                            )}
                          </div>
                          {isEditMode ? (
                            <input
                              type="number"
                              value={creditPolicyFields.credit_limit ?? ""}
                              onChange={(e) =>
                                setCreditPolicyFields((prev) => ({
                                  ...prev,
                                  credit_limit: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }))
                              }
                              className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm"
                              placeholder="Masukkan credit limit"
                              disabled={isSaving}
                            />
                          ) : (
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Active:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {creditPolicyFields.credit_limit_active === 1
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Value:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {formatNullableNumber(
                                    creditPolicyFields.credit_limit,
                                  )}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-700">
                              Payment Term
                            </p>
                            {isEditMode && (
                              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={
                                    creditPolicyFields.payment_term_active === 1
                                  }
                                  onChange={(e) =>
                                    setCreditPolicyFields((prev) => ({
                                      ...prev,
                                      payment_term_active: e.target.checked
                                        ? 1
                                        : 0,
                                    }))
                                  }
                                  disabled={isSaving}
                                />
                                Active
                              </label>
                            )}
                          </div>
                          {isEditMode ? (
                            <input
                              type="number"
                              value={creditPolicyFields.payment_term ?? ""}
                              onChange={(e) =>
                                setCreditPolicyFields((prev) => ({
                                  ...prev,
                                  payment_term: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }))
                              }
                              className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm"
                              placeholder="Masukkan payment term"
                              disabled={isSaving}
                            />
                          ) : (
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Active:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {creditPolicyFields.payment_term_active === 1
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Value:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {formatNullableNumber(
                                    creditPolicyFields.payment_term,
                                  )}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <p className="text-sm font-semibold text-slate-700">
                              Limit Customer Overdue
                            </p>
                            {isEditMode && (
                              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                                <input
                                  type="checkbox"
                                  checked={
                                    creditPolicyFields.limit_customer_overdue_active ===
                                    1
                                  }
                                  onChange={(e) =>
                                    setCreditPolicyFields((prev) => ({
                                      ...prev,
                                      limit_customer_overdue_active:
                                        e.target.checked ? 1 : 0,
                                    }))
                                  }
                                  disabled={isSaving}
                                />
                                Active
                              </label>
                            )}
                          </div>
                          {isEditMode ? (
                            <input
                              type="number"
                              value={
                                creditPolicyFields.limit_customer_overdue ?? ""
                              }
                              onChange={(e) =>
                                setCreditPolicyFields((prev) => ({
                                  ...prev,
                                  limit_customer_overdue: e.target.value
                                    ? Number(e.target.value)
                                    : null,
                                }))
                              }
                              className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm"
                              placeholder="Masukkan batas overdue"
                              disabled={isSaving}
                            />
                          ) : (
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Active:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {creditPolicyFields.limit_customer_overdue_active ===
                                  1
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Value:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {formatNullableNumber(
                                    creditPolicyFields.limit_customer_overdue,
                                  )}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {activeTab === "hierarchy" && (
                    <div className="grid gap-4 xl:grid-cols-2">
                      <section className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500 text-white">
                            <FaArrowUp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-500">
                              Parent Hierarki
                            </p>
                            <p className="text-sm text-slate-500">
                              National Brand & Group Parent
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {linkedNB && (
                            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                National Brand
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {linkedNB.name}
                              </p>
                              <p className="text-sm text-indigo-600">
                                NBID: {linkedNB.code}
                              </p>
                            </div>
                          )}

                          {parentGP ? (
                            <button
                              onClick={() => onViewGP?.(parentGP)}
                              className="flex w-full items-center justify-between rounded-2xl border border-purple-100 bg-purple-50/70 px-4 py-3 text-left transition-all hover:border-purple-300 hover:bg-purple-50"
                            >
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {parentGP.name}
                                </p>
                                <p className="text-sm text-purple-600">
                                  GPID: {parentGP.code || `GP${parentGP.id}`}
                                </p>
                              </div>
                              <FaChevronRight className="h-4 w-4 text-purple-500" />
                            </button>
                          ) : (
                            <p className="text-sm italic text-slate-500">
                              Parent GP tidak ditemukan.
                            </p>
                          )}
                        </div>
                      </section>

                      <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                            <FaArrowDown className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                              Branch Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {childBCs.length} data terdaftar
                            </p>
                          </div>
                        </div>

                        <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                          {childBCs.length > 0 ? (
                            childBCs.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => onViewBC?.(item)}
                                className="flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 text-left transition-all hover:border-orange-300 hover:bg-orange-50"
                              >
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {`${item.gc_name || gc.name || "GC"} - ${
                                      item.branch_city ||
                                      item.branch_name ||
                                      item.name ||
                                      "-"
                                    }`}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    BCID: {item.code || `BC${item.id}`} •{" "}
                                    {item.branch_city || "-"}
                                  </p>
                                </div>
                                <FaChevronRight className="h-4 w-4 text-orange-500" />
                              </button>
                            ))
                          ) : (
                            <p className="text-sm italic text-slate-500">
                              Belum ada BC terdaftar.
                            </p>
                          )}
                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab === "activity" && (
                    <section className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                            <FaClock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                              Created
                            </p>
                            <p className="text-sm text-slate-500">
                              {gc.created_by || "System"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(gc.created_at)}
                        </p>
                      </div>

                      <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
                            <FaEdit className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                              Updated
                            </p>
                            <p className="text-sm text-slate-500">
                              {gc.updated_by || "System"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(gc.updated_at)}
                        </p>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
              {isEditMode && (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 disabled:opacity-50"
                  >
                    <FaTimes className="h-4 w-4" />
                    Batal
                  </button>
                  <button
                    onClick={() => void handleSaveEdit()}
                    disabled={
                      isSaving ||
                      !editedCompanyType ||
                      !editedCompanyTitle ||
                      !editedCompanyNameBase.trim() ||
                      !editedCompanyNameSuffix.trim()
                    }
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <FaSave className="h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Apply Changes"}
                  </button>
                </>
              )}
              {!isEditMode && (
                <button
                  onClick={onClose}
                  className="rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300"
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
