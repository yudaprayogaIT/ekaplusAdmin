// src/components/categories/CategoryList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import CategoryDetailModal from "./CategoryDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FaPlus, FaFilter, FaSearch, FaList, FaTh } from "react-icons/fa";
import { motion } from "framer-motion";

type Category = {
  id: number;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  title?: string;
  subtitle?: string;
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
  image?: string;
  description?: string;
  type_name: string;
  docstatus: number;
  status: string;
  disabled: number;
};

const CATEGORIES_DATA_URL = "/data/itemCategories.json";
const TYPES_DATA_URL = "/data/itemType.json";
const SNAP_KEY = "ekatalog_categories_snapshot";
const TYPES_SNAP_KEY = "ekatalog_types_snapshot";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Category | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Category | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load categories and types
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      
      try {
        // Load types
        const typesRes = await fetch(TYPES_DATA_URL, { cache: "no-store" });
        if (typesRes.ok) {
          const typesData = await typesRes.json() as CategoryType[];
          if (!cancelled) {
            setTypes(typesData);
            try { localStorage.setItem(TYPES_SNAP_KEY, JSON.stringify(typesData)); } catch {}
          }
        }

        // Load categories
        const categoriesRes = await fetch(CATEGORIES_DATA_URL, { cache: "no-store" });
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json() as Category[];
          if (!cancelled) {
            setCategories(categoriesData);
            try { localStorage.setItem(SNAP_KEY, JSON.stringify(categoriesData)); } catch {}
          }
        } else {
          if (!cancelled) setError(`Failed to fetch categories (${categoriesRes.status})`);
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try { setCategories(JSON.parse(raw) as Category[]); } catch {}
    }
    window.addEventListener("ekatalog:categories_update", handler);
    return () => window.removeEventListener("ekatalog:categories_update", handler);
  }, []);

  function saveSnapshot(arr: Category[]) {
    try { localStorage.setItem(SNAP_KEY, JSON.stringify(arr)); } catch {}
    window.dispatchEvent(new Event("ekatalog:categories_update"));
  }

  function promptDeleteCategory(c: Category) {
    setConfirmTitle("Hapus Kategori");
    setConfirmDesc(`Yakin ingin menghapus kategori "${c.name}"?`);
    actionRef.current = async () => {
      const next = categories.filter((x) => x.id !== c.id);
      setCategories(next);
      saveSnapshot(next);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat kategori...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Filter categories by search and type
  let filteredCategories = categories;
  
  if (searchQuery.trim()) {
    filteredCategories = filteredCategories.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (selectedType) {
    filteredCategories = filteredCategories.filter(c => c.type.id === selectedType);
  }

  // Group by type for "All" view
  const groupedByType = types.map(type => ({
    type,
    items: filteredCategories.filter(c => c.type.id === type.id)
  })).filter(group => group.items.length > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Categories</h1>
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

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kategori..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaTh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua ({categories.length})
            </button>
            {types.map(type => {
              const count = categories.filter(c => c.type.id === type.id).length;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedType === type.id
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.name} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada kategori</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada kategori yang ditambahkan'}
          </p>
        </div>
      ) : selectedType ? (
        // Single type view
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {types.find(t => t.id === selectedType)?.name}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredCategories.length} items
            </span>
          </div>

          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredCategories.map((c) => (
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
                  <h2 className="text-xl font-semibold text-gray-800">{type.name}</h2>
                  {type.description && (
                    <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                  {items.length} items
                </span>
              </div>

              <div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
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