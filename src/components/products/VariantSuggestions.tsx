// src/components/products/VariantSuggestions.tsx (Enhanced Version)
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLightbulb,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Image from "next/image";
import type { Item } from "@/types";

export function VariantSuggestions({
  productName,
  items,
  currentVariants,
  onSelect,
}: {
  productName: string;
  items: Item[];
  currentVariants: Item[];
  onSelect: (items: Item[]) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  // Extract prefix dari product name (first 2 words)
  const getPrefix = (name: string) => {
    return name.trim().split(/\s+/).slice(0, 2).join(" ").toUpperCase();
  };

  const productPrefix = getPrefix(productName);

  // Find suggested items based on prefix matching
  const suggestions = items.filter((item) => {
    const itemPrefix = getPrefix(item.name);
    const alreadyAdded = currentVariants.some((v) => v.id === item.id);
    return itemPrefix === productPrefix && !alreadyAdded;
  });

  if (suggestions.length === 0 || !productName.trim()) return null;

  const displayItems = expanded ? suggestions : suggestions.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-blue-900 flex items-center gap-2">
            <FaLightbulb className="text-yellow-500 animate-pulse" />
            Smart Suggestions
          </h4>
          <p className="text-sm text-blue-700 mt-1">
            {suggestions.length} items match prefix &quot;{productPrefix}&quot;
          </p>
        </div>
        <button
          onClick={() => onSelect(suggestions)}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <FaPlus className="w-3 h-3" />
          Add all {suggestions.length}
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelect([item])}
            >
              <div className="w-full h-20 bg-gray-100 rounded mb-2 overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <Image
                    width={80}
                    height={80}
                    src={item.image}
                    alt={item.name}
                    unoptimized
                    className="object-contain w-full h-full p-1"
                  />
                ) : (
                  <div className="text-gray-300 text-2xl">📦</div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-800 truncate mb-1">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 truncate font-mono">
                {item.code}
              </p>
              {(item.color || item.type) && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.color && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
                      {item.color}
                    </span>
                  )}
                  {item.type && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px]">
                      {item.type}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expand/Collapse Button */}
      {suggestions.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 hover:bg-blue-100 rounded-lg transition-colors"
        >
          {expanded ? (
            <>
              <FaChevronUp className="w-3 h-3" />
              Show less
            </>
          ) : (
            <>
              <FaChevronDown className="w-3 h-3" />
              Show {suggestions.length - 3} more items
            </>
          )}
        </button>
      )}

      {/* Helper Text */}
      <p className="text-xs text-blue-600 mt-3 flex items-center gap-1">
        💡 <span>Click individual items to add one by one</span>
      </p>
    </motion.div>
  );
}
