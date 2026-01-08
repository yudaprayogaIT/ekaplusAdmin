// src/components/items/ItemDetailModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaBarcode,
  FaTag,
  FaCube,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBox,
} from "react-icons/fa";
import Image from "next/image";
import { Item } from "./ItemList";
import { getFileUrl, getQueryUrl, getAuthHeaders, API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

type Branch = {
  id: number;
  name: string;
};

type Variant = {
  id: number;
  idx: number;
  parent_id: number;
  product_name?: string;
};

export default function ItemDetailModal({
  open,
  onClose,
  item,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  item?: Item | null;
  onEdit?: (i: Item) => void;
  onDelete?: (i: Item) => void;
}) {
  const { token } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // Load all branches untuk display nama yang benar
  useEffect(() => {
    if (!open || !token || !item?.branches?.length) return;

    async function loadBranches() {
      if (!token) return; // Guard for async function
      setLoadingBranches(true);
      try {
        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await fetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = await res.json();
          const allBranches: Branch[] = response.data.map((b: { id: number; branch_name: string }) => ({
            id: b.id,
            name: b.branch_name,
          }));

          // Filter hanya branches yang ada di item
          if (item && item.branches) {
            const itemBranchIds = item.branches.map(b => b.id);
            const filteredBranches = allBranches.filter(b => itemBranchIds.includes(b.id));
            setBranches(filteredBranches);
          }
        }
      } catch (error) {
        console.error("Failed to load branches:", error);
      } finally {
        setLoadingBranches(false);
      }
    }

    loadBranches();
  }, [open, token, item]);

  // Load variants (products this item belongs to)
  useEffect(() => {
    if (!open || !token || !item) return;

    async function loadVariants() {
      if (!token || !item) return;
      setLoadingVariants(true);
      try {
        // Use the API structure with childs to fetch variants
        const spec = {
          fields: ["*"],
          filters: [["id", "=", item.id]],
          childs: [
            {
              alias: "variants",
              table: "ekatalog_variant",
              fields: ["*"],
              parent_key: "item",
              parent_value: "id",
            },
          ],
        };

        const itemUrl = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, spec);
        const headers = getAuthHeaders(token);

        const res = await fetch(itemUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = await res.json();
          if (response.data && response.data.length > 0) {
            const itemData = response.data[0];
            const variantsData: Variant[] = itemData.variants || [];

            // Fetch product names for each variant
            if (variantsData.length > 0) {
              const productIds = Array.from(
                new Set(variantsData.map((v: Variant) => v.parent_id))
              );

              // Load products to get their names
              const productsSpec = {
                fields: ["id", "product_name"],
                filters: [["id", "in", productIds]],
              };
              const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, productsSpec);
              const productsRes = await fetch(productsUrl, { headers });

              if (productsRes.ok) {
                const productsJson = await productsRes.json();
                const productsMap = new Map<number, string>(
                  productsJson.data.map((p: { id: number; product_name: string }) => [
                    p.id,
                    p.product_name,
                  ])
                );

                // Merge product names into variants
                const enrichedVariants: Variant[] = variantsData.map((v: Variant): Variant => {
                  const productName = productsMap.get(v.parent_id);
                  return {
                    id: v.id,
                    idx: v.idx,
                    parent_id: v.parent_id,
                    product_name: productName || `Product ${v.parent_id}`,
                  };
                });

                setVariants(enrichedVariants);
              } else {
                // Set variants without product names
                const basicVariants: Variant[] = variantsData.map((v: Variant): Variant => ({
                  id: v.id,
                  idx: v.idx,
                  parent_id: v.parent_id,
                  product_name: `Product ${v.parent_id}`,
                }));
                setVariants(basicVariants);
              }
            } else {
              setVariants([]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load variants:", error);
      } finally {
        setLoadingVariants(false);
      }
    }

    loadVariants();
  }, [open, token, item]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-8 py-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    {item.category}
                  </span>
                  <span className="px-4 py-1.5 bg-purple-500/90 backdrop-blur-sm rounded-full text-sm font-semibold">
                    {item.uom}
                  </span>
                  <span
                    className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold ${
                      item.disabled === 0 ? "bg-green-500/90" : "bg-gray-500/90"
                    }`}
                  >
                    {item.disabled === 0 ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-3">{item.name}</h2>

                <div className="flex items-center gap-2 text-lg text-red-100">
                  <FaBarcode className="w-5 h-5" />
                  <code className="font-mono">{item.code}</code>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Image Preview */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Image
                </label>
                <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg bg-gradient-to-br from-gray-50 to-white">
                  {item.image && !imageError ? (
                    <div className="w-full h-80 flex items-center justify-center p-8">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={600}
                        height={600}
                        className="object-contain w-full h-full"
                        onError={() => setImageError(true)}
                        unoptimized
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-full h-80 flex items-center justify-center">
                      <div className="text-center">
                        <FaTag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <span className="text-sm text-gray-400">
                          No image available
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Basic Info */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <FaTag className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                      Detail Info
                    </label>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-blue-700">
                        Group:
                      </span>
                      <p className="text-blue-900 font-semibold">
                        {item.group}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-blue-700">
                        Generator:
                      </span>
                      <code className="text-sm text-blue-900 bg-white px-2 py-1 rounded">
                        {item.generator_item}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                {(item.panjang ||
                  item.lebar ||
                  item.tinggi ||
                  item.diameter) && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <FaCube className="w-5 h-5 text-purple-600" />
                      <label className="text-sm font-bold text-purple-900 uppercase tracking-wide">
                        Dimensi
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {item.panjang && (
                        <div>
                          <span className="text-xs text-purple-700">
                            Panjang
                          </span>
                          <p className="text-purple-900 font-semibold">
                            {item.panjang}
                          </p>
                        </div>
                      )}
                      {item.lebar && (
                        <div>
                          <span className="text-xs text-purple-700">Lebar</span>
                          <p className="text-purple-900 font-semibold">
                            {item.lebar}
                          </p>
                        </div>
                      )}
                      {item.tinggi && (
                        <div>
                          <span className="text-xs text-purple-700">
                            Tinggi
                          </span>
                          <p className="text-purple-900 font-semibold">
                            {item.tinggi}
                          </p>
                        </div>
                      )}
                      {item.diameter && (
                        <div>
                          <span className="text-xs text-purple-700">
                            Diameter
                          </span>
                          <p className="text-purple-900 font-semibold">
                            {item.diameter}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Deskripsi
                  </label>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Branches */}
              {(branches.length > 0 || loadingBranches) && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
                    <label className="text-lg font-bold text-gray-800">
                      Tersedia di {loadingBranches ? '...' : branches.length} Cabang
                    </label>
                  </div>
                  {loadingBranches ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500">Memuat cabang...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {branches.map((branch) => (
                        <div
                          key={branch.id}
                          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200"
                        >
                          <FaCheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-green-900">{branch.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Products (Variants) - Products this item belongs to */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaBox className="w-5 h-5 text-blue-600" />
                  <label className="text-lg font-bold text-gray-800">
                    Terdaftar di Produk
                  </label>
                </div>
                {loadingVariants ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Memuat produk...</p>
                  </div>
                ) : variants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200"
                      >
                        <FaBox className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-blue-900 block truncate">
                            {variant.product_name || `Product #${variant.parent_id}`}
                          </span>
                          <span className="text-xs text-blue-700">
                            Urutan: {variant.idx}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <FaBox className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Item ini belum terdaftar di produk manapun
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(item)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                >
                  <FaEdit className="w-5 h-5" />
                  <span>Edit Item</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete?.(item)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                >
                  <FaTrash className="w-5 h-5" />
                  <span>Hapus</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
