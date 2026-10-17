// src/components/products/ProductCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaBox,
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
  const disabledVariantCount = product.variants.filter(
    (variant) => variant.item.disabled === 1
  ).length;
  // console.log(product.variants);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onView?.()}
        className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-colors hover:bg-red-50/40"
      >
        <div className="flex items-center gap-3">
          {/* Image Preview */}
          <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-2">
            {firstVariant?.image ? (
              <Image
                width={64}
                height={64}
                src={firstVariant.image}
                alt={product.name}
                unoptimized
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <FaBox className="h-7 w-7 text-gray-300" />
            )}
            {product.isHotDeals && (
              <div className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white">
                <FaFire className="h-2.5 w-2.5" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-red-600">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="max-w-40 truncate rounded-md bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                {product.itemCategory.name}
              </span>
              <span className="rounded-md bg-purple-50 px-2 py-0.5 font-semibold text-purple-700">
                {variantCount} Varian
              </span>
              <span
                className={`rounded-md px-2 py-0.5 font-semibold ${
                  product.disabled === 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {product.disabled === 0 ? "Aktif" : "Nonaktif"}
              </span>
              {disabledVariantCount > 0 && (
                <span className="rounded-md bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
                  {disabledVariantCount} Disabled
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-shrink-0 gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              title="Edit produk"
              aria-label="Edit produk"
            >
              <FaEdit className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
              title="Hapus produk"
              aria-label="Hapus produk"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -4,
        boxShadow: "0 14px 30px -12px rgba(239, 68, 68, 0.2)",
      }}
      onClick={() => onView?.()}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all"
    >
      {/* Image Container */}
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {firstVariant?.image ? (
          <div className="relative h-full w-full p-3">
            <Image
              width={400}
              height={400}
              src={firstVariant.image}
              alt={product.name}
              unoptimized
              loading="lazy"
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 transition-colors group-hover:bg-red-50">
              <FaBox className="h-6 w-6 text-gray-300 transition-colors group-hover:text-red-300" />
            </div>
          </div>
        )}

        {/* Status Badge - Top Left */}
        <div className="absolute left-2 top-2">
          <div
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm ${
              product.disabled === 0
                ? "bg-emerald-500/90"
                : "bg-gray-500/90"
            }`}
          >
            {product.disabled === 0 ? "Aktif" : "Nonaktif"}
          </div>
        </div>

        {/* Badges - Top Right */}
        <div className="absolute right-2 top-2 flex max-w-[65%] flex-col items-end gap-1">
          {product.isHotDeals && (
            <div className="flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <FaFire className="h-2.5 w-2.5" />
              <span>HOT</span>
            </div>
          )}
          <div className="max-w-full rounded-full border border-gray-100 bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            <span className="block truncate">
              {product.itemCategory.name}
            </span>
          </div>
        </div>

        {/* Variant Count Badge - Bottom Left */}
        <div className="absolute bottom-2 left-2">
          <div className="flex items-center gap-1 rounded-full bg-purple-500/90 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            <FaLayerGroup className="h-2.5 w-2.5" />
            <span>{variantCount} Varian</span>
          </div>
        </div>

        {disabledVariantCount > 0 && (
          <div className="absolute bottom-2 right-2 rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 shadow-sm">
            {disabledVariantCount} Disabled
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-tight text-gray-900 transition-colors group-hover:text-red-600">
          {product.name}
        </h3>

        {firstVariant?.description && (
          <p className="mb-2 line-clamp-1 text-xs text-gray-500">
            {firstVariant.description}
          </p>
        )}

        {/* Actions */}
        <div className="mt-2 flex gap-1.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="group/btn flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2 py-1.5 transition-all hover:border-red-300 hover:bg-red-50"
          >
            <FaEdit className="h-3 w-3 text-gray-600 transition-colors group-hover/btn:text-red-600" />
            <span className="text-xs font-semibold text-gray-700 transition-colors group-hover/btn:text-red-600">
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
            className="flex items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-2 py-1.5 transition-all hover:border-red-200 hover:bg-red-100"
          >
            <FaTrash className="h-3 w-3 text-red-600" />
            <span className="text-xs font-semibold text-red-600">Hapus</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
