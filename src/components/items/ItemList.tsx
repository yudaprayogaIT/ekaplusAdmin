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
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
  FaLock,
  FaBoxOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  getFileUrl,
  API_CONFIG,
} from "@/config/api";

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

type SortOption =
  | "name-asc"
  | "name-desc"
  | "code-asc"
  | "code-desc"
  | "id-asc"
  | "id-desc";

const SNAP_KEY = "ekatalog_items_snapshot";

export default function ItemList() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUOM, setSelectedUOM] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("id-asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Item | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Item | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load items from API
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

        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await fetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as ItemAPIResponse;

          if (!cancelled) {
            // Map API response to Item type
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

            console.log("Loaded items:", mappedItems);
            setItems(mappedItems);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(mappedItems));
            } catch (e) {
              console.error("Failed to save snapshot:", e);
            }
          }
        } else {
          if (!cancelled) {
            if (res.status === 401) {
              setError("Session expired. Silakan login kembali.");
            } else if (res.status === 403) {
              setError("Akses ditolak. Anda tidak memiliki izin.");
            } else {
              setError(`Failed to fetch items (${res.status})`);
            }
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan."
            );
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
  }, [isAuthenticated, token]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

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

          setItems(mappedItems);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedItems));
        }
      } catch (error) {
        console.error("Failed to reload items:", error);
      }
    }

    window.addEventListener("ekatalog:items_update", handler);
    return () => window.removeEventListener("ekatalog:items_update", handler);
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

  // Get unique categories and UOMs (MUST be before early returns to comply with Hooks rules)
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const uomList = Array.from(new Set(items.map((item) => item.uom)));

  // Filter items
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

  if (selectedCategory) {
    filteredItems = filteredItems.filter(
      (item) => item.category === selectedCategory
    );
  }

  if (selectedUOM) {
    filteredItems = filteredItems.filter((item) => item.uom === selectedUOM);
  }

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "code-asc":
        return a.code.localeCompare(b.code);
      case "code-desc":
        return b.code.localeCompare(a.code);
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Apply pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedItems, 20);

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
          {/* Search, Sort & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari item, kode, atau group..."
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="id-asc">ID: Terlama</option>
                <option value="id-desc">ID: Terbaru</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="code-asc">Kode: A-Z</option>
                <option value="code-desc">Kode: Z-A</option>
              </select>
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
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />

            {/* Category Filter */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === null
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* UOM Filter */}
            {uomList.map((uom) => (
              <button
                key={uom}
                onClick={() => setSelectedUOM(selectedUOM === uom ? null : uom)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedUOM === uom
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {uom}
              </button>
            ))}
          </div>

          {/* Active Filters Info */}
          {(searchQuery ||
            selectedCategory ||
            selectedUOM ||
            sortBy !== "id-asc") && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">
                Filter aktif:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Pencarian: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedCategory && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Kategori: {selectedCategory}
                </span>
              )}
              {selectedUOM && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  UOM: {selectedUOM}
                </span>
              )}
              {sortBy !== "id-asc" && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  Sort: {sortBy.split("-").join(" ").toUpperCase()}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                  setSelectedUOM(null);
                  setSortBy("id-asc");
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                Reset Semua
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Items Display */}
      {sortedItems.length === 0 ? (
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
          {sortedItems.length > 0 && (
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
