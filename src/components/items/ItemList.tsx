// src/components/items/ItemList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import ItemCard from "./ItemCard";
import AddItemModal from "./AddItemModal";
import ItemDetailModal from "./ItemDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
} from "react-icons/fa";
import { motion } from "framer-motion";

type Item = {
  id: number;
  code: string;
  name: string;
  uom: string;
  group: string;
  category: {
    id: number;
    name: string;
  };
  generator_item: string;
  image: string;
  description: string;
  disabled: number;
  panjang?: string;
  tinggi?: string;
  lebar?: string;
  diameter?: string;
  branches: Array<{
    id: number;
    name: string;
  }>;
};

type Category = {
  id: number;
  name: string;
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "code-asc"
  | "code-desc"
  | "id-asc"
  | "id-desc";

const DATA_URL = "/data/items.json";
const SNAP_KEY = "ekatalog_items_snapshot";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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

  // Load items
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);

      try {
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as Item[];
          if (!cancelled) {
            setItems(data);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(data));
            } catch {}
          }
        } else {
          if (!cancelled) setError(`Failed to fetch items (${res.status})`);
        }
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try {
        setItems(JSON.parse(raw) as Item[]);
      } catch {}
    }
    window.addEventListener("ekatalog:items_update", handler);
    return () => window.removeEventListener("ekatalog:items_update", handler);
  }, []);

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
      const next = items.filter((x) => x.id !== item.id);
      setItems(next);
      saveSnapshot(next);
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(item: Item) {
    setModalInitial(item);
    setModalOpen(true);
  }

  function openDetail(item: Item) {
    setDetailItem(item);
    setDetailOpen(true);
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
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Get unique categories and UOMs
  const categories: Category[] = Array.from(
    new Map(items.map((item) => [item.category.id, item.category])).values()
  );
  const uomList = Array.from(new Set(items.map((item) => item.uom)));

  // Filter items
  let filteredItems = items;

  if (searchQuery.trim()) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedCategory) {
    filteredItems = filteredItems.filter(
      (item) => item.category.id === selectedCategory
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

  // Group by category
  const groupedByCategory = categories
    .map((category) => ({
      category,
      items: sortedItems.filter((item) => item.category.id === category.id),
    }))
    .filter((group) => group.items.length > 0);

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
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="id-asc">ID: Terlama</option>
                <option value="id-desc">ID: Terbaru</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="code-asc">Kode: A-Z</option>
                <option value="code-desc">Kode: Z-A</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
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
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
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
                  Kategori:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name}
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
      ) : selectedCategory ? (
        // Single category view
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {sortedItems.length} items
            </span>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedItems.map((item) => (
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
        </section>
      ) : (
        // All categories view (grouped)
        <div className="space-y-10">
          {groupedByCategory.map(({ category, items: categoryItems }) => (
            <section key={category.id}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {category.name}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  {categoryItems.length} items
                </span>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {categoryItems.map((item) => (
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
            </section>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
        categories={categories}
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
