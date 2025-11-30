// src/components/variants/VariantCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTrash, FaBox, FaLink } from "react-icons/fa";

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

type Variant = {
  id: number;
  item: Item;
  productid: number;
};

type Product = {
  id: number;
  name: string;
};

export default function VariantCard({
  variant,
  product,
  viewMode = "grid",
  onDelete,
  onView,
}: {
  variant: Variant;
  product?: Product;
  viewMode?: "grid" | "list";
  onDelete?: () => void;
  onView?: () => void;
}) {
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
          <div className="hidden md:flex w-20 h-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl overflow-hidden flex-shrink-0 items-center justify-center p-3 border-2 border-gray-100">
            {variant.item.image ? (
              <Image
                width={80}
                height={80}
                src={variant.item.image}
                alt={variant.item.name}
                className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <FaBox className="w-10 h-10 text-gray-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
                  {variant.item.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 font-mono">
                  {variant.item.code}
                </p>

                {/* Product Link */}
                {product && (
                  <div className="flex items-center gap-2 mb-2">
                    <FaLink className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">
                      {product.name}
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
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
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
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
      <div className="relative h-48 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        {variant.item.image ? (
          <div className="relative w-full h-full p-6">
            <Image
              width={400}
              height={400}
              src={variant.item.image}
              alt={variant.item.name}
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

        {/* Product Badge */}
        {product && (
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 bg-blue-500 text-white rounded-full shadow-lg flex items-center gap-1.5">
              <FaLink className="w-3 h-3" />
              <span className="text-xs font-bold truncate max-w-[120px]">{product.name}</span>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
          {variant.item.name}
        </h3>

        <p className="text-xs text-gray-500 mb-3 font-mono">
          {variant.item.code}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {variant.item.color && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
              {variant.item.color}
            </span>
          )}
          {variant.item.type && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
              {variant.item.type}
            </span>
          )}
          {variant.item.uom && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
              {variant.item.uom}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
          >
            <FaTrash className="w-3.5 h-3.5 text-red-600" />
            <span className="text-sm font-semibold text-red-600">Hapus Mapping</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}