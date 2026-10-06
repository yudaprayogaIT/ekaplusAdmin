// src/components/filters/FilterBuilder.tsx

import React, { useState, useRef, useEffect } from "react";
import { FilterState, FilterTriple, EntityFilterConfig } from "@/types/filter";
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
  dropdownAlign?: "left" | "right";
}

export default function FilterBuilder({
  entity,
  config,
  onApply,
  initialFilters = [],
  categories,
  dropdownAlign = "left",
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
        setFilters((currentFilters) => {
          const currentStateTriples = stateToTriple(currentFilters);
          return JSON.stringify(currentTriples) !==
            JSON.stringify(currentStateTriples)
            ? tripleToState(currentTriples)
            : currentFilters;
        });
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
    const filtersToApply =
      customFilters !== undefined ? customFilters : filters;
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
        <FaFilter
          className={activeFilterCount > 0 ? "text-white" : "text-gray-600"}
        />
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
            className={`absolute z-50 mt-2 flex max-h-[min(75vh,640px)] w-[calc(100vw-2rem)] max-w-[640px] flex-col overflow-hidden rounded-xl border border-blue-100 bg-white shadow-2xl sm:w-[min(640px,calc(100vw-3rem))] ${
              dropdownAlign === "right"
                ? "right-0 origin-top-right"
                : "left-0 origin-top-left"
            }`}
          >
            {/* Header with Gradient */}
            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3.5 sm:px-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-gray-800 sm:text-lg">
                    <FaFilter className="text-blue-600" />
                    Filter Lanjutan
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Atur kombinasi filter untuk {config.entity}
                  </p>
                </div>
                <FilterPresetDropdown
                  entity={entity}
                  currentFilters={stateToTriple(filters)}
                  onLoadPreset={handleLoadPreset}
                />
              </div>
            </div>

            <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
              {/* Filter Rows */}
              <div className="mb-4 space-y-3">
                {filters.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 py-6 text-center sm:py-8">
                    <FaFilter className="mx-auto mb-2 text-3xl text-blue-300" />
                    <p className="text-sm font-medium text-gray-600">
                      Belum ada filter
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Klik &quot;+ Tambah Filter&quot; untuk mulai
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
              <div className="flex flex-col gap-3 border-t-2 border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={addFilter}
                  className="flex items-center gap-2 px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-semibold border-2 border-blue-200 hover:border-blue-300"
                >
                  <FaPlus className="text-xs" />
                  <span>Tambah Filter</span>
                </button>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={clearAllFilters}
                    disabled={filters.length === 0}
                    className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                  >
                    Hapus Semua
                  </button>
                  <button
                    onClick={() => handleApply()}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm font-semibold shadow-lg shadow-blue-200 hover:shadow-xl"
                  >
                    Terapkan Filter
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
