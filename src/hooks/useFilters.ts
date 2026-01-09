// src/hooks/useFilters.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { FilterTriple } from "@/types/filter";
import {
  urlParamToFilters,
  filtersToUrlParam,
  saveFiltersToStorage,
  loadFiltersFromStorage,
} from "@/utils/filterUtils";

interface UseFiltersOptions {
  entity: string; // Entity name for localStorage key
  onFiltersChange?: (filters: FilterTriple[]) => void; // Optional callback when filters change
  initialFilters?: FilterTriple[]; // Optional initial filters (e.g., from URL params)
}

interface UseFiltersReturn {
  filters: FilterTriple[];
  setFilters: (filters: FilterTriple[]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Custom hook to manage filter state with URL params and localStorage persistence
 *
 * Priority: URL params > localStorage
 *
 * @param options - Configuration options
 * @returns Filter state and methods
 */
export function useFilters(options: UseFiltersOptions): UseFiltersReturn {
  const { entity, onFiltersChange, initialFilters } = options;
  const [filters, setFiltersInternal] = useState<FilterTriple[]>([]);
  const [initialized, setInitialized] = useState(false);
  const onFiltersChangeRef = useRef(onFiltersChange);

  // Update ref when callback changes
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  // Initialize filters from initialFilters, URL params, or localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined" || initialized) return;

    let loadedFilters: FilterTriple[] = [];

    if (initialFilters && initialFilters.length > 0) {
      // Use provided initialFilters (highest priority, e.g., from URL sync)
      loadedFilters = initialFilters;
    } else {
      // Check URL params (legacy support)
      const urlParams = new URLSearchParams(window.location.search);
      const filterParam = urlParams.get("filters");

      if (filterParam) {
        // Load from URL params
        loadedFilters = urlParamToFilters(filterParam);
      } else {
        // Load from localStorage (fallback)
        loadedFilters = loadFiltersFromStorage(entity);
      }
    }

    setFiltersInternal(loadedFilters);
    setInitialized(true);

    // DON'T call onFiltersChange here to avoid infinite loop
    // onFiltersChange should only be called when user explicitly applies filters
  }, [entity, initialized, initialFilters]);

  // Update URL params when filters change
  const setFilters = useCallback(
    (newFilters: FilterTriple[]) => {
      setFiltersInternal(newFilters);

      // Save to localStorage
      saveFiltersToStorage(entity, newFilters);

      // Update URL params
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (newFilters.length > 0) {
          url.searchParams.set("filters", filtersToUrlParam(newFilters));
        } else {
          url.searchParams.delete("filters");
        }
        window.history.replaceState({}, "", url.toString());
      }

      // Call onFiltersChange callback using ref
      if (onFiltersChangeRef.current) {
        onFiltersChangeRef.current(newFilters);
      }
    },
    [entity]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters([]);
  }, [setFilters]);

  // Check if there are active filters
  const hasActiveFilters = filters.length > 0;

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
  };
}
