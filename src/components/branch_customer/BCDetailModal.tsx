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
  FaArrowDown,
  FaBan,
  FaAddressBook,
  FaBuilding,
  FaChevronRight,
  FaClock,
  FaEdit,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaTrash,
  FaUsers,
  FaWarehouse,
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
  getApiUrl,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchBranchErpResourcePage,
  fetchPaymentAccountInfo,
  getTaxStatusLabel,
  type PaymentAccountInfo,
} from "@/utils/paymentAccount";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import LoadMoreButton from "@/components/ui/LoadMoreButton";
import { BCContactRelationsPanel } from "./BCContactRelationsPanel";

interface BCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bc: BranchCustomer | null;
  onBCUpdate?: (updatedBC: BranchCustomer) => void;
  onViewBC?: (bc: BranchCustomer) => void;
  onViewGP?: (gp: GroupParent) => void;
  onViewGC?: (gc: GroupCustomer) => void;
}

interface BCDetailApi {
  id: number;
  name?: string | null;
  gcid?: number | null;
  branch?:
    | number
    | { id?: number | null; branch_name?: string | null; city?: string | null }
    | null;
  customer_register?: number | null;
  product_need?: string | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
  branch_owner_email?: string | null;
  branch_owner_place_of_birth?: string | null;
  branch_owner_date_of_birth?: string | null;
  description?: string | null;
  disabled?: number | null;
  docstatus?: number | null;
  is_cash?: number | null;
  status?: string | null;
  notes?: string | null;
  payment_account?: string | null;
  payment_method?: string | null;
  receipt_delivery_method?: string | null;
  receipt_issued_at?: string | null;
  limit_basis?: string | null;
  sales_team?:
    | number
    | string
    | { id?: number | string; name?: string; sales_team_name?: string }
    | null;
  credit_limit_active?: number | null;
  credit_limit?: number | null;
  payment_term_active?: number | null;
  payment_term?: number | null;
  limit_customer_overdue_active?: number | null;
  limit_customer_overdue?: number | null;
  tax_status?: number | null;
  npwp?: string | null;
  sync_saga_id?: string | null;
  sync_last_error?: string | null;
  sync_last_rollback_error?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

type DetailTab =
  | "company"
  | "finance"
  | "hierarchy"
  | "address"
  | "contacts"
  | "activity";

interface AddressRow {
  id: number;
  idx?: number | null;
  type?: string | null;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  village?: string | null;
  province?: string | null;
  postal_code?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
  parent_id?: number | null;
  parent_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface WilayahOption {
  code: string;
  name: string;
}

interface ShippingAreaState {
  provinceCode: string;
  regencyCode: string;
  regencies: WilayahOption[];
  districts: WilayahOption[];
}

interface RekeningOption {
  name: string;
  nama_rekening?: string;
  bank?: string;
}

interface SalesTeamOption {
  id: number | string;
  code: string;
  label: string;
}

interface BranchLookupRow {
  id?: number | null;
  branch_name?: string | null;
  city?: string | null;
}

type PolicyLevel = "nbid" | "gpid" | "gcid" | "bcid" | string;

interface BranchCustomerPolicyScopeRow {
  id: number;
  name?: string | null;
  customer_name?: string | null;
  branch_code?: string | null;
  branch_name?: string | null;
  status?: string | null;
}

interface BranchCustomerPolicyScope {
  id?: number | null;
  level?: PolicyLevel | null;
  total?: number | null;
  bcs?: BranchCustomerPolicyScopeRow[] | null;
}

interface BranchCustomerPolicyRelation {
  gc_code?: string | null;
  gc_name?: string | null;
  gcid?: number | null;
  gp_code?: string | null;
  gp_name?: string | null;
  gpid?: number | null;
  nb_code?: string | null;
  nb_name?: string | null;
  nbid?: number | null;
}

interface BranchCustomerPolicyActiveData {
  bc_policy_field?: {
    credit_limit?: number | null;
    credit_limit_active?: number | null;
    limit_customer_overdue?: number | null;
    limit_customer_overdue_active?: number | null;
    payment_term?: number | null;
    payment_term_active?: number | null;
  } | null;
  policy?: {
    credit_limit_level?: PolicyLevel | null;
    credit_limit_id?: number | null;
    final_credit_limit?: number | null;
    payment_term_level?: PolicyLevel | null;
    payment_term_id?: number | null;
    final_payment_term?: number | null;
    limit_overdue_level?: PolicyLevel | null;
    limit_overdue_id?: number | null;
    final_limit_overdue?: number | null;
  } | null;
  relation?: BranchCustomerPolicyRelation | null;
  scopes?: {
    credit_limit?: BranchCustomerPolicyScope | null;
    payment_term?: BranchCustomerPolicyScope | null;
    limit_overdue?: BranchCustomerPolicyScope | null;
  } | null;
}

const PRODUCT_NEED_OPTIONS = ["Bahan Baku Springbed & Sofa", "Furniture"];
const PAYMENT_METHOD_OPTIONS = ["Transfer", "Giro", "Cash"];
const TAX_STATUS_OPTIONS = [
  { value: 0, label: "Non PKP" },
  { value: 1, label: "PKP" },
];
const ERP_PAGE_SIZE = 20;
const WILAYAH_BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

function normalizeName(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function matchByName(options: WilayahOption[], value?: string | null) {
  const target = normalizeName(value);
  if (!target) return null;
  return options.find((opt) => normalizeName(opt.name) === target) || null;
}

function emptyShippingAreaState(): ShippingAreaState {
  return {
    provinceCode: "",
    regencyCode: "",
    regencies: [],
    districts: [],
  };
}

function normalizeOptionalEmail(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeNpwpDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function mergeUniqueByName<T extends { name: string }>(
  current: T[],
  incoming: T[],
): T[] {
  const map = new Map<string, T>();
  for (const item of [...current, ...incoming]) {
    const key = item.name.trim();
    if (!key) continue;
    map.set(key, item);
  }
  return Array.from(map.values());
}

async function fetchWilayah(path: string): Promise<WilayahOption[]> {
  const res = await fetch(`${WILAYAH_BASE_URL}/${path}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed loading wilayah (${res.status})`);
  }
  const json = await res.json();
  const rows: Array<{ code?: string; id?: string; name?: string }> =
    Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  return rows
    .map((row) => ({
      code: String(row.code || row.id || ""),
      name: String(row.name || ""),
    }))
    .filter((row) => Boolean(row.code && row.name));
}

function toNum(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const p = Number.parseInt(v, 10);
    if (Number.isFinite(p)) return p;
  }
  return undefined;
}

function dt(v?: string | null): string {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

function normalizeDecimalInput(value: string): string {
  return value.replace(/[^\d.,-]/g, "").replace(",", ".");
}

function parseNullableFloat(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNullableInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNullableNumber(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID").format(Number(value));
}

function renderReadOnlyField(
  label: string,
  value: React.ReactNode,
  className = "",
) {
  const isEmptyString = typeof value === "string" && value.trim() === "";
  const content =
    value === null || value === undefined || isEmptyString ? "-" : value;

  return (
    <div className={className}>
      <p className="mb-1.5 text-[11px] font-medium text-slate-600">{label}</p>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {content}
      </div>
    </div>
  );
}

function getPolicyLevelBadge(level?: PolicyLevel | null): string {
  const normalized = String(level || "")
    .trim()
    .toLowerCase();
  if (normalized === "nbid") return "NB";
  if (normalized === "gpid") return "GP";
  if (normalized === "gcid") return "GC";
  if (normalized === "bcid") return "BC";
  return normalized ? normalized.toUpperCase() : "-";
}

function getPolicyLevelName(
  level: PolicyLevel | null | undefined,
  relation?: BranchCustomerPolicyRelation | null,
  fallbackBc?: string,
): string {
  const normalized = String(level || "")
    .trim()
    .toLowerCase();
  if (normalized === "nbid") {
    return (
      [relation?.nb_name, relation?.nb_code].filter(Boolean).join(" - ") || "-"
    );
  }
  if (normalized === "gpid") {
    return (
      [relation?.gp_name, relation?.gp_code].filter(Boolean).join(" - ") || "-"
    );
  }
  if (normalized === "gcid") {
    return (
      [relation?.gc_name, relation?.gc_code].filter(Boolean).join(" - ") || "-"
    );
  }
  if (normalized === "bcid") {
    return fallbackBc || "-";
  }
  return "-";
}

function buildEditSnapshot(input: {
  editedOwner: string;
  editedOwnerPhone: string;
  editedOwnerEmail: string;
  editedOwnerPlaceOfBirth: string;
  editedOwnerDateOfBirth: string;
  editedProductNeed: string;
  editedNotes: string;
  editedPaymentAccount: string;
  editedPaymentMethod: string;
  editedSalesTeam: string;
  editedTaxStatus: number;
  editedNpwp: string;
  editedCreditLimitActive: number;
  editedCreditLimit: string;
  editedPaymentTermActive: number;
  editedPaymentTerm: string;
  editedLimitCustomerOverdueActive: number;
  editedLimitCustomerOverdue: string;
  editedRows: AddressRow[];
  deletedRowIds: number[];
}) {
  return JSON.stringify({
    editedOwner: input.editedOwner.trim(),
    editedOwnerPhone: input.editedOwnerPhone.trim(),
    editedOwnerEmail: input.editedOwnerEmail.trim(),
    editedOwnerPlaceOfBirth: input.editedOwnerPlaceOfBirth.trim(),
    editedOwnerDateOfBirth: input.editedOwnerDateOfBirth,
    editedProductNeed: input.editedProductNeed.trim(),
    editedNotes: input.editedNotes.trim(),
    editedPaymentAccount: input.editedPaymentAccount.trim(),
    editedPaymentMethod: input.editedPaymentMethod.trim(),
    editedSalesTeam: input.editedSalesTeam.trim(),
    editedTaxStatus: input.editedTaxStatus,
    editedNpwp: normalizeNpwpDigits(input.editedNpwp),
    editedCreditLimitActive: input.editedCreditLimitActive,
    editedCreditLimit: normalizeDecimalInput(input.editedCreditLimit),
    editedPaymentTermActive: input.editedPaymentTermActive,
    editedPaymentTerm: input.editedPaymentTerm.trim(),
    editedLimitCustomerOverdueActive: input.editedLimitCustomerOverdueActive,
    editedLimitCustomerOverdue: input.editedLimitCustomerOverdue.trim(),
    editedRows: input.editedRows.map((row) => ({
      id: row.id,
      type: row.type || "",
      label: row.label || "",
      address: row.address || "",
      city: row.city || "",
      district: row.district || "",
      village: row.village || "",
      province: row.province || "",
      postal_code: row.postal_code || "",
      pic_name: row.pic_name || "",
      pic_phone: row.pic_phone || "",
      is_default: row.is_default ? 1 : 0,
    })),
    deletedRowIds: [...input.deletedRowIds].sort((a, b) => a - b),
  });
}

export function BCDetailModal({
  isOpen,
  onClose,
  bc,
  onBCUpdate,
  onViewBC,
  onViewGP,
  onViewGC,
}: BCDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [detail, setDetail] = useState<BCDetailApi | null>(null);
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [gp, setGp] = useState<GroupParent | null>(null);
  const [gc, setGc] = useState<GroupCustomer | null>(null);
  const [nb, setNb] = useState<{ code: string; name: string } | null>(null);
  const [relatedBCs, setRelatedBCs] = useState<BranchCustomer[]>([]);
  const [relatedBCsLoading, setRelatedBCsLoading] = useState(false);
  const [relatedBCsError, setRelatedBCsError] = useState<string | null>(null);
  const [hierarchyExpanded, setHierarchyExpanded] = useState(true);
  const [selectedHierarchyBcId, setSelectedHierarchyBcId] = useState<
    number | null
  >(null);
  const [selectedHierarchyParent, setSelectedHierarchyParent] = useState<
    "gp" | null
  >(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("company");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedOwner, setEditedOwner] = useState("");
  const [editedOwnerPhone, setEditedOwnerPhone] = useState("");
  const [editedOwnerEmail, setEditedOwnerEmail] = useState("");
  const [editedOwnerPlaceOfBirth, setEditedOwnerPlaceOfBirth] = useState("");
  const [editedOwnerDateOfBirth, setEditedOwnerDateOfBirth] = useState("");
  const [editedProductNeed, setEditedProductNeed] = useState("");
  const [editedNotes, setEditedNotes] = useState("");
  const [editedPaymentAccount, setEditedPaymentAccount] = useState("");
  const [editedPaymentMethod, setEditedPaymentMethod] = useState("");
  const [editedSalesTeam, setEditedSalesTeam] = useState("");
  const [editedTaxStatus, setEditedTaxStatus] = useState(0);
  const [editedNpwp, setEditedNpwp] = useState("");
  const [editedCreditLimitActive, setEditedCreditLimitActive] = useState(0);
  const [editedCreditLimit, setEditedCreditLimit] = useState("");
  const [editedPaymentTermActive, setEditedPaymentTermActive] = useState(0);
  const [editedPaymentTerm, setEditedPaymentTerm] = useState("");
  const [
    editedLimitCustomerOverdueActive,
    setEditedLimitCustomerOverdueActive,
  ] = useState(0);
  const [editedLimitCustomerOverdue, setEditedLimitCustomerOverdue] =
    useState("");
  const [editedRows, setEditedRows] = useState<AddressRow[]>([]);
  const [deletedRowIds, setDeletedRowIds] = useState<number[]>([]);
  const [editSnapshot, setEditSnapshot] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [shippingAreaStates, setShippingAreaStates] = useState<
    ShippingAreaState[]
  >([]);
  const [paymentAccountInfo, setPaymentAccountInfo] =
    useState<PaymentAccountInfo | null>(null);
  const [paymentAccountError, setPaymentAccountError] = useState<string | null>(
    null,
  );
  const [optionError, setOptionError] = useState<string | null>(null);
  const [rekeningOptions, setRekeningOptions] = useState<RekeningOption[]>([]);
  const [salesTeamOptions, setSalesTeamOptions] = useState<SalesTeamOption[]>(
    [],
  );
  const [rekeningLoading, setRekeningLoading] = useState(false);
  const [rekeningHasMore, setRekeningHasMore] = useState(false);
  const [rekeningStart, setRekeningStart] = useState(0);
  const [policyActiveInfo, setPolicyActiveInfo] =
    useState<BranchCustomerPolicyActiveData | null>(null);
  const [policyActiveInfoLoading, setPolicyActiveInfoLoading] = useState(false);
  const [policyActiveInfoError, setPolicyActiveInfoError] = useState<
    string | null
  >(null);
  const regencyCache = useRef<Record<string, WilayahOption[]>>({});
  const districtCache = useRef<Record<string, WilayahOption[]>>({});
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const branchIdForErp = toNum(detail?.branch) ?? bc?.branch_id;

  const resolveSalesTeamValue = useCallback(
    (value: BCDetailApi["sales_team"]): string => {
      if (typeof value === "object" && value) {
        if (value.id !== undefined && value.id !== null)
          return String(value.id);
        if (value.name) return value.name;
      }
      if (typeof value === "number" || typeof value === "string") {
        return String(value);
      }
      return "";
    },
    [],
  );

  const resolveSalesTeamLabel = useCallback(
    (value: BCDetailApi["sales_team"]): string => {
      if (typeof value === "object" && value) {
        return (
          value.sales_team_name ||
          value.name ||
          (value.id ? String(value.id) : "-")
        );
      }
      const raw =
        typeof value === "number" || typeof value === "string"
          ? String(value)
          : "";
      if (!raw) return "-";
      const match = salesTeamOptions.find(
        (option) => String(option.id) === raw || option.code === raw,
      );
      return match?.label || raw;
    },
    [salesTeamOptions],
  );

  const load = useCallback(async () => {
    if (!isOpen || !bc || !token || !isAuthenticated) return;
    setLoading(true);
    setDetailError(null);
    setAddressError(null);
    setDetail(null);
    setRows([]);
    setGp(null);
    setGc(null);
    setNb(null);
    setRelatedBCs([]);
    setRelatedBCsError(null);
    try {
      const dRes = await apiFetch(
        getQueryUrl(`${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/${bc.id}`, {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      if (!dRes.ok)
        throw new Error(`Gagal memuat detail Branch Customer (${dRes.status})`);
      const dJson = await dRes.json();
      const dRow = (dJson?.data || null) as BCDetailApi | null;
      setDetail(dRow);

      const parentId = dRow?.id ?? bc.id;
      const addressRows = await fetchAllQueryRows<AddressRow>({
        endpoint: "/api/resource/customer_address",
        spec: {
          fields: ["*"],
          filters: [
            ["parent_type", "=", "branch_customer"],
            ["parent_id", "=", parentId],
          ],
        },
        token,
        errorMessage: "Gagal memuat customer_address",
      }).catch((error) => {
        setAddressError(error instanceof Error ? error.message : String(error));
        return [];
      });
      const sorted = addressRows.sort((a: AddressRow, b: AddressRow) => {
        const idxA = toNum(a.idx) ?? Number.MAX_SAFE_INTEGER;
        const idxB = toNum(b.idx) ?? Number.MAX_SAFE_INTEGER;
        if (idxA !== idxB) return idxA - idxB;
        return (
          (toNum(a.id) ?? Number.MAX_SAFE_INTEGER) -
          (toNum(b.id) ?? Number.MAX_SAFE_INTEGER)
        );
      });
      setRows(sorted);
      setEditedRows(sorted);

      const gcid = toNum(dRow?.gcid) ?? bc.gc_id;
      if (!gcid) return;
      const gcRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
          fields: ["*"],
          filters: [["id", "=", gcid]],
          limit: 1,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const gcJson = gcRes.ok ? await gcRes.json() : { data: [] };
      const gcRow = Array.isArray(gcJson?.data) ? gcJson.data[0] : null;
      if (!gcRow) return;
      const gcMapped: GroupCustomer = {
        id: Number(gcRow.id),
        name: gcRow.name || `GC${gcRow.id}`,
        gc_name: gcRow.gc_name || "-",
        gp_id: Number(gcRow.gpid || 0),
        created_at: gcRow.created_at || new Date(0).toISOString(),
        updated_at:
          gcRow.updated_at || gcRow.created_at || new Date(0).toISOString(),
        disabled: Number(gcRow.disabled || 0),
      };
      setGc(gcMapped);

      setRelatedBCsLoading(true);
      try {
        const bcRows = await fetchAllQueryRows<BCDetailApi>({
          endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
          spec: {
            fields: ["*", "created_by.full_name", "updated_by.full_name"],
            filters: [["gcid", "=", gcMapped.id]],
          },
          token,
          errorMessage: "Gagal memuat branch customer pada hierarki",
        });

        const branchIds = Array.from(
          new Set(
            bcRows
              .map((row) =>
                row.branch && typeof row.branch === "object"
                  ? toNum(row.branch.id)
                  : toNum(row.branch),
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
            const branchRows: BranchLookupRow[] = Array.isArray(
              branchJson?.data,
            )
              ? branchJson.data
              : [];
            branchRows.forEach((row) => {
              if (!row.id) return;
              branchMap.set(Number(row.id), {
                name: row.branch_name || undefined,
                city: row.city || undefined,
              });
            });
          }
        }

        const mappedBCs: BranchCustomer[] = bcRows.map((row) => {
          const branchId =
            row.branch && typeof row.branch === "object"
              ? toNum(row.branch.id) || 0
              : toNum(row.branch) || 0;
          const branchRef = branchMap.get(branchId);
          const directBranchName =
            row.branch && typeof row.branch === "object"
              ? row.branch.branch_name || undefined
              : undefined;
          const directBranchCity =
            row.branch && typeof row.branch === "object"
              ? row.branch.city || undefined
              : undefined;

          return {
            id: Number(row.id),
            name: row.name || `BC${row.id}`,
            gc_id: gcMapped.id,
            gc_name: gcMapped.gc_name,
            gc_code: gcMapped.name,
            gp_name: bc.gp_name,
            gp_code: bc.gp_code,
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
            payment_method: row.payment_method || undefined,
            payment_account: row.payment_account || undefined,
            receipt_delivery_method: row.receipt_delivery_method || undefined,
            receipt_issued_at: row.receipt_issued_at || undefined,
            notes: row.notes || undefined,
            tax_status: row.tax_status ?? undefined,
            npwp: row.npwp || undefined,
            created_at: row.created_at || new Date(0).toISOString(),
            updated_at:
              row.updated_at || row.created_at || new Date(0).toISOString(),
            created_by:
              (typeof row.created_by === "object"
                ? row.created_by?.full_name
                : undefined) ||
              row["created_by.full_name"] ||
              undefined,
            updated_by:
              (typeof row.updated_by === "object"
                ? row.updated_by?.full_name
                : undefined) ||
              row["updated_by.full_name"] ||
              undefined,
            disabled: Number(row.disabled || 0),
          };
        });

        setRelatedBCs(
          mappedBCs.sort((a, b) =>
            a.name.localeCompare(b.name, "id-ID"),
          ),
        );
      } catch (error) {
        setRelatedBCs([]);
        setRelatedBCsError(
          error instanceof Error
            ? error.message
            : "Gagal memuat hierarki branch customer",
        );
      } finally {
        setRelatedBCsLoading(false);
      }

      if (!gcMapped.gp_id) return;

      const gpRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
          fields: ["*"],
          filters: [["id", "=", gcMapped.gp_id]],
          limit: 1,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const gpJson = gpRes.ok ? await gpRes.json() : { data: [] };
      const gpRow = Array.isArray(gpJson?.data) ? gpJson.data[0] : null;
      if (!gpRow) return;
      const gpMapped: GroupParent = {
        id: Number(gpRow.id),
        name: gpRow.name || `GP${gpRow.id}`,
        gp_name: gpRow.gp_name || "-",
        created_at: gpRow.created_at || new Date(0).toISOString(),
        updated_at:
          gpRow.updated_at || gpRow.created_at || new Date(0).toISOString(),
        disabled: Number(gpRow.disabled || 0),
      };
      setGp(gpMapped);
      const nbId =
        typeof gpRow.nbid === "number" ? gpRow.nbid : toNum(gpRow.nbid?.id);
      if (!nbId) return;
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
      const nbRow = Array.isArray(nbJson?.data) ? nbJson.data[0] : null;
      if (nbRow)
        setNb({
          code: nbRow.name || `NB${nbRow.id}`,
          name: nbRow.nb_name || nbRow.name || "-",
        });
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [isOpen, bc, token, isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isOpen) return;
    setIsEditMode(false);
    setIsSaving(false);
    setShowExitConfirm(false);
    setDeletedRowIds([]);
    setEditSnapshot("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("company");
    setHierarchyExpanded(true);
    setSelectedHierarchyBcId(bc?.id ? Number(bc.id) : null);
    setSelectedHierarchyParent(null);
  }, [isOpen, bc?.id]);

  useEffect(() => {
    if (!isOpen) return;
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeTab, isOpen]);

  useEffect(() => {
    let cancelled = false;

    async function loadPolicyActiveInfo() {
      const currentBcCode = detail?.name || bc?.name || "";
      if (!isOpen || !token || !isAuthenticated || !currentBcCode) {
        setPolicyActiveInfo(null);
        setPolicyActiveInfoError(null);
        setPolicyActiveInfoLoading(false);
        return;
      }

      setPolicyActiveInfoLoading(true);
      setPolicyActiveInfoError(null);

      try {
        const response = await apiFetch(
          getApiUrl(
            `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_customer_policy_active_info_by_bc`,
          ),
          {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({ bcid: currentBcCode }),
          },
          token,
        );

        if (!response.ok) {
          throw new Error(
            `Gagal memuat policy aktif branch customer (${response.status})`,
          );
        }

        const json = (await response.json()) as {
          data?: BranchCustomerPolicyActiveData | null;
        };

        if (!cancelled) {
          setPolicyActiveInfo(json?.data || null);
        }
      } catch (error) {
        if (!cancelled) {
          setPolicyActiveInfo(null);
          setPolicyActiveInfoError(
            error instanceof Error
              ? error.message
              : "Gagal memuat policy aktif branch customer",
          );
        }
      } finally {
        if (!cancelled) {
          setPolicyActiveInfoLoading(false);
        }
      }
    }

    void loadPolicyActiveInfo();

    return () => {
      cancelled = true;
    };
  }, [bc?.name, detail?.name, isAuthenticated, isOpen, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadPaymentAccount() {
      const branchId = toNum(detail?.branch) ?? bc?.branch_id;
      const paymentAccount = detail?.payment_account || "";
      if (!isOpen || !token || !branchId || !paymentAccount) {
        setPaymentAccountInfo(null);
        setPaymentAccountError(null);
        return;
      }

      try {
        setPaymentAccountError(null);
        const info = await fetchPaymentAccountInfo({
          branchId,
          paymentAccount,
          authToken: token,
        });
        if (!cancelled) {
          setPaymentAccountInfo(info);
        }
      } catch (error) {
        if (!cancelled) {
          setPaymentAccountInfo(null);
          setPaymentAccountError(
            error instanceof Error ? error.message : "Gagal memuat rekening",
          );
        }
      }
    }

    void loadPaymentAccount();

    return () => {
      cancelled = true;
    };
  }, [bc?.branch_id, detail?.branch, detail?.payment_account, isOpen, token]);

  const loadRekeningOptions = useCallback(
    async (start: number) => {
      if (!isEditMode || !token || !branchIdForErp) return;
      if (start === 0) setRekeningLoading(true);
      else setRekeningLoading(true);
      try {
        setOptionError(null);
        const rows = await fetchBranchErpResourcePage<RekeningOption>({
          branchId: branchIdForErp,
          authToken: token,
          resource: "Rekening",
          fields: ["name", "nama_rekening", "bank"],
          limit: ERP_PAGE_SIZE,
          start,
        });
        setRekeningOptions((prev) =>
          start === 0
            ? mergeUniqueByName([], rows)
            : mergeUniqueByName(prev, rows),
        );
        setRekeningStart(start + rows.length);
        setRekeningHasMore(rows.length === ERP_PAGE_SIZE);
      } catch (error) {
        setOptionError(
          error instanceof Error
            ? error.message
            : "Gagal memuat pilihan rekening",
        );
      } finally {
        setRekeningLoading(false);
      }
    },
    [branchIdForErp, isEditMode, token],
  );

  const loadSalesTeamOptions = useCallback(async () => {
    if (!token) return;
    try {
      const rows = await fetchAllQueryRows<{
        id?: number | string | null;
        name?: string | null;
        sales_team_name?: string | null;
      }>({
        endpoint: API_CONFIG.ENDPOINTS.SALES_TEAM,
        spec: {
          fields: ["id", "name", "sales_team_name"],
        },
        token,
        errorMessage: "Gagal memuat sales team",
      });
      setSalesTeamOptions(
        rows
          .filter((row) => row.id !== undefined && row.id !== null)
          .map((row) => ({
            id: row.id as number | string,
            code: row.name || String(row.id),
            label: row.sales_team_name || row.name || String(row.id),
          })),
      );
    } catch (error) {
      setOptionError(
        error instanceof Error
          ? error.message
          : "Gagal memuat pilihan sales team",
      );
    }
  }, [token]);

  useEffect(() => {
    if (!isEditMode) {
      setOptionError(null);
      setRekeningOptions([]);
      setSalesTeamOptions([]);
      setRekeningHasMore(false);
      setRekeningStart(0);
      return;
    }
    if (!token || !branchIdForErp) {
      setOptionError("Branch belum tersedia untuk memuat data ERP.");
      return;
    }
    void loadRekeningOptions(0);
    void loadSalesTeamOptions();
  }, [
    branchIdForErp,
    isEditMode,
    loadRekeningOptions,
    loadSalesTeamOptions,
    token,
  ]);

  const getRegencies = useCallback(async (provinceCode: string) => {
    if (!provinceCode) return [];
    if (regencyCache.current[provinceCode])
      return regencyCache.current[provinceCode];
    const rows = await fetchWilayah(`regencies/${provinceCode}.json`);
    regencyCache.current[provinceCode] = rows;
    return rows;
  }, []);

  const getDistricts = useCallback(async (regencyCode: string) => {
    if (!regencyCode) return [];
    if (districtCache.current[regencyCode])
      return districtCache.current[regencyCode];
    const rows = await fetchWilayah(`districts/${regencyCode}.json`);
    districtCache.current[regencyCode] = rows;
    return rows;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadProvinces() {
      if (!isOpen) return;
      try {
        const rows = await fetchWilayah("provinces.json");
        if (!cancelled) setProvinces(rows);
      } catch {
        if (!cancelled) setProvinces([]);
      }
    }
    void loadProvinces();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;
    async function syncAreaStates() {
      if (!isEditMode || editedRows.length === 0 || provinces.length === 0) {
        setShippingAreaStates(editedRows.map(() => emptyShippingAreaState()));
        return;
      }
      const next = await Promise.all(
        editedRows.map(async (row) => {
          const province = matchByName(provinces, row.province);
          if (!province) return emptyShippingAreaState();
          const regencies = await getRegencies(province.code);
          const regency = matchByName(regencies, row.city);
          if (!regency) {
            return {
              provinceCode: province.code,
              regencyCode: "",
              regencies,
              districts: [],
            };
          }
          const districts = await getDistricts(regency.code);
          return {
            provinceCode: province.code,
            regencyCode: regency.code,
            regencies,
            districts,
          };
        }),
      );
      if (!cancelled) setShippingAreaStates(next);
    }
    void syncAreaStates();
    return () => {
      cancelled = true;
    };
  }, [editedRows, getDistricts, getRegencies, isEditMode, provinces]);

  useEffect(() => {
    if (!isOpen || !bc) return;
    if (isEditMode) return;
    setEditedOwner((detail?.branch_owner || bc.owner_name || "").trim());
    setEditedOwnerPhone(
      (detail?.branch_owner_phone || bc.owner_phone || "").trim(),
    );
    setEditedOwnerEmail(
      (detail?.branch_owner_email || bc.owner_email || "").trim(),
    );
    setEditedOwnerPlaceOfBirth(
      (detail?.branch_owner_place_of_birth || "").trim(),
    );
    setEditedOwnerDateOfBirth(
      detail?.branch_owner_date_of_birth?.split("T")[0] || "",
    );
    setEditedProductNeed((detail?.product_need || "").trim());
    setEditedNotes((detail?.notes || "").trim());
    setEditedPaymentAccount((detail?.payment_account || "").trim());
    setEditedPaymentMethod((detail?.payment_method || "").trim());
    setEditedSalesTeam(resolveSalesTeamValue(detail?.sales_team));
    setEditedTaxStatus(Number(detail?.tax_status || 0));
    setEditedNpwp((detail?.npwp || "").trim());
    setEditedCreditLimitActive(Number(detail?.credit_limit_active || 0));
    setEditedCreditLimit(
      detail?.credit_limit === null || detail?.credit_limit === undefined
        ? ""
        : String(detail.credit_limit),
    );
    setEditedPaymentTermActive(Number(detail?.payment_term_active || 0));
    setEditedPaymentTerm(
      detail?.payment_term === null || detail?.payment_term === undefined
        ? ""
        : String(detail.payment_term),
    );
    setEditedLimitCustomerOverdueActive(
      Number(detail?.limit_customer_overdue_active || 0),
    );
    setEditedLimitCustomerOverdue(
      detail?.limit_customer_overdue === null ||
        detail?.limit_customer_overdue === undefined
        ? ""
        : String(detail.limit_customer_overdue),
    );
    setOptionError(null);
  }, [
    isOpen,
    bc,
    detail?.branch_owner,
    detail?.branch_owner_phone,
    detail?.branch_owner_email,
    detail?.branch_owner_place_of_birth,
    detail?.branch_owner_date_of_birth,
    detail?.product_need,
    detail?.notes,
    detail?.payment_account,
    detail?.payment_method,
    detail?.sales_team,
    detail?.tax_status,
    detail?.npwp,
    detail?.credit_limit_active,
    detail?.credit_limit,
    detail?.payment_term_active,
    detail?.payment_term,
    detail?.limit_customer_overdue_active,
    detail?.limit_customer_overdue,
    isEditMode,
    resolveSalesTeamValue,
  ]);

  const hasUnsavedChanges =
    isEditMode &&
    editSnapshot !==
      buildEditSnapshot({
        editedOwner,
        editedOwnerPhone,
        editedOwnerEmail,
        editedOwnerPlaceOfBirth,
        editedOwnerDateOfBirth,
        editedProductNeed,
        editedNotes,
        editedPaymentAccount,
        editedPaymentMethod,
        editedSalesTeam,
        editedTaxStatus,
        editedNpwp,
        editedCreditLimitActive,
        editedCreditLimit,
        editedPaymentTermActive,
        editedPaymentTerm,
        editedLimitCustomerOverdueActive,
        editedLimitCustomerOverdue,
        editedRows,
        deletedRowIds,
      });

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || isSaving) return;
      if (hasUnsavedChanges) {
        setShowExitConfirm(true);
        return;
      }
      setShowExitConfirm(false);
      setIsEditMode(false);
      setDeletedRowIds([]);
      setEditSnapshot("");
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, hasUnsavedChanges, isSaving, onClose]);

  const startEdit = () => {
    if (!bc) return;
    const owner = (detail?.branch_owner || bc.owner_name || "").trim();
    const ownerPhone = (
      detail?.branch_owner_phone ||
      bc.owner_phone ||
      ""
    ).trim();
    const ownerEmail = (
      detail?.branch_owner_email ||
      bc.owner_email ||
      ""
    ).trim();
    const ownerPob = (detail?.branch_owner_place_of_birth || "").trim();
    const ownerDob = detail?.branch_owner_date_of_birth?.split("T")[0] || "";
    const productNeed = (detail?.product_need || "").trim();
    const notes = (detail?.notes || "").trim();
    const paymentAccount = (detail?.payment_account || "").trim();
    const paymentMethod = (detail?.payment_method || "").trim();
    const salesTeam = resolveSalesTeamValue(detail?.sales_team).trim();
    const taxStatus = Number(detail?.tax_status || 0);
    const npwp = (detail?.npwp || "").trim();
    const creditLimitActive = Number(detail?.credit_limit_active || 0);
    const creditLimit =
      detail?.credit_limit === null || detail?.credit_limit === undefined
        ? ""
        : String(detail.credit_limit);
    const paymentTermActive = Number(detail?.payment_term_active || 0);
    const paymentTerm =
      detail?.payment_term === null || detail?.payment_term === undefined
        ? ""
        : String(detail.payment_term);
    const limitCustomerOverdueActive = Number(
      detail?.limit_customer_overdue_active || 0,
    );
    const limitCustomerOverdue =
      detail?.limit_customer_overdue === null ||
      detail?.limit_customer_overdue === undefined
        ? ""
        : String(detail.limit_customer_overdue);
    const rowSnapshot = rows.map((row) => ({ ...row }));
    setEditedOwner(owner);
    setEditedOwnerPhone(ownerPhone);
    setEditedOwnerEmail(ownerEmail);
    setEditedOwnerPlaceOfBirth(ownerPob);
    setEditedOwnerDateOfBirth(ownerDob);
    setEditedProductNeed(productNeed);
    setEditedNotes(notes);
    setEditedPaymentAccount(paymentAccount);
    setEditedPaymentMethod(paymentMethod);
    setEditedSalesTeam(salesTeam);
    setEditedTaxStatus(taxStatus);
    setEditedNpwp(npwp);
    setEditedCreditLimitActive(creditLimitActive);
    setEditedCreditLimit(creditLimit);
    setEditedPaymentTermActive(paymentTermActive);
    setEditedPaymentTerm(paymentTerm);
    setEditedLimitCustomerOverdueActive(limitCustomerOverdueActive);
    setEditedLimitCustomerOverdue(limitCustomerOverdue);
    setEditedRows(rowSnapshot);
    setDeletedRowIds([]);
    setEditSnapshot(
      buildEditSnapshot({
        editedOwner: owner,
        editedOwnerPhone: ownerPhone,
        editedOwnerEmail: ownerEmail,
        editedOwnerPlaceOfBirth: ownerPob,
        editedOwnerDateOfBirth: ownerDob,
        editedProductNeed: productNeed,
        editedNotes: notes,
        editedPaymentAccount: paymentAccount,
        editedPaymentMethod: paymentMethod,
        editedSalesTeam: salesTeam,
        editedTaxStatus: taxStatus,
        editedNpwp: npwp,
        editedCreditLimitActive: creditLimitActive,
        editedCreditLimit: creditLimit,
        editedPaymentTermActive: paymentTermActive,
        editedPaymentTerm: paymentTerm,
        editedLimitCustomerOverdueActive: limitCustomerOverdueActive,
        editedLimitCustomerOverdue: limitCustomerOverdue,
        editedRows: rowSnapshot,
        deletedRowIds: [],
      }),
    );
    setIsEditMode(true);
  };

  const closeDirectly = () => {
    setShowExitConfirm(false);
    setIsEditMode(false);
    setDeletedRowIds([]);
    setEditSnapshot("");
    onClose();
  };

  const attemptClose = () => {
    if (isSaving) return;
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
      return;
    }
    closeDirectly();
  };

  const cancelEdit = () => {
    setEditedRows(rows);
    setDeletedRowIds([]);
    setEditSnapshot("");
    setShowExitConfirm(false);
    setOptionError(null);
    setIsEditMode(false);
  };

  const updateEditedRow = (
    rowId: number,
    field: keyof AddressRow,
    value: string,
  ) => {
    setEditedRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  const onShippingProvinceChange = async (
    idx: number,
    provinceCode: string,
  ) => {
    const selected = provinces.find((x) => x.code === provinceCode) || null;
    const row = editedRows[idx];
    if (!row) return;
    updateEditedRow(row.id, "province", selected?.name || "");
    updateEditedRow(row.id, "city", "");
    updateEditedRow(row.id, "district", "");
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        provinceCode,
        regencyCode: "",
        regencies: [],
        districts: [],
      };
      return next;
    });
    if (!provinceCode) return;
    try {
      const regencies = await getRegencies(provinceCode);
      setShippingAreaStates((prev) => {
        const next = [...prev];
        next[idx] = {
          provinceCode,
          regencyCode: "",
          regencies,
          districts: [],
        };
        return next;
      });
    } catch (e) {
      setAddressError(
        e instanceof Error ? e.message : "Gagal memuat kota/kabupaten.",
      );
    }
  };

  const onShippingRegencyChange = async (idx: number, regencyCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const row = editedRows[idx];
    if (!row) return;
    const selected =
      state.regencies.find((x) => x.code === regencyCode) || null;
    updateEditedRow(row.id, "city", selected?.name || "");
    updateEditedRow(row.id, "district", "");
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        ...state,
        regencyCode,
        districts: [],
      };
      return next;
    });
    if (!regencyCode) return;
    try {
      const districts = await getDistricts(regencyCode);
      setShippingAreaStates((prev) => {
        const next = [...prev];
        const current = next[idx] || emptyShippingAreaState();
        next[idx] = {
          ...current,
          regencyCode,
          districts,
        };
        return next;
      });
    } catch (e) {
      setAddressError(
        e instanceof Error ? e.message : "Gagal memuat kecamatan.",
      );
    }
  };

  const onShippingDistrictChange = (idx: number, districtCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const row = editedRows[idx];
    if (!row) return;
    const selected =
      state.districts.find((x) => x.code === districtCode) || null;
    updateEditedRow(row.id, "district", selected?.name || "");
  };

  const addShippingAddress = () => {
    if (!bc) return;
    const nextId = -Date.now();
    setEditedRows((prev) => [
      ...prev,
      {
        id: nextId,
        parent_id: bc.id,
        parent_type: "branch_customer",
        type: "shipping",
        label: "Alamat Pengiriman",
        address: "",
        city: "",
        district: "",
        village: "",
        province: "",
        postal_code: "",
        pic_name: "",
        pic_phone: "",
        is_default: 0,
      },
    ]);
    setShippingAreaStates((prev) => [...prev, emptyShippingAreaState()]);
  };

  const removeAddress = (idx: number) => {
    const target = editedRows[idx];
    if (!target) return;
    if (target.id > 0) {
      setDeletedRowIds((prev) => [...new Set([...prev, target.id])]);
    }
    setEditedRows((prev) => prev.filter((_, i) => i !== idx));
    setShippingAreaStates((prev) => prev.filter((_, i) => i !== idx));
  };

  const applyEdit = async () => {
    if (!bc || !token || !isAuthenticated) return;

    const normalizedEmail = normalizeOptionalEmail(editedOwnerEmail);
    if (normalizedEmail && !isValidEmail(normalizedEmail)) {
      alert("Format email penanggung jawab tidak valid.");
      return;
    }

    const normalizedNpwp = normalizeNpwpDigits(editedNpwp);
    const creditLimit = parseNullableFloat(editedCreditLimit);
    const paymentTerm = parseNullableInt(editedPaymentTerm);
    const limitCustomerOverdue = parseNullableInt(editedLimitCustomerOverdue);
    if (editedTaxStatus === 1) {
      if (
        !normalizedNpwp ||
        normalizedNpwp.length < 15 ||
        normalizedNpwp.length > 16
      ) {
        alert("Nomor NPWP wajib 15-16 digit saat Tax Status = PKP.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload = {
        branch_owner: editedOwner.trim() || null,
        branch_owner_phone: editedOwnerPhone.trim() || null,
        branch_owner_email: normalizedEmail,
        branch_owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
        branch_owner_date_of_birth: editedOwnerDateOfBirth
          ? `${editedOwnerDateOfBirth}T00:00:00Z`
          : null,
        product_need: editedProductNeed.trim() || null,
        notes: editedNotes.trim() || null,
        payment_account: editedPaymentAccount.trim() || null,
        payment_method: editedPaymentMethod.trim() || null,
        sales_team: editedSalesTeam.trim() || null,
        credit_limit_active: editedCreditLimitActive,
        credit_limit: creditLimit,
        payment_term_active: editedPaymentTermActive,
        payment_term: paymentTerm,
        limit_customer_overdue_active: editedLimitCustomerOverdueActive,
        limit_customer_overdue: limitCustomerOverdue,
        tax_status: editedTaxStatus,
        npwp: editedTaxStatus === 1 ? normalizedNpwp : null,
      };

      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bc.id),
        { method: "PUT", body: JSON.stringify(payload), cache: "no-store" },
        token,
      );

      if (!res.ok) {
        throw new Error(`Failed to update Branch Customer (${res.status})`);
      }

      const addressUpsertResults = await Promise.allSettled(
        editedRows.map((row) =>
          row.id > 0
            ? apiFetch(
                getResourceUrl("/api/resource/customer_address", row.id),
                {
                  method: "PUT",
                  body: JSON.stringify({
                    address: row.address || null,
                    city: row.city || null,
                    district: row.district || null,
                    village: row.village || null,
                    province: row.province || null,
                    postal_code: row.postal_code || null,
                    pic_name: row.pic_name || null,
                    pic_phone: row.pic_phone || null,
                    type: row.type || null,
                    label: row.label || null,
                    is_default: row.is_default ? 1 : 0,
                  }),
                  cache: "no-store",
                },
                token,
              )
            : apiFetch(
                getResourceUrl("/api/resource/customer_address"),
                {
                  method: "POST",
                  body: JSON.stringify({
                    parent_type: "branch_customer",
                    parent_id: bc.id,
                    address: row.address || null,
                    city: row.city || null,
                    district: row.district || null,
                    village: row.village || null,
                    province: row.province || null,
                    postal_code: row.postal_code || null,
                    pic_name: row.pic_name || null,
                    pic_phone: row.pic_phone || null,
                    type: row.type || "shipping",
                    label: row.label || "Alamat Pengiriman",
                    is_default: row.is_default ? 1 : 0,
                  }),
                  cache: "no-store",
                },
                token,
              ),
        ),
      );
      const addressDeleteResults = await Promise.allSettled(
        deletedRowIds.map((id) =>
          apiFetch(
            getResourceUrl("/api/resource/customer_address", id),
            { method: "DELETE", cache: "no-store" },
            token,
          ),
        ),
      );
      const hasAddressError = [
        ...addressUpsertResults,
        ...addressDeleteResults,
      ].some(
        (result) =>
          result.status === "rejected" ||
          (result.status === "fulfilled" && !result.value.ok),
      );
      if (hasAddressError) {
        throw new Error("Gagal update sebagian alamat customer.");
      }

      setDetail((prev) =>
        prev
          ? {
              ...prev,
              branch_owner: editedOwner.trim() || null,
              branch_owner_phone: editedOwnerPhone.trim() || null,
              branch_owner_email: normalizedEmail,
              branch_owner_place_of_birth:
                editedOwnerPlaceOfBirth.trim() || null,
              branch_owner_date_of_birth: editedOwnerDateOfBirth
                ? `${editedOwnerDateOfBirth}T00:00:00Z`
                : null,
              product_need: editedProductNeed.trim() || null,
              notes: editedNotes.trim() || null,
              payment_account: editedPaymentAccount.trim() || null,
              payment_method: editedPaymentMethod.trim() || null,
              sales_team: editedSalesTeam.trim() || null,
              credit_limit_active: editedCreditLimitActive,
              credit_limit: creditLimit,
              payment_term_active: editedPaymentTermActive,
              payment_term: paymentTerm,
              limit_customer_overdue_active: editedLimitCustomerOverdueActive,
              limit_customer_overdue: limitCustomerOverdue,
              tax_status: editedTaxStatus,
              npwp: editedTaxStatus === 1 ? normalizedNpwp : null,
              updated_at: new Date().toISOString(),
            }
          : prev,
      );
      await load();

      const updatedBC: BranchCustomer = {
        ...bc,
        credit_limit_active: editedCreditLimitActive,
        credit_limit: creditLimit,
        payment_term_active: editedPaymentTermActive,
        payment_term: paymentTerm,
        limit_customer_overdue_active: editedLimitCustomerOverdueActive,
        limit_customer_overdue: limitCustomerOverdue,
        owner_name: editedOwner.trim() || undefined,
        owner_phone: editedOwnerPhone.trim() || undefined,
        owner_email: normalizedEmail || undefined,
        payment_account: editedPaymentAccount.trim() || undefined,
        payment_method: editedPaymentMethod.trim() || undefined,
        receipt_delivery_method: detail?.receipt_delivery_method || undefined,
        receipt_issued_at: detail?.receipt_issued_at || undefined,
        updated_at: new Date().toISOString(),
      };
      onBCUpdate?.(updatedBC);
      setDeletedRowIds([]);
      setEditSnapshot("");
      setShowExitConfirm(false);
      setOptionError(null);
      setIsEditMode(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Gagal update Branch Customer",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = useMemo(() => {
    const gcName = (bc?.gc_name || "").trim();
    return gcName || "-";
  }, [bc?.gc_name]);
  const selectedHierarchyBc =
    relatedBCs.find((item) => Number(item.id) === selectedHierarchyBcId) ||
    (bc && Number(bc.id) === selectedHierarchyBcId ? bc : null);
  if (!bc) return null;

  const bcCode = detail?.name || bc.name || `BC${bc.id}`;
  const gcName = gc?.gc_name || bc.gc_name || "-";
  const branchOwner = detail?.branch_owner || bc.owner_name || "-";
  const branchOwnerPhone = detail?.branch_owner_phone || bc.owner_phone || "-";
  const branchOwnerEmail = detail?.branch_owner_email || bc.owner_email || "-";
  const branchOwnerDob =
    detail?.branch_owner_date_of_birth?.split("T")[0] || "-";
  const description = detail?.description || "-";
  const notes = detail?.notes || "-";
  const paymentAccount =
    paymentAccountInfo?.nama_rekening || detail?.payment_account || "-";
  const paymentAccountNumber =
    paymentAccountInfo?.nomor_rekening || detail?.payment_account || "-";
  const paymentMethod = detail?.payment_method || "-";
  const receiptDeliveryMethod = detail?.receipt_delivery_method || "-";
  const receiptIssuedAt = detail?.receipt_issued_at || "-";
  const salesTeam = resolveSalesTeamLabel(detail?.sales_team);
  const taxStatusLabel = getTaxStatusLabel(detail?.tax_status);
  const npwpValue = detail?.npwp || "-";
  const customerRegister =
    detail?.customer_register === null ||
    detail?.customer_register === undefined
      ? "-"
      : String(detail.customer_register);
  const isCashLabel = Number(detail?.is_cash || 0) === 1 ? "Cash" : "Non Cash";
  const branchLocation =
    [bc.branch_name, bc.branch_city].filter(Boolean).join(", ") || "-";
  const availableRekeningOptions =
    editedPaymentAccount &&
    !rekeningOptions.some((item) => item.name === editedPaymentAccount)
      ? [{ name: editedPaymentAccount }, ...rekeningOptions]
      : rekeningOptions;
  const availableSalesOptions =
    editedSalesTeam &&
    !salesTeamOptions.some(
      (item) =>
        String(item.id) === editedSalesTeam || item.code === editedSalesTeam,
    )
      ? [
          {
            id: editedSalesTeam,
            code: editedSalesTeam,
            label: resolveSalesTeamLabel(detail?.sales_team),
          },
          ...salesTeamOptions,
        ]
      : salesTeamOptions;
  const selectedRekeningOption =
    availableRekeningOptions.find(
      (item) => item.name === editedPaymentAccount,
    ) || null;
  const displayAddressRows = isEditMode ? editedRows : rows;
  const createdBy =
    detail?.["created_by.full_name"] || bc.created_by || "System";
  const updatedBy =
    detail?.["updated_by.full_name"] || bc.updated_by || "System";
  const headerStatus = detail?.status || "-";
  const isActive = Number(detail?.disabled ?? bc.disabled ?? 0) !== 1;
  const ownerInitial =
    branchOwner !== "-" ? branchOwner.charAt(0).toUpperCase() : "B";
  const inheritedCreditLimit =
    policyActiveInfo?.policy?.final_credit_limit ?? null;
  const inheritedPaymentTerm =
    policyActiveInfo?.policy?.final_payment_term ?? null;
  const creditLimitLevel = policyActiveInfo?.policy?.credit_limit_level;
  const paymentTermLevel = policyActiveInfo?.policy?.payment_term_level;
  const creditLimitSourceName = getPolicyLevelName(
    creditLimitLevel,
    policyActiveInfo?.relation,
    `${displayName} - ${bcCode}`,
  );
  const paymentTermSourceName = getPolicyLevelName(
    paymentTermLevel,
    policyActiveInfo?.relation,
    `${displayName} - ${bcCode}`,
  );
  const creditLimitSiblings = (
    policyActiveInfo?.scopes?.credit_limit?.bcs || []
  ).filter((row) => Number(row.id) !== Number(bc.id));
  const creditLimitScopeTotal = Number(
    policyActiveInfo?.scopes?.credit_limit?.total ||
      policyActiveInfo?.scopes?.credit_limit?.bcs?.length ||
      0,
  );
  const detailTabs: Array<{
    key: DetailTab;
    label: string;
    shortLabel: string;
    caption: string;
    icon: React.ReactNode;
  }> = [
    {
      key: "company",
      label: "Data Perusahaan",
      shortLabel: "Perusahaan",
      caption: "Profil, owner, operasional",
      icon: <FaBuilding className="h-4 w-4" />,
    },
    {
      key: "finance",
      label: "Data Keuangan",
      shortLabel: "Keuangan",
      caption: "Limit, term, rekening",
      icon: <FaWarehouse className="h-4 w-4" />,
    },
    {
      key: "hierarchy",
      label: "Hierarki",
      shortLabel: "Hierarki",
      caption: "Parent & branch",
      icon: <FaUsers className="h-4 w-4" />,
    },
    {
      key: "address",
      label: "Alamat",
      shortLabel: "Alamat",
      caption: "Alamat terdaftar saja",
      icon: <FaMapMarkerAlt className="h-4 w-4" />,
    },
    {
      key: "contacts",
      label: "Contacts",
      shortLabel: "Kontak",
      caption: "Relasi contact customer",
      icon: <FaAddressBook className="h-4 w-4" />,
    },
    {
      key: "activity",
      label: "Aktivitas",
      shortLabel: "Aktivitas",
      caption: "Riwayat Data",
      icon: <FaClock className="h-4 w-4" />,
    },
  ];

  const typeTone = (type?: string | null) => {
    const normalized = (type || "").toLowerCase();
    if (normalized.includes("office")) {
      return {
        card: "bg-blue-50/60 border-blue-200",
        top: "border-t-blue-500",
        badge: "bg-blue-600 text-white",
      };
    }
    return {
      card: "bg-emerald-50/60 border-emerald-200",
      top: "border-t-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          onClick={(e) => e.target === e.currentTarget && attemptClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex max-h-[94vh] w-full max-w-[96vw] 2xl:max-w-[1320px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl md:max-w-[92vw] md:rounded-3xl"
          >
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-4 md:px-6">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                    <FaBuilding className="text-lg text-blue-600 md:text-xl" />
                    <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                      Branch Customer Details
                    </h2>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      {headerStatus}
                    </span>
                  </div>
                  <p className="pl-8 text-sm font-semibold text-slate-500">
                    {displayName} - {bcCode}
                  </p>
                </div>
                <button
                  onClick={attemptClose}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div
              ref={contentScrollRef}
              className="flex-1 overflow-y-auto bg-slate-50"
            >
              <div className="space-y-4 p-4 md:p-5">
                {detailError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FaExclamationTriangle className="mt-0.5" />
                    <span>{detailError}</span>
                  </div>
                )}
                {loading && (
                  <div className="text-sm text-slate-500">
                    Memuat detail branch customer...
                  </div>
                )}
                {isEditMode && optionError ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                    {optionError}
                  </div>
                ) : null}

                <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                  <aside className="xl:sticky xl:top-6 xl:self-start">
                    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                      <div className="hidden border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(135deg,#eff6ff,#ffffff_55%,#f8fafc)] px-4 py-3 xl:block">
                        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700">
                          Panel Detail
                        </p>
                        <h3 className="mt-1 text-base font-bold text-slate-900">
                          Navigasi Data
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Pilih kategori informasi branch customer.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-2 md:grid-cols-3 xl:grid-cols-1 xl:p-3">
                        {detailTabs.map((tab) => {
                          const active = activeTab === tab.key;
                          return (
                            <button
                              key={tab.key}
                              type="button"
                              onClick={() => setActiveTab(tab.key)}
                              className={`group flex w-full min-w-0 flex-col items-start gap-2 rounded-2xl border px-3 py-2.5 text-left transition-all xl:flex-row xl:items-center xl:gap-2 ${
                                active
                                  ? "border-blue-500 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/70"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/70"
                              }`}
                            >
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                  active
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                                }`}
                              >
                                {tab.icon}
                              </span>
                              <span className="min-w-0">
                                <span className="block text-xs font-bold sm:text-sm xl:hidden">
                                  {tab.shortLabel}
                                </span>
                                <span className="hidden text-sm font-bold xl:block">
                                  {tab.label}
                                </span>
                                <span
                                  className={`hidden text-xs xl:block ${
                                    active ? "text-blue-50" : "text-slate-500"
                                  }`}
                                >
                                  {tab.caption}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </aside>

                  <div className="space-y-5">
                    {activeTab === "company" && (
                      <>
                        {isEditMode ? (
                          <>
                            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                              <div className="bg-[linear-gradient(135deg,#0f172a_0%,#172554_45%,#2563eb_100%)] px-6 py-6 text-white">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
                                      Data Perusahaan
                                    </p>
                                    <h3 className="mt-1 text-2xl font-bold">
                                      {displayName}
                                    </h3>
                                    <p className="mt-1 text-sm text-blue-100">
                                      Branch Code: {bcCode}
                                    </p>
                                  </div>
                                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                                    <FaBuilding className="text-2xl" />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
                                <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
                                    Customer ID
                                  </p>
                                  <p className="mt-2 text-base font-bold text-slate-900">
                                    {bcCode}
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                                    Branch Location
                                  </p>
                                  <p className="mt-2 text-base font-bold text-slate-900">
                                    {branchLocation}
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-700">
                                    Product Need
                                  </p>
                                  <select
                                    value={editedProductNeed}
                                    onChange={(e) =>
                                      setEditedProductNeed(e.target.value)
                                    }
                                    className="mt-2 w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                    disabled={isSaving}
                                  >
                                    <option value="">
                                      Pilih kebutuhan produk
                                    </option>
                                    {PRODUCT_NEED_OPTIONS.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                                    Sales Team
                                  </p>
                                  <div className="mt-2">
                                    <select
                                      value={editedSalesTeam}
                                      onChange={(e) =>
                                        setEditedSalesTeam(e.target.value)
                                      }
                                      className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                      disabled={isSaving}
                                    >
                                      <option value="">Pilih sales team</option>
                                      {availableSalesOptions.map((option) => (
                                        <option
                                          key={`${option.id}-${option.code}`}
                                          value={String(option.id)}
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="rounded-2xl border border-fuchsia-100 bg-fuchsia-50/70 p-4 md:col-span-2 xl:col-span-1">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-fuchsia-700">
                                    Notes
                                  </p>
                                  <textarea
                                    value={editedNotes}
                                    onChange={(e) =>
                                      setEditedNotes(e.target.value)
                                    }
                                    className="mt-2 min-h-[88px] w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                    disabled={isSaving}
                                    placeholder="Notes"
                                  />
                                </div>
                              </div>
                            </section>

                            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                              <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                  <FaUsers className="text-lg" />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700">
                                    Data Pemilik
                                  </p>
                                  <h3 className="text-2xl font-bold text-slate-900">
                                    Branch Owner
                                  </h3>
                                </div>
                              </div>

                              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                                <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#eff6ff,#ffffff_65%,#f8fafc)] p-6">
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-600">
                                      {ownerInitial}
                                    </div>
                                    <div className="min-w-0">
                                      <input
                                        type="text"
                                        value={editedOwner}
                                        onChange={(e) =>
                                          setEditedOwner(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-lg font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                                        placeholder="Nama owner"
                                        disabled={isSaving}
                                      />
                                      <p className="mt-1 text-sm text-slate-500">
                                        Managing Director
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                      Email
                                    </p>
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        value={editedOwnerEmail}
                                        onChange={(e) =>
                                          setEditedOwnerEmail(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                                        placeholder="Email owner"
                                        disabled={isSaving}
                                      />
                                      <p className="text-[11px] text-slate-500">
                                        Kosongkan jika tidak ada. Saat disimpan
                                        akan dikirim sebagai null.
                                      </p>
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                      Phone
                                    </p>
                                    <input
                                      type="text"
                                      value={editedOwnerPhone}
                                      onChange={(e) =>
                                        setEditedOwnerPhone(e.target.value)
                                      }
                                      className="w-full rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                                      placeholder="Phone owner"
                                      disabled={isSaving}
                                    />
                                  </div>
                                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                                      Tempat / Tanggal Lahir
                                    </p>
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <input
                                        type="text"
                                        value={editedOwnerPlaceOfBirth}
                                        onChange={(e) =>
                                          setEditedOwnerPlaceOfBirth(
                                            e.target.value,
                                          )
                                        }
                                        className="rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                                        placeholder="Tempat lahir"
                                        disabled={isSaving}
                                      />
                                      <input
                                        type="date"
                                        value={editedOwnerDateOfBirth}
                                        onChange={(e) =>
                                          setEditedOwnerDateOfBirth(
                                            e.target.value,
                                          )
                                        }
                                        className="rounded-xl border border-blue-300 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
                                        disabled={isSaving}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                              <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                                  <FaWarehouse className="text-lg" />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700">
                                    Operasional
                                  </p>
                                  <h3 className="text-2xl font-bold text-slate-900">
                                    Pembayaran dan Dokumen
                                  </h3>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-700">
                                    Payment Method
                                  </p>
                                  <select
                                    value={editedPaymentMethod}
                                    onChange={(e) =>
                                      setEditedPaymentMethod(e.target.value)
                                    }
                                    className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                    disabled={isSaving}
                                  >
                                    <option value="">
                                      Pilih payment method
                                    </option>
                                    {PAYMENT_METHOD_OPTIONS.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-700">
                                    Receipt Delivery Method
                                  </p>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {receiptDeliveryMethod}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-lime-100 bg-lime-50/70 p-4">
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-700">
                                    Receipt Issued At
                                  </p>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {receiptIssuedAt}
                                  </p>
                                </div>

                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                                    Tax Status
                                  </p>
                                  <select
                                    value={String(editedTaxStatus)}
                                    onChange={(e) =>
                                      setEditedTaxStatus(Number(e.target.value))
                                    }
                                    className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                    disabled={isSaving}
                                  >
                                    {TAX_STATUS_OPTIONS.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>

                                  {editedTaxStatus === 1 && (
                                    <div className="mt-4 border-t border-emerald-200 pt-4">
                                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-rose-700">
                                        NPWP
                                      </p>
                                      <>
                                        <input
                                          type="text"
                                          value={editedNpwp}
                                          onChange={(e) =>
                                            setEditedNpwp(
                                              normalizeNpwpDigits(
                                                e.target.value,
                                              ),
                                            )
                                          }
                                          inputMode="numeric"
                                          maxLength={16}
                                          className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                          disabled={isSaving}
                                          placeholder="15-16 digit"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">
                                          Nomor NPWP harus 15-16 digit.
                                        </p>
                                      </>
                                    </div>
                                  )}
                                </div>

                                <div className="rounded-2xl border border-indigo-100 bg-white p-4 md:col-span-2 xl:col-span-2">
                                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-700">
                                    Payment Account
                                  </p>
                                  <div className="space-y-2">
                                    <select
                                      value={editedPaymentAccount}
                                      onChange={(e) =>
                                        setEditedPaymentAccount(e.target.value)
                                      }
                                      className="w-full rounded-xl border border-blue-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                                      disabled={isSaving || rekeningLoading}
                                    >
                                      <option value="">
                                        Pilih payment account
                                      </option>
                                      {availableRekeningOptions.map(
                                        (option) => (
                                          <option
                                            key={option.name}
                                            value={option.name}
                                          >
                                            {[
                                              option.name,
                                              option.nama_rekening,
                                              option.bank,
                                            ]
                                              .filter(Boolean)
                                              .join(" - ")}
                                          </option>
                                        ),
                                      )}
                                    </select>
                                    {selectedRekeningOption ? (
                                      <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-600">
                                        <p className="font-semibold text-slate-900">
                                          {selectedRekeningOption.nama_rekening ||
                                            selectedRekeningOption.name}
                                        </p>
                                        <p>
                                          {selectedRekeningOption.bank || "-"}
                                        </p>
                                      </div>
                                    ) : null}
                                    {rekeningHasMore ? (
                                      <LoadMoreButton
                                        onClick={() =>
                                          void loadRekeningOptions(
                                            rekeningStart,
                                          )
                                        }
                                        loading={rekeningLoading}
                                        hasMore={rekeningHasMore}
                                        currentCount={
                                          availableRekeningOptions.length
                                        }
                                        totalCount={
                                          availableRekeningOptions.length +
                                          (rekeningHasMore ? 1 : 0)
                                        }
                                      />
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </section>
                          </>
                        ) : (
                          <>
                            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600">
                                    Data Perusahaan
                                  </p>
                                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                    {displayName}
                                  </h3>
                                  <p className="mt-1 text-sm text-slate-500">
                                    Profil branch customer, owner, dan
                                    operasional.
                                  </p>
                                </div>
                                <div className="rounded-2xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                                  BCID: {bcCode}
                                </div>
                              </div>

                              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                                <section className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-500">
                                    Company Profile
                                  </p>
                                  <h5 className="mt-1 text-xl font-bold text-slate-900">
                                    Informasi Perusahaan
                                  </h5>
                                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {renderReadOnlyField(
                                      "Branch Customer ID",
                                      bcCode,
                                    )}
                                    {renderReadOnlyField(
                                      "Group Customer",
                                      gc?.name || bc.gc_code || "-",
                                    )}
                                    {renderReadOnlyField(
                                      "Nama Perusahaan",
                                      displayName,
                                      "md:col-span-2",
                                    )}
                                    {renderReadOnlyField(
                                      "Branch Location",
                                      branchLocation,
                                    )}
                                    {renderReadOnlyField(
                                      "Sales Team",
                                      salesTeam,
                                    )}
                                    {renderReadOnlyField(
                                      "Product Need",
                                      detail?.product_need || "-",
                                    )}
                                    {renderReadOnlyField(
                                      "Customer Register",
                                      customerRegister,
                                    )}
                                    {renderReadOnlyField(
                                      "Status",
                                      detail?.status || "-",
                                    )}
                                    {renderReadOnlyField(
                                      "Tax Status",
                                      taxStatusLabel,
                                    )}
                                    {renderReadOnlyField("NPWP", npwpValue)}
                                    {renderReadOnlyField(
                                      "Is Cash",
                                      isCashLabel,
                                    )}
                                    {renderReadOnlyField(
                                      "Description",
                                      description,
                                      "md:col-span-2",
                                    )}
                                    {renderReadOnlyField(
                                      "Notes",
                                      notes,
                                      "md:col-span-2",
                                    )}
                                  </div>
                                </section>

                                <section className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-500">
                                    Primary Contact
                                  </p>
                                  <h5 className="mt-1 text-xl font-bold text-slate-900">
                                    Identitas Pemilik
                                  </h5>
                                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    {renderReadOnlyField(
                                      "Nama Owner",
                                      branchOwner,
                                    )}
                                    {renderReadOnlyField(
                                      "Telepon",
                                      branchOwnerPhone,
                                    )}
                                    {renderReadOnlyField(
                                      "Email",
                                      branchOwnerEmail,
                                    )}
                                    {renderReadOnlyField(
                                      "Tempat Lahir",
                                      detail?.branch_owner_place_of_birth ||
                                        "-",
                                    )}
                                    {renderReadOnlyField(
                                      "Tanggal Lahir",
                                      branchOwnerDob,
                                      "md:col-span-2",
                                    )}
                                  </div>
                                </section>

                                <section className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 xl:col-span-2">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-500">
                                    Operasional
                                  </p>
                                  <h5 className="mt-1 text-xl font-bold text-slate-900">
                                    Pembayaran dan Dokumen
                                  </h5>
                                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    {renderReadOnlyField(
                                      "Payment Method",
                                      paymentMethod,
                                    )}
                                    {renderReadOnlyField(
                                      "Receipt Delivery Method",
                                      receiptDeliveryMethod,
                                    )}
                                    {renderReadOnlyField(
                                      "Receipt Issued At",
                                      receiptIssuedAt,
                                    )}
                                    {renderReadOnlyField(
                                      "Payment Account",
                                      paymentAccount,
                                    )}
                                    {renderReadOnlyField(
                                      "Nomor Rekening",
                                      paymentAccountNumber,
                                    )}
                                    {renderReadOnlyField(
                                      "Bank",
                                      paymentAccountInfo?.bank || "-",
                                    )}
                                  </div>
                                  {paymentAccountError ? (
                                    <p className="mt-3 text-xs text-amber-700">
                                      Detail rekening belum bisa dimuat.
                                    </p>
                                  ) : null}
                                </section>
                              </div>
                            </section>

                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
                              {nb ? `NBID: ${nb.code} (${nb.name})` : null}
                              {detail?.sync_saga_id
                                ? ` - Sync Saga: ${detail.sync_saga_id}`
                                : null}
                              {detail?.status
                                ? ` - Status: ${detail.status}`
                                : null}
                              {!isActive ? (
                                <span className="ml-2 inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 font-semibold text-red-700">
                                  <FaBan className="text-[10px]" /> Disabled
                                </span>
                              ) : null}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {activeTab === "finance" && (
                      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                            <FaWarehouse className="text-lg" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700">
                              Data Keuangan
                            </p>
                            <h3 className="text-2xl font-bold text-slate-900">
                              Credit, Limit, dan Payment
                            </h3>
                          </div>
                        </div>

                        {!isEditMode && (
                          <div className="mb-6 space-y-4">
                            {policyActiveInfoError ? (
                              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                {policyActiveInfoError}
                              </div>
                            ) : null}

                            <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#fff7ed,#ffffff_60%,#eff6ff)] p-5">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700">
                                    Policy Aktif
                                  </p>
                                  {/* <h4 className="mt-1 text-lg font-bold text-slate-900">
                                    Sumber limit branch customer ini
                                  </h4> */}
                                  <p className="mt-1 text-sm text-slate-500">
                                    Menunjukkan limit final yang dipakai dan
                                    asal setting policy-nya.
                                  </p>
                                </div>
                                {policyActiveInfoLoading ? (
                                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
                                    Memuat policy...
                                  </span>
                                ) : creditLimitLevel ? (
                                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                                    Shared ke {creditLimitScopeTotal} BC
                                  </span>
                                ) : null}
                              </div>

                              <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-amber-100 bg-white/90 p-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
                                    Credit Limit
                                  </p>
                                  <p className="mt-2 text-xl font-bold text-slate-900">
                                    {formatNullableNumber(inheritedCreditLimit)}
                                  </p>
                                  <div className="mt-3 flex items-center gap-2">
                                    <span className="rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white">
                                      {getPolicyLevelBadge(creditLimitLevel)}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-700">
                                      {creditLimitSourceName}
                                    </span>
                                  </div>
                                </div>

                                <div className="rounded-2xl border border-teal-100 bg-white/90 p-4">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-teal-700">
                                    Payment Term
                                  </p>
                                  <p className="mt-2 text-xl font-bold text-slate-900">
                                    {formatNullableNumber(inheritedPaymentTerm)}{" "}
                                    <span className="text-xs font-semibold text-slate-500">
                                      Hari
                                    </span>
                                  </p>

                                  <div className="mt-3 flex items-center gap-2">
                                    <span className="rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white">
                                      {getPolicyLevelBadge(paymentTermLevel)}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-700">
                                      {paymentTermSourceName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-5">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-600">
                                    Siblings Limit
                                  </p>
                                  {/* <h4 className="mt-1 text-lg font-bold text-slate-900">
                                    Saudara dengan credit limit yang sama
                                  </h4> */}
                                  <p className="mt-1 text-sm text-slate-500">
                                    Berdasarkan scope credit limit aktif untuk
                                    branch customer ini.
                                  </p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                                  {creditLimitSiblings.length} sibling
                                </span>
                              </div>

                              {creditLimitSiblings.length === 0 ? (
                                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-500">
                                  Tidak ada sibling lain. Credit limit aktif
                                  saat ini hanya dipakai BC ini.
                                </div>
                              ) : (
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                  {creditLimitSiblings.map((row) => (
                                    <div
                                      key={row.id}
                                      className="rounded-2xl border border-slate-200 bg-white p-4"
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                          <p className="text-sm font-bold text-slate-900">
                                            {row.customer_name ||
                                              row.name ||
                                              `BC${row.id}`}
                                          </p>
                                          <p className="mt-1 text-xs font-semibold text-slate-500">
                                            {row.name || `BC${row.id}`}
                                          </p>
                                        </div>
                                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                                          {row.branch_code || "BC"}
                                        </span>
                                      </div>
                                      <p className="mt-3 text-sm text-slate-600">
                                        {row.branch_name || "-"}
                                      </p>
                                      <p className="mt-1 text-xs font-semibold text-slate-500">
                                        Status: {row.status || "-"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {isEditMode ? (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            Pengaturan pembayaran telah dipindahkan ke tab Data
                            Perusahaan.
                          </div>
                        ) : null}
                      </section>
                    )}

                    {activeTab === "hierarchy" && (
                      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 xl:px-5">
                          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white"><FaArrowDown className="h-4 w-4" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">Struktur Customer</p><p className="text-sm text-slate-500">{relatedBCsLoading ? "Memuat data..." : `${nb ? "1 NB • " : ""}${gp ? "1 GP • " : ""}1 GC • ${relatedBCs.length || 1} BC`}</p></div></div>
                          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">{nb ? <><span className="max-w-32 truncate text-indigo-600">{nb.name}</span><span>/</span></> : null}{gp ? <><button type="button" onClick={() => { setSelectedHierarchyParent("gp"); setSelectedHierarchyBcId(null); }} className="max-w-36 truncate font-semibold text-violet-600 hover:underline">{gp.gp_name}</button><span>/</span></> : null}{gc ? <button type="button" onClick={() => { setSelectedHierarchyParent(null); setSelectedHierarchyBcId(null); }} className="max-w-40 truncate font-semibold text-blue-600 hover:underline">{gc.gc_name}</button> : null}</div>
                        </div>
                        {relatedBCsError ? <div className="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{relatedBCsError}</div> : null}

                        <div className="grid min-h-[400px] lg:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)] xl:min-h-[440px]">
                          <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                            <div className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Group Customer & Branch</div>
                            <div className="max-h-[55vh] overflow-y-auto py-1">
                              {nb ? (
                                <div className="flex min-h-12 items-center border-l-2 border-indigo-500 px-4 py-2">
                                  <span className="mr-3 rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">{nb.code}</span>
                                  <span className="min-w-0"><span className="block truncate text-xs font-semibold text-slate-900">{nb.name}</span><span className="block truncate text-[10px] font-semibold text-indigo-600">{nb.code}</span></span>
                                </div>
                              ) : null}
                              {gp ? (
                                <button type="button" onClick={() => { setSelectedHierarchyParent("gp"); setSelectedHierarchyBcId(null); }} className={`ml-5 flex min-h-[50px] w-[calc(100%_-_1.25rem)] items-center border-l-2 px-3 py-2 text-left ${selectedHierarchyParent === "gp" ? "border-violet-500 bg-violet-50/50" : "border-transparent hover:bg-violet-50/50"}`}>
                                  <span className="mr-2 text-xs text-violet-400">└─</span>
                                  <span className="mr-3 rounded-md bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-600">{gp.name}</span>
                                  <span className="min-w-0"><span className="block truncate text-xs font-semibold text-slate-900">{gp.gp_name}</span><span className="block truncate text-[10px] font-semibold text-violet-600">{gp.name}</span></span>
                                </button>
                              ) : null}
                              <div className={`flex min-h-[54px] items-stretch border-l-2 ${nb || gp ? "ml-10" : ""} ${selectedHierarchyParent === null && selectedHierarchyBcId === null ? "border-blue-500 bg-blue-50/50" : "border-transparent hover:bg-slate-50"}`}>
                                <button type="button" aria-expanded={hierarchyExpanded} aria-controls={`bc-explorer-${gc?.id || bc.gc_id}`} onClick={() => setHierarchyExpanded((value) => !value)} className="flex w-10 items-center justify-center text-blue-500" aria-label={`${hierarchyExpanded ? "Tutup" : "Buka"} ${gcName}`}><FaChevronRight className={`h-3.5 w-3.5 transition-transform ${hierarchyExpanded ? "rotate-90" : ""}`} /></button>
                                <button type="button" aria-expanded={hierarchyExpanded} aria-controls={`bc-explorer-${gc?.id || bc.gc_id}`} onClick={() => { setSelectedHierarchyParent(null); setSelectedHierarchyBcId(null); setHierarchyExpanded((value) => !value); }} className="min-w-0 flex-1 py-2 pr-3 text-left"><p className="truncate text-[13px] font-semibold text-slate-900">{gcName}</p><p className="mt-0.5 truncate text-[11px] text-slate-500"><span className="font-semibold text-blue-600">{gc?.name || bc.gc_code || `GC${bc.gc_id}`}</span> • {relatedBCs.length || 1} BC</p></button>
                              </div>
                              {hierarchyExpanded ? (
                                <div id={`bc-explorer-${gc?.id || bc.gc_id}`} className={`${nb || gp ? "ml-16" : "ml-5"} border-l border-blue-200 py-0.5`}>
                                  {(relatedBCs.length > 0 ? relatedBCs : [bc]).map((item) => {
                                    const selected = selectedHierarchyBcId === Number(item.id);
                                    const isCurrent = Number(item.id) === Number(bc.id);
                                    return <button type="button" key={item.id} onClick={() => { setSelectedHierarchyParent(null); setSelectedHierarchyBcId(Number(item.id)); }} className={`flex min-h-12 w-full items-center border-l-2 py-1.5 pl-4 pr-3 text-left ${selected && selectedHierarchyParent === null ? "border-orange-500 bg-orange-50/60" : "border-transparent hover:bg-slate-50"}`}><span className="mr-2 text-xs text-orange-400">└─</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-slate-800">{gcName} - {item.branch_city || item.branch_name || "-"}</span><span className="block truncate text-[11px] font-bold text-orange-600">{item.name}</span></span>{isCurrent ? <span className="ml-2 rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-bold text-orange-700">Aktif</span> : null}</button>;
                                  })}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <aside className="bg-slate-50/50">
                            <div className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Detail Customer</div>
                            <div className="max-h-[55vh] overflow-y-auto p-4 xl:p-5">
                              {selectedHierarchyParent === "gp" && gp ? (
                                <div>
                                  <nav className="mb-5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500" aria-label="Breadcrumb hierarchy">{nb ? <><span>{nb.name}</span><span>/</span></> : null}<span className="font-semibold text-slate-800">{gp.gp_name}</span></nav>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">Group Parent</p>
                                  <h4 className="mt-2 text-xl font-bold text-slate-900">{gp.gp_name}</h4>
                                  <p className="mt-1 text-sm font-semibold text-slate-500">GPID: {gp.name}</p>
                                  <div className="mt-5 space-y-4 border-t border-slate-200 pt-4 text-sm">{nb ? <div><p className="text-xs text-slate-500">Parent</p><p className="mt-1 font-semibold text-slate-800">NB: {nb.name}</p></div> : null}{gc ? <div><p className="text-xs text-slate-500">Group Customer</p><p className="mt-1 font-semibold text-slate-800">{gc.gc_name}</p><p className="mt-1 text-xs font-semibold text-blue-600">{gc.name}</p></div> : null}</div>
                                  <button type="button" onClick={() => onViewGP?.(gp)} disabled={!onViewGP} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-300">Lihat Detail GP</button>
                                </div>
                              ) : (
                                <>
                              <nav className="mb-5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500" aria-label="Breadcrumb hierarchy">{nb ? <><span>{nb.name}</span><span>/</span></> : null}{gp ? <><span>{gp.gp_name}</span><span>/</span></> : null}<span>{gcName}</span>{selectedHierarchyBc ? <><span>/</span><span className="font-semibold text-slate-800">{selectedHierarchyBc.branch_city || selectedHierarchyBc.name}</span></> : null}</nav>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${selectedHierarchyBc ? "text-orange-600" : "text-blue-600"}`}>{selectedHierarchyBc ? "Branch Customer" : "Group Customer"}</p>
                              <h4 className="mt-2 text-xl font-bold text-slate-900">{selectedHierarchyBc ? `${gcName} - ${selectedHierarchyBc.branch_city || selectedHierarchyBc.branch_name || "-"}` : gcName}</h4>
                              <p className="mt-1 text-sm font-semibold text-slate-500">{selectedHierarchyBc ? `BCID: ${selectedHierarchyBc.name}` : `GCID: ${gc?.name || bc.gc_code || `GC${bc.gc_id}`}`}</p>
                              <div className="mt-4 space-y-3 border-t border-slate-200 pt-3 text-sm"><div><p className="text-xs text-slate-500">Parent</p>{nb ? <p className="mt-1 font-semibold text-slate-800">NB: {nb.name}</p> : null}{gp ? <p className="mt-1 font-semibold text-slate-800">GP: {gp.gp_name}</p> : null}{selectedHierarchyBc && gc ? <p className="mt-1 font-semibold text-slate-800">GC: {gcName}</p> : null}</div>{selectedHierarchyBc ? <div><p className="text-xs text-slate-500">Kota Branch</p><p className="mt-1 font-semibold text-slate-800">{selectedHierarchyBc.branch_city || "-"}</p></div> : <div><p className="text-xs text-slate-500">Branch Customer</p><p className="mt-1 font-semibold text-slate-800">{relatedBCs.length || 1} data terdaftar</p></div>}</div>
                              <button type="button" onClick={() => selectedHierarchyBc && Number(selectedHierarchyBc.id) !== Number(bc.id) ? onViewBC?.(selectedHierarchyBc) : selectedHierarchyBcId === null && gc ? onViewGC?.(gc) : undefined} disabled={selectedHierarchyBc ? Number(selectedHierarchyBc.id) === Number(bc.id) : !gc} className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-default disabled:bg-slate-300">{selectedHierarchyBc ? Number(selectedHierarchyBc.id) === Number(bc.id) ? "Branch Customer Aktif" : "Lihat Detail BC" : "Lihat Detail GC"}</button>
                                </>
                              )}
                            </div>
                          </aside>
                        </div>
                      </section>
                    )}

                    {addressError && activeTab === "address" && (
                      <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        <FaExclamationTriangle className="mt-0.5" />
                        <span>{addressError}</span>
                      </div>
                    )}

                    {activeTab === "address" && (
                      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-700">
                              Data Alamat
                            </p>
                            <h3 className="mt-2 text-2xl font-bold text-slate-900">
                              Registered Addresses
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Tab ini hanya menampilkan alamat branch customer.
                            </p>
                          </div>
                          <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                            {displayAddressRows.length} Addresses total
                          </div>
                        </div>

                        <div className="mb-3 flex items-center justify-between">
                          <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <FaMapMarkerAlt className="text-slate-400" />
                            Address List
                          </h4>
                          <div className="flex items-center gap-3">
                            {isEditMode && (
                              <button
                                type="button"
                                onClick={addShippingAddress}
                                className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700"
                              >
                                + Alamat Pengiriman
                              </button>
                            )}
                          </div>
                        </div>
                        {displayAddressRows.length === 0 ? (
                          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                            Tidak ada data `customer_address`.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                            {displayAddressRows.map((r, idx) => {
                              const tone = typeTone(r.type);
                              const typeLabel = (
                                r.type ||
                                r.label ||
                                "ADDRESS"
                              ).toUpperCase();
                              return (
                                <div
                                  key={r.id}
                                  className={`rounded-xl border border-t-4 p-5 ${tone.card} ${tone.top}`}
                                >
                                  <div className="mb-3 flex items-start justify-between gap-3">
                                    <p className="text-xs font-bold uppercase tracking-tight text-slate-700">
                                      {(r.label || "Address").toUpperCase()}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${tone.badge}`}
                                      >
                                        {typeLabel}
                                      </span>
                                      {isEditMode && (
                                        <button
                                          type="button"
                                          onClick={() => removeAddress(idx)}
                                          className="rounded border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100"
                                          disabled={isSaving}
                                          title="Hapus alamat"
                                        >
                                          <FaTrash className="h-3 w-3" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {isEditMode ? (
                                    <textarea
                                      value={r.address || ""}
                                      onChange={(e) =>
                                        updateEditedRow(
                                          r.id,
                                          "address",
                                          e.target.value,
                                        )
                                      }
                                      className="mb-3 min-h-[72px] w-full rounded-md border border-blue-300 px-2 py-1 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                                      disabled={isSaving}
                                    />
                                  ) : (
                                    <p className="mb-4 text-sm font-medium leading-relaxed text-slate-900">
                                      {r.address || "-"}
                                    </p>
                                  )}
                                  <div className="space-y-1.5 text-xs text-slate-600">
                                    <div className="flex items-center justify-between">
                                      <span>Provinsi</span>
                                      {isEditMode ? (
                                        provinces.length > 0 ? (
                                          <select
                                            value={
                                              shippingAreaStates[idx]
                                                ?.provinceCode || ""
                                            }
                                            onChange={(e) =>
                                              void onShippingProvinceChange(
                                                idx,
                                                e.target.value,
                                              )
                                            }
                                            className="w-36 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                            disabled={isSaving}
                                          >
                                            <option value="">
                                              Pilih Provinsi
                                            </option>
                                            {provinces.map((p) => (
                                              <option
                                                key={p.code}
                                                value={p.code}
                                              >
                                                {p.name}
                                              </option>
                                            ))}
                                          </select>
                                        ) : (
                                          <input
                                            value={r.province || ""}
                                            onChange={(e) =>
                                              updateEditedRow(
                                                r.id,
                                                "province",
                                                e.target.value,
                                              )
                                            }
                                            className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                            disabled={isSaving}
                                          />
                                        )
                                      ) : (
                                        <span className="font-semibold text-slate-900">
                                          {r.province || "-"}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Kabupaten/Kota</span>
                                      {isEditMode ? (
                                        <input
                                          value={r.city || ""}
                                          onChange={(e) =>
                                            updateEditedRow(
                                              r.id,
                                              "city",
                                              e.target.value,
                                            )
                                          }
                                          className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                          disabled={isSaving}
                                        />
                                      ) : (
                                        <span className="font-semibold text-slate-900">
                                          {r.city || "-"}
                                        </span>
                                      )}
                                    </div>
                                    {isEditMode && (
                                      <>
                                        <div className="flex items-center justify-between">
                                          <span>City</span>
                                          {provinces.length > 0 ? (
                                            <select
                                              value={
                                                shippingAreaStates[idx]
                                                  ?.regencyCode || ""
                                              }
                                              onChange={(e) =>
                                                void onShippingRegencyChange(
                                                  idx,
                                                  e.target.value,
                                                )
                                              }
                                              className="w-36 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                              disabled={
                                                isSaving ||
                                                !shippingAreaStates[idx]
                                                  ?.provinceCode
                                              }
                                            >
                                              <option value="">
                                                {shippingAreaStates[idx]
                                                  ?.provinceCode
                                                  ? "Pilih Kota/Kabupaten"
                                                  : "Pilih provinsi dulu"}
                                              </option>
                                              {(
                                                shippingAreaStates[idx]
                                                  ?.regencies || []
                                              ).map((regency) => (
                                                <option
                                                  key={regency.code}
                                                  value={regency.code}
                                                >
                                                  {regency.name}
                                                </option>
                                              ))}
                                            </select>
                                          ) : (
                                            <input
                                              value={r.city || ""}
                                              onChange={(e) =>
                                                updateEditedRow(
                                                  r.id,
                                                  "city",
                                                  e.target.value,
                                                )
                                              }
                                              className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                              disabled={isSaving}
                                            />
                                          )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span>District</span>
                                          {provinces.length > 0 ? (
                                            <select
                                              value={
                                                (
                                                  shippingAreaStates[idx]
                                                    ?.districts || []
                                                ).find(
                                                  (x) =>
                                                    normalizeName(x.name) ===
                                                    normalizeName(r.district),
                                                )?.code || ""
                                              }
                                              onChange={(e) =>
                                                onShippingDistrictChange(
                                                  idx,
                                                  e.target.value,
                                                )
                                              }
                                              className="w-36 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                              disabled={
                                                isSaving ||
                                                !shippingAreaStates[idx]
                                                  ?.regencyCode
                                              }
                                            >
                                              <option value="">
                                                {shippingAreaStates[idx]
                                                  ?.regencyCode
                                                  ? "Pilih Kecamatan"
                                                  : "Pilih kota dulu"}
                                              </option>
                                              {(
                                                shippingAreaStates[idx]
                                                  ?.districts || []
                                              ).map((district) => (
                                                <option
                                                  key={district.code}
                                                  value={district.code}
                                                >
                                                  {district.name}
                                                </option>
                                              ))}
                                            </select>
                                          ) : (
                                            <input
                                              value={r.district || ""}
                                              onChange={(e) =>
                                                updateEditedRow(
                                                  r.id,
                                                  "district",
                                                  e.target.value,
                                                )
                                              }
                                              className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                              disabled={isSaving}
                                            />
                                          )}
                                        </div>
                                      </>
                                    )}
                                    <div className="mt-2 border-t border-slate-200 pt-2">
                                      {isEditMode ? (
                                        <div className="space-y-1">
                                          <input
                                            value={r.pic_name || ""}
                                            onChange={(e) =>
                                              updateEditedRow(
                                                r.id,
                                                "pic_name",
                                                e.target.value,
                                              )
                                            }
                                            className="w-full rounded border border-blue-300 px-1 py-0.5 text-xs"
                                            placeholder="PIC name"
                                            disabled={isSaving}
                                          />
                                          <input
                                            value={r.pic_phone || ""}
                                            onChange={(e) =>
                                              updateEditedRow(
                                                r.id,
                                                "pic_phone",
                                                e.target.value,
                                              )
                                            }
                                            className="w-full rounded border border-blue-300 px-1 py-0.5 text-xs"
                                            placeholder="PIC phone"
                                            disabled={isSaving}
                                          />
                                        </div>
                                      ) : (
                                        <>
                                          <p className="font-semibold text-slate-900">
                                            PIC: {r.pic_name || "-"}
                                          </p>
                                          <p className="text-slate-500">
                                            {r.pic_phone || "-"}
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    )}

                    {activeTab === "contacts" && (
                      <BCContactRelationsPanel branchCustomerId={bc.id} />
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
                                {createdBy}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-800">
                            {dt(detail?.created_at || bc.created_at)}
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
                                {updatedBy}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-800">
                            {dt(detail?.updated_at || bc.updated_at)}
                          </p>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showExitConfirm && (
              <div className="border-t border-amber-200 bg-amber-50 px-6 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Ada perubahan yang belum disimpan.
                    </p>
                    <p className="text-xs text-amber-800">
                      Yakin mau keluar dari mode edit?
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeDirectly}
                      className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100"
                    >
                      Lanjut Keluar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExitConfirm(false)}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isEditMode && (
              <footer className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-end md:px-6">
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="w-full rounded-lg border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
                >
                  Cancel Edit
                </button>
                <button
                  type="button"
                  onClick={() => void applyEdit()}
                  disabled={!isEditMode || isSaving || activeTab === "contacts"}
                  className="w-full rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50 md:w-auto"
                >
                  {isSaving ? "Saving..." : "Apply Changes"}
                </button>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
