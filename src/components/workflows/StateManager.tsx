// src/components/workflows/StateManager.tsx
"use client";

import {
  FaCircle,
  FaCheckSquare,
  FaSquare,
  FaExternalLinkAlt,
  FaPlus,
} from "react-icons/fa";
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
  onAddState?: () => void;
};

export default function StateManager({
  globalStates,
  selectedStates,
  onChange,
  onAddState,
}: Props) {
  const getDocstatusLabel = (docstatus: number) => {
    switch (docstatus) {
      case 0:
        return "Draft / Editable";
      case 1:
        return "Submitted / Locked";
      case 2:
        return "Cancelled / Closed";
      default:
        return "Custom";
    }
  };

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
          editable: globalState.docstatus === 0,
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
        <div className="flex items-center gap-2">
          {onAddState && (
            <button
              type="button"
              onClick={onAddState}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl font-bold hover:bg-purple-200 transition-all flex items-center gap-2"
            >
              <FaPlus className="w-3 h-3" />
              Tambah State
            </button>
          )}
          {globalStates.length === 0 && (
            <Link
              href="/workflow-states"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-all flex items-center gap-2"
            >
              <FaExternalLinkAlt className="w-3 h-3" />
              Kelola Global States
            </Link>
          )}
        </div>
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
            href="/workflow-states"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
            Buat Global State
          </Link>
          {onAddState && (
            <button
              type="button"
              onClick={onAddState}
              className="ml-3 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
            >
              <FaPlus className="w-4 h-4" />
              Tambah di Sini
            </button>
          )}
        </div>
      )}

      {/* States list */}
      {globalStates.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="grid grid-cols-[56px_72px_minmax(0,1fr)_280px] border-b border-gray-200 bg-gray-50/80 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            <div className="px-4 py-3 text-center">Pick</div>
            <div className="px-4 py-3 text-center">No</div>
            <div className="px-4 py-3">State</div>
            <div className="px-4 py-3">Doc Status</div>
          </div>

          {globalStates.map((globalState, index) => {
            const selected = isSelected(globalState.id);
            const selectedState = getSelectedState(globalState.id);
            const currentDocstatus =
              selectedState?.docstatus ?? globalState.docstatus;
            const currentEditable =
              selectedState?.editable ?? globalState.docstatus === 0;

            return (
              <div
                key={globalState.id}
                className={`grid grid-cols-[56px_72px_minmax(0,1fr)_280px] items-center border-b border-gray-100 last:border-b-0 ${
                  selected ? "bg-purple-50/40" : "bg-white"
                }`}
              >
                <div className="flex justify-center px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleState(globalState)}
                    className="flex-shrink-0"
                  >
                    {selected ? (
                      <FaCheckSquare className="h-5 w-5 text-purple-600" />
                    ) : (
                      <FaSquare className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                  {index + 1}
                </div>

                <div className="min-w-0 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-4 w-4 flex-shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          (selected && selectedState?.color) ||
                          globalState.color ||
                          "#9333ea",
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold text-gray-900">
                        {globalState.name}
                      </p>
                      {globalState.description ? (
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {globalState.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="space-y-2">
                    <select
                      value={String(currentDocstatus)}
                      disabled={!selected}
                      onChange={(e) =>
                        updateState(globalState.id, {
                          docstatus: Number(e.target.value),
                          editable: Number(e.target.value) === 0,
                        })
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <option value="0">0 - Draft / Editable</option>
                      <option value="1">1 - Submitted / Locked</option>
                      <option value="2">2 - Cancelled / Closed</option>
                    </select>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
                        {getDocstatusLabel(currentDocstatus)}
                      </span>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          currentEditable
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {currentEditable ? "Editable" : "Locked"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
