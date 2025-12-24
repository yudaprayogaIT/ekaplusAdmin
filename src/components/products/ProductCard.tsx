// src/components/products/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaBox,
  FaTag,
  FaFire,
  FaLayerGroup,
} from "react-icons/fa";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export default function ProductCard({
  product,
  viewMode = "grid",
  onEdit,
  onDelete,
  onView,
}: ProductCardProps) {
  const firstVariant = product.variants[0]?.item;
  const variantCount = product.variants.length;
  // console.log(product.variants);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={() => onView?.()}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 cursor-pointer transition-all group hover:shadow-lg"
      >
        <div className="flex items-start gap-6">
          {/* Image Preview */}
          <div className="hidden md:flex w-24 h-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl overflow-hidden flex-shrink-0 items-center justify-center p-4 border-2 border-gray-100 relative">
            {firstVariant?.image ? (
              <Image
                width={96}
                height={96}
                src={firstVariant.image}
                alt={product.name}
                unoptimized
                className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <FaBox className="w-12 h-12 text-gray-300" />
            )}
            {product.isHotDeals && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full">
                <FaFire className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>
                  {product.isHotDeals && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaFire className="w-3 h-3" />
                      HOT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <FaTag className="w-3.5 h-3.5 text-gray-400" />
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {product.itemCategory.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaLayerGroup className="w-3.5 h-3.5 text-gray-400" />
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                      {variantCount} Varian
                    </span>
                  </div>
                </div>
                {firstVariant?.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {firstVariant.description}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all text-sm font-medium"
              >
                <FaEdit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-all text-sm font-medium text-red-600"
              >
                <FaTrash className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.15)",
      }}
      onClick={() => onView?.()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Image Container */}
      <div className="relative h-52 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        {firstVariant?.image ? (
          <div className="relative w-full h-full p-6">
            <Image
              width={400}
              height={400}
              src={firstVariant.image}
              alt={product.name}
              unoptimized
              className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-red-50 transition-colors">
              <FaBox className="w-8 h-8 text-gray-300 group-hover:text-red-300 transition-colors" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.isHotDeals && (
            <div className="px-3 py-1.5 bg-red-500 text-white rounded-full shadow-lg flex items-center gap-1.5">
              <FaFire className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">HOT DEALS</span>
            </div>
          )}
          <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
            <span className="text-xs font-semibold text-gray-700">
              {product.itemCategory.name}
            </span>
          </div>
        </div>

        {/* Variant Count Badge */}
        <div className="absolute bottom-4 left-4">
          <div className="px-3 py-1.5 bg-purple-500 text-white rounded-full shadow-lg flex items-center gap-1.5">
            <FaLayerGroup className="w-3.5 h-3.5" />
            <span className="text-xs font-bold">{variantCount} Varian</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
          {product.name}
        </h3>

        {firstVariant?.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {firstVariant.description}
          </p>
        )}

        {/* Variant Preview */}
        {variantCount > 1 && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-medium">Varian:</span>
              <span className="line-clamp-1">
                {/* {product.variants.slice(0, 2).map((v, i) => (
                  <span key={v.id}>
                    {v.item.color || v.item.type}
                    {i < Math.min(variantCount - 1, 1) && ", "}
                  </span>
                ))} */}
                {variantCount}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group/btn"
          >
            <FaEdit className="w-3.5 h-3.5 text-gray-600 group-hover/btn:text-red-600 transition-colors" />
            <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-red-600 transition-colors">
              Edit
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
          >
            <FaTrash className="w-3.5 h-3.5 text-red-600" />
            <span className="text-sm font-semibold text-red-600">Hapus</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
