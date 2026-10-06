// src/components/items/ItemCard.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBarcode,
  FaBox,
  FaCheck,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLink,
  FaTag,
} from "react-icons/fa";
import { Item } from "./ItemList";

type ItemCardProps = {
  item: Item;
  viewMode?: "grid" | "list";
  onView?: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
};

export default function ItemCard({
  item,
  viewMode = "grid",
  onView,
  selected,
  onToggleSelect,
}: ItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const isUnmapped = !item.variantCount || item.variantCount === 0;

  const handleClick = () => {
    if (onToggleSelect) onToggleSelect();
    else onView?.();
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleClick}
        className={`grid min-w-[920px] cursor-pointer grid-cols-[minmax(260px,2fr)_110px_minmax(150px,1fr)_minmax(190px,1.2fr)_minmax(180px,1fr)] items-center gap-4 border-t px-4 py-3 text-sm transition-colors first:border-t-0 hover:bg-red-50/60 ${
          selected
            ? "border-blue-100 bg-blue-50"
            : "border-gray-100 bg-white"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {onToggleSelect && (
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                selected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-transparent"
              }`}
            >
              <FaCheck className="h-2.5 w-2.5" />
            </span>
          )}
          <span
            className="truncate font-semibold text-gray-900"
            title={item.name}
          >
            {item.name}
          </span>
        </div>

        <div>
          <span
            className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
              item.disabled === 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.disabled === 0 ? "Aktif" : "Nonaktif"}
          </span>
        </div>
        <span className="truncate text-gray-600" title={item.category || "-"}>
          {item.category || "-"}
        </span>
        <span className="truncate text-gray-600" title={item.group || "-"}>
          {item.group || "-"}
        </span>
        <code
          className="truncate font-mono text-xs text-gray-500"
          title={item.code}
        >
          {item.code}
        </code>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 14px 30px -12px rgba(239,68,68,.2)" }}
      onClick={handleClick}
      className={`group cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-100"
      }`}
    >
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {onToggleSelect && (
          <div className="absolute left-2 top-2 z-10">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 backdrop-blur-sm transition-all ${
                selected
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300 bg-white/80"
              }`}
            >
              {selected && <FaCheckCircle className="h-5 w-5 text-white" />}
            </span>
          </div>
        )}

        {item.image && !imageError ? (
          <div className="relative h-full w-full p-3">
            <Image
              width={400}
              height={400}
              src={item.image}
              alt={item.name}
              unoptimized
              loading="lazy"
              onError={() => setImageError(true)}
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

        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <span className="rounded-full border border-gray-100 bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
            {item.category || "-"}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm ${
              item.disabled === 0 ? "bg-emerald-500/90" : "bg-red-500/90"
            }`}
          >
            {item.disabled === 0 ? "Aktif" : "Nonaktif"}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-tight text-gray-900 transition-colors group-hover:text-red-600">
          {item.name}
        </h3>
        <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
          <FaBarcode className="h-3 w-3" />
          <code className="truncate font-mono">{item.code}</code>
        </div>
        <div className="mb-2 flex items-center gap-2 text-xs text-gray-600">
          <FaTag className="h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate">{item.group || "-"}</span>
        </div>

        {isUnmapped ? (
          <div className="flex items-center gap-2 rounded-md bg-orange-50 px-2 py-1">
            <FaExclamationTriangle className="h-3 w-3 shrink-0 text-orange-600" />
            <span className="text-xs font-semibold text-orange-700">
              Belum Dimapping
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-md bg-green-50 px-2 py-1">
            <FaLink className="h-3 w-3 shrink-0 text-green-600" />
            <span className="truncate text-xs font-semibold text-green-700">
              Terdaftar di {item.variantCount} Produk
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
