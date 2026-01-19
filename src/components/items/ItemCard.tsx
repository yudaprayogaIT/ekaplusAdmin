// src/components/items/ItemCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaBox,
  FaBarcode,
  FaTag,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLink,
} from "react-icons/fa";
import { Item } from "./ItemList";

export default function ItemCard({
  item,
  viewMode = "grid",
  onEdit,
  onDelete,
  onView,
  selected,
  onToggleSelect,
}: {
  item: Item;
  viewMode?: "grid" | "list";
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const isUnmapped = !item.variantCount || item.variantCount === 0;

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={() => {
          if (onToggleSelect) {
            onToggleSelect();
          } else {
            onView?.();
          }
        }}
        className={`bg-white rounded-2xl shadow-sm border-2 p-6 cursor-pointer transition-all group hover:shadow-lg ${
          selected ? "border-blue-500 bg-blue-50" : "border-gray-100"
        }`}
      >
        <div className="flex items-start gap-6">
          {/* Selection Checkbox */}
          {onToggleSelect && (
            <div className="flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                  selected
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {selected && <FaCheckCircle className="w-4 h-4 text-white" />}
              </motion.div>
            </div>
          )}
          {/* Image Preview */}
          <div className="hidden md:flex w-24 h-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl overflow-hidden flex-shrink-0 items-center justify-center p-3 border-2 border-gray-100">
            {item.image && !imageError ? (
              <Image
                width={96}
                height={96}
                src={item.image}
                alt={item.name}
                unoptimized
                loading="eager"
                onError={() => setImageError(true)}
                className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <FaBox className="w-12 h-12 text-gray-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FaBarcode className="w-3 h-3" />
                    <code className="font-mono">{item.code}</code>
                  </div>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {item.uom}
                  </span>
                  {item.disabled === 1 && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                      Disabled
                    </span>
                  )}
                  {isUnmapped ? (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaExclamationTriangle className="w-2.5 h-2.5" />
                      Belum Dimapping
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaLink className="w-2.5 h-2.5" />
                      {item.variantCount} Produk
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <FaTag className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-600">{item.group}</span>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            </div>

            {/* Branch Count */}
            {/* <div className="flex items-center gap-2 mb-3">
              <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                Tersedia di {item.branches.length} cabang
              </span>
            </div> */}

            {/* Actions */}
            <div className="flex gap-2">
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
      onClick={() => {
        if (onToggleSelect) {
          onToggleSelect();
        } else {
          onView?.();
        }
      }}
      className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all group ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-100"
      }`}
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Selection Checkbox */}
        {onToggleSelect && (
          <div className="absolute top-3 left-3 z-10">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center cursor-pointer backdrop-blur-sm transition-all ${
                selected
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white/80 border-gray-300 hover:border-blue-400"
              }`}
            >
              {selected && <FaCheckCircle className="w-5 h-5 text-white" />}
            </motion.div>
          </div>
        )}
        {item.image && !imageError ? (
          <div className="relative w-full h-full p-4">
            <Image
              width={400}
              height={400}
              src={item.image}
              alt={item.name}
              unoptimized
              loading="eager"
              onError={() => setImageError(true)}
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

        {/* Category & UOM Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-gray-100 text-xs font-semibold text-gray-700">
            {item.category}
          </span>
          <span className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-semibold text-white">
            {item.uom}
          </span>
          {item.disabled === 1 && (
            <span className="px-3 py-1 bg-gray-500/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-semibold text-white">
              Disabled
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
          {item.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <FaBarcode className="w-3 h-3" />
          <code className="font-mono">{item.code}</code>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <FaTag className="w-3 h-3 text-gray-400" />
          <span className="truncate">{item.group}</span>
        </div>

        {/* Mapping Status */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          {isUnmapped ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
              <FaExclamationTriangle className="w-3 h-3 text-orange-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-orange-700">
                Belum Dimapping
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <FaLink className="w-3 h-3 text-green-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-700">
                Terdaftar di {item.variantCount} Produk
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group/btn"
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
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
          >
            <FaTrash className="w-3.5 h-3.5 text-red-600" />
            <span className="text-sm font-semibold text-red-600">Hapus</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
