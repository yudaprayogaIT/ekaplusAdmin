// src/components/wishlist/WishlistCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaTrash, FaBox, FaHeart } from "react-icons/fa";
import Image from "next/image";
import type { WishlistItem } from "@/types";

type WishlistCardProps = {
  wishlistItem: WishlistItem;
  onRemove: () => void;
  onView?: () => void;
  viewMode?: "grid" | "list";
};

export default function WishlistCard({
  wishlistItem,
  onRemove,
  onView,
  viewMode = "grid",
}: WishlistCardProps) {
  const { item, createdAt, userName } = wishlistItem;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={onView}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                className="object-contain w-full h-full p-2"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaBox className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 mb-1 truncate">
              {item.name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                {item.code}
              </span>
              {item.type && (
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                  {item.type}
                </span>
              )}
              {item.category && (
                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium">
                  {item.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">
                Ditambahkan: {formattedDate}
              </p>
              {userName && (
                <>
                  <span className="text-xs text-gray-300">•</span>
                  <p className="text-xs text-gray-500">oleh {userName}</p>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Hapus dari wishlist"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onView}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden border-b border-gray-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaBox className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Wishlist Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
            <FaHeart className="w-4 h-4" />
          </div>
        </div>

        {/* Delete Button (shows on hover) */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full shadow-lg hover:bg-red-50 transition-all"
            title="Hapus dari wishlist"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[48px]">
          {item.name}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
            {item.code}
          </span>
          {item.type && (
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
              {item.type}
            </span>
          )}
        </div>

        {item.category && (
          <div className="mb-2">
            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium">
              {item.category}
            </span>
          </div>
        )}

        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">{formattedDate}</span>
          <span className="text-xs font-medium text-gray-600">{item.uom}</span>
        </div>
      </div>
    </motion.div>
  );
}
