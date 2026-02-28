"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { GPCard } from "./GPCard";
import { GPDetailModal } from "./GPDetailModal";
import { GCDetailModal } from "@/components/global_customer/GCDetailModal";
import { BCDetailModal } from "@/components/branch_customer/BCDetailModal";
import type { GlobalParty, GlobalCustomer, BranchCustomer } from "@/types/customer";
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

type SortField = "name" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";

interface GroupParentApiResponse {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

function resolveUserName(
  directName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined
): string | undefined {
  if (directName) return directName;
  if (value && typeof value === "object" && value.full_name) return value.full_name;
  return undefined;
}

function mapGpRow(row: GroupParentApiResponse): GlobalParty {
  return {
    id: Number(row.id),
    code: row.name || undefined,
    name: row.gp_name || row.name || "-",
    created_at: row.created_at || new Date(0).toISOString(),
    updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
    created_by: resolveUserName(row["created_by.full_name"], row.created_by),
    updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
    disabled: Number(row.disabled || 0),
  };
}

export default function GPList() {
  const { token, isAuthenticated } = useAuth();

  const [gps, setGps] = useState<GlobalParty[]>([]);
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
        setGps([]);
        setLoading(false);
        return;
      }

      const spec = {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        limit: 10000000,
      };

      const res = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, spec),
        { method: "GET", cache: "no-store" },
        token
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch group parent (${res.status})`);
      }

      const json = await res.json();
      const rows: GroupParentApiResponse[] = Array.isArray(json?.data) ? json.data : [];
      setGps(rows.map(mapGpRow));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setGps([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAndSortedGPs = useMemo(() => {
    const filtered = gps.filter((gp) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        gp.name.toLowerCase().includes(query) ||
        (gp.code || "").toLowerCase().includes(query)
      );
    });

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
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
  }, [gps, searchQuery, sortField, sortDirection]);

  const stats = useMemo(() => {
    return {
      total: gps.length,
      active: gps.filter((gp) => gp.disabled === 0).length,
      disabled: gps.filter((gp) => gp.disabled === 1).length,
    };
  }, [gps]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedGPs,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredAndSortedGPs, 20);

  const handleViewDetails = (gp: GlobalParty) => {
    setSelectedGP(gp);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
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
            Group Parent (GP)
          </h1>
          <p className="text-sm md:text-base text-gray-600">Kelola data Group Parent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FaBuilding className="w-4 h-4 text-blue-700" />
            <div className="text-sm text-blue-700 font-medium">Total GP</div>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
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
              placeholder="Cari GP name / code..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
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
                      { value: "name" as SortField, label: "Name" },
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
                            ? "text-purple-600 bg-purple-50"
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

      {filteredAndSortedGPs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada GP ditemukan</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? "Coba ubah kata kunci pencarian" : "Belum ada data Group Parent"}
          </p>
        </div>
      )}

      {filteredAndSortedGPs.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGPs.map((gp) => (
              <GPCard key={gp.id} gp={gp} onViewDetails={() => handleViewDetails(gp)} />
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
          setGps((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
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

