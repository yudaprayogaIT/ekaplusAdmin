// src/components/filters/FilterPresetDropdown.tsx

import React, { useState, useRef, useEffect } from "react";
import { FilterPreset, FilterTriple } from "@/types/filter";
import { loadPresets, savePreset, deletePreset } from "@/utils/filterUtils";
import { FaBookmark, FaSave, FaTrash, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface FilterPresetDropdownProps {
  entity: string;
  currentFilters: FilterTriple[];
  onLoadPreset: (filters: FilterTriple[]) => void;
}

export default function FilterPresetDropdown({
  entity,
  currentFilters,
  onLoadPreset,
}: FilterPresetDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [savingMode, setSavingMode] = useState(false);
  const [presetName, setPresetName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load presets on mount
  useEffect(() => {
    refreshPresets();
  }, [entity]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSavingMode(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function refreshPresets() {
    setPresets(loadPresets(entity));
  }

  function handleSavePreset() {
    if (!presetName.trim()) {
      alert("Please enter a preset name");
      return;
    }

    if (currentFilters.length === 0) {
      alert("No filters to save");
      return;
    }

    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      filters: currentFilters,
      createdAt: new Date().toISOString(),
      entity,
    };

    savePreset(newPreset);
    refreshPresets();
    setPresetName("");
    setSavingMode(false);
  }

  function handleDeletePreset(presetId: string) {
    if (confirm("Are you sure you want to delete this preset?")) {
      deletePreset(entity, presetId);
      refreshPresets();
    }
  }

  function handleLoadPreset(preset: FilterPreset) {
    onLoadPreset(preset.filters);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Preset Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
      >
        <FaBookmark className="text-gray-600" />
        <span>Presets</span>
        <FaChevronDown
          className={`text-gray-400 text-xs transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="p-4">
              {/* Save New Preset Section */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">
                  Save Current Filters
                </h3>
                {!savingMode ? (
                  <button
                    onClick={() => setSavingMode(true)}
                    disabled={currentFilters.length === 0}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed w-full justify-center"
                  >
                    <FaSave />
                    <span>Save as Preset</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={presetName}
                      onChange={(e) => setPresetName(e.target.value)}
                      placeholder="Preset name..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSavePreset();
                        } else if (e.key === "Escape") {
                          setSavingMode(false);
                          setPresetName("");
                        }
                      }}
                    />
                    <button
                      onClick={handleSavePreset}
                      className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setSavingMode(false);
                        setPresetName("");
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Saved Presets List */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-700">
                  Saved Presets ({presets.length})
                </h3>
                {presets.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No saved presets yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {presets.map((preset) => (
                      <div
                        key={preset.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                      >
                        <button
                          onClick={() => handleLoadPreset(preset)}
                          className="flex-1 text-left text-sm font-medium text-gray-700 hover:text-blue-600"
                        >
                          {preset.name}
                          <span className="block text-xs text-gray-500">
                            {preset.filters.length} filter
                            {preset.filters.length !== 1 ? "s" : ""}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeletePreset(preset.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete preset"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
