"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { BCCard } from "./BCCard";
import { BCDetailModal } from "./BCDetailModal";
import { GPDetailModal } from "@/components/global_party/GPDetailModal";
import { GCDetailModal } from "@/components/global_customer/GCDetailModal";
import type { BranchCustomer, GlobalParty, GlobalCustomer } from "@/types/customer";
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
import Pagination, { usePagination } from "@/components/ui/Pagination";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";

type SortField = "name" | "branch_city" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";

interface BranchCustomerApiResponse {
  id: number;
  name?: string | null;
  gcid?: number | { id?: number; name?: string; gc_name?: string; gpid?: number } | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
  branch_owner_email?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface GroupCustomerLookupRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gpid?: number | null;
}

interface GroupParentLookupRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
}

interface BranchLookupRow {
  id: number;
  branch_name?: string | null;
  city?: string | null;
}

function resolveUserName(
  directName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined
): string | undefined {
  if (directName) return directName;
  if (value && typeof value === "object" && value.full_name) return value.full_name;
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

export default function BCList() {
  const { token, isAuthenticated } = useAuth();

  const [bcs, setBcs] = useState<BranchCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedGP, setSelectedGP] = useState<GlobalParty | null>(null);
  const [selectedGC, setSelectedGC] = useState<GlobalCustomer | null>(null);
  const [selectedBC, setSelectedBC] = useState<BranchCustomer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isAuthenticated || !token) {
        setBcs([]);
        setLoading(false);
        return;
      }

      const bcSpec = {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        limit: 10000000,
      };

      const bcRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bcSpec),
        { method: "GET", cache: "no-store" },
        token
      );

      if (!bcRes.ok) {
        throw new Error(`Failed to fetch branch customer (${bcRes.status})`);
      }

      const bcJson = await bcRes.json();
      const bcRows: BranchCustomerApiResponse[] = Array.isArray(bcJson?.data) ? bcJson.data : [];

      const gcIds = Array.from(
        new Set(
          bcRows
            .map((row) => {
              if (row.gcid && typeof row.gcid === "object") return toNumber(row.gcid.id);
              return toNumber(row.gcid);
            })
            .filter((id): id is number => typeof id === "number")
        )
      );

      const branchIds = Array.from(
        new Set(
          bcRows
            .map((row) => {
              if (row.branch && typeof row.branch === "object") return toNumber(row.branch.id);
              return toNumber(row.branch);
            })
            .filter((id): id is number => typeof id === "number")
        )
      );

      const gcMap = new Map<number, { code?: string; name?: string; gpid?: number }>();
      if (gcIds.length > 0) {
        const gcLookupSpec = {
          fields: ["id", "name", "gc_name", "gpid"],
          filters: [["id", "in", gcIds]],
          limit: gcIds.length,
        };

        const gcRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gcLookupSpec),
          { method: "GET", cache: "no-store" },
          token
        );

        if (gcRes.ok) {
          const gcJson = await gcRes.json();
          const gcRows: GroupCustomerLookupRow[] = Array.isArray(gcJson?.data) ? gcJson.data : [];
          gcRows.forEach((row) => {
            gcMap.set(Number(row.id), {
              code: row.name || undefined,
              name: row.gc_name || row.name || undefined,
              gpid: toNumber(row.gpid),
            });
          });
        }
      }

      const gpIds = Array.from(
        new Set(
          Array.from(gcMap.values())
            .map((gc) => gc.gpid)
            .filter((id): id is number => typeof id === "number")
        )
      );

      const gpMap = new Map<number, { code?: string; name?: string }>();
      if (gpIds.length > 0) {
        const gpLookupSpec = {
          fields: ["id", "name", "gp_name"],
          filters: [["id", "in", gpIds]],
          limit: gpIds.length,
        };
        const gpRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpLookupSpec),
          { method: "GET", cache: "no-store" },
          token
        );
        if (gpRes.ok) {
          const gpJson = await gpRes.json();
          const gpRows: GroupParentLookupRow[] = Array.isArray(gpJson?.data) ? gpJson.data : [];
          gpRows.forEach((row) => {
            gpMap.set(Number(row.id), {
              code: row.name || undefined,
              name: row.gp_name || row.name || undefined,
            });
          });
        }
      }

      const branchMap = new Map<number, { name?: string; city?: string }>();
      if (branchIds.length > 0) {
        const branchLookupSpec = {
          fields: ["id", "branch_name", "city"],
          filters: [["id", "in", branchIds]],
          limit: branchIds.length,
        };
        const branchRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, branchLookupSpec),
          { method: "GET", cache: "no-store" },
          token
        );
        if (branchRes.ok) {
          const branchJson = await branchRes.json();
          const branchRows: BranchLookupRow[] = Array.isArray(branchJson?.data) ? branchJson.data : [];
          branchRows.forEach((row) => {
            branchMap.set(Number(row.id), {
              name: row.branch_name || undefined,
              city: row.city || undefined,
            });
          });
        }
      }

      const mapped: BranchCustomer[] = bcRows.map((row) => {
        const gcId =
          row.gcid && typeof row.gcid === "object"
            ? toNumber(row.gcid.id) || 0
            : toNumber(row.gcid) || 0;

        const branchId =
          row.branch && typeof row.branch === "object"
            ? toNumber(row.branch.id) || 0
            : toNumber(row.branch) || 0;

        const directGcName =
          row.gcid && typeof row.gcid === "object"
            ? row.gcid.gc_name || row.gcid.name
            : undefined;

        const directBranchName =
          row.branch && typeof row.branch === "object" ? row.branch.branch_name : undefined;
        const directBranchCity =
          row.branch && typeof row.branch === "object" ? row.branch.city : undefined;

        const gcRef = gcMap.get(gcId);
        const branchRef = branchMap.get(branchId);
        const gpRef = gpMap.get(gcRef?.gpid || 0);

        const gcName = directGcName || gcRef?.name;
        const branchCity = directBranchCity || branchRef?.city;

        return {
          id: Number(row.id),
          code: row.name || undefined,
          name: row.name || (gcName && branchCity ? `${gcName} - ${branchCity}` : `BC ${row.id}`),
          gc_id: gcId,
          gc_name: gcName,
          gc_code:
            (row.gcid && typeof row.gcid === "object" ? row.gcid.name : undefined) || gcRef?.code,
          gp_name: gpRef?.name,
          gp_code: gpRef?.code,
          branch_id: branchId,
          branch_name: directBranchName || branchRef?.name,
          branch_city: branchCity,
          owner_name: row.branch_owner || undefined,
          owner_phone: row.branch_owner_phone || undefined,
          owner_email: row.branch_owner_email || undefined,
          created_at: row.created_at || new Date(0).toISOString(),
          updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
          created_by: resolveUserName(row["created_by.full_name"], row.created_by),
          updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
          disabled: Number(row.disabled || 0),
        };
      });

      setBcs(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setBcs([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAndSortedBCs = useMemo(() => {
    let filtered = [...bcs];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bc) =>
          bc.name.toLowerCase().includes(query) ||
          bc.code?.toLowerCase().includes(query) ||
          bc.gc_name?.toLowerCase().includes(query) ||
          bc.gc_code?.toLowerCase().includes(query) ||
          bc.gp_name?.toLowerCase().includes(query) ||
          bc.gp_code?.toLowerCase().includes(query) ||
          bc.branch_name?.toLowerCase().includes(query) ||
          bc.branch_city?.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortField === "branch_city") {
        aValue = (a.branch_city || "").toLowerCase();
        bValue = (b.branch_city || "").toLowerCase();
      } else {
        aValue = new Date(a[sortField]).getTime();
        bValue = new Date(b[sortField]).getTime();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [bcs, searchQuery, sortField, sortDirection]);

  const stats = useMemo(() => {
    return {
      total: bcs.length,
      active: bcs.filter((bc) => bc.disabled === 0).length,
      disabled: bcs.filter((bc) => bc.disabled === 1).length,
    };
  }, [bcs]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedBCs,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredAndSortedBCs, 20);

  const handleViewDetails = (bc: BranchCustomer) => {
    setSelectedBC(bc);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Branch Customer (BC)</h1>
          <p className="text-sm md:text-base text-gray-600">Kelola data Branch Customer</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <FaBuilding className="w-4 h-4 text-orange-700" />
            <div className="text-sm text-orange-700 font-medium">Total BC</div>
          </div>
          <div className="text-3xl font-bold text-orange-900">{stats.total}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <FaCheckCircle className="w-4 h-4 text-green-700" />
            <div className="text-sm text-green-700 font-medium">Active</div>
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.active}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <FaBan className="w-4 h-4 text-red-700" />
            <div className="text-sm text-red-700 font-medium">Disabled</div>
          </div>
          <div className="text-3xl font-bold text-red-900">{stats.disabled}</div>
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
              placeholder="Cari BC/GC/GP/branch..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm"
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
                {sortField === "name" && "Name"}
                {sortField === "branch_city" && "Branch City"}
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
                  <div className="fixed inset-0 z-10" onClick={() => setSortFieldDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20"
                  >
                    {[
                      { value: "name" as SortField, label: "Name" },
                      { value: "branch_city" as SortField, label: "Branch City" },
                      { value: "created_at" as SortField, label: "Created Date" },
                      { value: "updated_at" as SortField, label: "Updated Date" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortField(option.value);
                          setSortFieldDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                          sortField === option.value
                            ? "text-orange-600 bg-orange-50"
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

      {filteredAndSortedBCs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada BC ditemukan</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? "Coba ubah kata kunci pencarian" : "Belum ada data Branch Customer"}
          </p>
        </div>
      )}

      {filteredAndSortedBCs.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedBCs.map((bc) => (
              <BCCard key={bc.id} bc={bc} onViewDetails={() => handleViewDetails(bc)} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
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

