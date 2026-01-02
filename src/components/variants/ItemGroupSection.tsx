// src/components/variants/ItemGroupSection.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaBox,
  FaCheckSquare,
  FaSquare,
} from "react-icons/fa";
import type { Item } from "@/types";

interface ItemGroupSectionProps {
  groupKey: string; // "KATEGORI SUBKATEGORI"
  items: Item[];
  selectedItemIds: Set<number>;
  onToggleItem: (itemId: number) => void;
  onSelectAllInGroup: () => void;
  viewMode: "grid" | "list";
}

export default function ItemGroupSection({
  groupKey,
  items,
  selectedItemIds,
  onToggleItem,
  onSelectAllInGroup,
  viewMode,
}: ItemGroupSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const selectedCount = items.filter((item) => selectedItemIds.has(item.id))
    .length;
  const allSelected = selectedCount === items.length;
  const someSelected = selectedCount > 0 && selectedCount < items.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Group Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {collapsed ? (
                <FaChevronDown className="w-4 h-4 text-blue-600" />
              ) : (
                <FaChevronUp className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Group Name */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900">{groupKey}</h3>
              <p className="text-sm text-blue-700 mt-0.5">
                {items.length} items
                {selectedCount > 0 && (
                  <span className="ml-2 text-blue-600 font-semibold">
                    ({selectedCount} selected)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Select All Checkbox */}
          <button
            onClick={onSelectAllInGroup}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            {allSelected ? (
              <FaCheckSquare className="w-5 h-5 text-blue-600" />
            ) : someSelected ? (
              <FaCheckSquare className="w-5 h-5 text-blue-400" />
            ) : (
              <FaSquare className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            )}
            <span className="text-sm font-semibold text-blue-900">
              {allSelected ? "Deselect All" : "Select All"}
            </span>
          </button>
        </div>
      </div>

      {/* Items Grid/List */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-4"
                }
              >
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isSelected={selectedItemIds.has(item.id)}
                    onToggle={() => onToggleItem(item.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Item Card Component with Checkbox
function ItemCard({
  item,
  isSelected,
  onToggle,
  viewMode,
}: {
  item: Item;
  isSelected: boolean;
  onToggle: () => void;
  viewMode: "grid" | "list";
}) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={onToggle}
        className={`bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all group ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
            : "border-gray-100 hover:border-blue-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0">
            {isSelected ? (
              <FaCheckSquare className="w-6 h-6 text-blue-600" />
            ) : (
              <FaSquare className="w-6 h-6 text-gray-300 group-hover:text-blue-400" />
            )}
          </div>

          {/* Image */}
          <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-lg overflow-hidden flex-shrink-0 items-center justify-center p-2 border border-gray-100">
            {item.image ? (
              <Image
                width={64}
                height={64}
                src={item.image}
                alt={item.name}
                unoptimized
                loading="eager"
                className="object-contain w-full h-full"
              />
            ) : (
              <FaBox className="w-8 h-8 text-gray-300" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {item.name}
            </h4>
            <p className="text-xs text-gray-500 mb-2 font-mono">{item.code}</p>

            <div className="flex flex-wrap gap-1.5">
              {item.color && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                  {item.color}
                </span>
              )}
              {item.type && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                  {item.type}
                </span>
              )}
              {item.uom && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                  {item.uom}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        y: -4,
        boxShadow: isSelected
          ? "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
          : "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
      }}
      onClick={onToggle}
      className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden cursor-pointer transition-all group relative ${
        isSelected
          ? "border-blue-500 shadow-lg shadow-blue-100"
          : "border-gray-100 hover:border-blue-300"
      }`}
    >
      {/* Checkbox Overlay */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className={`p-1.5 rounded-lg transition-all ${
            isSelected
              ? "bg-blue-600 shadow-lg"
              : "bg-white/90 backdrop-blur-sm shadow-md"
          }`}
        >
          {isSelected ? (
            <FaCheckSquare className="w-5 h-5 text-white" />
          ) : (
            <FaSquare className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
          )}
        </div>
      </div>

      {/* Image Container */}
      <div
        className={`relative h-40 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden ${
          isSelected ? "bg-blue-50" : ""
        }`}
      >
        {item.image ? (
          <div className="relative w-full h-full p-4">
            <Image
              width={300}
              height={300}
              src={item.image}
              alt={item.name}
              unoptimized
              loading="eager"
              className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FaBox className="w-6 h-6 text-gray-300" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-bold text-gray-900 text-sm mb-1.5 line-clamp-2 leading-snug">
          {item.name}
        </h4>

        <p className="text-xs text-gray-500 mb-3 font-mono">{item.code}</p>

        <div className="flex flex-wrap gap-1">
          {item.color && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
              {item.color}
            </span>
          )}
          {item.type && (
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
              {item.type}
            </span>
          )}
          {item.uom && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
              {item.uom}
            </span>
          )}
        </div>
      </div>

      {/* Selected Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 pointer-events-none" />
      )}
    </motion.div>
  );
}
