"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBan,
  FaBuilding,
  FaCheckCircle,
  FaChevronRight,
  FaClock,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaSave,
  FaStore,
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

interface GPDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gp: GroupParent | null;
  onGPUpdate?: (updatedGP: GroupParent) => void;
  onViewGC?: (gc: GroupCustomer) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

interface GroupCustomerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  description?: string | null;
  gpid?: number | null;
  credit_limit_active?: number | null;
  credit_limit?: number | null;
  payment_term_active?: number | null;
  payment_term?: number | null;
  limit_customer_overdue_active?: number | null;
  limit_customer_overdue?: number | null;
  owner_full_name?: string | null;
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

interface BranchCustomerRow {
  id: number;
  name?: string | null;
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

interface GroupParentMetaRow {
  id: number;
  description?: string | null;
  nbid?:
    | number
    | { id?: number | string; name?: string; nb_name?: string }
    | null;
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

type DetailTab = "company" | "finance" | "hierarchy" | "activity";

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
  onViewGC,
  onViewBC,
}: GPDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DetailTab>("company");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCreditLimitActive, setEditedCreditLimitActive] = useState(0);
  const [editedCreditLimit, setEditedCreditLimit] = useState("");
  const [editedPaymentTermActive, setEditedPaymentTermActive] = useState(0);
  const [editedPaymentTerm, setEditedPaymentTerm] = useState("");
  const [editedLimitCustomerOverdueActive, setEditedLimitCustomerOverdueActive] =
    useState(0);
  const [editedLimitCustomerOverdue, setEditedLimitCustomerOverdue] =
    useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [childGCs, setChildGCs] = useState<GroupCustomer[]>([]);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);
  const [linkedNB, setLinkedNB] = useState<{
    id: number;
    code: string;
    name: string;
  } | null>(null);

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
      setActiveTab("company");
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
      const gpMetaRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
          fields: ["id", "nbid", "description"],
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

      const gcRows = await fetchAllQueryRows<GroupCustomerRow>({
        endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
        spec: {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
          filters: [["gpid", "=", gp.id]],
        },
        token,
        errorMessage: "Gagal memuat child group customer",
      });

      const mappedGCs: GroupCustomer[] = gcRows.map((row) => ({
        id: Number(row.id),
        code: row.name || undefined,
        name: row.gc_name || row.name || "-",
        description: row.description || undefined,
        gp_id: gp.id,
        gp_name: gp.name,
        gp_code: gp.code,
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
      }));
      setChildGCs(mappedGCs);

      const gcIds = mappedGCs.map((item) => item.id);
      if (gcIds.length === 0) {
        setChildBCs([]);
        return;
      }

      const bcRows = await fetchAllQueryRows<BranchCustomerRow>({
        endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
        spec: {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
          filters: [["gcid", "in", gcIds]],
        },
        token,
        errorMessage: "Gagal memuat child branch customer",
      });

      const branchIds = Array.from(
        new Set(
          bcRows
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

      const gcMap = new Map<number, GroupCustomer>();
      mappedGCs.forEach((item) => gcMap.set(item.id, item));

      const mappedBCs: BranchCustomer[] = bcRows.map((row) => {
        const gcId =
          row.gcid && typeof row.gcid === "object"
            ? toNumber(row.gcid.id) || 0
            : toNumber(row.gcid) || 0;
        const branchId =
          row.branch && typeof row.branch === "object"
            ? toNumber(row.branch.id) || 0
            : toNumber(row.branch) || 0;
        const gcRef = gcMap.get(gcId);
        const branchRef = branchMap.get(branchId);
        const directGcName =
          row.gcid && typeof row.gcid === "object"
            ? row.gcid.gc_name || row.gcid.name
            : undefined;
        const directBranchName =
          row.branch && typeof row.branch === "object"
            ? row.branch.branch_name
            : undefined;
        const directBranchCity =
          row.branch && typeof row.branch === "object" ? row.branch.city : "";

        return {
          id: Number(row.id),
          code: row.name || undefined,
          name:
            row.name ||
            `${directGcName || gcRef?.name || "GC"} - ${
              directBranchCity || branchRef?.city || "-"
            }`,
          gc_id: gcId,
          gc_name: directGcName || gcRef?.name,
          gc_code:
            (row.gcid && typeof row.gcid === "object"
              ? row.gcid.name
              : undefined) || gcRef?.code,
          gp_name: gp.name,
          gp_code: gp.code,
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
      setChildBCs(mappedBCs);
    } finally {
      setLoadingChildren(false);
    }
  }, [gp, isAuthenticated, isOpen, token]);

  useEffect(() => {
    void loadChildren();
  }, [loadChildren]);

  const handleEditClick = () => {
    if (!gp) return;
    syncEditState(gp);
    setActiveTab("company");
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
      {
        key: "company" as const,
        label: "Data Perusahaan",
        caption: "Identitas & owner",
        icon: <FaBuilding className="h-4 w-4" />,
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
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="border-b border-purple-200 bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-purple-900/20 backdrop-blur-sm">
                    <FaBuilding className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">
                        Group Parent Details
                      </h2>
                      {gp.disabled === 1 ? (
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

                <div className="space-y-6">
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
                      </div>

                      {linkedNB && (
                        <div className="min-w-[220px] rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">
                            National Brand
                          </p>
                          <p className="mt-2 text-lg font-bold text-slate-900">
                            {linkedNB.name}
                          </p>
                          <p className="text-sm text-indigo-600">
                            NBID: {linkedNB.code}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>

                  {activeTab === "company" && (
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
                                onChange={(e) => setEditedDescription(e.target.value)}
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
                  )}

                  {activeTab === "hierarchy" && (
                    <div className="grid gap-4 xl:grid-cols-2">
                      <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
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

                        <div className="space-y-2">
                          {childGCs.length > 0 ? (
                            childGCs.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => onViewGC?.(item)}
                                className="flex w-full items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50"
                              >
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    GCID: {item.code || `GC${item.id}`}
                                  </p>
                                </div>
                                <FaChevronRight className="h-4 w-4 text-blue-500" />
                              </button>
                            ))
                          ) : (
                            <p className="text-sm italic text-slate-500">
                              Belum ada GC terdaftar.
                            </p>
                          )}
                        </div>
                      </section>

                      <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
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
                                    {item.name}
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
                              {gp.created_by || "System"}
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
                              {gp.updated_by || "System"}
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
