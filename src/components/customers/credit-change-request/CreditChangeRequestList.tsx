"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFileInvoiceDollar,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimesCircle,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl, getResourceUrl } from "@/config/api";
import Pagination, { usePagination } from "@/components/ui/Pagination";
import {
  CreditChangeRequestDetailModal,
  type CreditChangeRequestListItem,
} from "./CreditChangeRequestDetailModal";
import { CreditChangeRequestFormModal } from "./CreditChangeRequestFormModal";

type SortField = "created_at" | "updated_at" | "status";
type SortDirection = "asc" | "desc";

interface CreditChangeRequestApiResponse {
  id: number;
  name?: string | null;
  policy_type?: string | null;
  current_credit_limit?: number | null;
  current_payment_term?: number | null;
  current_limit_customer_overdue?: number | null;
  requested_credit_limit?: number | null;
  requested_payment_term?: number | null;
  requested_limit_customer_overdue?: number | null;
  reason?: string | null;
  rejected_note?: string | null;
  status?: string | null;
  docstatus?: number | null;
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
  });
}

function formatDays(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value} hari`;
}

function policyTypeLabel(value?: string | null): string {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "nbid") return "National Brand";
  if (normalized === "gpid") return "Group Parent";
  if (normalized === "gcid") return "Group Customer";
  if (normalized === "bcid") return "Branch Customer";
  return normalized || "-";
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

export function CreditChangeRequestList() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CreditChangeRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CreditChangeRequestListItem | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token || !isAuthenticated) {
        setItems([]);
        return;
      }

      const response = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.CREDIT_CHANGE_REQUEST, {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
          limit: 1000000,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch credit change request (${response.status})`);
      }

      const json = await response.json();
      const rows = Array.isArray(json?.data)
        ? (json.data as CreditChangeRequestApiResponse[])
        : [];

      const mapped: CreditChangeRequestListItem[] = rows.map((row) => ({
        id: Number(row.id),
        code: row.name || `CCR-${row.id}`,
        policyType: String(row.policy_type || "").trim().toLowerCase(),
        policyTypeLabel: policyTypeLabel(row.policy_type),
        currentCreditLimit: row.current_credit_limit ?? null,
        requestedCreditLimit: row.requested_credit_limit ?? null,
        currentPaymentTerm: row.current_payment_term ?? null,
        requestedPaymentTerm: row.requested_payment_term ?? null,
        currentLimitCustomerOverdue: row.current_limit_customer_overdue ?? null,
        requestedLimitCustomerOverdue:
          row.requested_limit_customer_overdue ?? null,
        reason: row.reason || null,
        rejectedNote: row.rejected_note || null,
        status: row.status || "Draft",
        docstatus: Number(row.docstatus || 0),
        createdAt: row.created_at || new Date(0).toISOString(),
        updatedAt: row.updated_at || row.created_at || new Date(0).toISOString(),
        createdBy: resolveUserName(row["created_by.full_name"], row.created_by),
        updatedBy: resolveUserName(row["updated_by.full_name"], row.updated_by),
      }));

      setItems(mapped);
    } catch (loadError) {
      setItems([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat credit change request",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const next = !query
      ? [...items]
      : items.filter((item) => {
          return (
            item.code.toLowerCase().includes(query) ||
            item.policyType.toLowerCase().includes(query) ||
            item.policyTypeLabel.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query) ||
            (item.reason || "").toLowerCase().includes(query) ||
            (item.rejectedNote || "").toLowerCase().includes(query)
          );
        });

    next.sort((left, right) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;
      if (sortField === "status") {
        return left.status.localeCompare(right.status) * multiplier;
      }
      return (
        (new Date(left[sortField === "created_at" ? "createdAt" : "updatedAt"]).getTime() -
          new Date(right[sortField === "created_at" ? "createdAt" : "updatedAt"]).getTime()) *
        multiplier
      );
    });

    return next;
  }, [items, searchQuery, sortDirection, sortField]);

  const stats = useMemo(() => {
    const normalized = items.map((item) => item.status.toLowerCase());
    return {
      total: items.length,
      requestOrDraft: normalized.filter(
        (status) => status === "request" || status === "requested" || status === "draft",
      ).length,
      approved: normalized.filter((status) => status === "approved").length,
      rejected: normalized.filter((status) => status === "rejected").length,
    };
  }, [items]);

  const {
    currentPage,
    totalPages,
    paginatedItems,
    totalItems,
    itemsPerPage,
    setCurrentPage,
  } = usePagination(filteredItems, 12);

  const sortOptions: Array<{ value: SortField; label: string }> = [
    { value: "updated_at", label: "Tanggal Update" },
    { value: "created_at", label: "Tanggal Buat" },
    { value: "status", label: "Status" },
  ];

  const handleSave = useCallback(
    async (payload: {
      policyType: "nbid" | "gpid" | "gcid" | "bcid";
      policyId: number;
      requestedCreditLimit?: number;
      requestedPaymentTerm?: number;
      requestedLimitCustomerOverdue?: number;
      reason: string;
    }) => {
      if (!token) throw new Error("Not authenticated");

      setSaving(true);
      try {
        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.CREDIT_CHANGE_REQUEST),
          {
            method: "POST",
            body: JSON.stringify({
              policy_type: payload.policyType,
              policy_id: payload.policyId,
              requested_credit_limit: payload.requestedCreditLimit,
              requested_payment_term: payload.requestedPaymentTerm,
              requested_limit_customer_overdue:
                payload.requestedLimitCustomerOverdue,
              reason: payload.reason,
            }),
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
        await loadData();
      } finally {
        setSaving(false);
      }
    },
    [loadData, token],
  );

  if (loading) {
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
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
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

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaFileInvoiceDollar className="h-4 w-4 text-emerald-700" />
            <div className="text-sm font-medium text-emerald-700">Total</div>
          </div>
          <div className="text-3xl font-bold text-emerald-900">{stats.total}</div>
        </div>
        <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaClock className="h-4 w-4 text-amber-700" />
            <div className="text-sm font-medium text-amber-700">Request / Draft</div>
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
          <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
        </div>
        <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaTimesCircle className="h-4 w-4 text-red-700" />
            <div className="text-sm font-medium text-red-700">Rejected</div>
          </div>
          <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
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
            {paginatedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 18px 35px -15px rgba(16, 185, 129, 0.25)",
                }}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 bg-gradient-to-br from-white via-emerald-50/30 to-white p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                        {item.code}
                      </p>
                      <h3 className="mt-2 truncate text-lg font-bold text-slate-900">
                        {item.policyTypeLabel}
                      </h3>
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusTone(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        Current Credit Limit
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-900">
                        {formatCurrency(item.currentCreditLimit)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                        Requested Credit Limit
                      </p>
                      <p className="mt-1 text-lg font-bold text-blue-900">
                        {formatCurrency(item.requestedCreditLimit)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Current Term
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatDays(item.currentPaymentTerm)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested Term
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatDays(item.requestedPaymentTerm)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    <span>{item.updatedBy || item.createdBy || "System"}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg"
                  >
                    <FaEye className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}

      <CreditChangeRequestDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        onActionExecuted={loadData}
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
