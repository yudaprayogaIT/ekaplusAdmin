// src/components/products/VariantSuggestions.tsx (Enhanced Version)
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLightbulb,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaFilter,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  // Extract prefix dari product name (first 3 words)
  const getPrefix = (name: string) => {
    return name.trim().split(/\s+/).slice(0, 3).join(" ").toUpperCase();
  };

  const productPrefix = getPrefix(productName);

  // Find suggested items based on prefix matching
  const suggestions = useMemo(() => {
    return items.filter((item) => {
      const itemPrefix = getPrefix(item.name);
      const alreadyAdded = currentVariants.some((v) => v.id === item.id);
      return itemPrefix === productPrefix && !alreadyAdded;
    });
  }, [items, productPrefix, currentVariants]);

  // Get unique categories from suggestions
  const uniqueCategories = useMemo(() => {
    return [...new Set(suggestions.map((item) => item.category).filter(Boolean))];
  }, [suggestions]);

  // Filter suggestions by search and category
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "" || item.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [suggestions, searchQuery, filterCategory]);

  if (suggestions.length === 0 || !productName.trim()) return null;

  const displayItems = expanded ? filteredSuggestions : filteredSuggestions.slice(0, 8);

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
          onClick={() => onSelect(filteredSuggestions)}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <FaPlus className="w-3 h-3" />
          Add all {filteredSuggestions.length}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau kode item..."
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none bg-white"
          >
            <option value="">Semua Kategori</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Count */}
      {(searchQuery || filterCategory) && (
        <div className="mb-3 text-xs text-blue-600">
          Menampilkan {filteredSuggestions.length} dari {suggestions.length} items
        </div>
      )}

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
      {filteredSuggestions.length > 8 && (
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
              Show {filteredSuggestions.length - 8} more items
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
