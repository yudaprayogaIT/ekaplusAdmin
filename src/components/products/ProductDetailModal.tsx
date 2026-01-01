// src/components/products/ProductDetailModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaTag,
  FaFire,
  FaLayerGroup,
  FaImage,
  FaBox,
  FaUser,
  FaClock,
  FaHistory,
} from "react-icons/fa";
import Image from "next/image";
import type { Product } from "@/types";

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onEdit?: (p: Product) => void;
  onDelete?: (p: Product) => void;
}

export default function ProductDetailModal({
  open,
  onClose,
  product,
  onEdit,
  onDelete,
}: ProductDetailModalProps) {
  if (!product) return null;

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
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <FaTag className="w-3.5 h-3.5" />
                    <span className="text-sm font-semibold">
                      {product.itemCategory.name}
                    </span>
                  </div>
                  {product.isHotDeals && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-red-700 rounded-full">
                      <FaFire className="w-3.5 h-3.5" />
                      <span className="text-sm font-bold">HOT DEALS</span>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 rounded-full">
                    <FaLayerGroup className="w-3.5 h-3.5" />
                    <span className="text-sm font-bold">
                      {product.variants.length} Varian
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-3">{product.name}</h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Variants Section */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FaLayerGroup className="w-5 h-5 text-purple-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Varian Produk
                  </h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {product.variants.length} items
                  </span>
                </div>

                {product.variants.length === 0 ? (
                  <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                    <FaBox className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      Tidak ada varian
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.variants.map((variant, idx) => (
                      <motion.div
                        key={variant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border-2 border-gray-100 hover:border-red-200 hover:shadow-lg transition-all group"
                      >
                        <div className="flex gap-4">
                          {/* Image */}
                          <div className="w-24 h-24 bg-white rounded-xl flex-shrink-0 overflow-hidden border-2 border-gray-200 group-hover:border-red-300 transition-all">
                            {variant.item.image ? (
                              <Image
                                width={96}
                                height={96}
                                src={variant.item.image}
                                alt={variant.item.name}
                                unoptimized
                                className="object-contain w-full h-full p-2 group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaImage className="w-8 h-8 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                              {variant.item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mb-3 font-mono">
                              {variant.item.code}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {variant.item.color && (
                                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                                  {variant.item.color}
                                </span>
                              )}
                              {variant.item.type && (
                                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                                  {variant.item.type}
                                </span>
                              )}
                              {variant.item.uom && (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                                  {variant.item.uom}
                                </span>
                              )}
                            </div>
                            {variant.item.description && (
                              <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                                {variant.item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Catatan Aktivitas Section */}
              {(product.created_at || product.updated_at) && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FaHistory className="w-5 h-5 text-blue-500" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Catatan Aktivitas
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created Info */}
                    {product.created_at && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                            <FaUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Created
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {product.created_by
                                ? typeof product.created_by === "string"
                                  ? product.created_by
                                  : `User #${product.created_by}`
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-green-500" />
                          <p className="text-sm">
                            {new Date(product.created_at).toLocaleString(
                              "id-ID",
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Updated Info */}
                    {product.updated_at && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <FaEdit className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Last Updated
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {product.updated_by
                                ? typeof product.updated_by === "string"
                                  ? product.updated_by
                                  : `User #${product.updated_by}`
                                : "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-blue-500" />
                          <p className="text-sm">
                            {new Date(product.updated_at).toLocaleString(
                              "id-ID",
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Owner Info (if different from creator) */}
                  {product.owner && product.owner !== product.created_by && (
                    <div className="mt-4 bg-gradient-to-r from-purple-50 to-white rounded-xl p-4 border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Owner
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {typeof product.owner === "string"
                              ? product.owner
                              : `User #${product.owner}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-8 mt-8 border-t-2 border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(product)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                >
                  <FaEdit className="w-5 h-5" />
                  <span>Edit Produk</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete?.(product)}
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
