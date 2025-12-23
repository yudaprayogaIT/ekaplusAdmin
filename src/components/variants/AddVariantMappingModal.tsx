// src/components/variants/AddVariantMappingModal.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLink, FaCheck, FaBox } from "react-icons/fa";
import Image from "next/image";
import { fetchVariants, createVariant } from "@/services/variantService";
import { useAuth } from "@/contexts/AuthContext";

type Branch = {
  id: number;
  name: string;
};

type Item = {
  id: number;
  code: string;
  name: string;
  color: string;
  type: string;
  uom: string;
  image?: string;
  branches?: Branch[];
  description?: string;
};

type ItemVariant = {
  id: number;
  item: Item;
  productid: number;
};

type Product = {
  id: number;
  name: string;
  itemCategory: {
    id: number;
    name: string;
  };
  disabled: number;
  isHotDeals: boolean;
};

export default function AddVariantMappingModal({
  open,
  onClose,
  items,
  products,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  items: Item[];
  products: Product[];
  onSave?: () => void;
}) {
  const { token } = useAuth();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [existingVariants, setExistingVariants] = useState<ItemVariant[]>([]);
  const [saving, setSaving] = useState(false);

  // Load existing variants from API
  useEffect(() => {
    if (open && token) {
      fetchVariants(token, items)
        .then((variants) => setExistingVariants(variants))
        .catch((err) => {
          console.error("Failed to load variants:", err);
          setExistingVariants([]);
        });
    }
  }, [open, items, token]);

  // Get unmapped items
  const unmappedItems = useMemo(() => {
    const mappedItemIds = new Set(existingVariants.map((v) => v.item.id));
    return items.filter((item) => !mappedItemIds.has(item.id));
  }, [items, existingVariants]);

  // Get selected item details
  const selectedItem = unmappedItems.find((i) => i.id === selectedItemId);

  // Extract first 2 words from item name
  const getItemPrefix = (itemName: string): string => {
    const words = itemName.trim().split(/\s+/);
    return words.slice(0, 2).join(" ").toUpperCase();
  };

  // Smart filter products based on selected item
  const filteredProducts = useMemo(() => {
    if (!selectedItem) return products;

    const itemPrefix = getItemPrefix(selectedItem.name);

    return products.filter((product) => {
      const productPrefix = getItemPrefix(product.name);
      return productPrefix === itemPrefix;
    });
  }, [selectedItem, products]);

  // Auto-select first matching product
  useEffect(() => {
    if (selectedItem && filteredProducts.length > 0) {
      setSelectedProductId(filteredProducts[0].id);
    } else {
      setSelectedProductId(null);
    }
  }, [selectedItem, filteredProducts]);

  // Reset on open/close
  useEffect(() => {
    if (!open) {
      setSelectedItemId(null);
      setSelectedProductId(null);
    }
  }, [open]);

  const handleSave = async () => {
    if (!selectedItemId || !selectedProductId || !token) return;

    setSaving(true);
    try {
      // Create variant via API - backend auto-generates idx, name, etc.
      await createVariant(
        token,
        {
          item: selectedItemId,
          parent_id: selectedProductId,
          parent_type: "ekatalog_product",
          parent_field: "variants",
        },
        items
      );

      // Trigger updates
      window.dispatchEvent(new Event("ekatalog:variants_update"));
      window.dispatchEvent(new Event("ekatalog:products_update"));

      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Error saving mapping:", err);
      alert("Terjadi error saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const canSave = selectedItemId && selectedProductId;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Tambah Variant Mapping
                </h2>
                <p className="text-red-100 text-sm">
                  Hubungkan item dengan product
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-t-3xl p-6 space-y-6">
            {/* Item Selector */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaLink className="text-gray-400" />
                Item <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedItemId || ""}
                onChange={(e) =>
                  setSelectedItemId(Number(e.target.value) || null)
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700"
              >
                <option value="">-- Pilih Item --</option>
                {unmappedItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.code})
                  </option>
                ))}
              </select>

              {/* Item preview */}
              {selectedItem && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                    {selectedItem.image ? (
                      <Image
                        width={48}
                        height={48}
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        unoptimized
                        className="object-contain w-full h-full p-1"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBox className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {selectedItem.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedItem.description || selectedItem.code}
                    </p>
                  </div>
                </motion.div>
              )}

              <p className="mt-2 text-xs text-gray-500">
                {unmappedItems.length} item belum terhubung
              </p>
            </div>

            {/* Product Selector */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FaLink className="text-red-500" />
                Product <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProductId || ""}
                onChange={(e) =>
                  setSelectedProductId(Number(e.target.value) || null)
                }
                disabled={!selectedItem}
                className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Pilih Product --</option>
                {filteredProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.itemCategory.name})
                  </option>
                ))}
              </select>

              {selectedItem && filteredProducts.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaCheck className="w-3 h-3" />
                  Menampilkan {filteredProducts.length} product yang relevan
                </motion.p>
              )}

              {selectedItem && filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg mb-2">
                    Tidak ada product yang cocok. Menampilkan semua product:
                  </p>
                  <select
                    value={selectedProductId || ""}
                    onChange={(e) =>
                      setSelectedProductId(Number(e.target.value) || null)
                    }
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-700"
                  >
                    <option value="">-- Pilih Product --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.itemCategory.name})
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </div>

            {/* Mapping Preview */}
            {selectedItem && selectedProductId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FaLink className="text-blue-600" />
                  <span className="font-semibold text-blue-900 text-sm">
                    Mapping Preview
                  </span>
                </div>
                <p className="text-sm text-blue-800">
                  <span className="font-semibold text-blue-900">
                    {selectedItem.name}
                  </span>
                  {" → "}
                  <span className="font-semibold text-blue-900">
                    {products.find((p) => p.id === selectedProductId)?.name}
                  </span>
                </p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave || saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Tambah Mapping</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
