// src/components/products/AddProductModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaPlus,
  FaTrash,
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
import type { Item, Category, ProductFormData } from "@/types";
import { DraggableVariantList } from "./DraggableVariantList";
import { VariantSuggestions } from "./VariantSuggestions";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  getQueryUrl,
  getAuthHeaders,
  getResourceUrl,
} from "@/config/api";

// Props interface
interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  initial?: ProductFormData | null;
  categories: Category[];
  availableItems: Item[];
}

// Item Selector Modal Component
function ItemSelectorModal({
  open,
  onClose,
  items,
  selectedItems,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  items: Item[];
  selectedItems: Item[];
  onSelect: (items: Item[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Item[]>(selectedItems);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterColor, setFilterColor] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelected(selectedItems);
      setSearch("");
      setFilterCategory(null);
      setFilterType(null);
      setFilterColor(null);
    }
  }, [open, selectedItems]);

  // Extract first 2 words dari item name untuk smart prefix matching
  const getItemPrefix = (itemName: string): string => {
    const words = itemName.trim().split(/\s+/);
    return words.slice(0, 2).join(" ").toUpperCase();
  };

  // Select semua items dengan prefix yang sama
  const selectByPrefix = (query: string) => {
    if (!query.trim()) return;
    const prefix = getItemPrefix(query);
    const matching = items.filter((item) => {
      const itemPrefix = getItemPrefix(item.name);
      return itemPrefix === prefix;
    });
    setSelected([
      ...selected,
      ...matching.filter((m) => !selected.some((s) => s.id === m.id)),
    ]);
  };

  // Get unique values untuk filters
  const uniqueCategories = [
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ];
  const uniqueTypes = [...new Set(items.map((i) => i.type).filter(Boolean))];
  const uniqueColors = [...new Set(items.map((i) => i.color).filter(Boolean))];

  const filteredItems = items.filter((item) => {
    // Text search
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.color?.toLowerCase().includes(search.toLowerCase()) ||
      item.type?.toLowerCase().includes(search.toLowerCase());

    // Category filter
    const matchesCategory = !filterCategory || item.category === filterCategory;

    // Type filter
    const matchesType = !filterType || item.type === filterType;

    // Color filter
    const matchesColor = !filterColor || item.color === filterColor;

    return matchesSearch && matchesCategory && matchesType && matchesColor;
  });

  const toggleItem = (item: Item) => {
    const exists = selected.some((s) => s.id === item.id);
    if (exists) {
      setSelected(selected.filter((s) => s.id !== item.id));
    } else {
      setSelected([...selected, item]);
    }
  };

  const handleConfirm = () => {
    onSelect(selected);
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
        onClick={onClose}
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
              </p>
            </div>
            <button
              onClick={onClose}
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
              placeholder="Cari item berdasarkan nama, kode, warna, atau tipe..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Bulk Action Buttons */}
          <div className="flex gap-2 flex-wrap mb-4">
            <button
              onClick={() => selectByPrefix(search)}
              disabled={!search.trim()}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              Select all matching &quot;{search}&quot;
            </button>

            <button
              onClick={() =>
                setSelected([
                  ...selected,
                  ...filteredItems.filter(
                    (f) => !selected.some((s) => s.id === f.id)
                  ),
                ])
              }
              disabled={filteredItems.length === 0}
              className="px-3 py-1.5 bg-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-purple-600 transition-colors"
            >
              Select all filtered ({filteredItems.length})
            </button>

            <button
              onClick={() => setSelected([])}
              disabled={selected.length === 0}
              className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-600 transition-colors"
            >
              Clear selection
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-2 flex-wrap">
            {uniqueCategories.length > 0 && (
              <select
                value={filterCategory || ""}
                onChange={(e) => setFilterCategory(e.target.value || null)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {uniqueTypes.length > 0 && (
              <select
                value={filterType || ""}
                onChange={(e) => setFilterType(e.target.value || null)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            {uniqueColors.length > 0 && (
              <select
                value={filterColor || ""}
                onChange={(e) => setFilterColor(e.target.value || null)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">All Colors</option>
                {uniqueColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada item ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selected.some((s) => s.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
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
  availableItems,
}: AddProductModalProps) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isHotDeals, setIsHotDeals] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Item[]>([]);
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (initial) {
        setName(initial.name);
        setCategoryId(initial.itemCategory.id);
        setIsHotDeals(initial.isHotDeals);
        setSelectedVariants(initial.variants); // Already Item[]
      } else {
        setName("");
        setCategoryId(categories[0]?.id || null);
        setIsHotDeals(false);
        setSelectedVariants([]);
      }
    }
  }, [open, initial, categories]);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const removeVariant = (itemId: number) => {
    setSelectedVariants(selectedVariants.filter((v) => v.id !== itemId));
  };

  const handleSave = async () => {
    if (!name.trim() || !categoryId || !token) return;

    setSaving(true);

    try {
      // Prepare variants - SIMPLE format: just {item: id}
      const variantsData = selectedVariants.map((item) => ({
        item: item.id,
      }));

      // Build JSON payload
      const payload = {
        product_name: name.trim(),
        item_category: categoryId,
        hot_deals: isHotDeals ? 1 : 0,
        variants: variantsData, // Backend auto-generates idx, name, etc.
      };

      const headers = getAuthHeaders(token);
      const method = initial ? "PUT" : "POST";
      const url = initial
        ? getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT, initial.id)
        : getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT);

      console.log("Saving product to:", url, "Method:", method);
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(url, {
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
        console.error("Product save failed:", response.status, errorText);

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
      console.error("Error saving product:", error);
      alert(
        `Gagal menyimpan produk. Silakan coba lagi.\n\nError: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setSaving(false);
    }
  };

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
          onClick={onClose}
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
                onClick={onClose}
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
                  {categories.map((cat) => (
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
                    items={availableItems}
                    currentVariants={selectedVariants}
                    onSelect={(items) =>
                      setSelectedVariants([...selectedVariants, ...items])
                    }
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
                    onReorder={setSelectedVariants}
                    onRemove={(id) =>
                      setSelectedVariants(
                        selectedVariants.filter((v) => v.id !== id)
                      )
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              onClick={onClose}
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
          items={availableItems}
          selectedItems={selectedVariants}
          onSelect={setSelectedVariants}
        />
      </motion.div>
    </AnimatePresence>
  );
}
