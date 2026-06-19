"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaEye,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getAuthHeadersFormData,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import {
  CreditChangeRequestDetailModal,
  type CreditChangeRequestListItem,
} from "./CreditChangeRequestDetailModal";
import { CreditChangeRequestFormModal } from "./CreditChangeRequestFormModal";
import { policyTypeLabel, resolvePolicyDisplayName } from "./utils";

type SortField = "created_at" | "updated_at" | "status";
type SortDirection = "asc" | "desc";
const DEFAULT_PAGE_SIZE = 20;

interface CreditChangeRequestApiResponse {
  id: number;
  name?: string | null;
  policy_type?: string | null;
  policy_id?: number | null;
  apply_to_childs?: number | boolean | null;
  current_credit_limit?: number | null;
  current_payment_term?: number | null;
  current_limit_customer_overdue?: number | null;
  requested_credit_limit?: number | null;
  requested_payment_term?: number | null;
  requested_limit_customer_overdue?: number | null;
  identity_attachment?: string | null;
  customer_approval_attachment?: string | null;
  reason?: string | null;
  rejected_note?: string | null;
  saga_status?: string | null;
  sync_saga_id?: string | null;
  sync_last_error?: string | null;
  sync_last_rollback_error?: string | null;
  status?: string | null;
  docstatus?: number | null;
  workflow_state?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string {
  if (explicitName) return explicitName;
  if (value && typeof value === "object" && value.full_name) {
    return value.full_name;
  }
  if (typeof value === "number") return `User ${value}`;
  return "System";
}

function formatCurrency(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDays(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value} hari`;
}

function getStatusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved") {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (normalized === "rejected") {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (normalized === "request" || normalized === "requested") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
  if (normalized === "draft") {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function mapCreditChangeRequestRow(
  row: CreditChangeRequestApiResponse,
): CreditChangeRequestListItem {
  return {
    id: Number(row.id),
    code: row.name || `CCR-${row.id}`,
    policyType: String(row.policy_type || "")
      .trim()
      .toLowerCase(),
    policyTypeLabel: policyTypeLabel(row.policy_type),
    policyId: Number(row.policy_id || 0),
    applyToChilds: Boolean(Number(row.apply_to_childs || 0)),
    currentCreditLimit: row.current_credit_limit ?? null,
    requestedCreditLimit: row.requested_credit_limit ?? null,
    currentPaymentTerm: row.current_payment_term ?? null,
    requestedPaymentTerm: row.requested_payment_term ?? null,
    currentLimitCustomerOverdue: row.current_limit_customer_overdue ?? null,
    requestedLimitCustomerOverdue:
      row.requested_limit_customer_overdue ?? null,
    identityAttachment: row.identity_attachment || null,
    customerApprovalAttachment: row.customer_approval_attachment || null,
    reason: row.reason || null,
    rejectedNote: row.rejected_note || null,
    sagaStatus: row.saga_status || null,
    syncSagaId: row.sync_saga_id || null,
    syncLastError: row.sync_last_error || null,
    syncLastRollbackError: row.sync_last_rollback_error || null,
    status: row.status || "Draft",
    docstatus: Number(row.docstatus || 0),
    workflowState: row.workflow_state || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || row.created_at || null,
    createdAt: row.created_at || new Date(0).toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date(0).toISOString(),
    createdBy: resolveUserName(row["created_by.full_name"], row.created_by),
    updatedBy: resolveUserName(row["updated_by.full_name"], row.updated_by),
  };
}

export function CreditChangeRequestList() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CreditChangeRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] =
    useState<CreditChangeRequestListItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [policyNameMap, setPolicyNameMap] = useState<Record<string, string>>(
    {},
  );
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const loadData = useCallback(async (page: number, replace = false) => {
    if (replace) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      if (!token || !isAuthenticated) {
        setItems([]);
        setHasMore(false);
        return;
      }

      if (debouncedSearchQuery) {
        const rows = await fetchAllQueryRows<CreditChangeRequestApiResponse>({
          endpoint: API_CONFIG.ENDPOINTS.CREDIT_CHANGE_REQUEST,
          spec: {
            fields: ["*", "created_by.full_name", "updated_by.full_name"],
            order_by:
              sortField === "status"
                ? [["status", sortDirection]]
                : [[sortField, sortDirection]],
          },
          token,
          errorMessage: "Failed to fetch credit change request",
        });

        setItems(rows.map(mapCreditChangeRequestRow));
        setCurrentPage(1);
        setHasMore(false);
        return;
      }

      const response = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.CREDIT_CHANGE_REQUEST, {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
          page,
          order_by:
            sortField === "status"
              ? [["status", sortDirection]]
              : [[sortField, sortDirection]],
        }),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch credit change request (${response.status})`,
        );
      }

      const json = await response.json();
      const rows = Array.isArray(json?.data)
        ? (json.data as CreditChangeRequestApiResponse[])
        : [];
      const perPage = Number(json?.meta?.per_page || DEFAULT_PAGE_SIZE);
      const mapped = rows.map(mapCreditChangeRequestRow);

      setItems((current) =>
        replace
          ? mapped
          : [
              ...current,
              ...mapped.filter(
                (item) => !current.some((existing) => existing.id === item.id),
              ),
            ],
      );
      setCurrentPage(page);
      setHasMore(rows.length >= perPage);
    } catch (loadError) {
      if (replace) {
        setItems([]);
      }
      setHasMore(false);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat credit change request",
      );
    } finally {
      if (replace) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [debouncedSearchQuery, isAuthenticated, sortDirection, sortField, token]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    void loadData(1, true);
  }, [loadData]);

  const refreshList = useCallback(async () => {
    setCurrentPage(1);
    setHasMore(true);
    await loadData(1, true);
  }, [loadData]);

  const filteredItems = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      const policyKey = `${item.policyType}:${item.policyId || 0}`;
      const policyName = policyNameMap[policyKey] || "";

      return (
        item.code.toLowerCase().includes(query) ||
        item.policyTypeLabel.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        (item.reason || "").toLowerCase().includes(query) ||
        policyName.toLowerCase().includes(query)
      );
    });
  }, [debouncedSearchQuery, items, policyNameMap]);

  useEffect(() => {
    let cancelled = false;

    async function loadVisiblePolicyNames() {
      if (!token || !isAuthenticated || items.length === 0) {
        return;
      }

      const itemsToResolve = items.filter((item) => {
        const key = `${item.policyType}:${item.policyId || 0}`;
        return Boolean(item.policyId) && !policyNameMap[key];
      });

      if (itemsToResolve.length === 0) {
        return;
      }

      const resolvedEntries = await Promise.allSettled(
        itemsToResolve.map(async (item) => {
          const key = `${item.policyType}:${item.policyId || 0}`;
          const label = await resolvePolicyDisplayName({
            token,
            policyType: item.policyType,
            policyId: item.policyId,
          });

          return [key, label] as const;
        }),
      );

      if (!cancelled) {
        setPolicyNameMap((current) => {
          const next = { ...current };
          resolvedEntries.forEach((result, index) => {
            const fallbackItem = itemsToResolve[index];
            const key = `${fallbackItem.policyType}:${fallbackItem.policyId || 0}`;

            if (result.status === "fulfilled") {
              next[key] = result.value[1];
              return;
            }

            next[key] = fallbackItem.policyId
              ? `${fallbackItem.policyTypeLabel} #${fallbackItem.policyId}`
              : fallbackItem.policyTypeLabel;
          });
          return next;
        });
      }
    }

    void loadVisiblePolicyNames();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, items, policyNameMap, token]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        void loadData(currentPage + 1, false);
      },
      {
        root: null,
        rootMargin: "240px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [currentPage, hasMore, loadData, loading, loadingMore]);

  const sortOptions: Array<{ value: SortField; label: string }> = [
    { value: "updated_at", label: "Tanggal Update" },
    { value: "created_at", label: "Tanggal Buat" },
    { value: "status", label: "Status" },
  ];

  const handleSave = useCallback(
    async (payload: {
      policyType: "nbid" | "gpid" | "gcid" | "bcid";
      policyId: number;
      applyToChilds: boolean;
      requestedCreditLimit?: number;
      requestedPaymentTerm?: number;
      requestedLimitCustomerOverdue?: number;
      reason: string;
      identityAttachment?: File | null;
      customerApprovalAttachment?: File | null;
    }) => {
      if (!token) throw new Error("Not authenticated");

      setSaving(true);
      try {
        const formData = new FormData();
        formData.append("policy_type", payload.policyType);
        formData.append("policy_id", String(payload.policyId));
        formData.append("apply_to_childs", payload.applyToChilds ? "1" : "0");
        formData.append("reason", payload.reason);

        if (payload.requestedCreditLimit !== undefined) {
          formData.append(
            "requested_credit_limit",
            String(payload.requestedCreditLimit),
          );
        }
        if (payload.requestedPaymentTerm !== undefined) {
          formData.append(
            "requested_payment_term",
            String(payload.requestedPaymentTerm),
          );
        }
        if (payload.requestedLimitCustomerOverdue !== undefined) {
          formData.append(
            "requested_limit_customer_overdue",
            String(payload.requestedLimitCustomerOverdue),
          );
        }
        if (payload.identityAttachment) {
          formData.append("identity_attachment", payload.identityAttachment);
        }
        if (payload.customerApprovalAttachment) {
          formData.append(
            "customer_approval_attachment",
            payload.customerApprovalAttachment,
          );
        }

        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.CREDIT_CHANGE_REQUEST),
          {
            method: "POST",
            headers: getAuthHeadersFormData(token),
            body: formData,
            cache: "no-store",
          },
          token,
        );

        if (!response.ok) {
          const saveJson = await response.json().catch(() => ({}));
          throw new Error(
            saveJson?.message ||
              `Failed to create credit change request (${response.status})`,
          );
        }

        setModalOpen(false);
        await refreshList();
      } finally {
        setSaving(false);
      }
    },
    [refreshList, token],
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Credit Change Request
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Kelola pengajuan perubahan credit limit dan payment term customer
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-600 hover:to-teal-700"
        >
          <FaPlus className="h-4 w-4" />
          Add New Request
        </button>
      </div>

      {/* <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaFileInvoiceDollar className="h-4 w-4 text-emerald-700" />
            <div className="text-sm font-medium text-emerald-700">Total</div>
          </div>
          <div className="text-3xl font-bold text-emerald-900">
            {stats.total}
          </div>
        </div>
        <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaClock className="h-4 w-4 text-amber-700" />
            <div className="text-sm font-medium text-amber-700">
              Request / Draft
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-900">
            {stats.requestOrDraft}
          </div>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-green-700" />
            <div className="text-sm font-medium text-green-700">Approved</div>
          </div>
          <div className="text-3xl font-bold text-green-900">
            {stats.approved}
          </div>
        </div>
        <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaTimesCircle className="h-4 w-4 text-red-700" />
            <div className="text-sm font-medium text-red-700">Rejected</div>
          </div>
          <div className="text-3xl font-bold text-red-900">
            {stats.rejected}
          </div>
        </div>
      </div> */}

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama, policy type, status, atau alasan..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={sortField}
            onChange={(event) => setSortField(event.target.value as SortField)}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 focus:border-transparent focus:ring-2 focus:ring-emerald-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            {sortDirection === "asc" ? (
              <FaSortAmountUp className="h-4 w-4" />
            ) : (
              <FaSortAmountDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FaSearch className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Tidak ada credit change request
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada data credit change request"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 18px 35px -15px rgba(16, 185, 129, 0.25)",
                }}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedItem(item);
                  }
                }}
                className="cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
              >
                {(() => {
                  const policyKey = `${item.policyType}:${item.policyId || 0}`;
                  const policyName =
                    policyNameMap[policyKey] || item.policyTypeLabel;

                  return (
                    <>
                      <div className="border-b border-gray-100 bg-gradient-to-br from-white via-emerald-50/30 to-white p-5">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                              {item.code}
                            </p> */}
                            <h3 className="mt-2 truncate text-lg font-bold text-slate-900">
                              {policyName}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.policyTypeLabel}
                            </p>
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {/* <div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 p-3">
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                      {hasImageAttachment && attachmentUrl ? (
                        <Image
                          src={attachmentUrl}
                          alt={`Attachment ${item.code}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-slate-400">
                          {attachmentUrl ? (
                            <FaFileAlt className="h-6 w-6" />
                          ) : (
                            <FaImage className="h-6 w-6" />
                          )}
                        </span>
                      )}
                    </div>
                     <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Identity Attachment
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-slate-800">
                        {attachmentUrl
                          ? hasImageAttachment
                            ? "Lampiran gambar tersedia"
                            : "Lampiran file tersedia"
                          : "Belum ada lampiran"}
                      </p>
                    </div> 
                  </div> */}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                              Current Credit Limit
                            </p>
                            <p className="mt-1 text-[var(--credit-limit-card-font-size,1.125rem)] font-bold leading-tight text-emerald-900">
                              {formatCurrency(item.currentCreditLimit)}
                            </p>
                          </div>
                          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                              Requested Credit Limit
                            </p>
                            <p className="mt-1 text-[var(--credit-limit-card-font-size,1.125rem)] font-bold leading-tight text-blue-900">
                              {formatCurrency(item.requestedCreditLimit)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 p-5">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold  tracking-wide text-slate-500">
                              Current Term
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                              {formatDays(item.currentPaymentTerm)}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold  tracking-wide text-slate-500">
                              Requested Term
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                              {formatDays(item.requestedPaymentTerm)}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-semibold  tracking-wide text-slate-500">
                            Reason
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                            {item.reason || item.rejectedNote || "-"}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="h-3 w-3" />
                            <span>{formatDate(item.updatedAt)}</span>
                          </div>
                          <span>
                            {item.updatedBy || item.createdBy || "System"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedItem(item);
                          }}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg"
                        >
                          <FaEye className="h-4 w-4" />
                          View Details
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              Showing {filteredItems.length} loaded requests
              {debouncedSearchQuery ? " matching current search" : ""}
            </p>
            <p>
              {hasMore
                ? "Scroll ke bawah untuk memuat lebih banyak"
                : "Semua data yang tersedia sudah dimuat"}
            </p>
          </div>

          {hasMore ? (
            <div
              ref={loadMoreRef}
              className="flex h-16 items-center justify-center text-sm text-slate-400"
            >
              {loadingMore ? "Memuat data berikutnya..." : "Siap memuat data berikutnya..."}
            </div>
          ) : null}
        </>
      )}

      <CreditChangeRequestDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onActionExecuted={refreshList}
      />
      <CreditChangeRequestFormModal
        open={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
        }}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
