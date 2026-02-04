// src/components/categories/CategoryCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaBox, FaTag } from "react-icons/fa";
import { Category } from "./CategoryList";
import { getFileUrl } from "@/config/api";

export default function CategoryCard({
  category,
  viewMode = "grid",
  onEdit,
  onDelete,
  onView,
}: {
  category: Category;
  viewMode?: "grid" | "list";
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = getFileUrl(category.icon || category.image);

  // Reset error when type changes
  useEffect(() => {
    setImageError(false);
  }, [category.image, category.icon]);
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
          {/* Icon/Image Preview */}
          <div className="hidden md:flex w-24 h-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-xl overflow-hidden flex-shrink-0 items-center justify-center p-4 border-2 border-gray-100">
            {imageSrc && !imageError ? (
              <Image
                width={96}
                height={96}
                src={imageSrc}
                alt={category.name}
                unoptimized
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
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                  {category.category_name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <FaTag className="w-3.5 h-3.5 text-gray-400" />
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {category.type.name}
                  </span>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {category.description}
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
        {imageSrc && !imageError ? (
          <div className="relative w-full h-full p-6">
            <Image
              width={400}
              height={400}
              src={imageSrc}
              alt={category.name}
              unoptimized
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

        {/* Type Badge */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-gray-100">
            <span className="text-xs font-semibold text-gray-700">
              {category.type.name}
            </span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
          {category.category_name}
        </h3>

        {category.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {category.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
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
