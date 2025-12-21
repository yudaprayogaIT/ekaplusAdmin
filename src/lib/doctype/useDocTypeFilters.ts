// src/lib/doctype/useDocTypeFilters.ts
/**
 * Generic hook for managing filters, search, and sorting
 *
 * Provides stateful management of search queries, active filters, and sort options.
 * Returns filtered and sorted items based on the current state.
 *
 * @example
 * ```typescript
 * const {
 *   searchQuery, setSearchQuery,
 *   activeFilters, setFilter, resetFilters,
 *   sortBy, setSortBy,
 *   filteredItems, sortedItems
 * } = useDocTypeFilters(items, branchConfig)
 * ```
 */

import { useState, useMemo } from "react";
import type { DocTypeConfig, SortConfig } from "./types";

/**
 * Hook return type
 */
export interface UseDocTypeFiltersReturn<T> {
  /** Current search query */
  searchQuery: string;

  /** Set search query */
  setSearchQuery: (query: string) => void;

  /** Active filters as key-value pairs */
  activeFilters: Record<string, unknown>;

  /** Set a specific filter value */
  setFilter: (filterName: string, value: unknown) => void;

  /** Reset all filters to defaults */
  resetFilters: () => void;

  /** Current sort configuration */
  sortBy: SortConfig<T> | null;

  /** Set sort configuration */
  setSortBy: (sort: SortConfig<T> | null) => void;

  /** Items after applying search and filters */
  filteredItems: T[];

  /** Items after applying search, filters, and sorting */
  sortedItems: T[];

  /** Whether any filters are active */
  hasActiveFilters: boolean;
}

/**
 * Generic hook for managing filters, search, and sorting
 *
 * @template T The type of the doctype
 * @param items Array of items to filter/sort
 * @param config DocType configuration
 * @returns Filter/sort state and filtered/sorted items
 */
export function useDocTypeFilters<T extends Record<string, unknown>>(
  items: T[],
  config: DocTypeConfig<T>
): UseDocTypeFiltersReturn<T> {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, unknown>>(
    config.defaultFilters || {}
  );

  // Sort state
  const [sortBy, setSortBy] = useState<SortConfig<T> | null>(
    config.defaultSort || null
  );

  /**
   * Set a specific filter value
   */
  const setFilter = (filterName: string, value: unknown) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  /**
   * Reset all filters to defaults
   */
  const resetFilters = () => {
    setActiveFilters(config.defaultFilters || {});
    setSearchQuery("");
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== "" || Object.keys(activeFilters).length > 0;
  }, [searchQuery, activeFilters]);

  /**
   * Apply search filter
   */
  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();

    // Use searchFields from config if specified
    const fieldsToSearch = config.searchFields || config.listFields;

    return items.filter((item) => {
      return fieldsToSearch.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;

        return String(value).toLowerCase().includes(query);
      });
    });
  }, [items, searchQuery, config.searchFields, config.listFields]);

  /**
   * Apply custom filters
   */
  const filteredItems = useMemo(() => {
    if (!config.filters || Object.keys(activeFilters).length === 0) {
      return searchedItems;
    }

    return searchedItems.filter((item) => {
      // Check each active filter
      return Object.entries(activeFilters).every(([filterName, filterValue]) => {
        // Skip if filter value is null/undefined (means "all" or unset)
        if (filterValue === null || filterValue === undefined) {
          return true;
        }

        // Find filter config
        const filterConfig = config.filters?.find((f) => f.name === filterName);
        if (!filterConfig) {
          return true; // Unknown filter, don't filter
        }

        // Use custom filter function if provided
        if (filterConfig.filterFn) {
          return filterConfig.filterFn(item, filterValue);
        }

        // Default filter logic - exact match on the field
        const itemValue = item[filterConfig.field];

        // Handle array filter values (multiselect)
        if (Array.isArray(filterValue)) {
          return filterValue.length === 0 || filterValue.includes(itemValue);
        }

        // Exact match
        return itemValue === filterValue;
      });
    });
  }, [searchedItems, activeFilters, config.filters]);

  /**
   * Apply sorting
   */
  const sortedItems = useMemo(() => {
    if (!sortBy) {
      return filteredItems;
    }

    const sorted = [...filteredItems];

    // Use custom sort function if provided
    if (sortBy.sortFn) {
      return sorted.sort((a, b) => sortBy.sortFn!(a, b, sortBy.direction));
    }

    // Default sort logic
    return sorted.sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];

      // Handle null/undefined
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare based on type
      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        // Fallback to string comparison
        comparison = String(aValue).localeCompare(String(bValue));
      }

      // Apply direction
      return sortBy.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredItems, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilter,
    resetFilters,
    sortBy,
    setSortBy,
    filteredItems,
    sortedItems,
    hasActiveFilters,
  };
}
