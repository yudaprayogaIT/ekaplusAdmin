"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBuilding,
  FaChevronRight,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type {
  BranchCustomer,
  GroupCustomer,
  GroupParent,
} from "@/types/customer";
import type { NationalBrandDetailData } from "@/components/national_brand/NBDetailModal";
import {
  API_CONFIG,
  apiFetch,
  getApiUrl,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface GPDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gp: GroupParent | null;
  onGPUpdate?: (updatedGP: GroupParent) => void;
  onViewNB?: (nb: NationalBrandDetailData) => void;
  onViewGC?: (gc: GroupCustomer) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

interface GroupParentMetaRow {
  id: number;
  description?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
  nbid?:
    | number
    | { id?: number | string; name?: string; nb_name?: string }
    | null;
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  credit_limit?: number | null;
  payment_term?: number | null;
}

interface PolicyHierarchyGcRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
}

interface PolicyHierarchyGpRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  credit_limit?: number | null;
  payment_term?: number | null;
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

interface PolicyHierarchyResponse {
  data?: {
    data?: {
      gp?: PolicyHierarchyGpRow | null;
      gcs?: PolicyHierarchyGcRow[] | null;
      bcs?: PolicyHierarchyBcRow[] | null;
    } | null;
  } | null;
}

// type DetailTab = "company" | "finance" | "hierarchy" | "activity";
type DetailTab = "hierarchy" | "activity";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
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

function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
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

function parseNullableInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseNullableFloat(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseFloat(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

export function GPDetailModal({
  isOpen,
  onClose,
  gp,
  onGPUpdate,
  onViewNB,
  onViewGC,
  onViewBC,
}: GPDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DetailTab>("hierarchy");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
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
  const [isSaving, setIsSaving] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [childGCs, setChildGCs] = useState<GroupCustomer[]>([]);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);
  const [expandedGcId, setExpandedGcId] = useState<number | null>(null);
  const [selectedHierarchyNode, setSelectedHierarchyNode] = useState<{
    type: "gc" | "bc";
    id: number;
  } | null>(null);
  const [hierarchyGp, setHierarchyGp] = useState<PolicyHierarchyGpRow | null>(
    null,
  );
  const [linkedNB, setLinkedNB] = useState<{
    id: number;
    code: string;
    name: string;
    credit_limit?: number | null;
    payment_term?: number | null;
    disabled?: number | null;
    created_at?: string | null;
    updated_at?: string | null;
  } | null>(null);
  const [activityUsers, setActivityUsers] = useState<{
    createdBy?: string;
    updatedBy?: string;
  }>({});

  const syncEditState = useCallback((source: GroupParent) => {
    setEditedName(source.name);
    setEditedDescription(source.description || "");
    setEditedCreditLimitActive(Number(source.credit_limit_active || 0));
    setEditedCreditLimit(
      source.credit_limit === null || source.credit_limit === undefined
        ? ""
        : String(source.credit_limit),
    );
    setEditedPaymentTermActive(Number(source.payment_term_active || 0));
    setEditedPaymentTerm(
      source.payment_term === null || source.payment_term === undefined
        ? ""
        : String(source.payment_term),
    );
    setEditedLimitCustomerOverdueActive(
      Number(source.limit_customer_overdue_active || 0),
    );
    setEditedLimitCustomerOverdue(
      source.limit_customer_overdue === null ||
        source.limit_customer_overdue === undefined
        ? ""
        : String(source.limit_customer_overdue),
    );
  }, []);

  useEffect(() => {
    if (isOpen && gp) {
      setActiveTab("hierarchy");
      setIsEditMode(false);
      setExpandedGcId(null);
      setSelectedHierarchyNode(null);
      setChildGCs([]);
      setChildBCs([]);
      setLinkedNB(null);
      syncEditState(gp);
    }
  }, [gp, isOpen, syncEditState]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const loadChildren = useCallback(async () => {
    if (!isOpen || !gp || !isAuthenticated || !token) return;

    setLoadingChildren(true);
    try {
      setHierarchyGp(null);
      const gpMetaRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
          fields: [
            "id",
            "nbid",
            "description",
            "created_by.full_name",
            "updated_by.full_name",
            "created_by",
            "updated_by",
          ],
          filters: [["id", "=", gp.id]],
          limit: 1,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const gpMetaJson = gpMetaRes.ok ? await gpMetaRes.json() : { data: [] };
      const gpMeta: GroupParentMetaRow | undefined = Array.isArray(
        gpMetaJson?.data,
      )
        ? gpMetaJson.data[0]
        : undefined;
      const nbId =
        gpMeta && typeof gpMeta.nbid === "number"
          ? gpMeta.nbid
          : gpMeta?.nbid && typeof gpMeta.nbid === "object"
            ? toNumber(gpMeta.nbid.id)
            : undefined;
      setActivityUsers({
        createdBy: resolveUserName(
          gpMeta?.["created_by.full_name"],
          gpMeta?.created_by,
        ),
        updatedBy: resolveUserName(
          gpMeta?.["updated_by.full_name"],
          gpMeta?.updated_by,
        ),
      });

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
                credit_limit: nbRow.credit_limit ?? null,
                payment_term: nbRow.payment_term ?? null,
                disabled: nbRow.disabled ?? null,
                created_at: nbRow.created_at || null,
                updated_at: nbRow.updated_at || null,
              }
            : null,
        );
      }

      const hierarchyResponse = await apiFetch(
        getApiUrl(
          `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`,
        ),
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify({
            level: "gpid",
            value: gp.id,
            format: "full",
            entities: ["gp", "gcs", "bcs"],
            query: {
              bcs: {
                fields: ["id", "name", "branch.city", "gcid"],
              },
              gcs: {
                fields: ["id", "gc_name", "name"],
              },
              gp: {
                fields: [
                  "id",
                  "gp_name",
                  "credit_limit",
                  "payment_term",
                  "name",
                ],
              },
              nb: {
                fields: ["id", "nb_name"],
              },
            },
          }),
        },
        token,
      );

      if (!hierarchyResponse.ok) {
        throw new Error(
          `Gagal memuat hierarchy Group Parent (${hierarchyResponse.status})`,
        );
      }

      const hierarchyJson =
        (await hierarchyResponse.json()) as PolicyHierarchyResponse;
      const hierarchyData = hierarchyJson.data?.data;
      setHierarchyGp(hierarchyData?.gp || null);
      const hierarchyGcRows = Array.isArray(hierarchyData?.gcs)
        ? hierarchyData?.gcs || []
        : [];
      const hierarchyBcRows = Array.isArray(hierarchyData?.bcs)
        ? hierarchyData?.bcs || []
        : [];

      const mappedGCs: GroupCustomer[] = hierarchyGcRows.map((row) => ({
        id: Number(row.id),
        code: row.name || undefined,
        name: row.gc_name || row.name || "-",
        gp_id: gp.id,
        gp_name: gp.name,
        gp_code: gp.code,
        created_at: new Date(0).toISOString(),
        updated_at: new Date(0).toISOString(),
        disabled: 0,
      }));
      setChildGCs(mappedGCs);

      const mappedBCs: BranchCustomer[] = hierarchyBcRows.map((row) => {
        const gcId = toNumber(row._relations?.gcid?.id) || 0;
        const gcCode = row._relations?.gcid?.name || undefined;
        const gcName =
          row._relations?.gcid?.gc_name ||
          row._relations?.gcid?.name ||
          undefined;
        const branchCity = row._relations?.branch?.city || undefined;

        return {
          id: Number(row.id),
          code: row.name || undefined,
          name: `${gcName || "GC"} - ${branchCity || "-"}`,
          gc_id: gcId,
          gc_name: gcName,
          gc_code: gcCode,
          gp_name: gp.name,
          gp_code: gp.code,
          branch_id: 0,
          branch_city: branchCity,
          created_at: new Date(0).toISOString(),
          updated_at: new Date(0).toISOString(),
          disabled: 0,
        };
      });
      setChildBCs(mappedBCs);
    } catch {
      setHierarchyGp(null);
      setChildGCs([]);
      setChildBCs([]);
    } finally {
      setLoadingChildren(false);
    }
  }, [gp, isAuthenticated, isOpen, token]);

  const handleViewLinkedNb = async () => {
    if (!token || !linkedNB || !onViewNB) return;

    try {
      const [nbRes, hierarchyRes, memberRes] = await Promise.all([
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
            fields: [
              "id",
              "name",
              "nb_name",
              "disabled",
              "created_at",
              "updated_at",
            ],
            filters: [["id", "=", linkedNB.id]],
            limit: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        ),
        apiFetch(
          getApiUrl(
            `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`,
          ),
          {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({
              level: "nbid",
              value: linkedNB.id,
              format: "full",
              entities: ["gps", "gcs", "bcs"],
              query: {
                bcs: {
                  fields: ["id", "name", "branch.city", "gcid"],
                },
                gcs: {
                  fields: ["id", "gc_name", "name"],
                },
                gps: {
                  fields: ["id", "gp_name", "name"],
                },
                nb: {
                  fields: ["id", "nb_name", "name"],
                },
              },
            }),
          },
          token,
        ),
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.MEMBER_OF, {
            fields: ["*", "user.full_name"],
            filters: [
              ["ref_type", "=", "nbid"],
              ["ref_id", "=", linkedNB.id],
            ],
          }),
          { method: "GET", cache: "no-store" },
          token,
        ),
      ]);

      if (!nbRes.ok || !hierarchyRes.ok) return;

      const nbJson = await nbRes.json();
      const nbRow: NationalBrandRow | undefined = Array.isArray(nbJson?.data)
        ? nbJson.data[0]
        : undefined;

      const hierarchyJson = (await hierarchyRes.json()) as {
        data?: {
          data?: {
            gps?: Array<{ id: number; gp_name?: string | null }> | null;
            gcs?: Array<{ id: number; gc_name?: string | null }> | null;
            bcs?: Array<{
              id: number;
              name?: string | null;
              _relations?: {
                gcid?: { gc_name?: string | null } | null;
                branch?: { city?: string | null } | null;
              } | null;
            }> | null;
          } | null;
        } | null;
      };

      const memberJson = memberRes.ok ? await memberRes.json() : { data: [] };
      const owners = Array.isArray(memberJson?.data)
        ? memberJson.data
            .map(
              (row: { user?: { full_name?: string | null } | null }) =>
                row.user?.full_name || null,
            )
            .filter((value: string | null): value is string => Boolean(value))
        : [];

      const gps = Array.isArray(hierarchyJson.data?.data?.gps)
        ? hierarchyJson.data?.data?.gps || []
        : [];
      const gcs = Array.isArray(hierarchyJson.data?.data?.gcs)
        ? hierarchyJson.data?.data?.gcs || []
        : [];
      const bcs = Array.isArray(hierarchyJson.data?.data?.bcs)
        ? hierarchyJson.data?.data?.bcs || []
        : [];

      onViewNB({
        id: linkedNB.id,
        code: (nbRow?.name || linkedNB.code || `NB${linkedNB.id}`) as string,
        name: (nbRow?.nb_name || nbRow?.name || linkedNB.name || "-") as string,
        disabled: Number(nbRow?.disabled || linkedNB.disabled || 0),
        created_at:
          nbRow?.created_at || linkedNB.created_at || new Date(0).toISOString(),
        updated_at:
          nbRow?.updated_at ||
          linkedNB.updated_at ||
          nbRow?.created_at ||
          new Date(0).toISOString(),
        owners,
        active_gp_count: gps.length,
        active_gc_count: gcs.length,
        active_bc_count: bcs.length,
        active_gp_names: gps.map((row) => row.gp_name || `GP ${row.id}`),
        active_gc_names: gcs.map((row) => row.gc_name || `GC ${row.id}`),
        active_bc_names: bcs.map((row) => {
          const gcName = row._relations?.gcid?.gc_name || "GC";
          const city = row._relations?.branch?.city || "-";
          return `${gcName} - ${city}`;
        }),
      });
    } catch {
      // swallow for now; clicking should fail quietly
    }
  };

  useEffect(() => {
    void loadChildren();
  }, [loadChildren]);

  const handleEditClick = () => {
    if (!gp) return;
    syncEditState(gp);
    setActiveTab("hierarchy");
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    if (!gp) return;
    syncEditState(gp);
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!gp || !editedName.trim() || !token || !isAuthenticated) return;

    setIsSaving(true);
    try {
      const payload = {
        gp_name: editedName.trim(),
        description: editedDescription.trim() || null,
        credit_limit_active: editedCreditLimitActive,
        credit_limit: parseNullableFloat(editedCreditLimit),
        payment_term_active: editedPaymentTermActive,
        payment_term: parseNullableInt(editedPaymentTerm),
        limit_customer_overdue_active: editedLimitCustomerOverdueActive,
        limit_customer_overdue: parseNullableInt(editedLimitCustomerOverdue),
      };

      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gp.id),
        { method: "PUT", body: JSON.stringify(payload), cache: "no-store" },
        token,
      );
      if (!res.ok) {
        throw new Error(`Failed to update Group Parent (${res.status})`);
      }

      onGPUpdate?.({
        ...gp,
        name: editedName.trim(),
        description: editedDescription.trim() || undefined,
        credit_limit_active: editedCreditLimitActive,
        credit_limit: parseNullableFloat(editedCreditLimit),
        payment_term_active: editedPaymentTermActive,
        payment_term: parseNullableInt(editedPaymentTerm),
        limit_customer_overdue_active: editedLimitCustomerOverdueActive,
        limit_customer_overdue: parseNullableInt(editedLimitCustomerOverdue),
        updated_at: new Date().toISOString(),
      });
      setIsEditMode(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Gagal update Group Parent",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const detailTabs = useMemo(
    () => [
      // {
      //   key: "company" as const,
      //   label: "Data Perusahaan",
      //   caption: "Identitas & owner",
      //   icon: <FaBuilding className="h-4 w-4" />,
      // },
      // {
      //   key: "finance" as const,
      //   label: "Data Keuangan",
      //   caption: "Credit & term",
      //   icon: <FaTags className="h-4 w-4" />,
      // },
      {
        key: "hierarchy" as const,
        label: "Hierarki",
        caption: "GC & BC turunan",
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

  const gpHierarchyTree = useMemo(() => {
    const gcIds = new Set(childGCs.map((gc) => Number(gc.id)));
    const bcsByGcId = new Map<number, BranchCustomer[]>();
    const orphanBcs: BranchCustomer[] = [];
    childBCs.forEach((bc) => {
      const gcId = Number(bc.gc_id || 0);
      if (!gcId || !gcIds.has(gcId)) {
        orphanBcs.push(bc);
        return;
      }
      const rows = bcsByGcId.get(gcId) || [];
      rows.push(bc);
      bcsByGcId.set(gcId, rows);
    });
    return {
      gcs: childGCs.map((gc) => ({
        gc,
        bcs: bcsByGcId.get(Number(gc.id)) || [],
      })),
      orphanBcs,
    };
  }, [childBCs, childGCs]);

  const selectedHierarchyDetail = useMemo(() => {
    if (!selectedHierarchyNode) return null;
    for (const node of gpHierarchyTree.gcs) {
      if (
        selectedHierarchyNode.type === "gc" &&
        Number(node.gc.id) === selectedHierarchyNode.id
      ) {
        return { type: "gc" as const, gc: node.gc, bcs: node.bcs };
      }
      const bc = node.bcs.find(
        (row) => Number(row.id) === selectedHierarchyNode.id,
      );
      if (selectedHierarchyNode.type === "bc" && bc) {
        return { type: "bc" as const, gc: node.gc, bc };
      }
    }
    const orphanBc = gpHierarchyTree.orphanBcs.find(
      (row) => Number(row.id) === selectedHierarchyNode.id,
    );
    return selectedHierarchyNode.type === "bc" && orphanBc
      ? { type: "bc" as const, bc: orphanBc }
      : null;
  }, [gpHierarchyTree, selectedHierarchyNode]);

  if (!gp) return null;

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
                    <FaBuilding className="text-xl text-violet-600" />
                    <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                      Group Parent Details
                    </h2>
                  </div>
                  <p className="pl-8 text-xs font-semibold text-slate-500">GPID: {gp.code || `GP${gp.id}`}</p>
                </div>
                <button onClick={onClose} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"><HiXMark className="h-5 w-5" /></button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-4 md:p-5">
              <div className="grid min-h-0 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="xl:sticky xl:top-6 xl:self-start">
                  <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="hidden border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.16),_transparent_55%),linear-gradient(135deg,#f5f3ff,#ffffff_55%,#f8fafc)] px-4 py-3 xl:block">
                      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-violet-700">Panel Detail</p>
                      <h3 className="mt-1 text-base font-bold text-slate-900">Navigasi Data</h3>
                      <p className="mt-0.5 text-xs text-slate-500">Pilih kategori informasi group parent.</p>
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
                              ? "border-purple-500 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-200/70"
                              : "border-slate-200 bg-white text-slate-700 hover:border-purple-200 hover:bg-purple-50/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                active
                                  ? "bg-white/20 text-white"
                                  : "bg-slate-100 text-purple-600"
                              }`}
                            >
                              {tab.icon}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">
                                {tab.label}
                              </p>
                              <p
                                className={`text-xs ${
                                  active ? "text-purple-100" : "text-slate-500"
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
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-500">
                          Group Parent
                        </p>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="mt-3 w-full rounded-2xl border border-purple-200 px-4 py-3 text-2xl font-bold text-slate-900 outline-none ring-0 focus:border-purple-400"
                            placeholder="Masukkan nama group parent"
                            disabled={isSaving}
                          />
                        ) : (
                          <h3 className="mt-2 text-3xl font-bold text-slate-900">
                            {gp.name}
                          </h3>
                        )}
                        <p className="mt-2 text-sm text-slate-500">
                          Entitas induk untuk relasi group customer dan branch
                          customer.
                        </p>
                        {linkedNB && (
                          <p className="mt-3 text-sm text-slate-500">
                            Terhubung ke National Brand{" "}
                            <span className="font-semibold text-slate-900">
                              {linkedNB.name}
                            </span>{" "}
                            <span className="text-indigo-600">
                              ({linkedNB.code})
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="grid min-w-[240px] gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                            Credit Limit
                          </p>
                          <p className="mt-3 text-2xl font-bold leading-none text-violet-900">
                            {formatCurrency(
                              hierarchyGp?.credit_limit ?? gp.credit_limit,
                            )}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                            Payment Term
                          </p>
                          <p className="mt-3 text-2xl font-bold leading-none text-cyan-900">
                            {formatDays(
                              hierarchyGp?.payment_term ?? gp.payment_term,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* {activeTab === "company" && (
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
                      <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-500">
                          Data Perusahaan
                        </p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Group Parent ID
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900">
                              {gp.code || `GP${gp.id}`}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Status
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900">
                              {gp.disabled === 1 ? "Disabled" : "Active"}
                            </p>
                          </div>
                          <div className="sm:col-span-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Description
                            </p>
                            {isEditMode ? (
                              <textarea
                                value={editedDescription}
                                onChange={(e) =>
                                  setEditedDescription(e.target.value)
                                }
                                className="mt-2 min-h-[96px] w-full rounded-xl border border-purple-200 bg-white px-3 py-2 text-sm"
                                placeholder="Deskripsi group parent"
                                disabled={isSaving}
                              />
                            ) : (
                              <p className="mt-2 whitespace-pre-wrap text-sm font-medium text-slate-900">
                                {gp.description || "-"}
                              </p>
                            )}
                          </div>
                        </div>
                      </section>

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

                        <div className="space-y-3 text-sm text-slate-800">
                          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <FaUser className="mt-0.5 h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Nama Owner
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {gp.owner_name || "-"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <FaPhone className="mt-0.5 h-4 w-4 text-emerald-500" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Telepon
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {gp.owner_phone || "-"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <FaEnvelope className="mt-0.5 h-4 w-4 text-orange-500" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Email
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {gp.owner_email || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
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
                                  checked={editedCreditLimitActive === 1}
                                  onChange={(e) =>
                                    setEditedCreditLimitActive(
                                      e.target.checked ? 1 : 0,
                                    )
                                  }
                                  disabled={isSaving}
                                />
                                Active
                              </label>
                            )}
                          </div>
                          {isEditMode ? (
                            <>
                              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                                Credit Limit Active
                              </p>
                              <p className="mb-3 text-sm font-semibold text-slate-900">
                                {editedCreditLimitActive === 1 ? "Yes" : "No"}
                              </p>
                              <input
                                type="text"
                                value={editedCreditLimit}
                                onChange={(e) =>
                                  setEditedCreditLimit(
                                    e.target.value.replace(/[^\d.,-]/g, ""),
                                  )
                                }
                                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
                                placeholder="Masukkan credit limit"
                                disabled={isSaving}
                              />
                            </>
                          ) : (
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Active:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {gp.credit_limit_active === 1 ? "Yes" : "No"}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Value:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {formatNullableNumber(gp.credit_limit)}
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
                                  checked={editedPaymentTermActive === 1}
                                  onChange={(e) =>
                                    setEditedPaymentTermActive(
                                      e.target.checked ? 1 : 0,
                                    )
                                  }
                                  disabled={isSaving}
                                />
                                Active
                              </label>
                            )}
                          </div>
                          {isEditMode ? (
                            <>
                              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                                Payment Term Active
                              </p>
                              <p className="mb-3 text-sm font-semibold text-slate-900">
                                {editedPaymentTermActive === 1 ? "Yes" : "No"}
                              </p>
                              <input
                                type="number"
                                value={editedPaymentTerm}
                                onChange={(e) =>
                                  setEditedPaymentTerm(e.target.value)
                                }
                                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
                                placeholder="Masukkan payment term"
                                disabled={isSaving}
                              />
                            </>
                          ) : (
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Active:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {gp.payment_term_active === 1 ? "Yes" : "No"}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Value:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {formatNullableNumber(gp.payment_term)}
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
                                    editedLimitCustomerOverdueActive === 1
                                  }
                                  onChange={(e) =>
                                    setEditedLimitCustomerOverdueActive(
                                      e.target.checked ? 1 : 0,
                                    )
                                  }
                                  disabled={isSaving}
                                />
                                Active
                              </label>
                            )}
                          </div>
                          {isEditMode ? (
                            <>
                              <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                                Overdue Active
                              </p>
                              <p className="mb-3 text-sm font-semibold text-slate-900">
                                {editedLimitCustomerOverdueActive === 1
                                  ? "Yes"
                                  : "No"}
                              </p>
                              <input
                                type="number"
                                value={editedLimitCustomerOverdue}
                                onChange={(e) =>
                                  setEditedLimitCustomerOverdue(e.target.value)
                                }
                                className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm"
                                placeholder="Masukkan batas overdue"
                                disabled={isSaving}
                              />
                            </>
                          ) : (
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-semibold text-slate-500">
                                  Active:
                                </span>{" "}
                                <span className="font-semibold text-slate-900">
                                  {gp.limit_customer_overdue_active === 1
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
                                    gp.limit_customer_overdue,
                                  )}
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )} */}

                  {activeTab === "hierarchy" && (
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 xl:px-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white">
                            <FaUsers className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                              Struktur Customer
                            </p>
                            <p className="truncate text-sm text-slate-500">
                              {loadingChildren
                                ? "Loading..."
                                : `${childGCs.length} GC • ${childBCs.length} BC`}
                            </p>
                          </div>
                        </div>
                        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                          {linkedNB ? (
                            <>
                              <button
                                type="button"
                                onClick={() => void handleViewLinkedNb()}
                                className="max-w-40 truncate font-semibold text-indigo-600 hover:underline"
                              >
                                {linkedNB.name}
                              </button>
                              <span>/</span>
                            </>
                          ) : null}
                          <span className="max-w-48 truncate font-semibold text-violet-600">
                            {gp.name}
                          </span>
                        </div>
                      </div>

                      <div className="grid min-h-[400px] lg:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)] xl:min-h-[440px]">
                        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                          <div className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Group Customer & Branch
                          </div>
                          <div className="max-h-[55vh] overflow-y-auto py-1">
                            {gpHierarchyTree.gcs.length > 0 ? (
                              gpHierarchyTree.gcs.map(({ gc, bcs }) => {
                                const gcId = Number(gc.id);
                                const expanded = expandedGcId === gcId;
                                const selected =
                                  selectedHierarchyNode?.type === "gc" &&
                                  selectedHierarchyNode.id === gcId;
                                const panelId = `gp-explorer-gc-${gcId}`;
                                return (
                                  <div
                                    key={gcId}
                                    className="border-b border-slate-100 last:border-b-0"
                                  >
                                    <div
                                      className={`flex min-h-[54px] items-stretch border-l-2 ${selected ? "border-blue-500 bg-blue-50/50" : "border-transparent hover:bg-slate-50"}`}
                                    >
                                      <button
                                        type="button"
                                        aria-expanded={expanded}
                                        aria-controls={panelId}
                                        onClick={() =>
                                          setExpandedGcId((current) =>
                                            current === gcId ? null : gcId,
                                          )
                                        }
                                        className="flex w-10 shrink-0 items-center justify-center text-blue-500"
                                        aria-label={`${expanded ? "Tutup" : "Buka"} ${gc.name}`}
                                      >
                                        <FaChevronRight
                                          className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
                                        />
                                      </button>
                                      <button
                                        type="button"
                                        aria-expanded={expanded}
                                        aria-controls={panelId}
                                        onClick={() => {
                                          setSelectedHierarchyNode({
                                            type: "gc",
                                            id: gcId,
                                          });
                                          setExpandedGcId((current) =>
                                            current === gcId ? null : gcId,
                                          );
                                        }}
                                        className="min-w-0 flex-1 py-2 pr-3 text-left"
                                      >
                                        <p className="truncate text-[13px] font-semibold text-slate-900">
                                          {gc.name}
                                        </p>
                                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                          <span className="font-semibold text-blue-600">
                                            {gc.code || `GC${gc.id}`}
                                          </span>{" "}
                                          • {bcs.length} BC
                                        </p>
                                      </button>
                                    </div>
                                    {expanded ? (
                                      <div
                                        id={panelId}
                                        className="ml-5 border-l border-blue-200 py-0.5"
                                      >
                                        {bcs.length > 0 ? (
                                          bcs.map((item) => {
                                            const bcId = Number(item.id);
                                            const bcSelected =
                                              selectedHierarchyNode?.type ===
                                                "bc" &&
                                              selectedHierarchyNode.id === bcId;
                                            return (
                                              <button
                                                type="button"
                                                key={bcId}
                                                onClick={() => {
                                                  setSelectedHierarchyNode({
                                                    type: "bc",
                                                    id: bcId,
                                                  });
                                                }}
                                                className={`flex min-h-11 w-full items-center border-l-2 py-1.5 pl-4 pr-3 text-left ${bcSelected ? "border-orange-500 bg-orange-50/60" : "border-transparent hover:bg-slate-50"}`}
                                              >
                                                <span className="mr-2 text-xs text-orange-400">
                                                  └─
                                                </span>
                                                <span className="min-w-0">
                                                  <span className="block truncate text-xs font-medium text-slate-800">
                                                    {gc.name} -{" "}
                                                    {item.branch_city ||
                                                      item.branch_name ||
                                                      "-"}
                                                  </span>
                                                  <span className="block truncate text-[11px] font-bold text-orange-600">
                                                    {item.code ||
                                                      `BC${item.id}`}
                                                  </span>
                                                </span>
                                              </button>
                                            );
                                          })
                                        ) : (
                                          <p className="px-4 py-2 text-xs italic text-slate-400">
                                            Belum ada BC.
                                          </p>
                                        )}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })
                            ) : (
                              <p className="px-4 py-10 text-center text-sm italic text-slate-500">
                                Belum ada GC terdaftar.
                              </p>
                            )}

                            {gpHierarchyTree.orphanBcs.length > 0 ? (
                              <div className="border-t border-amber-200 bg-amber-50/40 px-4 py-2">
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                  Relasi belum lengkap
                                </p>
                                {gpHierarchyTree.orphanBcs.map((item) => (
                                  <button
                                    type="button"
                                    key={item.id}
                                    onClick={() => {
                                      setSelectedHierarchyNode({
                                        type: "bc",
                                        id: Number(item.id),
                                      });
                                    }}
                                    className="block w-full border-l-2 border-orange-400 px-3 py-2 text-left hover:bg-white/70"
                                  >
                                    <span className="block truncate text-xs font-semibold text-slate-800">
                                      {item.name}
                                    </span>
                                    <span className="text-[10px] text-amber-700">
                                      Parent GC tidak ditemukan
                                    </span>
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <aside className="bg-slate-50/50">
                          <div className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Detail Customer
                          </div>
                          <div className="max-h-[55vh] overflow-y-auto p-4 xl:p-5">
                            {selectedHierarchyDetail ? (
                              <div>
                                <nav
                                  className="mb-5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500"
                                  aria-label="Breadcrumb hierarchy"
                                >
                                  {linkedNB ? (
                                    <>
                                      <span>{linkedNB.name}</span>
                                      <span>/</span>
                                    </>
                                  ) : null}
                                  <span>{gp.name}</span>
                                  <span>/</span>
                                  <span className="font-semibold text-slate-800">
                                    {selectedHierarchyDetail.type === "gc"
                                      ? selectedHierarchyDetail.gc.name
                                      : selectedHierarchyDetail.bc
                                          .branch_city ||
                                        selectedHierarchyDetail.bc.name}
                                  </span>
                                </nav>
                                <p
                                  className={`text-[10px] font-bold uppercase tracking-[0.2em] ${selectedHierarchyDetail.type === "gc" ? "text-blue-600" : "text-orange-600"}`}
                                >
                                  {selectedHierarchyDetail.type === "gc"
                                    ? "Group Customer"
                                    : "Branch Customer"}
                                </p>
                                <h4 className="mt-2 text-xl font-bold text-slate-900">
                                  {selectedHierarchyDetail.type === "gc"
                                    ? selectedHierarchyDetail.gc.name
                                    : `${selectedHierarchyDetail.gc?.name || "Branch Customer"} - ${selectedHierarchyDetail.bc.branch_city || "-"}`}
                                </h4>
                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                  {selectedHierarchyDetail.type === "gc"
                                    ? `GCID: ${selectedHierarchyDetail.gc.code || `GC${selectedHierarchyDetail.gc.id}`}`
                                    : `BCID: ${selectedHierarchyDetail.bc.code || `BC${selectedHierarchyDetail.bc.id}`}`}
                                </p>
                                <div className="mt-5 space-y-4 border-t border-slate-200 pt-4 text-sm">
                                  <div>
                                    <p className="text-xs text-slate-500">
                                      Parent
                                    </p>
                                    <p className="mt-1 font-semibold text-slate-800">
                                      GP: {gp.name}
                                    </p>
                                    {selectedHierarchyDetail.type === "bc" ? (
                                      <p className="mt-1 font-semibold text-slate-800">
                                        GC:{" "}
                                        {selectedHierarchyDetail.gc?.name ||
                                          "Relasi belum lengkap"}
                                      </p>
                                    ) : null}
                                  </div>
                                  {selectedHierarchyDetail.type === "gc" ? (
                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Branch Customer
                                      </p>
                                      <div className="mt-2 space-y-1.5">
                                        {selectedHierarchyDetail.bcs.length >
                                        0 ? (
                                          selectedHierarchyDetail.bcs.map(
                                            (item) => (
                                              <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-3 border-b border-slate-100 py-1.5"
                                              >
                                                <span className="truncate text-slate-700">
                                                  {item.branch_city || "-"}
                                                </span>
                                                <span className="shrink-0 text-xs font-semibold text-orange-600">
                                                  {item.code || `BC${item.id}`}
                                                </span>
                                              </div>
                                            ),
                                          )
                                        ) : (
                                          <p className="italic text-slate-400">
                                            Belum ada BC.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="text-xs text-slate-500">
                                        Kota Branch
                                      </p>
                                      <p className="mt-1 font-semibold text-slate-800">
                                        {selectedHierarchyDetail.bc
                                          .branch_city || "-"}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    selectedHierarchyDetail.type === "gc"
                                      ? onViewGC?.(selectedHierarchyDetail.gc)
                                      : onViewBC?.(selectedHierarchyDetail.bc)
                                  }
                                  className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                                >
                                  {selectedHierarchyDetail.type === "gc"
                                    ? "Lihat Detail GC"
                                    : "Lihat Detail BC"}
                                </button>
                              </div>
                            ) : (
                              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                                <FaUsers className="h-8 w-8 text-slate-300" />
                                <p className="mt-3 font-semibold text-slate-700">
                                  Pilih customer pada struktur
                                </p>
                                <p className="mt-1 max-w-xs text-sm text-slate-500">
                                  Klik nama GC atau BC untuk menampilkan
                                  detailnya di sini.
                                </p>
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
                              {activityUsers.createdBy ||
                                gp.created_by ||
                                "System"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(gp.created_at)}
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
                              {activityUsers.updatedBy ||
                                gp.updated_by ||
                                "System"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(gp.updated_at)}
                        </p>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end md:px-6">
              {isEditMode && (
                <>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 disabled:opacity-50 sm:w-auto"
                  >
                    <FaTimes className="h-4 w-4" />
                    Batal
                  </button>
                  <button
                    onClick={() => void handleSaveEdit()}
                    disabled={isSaving || !editedName.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
                  >
                    <FaSave className="h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Apply Changes"}
                  </button>
                </>
              )}
              {!isEditMode && (
                <button
                  onClick={onClose}
                  className="w-full rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 sm:w-auto"
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
