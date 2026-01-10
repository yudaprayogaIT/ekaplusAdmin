// src/components/workflows/StateManager.tsx
"use client";

import { useState, useEffect } from "react";
import { FaCircle, FaEdit, FaCheckSquare, FaSquare, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

export type GlobalState = {
  id: number;
  name: string;
  docstatus: number;
  description?: string;
  color?: string;
  icon?: string;
};

export type SelectedState = {
  state_id: number;
  state_name: string;
  docstatus: number;
  editable: boolean;
  color?: string;
  icon?: string;
};

type Props = {
  globalStates: GlobalState[];
  selectedStates: SelectedState[];
  onChange: (states: SelectedState[]) => void;
};

export default function StateManager({
  globalStates,
  selectedStates,
  onChange,
}: Props) {
  const [editingStateId, setEditingStateId] = useState<number | null>(null);

  // Check if state is selected
  const isSelected = (stateId: number): boolean => {
    return selectedStates.some((s) => s.state_id === stateId);
  };

  // Get selected state data
  const getSelectedState = (stateId: number): SelectedState | undefined => {
    return selectedStates.find((s) => s.state_id === stateId);
  };

  // Toggle state selection
  const toggleState = (globalState: GlobalState) => {
    if (isSelected(globalState.id)) {
      // Remove from selection
      onChange(selectedStates.filter((s) => s.state_id !== globalState.id));
    } else {
      // Add to selection with default values
      onChange([
        ...selectedStates,
        {
          state_id: globalState.id,
          state_name: globalState.name,
          docstatus: globalState.docstatus,
          editable: false,
          color: globalState.color,
          icon: globalState.icon,
        },
      ]);
    }
  };

  // Update state customization
  const updateState = (
    stateId: number,
    updates: Partial<SelectedState>
  ) => {
    onChange(
      selectedStates.map((s) =>
        s.state_id === stateId ? { ...s, ...updates } : s
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Select States</h3>
          <p className="text-sm text-gray-600">
            Pilih minimal 2 state untuk workflow ini
          </p>
        </div>
        {globalStates.length === 0 && (
          <Link
            href="/workflow-state"
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-all flex items-center gap-2"
          >
            <FaExternalLinkAlt className="w-3 h-3" />
            Kelola Global States
          </Link>
        )}
      </div>

      {/* Validation message */}
      {selectedStates.length > 0 && selectedStates.length < 2 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800 font-medium">
            Anda perlu memilih minimal 2 state untuk workflow
          </p>
        </div>
      )}

      {/* States counter */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">
          {selectedStates.length} state dipilih
        </span>
        {selectedStates.length >= 2 && (
          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
            Valid
          </span>
        )}
      </div>

      {/* No states available */}
      {globalStates.length === 0 && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
          <FaCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-blue-900 mb-2">
            Belum Ada Global States
          </h4>
          <p className="text-sm text-blue-700 mb-4">
            Anda perlu membuat global states terlebih dahulu sebelum membuat workflow
          </p>
          <Link
            href="/workflow-state"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
            Buat Global State
          </Link>
        </div>
      )}

      {/* States list */}
      {globalStates.length > 0 && (
        <div className="space-y-2">
          {globalStates.map((globalState) => {
            const selected = isSelected(globalState.id);
            const selectedState = getSelectedState(globalState.id);
            const isEditing = editingStateId === globalState.id;

            return (
              <div
                key={globalState.id}
                className={`border-2 rounded-xl transition-all ${
                  selected
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Main row */}
                <div className="flex items-center gap-4 p-4">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleState(globalState)}
                    className="flex-shrink-0"
                  >
                    {selected ? (
                      <FaCheckSquare className="w-6 h-6 text-purple-600" />
                    ) : (
                      <FaSquare className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>

                  {/* Color indicator */}
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        (selected && selectedState?.color) ||
                        globalState.color ||
                        "#9333ea",
                    }}
                  />

                  {/* State info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">
                        {globalState.name}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                        Docstatus: {globalState.docstatus}
                      </span>
                    </div>
                    {globalState.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {globalState.description}
                      </p>
                    )}
                  </div>

                  {/* Customize button */}
                  {selected && (
                    <button
                      type="button"
                      onClick={() =>
                        setEditingStateId(
                          isEditing ? null : globalState.id
                        )
                      }
                      className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold hover:bg-orange-200 transition-all flex items-center gap-2"
                    >
                      <FaEdit className="w-3 h-3" />
                      {isEditing ? "Tutup" : "Customize"}
                    </button>
                  )}
                </div>

                {/* Customization panel */}
                {selected && isEditing && selectedState && (
                  <div className="border-t-2 border-purple-200 bg-white p-4 space-y-4">
                    <h4 className="font-bold text-purple-900 mb-3">
                      Customize State untuk Workflow Ini
                    </h4>

                    {/* Editable toggle */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <label className="font-medium text-gray-900">
                          Allow Edit
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Apakah dokumen bisa diedit di state ini?
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateState(globalState.id, {
                            editable: !selectedState.editable,
                          })
                        }
                        className={`relative w-14 h-7 rounded-full transition-all ${
                          selectedState.editable
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                            selectedState.editable
                              ? "translate-x-7"
                              : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Color picker */}
                    <div>
                      <label className="block font-medium text-gray-900 mb-2">
                        Custom Color (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={selectedState.color || globalState.color || "#9333ea"}
                          onChange={(e) =>
                            updateState(globalState.id, {
                              color: e.target.value,
                            })
                          }
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={selectedState.color || globalState.color || ""}
                          onChange={(e) =>
                            updateState(globalState.id, {
                              color: e.target.value,
                            })
                          }
                          placeholder="#9333ea"
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-purple-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateState(globalState.id, {
                              color: globalState.color,
                            })
                          }
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Icon input */}
                    <div>
                      <label className="block font-medium text-gray-900 mb-2">
                        Custom Icon (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={selectedState.icon || ""}
                          onChange={(e) =>
                            updateState(globalState.id, {
                              icon: e.target.value,
                            })
                          }
                          placeholder="Icon name (e.g., FaCheck)"
                          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateState(globalState.id, {
                              icon: globalState.icon,
                            })
                          }
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Kosongkan untuk menggunakan icon dari global state
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
