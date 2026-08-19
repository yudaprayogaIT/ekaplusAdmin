"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { GCCard } from "./GCCard";
import { GCDetailModal } from "./GCDetailModal";
import { GPDetailModal } from "@/components/group_parent/GPDetailModal";
import { BCDetailModal } from "@/components/branch_customer/BCDetailModal";
import type {
  GroupCustomer,
  GroupParent,
  BranchCustomer,
} from "@/types/customer";
import {
  FaSearch,
  FaBuilding,
  FaCheckCircle,
  FaBan,
  FaSortAmountUp,
  FaSortAmountDown,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";

type SortField = "gc_name" | "gp_name" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";
const DEFAULT_PAGE_SIZE = 20;

interface GroupCustomerApiResponse {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  description?: string | null;
  gpid?: number | { id?: number; name?: string; gp_name?: string } | null;
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
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface GroupParentLookupRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
}

function resolveUserName(
  directName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string | undefined {
  if (directName) return directName;
  if (value && typeof value === "object" && value.full_name)
    return value.full_name;
  return undefined;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export default function GCList() {
  const { token, isAuthenticated } = useAuth();

  const [gcs, setGcs] = useState<GroupCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedGP, setSelectedGP] = useState<GroupParent | null>(null);
  const [selectedGC, setSelectedGC] = useState<GroupCustomer | null>(null);
  const [selectedBC, setSelectedBC] = useState<BranchCustomer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [sortField, setSortField] = useState<SortField>("gc_name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
      if (!isAuthenticated || !token) {
        setGcs([]);
        setHasMore(false);
        return;
      }

      const orderByField =
        sortField === "gp_name"
          ? "gpid.gp_name"
          : sortField === "gc_name"
            ? "gc_name"
            : sortField;

      const gcSpec = {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        page,
        ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
        order_by: [[orderByField, sortDirection]],
      };

      const gcRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gcSpec),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!gcRes.ok) {
        throw new Error(`Failed to fetch group customer (${gcRes.status})`);
      }

      const gcJson = await gcRes.json();
      const gcRows: GroupCustomerApiResponse[] = Array.isArray(gcJson?.data)
        ? gcJson.data
        : [];
      const perPage = Number(gcJson?.meta?.per_page || DEFAULT_PAGE_SIZE);

      const gpIds = Array.from(
        new Set(
          gcRows
            .map((row) => {
              if (row.gpid && typeof row.gpid === "object")
                return toNumber(row.gpid.id);
              return toNumber(row.gpid);
            })
            .filter((id): id is number => typeof id === "number"),
        ),
      );

      const gpMap = new Map<number, { code?: string; name?: string }>();
      if (gpIds.length > 0) {
        const gpSpec = {
          fields: ["id", "name", "gp_name"],
          filters: [["id", "in", gpIds]],
          limit: gpIds.length,
        };
        const gpRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpSpec),
          { method: "GET", cache: "no-store" },
          token,
        );
        if (gpRes.ok) {
          const gpJson = await gpRes.json();
          const gpRows: GroupParentLookupRow[] = Array.isArray(gpJson?.data)
            ? gpJson.data
            : [];
          gpRows.forEach((row) => {
            gpMap.set(Number(row.id), {
              code: row.name || undefined,
              name: row.gp_name || row.name || undefined,
            });
          });
        }
      }

      const mapped: GroupCustomer[] = gcRows.map((row) => {
        const gpId =
          row.gpid && typeof row.gpid === "object"
            ? toNumber(row.gpid.id) || 0
            : toNumber(row.gpid) || 0;

        const directGpName =
          row.gpid && typeof row.gpid === "object"
            ? row.gpid.gp_name || row.gpid.name
            : undefined;

        return {
          id: Number(row.id),
          name: row.name || `GC${row.id}`,
          gc_name: row.gc_name || "-",
          description: row.description || undefined,
          gp_id: gpId,
          gp_name: directGpName || gpMap.get(gpId)?.name,
          gp_code:
            (row.gpid && typeof row.gpid === "object"
              ? row.gpid.name
              : undefined) || gpMap.get(gpId)?.code,
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
        };
      });

      setGcs((current) =>
        replace
          ? mapped
          : [
              ...current,
              ...mapped.filter(
                (gc) => !current.some((existing) => existing.id === gc.id),
              ),
            ],
      );
      setCurrentPage(page);
      setHasMore(gcRows.length >= perPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      if (replace) {
        setGcs([]);
      }
      setHasMore(false);
    } finally {
      if (replace) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [debouncedSearchQuery, isAuthenticated, sortDirection, sortField, token]);

  useEffect(() => {
    setGcs([]);
    setCurrentPage(1);
    setHasMore(true);
    void loadData(1, true);
  }, [loadData]);

  const filteredAndSortedGCs = useMemo(() => {
    return [...gcs];
  }, [gcs]);

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

  const stats = useMemo(() => {
    return {
      total: gcs.length,
      active: gcs.filter((gc) => gc.disabled === 0).length,
      disabled: gcs.filter((gc) => gc.disabled === 1).length,
    };
  }, [gcs]);

  const handleViewDetails = (gc: GroupCustomer) => {
    setSelectedGC(gc);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Group Customer (GC)
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola data Group Customer
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FaBuilding className="w-4 h-4 text-blue-700" />
            <div className="text-sm text-blue-700 font-medium">Total GC</div>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <FaCheckCircle className="w-4 h-4 text-green-700" />
            <div className="text-sm text-green-700 font-medium">Active</div>
          </div>
          <div className="text-3xl font-bold text-green-900">
            {stats.active}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <FaBan className="w-4 h-4 text-red-700" />
            <div className="text-sm text-red-700 font-medium">Disabled</div>
          </div>
          <div className="text-3xl font-bold text-red-900">
            {stats.disabled}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari GC name/code atau GP..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <button
            onClick={() => {
              const newDirection = sortDirection === "asc" ? "desc" : "asc";
              setSortDirection(newDirection);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {sortDirection === "asc" ? (
              <FaSortAmountUp className="w-3.5 h-3.5" />
            ) : (
              <FaSortAmountDown className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setSortFieldDropdownOpen(!sortFieldDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <span>
                {sortField === "gc_name" && "Name"}
                {sortField === "gp_name" && "GP Name"}
                {sortField === "created_at" && "Created Date"}
                {sortField === "updated_at" && "Updated Date"}
              </span>
              <FaChevronDown
                className={`w-3 h-3 transition-transform ${
                  sortFieldDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {sortFieldDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortFieldDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20"
                  >
                    {[
                      { value: "gc_name" as SortField, label: "Name" },
                      { value: "gp_name" as SortField, label: "GP Name" },
                      {
                        value: "created_at" as SortField,
                        label: "Created Date",
                      },
                      {
                        value: "updated_at" as SortField,
                        label: "Updated Date",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortField(option.value);
                          setSortFieldDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                          sortField === option.value
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {filteredAndSortedGCs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada GC ditemukan
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada data Group Customer"}
          </p>
        </div>
      )}

      {filteredAndSortedGCs.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedGCs.map((gc) => (
              <GCCard
                key={gc.id}
                gc={gc}
                onViewDetails={() => handleViewDetails(gc)}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              Showing {filteredAndSortedGCs.length} loaded group customers
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
              {loadingMore
                ? "Memuat data berikutnya..."
                : "Siap memuat data berikutnya..."}
            </div>
          ) : null}
        </>
      )}

      <GPDetailModal
        isOpen={selectedGP !== null}
        onClose={() => setSelectedGP(null)}
        gp={selectedGP}
        onGPUpdate={(updated) => {
          setSelectedGP(updated);
        }}
        onViewGC={(gc) => {
          setSelectedGP(null);
          setSelectedGC(gc);
        }}
        onViewBC={(bc) => {
          setSelectedGP(null);
          setSelectedBC(bc);
        }}
      />

      <GCDetailModal
        isOpen={selectedGC !== null}
        onClose={() => setSelectedGC(null)}
        gc={selectedGC}
        onViewGP={(gp) => {
          setSelectedGC(null);
          setSelectedGP(gp);
        }}
        onViewBC={(bc) => {
          setSelectedGC(null);
          setSelectedBC(bc);
        }}
      />

      <BCDetailModal
        isOpen={selectedBC !== null}
        onClose={() => setSelectedBC(null)}
        bc={selectedBC}
        onViewBC={(bc) => {
          setSelectedBC(bc);
        }}
        onViewGP={(gp) => {
          setSelectedBC(null);
          setSelectedGP(gp);
        }}
        onViewGC={(gc) => {
          setSelectedBC(null);
          setSelectedGC(gc);
        }}
      />
    </div>
  );
}
