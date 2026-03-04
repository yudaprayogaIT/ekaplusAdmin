"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaSearch,
  FaTags,
  FaCheckCircle,
  FaBan,
  FaSortAmountUp,
  FaSortAmountDown,
  FaChevronDown,
  FaBuilding,
  FaStore,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import Pagination, { usePagination } from "@/components/ui/Pagination";
import { NBDetailModal, type NationalBrandDetailData } from "./NBDetailModal";

interface NationalBrandApiResponse {
  id: number;
  name: string;
  nb_name?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface MemberOfApiResponse {
  id: number;
  ref_type?: string | null;
  ref_id?: number | string | null;
  user?: number | { id?: number | string; full_name?: string } | null;
  is_owner?: number | boolean | null;
}

interface GroupParentApiResponse {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nbid?: number | { id?: number | string } | null;
  disabled?: number | null;
}

interface GroupCustomerApiResponse {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gpid?: number | { id?: number | string } | null;
  disabled?: number | null;
}

interface BranchCustomerApiResponse {
  id: number;
  name?: string | null;
  gcid?: number | { id?: number | string } | null;
  disabled?: number | null;
}

interface CustomerRegisterOwnerRow {
  owner_full_name?: string | null;
  nbid?: number | { id?: number | string } | null;
  ekaplus_user?: number | { full_name?: string } | null;
}

interface NationalBrandItem {
  id: number;
  code: string;
  name: string;
  disabled: number;
  created_at: string;
  updated_at: string;
  owners: string[];
  active_gp_count: number;
  active_gc_count: number;
  active_bc_count: number;
  sample_gp_names: string[];
  sample_gc_names: string[];
  active_gp_names: string[];
  active_gc_names: string[];
  active_bc_names: string[];
}

type SortField = "name" | "code" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function extractLinkId(value: unknown): number | undefined {
  if (!value) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "object" && "id" in value) {
    return toNumber((value as { id?: unknown }).id);
  }
  return undefined;
}

function asActive(disabled: unknown): boolean {
  return Number(disabled || 0) !== 1;
}

export default function NBList() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<NationalBrandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<NationalBrandDetailData | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated || !token) {
        setItems([]);
        setLoading(false);
        return;
      }

      const [nbRes, memberRes, gpRes, gcRes, bcRes] = await Promise.all([
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
              fields: ["*"],
              limit: 10000000,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.MEMBER_OF, {
              fields: ["*"],
              filters: [["ref_type", "=", "nbid"]],
              limit: 10000000,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
              fields: ["*"],
              limit: 10000000,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
              fields: ["*"],
              limit: 10000000,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
              fields: ["*"],
              limit: 10000000,
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
        ]);

      if (!nbRes.ok)
        throw new Error(`Failed to fetch national brands (${nbRes.status})`);
      if (!memberRes.ok)
        throw new Error(`Failed to fetch member_of (${memberRes.status})`);
      if (!gpRes.ok)
        throw new Error(`Failed to fetch group parent (${gpRes.status})`);
      if (!gcRes.ok)
        throw new Error(`Failed to fetch group customer (${gcRes.status})`);
      if (!bcRes.ok)
        throw new Error(`Failed to fetch branch customer (${bcRes.status})`);
      const [nbJson, memberJson, gpJson, gcJson, bcJson] = await Promise.all([
        nbRes.json(),
        memberRes.json(),
        gpRes.json(),
        gcRes.json(),
        bcRes.json(),
      ]);

      const nbRows: NationalBrandApiResponse[] = Array.isArray(nbJson?.data)
        ? nbJson.data
        : [];
      const memberRows: MemberOfApiResponse[] = Array.isArray(memberJson?.data)
        ? memberJson.data
        : [];
      const gpRows: GroupParentApiResponse[] = Array.isArray(gpJson?.data)
        ? gpJson.data
        : [];
      const gcRows: GroupCustomerApiResponse[] = Array.isArray(gcJson?.data)
        ? gcJson.data
        : [];
      const bcRows: BranchCustomerApiResponse[] = Array.isArray(bcJson?.data)
        ? bcJson.data
        : [];
      let customerRows: CustomerRegisterOwnerRow[] = [];
      try {
        const customerRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER, {
            fields: ["nbid", "owner_full_name"],
            limit: 10000000,
          }),
          { method: "GET", cache: "no-store" },
          token,
        );
        if (customerRes.ok) {
          const customerJson = await customerRes.json();
          customerRows = Array.isArray(customerJson?.data)
            ? customerJson.data
            : [];
        } else {
          console.warn(
            `Failed to fetch customer register (${customerRes.status}), using owner fallback from member_of only.`,
          );
        }
      } catch (customerErr) {
        console.warn(
          "Failed to fetch customer register, using owner fallback from member_of only.",
          customerErr,
        );
      }

      const ownersByNb = new Map<number, string[]>();
      memberRows.forEach((row) => {
        const nbId = toNumber(row.ref_id);
        if (!nbId) return;
        const rawName =
          typeof row.user === "object"
            ? row.user?.full_name
            : row.user
              ? `User ${row.user}`
              : undefined;
        const name = rawName || "Unknown User";
        if (!ownersByNb.has(nbId)) ownersByNb.set(nbId, []);
        const list = ownersByNb.get(nbId)!;
        if (!list.includes(name)) {
          if (row.is_owner) {
            list.unshift(name);
          } else {
            list.push(name);
          }
        }
      });
      const ownerFallbackByNb = new Map<number, string[]>();
      customerRows.forEach((row) => {
        const nbId = extractLinkId(row.nbid);
        if (!nbId) return;
        const fallbackName =
          row.owner_full_name ||
          (row.ekaplus_user && typeof row.ekaplus_user === "object"
            ? row.ekaplus_user.full_name
            : undefined);
        if (!fallbackName) return;
        if (!ownerFallbackByNb.has(nbId)) ownerFallbackByNb.set(nbId, []);
        const list = ownerFallbackByNb.get(nbId)!;
        if (!list.includes(fallbackName)) list.push(fallbackName);
      });

      const gpByNb = new Map<number, GroupParentApiResponse[]>();
      gpRows.forEach((gp) => {
        const nbId = extractLinkId(gp.nbid);
        if (!nbId) return;
        if (!gpByNb.has(nbId)) gpByNb.set(nbId, []);
        gpByNb.get(nbId)!.push(gp);
      });

      const gcByGp = new Map<number, GroupCustomerApiResponse[]>();
      gcRows.forEach((gc) => {
        const gpId = extractLinkId(gc.gpid);
        if (!gpId) return;
        if (!gcByGp.has(gpId)) gcByGp.set(gpId, []);
        gcByGp.get(gpId)!.push(gc);
      });

      const bcByGc = new Map<number, BranchCustomerApiResponse[]>();
      bcRows.forEach((bc) => {
        const gcId = extractLinkId(bc.gcid);
        if (!gcId) return;
        if (!bcByGc.has(gcId)) bcByGc.set(gcId, []);
        bcByGc.get(gcId)!.push(bc);
      });

      const mapped: NationalBrandItem[] = nbRows.map((row) => {
        const gpCandidates = (gpByNb.get(row.id) || []).filter((gp) =>
          asActive(gp.disabled),
        );
        const gpIds = gpCandidates.map((gp) => gp.id);

        const gcCandidates = gpIds
          .flatMap((gpId) => gcByGp.get(gpId) || [])
          .filter((gc) => asActive(gc.disabled));
        const gcIds = gcCandidates.map((gc) => gc.id);

        const bcCandidates = gcIds
          .flatMap((gcId) => bcByGc.get(gcId) || [])
          .filter((bc) => asActive(bc.disabled));

        return {
          id: row.id,
          code: row.name,
          name: row.nb_name || row.name || "-",
          disabled: Number(row.disabled || 0),
          created_at: row.created_at || new Date(0).toISOString(),
          updated_at:
            row.updated_at || row.created_at || new Date(0).toISOString(),
          owners: ownersByNb.get(row.id)?.length
            ? ownersByNb.get(row.id)!
            : ownerFallbackByNb.get(row.id) || [],
          active_gp_count: gpCandidates.length,
          active_gc_count: gcCandidates.length,
          active_bc_count: bcCandidates.length,
          sample_gp_names: gpCandidates
            .map((gp) => gp.gp_name || gp.name || `GP ${gp.id}`)
            .slice(0, 2),
          sample_gc_names: gcCandidates
            .map((gc) => gc.gc_name || gc.name || `GC ${gc.id}`)
            .slice(0, 2),
          active_gp_names: gpCandidates.map(
            (gp) => gp.gp_name || gp.name || `GP ${gp.id}`,
          ),
          active_gc_names: gcCandidates.map(
            (gc) => gc.gc_name || gc.name || `GC ${gc.id}`,
          ),
          active_bc_names: bcCandidates.map((bc) => bc.name || `BC ${bc.id}`),
        };
      });

      setItems(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.code.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.owners.some((owner) => owner.toLowerCase().includes(q)) ||
          item.sample_gp_names.some((gp) => gp.toLowerCase().includes(q)) ||
          item.sample_gc_names.some((gc) => gc.toLowerCase().includes(q)),
      );
    }

    result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortField === "name" || sortField === "code") {
        aValue = a[sortField].toLowerCase();
        bValue = b[sortField].toLowerCase();
      } else {
        aValue = new Date(a[sortField]).getTime();
        bValue = new Date(b[sortField]).getTime();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return result;
  }, [items, searchQuery, sortField, sortDirection]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((i) => i.disabled === 0).length,
      disabled: items.filter((i) => i.disabled === 1).length,
    }),
    [items],
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredAndSorted, 20);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
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
            National Brand (NB)
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola data National Brand
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FaTags className="w-4 h-4 text-blue-700" />
            <div className="text-sm text-blue-700 font-medium">Total NB</div>
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
              placeholder="Cari NB, owner, GP, GC..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <button
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
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
              onClick={() => setSortFieldDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <span>
                {sortField === "name" && "Name"}
                {sortField === "code" && "Code"}
                {sortField === "created_at" && "Created Date"}
                {sortField === "updated_at" && "Updated Date"}
              </span>
              <FaChevronDown
                className={`w-3 h-3 transition-transform ${sortFieldDropdownOpen ? "rotate-180" : ""}`}
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
                      { value: "code" as SortField, label: "Code" },
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
                            ? "text-indigo-600 bg-indigo-50"
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

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada NB ditemukan
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada data National Brand"}
          </p>
        </div>
      )}

      {filteredAndSorted.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-indigo-100">NBID: {item.code}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.disabled === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.disabled === 0 ? "Active" : "Disabled"}
                  </span>
                </div>

                <div className="p-5 text-sm space-y-3">
                  {/* <div className="flex items-start gap-2 text-gray-700">
                    <FaUser className="w-3.5 h-3.5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">
                        Owner / Pengguna NB
                      </p>
                      <p className="font-medium text-gray-900 line-clamp-2">
                        {item.owners.length > 0
                          ? item.owners.join(", ")
                          : "Belum ada owner di member_of"}
                      </p>
                    </div>
                  </div> */}

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg border border-purple-100 bg-purple-50 px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-purple-700 font-semibold">
                        <FaBuilding className="w-3 h-3" /> GP
                      </div>
                      <div className="mt-1 text-purple-900 font-bold">
                        {item.active_gp_count}
                      </div>
                    </div>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-700 font-semibold">
                        <FaBuilding className="w-3 h-3" /> GC
                      </div>
                      <div className="mt-1 text-blue-900 font-bold">
                        {item.active_gc_count}
                      </div>
                    </div>
                    <div className="rounded-lg border border-orange-100 bg-orange-50 px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-orange-700 font-semibold">
                        <FaStore className="w-3 h-3" /> BC
                      </div>
                      <div className="mt-1 text-orange-900 font-bold">
                        {item.active_bc_count}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 pt-1 border-t border-gray-100 mx-auto">
                    Updated{" "}
                    {new Date(item.updated_at).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500 pt-1 border-gray-100 mx-auto">
                    Created{" "}
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </motion.div>
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

      <NBDetailModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </div>
  );
}
