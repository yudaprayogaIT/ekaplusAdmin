// src/components/items/ItemList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import ItemCard from "./ItemCard";
import AddItemModal from "./AddItemModal";
import ItemDetailModal from "./ItemDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination, { usePagination } from "@/components/ui/Pagination";
import {
  FaPlus,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountUp,
  FaSortAmountDown,
  FaChevronDown,
  FaLock,
  FaBoxOpen,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  getFileUrl,
  API_CONFIG,
} from "@/config/api";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { ITEM_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";

export type Item = {
  id: number;
  code: string;
  item_code: string;
  name: string;
  item_name: string;
  uom: string;
  group: string;
  item_group: string;
  category: string; // item_category from API
  generator_item: string;
  image?: string;
  description?: string;
  item_desc?: string;
  disabled: number;
  status: string;
  docstatus: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  owner?: number;
  // Dimension fields
  panjang?: string;
  lebar?: string;
  tinggi?: string;
  diameter?: string;
  // Branches
  branches?: Array<{
    id: number;
    name: string;
  }>;
};

// API Response structure
type ItemAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    item_name: string;
    item_code: string;
    item_desc: string | null;
    item_group: string;
    item_category: string;
    generator_item: string;
    uom: string;
    image: string | null;
    disabled: number;
    status: string;
    docstatus: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    owner: number;
  }>;
  meta: Record<string, unknown>;
};

type SortField =
  | "item_name"
  | "item_code"
  | "item_category"
  | "created_at"
  | "updated_at";
type SortDirection = "asc" | "desc";

const SNAP_KEY = "ekatalog_items_snapshot";

export default function ItemList() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Item | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Item | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Use filter system
  const { filters, setFilters } = useFilters({
    entity: "item",
  });

  // Helper function to load data with filters and sorting
  async function loadAllData(
    filterTriples: FilterTriple[] = []
    // TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY
    // sort_by?: SortField,
    // sort_order?: SortDirection
  ): Promise<Item[]> {
    if (!token) return [];

    const headers = getAuthHeaders(token);

    const itemSpec: {
      fields: string[];
      filters?: FilterTriple[];
      order_by?: string[];
    } = {
      fields: ["*"],
    };

    if (filterTriples.length > 0) {
      itemSpec.filters = filterTriples;
    }

    // ============================================================================
    // TODO: UNCOMMENT KETIKA BACKEND SUDAH FIX ORDER_BY
    // Backend saat ini belum support order_by dengan benar (2025-12-26)
    // Sementara menggunakan client-side sorting (lihat line ~500)
    // ============================================================================
    // if (sort_by && sort_order) {
    //   // Goback requires order_by as ARRAY with UPPERCASE direction
    //   itemSpec.order_by = [`${sort_by} ${sort_order.toUpperCase()}`];
    // }
    // ============================================================================

    console.log("[ItemList] Filter Triples:", filterTriples);
    console.log("[ItemList] Item Spec:", itemSpec);

    const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, itemSpec);
    console.log("[ItemList] Request URL:", DATA_URL);

    const res = await fetch(DATA_URL, {
      method: "GET",
      cache: "no-store",
      headers,
    });

    if (res.ok) {
      const response = (await res.json()) as ItemAPIResponse;

      const mappedItems: Item[] = response.data.map((item) => ({
        id: item.id,
        code: item.item_code,
        item_code: item.item_code,
        name: item.item_name,
        item_name: item.item_name,
        uom: item.uom,
        group: item.item_group,
        item_group: item.item_group,
        category: item.item_category,
        generator_item: item.generator_item,
        image: getFileUrl(item.image),
        description: item.item_desc || undefined,
        item_desc: item.item_desc || undefined,
        disabled: item.disabled,
        status: item.status,
        docstatus: item.docstatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        owner: item.owner,
      }));

      // Debug: Log first 5 items to verify sort order
      console.log("[ItemList] First 5 items from API (to verify sort):");
      mappedItems.slice(0, 5).forEach((item, idx) => {
        console.log(
          `  ${idx + 1}. ${item.item_name} (ID: ${item.id}, Code: ${
            item.item_code
          })`
        );
      });

      return mappedItems;
    }

    // Log error details for debugging
    let errorDetail = `HTTP ${res.status}`;
    try {
      const errorBody = await res.json();
      console.error("[ItemList] API Error Response:", errorBody);
      errorDetail = errorBody.message || errorBody.error || errorDetail;
    } catch {
      console.error(
        "[ItemList] API Error (no JSON body):",
        res.status,
        res.statusText
      );
    }

    // For filter/query errors (400/500), return empty array instead of throwing
    // This allows UI to show "No data found" instead of error message
    if (res.status === 400 || res.status === 500) {
      console.warn(
        "[ItemList] Filter query failed, returning empty results:",
        errorDetail
      );
      return [];
    }

    throw new Error(`Failed to fetch items (${res.status}): ${errorDetail}`);
  }

  // Handle filter apply
  function handleApplyFilters(newFilters: FilterTriple[]) {
    setFilters(newFilters);
  }

  // Load items from API with filters and sorting
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          setLoading(false);
          return;
        }

        console.log(
          "[ItemList] Loading data (client-side sort):",
          sortField,
          sortDirection
        );
        // TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY
        // const mappedItems = await loadAllData(filters, sortField, sortDirection);
        const mappedItems = await loadAllData(filters);

        if (!cancelled) {
          setItems(mappedItems);
          try {
            localStorage.setItem(SNAP_KEY, JSON.stringify(mappedItems));
          } catch (e) {
            console.error("Failed to save snapshot:", e);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan."
            );
          } else if (errorMessage.includes("401")) {
            setError("Session expired. Silakan login kembali.");
          } else if (errorMessage.includes("403")) {
            setError("Akses ditolak. Anda tidak memiliki izin.");
          } else {
            setError(errorMessage);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, filters, sortField, sortDirection]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        // TODO: UNCOMMENT WHEN BACKEND SUPPORTS ORDER_BY
        // const mappedItems = await loadAllData(filters, sortField, sortDirection);
        const mappedItems = await loadAllData(filters);
        setItems(mappedItems);
        localStorage.setItem(SNAP_KEY, JSON.stringify(mappedItems));
      } catch (error) {
        console.error("Failed to reload items:", error);
      }
    }

    window.addEventListener("ekatalog:items_update", handler);
    return () => window.removeEventListener("ekatalog:items_update", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token]);

  function saveSnapshot(arr: Item[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:items_update"));
  }

  function promptDeleteItem(item: Item) {
    setConfirmTitle("Hapus Item");
    setConfirmDesc(`Yakin ingin menghapus item "${item.name}"?`);
    actionRef.current = async () => {
      try {
        if (!token) {
          throw new Error("Not authenticated");
        }

        const headers = getAuthHeaders(token);

        const response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.ITEM, item.id),
          {
            method: "DELETE",
            headers,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete item (${response.status})`
          );
        }

        console.log("Item deleted successfully");

        // Remove from local state
        const next = items.filter((x) => x.id !== item.id);
        setItems(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        console.error("Failed to delete item:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
      }
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  async function handleEdit(item: Item) {
    // Fetch detail item untuk mendapat branches lengkap
    if (!token) return;

    try {
      const detailUrl = getQueryUrl(`${API_CONFIG.ENDPOINTS.ITEM}/${item.id}`, {
        fields: ["*"],
      });
      const headers = getAuthHeaders(token);

      const res = await fetch(detailUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (res.ok) {
        const response = await res.json();
        const detailItem = response.data;

        // Map branches dari detail response
        const mappedBranches =
          detailItem.branches?.map((b: { branch: number }) => ({
            id: b.branch,
            name: `Branch ${b.branch}`, // Nama akan di-replace oleh modal saat load branches
          })) || [];

        const itemWithBranches: Item = {
          ...item,
          branches: mappedBranches,
          panjang: detailItem.panjang,
          lebar: detailItem.lebar,
          tinggi: detailItem.tinggi,
          diameter: detailItem.diameter,
        };

        setModalInitial(itemWithBranches);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch item detail:", error);
      // Fallback: buka modal dengan data yang ada
      setModalInitial(item);
      setModalOpen(true);
    }
  }

  async function openDetail(item: Item) {
    // Fetch detail item untuk mendapat branches lengkap
    if (!token) {
      setDetailItem(item);
      setDetailOpen(true);
      return;
    }

    try {
      const detailUrl = getQueryUrl(`${API_CONFIG.ENDPOINTS.ITEM}/${item.id}`, {
        fields: ["*"],
      });
      const headers = getAuthHeaders(token);

      const res = await fetch(detailUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (res.ok) {
        const response = await res.json();
        const detailItem = response.data;

        // Map branches dari detail response
        const mappedBranches =
          detailItem.branches?.map((b: { branch: number }) => ({
            id: b.branch,
            name: `Branch ${b.branch}`, // Nama akan di-replace oleh modal saat load branches
          })) || [];

        const itemWithBranches: Item = {
          ...item,
          branches: mappedBranches,
          panjang: detailItem.panjang,
          lebar: detailItem.lebar,
          tinggi: detailItem.tinggi,
          diameter: detailItem.diameter,
        };

        setDetailItem(itemWithBranches);
        setDetailOpen(true);
      } else {
        // Fallback: buka modal dengan data yang ada
        setDetailItem(item);
        setDetailOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch item detail:", error);
      // Fallback: buka modal dengan data yang ada
      setDetailItem(item);
      setDetailOpen(true);
    }
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(item: Item) {
    closeDetail();
    setTimeout(() => handleEdit(item), 80);
  }

  function onDetailDelete(item: Item) {
    closeDetail();
    setTimeout(() => promptDeleteItem(item), 80);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) {
      await actionRef.current();
      actionRef.current = null;
    }
  }

  function confirmCancel() {
    actionRef.current = null;
    setConfirmOpen(false);
  }

  // Get unique categories and UOMs for stats cards (MUST be before early returns to comply with Hooks rules)
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const uomList = Array.from(new Set(items.map((item) => item.uom)));

  // Client-side filtering for quick search (for better UX)
  let filteredItems = items;

  if (searchQuery.trim()) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // ============================================================================
  // TODO: HAPUS CLIENT-SIDE SORTING INI KETIKA BACKEND SUDAH FIX ORDER_BY
  // Sementara menggunakan client-side sorting karena backend belum support (2025-12-26)
  // ============================================================================
  // Client-side sorting (temporary until backend supports order_by)
  filteredItems = [...filteredItems].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sortField) {
      case "item_name":
        aVal = a.item_name.toLowerCase();
        bVal = b.item_name.toLowerCase();
        break;
      case "item_code":
        aVal = a.item_code.toLowerCase();
        bVal = b.item_code.toLowerCase();
        break;
      case "item_category":
        aVal = a.category.toLowerCase();
        bVal = b.category.toLowerCase();
        break;
      case "created_at":
        aVal = new Date(a.created_at || 0).getTime();
        bVal = new Date(b.created_at || 0).getTime();
        break;
      case "updated_at":
        aVal = new Date(a.updated_at || 0).getTime();
        bVal = new Date(b.updated_at || 0).getTime();
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  // ============================================================================

  // Apply pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredItems, 10);

  // Early returns AFTER all hooks
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Diperlukan
          </h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Items. Klik
            tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaBoxOpen className="w-4 h-4" />
            <span>Data items dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat data items...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex flex-col items-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-md">
          <span className="text-sm font-medium">{error}</span>
          {error.includes("terhubung") && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Items
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola item produk di seluruh cabang
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Item</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">
            Total Items
          </div>
          <div className="text-3xl font-bold text-blue-900">{items.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">
            Categories
          </div>
          <div className="text-3xl font-bold text-green-900">
            {categories.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">Active</div>
          <div className="text-3xl font-bold text-purple-900">
            {items.filter((i) => i.disabled === 0).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <div className="text-sm text-orange-700 font-medium mb-1">
            UOM Types
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {uomList.length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari item, kode, atau group..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Grid View"
              >
                <FaTh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="List View"
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Advanced FilterBuilder Component */}
              <FilterBuilder
                entity="item"
                config={ITEM_FILTER_FIELDS}
                onApply={handleApplyFilters}
              />

              {/* Sort Direction Button */}
              <button
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc";
                  console.log(
                    "[ItemList] Sort direction changed:",
                    sortDirection,
                    "->",
                    newDirection
                  );
                  setSortDirection(newDirection);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                title={
                  sortDirection === "asc"
                    ? "Ascending (A-Z, 1-9, Oldest)"
                    : "Descending (Z-A, 9-1, Newest)"
                }
              >
                {sortDirection === "asc" ? (
                  <FaSortAmountUp className="w-3.5 h-3.5" />
                ) : (
                  <FaSortAmountDown className="w-3.5 h-3.5" />
                )}
                {/* <span>{sortDirection === "asc" ? "A-Z" : "Z-A"}</span> */}
              </button>

              {/* Sort Field Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setSortFieldDropdownOpen(!sortFieldDropdownOpen)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <span>
                    {sortField === "item_name" && "Nama Item"}
                    {sortField === "item_code" && "Kode Item"}
                    {sortField === "item_category" && "Kategori"}
                    {sortField === "created_at" && "Tanggal Dibuat"}
                    {sortField === "updated_at" && "Tanggal Diupdate"}
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
                          {
                            value: "item_name" as SortField,
                            label: "Nama Item",
                          },
                          {
                            value: "item_code" as SortField,
                            label: "Kode Item",
                          },
                          {
                            value: "item_category" as SortField,
                            label: "Kategori",
                          },
                          {
                            value: "created_at" as SortField,
                            label: "Tanggal Dibuat",
                          },
                          {
                            value: "updated_at" as SortField,
                            label: "Tanggal Diupdate",
                          },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              console.log(
                                "[ItemList] Sort field changed:",
                                sortField,
                                "->",
                                option.value
                              );
                              setSortField(option.value);
                              setSortFieldDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                              sortField === option.value
                                ? "text-red-600 bg-red-50"
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
        </div>
      </div>

      {/* Items Display */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada item
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada item yang ditambahkan"}
          </p>
        </div>
      ) : (
        // All items view (no grouping)
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {paginatedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onEdit={() => handleEdit(item)}
                onDelete={() => promptDeleteItem(item)}
                onView={() => openDetail(item)}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}

      {/* Modals */}
      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
      />

      <ItemDetailModal
        open={detailOpen}
        onClose={closeDetail}
        item={detailItem}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
      />
    </div>
  );
}
