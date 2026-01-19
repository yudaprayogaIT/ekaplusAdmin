// src/components/filters/FilterBuilder.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  FilterState,
  FilterTriple,
  EntityFilterConfig,
} from "@/types/filter";
import {
  stateToTriple,
  tripleToState,
  generateFilterId,
  filtersToUrlParam,
  urlParamToFilters,
  saveFiltersToStorage,
  loadFiltersFromStorage,
} from "@/utils/filterUtils";
import FilterRow from "./FilterRow";
import FilterPresetDropdown from "./FilterPresetDropdown";
import { FaFilter, FaPlus, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/types";

interface FilterBuilderProps {
  entity: string; // "product", "item", etc.
  config: EntityFilterConfig; // Field definitions
  onApply: (filters: FilterTriple[]) => void; // Callback when apply clicked
  initialFilters?: FilterTriple[]; // Optional initial filters
  categories?: Category[]; // For relation fields
}

export default function FilterBuilder({
  entity,
  config,
  onApply,
  initialFilters = [],
  categories,
}: FilterBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState[]>([]);
  const [initialized, setInitialized] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize filters from URL params, localStorage, or initialFilters (only once)
  useEffect(() => {
    // Only initialize once to avoid infinite loop
    if (typeof window !== "undefined" && !initialized) {
      const urlParams = new URLSearchParams(window.location.search);
      const filterParam = urlParams.get("filters");

      let initialTriples: FilterTriple[] = [];

      if (filterParam) {
        // Load from URL params
        initialTriples = urlParamToFilters(filterParam);
      } else if (initialFilters.length > 0) {
        // Use provided initial filters
        initialTriples = initialFilters;
      } else {
        // Load from localStorage
        initialTriples = loadFiltersFromStorage(entity);
      }

      if (initialTriples.length > 0) {
        setFilters(tripleToState(initialTriples));
      }

      setInitialized(true);
    }
  }, [entity, initialFilters, initialized]);

  // Reload filters from URL params when dropdown is opened
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const filterParam = urlParams.get("filters");

      if (filterParam) {
        const currentTriples = urlParamToFilters(filterParam);
        // Only update if different from current state
        const currentStateTriples = stateToTriple(filters);
        if (JSON.stringify(currentTriples) !== JSON.stringify(currentStateTriples)) {
          setFilters(tripleToState(currentTriples));
        }
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function addFilter() {
    const newFilter: FilterState = {
      id: generateFilterId(),
      field: "",
      operator: "",
      value: undefined,
    };
    setFilters([...filters, newFilter]);
  }

  function updateFilter(id: string, updated: FilterState) {
    setFilters(filters.map((f) => (f.id === id ? updated : f)));
  }

  function removeFilter(id: string) {
    setFilters(filters.filter((f) => f.id !== id));
  }

  function clearAllFilters() {
    setFilters([]);
    handleApply([]); // Apply immediately with empty filters
  }

  function handleApply(customFilters?: FilterState[]) {
    const filtersToApply = customFilters !== undefined ? customFilters : filters;
    const triples = stateToTriple(filtersToApply);

    // Save to localStorage
    saveFiltersToStorage(entity, triples);

    // Update URL params
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (triples.length > 0) {
        url.searchParams.set("filters", filtersToUrlParam(triples));
      } else {
        url.searchParams.delete("filters");
      }
      window.history.replaceState({}, "", url.toString());
    }

    // Call onApply callback
    onApply(triples);

    // Close dropdown
    setIsOpen(false);
  }

  function handleLoadPreset(presetFilters: FilterTriple[]) {
    const newFilters = tripleToState(presetFilters);
    setFilters(newFilters);
    // Auto-apply when loading preset
    handleApply(newFilters);
  }

  // Count active filters (filters with all required fields filled)
  const activeFilterCount = stateToTriple(filters).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button - Improved UI */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
          activeFilterCount > 0
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 hover:shadow-xl"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        }`}
      >
        <FaFilter className={activeFilterCount > 0 ? "text-white" : "text-gray-600"} />
        <span>Filter</span>
        {activeFilterCount > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {activeFilterCount}
          </span>
        )}
        <FaChevronDown
          className={`text-xs transition-transform ${
            isOpen ? "rotate-180" : ""
          } ${activeFilterCount > 0 ? "text-white" : "text-gray-400"}`}
        />
      </button>

      {/* Dropdown Panel - Improved UI */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 mt-2 bg-white border-2 border-blue-100 rounded-xl shadow-2xl z-50 min-w-[600px] max-w-[800px] overflow-hidden"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaFilter className="text-blue-600" />
                    Advanced Filters
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Build powerful filter combinations for {config.entity}
                  </p>
                </div>
                <FilterPresetDropdown
                  entity={entity}
                  currentFilters={stateToTriple(filters)}
                  onLoadPreset={handleLoadPreset}
                />
              </div>
            </div>

            <div className="p-5">
              {/* Filter Rows */}
              <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto pr-2">
                {filters.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200">
                    <FaFilter className="mx-auto text-4xl text-blue-300 mb-3" />
                    <p className="text-sm font-medium text-gray-600">
                      No filters yet
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click &quot;+ Add Filter&quot; below to start
                    </p>
                  </div>
                ) : (
                  filters.map((filter) => (
                    <FilterRow
                      key={filter.id}
                      filter={filter}
                      config={config}
                      onChange={(updated) => updateFilter(filter.id, updated)}
                      onRemove={() => removeFilter(filter.id)}
                      categories={categories}
                    />
                  ))
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  onClick={addFilter}
                  className="flex items-center gap-2 px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-semibold border-2 border-blue-200 hover:border-blue-300"
                >
                  <FaPlus className="text-xs" />
                  <span>Add Filter</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={clearAllFilters}
                    disabled={filters.length === 0}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => handleApply()}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
