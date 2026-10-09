"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FaEye, FaSearch, FaStore } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import { BCDetailModal } from "@/components/branch_customer/BCDetailModal";
import type { BranchCustomer } from "@/types/customer";

type ApiRelation =
  | number
  | string
  | {
      id?: number | string;
      name?: string | null;
      gc_name?: string | null;
      branch_name?: string | null;
      city?: string | null;
    }
  | null;

type BranchCustomerRow = {
  id: number | string;
  name?: string | null;
  gcid?: ApiRelation;
  branch?: ApiRelation;
  status?: string | null;
  disabled?: number | null;
  updated_at?: string | null;
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "id" in value) {
    return toNumber((value as { id?: unknown }).id);
  }
  return 0;
}

function relationValue(
  relation: ApiRelation | undefined,
  key: "name" | "gc_name" | "branch_name" | "city",
): string | undefined {
  if (!relation || typeof relation !== "object") return undefined;
  const value = relation[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function mapBranchCustomer(row: BranchCustomerRow): BranchCustomer {
  const gcName =
    relationValue(row.gcid, "gc_name") || relationValue(row.gcid, "name");
  return {
    id: toNumber(row.id),
    name: row.name || `BC${row.id}`,
    gc_id: toNumber(row.gcid),
    gc_name: gcName,
    gc_code: relationValue(row.gcid, "name"),
    branch_id: toNumber(row.branch),
    branch_name: relationValue(row.branch, "branch_name"),
    branch_city: relationValue(row.branch, "city"),
    created_at: row.updated_at || new Date(0).toISOString(),
    updated_at: row.updated_at || new Date(0).toISOString(),
    disabled:
      Number(row.disabled || 0) === 1 ||
      ["inactive", "disabled", "nonactive", "non-active"].includes(
        String(row.status || "").toLowerCase(),
      )
        ? 1
        : 0,
  };
}

function getCustomerName(customer: BranchCustomer): string {
  if (customer.gc_name && customer.branch_city) {
    return `${customer.gc_name} - ${customer.branch_city}`;
  }
  return customer.gc_name || customer.name;
}

export default function CustomerDataPage() {
  const { token, isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState<BranchCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<BranchCustomer | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadCustomers = useCallback(
    async (page = 1, append = false) => {
      if (!token || !isAuthenticated) {
        setCustomers([]);
        setLoading(false);
        return;
      }

      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      try {
        // List page intentionally uses only the branch_customer endpoint.
        const response = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
            fields: [
              "id",
              "name",
              "gcid",
              "branch",
              "status",
              "disabled",
              "updated_at",
            ],
            page,
            order_by: [["updated_at", "desc"]],
            ...(debouncedSearch
              ? {
                  filters: [
                    ["name", "like", `%${debouncedSearch.toUpperCase()}%`],
                  ],
                }
              : {}),
          }),
          { method: "GET", cache: "no-store" },
          token,
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat Branch Customer (${response.status})`);
        }

        const json = await response.json();
        const rows: BranchCustomerRow[] = Array.isArray(json?.data)
          ? json.data
          : [];
        const mapped = rows.map(mapBranchCustomer);
        const meta = json?.meta || {};
        const lastPage = Number(meta.last_page || 0);
        const perPage = Number(meta.per_page || 20);

        setCustomers((current) =>
          append
            ? [
                ...current,
                ...mapped.filter(
                  (row) => !current.some((item) => item.id === row.id),
                ),
              ]
            : mapped,
        );
        setCurrentPage(page);
        setHasMore(lastPage > 0 ? page < lastPage : rows.length >= perPage);
        setTotalCount(
          Number(meta.total || meta.total_count || mapped.length),
        );
      } catch (loadError) {
        if (!append) setCustomers([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat customer",
        );
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [debouncedSearch, isAuthenticated, token],
  );

  useEffect(() => {
    void loadCustomers(1, false);
  }, [loadCustomers]);

  const handleBCUpdate = useCallback((updated: BranchCustomer) => {
    setCustomers((current) =>
      current.map((item) =>
        item.id === updated.id ? { ...item, ...updated } : item,
      ),
    );
    setSelectedCustomer(updated);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">
              Customer Management
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              Data Customer
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Pilih Branch Customer untuk melihat seluruh data customer dalam satu detail.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
            <span className="font-bold text-slate-900">{totalCount}</span>{" "}
            <span className="text-slate-500">Branch Customers</span>
          </div>
        </header>

        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative block w-full md:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari ID Branch Customer..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50"
              />
            </label>
            <p className="text-sm text-slate-500">
              Showing {customers.length} of {totalCount} customers
            </p>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Memuat data customers...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error && customers.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Tidak ada data customer untuk pencarian ini.
            </div>
          ) : null}

          {!loading && !error && customers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {customers.map((customer) => {
                const status =
                  Number(customer.disabled || 0) === 1 ? "inactive" : "active";
                return (
                  <article
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="h-1.5 bg-gradient-to-r from-orange-500 to-orange-400" />
                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-500">
                            <FaStore className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-base font-bold text-slate-900">
                              {getCustomerName(customer)}
                            </p>
                            <p className="text-xs font-semibold uppercase text-slate-500">
                              ID: {customer.name}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-violet-100 bg-violet-50/70 px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700">
                            Branch
                          </p>
                          <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">
                            {customer.branch_name || "-"}
                          </p>
                        </div>
                        <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                            Location
                          </p>
                          <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">
                            {customer.branch_city || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCustomer(customer);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-orange-500"
                      >
                        <FaEye className="h-3 w-3" />
                        VIEW DETAILS
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {!loading && !error && hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => void loadCustomers(currentPage + 1, true)}
                className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingMore ? "Memuat data berikutnya..." : "Muat lebih banyak"}
              </button>
            </div>
          ) : null}
        </section>
      </div>

      <BCDetailModal
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        bc={selectedCustomer}
        displayMode="sections"
        onBCUpdate={handleBCUpdate}
        onViewBC={(customer) => setSelectedCustomer(customer)}
      />
    </div>
  );
}
