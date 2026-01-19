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
  // Initialize with initialFilters if provided to avoid timing issues on page refresh
  const [filters, setFiltersInternal] = useState<FilterTriple[]>(
    initialFilters || []
  );
  const [initialized, setInitialized] = useState(false);
  const onFiltersChangeRef = useRef(onFiltersChange);

  // Debug logging
  useEffect(() => {
    console.log(`[useFilters:${entity}] 🔍 Initialized:`, initialized);
    console.log(`[useFilters:${entity}] 🔍 Initial filters:`, initialFilters);
    console.log(`[useFilters:${entity}] 🔍 Current filters:`, filters);
  }, [entity, initialized, initialFilters, filters]);

  // Update ref when callback changes
  useEffect(() => {
    onFiltersChangeRef.current = onFiltersChange;
  }, [onFiltersChange]);

  // Initialize filters from initialFilters, URL params, or localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined" || initialized) return;

    // If initialFilters was already provided in useState, skip additional initialization
    // Only run this effect for fallback scenarios (legacy URL param or localStorage)
    if (initialFilters && initialFilters.length > 0) {
      setInitialized(true);
      return;
    }

    let loadedFilters: FilterTriple[] = [];

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

    if (loadedFilters.length > 0) {
      setFiltersInternal(loadedFilters);
    }

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
