// src/components/products/AddProductModal.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaPlus,
  FaBox,
  FaFire,
  FaImage,
  FaTag,
  FaLayerGroup,
  FaSave,
  FaSearch,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import Image from "next/image";
import type { Item, Category, ItemVariant, ProductFormData } from "@/types";
import { DraggableVariantList } from "./DraggableVariantList";
import { VariantSuggestions } from "./VariantSuggestions";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  getAuthHeaders,
  getResourceUrl,
  apiFetch,
} from "@/config/api";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import UnsavedChangesDialog from "@/components/ui/UnsavedChangesDialog";
import type { FilterTriple } from "@/types/filter";
import {
  fetchProductItemPage,
  PRODUCT_ITEM_PAGE_SIZE,
} from "./itemQuery";

// Props interface
interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  initial?: ProductFormData | null;
  categories: Category[];
}

function isItemVariant(value: unknown): value is ItemVariant {
  if (!value || typeof value !== "object") return false;
  const candidate = value as { item?: unknown };

  if (!candidate.item || typeof candidate.item !== "object") return false;
  const itemCandidate = candidate.item as { id?: unknown };
  return typeof itemCandidate.id === "number";
}

// Item Selector Modal Component
function ItemSelectorModal({
  open,
  onClose,
  selectedItems,
  categories,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  selectedItems: Item[];
  categories: Category[];
  onSelect: (items: Item[]) => void;
}) {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<Item[]>(selectedItems);
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bulkSelecting, setBulkSelecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open) {
      setSelected(selectedItems);
      setItems([]);
      setPage(1);
      setTotal(0);
      setHasMore(false);
      setError(null);
      setFilterCategory("");
    }
  }, [open, selectedItems]);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      300,
    );
    return () => window.clearTimeout(timeout);
  }, [search]);

  const activeFilters = useMemo<FilterTriple[]>(
    () =>
      filterCategory
        ? [["item_category", "=", filterCategory]]
        : [],
    [filterCategory],
  );

  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          categories
            .map((category) => category.name?.trim())
            .filter((name): name is string => Boolean(name)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [categories],
  );

  const loadPage = useCallback(
    async (nextPage: number, replace: boolean) => {
      if (!token) return;
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const result = await fetchProductItemPage({
          token,
          page: nextPage,
          limit: PRODUCT_ITEM_PAGE_SIZE,
          search: debouncedSearch,
          filters: activeFilters,
          signal: controller.signal,
        });
        setItems((current) =>
          replace
            ? result.items
            : [
                ...current,
                ...result.items.filter(
                  (item) => !current.some((existing) => existing.id === item.id),
                ),
              ],
        );
        setPage(result.page);
        setTotal(result.total);
        setHasMore(result.hasMore);
      } catch (loadError) {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal mengambil daftar item.",
          );
        }
      } finally {
        if (requestRef.current === controller) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [activeFilters, debouncedSearch, token],
  );

  useEffect(() => {
    if (!open || !token) return;
    void loadPage(1, true);
    return () => requestRef.current?.abort();
  }, [loadPage, open, token]);

  const selectedIds = useMemo(
    () => new Set(selected.map((item) => item.id)),
    [selected],
  );

  const toggleItem = (item: Item) => {
    const exists = selected.some((s) => s.id === item.id);
    if (exists) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const mergeSelected = useCallback((newItems: Item[]) => {
    setSelected((current) => {
      const byId = new Map(current.map((item) => [item.id, item]));
      newItems.forEach((item) => byId.set(item.id, item));
      return Array.from(byId.values());
    });
  }, []);

  const fetchAllResults = useCallback(
    async (searchValue: string, filters: FilterTriple[]) => {
      if (!token) return [];

      const allItems: Item[] = [];
      const seenIds = new Set<number>();
      let nextPage = 1;
      let more = true;

      while (more) {
        const result = await fetchProductItemPage({
          token,
          page: nextPage,
          limit: 100,
          search: searchValue,
          filters,
        });
        let addedCount = 0;
        result.items.forEach((item) => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            allItems.push(item);
            addedCount += 1;
          }
        });
        more = result.hasMore && result.items.length > 0 && addedCount > 0;
        nextPage += 1;
      }

      return allItems;
    },
    [token],
  );

  const handleSelectAllMatching = async () => {
    const query = search.trim();
    if (!query) return;
    setBulkSelecting(true);
    setError(null);
    try {
      mergeSelected(await fetchAllResults(query, []));
    } catch (selectionError) {
      setError(
        selectionError instanceof Error
          ? selectionError.message
          : "Gagal memilih semua item yang cocok.",
      );
    } finally {
      setBulkSelecting(false);
    }
  };

  const handleConfirm = () => {
    // Deduplicate selected items before passing back
    const unique = selected.filter(
      (v, index, self) => index === self.findIndex((t) => t.id === v.id),
    );

    onSelect(unique);
    handleSelectorClose();
  };

  const handleSelectorClose = () => {
    requestRef.current?.abort();
    setSearch("");
    setDebouncedSearch("");
    onClose();
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSelectorClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Pilih Item</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selected.length} item dipilih
                {total > 0 ? ` · ${total} item aktif ditemukan` : ""}
              </p>
            </div>
            <button
              onClick={handleSelectorClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari item berdasarkan nama atau kode..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => void handleSelectAllMatching()}
              disabled={!search.trim() || bulkSelecting}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              {bulkSelecting
                ? "Memilih..."
                : `Select all matching \"${search}\"`}
            </button>
            <button
              onClick={() => setSelected([])}
              disabled={selected.length === 0}
              className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-600 transition-colors"
            >
              Clear selection
            </button>
          </div>

          {categoryOptions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-red-100 border-t-red-500" />
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="mb-3 text-sm text-red-600">{error}</p>
              <button
                onClick={() => void loadPage(1, true)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white"
              >
                Coba lagi
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada item ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => {
                const isSelected = selectedIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <FaCheck className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <Image
                          width={96}
                          height={96}
                          src={item.image}
                          alt={item.name}
                          unoptimized
                          loading="lazy"
                          decoding="async"
                          className="object-contain w-full h-full p-2"
                        />
                      ) : (
                        <FaImage className="w-8 h-8 text-gray-300" />
                      )}
                    </div>

                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono mb-2">
                      {item.code}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.color && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {item.color}
                        </span>
                      )}
                      {item.type && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                          {item.type}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && !error && hasMore && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => void loadPage(page + 1, false)}
                disabled={loadingMore}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 disabled:opacity-60"
              >
                {loadingMore ? "Memuat..." : "Muat item berikutnya"}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={handleSelectorClose}
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200"
          >
            Pilih {selected.length} Item
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AddProductModal({
  open,
  onClose,
  initial,
  categories,
}: AddProductModalProps) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isHotDeals, setIsHotDeals] = useState(false);
  const [disabled, setDisabled] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Item[]>([]);
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Track initial state for dirty checking
  const [initialState, setInitialState] = useState({
    name: "",
    categoryId: null as number | null,
    isHotDeals: false,
    disabled: 0,
    selectedVariants: [] as Item[],
  });

  // Check if form is dirty
  const isDirty =
    name !== initialState.name ||
    categoryId !== initialState.categoryId ||
    isHotDeals !== initialState.isHotDeals ||
    disabled !== initialState.disabled ||
    JSON.stringify(selectedVariants.map((v) => v.id)) !==
      JSON.stringify(initialState.selectedVariants.map((v) => v.id));

  // Unsaved changes hook
  const { showConfirm, handleClose, handleConfirmClose, handleCancelClose } =
    useUnsavedChanges({ isDirty, onClose });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (initial) {
        // Extract items from variants (initial.variants can be Item[] or ItemVariant[])
        // Check if first variant has 'item' property to determine structure
        const initialVariants = initial.variants as Array<Item | ItemVariant>;
        const firstVariant = initialVariants[0];
        const isItemVariantArray =
          initialVariants.length > 0 &&
          firstVariant &&
          isItemVariant(firstVariant);

        let items: Item[];
        if (isItemVariantArray) {
          // It's ItemVariant[] - extract items
          const variants = initialVariants.filter(isItemVariant);
          const variantItems = variants.map((v) => v.item);

          // Deduplicate by item.id
          items = variantItems.filter(
            (item, index, self) =>
              index === self.findIndex((t) => t.id === item.id),
          );

          // if (variantItems.length !== items.length) {
          //   console.warn('[AddProductModal] Duplicate item IDs:',
          //     variantItems.map((item) => item.id).filter((id, idx, arr) => arr.indexOf(id) !== idx)
          //   );
          // }
        } else {
          // Deduplicate by id
          items = (initialVariants as Item[]).filter(
            (v, index, self) => index === self.findIndex((t) => t.id === v.id),
          );
        }

        setName(initial.name);
        setCategoryId(initial.itemCategory.id);
        setIsHotDeals(initial.isHotDeals);
        setDisabled(initial.disabled);
        setSelectedVariants(items);

        // Set initial state for dirty checking
        setInitialState({
          name: initial.name,
          categoryId: initial.itemCategory.id,
          isHotDeals: initial.isHotDeals,
          disabled: initial.disabled,
          selectedVariants: items,
        });
      } else {
        setName("");
        setCategoryId(categories[0]?.id || null);
        setIsHotDeals(false);
        setDisabled(0);
        setSelectedVariants([]);

        // Set initial state for dirty checking
        setInitialState({
          name: "",
          categoryId: categories[0]?.id || null,
          isHotDeals: false,
          disabled: 0,
          selectedVariants: [],
        });
      }
    }
  }, [open, initial, categories]);

  const handleSave = useCallback(async () => {
    if (!name.trim() || !categoryId || !token) return;

    setSaving(true);

    try {
      // Deduplicate selectedVariants one more time before saving (by id)
      const uniqueSelectedVariants = selectedVariants.filter(
        (v, index, self) => index === self.findIndex((t) => t.id === v.id),
      );

      // if (selectedVariants.length !== uniqueSelectedVariants.length) {

      //   console.warn(
      //     "[AddProductModal] Duplicate item IDs:",
      //     selectedVariants
      //       .map((v) => v.id)
      //       .filter((id, idx, arr) => arr.indexOf(id) !== idx),
      //   );
      // }

      // Prepare variants - SIMPLE format: just {item: id}
      const variantsData = uniqueSelectedVariants.map((item) => ({
        item: item.id,
      }));

      // Build JSON payload
      const payload = {
        product_name: name.trim(),
        item_category: categoryId,
        hot_deals: isHotDeals ? 1 : 0,
        disabled: disabled,
        variants: variantsData, // Backend auto-generates idx, name, etc.
      };

      const headers = getAuthHeaders(token);
      const method = initial ? "PUT" : "POST";
      const url = initial
        ? getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT, initial.id)
        : getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT);

      const response = await apiFetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Dispatch event to trigger reload
        window.dispatchEvent(new Event("ekatalog:products_update"));
        onClose();
      } else {
        const errorText = await response.text();

        let errorMessage = "Unknown error";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.exc || errorText;
        } catch {
          errorMessage = errorText;
        }

        if (response.status === 401) {
          alert("Session expired. Please login again.");
        } else {
          alert(`Gagal menyimpan produk: ${errorMessage}`);
        }
      }
    } catch (error) {
      alert(
        `Gagal menyimpan produk. Silakan coba lagi.\n\nError: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      setSaving(false);
    }
  }, [categoryId, disabled, initial, isHotDeals, name, onClose, selectedVariants, token]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving && name.trim() && categoryId) {
          void handleSave();
        }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        if (!saving) handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [categoryId, handleClose, handleSave, name, open, saving]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {initial ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                <p className="text-red-100 text-sm mt-1">
                  {initial
                    ? "Perbarui informasi produk"
                    : "Isi detail produk dan pilih varian"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama produk..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaTag className="inline w-4 h-4 mr-2 text-gray-500" />
                  Kategori
                </label>
                <select
                  value={categoryId || ""}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Pilih kategori...</option>
                  {[...categories]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Hot Deals Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                    <FaFire className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Hot Deals</p>
                    <p className="text-sm text-gray-600">
                      Tandai sebagai produk unggulan
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHotDeals(!isHotDeals)}
                  className={`w-14 h-8 rounded-full transition-all ${
                    isHotDeals ? "bg-red-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      isHotDeals ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={disabled}
                  onChange={(e) => setDisabled(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value={0}>Aktif</option>
                  <option value={1}>Nonaktif</option>
                </select>
              </div>

              {/* Variants Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FaLayerGroup className="w-4 h-4 text-purple-500" />
                    Varian Produk
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {selectedVariants.length}
                    </span>
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setItemSelectorOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                  >
                    <FaPlus className="w-3.5 h-3.5" />
                    Pilih Item
                  </motion.button>
                </div>

                {/* Smart Suggestions */}
                {name.trim() && (
                  <VariantSuggestions
                    productName={name}
                    currentVariants={selectedVariants}
                    onSelect={(items) => {
                      // Deduplicate: merge new items with existing, remove duplicates by ID
                      const merged = [...selectedVariants, ...items];
                      const unique = merged.filter(
                        (v, index, self) =>
                          index === self.findIndex((t) => t.id === v.id),
                      );

                      setSelectedVariants(unique);
                    }}
                  />
                )}

                {/* Warning: No variants */}
                {selectedVariants.length === 0 && name.trim() && categoryId && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2 mb-4">
                    <FaExclamationTriangle className="text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">
                        No variants added
                      </p>
                      <p className="text-xs text-orange-700">
                        Products without variants won&apos;t be visible to
                        customers
                      </p>
                    </div>
                  </div>
                )}

                {/* Warning: Too many variants */}
                {selectedVariants.length > 50 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2 mb-4">
                    <FaExclamationTriangle className="text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">
                        Many variants ({selectedVariants.length})
                      </p>
                      <p className="text-xs text-yellow-700">
                        Consider splitting into multiple products for better
                        organization
                      </p>
                    </div>
                  </div>
                )}

                {selectedVariants.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                    <FaBox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Belum ada varian
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Klik &quot;Pilih Item&quot; untuk menambahkan varian
                    </p>
                  </div>
                ) : (
                  <DraggableVariantList
                    variants={selectedVariants}
                    onReorder={(newOrder) => {
                      setSelectedVariants(newOrder);
                    }}
                    onRemove={(id) => {
                      const filtered = selectedVariants.filter(
                        (v) => v.id !== id,
                      );

                      setSelectedVariants(filtered);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={!name.trim() || !categoryId || saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="w-4 h-4" />
              {saving
                ? "Menyimpan..."
                : initial
                  ? "Simpan Perubahan"
                  : "Simpan Produk"}
            </motion.button>
          </div>
        </motion.div>

        {/* Item Selector Modal */}
        <ItemSelectorModal
          open={itemSelectorOpen}
          onClose={() => setItemSelectorOpen(false)}
          selectedItems={selectedVariants}
          categories={categories}
          onSelect={setSelectedVariants}
        />

        {/* Unsaved Changes Dialog */}
        <UnsavedChangesDialog
          open={showConfirm}
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
        />
      </motion.div>
    </AnimatePresence>
  );
}
