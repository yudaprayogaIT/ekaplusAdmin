"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBan,
  FaBuilding,
  FaCheckCircle,
  FaChevronRight,
  FaClock,
  FaTags,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type {
  BranchCustomer,
  GroupCustomer,
  GroupParent,
} from "@/types/customer";
import { API_CONFIG, apiFetch, getApiUrl, getQueryUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

export interface NationalBrandDetailData {
  id: number;
  code: string;
  name: string;
  disabled: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  owners: string[];
  active_gp_count: number;
  active_gc_count: number;
  active_bc_count: number;
  active_gp_names: string[];
  active_gc_names: string[];
  active_bc_names: string[];
}

interface NBDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NationalBrandDetailData | null;
  onViewGP?: (gp: GroupParent) => void;
  onViewGC?: (gc: GroupCustomer) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

type DetailTab = "summary" | "owner" | "hierarchy" | "activity";

interface PolicyHierarchyGpRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  credit_limit?: number | null;
  payment_term?: number | null;
}

interface PolicyHierarchyGcRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gpid?:
    | number
    | {
        id?: number | string | null;
        name?: string | null;
        gp_name?: string | null;
    }
    | null;
  _relations?: {
    gpid?: {
      id?: number | string | null;
      name?: string | null;
      gp_name?: string | null;
    } | null;
  } | null;
}

interface PolicyHierarchyBcRow {
  id: number;
  name?: string | null;
  _relations?: {
    branch?: {
      city?: string | null;
    } | null;
    gcid?: {
      id?: number | null;
      name?: string | null;
      gc_name?: string | null;
    } | null;
  } | null;
}

interface PolicyHierarchyNbRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
  credit_limit?: number | null;
  payment_term?: number | null;
}

interface PolicyHierarchyResponse {
  data?: {
    data?: {
      nb?: PolicyHierarchyNbRow | PolicyHierarchyNbRow[] | null;
      gps?: PolicyHierarchyGpRow[] | null;
      gcs?: PolicyHierarchyGcRow[] | null;
      bcs?: PolicyHierarchyBcRow[] | null;
    } | null;
  } | null;
}

type HierarchyNodeRef = {
  type: "gp" | "gc" | "bc";
  id: number;
};

type NbHierarchyDetail =
  | {
      type: "gp";
      gp: PolicyHierarchyGpRow;
      gcs: Array<{ gc: PolicyHierarchyGcRow; bcs: PolicyHierarchyBcRow[] }>;
    }
  | {
      type: "gc";
      gp?: PolicyHierarchyGpRow;
      gc: PolicyHierarchyGcRow;
      bcs: PolicyHierarchyBcRow[];
    }
  | {
      type: "bc";
      gp?: PolicyHierarchyGpRow;
      gc?: PolicyHierarchyGcRow;
      bc: PolicyHierarchyBcRow;
    };

interface GroupParentDetailRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  description?: string | null;
  credit_limit_active?: number | null;
  credit_limit?: number | null;
  payment_term_active?: number | null;
  payment_term?: number | null;
  limit_customer_overdue_active?: number | null;
  limit_customer_overdue?: number | null;
  owner_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface GroupCustomerDetailRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  description?: string | null;
  gpid?:
    | number
    | { id?: number | string; name?: string; gp_name?: string }
    | null;
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
  tax_status?: number | null;
  npwp?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface BranchCustomerDetailRow {
  id: number;
  name?: string | null;
  bcid_name?: string | null;
  gcid?:
    | number
    | { id?: number | string; name?: string; gc_name?: string }
    | null;
  branch?:
    | number
    | { id?: number | string; branch_name?: string; city?: string }
    | null;
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

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function formatCurrency(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDays(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value} hari`;
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
  if (value && typeof value === "object" && value.full_name) {
    return value.full_name;
  }
  return undefined;
}

function mapGpRow(row: GroupParentDetailRow): GroupParent {
  return {
    id: Number(row.id),
    code: row.name || undefined,
    name: row.gp_name || row.name || "-",
    description: row.description || undefined,
    credit_limit_active: Number(row.credit_limit_active || 0),
    credit_limit: row.credit_limit ?? null,
    payment_term_active: Number(row.payment_term_active || 0),
    payment_term: row.payment_term ?? null,
    limit_customer_overdue_active: Number(
      row.limit_customer_overdue_active || 0,
    ),
    limit_customer_overdue: row.limit_customer_overdue ?? null,
    owner_name: row.owner_name || undefined,
    owner_phone: row.owner_phone || undefined,
    owner_email: row.owner_email || undefined,
    created_at: row.created_at || new Date(0).toISOString(),
    created_by: resolveUserName(row["created_by.full_name"], row.created_by),
    updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
    updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
    disabled: Number(row.disabled || 0),
  };
}

function mapGcRow(row: GroupCustomerDetailRow): GroupCustomer {
  const gpId =
    typeof row.gpid === "number"
      ? row.gpid
      : row.gpid && typeof row.gpid === "object"
        ? toNumber(row.gpid.id) || 0
        : 0;
  const gpCode =
    row.gpid && typeof row.gpid === "object"
      ? row.gpid.name || undefined
      : undefined;
  const gpName =
    row.gpid && typeof row.gpid === "object"
      ? row.gpid.gp_name || row.gpid.name || undefined
      : undefined;

  return {
    id: Number(row.id),
    code: row.name || undefined,
    name: row.gc_name || row.name || "-",
    description: row.description || undefined,
    gp_id: gpId,
    gp_name: gpName,
    gp_code: gpCode,
    company_name: row.company_name || undefined,
    company_title: row.company_title || undefined,
    company_type: row.company_type || undefined,
    credit_limit_active: Number(row.credit_limit_active || 0),
    credit_limit: row.credit_limit ?? null,
    payment_term_active: Number(row.payment_term_active || 0),
    payment_term: row.payment_term ?? null,
    limit_customer_overdue_active: Number(
      row.limit_customer_overdue_active || 0,
    ),
    limit_customer_overdue: row.limit_customer_overdue ?? null,
    owner_name: row.owner_full_name || undefined,
    owner_phone: row.owner_phone || undefined,
    owner_email: row.owner_email || undefined,
    owner_place_of_birth: row.owner_place_of_birth || undefined,
    owner_date_of_birth: row.owner_date_of_birth || undefined,
    tax_status: row.tax_status ?? undefined,
    npwp: row.npwp || undefined,
    created_at: row.created_at || new Date(0).toISOString(),
    created_by: resolveUserName(row["created_by.full_name"], row.created_by),
    updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
    updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
    disabled: Number(row.disabled || 0),
  };
}

function mapBcRow(row: BranchCustomerDetailRow): BranchCustomer {
  const gcId =
    typeof row.gcid === "number"
      ? row.gcid
      : row.gcid && typeof row.gcid === "object"
        ? toNumber(row.gcid.id) || 0
        : 0;
  const gcCode =
    row.gcid && typeof row.gcid === "object"
      ? row.gcid.name || undefined
      : undefined;
  const gcName =
    row.gcid && typeof row.gcid === "object"
      ? row.gcid.gc_name || row.gcid.name || undefined
      : undefined;
  const branchId =
    typeof row.branch === "number"
      ? row.branch
      : row.branch && typeof row.branch === "object"
        ? toNumber(row.branch.id) || 0
        : 0;
  const branchName =
    row.branch && typeof row.branch === "object"
      ? row.branch.branch_name || undefined
      : undefined;
  const branchCity =
    row.branch && typeof row.branch === "object"
      ? row.branch.city || undefined
      : undefined;

  return {
    id: Number(row.id),
    code: row.name || undefined,
    name: row.bcid_name || row.name || "-",
    gc_id: gcId,
    gc_name: gcName,
    gc_code: gcCode,
    credit_limit_active: Number(row.credit_limit_active || 0),
    credit_limit: row.credit_limit ?? null,
    payment_term_active: Number(row.payment_term_active || 0),
    payment_term: row.payment_term ?? null,
    limit_customer_overdue_active: Number(
      row.limit_customer_overdue_active || 0,
    ),
    limit_customer_overdue: row.limit_customer_overdue ?? null,
    branch_id: branchId,
    branch_name: branchName,
    branch_city: branchCity,
    owner_name: row.branch_owner || undefined,
    owner_phone: row.branch_owner_phone || undefined,
    owner_email: row.branch_owner_email || undefined,
    receipt_delivery_method: row.receipt_delivery_method || undefined,
    receipt_issued_at: row.receipt_issued_at || undefined,
    created_at: row.created_at || new Date(0).toISOString(),
    created_by: resolveUserName(row["created_by.full_name"], row.created_by),
    updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
    updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
    disabled: Number(row.disabled || 0),
  };
}

export function NBDetailModal({
  isOpen,
  onClose,
  item,
  onViewGP,
  onViewGC,
  onViewBC,
}: NBDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DetailTab>("hierarchy");
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [hierarchyError, setHierarchyError] = useState<string | null>(null);
  const [hierarchyNb, setHierarchyNb] = useState<PolicyHierarchyNbRow | null>(
    null,
  );
  const [hierarchyGps, setHierarchyGps] = useState<PolicyHierarchyGpRow[]>([]);
  const [hierarchyGcs, setHierarchyGcs] = useState<PolicyHierarchyGcRow[]>([]);
  const [hierarchyBcs, setHierarchyBcs] = useState<PolicyHierarchyBcRow[]>([]);
  const [hierarchySearch, setHierarchySearch] = useState("");
  const [expandedGpId, setExpandedGpId] = useState<number | null>(null);
  const [expandedGcId, setExpandedGcId] = useState<number | null>(null);
  const [selectedHierarchyNode, setSelectedHierarchyNode] =
    useState<HierarchyNodeRef | null>(null);
  const [activityUsers, setActivityUsers] = useState<{
    createdBy?: string;
    updatedBy?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("hierarchy");
    setHierarchySearch("");
    setExpandedGpId(null);
    setExpandedGcId(null);
    setSelectedHierarchyNode(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, item?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadHierarchy() {
      if (!isOpen || !item || !token || !isAuthenticated) {
        setHierarchyNb(null);
        setHierarchyGps([]);
        setHierarchyGcs([]);
        setHierarchyBcs([]);
        setHierarchyError(null);
        setHierarchyLoading(false);
        setActivityUsers({});
        return;
      }

      setHierarchyLoading(true);
      setHierarchyNb(null);
      setHierarchyGps([]);
      setHierarchyGcs([]);
      setHierarchyBcs([]);
      setHierarchyError(null);
      setActivityUsers({
        createdBy: item.created_by,
        updatedBy: item.updated_by,
      });

      try {
        const nbDetailRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
            fields: ["*", "created_by.full_name", "updated_by.full_name"],
            filters: [["id", "=", item.id]],
            limit: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        );
        const nbDetailJson = nbDetailRes.ok
          ? await nbDetailRes.json()
          : { data: [] };
        const nbDetailRow = Array.isArray(nbDetailJson?.data)
          ? (nbDetailJson.data[0] as
              | {
                  "created_by.full_name"?: string | null;
                  "updated_by.full_name"?: string | null;
                  created_by?: number | { full_name?: string } | null;
                  updated_by?: number | { full_name?: string } | null;
                }
              | undefined)
          : undefined;
        if (!cancelled && nbDetailRow) {
          setActivityUsers({
            createdBy: resolveUserName(
              nbDetailRow["created_by.full_name"],
              nbDetailRow.created_by,
            ),
            updatedBy: resolveUserName(
              nbDetailRow["updated_by.full_name"],
              nbDetailRow.updated_by,
            ),
          });
        }

        const response = await apiFetch(
          getApiUrl(
            `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`,
          ),
          {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({
              level: "nbid",
              value: item.id,
              format: "full",
              entities: ["nb", "gps", "gcs", "bcs"],
              query: {
                bcs: {
                  fields: ["id", "name", "branch.city", "gcid"],
                },
                gcs: {
                  fields: ["id", "gc_name", "name", "gpid"],
                },
                gps: {
                  fields: [
                    "id",
                    "gp_name",
                    "credit_limit",
                    "payment_term",
                    "name",
                  ],
                },
                nb: {
                  fields: [
                    "id",
                    "nb_name",
                    "credit_limit",
                    "payment_term",
                    "name",
                  ],
                },
              },
            }),
          },
          token,
        );

        if (!response.ok) {
          throw new Error(
            `Gagal memuat hierarchy National Brand (${response.status})`,
          );
        }

        const json = (await response.json()) as PolicyHierarchyResponse;
        const data = json.data?.data;
        const nbRow = Array.isArray(data?.nb)
          ? (data?.nb?.[0] ?? null)
          : (data?.nb ?? null);

        if (!cancelled) {
          setHierarchyNb(nbRow);
          setHierarchyGps(Array.isArray(data?.gps) ? data?.gps || [] : []);
          setHierarchyGcs(Array.isArray(data?.gcs) ? data?.gcs || [] : []);
          setHierarchyBcs(Array.isArray(data?.bcs) ? data?.bcs || [] : []);
        }
      } catch (error) {
        if (!cancelled) {
          setHierarchyNb(null);
          setHierarchyGps([]);
          setHierarchyGcs([]);
          setHierarchyBcs([]);
          setHierarchyError(
            error instanceof Error
              ? error.message
              : "Gagal memuat hierarchy National Brand",
          );
        }
      } finally {
        if (!cancelled) {
          setHierarchyLoading(false);
        }
      }
    }

    void loadHierarchy();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isOpen, item, token]);

  const handleViewGp = async (id: number) => {
    if (!token || !onViewGP) return;
    const response = await apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["id", "=", id]],
        limit: 1,
      }),
      { method: "GET", cache: "no-store" },
      token,
    );
    if (!response.ok) return;
    const json = await response.json();
    const row = Array.isArray(json?.data)
      ? (json.data[0] as GroupParentDetailRow | undefined)
      : undefined;
    if (!row) return;
    onViewGP(mapGpRow(row));
  };

  const handleViewGc = async (id: number) => {
    if (!token || !onViewGC) return;
    const response = await apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["id", "=", id]],
        limit: 1,
      }),
      { method: "GET", cache: "no-store" },
      token,
    );
    if (!response.ok) return;
    const json = await response.json();
    const row = Array.isArray(json?.data)
      ? (json.data[0] as GroupCustomerDetailRow | undefined)
      : undefined;
    if (!row) return;
    onViewGC(mapGcRow(row));
  };

  const handleViewBc = async (id: number) => {
    if (!token || !onViewBC) return;
    const response = await apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["id", "=", id]],
        limit: 1,
      }),
      { method: "GET", cache: "no-store" },
      token,
    );
    if (!response.ok) return;
    const json = await response.json();
    const row = Array.isArray(json?.data)
      ? (json.data[0] as BranchCustomerDetailRow | undefined)
      : undefined;
    if (!row) return;
    onViewBC(mapBcRow(row));
  };

  const detailTabs = useMemo(
    () => [
      // {
      //   key: "summary" as const,
      //   label: "Ringkasan",
      //   caption: "Status & relasi",
      //   icon: <FaTags className="h-4 w-4" />,
      // },
      // {
      //   key: "owner" as const,
      //   label: "Data Pemilik",
      //   caption: "Owner / pengguna",
      //   icon: <FaUser className="h-4 w-4" />,
      // },
      {
        key: "hierarchy" as const,
        label: "Hierarki",
        caption: "GP, GC, BC aktif",
        icon: <FaUsers className="h-4 w-4" />,
      },
      {
        key: "activity" as const,
        label: "Aktivitas",
        caption: "Riwayat Data",
        icon: <FaClock className="h-4 w-4" />,
      },
    ],
    [],
  );

  const nbCreditConfiguredAtGp = useMemo(
    () =>
      hierarchyGps.some(
        (row) =>
          typeof row.credit_limit === "number" &&
          !Number.isNaN(row.credit_limit),
      ),
    [hierarchyGps],
  );
  const nbPaymentConfiguredAtGp = useMemo(
    () =>
      hierarchyGps.some(
        (row) =>
          typeof row.payment_term === "number" &&
          !Number.isNaN(row.payment_term),
      ),
    [hierarchyGps],
  );

  const hierarchyTree = useMemo(() => {
    const gcById = new Map(hierarchyGcs.map((gc) => [Number(gc.id), gc]));
    const bcsByGcId = new Map<number, PolicyHierarchyBcRow[]>();
    const orphanBcs: PolicyHierarchyBcRow[] = [];

    hierarchyBcs.forEach((bc) => {
      const gcId = toNumber(bc._relations?.gcid?.id);
      if (!gcId || !gcById.has(gcId)) {
        orphanBcs.push(bc);
        return;
      }
      const rows = bcsByGcId.get(gcId) || [];
      rows.push(bc);
      bcsByGcId.set(gcId, rows);
    });

    const gpById = new Map(hierarchyGps.map((gp) => [Number(gp.id), gp]));
    const gcsByGpId = new Map<number, PolicyHierarchyGcRow[]>();
    const orphanGcs: PolicyHierarchyGcRow[] = [];

    hierarchyGcs.forEach((gc) => {
      const gpId =
        typeof gc.gpid === "number"
          ? gc.gpid
          : gc.gpid && typeof gc.gpid === "object"
            ? toNumber(gc.gpid.id)
            : toNumber(gc._relations?.gpid?.id);
      if (!gpId || !gpById.has(gpId)) {
        orphanGcs.push(gc);
        return;
      }
      const rows = gcsByGpId.get(gpId) || [];
      rows.push(gc);
      gcsByGpId.set(gpId, rows);
    });

    return {
      gps: hierarchyGps.map((gp) => ({
        gp,
        gcs: (gcsByGpId.get(Number(gp.id)) || []).map((gc) => ({
          gc,
          bcs: bcsByGcId.get(Number(gc.id)) || [],
        })),
      })),
      orphanGcs: orphanGcs.map((gc) => ({
        gc,
        bcs: bcsByGcId.get(Number(gc.id)) || [],
      })),
      orphanBcs,
    };
  }, [hierarchyBcs, hierarchyGcs, hierarchyGps]);

  const filteredHierarchyTree = useMemo(() => {
    const query = hierarchySearch.trim().toLocaleLowerCase("id-ID");
    if (!query) return hierarchyTree;
    const matches = (...values: Array<string | number | null | undefined>) =>
      values.some((value) =>
        String(value ?? "")
          .toLocaleLowerCase("id-ID")
          .includes(query),
      );
    const matchesBc = (bc: PolicyHierarchyBcRow) =>
      matches(
        bc.id,
        bc.name,
        bc._relations?.gcid?.name,
        bc._relations?.gcid?.gc_name,
        bc._relations?.branch?.city,
      );

    return {
      gps: hierarchyTree.gps
        .map((node) => {
          const gpMatches = matches(
            node.gp.id,
            node.gp.name,
            node.gp.gp_name,
          );
          const gcs = node.gcs.filter(
            ({ gc, bcs }) =>
              gpMatches ||
              matches(gc.id, gc.name, gc.gc_name) ||
              bcs.some(matchesBc),
          );
          return { ...node, gcs };
        })
        .filter(
          ({ gp, gcs }) =>
            matches(gp.id, gp.name, gp.gp_name) || gcs.length > 0,
        ),
      orphanGcs: hierarchyTree.orphanGcs.filter(
        ({ gc, bcs }) =>
          matches(gc.id, gc.name, gc.gc_name) || bcs.some(matchesBc),
      ),
      orphanBcs: hierarchyTree.orphanBcs.filter(matchesBc),
    };
  }, [hierarchySearch, hierarchyTree]);

  const selectedHierarchyDetail = useMemo<NbHierarchyDetail | null>(() => {
    if (!selectedHierarchyNode) return null;
    for (const gpNode of hierarchyTree.gps) {
      if (
        selectedHierarchyNode.type === "gp" &&
        Number(gpNode.gp.id) === selectedHierarchyNode.id
      ) {
        return { type: "gp", gp: gpNode.gp, gcs: gpNode.gcs };
      }
      for (const gcNode of gpNode.gcs) {
        if (
          selectedHierarchyNode.type === "gc" &&
          Number(gcNode.gc.id) === selectedHierarchyNode.id
        ) {
          return {
            type: "gc",
            gp: gpNode.gp,
            gc: gcNode.gc,
            bcs: gcNode.bcs,
          };
        }
        const bc = gcNode.bcs.find(
          (row) => Number(row.id) === selectedHierarchyNode.id,
        );
        if (selectedHierarchyNode.type === "bc" && bc) {
          return { type: "bc", gp: gpNode.gp, gc: gcNode.gc, bc };
        }
      }
    }
    for (const gcNode of hierarchyTree.orphanGcs) {
      if (
        selectedHierarchyNode.type === "gc" &&
        Number(gcNode.gc.id) === selectedHierarchyNode.id
      ) {
        return { type: "gc", gc: gcNode.gc, bcs: gcNode.bcs };
      }
      const bc = gcNode.bcs.find(
        (row) => Number(row.id) === selectedHierarchyNode.id,
      );
      if (selectedHierarchyNode.type === "bc" && bc) {
        return { type: "bc", gc: gcNode.gc, bc };
      }
    }
    const orphanBc = hierarchyTree.orphanBcs.find(
      (row) => Number(row.id) === selectedHierarchyNode.id,
    );
    return selectedHierarchyNode.type === "bc" && orphanBc
      ? { type: "bc", bc: orphanBc }
      : null;
  }, [hierarchyTree, selectedHierarchyNode]);

  if (!item) return null;

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
            className="flex max-h-[94vh] w-full max-w-[96vw] 2xl:max-w-[1320px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl md:max-w-[92vw] md:rounded-3xl"
          >
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-4 md:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <FaTags className="text-xl text-indigo-600" />
                    <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                      National Brand Details
                    </h2>
                  </div>
                  <p className="pl-8 text-xs font-semibold text-slate-500">NBID: {item.code}</p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4 md:p-5">
              <div className="grid min-h-0 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="xl:sticky xl:top-6 xl:self-start">
                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="hidden border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_55%),linear-gradient(135deg,#eef2ff,#ffffff_55%,#f8fafc)] px-4 py-3 xl:block">
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-indigo-700">Panel Detail</p>
                      <h3 className="mt-1 text-base font-bold text-slate-900">Navigasi Data</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Pilih kategori informasi national brand.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-2 xl:grid-cols-1 xl:p-3">
                    {detailTabs.map((tab) => {
                      const active = activeTab === tab.key;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setActiveTab(tab.key)}
                          className={`w-full min-w-0 rounded-2xl border px-3 py-2.5 text-left transition-all ${
                            active
                              ? "border-indigo-500 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-200/70"
                              : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                active
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-indigo-600"
                              }`}
                            >
                              {tab.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{tab.label}</p>
                              <p
                                className={`text-xs ${
                                  active ? "text-indigo-100" : "text-slate-500"
                                }`}
                              >
                                {tab.caption}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    </div>
                  </div>
                </aside>

                <div className="min-h-0 space-y-5">
                  <section className={`${activeTab === "hierarchy" ? "hidden" : ""} rounded-3xl border border-white bg-white p-6 shadow-sm`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
                          National Brand
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Pusat identitas brand dan relasi customer aktif.
                        </p>
                      </div>
                      <div className="grid min-w-[240px] gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                            Credit Limit
                          </p>
                          <p className="mt-2 text-base font-bold text-violet-900">
                            {formatCurrency(hierarchyNb?.credit_limit)}
                          </p>
                          <p className="mt-1 text-xs text-violet-700">
                            {typeof hierarchyNb?.credit_limit === "number" &&
                            !Number.isNaN(hierarchyNb.credit_limit)
                              ? "Sumber: NB"
                              : nbCreditConfiguredAtGp
                                ? "Diatur per GP"
                                : "Belum diatur"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                            Payment Term
                          </p>
                          <p className="mt-2 text-base font-bold text-cyan-900">
                            {formatDays(hierarchyNb?.payment_term)}
                          </p>
                          <p className="mt-1 text-xs text-cyan-700">
                            {typeof hierarchyNb?.payment_term === "number" &&
                            !Number.isNaN(hierarchyNb.payment_term)
                              ? "Sumber: NB"
                              : nbPaymentConfiguredAtGp
                                ? "Diatur per GP"
                                : "Belum diatur"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {activeTab === "summary" && (
                    <section className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                          Status Brand
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-slate-900">
                          {item.disabled === 1 ? (
                            <>
                              <FaBan className="h-5 w-5 text-rose-500" />
                              <span className="text-lg font-semibold">
                                Nonaktif
                              </span>
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="h-5 w-5 text-emerald-500" />
                              <span className="text-lg font-semibold">
                                Aktif
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                          Kode Brand
                        </p>
                        <p className="mt-4 text-lg font-semibold text-slate-900">
                          {item.code}
                        </p>
                      </div>
                    </section>
                  )}

                  {activeTab === "owner" && (
                    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
                          <FaUser className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                            Data Pemilik
                          </p>
                          <h4 className="text-xl font-bold text-slate-900">
                            Owner / Pengguna NB
                          </h4>
                        </div>
                      </div>
                      {item.owners.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          {item.owners.map((owner) => (
                            <div
                              key={owner}
                              className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-slate-900"
                            >
                              {owner}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm italic text-slate-500">
                          Belum ada owner atau pengguna yang terhubung.
                        </p>
                      )}
                    </section>
                  )}

                  {activeTab === "hierarchy" && (
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 px-4 pt-4 sm:pb-4 xl:px-5 xl:pt-5">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 text-white">
                            <FaBuilding className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
                              Struktur Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {hierarchyLoading
                                ? "Loading..."
                                : `${hierarchyGps.length} GP • ${hierarchyGcs.length} GC • ${hierarchyBcs.length} BC`}
                            </p>
                          </div>
                        </div>
                        <label className="relative block w-full px-4 pb-4 sm:max-w-sm sm:py-4 sm:pr-4 xl:py-5 xl:pr-5">
                          <span className="sr-only">Cari hierarchy customer</span>
                          <input
                            type="search"
                            value={hierarchySearch}
                            onChange={(event) => setHierarchySearch(event.target.value)}
                            placeholder="Cari nama atau kode GP, GC, BC..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                          />
                        </label>
                      </div>

                      {hierarchyError ? (
                        <div className="mx-4 mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 xl:mx-5">
                          {hierarchyError}
                        </div>
                      ) : null}

                      <div className="grid min-h-[400px] border-t border-slate-200 lg:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)] xl:min-h-[440px]">
                        <div className="min-h-0 border-b border-slate-200 lg:border-b-0 lg:border-r">
                          <div className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Struktur Customer
                          </div>
                          <div className="max-h-[55vh] overflow-y-auto py-1">
                            {filteredHierarchyTree.gps.map(({ gp, gcs }) => {
                              const gpId = Number(gp.id);
                              const searching = hierarchySearch.trim().length > 0;
                              const expanded = searching || expandedGpId === gpId;
                              const selected = selectedHierarchyNode?.type === "gp" && selectedHierarchyNode.id === gpId;
                              const bcCount = gcs.reduce((total, node) => total + node.bcs.length, 0);
                              const panelId = `nb-explorer-gp-${gpId}`;
                              return (
                                <div key={gpId} className="border-b border-slate-100 last:border-b-0">
                                  <div className={`flex min-h-16 items-stretch border-l-2 ${selected ? "border-violet-500 bg-violet-50/50" : "border-transparent hover:bg-slate-50"}`}>
                                    <button
                                      type="button"
                                      aria-expanded={expanded}
                                      aria-controls={panelId}
                                      onClick={() => {
                                        setExpandedGpId((current) => current === gpId ? null : gpId);
                                        setExpandedGcId(null);
                                      }}
                                      className="flex w-10 shrink-0 items-center justify-center text-violet-500"
                                      aria-label={`${expanded ? "Tutup" : "Buka"} ${gp.gp_name || gp.name || "Group Parent"}`}
                                    >
                                      <FaChevronRight className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} />
                                    </button>
                                    <button
                                      type="button"
                                      aria-expanded={expanded}
                                      aria-controls={panelId}
                                      onClick={() => {
                                        setSelectedHierarchyNode({ type: "gp", id: gpId });
                                        setExpandedGpId((current) => current === gpId ? null : gpId);
                                        setExpandedGcId(null);
                                      }}
                                      className="min-w-0 flex-1 py-2 pr-3 text-left"
                                    >
                                      <p className="truncate text-[13px] font-semibold text-slate-900">{gp.gp_name || gp.name || "-"}</p>
                                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                        <span className="font-semibold text-violet-600">GP</span> • {gcs.length} GC • {bcCount} BC
                                      </p>
                                      <p className="mt-0.5 truncate text-[11px] text-slate-500">{formatCurrency(gp.credit_limit)} • {formatDays(gp.payment_term)}</p>
                                    </button>
                                  </div>
                                  {expanded ? (
                                    <div id={panelId} className="ml-5 border-l border-violet-200">
                                      {gcs.length > 0 ? gcs.map(({ gc, bcs }) => {
                                        const gcId = Number(gc.id);
                                        const normalizedSearch = hierarchySearch.trim().toLocaleLowerCase("id-ID");
                                        const gcMatchesSearch = searching && [
                                          gc.id,
                                          gc.name,
                                          gc.gc_name,
                                          ...bcs.flatMap((bc) => [bc.id, bc.name, bc._relations?.branch?.city]),
                                        ].some((value) => String(value ?? "").toLocaleLowerCase("id-ID").includes(normalizedSearch));
                                        const gcExpanded = gcMatchesSearch || expandedGcId === gcId;
                                        const gcSelected = selectedHierarchyNode?.type === "gc" && selectedHierarchyNode.id === gcId;
                                        const gcPanelId = `nb-explorer-gc-${gcId}`;
                                        return (
                                          <div key={gcId}>
                                            <div className={`flex min-h-[50px] items-stretch border-l-2 ${gcSelected ? "border-blue-500 bg-blue-50/50" : "border-transparent hover:bg-slate-50"}`}>
                                              <button
                                                type="button"
                                                aria-expanded={gcExpanded}
                                                aria-controls={gcPanelId}
                                                onClick={() => setExpandedGcId((current) => current === gcId ? null : gcId)}
                                                className="flex w-9 shrink-0 items-center justify-center text-blue-500"
                                                aria-label={`${gcExpanded ? "Tutup" : "Buka"} ${gc.gc_name || gc.name || "Group Customer"}`}
                                              >
                                                <FaChevronRight className={`h-3 w-3 transition-transform ${gcExpanded ? "rotate-90" : ""}`} />
                                              </button>
                                              <button type="button" aria-expanded={gcExpanded} aria-controls={gcPanelId} onClick={() => {
                                                setSelectedHierarchyNode({ type: "gc", id: gcId });
                                                setExpandedGcId((current) => current === gcId ? null : gcId);
                                              }} className="min-w-0 flex-1 py-2 pr-3 text-left">
                                                <p className="truncate text-xs font-semibold text-slate-800">{gc.gc_name || gc.name || "-"}</p>
                                                <p className="mt-0.5 truncate text-[11px] text-slate-500"><span className="font-semibold text-blue-600">{gc.name || `GC${gc.id}`}</span> • {bcs.length} BC</p>
                                              </button>
                                            </div>
                                            {gcExpanded ? (
                                              <div id={gcPanelId} className="ml-5 border-l border-blue-200 py-0.5">
                                                {bcs.length > 0 ? bcs.map((bc) => {
                                                  const bcId = Number(bc.id);
                                                  const bcSelected = selectedHierarchyNode?.type === "bc" && selectedHierarchyNode.id === bcId;
                                                  const city = bc._relations?.branch?.city || "-";
                                                  return (
                                                    <button
                                                      type="button"
                                                      key={bcId}
                                                      onClick={() => {
                                                        setSelectedHierarchyNode({ type: "bc", id: bcId });
                                                      }}
                                                      className={`flex min-h-11 w-full items-center border-l-2 py-1.5 pl-4 pr-3 text-left ${bcSelected ? "border-orange-500 bg-orange-50/60" : "border-transparent hover:bg-slate-50"}`}
                                                    >
                                                      <span className="mr-2 text-xs text-orange-400">└─</span>
                                                      <span className="min-w-0">
                                                        <span className="block truncate text-xs font-medium text-slate-800">{gc.gc_name || gc.name || "Group Customer"} - {city}</span>
                                                        <span className="block truncate text-[11px] font-bold text-orange-600">{bc.name || `BC${bc.id}`}</span>
                                                      </span>
                                                    </button>
                                                  );
                                                }) : <p className="px-4 py-2 text-xs italic text-slate-400">Belum ada BC.</p>}
                                              </div>
                                            ) : null}
                                          </div>
                                        );
                                      }) : <p className="px-4 py-2 text-xs italic text-slate-400">Belum ada GC.</p>}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}

                            {filteredHierarchyTree.orphanGcs.length > 0 || filteredHierarchyTree.orphanBcs.length > 0 ? (
                              <div className="border-t border-amber-200 bg-amber-50/40 px-4 py-2">
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">Relasi belum lengkap</p>
                                {filteredHierarchyTree.orphanGcs.map(({ gc, bcs }) => (
                                  <button key={gc.id} type="button" onClick={() => setSelectedHierarchyNode({ type: "gc", id: Number(gc.id) })} className="block w-full border-l-2 border-blue-400 px-3 py-2 text-left hover:bg-white/70">
                                    <span className="block truncate text-xs font-semibold text-slate-800">{gc.gc_name || gc.name || "-"}</span>
                                    <span className="text-[10px] text-amber-700">Parent GP tidak ditemukan • {bcs.length} BC</span>
                                  </button>
                                ))}
                                {filteredHierarchyTree.orphanBcs.map((bc) => (
                                  <button key={bc.id} type="button" onClick={() => setSelectedHierarchyNode({ type: "bc", id: Number(bc.id) })} className="block w-full border-l-2 border-orange-400 px-3 py-2 text-left hover:bg-white/70">
                                    <span className="block truncate text-xs font-semibold text-slate-800">{bc._relations?.branch?.city || bc.name || "-"}</span>
                                    <span className="text-[10px] text-amber-700">Parent GC tidak ditemukan</span>
                                  </button>
                                ))}
                              </div>
                            ) : null}

                            {!hierarchyLoading && filteredHierarchyTree.gps.length === 0 && filteredHierarchyTree.orphanGcs.length === 0 && filteredHierarchyTree.orphanBcs.length === 0 ? (
                              <p className="px-4 py-10 text-center text-sm italic text-slate-500">{hierarchySearch.trim() ? "Customer tidak ditemukan." : "Belum ada hierarchy customer aktif."}</p>
                            ) : null}
                          </div>
                        </div>

                        <aside className="min-h-0 bg-slate-50/50">
                          <div className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Detail Customer</div>
                          <div className="max-h-[55vh] overflow-y-auto p-4 xl:p-5">
                            {selectedHierarchyDetail ? (
                              <div>
                                <nav className="mb-5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500" aria-label="Breadcrumb hierarchy">
                                  <span>{item.name}</span>
                                  {selectedHierarchyDetail.type !== "gp" && selectedHierarchyDetail.gp ? <><span>/</span><span>{selectedHierarchyDetail.gp.gp_name || selectedHierarchyDetail.gp.name}</span></> : null}
                                  {selectedHierarchyDetail.type === "bc" && selectedHierarchyDetail.gc ? <><span>/</span><span>{selectedHierarchyDetail.gc.gc_name || selectedHierarchyDetail.gc.name}</span></> : null}
                                  <span>/</span>
                                  <span className="font-semibold text-slate-800">
                                    {selectedHierarchyDetail.type === "gp" ? selectedHierarchyDetail.gp.gp_name || selectedHierarchyDetail.gp.name : selectedHierarchyDetail.type === "gc" ? selectedHierarchyDetail.gc.gc_name || selectedHierarchyDetail.gc.name : selectedHierarchyDetail.bc._relations?.branch?.city || selectedHierarchyDetail.bc.name}
                                  </span>
                                </nav>

                                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${selectedHierarchyDetail.type === "gp" ? "text-violet-600" : selectedHierarchyDetail.type === "gc" ? "text-blue-600" : "text-orange-600"}`}>
                                  {selectedHierarchyDetail.type === "gp" ? "Group Parent" : selectedHierarchyDetail.type === "gc" ? "Group Customer" : "Branch Customer"}
                                </p>
                                <h4 className="mt-2 text-xl font-bold text-slate-900">
                                  {selectedHierarchyDetail.type === "gp" ? selectedHierarchyDetail.gp.gp_name || selectedHierarchyDetail.gp.name : selectedHierarchyDetail.type === "gc" ? selectedHierarchyDetail.gc.gc_name || selectedHierarchyDetail.gc.name : `${selectedHierarchyDetail.gc?.gc_name || selectedHierarchyDetail.gc?.name || "Branch Customer"} - ${selectedHierarchyDetail.bc._relations?.branch?.city || "-"}`}
                                </h4>
                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                  {selectedHierarchyDetail.type === "gp" ? `GPID: ${selectedHierarchyDetail.gp.name || `GP${selectedHierarchyDetail.gp.id}`}` : selectedHierarchyDetail.type === "gc" ? `GCID: ${selectedHierarchyDetail.gc.name || `GC${selectedHierarchyDetail.gc.id}`}` : `BCID: ${selectedHierarchyDetail.bc.name || `BC${selectedHierarchyDetail.bc.id}`}`}
                                </p>

                                <div className="mt-5 space-y-4 border-t border-slate-200 pt-4 text-sm">
                                  {selectedHierarchyDetail.type === "gp" ? (
                                    <>
                                      <div><p className="text-xs text-slate-500">Turunan</p><p className="mt-1 font-semibold text-slate-800">{selectedHierarchyDetail.gcs.length} GC • {selectedHierarchyDetail.gcs.reduce((total, node) => total + node.bcs.length, 0)} BC</p></div>
                                      <div><p className="text-xs text-slate-500">Policy</p><p className="mt-1 font-semibold text-slate-800">{formatCurrency(selectedHierarchyDetail.gp.credit_limit)} • {formatDays(selectedHierarchyDetail.gp.payment_term)}</p></div>
                                    </>
                                  ) : selectedHierarchyDetail.type === "gc" ? (
                                    <>
                                      <div><p className="text-xs text-slate-500">Parent</p><p className="mt-1 font-semibold text-slate-800">GP: {selectedHierarchyDetail.gp?.gp_name || selectedHierarchyDetail.gp?.name || "Relasi belum lengkap"}</p></div>
                                      <div><p className="text-xs text-slate-500">Branch Customer</p><div className="mt-2 space-y-1.5">{selectedHierarchyDetail.bcs.length > 0 ? selectedHierarchyDetail.bcs.map((bc) => <div key={bc.id} className="flex items-center justify-between gap-3 border-b border-slate-100 py-1.5"><span className="truncate text-slate-700">{bc._relations?.branch?.city || "-"}</span><span className="shrink-0 text-xs font-semibold text-orange-600">{bc.name || `BC${bc.id}`}</span></div>) : <p className="italic text-slate-400">Belum ada BC.</p>}</div></div>
                                    </>
                                  ) : (
                                    <>
                                      <div><p className="text-xs text-slate-500">Parent</p><p className="mt-1 font-semibold text-slate-800">GP: {selectedHierarchyDetail.gp?.gp_name || selectedHierarchyDetail.gp?.name || "-"}</p><p className="mt-1 font-semibold text-slate-800">GC: {selectedHierarchyDetail.gc?.gc_name || selectedHierarchyDetail.gc?.name || "Relasi belum lengkap"}</p></div>
                                      <div><p className="text-xs text-slate-500">Kota Branch</p><p className="mt-1 font-semibold text-slate-800">{selectedHierarchyDetail.bc._relations?.branch?.city || "-"}</p></div>
                                    </>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => selectedHierarchyDetail.type === "gp" ? void handleViewGp(Number(selectedHierarchyDetail.gp.id)) : selectedHierarchyDetail.type === "gc" ? void handleViewGc(Number(selectedHierarchyDetail.gc.id)) : void handleViewBc(Number(selectedHierarchyDetail.bc.id))}
                                  className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                                >
                                  {selectedHierarchyDetail.type === "gp" ? "Lihat Detail GP" : selectedHierarchyDetail.type === "gc" ? "Lihat Detail GC" : "Lihat Detail BC"}
                                </button>
                              </div>
                            ) : (
                              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                                <FaUsers className="h-8 w-8 text-slate-300" />
                                <p className="mt-3 font-semibold text-slate-700">Pilih customer pada struktur</p>
                                <p className="mt-1 max-w-xs text-sm text-slate-500">Klik nama GP, GC, atau BC untuk melihat konteks dan detailnya di sini.</p>
                              </div>
                            )}
                          </div>
                        </aside>
                      </div>
                    </section>
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
                              {activityUsers.createdBy || "System"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(item.created_at)}
                        </p>
                      </div>

                      <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
                            <FaClock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                              Updated
                            </p>
                            <p className="text-sm text-slate-500">
                              {activityUsers.updatedBy || "System"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(item.updated_at)}
                        </p>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            <div className="flex border-t border-slate-200 bg-white px-4 py-4 md:justify-end md:px-6">
              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 md:w-auto"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
