// src/components/categories/CategoryList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import CategoryDetailModal from "./CategoryDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
  FaLock,
  FaTags,
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

export type Category = {
  id: number;
  name: string;
  category_name: string;
  icon?: string;
  image?: string;
  description?: string;
  title?: string;
  subtitle?: string;
  item_type: number;
  type: {
    id: number;
    name: string;
  };
  docstatus: number;
  status: string;
  disabled: number;
  updated_at?: string;
  updated_by?: { id: number; name: string };
  created_at?: string;
  created_by?: { id: number; name: string };
  owner?: { id: number; name: string };
};

type CategoryType = {
  id: number;
  name: string;
  type_name: string;
  image?: string;
  description?: string;
  docstatus: number;
  status: string;
  disabled: number;
};

// API Response structure
type CategoryAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    category_name: string;
    icon: string | null;
    image: string | null;
    description: string | null;
    title: string | null;
    subtitle: string | null;
    item_type: number;
    docstatus: number;
    status: string;
    disabled: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    owner: number;
  }>;
  meta: Record<string, unknown>;
};

type TypeAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    type_name: string;
    image: string | null;
    description: string | null;
    docstatus: number;
    status: string;
    disabled: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    owner: number;
  }>;
  meta: Record<string, unknown>;
};

type SortOption = "name-asc" | "name-desc" | "id-asc" | "id-desc";

const SNAP_KEY = "ekatalog_categories_snapshot";
const TYPES_SNAP_KEY = "ekatalog_types_snapshot";

export default function CategoryList() {
  const { token, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("id-asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Category | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Category | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load categories and types from API
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

        const headers = getAuthHeaders(token);

        // Load types from API first
        const typesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.TYPE, {
          fields: ["*"],
        });
        const typesRes = await fetch(typesUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        let mappedTypes: CategoryType[] = [];
        if (typesRes.ok) {
          const typesResponse = (await typesRes.json()) as TypeAPIResponse;
          if (!cancelled) {
            mappedTypes = typesResponse.data.map((item) => ({
              id: item.id,
              name: item.name,
              type_name: item.type_name,
              image: getFileUrl(item.image),
              description: item.description || undefined,
              docstatus: item.docstatus,
              status: item.status,
              disabled: item.disabled,
            }));
            setTypes(mappedTypes);
            try {
              localStorage.setItem(TYPES_SNAP_KEY, JSON.stringify(mappedTypes));
            } catch {}
          }
        }

        // Load categories from API and map type objects
        const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
          fields: ["*"],
        });
        const categoriesRes = await fetch(categoriesUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (categoriesRes.ok) {
          const categoriesResponse =
            (await categoriesRes.json()) as CategoryAPIResponse;
          if (!cancelled) {
            // Map and filter out categories without valid types
            const mappedCategories: Category[] = categoriesResponse.data

              .filter((item) => {
                // Check if type exists
                const typeExists = mappedTypes.some(
                  (t) => t.id === item.item_type
                );
                if (!typeExists) {
                  console.warn(
                    `Category ${item.name} (ID: ${item.id}) has invalid item_type: ${item.item_type}`
                  );
                }
                return typeExists;
              })
              .map((item) => {
                // Find the type object from the loaded types (we know it exists now)
                const typeObj = mappedTypes.find(
                  (t) => t.id === item.item_type
                )!;

                return {
                  id: item.id,
                  name: item.name,
                  category_name: item.category_name,
                  icon: item.icon || undefined,
                  image: getFileUrl(item.image),
                  description: item.description || undefined,
                  title: item.title || undefined,
                  subtitle: item.subtitle || undefined,
                  item_type: item.item_type,
                  type: { id: typeObj.id, name: typeObj.name },
                  docstatus: item.docstatus,
                  status: item.status,
                  disabled: item.disabled,
                  // Audit trail
                  created_at: item.created_at,
                  created_by: item.created_by ? { id: item.created_by, name: `User #${item.created_by}` } : undefined,
                  updated_at: item.updated_at,
                  updated_by: item.updated_by ? { id: item.updated_by, name: `User #${item.updated_by}` } : undefined,
                  owner: item.owner ? { id: item.owner, name: `User #${item.owner}` } : undefined,
                };
              });

            console.log("Loaded categories:", mappedCategories);
            setCategories(mappedCategories);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(mappedCategories));
            } catch {}
          }
        } else {
          if (!cancelled) {
            if (categoriesRes.status === 401) {
              setError("Session expired. Silakan login kembali.");
            } else {
              setError(`Failed to fetch categories (${categoriesRes.status})`);
            }
          }
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
  }, [isAuthenticated, token]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await fetch(categoriesUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as CategoryAPIResponse;
          const mappedCategories: Category[] = response.data
            .filter((item) => {
              // Check if type exists
              const typeExists = types.some((t) => t.id === item.item_type);
              if (!typeExists) {
                console.warn(
                  `Category ${item.name} (ID: ${item.id}) has invalid item_type: ${item.item_type}`
                );
              }
              return typeExists;
            })
            .map((item) => {
              // Find the type object from the current types state (we know it exists now)
              const typeObj = types.find((t) => t.id === item.item_type)!;

              return {
                id: item.id,
                name: item.name,
                category_name: item.category_name,
                icon: item.icon || undefined,
                image: getFileUrl(item.image),
                description: item.description || undefined,
                title: item.title || undefined,
                subtitle: item.subtitle || undefined,
                item_type: item.item_type,
                type: { id: typeObj.id, name: typeObj.name },
                docstatus: item.docstatus,
                status: item.status,
                disabled: item.disabled,
                created_at: item.created_at,
                updated_at: item.updated_at,
              };
            });

          setCategories(mappedCategories);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedCategories));
        }
      } catch (error) {
        console.error("Failed to reload categories:", error);
      }
    }

    window.addEventListener("ekatalog:categories_update", handler);
    return () =>
      window.removeEventListener("ekatalog:categories_update", handler);
  }, [isAuthenticated, token, types]);

  function saveSnapshot(arr: Category[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:categories_update"));
  }

  function promptDeleteCategory(c: Category) {
    setConfirmTitle("Hapus Kategori");
    setConfirmDesc(`Yakin ingin menghapus kategori "${c.name}"?`);
    actionRef.current = async () => {
      try {
        if (!token) {
          throw new Error("Not authenticated");
        }

        const headers = getAuthHeaders(token);
        const response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.CATEGORY, c.id),
          {
            method: "DELETE",
            headers,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to delete category (${response.status})`
          );
        }

        console.log("Category deleted successfully");

        // Remove from local state
        const next = categories.filter((x) => x.id !== c.id);
        setCategories(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        console.error("Failed to delete category:", err);
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

  function handleEdit(c: Category) {
    setModalInitial(c);
    setModalOpen(true);
  }

  function openDetail(c: Category) {
    setDetailItem(c);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(c: Category) {
    closeDetail();
    setTimeout(() => handleEdit(c), 80);
  }

  function onDetailDelete(c: Category) {
    closeDetail();
    setTimeout(() => promptDeleteCategory(c), 80);
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

  // Not authenticated - show login required
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
            Silakan login terlebih dahulu untuk mengakses data Kategori. Klik
            tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaTags className="w-4 h-4" />
            <span>Data kategori dilindungi untuk keamanan</span>
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
            Memuat kategori...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Filter categories by search and type
  let filteredCategories = categories;

  if (searchQuery.trim()) {
    filteredCategories = filteredCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedType) {
    filteredCategories = filteredCategories.filter(
      (c) => c.type.id === selectedType
    );
  }

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.category_name.localeCompare(b.category_name);
      case "name-desc":
        return b.category_name.localeCompare(a.category_name);
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Group by type for "All" view
  const groupedByType = types
    // .sort((a, b) => a.name.localeCompare(b.name))
    .map((type) => ({
      type,
      items: sortedCategories.filter((c) => c.type.id === type.id),
    }))
    .filter((group) => group.items.length > 0);

  console.log(groupedByType);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Categories
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola kategori produk material dan furniture
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">
            Total Kategori
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {categories.length}
          </div>
        </div>
        {types.map((type, index) => {
          const count = categories.filter((c) => c.type.id === type.id).length;
          const colors = [
            {
              from: "from-green-50",
              to: "to-green-100",
              border: "border-green-200",
              text: "text-green-700",
              textDark: "text-green-900",
            },
            {
              from: "from-purple-50",
              to: "to-purple-100",
              border: "border-purple-200",
              text: "text-purple-700",
              textDark: "text-purple-900",
            },
            {
              from: "from-orange-50",
              to: "to-orange-100",
              border: "border-orange-200",
              text: "text-orange-700",
              textDark: "text-orange-900",
            },
            {
              from: "from-pink-50",
              to: "to-pink-100",
              border: "border-pink-200",
              text: "text-pink-700",
              textDark: "text-pink-900",
            },
            {
              from: "from-indigo-50",
              to: "to-indigo-100",
              border: "border-indigo-200",
              text: "text-indigo-700",
              textDark: "text-indigo-900",
            },
            {
              from: "from-teal-50",
              to: "to-teal-100",
              border: "border-teal-200",
              text: "text-teal-700",
              textDark: "text-teal-900",
            },
          ];
          const color = colors[index % colors.length];
          return (
            <div
              key={type.id}
              className={`bg-gradient-to-br ${color.from} ${color.to} rounded-xl p-5 border-2 ${color.border}`}
            >
              <div
                className={`text-sm ${color.text} font-medium mb-1 line-clamp-1`}
              >
                {type.name}
              </div>
              <div className={`text-3xl font-bold ${color.textDark}`}>
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
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
                placeholder="Cari kategori..."
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

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => setSelectedType(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedType === null
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
            {types.map((type) => {
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedType === type.id
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {sortedCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada kategori
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada kategori yang ditambahkan"}
          </p>
        </div>
      ) : selectedType ? (
        // Single type view
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {types.find((t) => t.id === selectedType)?.name}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {sortedCategories.length} items
            </span>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedCategories.map((c) => (
              <CategoryCard
                key={c.id}
                category={c}
                viewMode={viewMode}
                onEdit={() => handleEdit(c)}
                onDelete={() => promptDeleteCategory(c)}
                onView={() => openDetail(c)}
              />
            ))}
          </div>
        </section>
      ) : (
        // All types view (grouped)
        <div className="space-y-10">
          {groupedByType.map(({ type, items }) => (
            <section key={type.id}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {type.name}
                  </h2>
                  {type.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {type.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  {items.length} items
                </span>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {items.map((c) => (
                  <CategoryCard
                    key={c.id}
                    category={c}
                    viewMode={viewMode}
                    onEdit={() => handleEdit(c)}
                    onDelete={() => promptDeleteCategory(c)}
                    onView={() => openDetail(c)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddCategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
        types={types}
      />

      <CategoryDetailModal
        open={detailOpen}
        onClose={closeDetail}
        category={detailItem}
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
