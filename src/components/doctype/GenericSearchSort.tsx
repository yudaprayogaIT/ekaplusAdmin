// src/components/doctype/GenericSearchSort.tsx
/**
 * Generic Search and Sort Component
 *
 * Renders search bar, sort dropdown, and view mode toggle.
 */

import React from "react";
import {
  FaSearch,
  FaSortAmountDown,
  FaList,
  FaTh,
} from "react-icons/fa";
import type { DocTypeConfig, SortConfig, ViewMode } from "@/lib/doctype/types";

export interface GenericSearchSortProps<T extends Record<string, unknown>> {
  /** DocType configuration */
  config: DocTypeConfig<T>;

  /** Search query */
  searchQuery: string;

  /** Search query change handler */
  onSearchChange: (query: string) => void;

  /** Active sort configuration */
  sortBy: SortConfig<T> | null;

  /** Sort change handler */
  onSortChange: (sort: SortConfig<T>) => void;

  /** Current view mode */
  viewMode: ViewMode;

  /** View mode change handler */
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Generic Search and Sort Component
 */
export function GenericSearchSort<T extends Record<string, unknown>>({
  config,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: GenericSearchSortProps<T>) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        {config.showSearch !== false && (
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={`Search ${config.labelPlural.toLowerCase()}...`}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        {/* Sort Dropdown */}
        {config.showSort !== false && config.sortOptions && config.sortOptions.length > 0 && (
          <div className="relative">
            <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={sortBy ? `${String(sortBy.field)}-${sortBy.direction}` : ""}
              onChange={(e) => {
                const option = config.sortOptions?.find(
                  (opt) => `${String(opt.field)}-${opt.direction}` === e.target.value
                );
                if (option) {
                  onSortChange(option);
                }
              }}
              className="pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
            >
              {config.sortOptions.map((option, index) => (
                <option
                  key={index}
                  value={`${String(option.field)}-${option.direction}`}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* View Mode Toggle */}
        {config.showViewModeToggle !== false && (
          <div className="flex gap-2">
            <button
              onClick={() => onViewModeChange("grid")}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaTh className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaList className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
