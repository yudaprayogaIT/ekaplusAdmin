// src/components/products/AddProductModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlus, FaTrash, FaFire, FaLayerGroup, FaImage } from "react-icons/fa";
import ItemSelector from "./ItemSelector";
import Image from "next/image";

type Item = {
  id: number;
  code: string;
  name: string;
  color: string;
  type: string;
  image?: string;
  description?: string;
};

type Category = {
  id: number;
  name: string;
};

type Product = {
  id?: number;
  name: string;
  itemCategory: {
    id: number;
    name: string;
  };
  variants: Item[];
  disabled: number;
  isHotDeals: boolean;
};

const SNAP_KEY = "ekatalog_products_snapshot";

export default function AddProductModal({
  open,
  onClose,
  initial,
  categories,
  availableItems,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Product | null;
  categories: Category[];
  availableItems: Item[];
}) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [variants, setVariants] = useState<Item[]>([]);
  const [isHotDeals, setIsHotDeals] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setCategoryId(initial.itemCategory?.id ?? 1);
      setVariants(initial.variants ?? []);
      setIsHotDeals(initial.isHotDeals ?? false);
    } else {
      setName("");
      setCategoryId(categories[0]?.id ?? 1);
      setVariants([]);
      setIsHotDeals(false);
    }
  }, [initial, open, categories]);

  const handleSelectVariants = (selectedItems: Item[]) => {
    setVariants(selectedItems);
  };

  const removeVariant = (id: number) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    
    if (variants.length === 0) {
      alert("Minimal harus ada 1 varian!");
      return;
    }

    setSaving(true);

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const payload = {
      name: name.trim(),
      itemCategory: {
        id: categoryId,
        name: selectedCategory?.name || "",
      },
      variants: variants,
      disabled: 0,
      isHotDeals: isHotDeals,
    };

    try {
      const raw = localStorage.getItem(SNAP_KEY);
      let list: Product[] = raw ? JSON.parse(raw) : [];

      if (initial && initial.id) {
        list = list.map((p) =>
          p.id === initial.id ? { ...p, ...payload, id: initial.id } : p
        );
      } else {
        const maxId = list.reduce(
          (m: number, it: Product) => Math.max(m, Number(it.id) || 0),
          0
        );
        const newProduct: Product = {
          id: maxId + 1,
          ...payload,
        };
        list.push(newProduct);
      }

      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekatalog:products_update"));
    } catch (error) {
      console.error("Failed to save product:", error);
    }

    setSaving(false);
    onClose();
  }

  const selectedVariantIds = variants.map((v) => v.id);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {initial ? "Edit Produk" : "Tambah Produk Baru"}
                    </h3>
                    <p className="text-red-100 text-sm">
                      {initial
                        ? "Perbarui informasi produk"
                        : "Lengkapi form untuk menambahkan produk"}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={submit}
                className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto"
              >
                {/* Name & Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="Contoh: ACC Bed Baut Sakura"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Hot Deals Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isHotDeals}
                        onChange={(e) => setIsHotDeals(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-red-500 transition-all"></div>
                      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 shadow-sm"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaFire
                        className={`w-5 h-5 ${
                          isHotDeals ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <span className="font-semibold text-gray-700">
                        Hot Deals
                      </span>
                    </div>
                  </label>
                </div>

                {/* Variants Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Varian Produk <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setSelectorOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                    >
                      <FaPlus className="w-3.5 h-3.5" />
                      <span>Pilih Varian</span>
                    </button>
                  </div>

                  {/* Variants List */}
                  {variants.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <FaLayerGroup className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium mb-2">
                        Belum ada varian dipilih
                      </p>
                      <p className="text-sm text-gray-400">
                        Klik &quot;Pilih Varian&quot; untuk menambahkan item
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <FaLayerGroup className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          {variants.length} Varian
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                        {variants.map((variant, idx) => (
                          <motion.div
                            key={variant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 group hover:border-red-300 hover:bg-red-50 transition-all"
                          >
                            {/* Image */}
                            <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                              {variant.image ? (
                                <Image
                                  width={64}
                                  height={64}
                                  src={variant.image}
                                  alt={variant.name}
                                  className="object-contain w-full h-full p-2"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FaImage className="w-6 h-6 text-gray-300" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                                {variant.name}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2">
                                {variant.code}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {variant.color && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                    {variant.color}
                                  </span>
                                )}
                                {variant.type && (
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                    {variant.type}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>{initial ? "Simpan Perubahan" : "Tambah Produk"}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Selector Modal */}
      <ItemSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleSelectVariants}
        selectedIds={selectedVariantIds}
        availableItems={availableItems}
      />
    </>
  );
}