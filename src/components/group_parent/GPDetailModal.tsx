"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBuilding,
  FaChevronRight,
  FaClock,
  FaEdit,
  FaSave,
  FaStore,
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
            className="flex h-[94vh] w-full max-w-[92vw] xl:max-w-[1320px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="border-b border-purple-200 bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-purple-900/20 backdrop-blur-sm">
                    <FaBuilding className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-white">
                      Group Parent Details
                    </h2>
                    <p className="text-sm text-purple-100">
                      GPID: {gp.code || `GP${gp.id}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isEditMode && (
                    <button
                      onClick={handleEditClick}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-50"
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

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-4 md:p-5 xl:p-6">
              <div className="grid min-h-0 gap-5 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">
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
                            <p className="text-sm font-semibold">{tab.label}</p>
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
                </aside>

                <div className="min-h-0 space-y-5">
                  <section className="rounded-3xl border border-white bg-white p-6 shadow-sm">
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
                    <div className="grid min-h-0 gap-4 xl:grid-cols-3">
                      <section className="flex min-h-0 flex-col rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm xl:p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white">
                            <FaBuilding className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
                              National Brand
                            </p>
                            <p className="text-sm text-slate-500">
                              {linkedNB ? "Relasi induk" : "Belum terhubung"}
                            </p>
                          </div>
                        </div>

                        {linkedNB ? (
                          <button
                            type="button"
                            onClick={() => void handleViewLinkedNb()}
                            className="flex w-full items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-4 text-left text-sm text-slate-800 transition-all hover:border-indigo-300 hover:bg-indigo-100/80"
                          >
                            <div>
                              <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900">
                                {linkedNB.name}
                              </p>
                              <p className="mt-2 text-xs text-indigo-700">
                                Limit: {formatCurrency(linkedNB.credit_limit)}
                              </p>
                              <p className="mt-1 text-xs text-indigo-700">
                                Payment Term:{" "}
                                {formatDays(linkedNB.payment_term)}
                              </p>
                            </div>
                            <FaChevronRight className="ml-3 h-4 w-4 shrink-0 text-indigo-500" />
                          </button>
                        ) : (
                          <p className="text-sm italic text-slate-500">
                            Group Parent ini tidak terhubung ke National Brand.
                          </p>
                        )}
                      </section>

                      <section className="flex min-h-0 flex-col rounded-3xl border border-blue-100 bg-white p-4 shadow-sm xl:p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
                            <FaUsers className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                              Group Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {loadingChildren
                                ? "Loading..."
                                : `${childGCs.length} data terdaftar`}
                            </p>
                          </div>
                        </div>

                        <div className="max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {childGCs.length > 0 ? (
                            childGCs.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => onViewGC?.(item)}
                                className="flex w-full items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-left text-sm text-slate-800 transition-all hover:border-blue-300 hover:bg-blue-100/80"
                              >
                                <div>
                                  <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900">
                                    {item.name}
                                  </p>
                                  <p className="mt-2 text-xs text-blue-700">
                                    GCID: {item.code || `GC${item.id}`}
                                  </p>
                                </div>
                                <FaChevronRight className="ml-3 h-4 w-4 shrink-0 text-blue-500" />
                              </button>
                            ))
                          ) : (
                            <p className="text-sm italic text-slate-500">
                              Belum ada GC terdaftar.
                            </p>
                          )}
                        </div>
                      </section>

                      <section className="flex min-h-0 flex-col rounded-3xl border border-orange-100 bg-white p-4 shadow-sm xl:p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                            <FaStore className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                              Branch Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {loadingChildren
                                ? "Loading..."
                                : `${childBCs.length} data terdaftar`}
                            </p>
                          </div>
                        </div>

                        <div className="max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {childBCs.length > 0 ? (
                            childBCs.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => onViewBC?.(item)}
                                className="flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-left text-sm text-slate-800 transition-all hover:border-orange-300 hover:bg-orange-100/80"
                              >
                                <div>
                                  <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900">
                                    {`${item.gc_name || item.gc_code || "GC"} - ${
                                      item.branch_city ||
                                      item.branch_name ||
                                      item.name ||
                                      "-"
                                    }`}
                                  </p>
                                  <p className="mt-2 text-xs text-orange-700">
                                    BCID: {item.code || `BC${item.id}`} •{" "}
                                    {item.branch_city || "-"}
                                  </p>
                                </div>
                                <FaChevronRight className="ml-3 h-4 w-4 shrink-0 text-orange-500" />
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
                    disabled={isSaving || !editedName.trim()}
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
