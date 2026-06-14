"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaFileInvoiceDollar,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import { CustomerLimitDetailModal } from "./CustomerLimitDetailModal";

const ITEMS_PER_BATCH = 12;

type SortField = "created_at" | "updated_at" | "customer_limit" | "status";
type SortDirection = "asc" | "desc";

interface CustomerLimitApiResponse {
  id: number;
  name?: string | null;
  bcid?: number | null;
  customer_limit?: number | null;
  payment_term?: number | null;
  check_customer_overdue?: number | null;
  notes?: string | null;
  reason_update?: string | null;
  status?: string | null;
  docstatus?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface BranchCustomerLookupRow {
  id: number;
  name?: string | null;
  bcid_name?: string | null;
}

interface CustomerLimitListItem {
  id: number;
  code: string;
  bcid: number;
  bcName: string;
  customerLimit: number;
  paymentTerm?: number | null;
  checkCustomerOverdue?: number | null;
  notes?: string | null;
  reasonUpdate?: string | null;
  status: string;
  docstatus: number;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string | undefined {
  if (explicitName) return explicitName;
  if (value && typeof value === "object" && value.full_name) {
    return value.full_name;
  }
  if (typeof value === "number") return `User ${value}`;
  return undefined;
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

function getStatusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved") {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (normalized === "rejected") {
    return "bg-red-100 text-red-700 border-red-200";
  }
  if (normalized === "request") {
    return "bg-blue-100 text-blue-700 border-blue-200";
  }
  return "bg-amber-100 text-amber-700 border-amber-200";
}

export function CustomerLimitList() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CustomerLimitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CustomerLimitListItem | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!token || !isAuthenticated) {
        setItems([]);
        return;
      }

      const rows = await fetchAllQueryRows<CustomerLimitApiResponse>({
        endpoint: API_CONFIG.ENDPOINTS.CUSTOMER_LIMIT,
        spec: {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
        },
        token,
        errorMessage: "Failed to fetch customer limit",
      });

      const bcIds = Array.from(
        new Set(
          rows
            .map((row) => row.bcid)
            .filter((value): value is number => typeof value === "number"),
        ),
      );

      const bcMap = new Map<number, string>();
      if (bcIds.length > 0) {
        const bcResponse = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
            fields: ["id", "name", "bcid_name"],
            filters: [["id", "in", bcIds]],
            limit: bcIds.length,
          }),
          { method: "GET", cache: "no-store" },
          token,
        );

        if (bcResponse.ok) {
          const bcJson = await bcResponse.json();
          const bcRows = Array.isArray(bcJson?.data)
            ? (bcJson.data as BranchCustomerLookupRow[])
            : [];
          bcRows.forEach((row) => {
            bcMap.set(
              row.id,
              row.bcid_name || row.name || `Branch Customer ${row.id}`,
            );
          });
        }
      }

      const mapped: CustomerLimitListItem[] = rows.map((row) => ({
        id: Number(row.id),
        code: row.name || `CUSL${row.id}`,
        bcid: Number(row.bcid || 0),
        bcName:
          (typeof row.bcid === "number" ? bcMap.get(row.bcid) : undefined) ||
          (row.bcid ? `Branch Customer ${row.bcid}` : "-"),
        customerLimit: Number(row.customer_limit || 0),
        paymentTerm: row.payment_term ?? null,
        checkCustomerOverdue: row.check_customer_overdue ?? null,
        notes: row.notes || null,
        reasonUpdate: row.reason_update || null,
        status: row.status || "Draft",
        docstatus: Number(row.docstatus || 0),
        createdAt: row.created_at || new Date(0).toISOString(),
        createdBy: resolveUserName(row["created_by.full_name"], row.created_by),
        updatedAt: row.updated_at || row.created_at || new Date(0).toISOString(),
        updatedBy: resolveUserName(row["updated_by.full_name"], row.updated_by),
      }));

      setItems(mapped);
    } catch (loadError) {
      setItems([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat customer limit",
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
            item.bcName.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query) ||
            (item.notes || "").toLowerCase().includes(query) ||
            (item.reasonUpdate || "").toLowerCase().includes(query)
          );
        });

    next.sort((left, right) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;
      if (sortField === "customer_limit") {
        return (left.customerLimit - right.customerLimit) * multiplier;
      }
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
    return {
      total: items.length,
      draft: items.filter((item) => item.status.toLowerCase() === "draft").length,
      approved: items.filter((item) => item.status.toLowerCase() === "approved")
        .length,
      rejected: items.filter((item) => item.status.toLowerCase() === "rejected")
        .length,
    };
  }, [items]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount],
  );
  const hasMore = visibleCount < filteredItems.length;

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
  }, [searchQuery, sortDirection, sortField]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisibleCount((current) =>
          Math.min(current + ITEMS_PER_BATCH, filteredItems.length),
        );
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredItems.length, hasMore]);

  const sortOptions: Array<{ value: SortField; label: string }> = [
    { value: "updated_at", label: "Tanggal Update" },
    { value: "created_at", label: "Tanggal Buat" },
    { value: "customer_limit", label: "Nominal Limit" },
    { value: "status", label: "Status" },
  ];

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
            Customer Limit
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Kelola pengajuan limit pelanggan berdasarkan Branch Customer
          </p>
        </div>
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
            <div className="text-sm font-medium text-amber-700">Draft</div>
          </div>
          <div className="text-3xl font-bold text-amber-900">{stats.draft}</div>
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
            <FaClock className="h-4 w-4 text-red-700" />
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
              }}
              placeholder="Cari kode, branch customer, status, atau catatan..."
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
            Tidak ada customer limit
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada data customer limit"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
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
                        {item.bcName}
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

                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Customer Limit
                    </p>
                    <p className="mt-1 text-xl font-bold text-emerald-900">
                      {formatCurrency(item.customerLimit)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payment Term
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {item.paymentTerm ?? "-"}{" "}
                        {item.paymentTerm ? "hari" : ""}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Overdue
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {item.checkCustomerOverdue ?? "-"}{" "}
                        {item.checkCustomerOverdue ? "hari" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Notes
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                      {item.notes || item.reasonUpdate || "-"}
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

          <div className="flex flex-col gap-3 pt-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              Showing {visibleItems.length} of {filteredItems.length} customer limits
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
              Siap memuat data berikutnya...
            </div>
          ) : null}
        </>
      )}

      <CustomerLimitDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
}
