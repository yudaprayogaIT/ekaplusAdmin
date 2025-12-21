// src/components/doctype/GenericFilters.tsx
/**
 * Generic Filters Component
 *
 * Renders filter UI based on FilterConfig from DocTypeConfig.
 * Supports select, toggle, and multi-select filter types.
 */

import React from "react";
import { FaFilter } from "react-icons/fa";
import type { DocTypeConfig } from "@/lib/doctype/types";

export interface GenericFiltersProps<T extends Record<string, unknown>> {
  /** DocType configuration */
  config: DocTypeConfig<T>;

  /** Active filter values */
  activeFilters: Record<string, unknown>;

  /** Filter change handler */
  onFilterChange: (filterName: string, value: unknown) => void;

  /** Reset filters handler */
  onReset?: () => void;
}

/**
 * Generic Filters Component
 */
export function GenericFilters<T extends Record<string, unknown>>({
  config,
  activeFilters,
  onFilterChange,
  onReset,
}: GenericFiltersProps<T>) {
  if (!config.filters || config.filters.length === 0 || config.showFilters === false) {
    return null;
  }

  const hasActiveFilters = Object.values(activeFilters).some(
    (v) => v !== null && v !== undefined
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FaFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />

      {config.filters.map((filter) => {
        const Icon = filter.icon;
        const activeValue = activeFilters[filter.name];

        if (filter.type === "select") {
          return (
            <div key={filter.name} className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4 text-gray-400" />}
              {filter.options?.map((option) => (
                <button
                  key={String(option.value)}
                  onClick={() => onFilterChange(filter.name, option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeValue === option.value
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          );
        }

        if (filter.type === "toggle") {
          return (
            <div key={filter.name} className="flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4 text-gray-400" />}
              <button
                onClick={() =>
                  onFilterChange(
                    filter.name,
                    activeValue ? null : filter.options?.[0]?.value
                  )
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeValue
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            </div>
          );
        }

        return null;
      })}

      {/* Reset button */}
      {hasActiveFilters && onReset && (
        <>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button
            onClick={onReset}
            className="px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap bg-orange-100 text-orange-700 hover:bg-orange-200 border-2 border-orange-300 flex items-center gap-2"
          >
            <span className="text-lg">×</span>
            <span>Reset</span>
          </button>
        </>
      )}
    </div>
  );
}
