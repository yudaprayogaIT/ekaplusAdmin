// src/components/workflows/TransitionManager.tsx
"use client";

import { useState } from "react";
import {
  FaArrowRight,
  FaPlus,
  FaTrash,
  FaUser,
  FaUsers,
  FaListOl,
  FaExclamationTriangle,
} from "react-icons/fa";
import { SelectedState } from "./StateManager";
import { Role } from "./WorkflowList";

export type TransitionInput = {
  from_state_id: number;
  to_state_id: number;
  action: string;
  mode: "single" | "parallel" | "sequence";
  allowed_role_ids: number[];
  min_required: number;
};

type Props = {
  selectedStates: SelectedState[];
  roles: Role[];
  transitions: TransitionInput[];
  onChange: (transitions: TransitionInput[]) => void;
};

export default function TransitionManager({
  selectedStates,
  roles,
  transitions,
  onChange,
}: Props) {
  // Add new transition
  const addTransition = () => {
    if (selectedStates.length < 2) {
      alert("Pilih minimal 2 state terlebih dahulu");
      return;
    }

    onChange([
      ...transitions,
      {
        from_state_id: selectedStates[0].state_id,
        to_state_id: selectedStates[1]?.state_id || selectedStates[0].state_id,
        action: "",
        mode: "single",
        allowed_role_ids: [],
        min_required: 1,
      },
    ]);
  };

  // Remove transition
  const removeTransition = (index: number) => {
    onChange(transitions.filter((_, i) => i !== index));
  };

  // Update transition
  const updateTransition = (
    index: number,
    updates: Partial<TransitionInput>
  ) => {
    onChange(
      transitions.map((t, i) =>
        i === index ? { ...t, ...updates } : t
      )
    );
  };

  // Toggle role selection
  const toggleRole = (index: number, roleId: number) => {
    const transition = transitions[index];
    const hasRole = transition.allowed_role_ids.includes(roleId);

    updateTransition(index, {
      allowed_role_ids: hasRole
        ? transition.allowed_role_ids.filter((id) => id !== roleId)
        : [...transition.allowed_role_ids, roleId],
    });
  };

  // Get state name by ID
  const getStateName = (stateId: number): string => {
    const state = selectedStates.find((s) => s.state_id === stateId);
    return state ? state.state_name : `State #${stateId}`;
  };

  // Mode icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "single":
        return <FaUser className="w-3 h-3" />;
      case "parallel":
        return <FaUsers className="w-3 h-3" />;
      case "sequence":
        return <FaListOl className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Mode color
  const getModeColor = (mode: string) => {
    switch (mode) {
      case "single":
        return "bg-blue-100 text-blue-700";
      case "parallel":
        return "bg-orange-100 text-orange-700";
      case "sequence":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Validate transition
  const validateTransition = (transition: TransitionInput): string[] => {
    const errors: string[] = [];

    if (transition.from_state_id === transition.to_state_id) {
      errors.push("From state dan To state tidak boleh sama");
    }

    if (!transition.action.trim()) {
      errors.push("Action tidak boleh kosong");
    }

    if (transition.allowed_role_ids.length === 0) {
      errors.push("Pilih minimal 1 role");
    }

    if (
      (transition.mode === "parallel" || transition.mode === "sequence") &&
      transition.min_required < 1
    ) {
      errors.push("Min required harus minimal 1");
    }

    if (
      (transition.mode === "parallel" || transition.mode === "sequence") &&
      transition.min_required > transition.allowed_role_ids.length
    ) {
      errors.push("Min required tidak boleh lebih dari jumlah role");
    }

    return errors;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Transitions</h3>
          <p className="text-sm text-gray-600">
            Definisikan transisi antar state dan role yang diizinkan
          </p>
        </div>
        <button
          type="button"
          onClick={addTransition}
          disabled={selectedStates.length < 2}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus className="w-3 h-3" />
          Add Transition
        </button>
      </div>

      {/* Info when no states */}
      {selectedStates.length < 2 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-800 font-medium">
            Pilih minimal 2 state terlebih dahulu untuk membuat transitions
          </p>
        </div>
      )}

      {/* Transitions counter */}
      {transitions.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold">
            {transitions.length} transition
          </span>
          {transitions.length >= 1 && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
              Valid
            </span>
          )}
        </div>
      )}

      {/* No transitions */}
      {transitions.length === 0 && selectedStates.length >= 2 && (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 text-center">
          <FaArrowRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-gray-900 mb-2">
            Belum Ada Transition
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Tambahkan minimal 1 transition untuk mendefinisikan alur workflow
          </p>
          <button
            type="button"
            onClick={addTransition}
            className="px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all inline-flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Add First Transition
          </button>
        </div>
      )}

      {/* Transitions list */}
      {transitions.length > 0 && (
        <div className="space-y-4">
          {transitions.map((transition, index) => {
            const errors = validateTransition(transition);
            const hasErrors = errors.length > 0;

            return (
              <div
                key={index}
                className={`border-2 rounded-2xl overflow-hidden ${
                  hasErrors
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b-2 border-orange-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaArrowRight className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-orange-900">
                      Transition #{index + 1}
                    </span>
                    {hasErrors && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1">
                        <FaExclamationTriangle className="w-3 h-3" />
                        {errors.length} error
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTransition(index)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  {/* Errors */}
                  {hasErrors && (
                    <div className="bg-red-100 border-2 border-red-200 rounded-xl p-3">
                      <ul className="space-y-1">
                        {errors.map((error, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-red-800 font-medium flex items-center gap-2"
                          >
                            <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* From/To States */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-gray-900 mb-2">
                        From State *
                      </label>
                      <select
                        value={transition.from_state_id}
                        onChange={(e) =>
                          updateTransition(index, {
                            from_state_id: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      >
                        {selectedStates.map((state) => (
                          <option key={state.state_id} value={state.state_id}>
                            {state.state_name} (Docstatus: {state.docstatus})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-900 mb-2">
                        To State *
                      </label>
                      <select
                        value={transition.to_state_id}
                        onChange={(e) =>
                          updateTransition(index, {
                            to_state_id: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      >
                        {selectedStates.map((state) => (
                          <option key={state.state_id} value={state.state_id}>
                            {state.state_name} (Docstatus: {state.docstatus})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Flow preview */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-bold">
                      {getStateName(transition.from_state_id)}
                    </div>
                    <FaArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-bold">
                      {getStateName(transition.to_state_id)}
                    </div>
                  </div>

                  {/* Action */}
                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Action Name *
                    </label>
                    <input
                      type="text"
                      value={transition.action}
                      onChange={(e) =>
                        updateTransition(index, { action: e.target.value })
                      }
                      placeholder="e.g., Submit, Approve, Reject"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nama action yang akan tampil sebagai tombol
                    </p>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Approval Mode *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateTransition(index, {
                            mode: "single",
                            min_required: 1,
                          })
                        }
                        className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          transition.mode === "single"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        }`}
                      >
                        <FaUser className="w-4 h-4" />
                        Single
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateTransition(index, {
                            mode: "parallel",
                            min_required: 1,
                          })
                        }
                        className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          transition.mode === "parallel"
                            ? "bg-orange-600 text-white shadow-lg"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        }`}
                      >
                        <FaUsers className="w-4 h-4" />
                        Parallel
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateTransition(index, {
                            mode: "sequence",
                            min_required: transition.allowed_role_ids.length || 1,
                          })
                        }
                        className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          transition.mode === "sequence"
                            ? "bg-purple-600 text-white shadow-lg"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        <FaListOl className="w-4 h-4" />
                        Sequence
                      </button>
                    </div>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800">
                        {transition.mode === "single" &&
                          "Single: 1 approval dari salah satu role yang diizinkan"}
                        {transition.mode === "parallel" &&
                          "Parallel: Multiple approvals bersamaan, butuh min_required approval"}
                        {transition.mode === "sequence" &&
                          "Sequence: Approval berurutan dari semua role yang diizinkan"}
                      </p>
                    </div>
                  </div>

                  {/* Allowed Roles */}
                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Allowed Roles * ({transition.allowed_role_ids.length} dipilih)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {roles.map((role) => {
                        const isSelected = transition.allowed_role_ids.includes(
                          role.ID
                        );

                        return (
                          <button
                            key={role.ID}
                            type="button"
                            onClick={() => toggleRole(index, role.ID)}
                            className={`px-3 py-2 rounded-lg font-medium transition-all text-left ${
                              isSelected
                                ? "bg-blue-600 text-white shadow"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {role.Name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Min Required (only for parallel/sequence) */}
                  {(transition.mode === "parallel" ||
                    transition.mode === "sequence") && (
                    <div>
                      <label className="block font-medium text-gray-900 mb-2">
                        Minimum Required Approvals *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={transition.allowed_role_ids.length || 1}
                        value={transition.min_required}
                        onChange={(e) =>
                          updateTransition(index, {
                            min_required: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {transition.mode === "parallel"
                          ? "Jumlah minimum approval yang dibutuhkan dari role yang dipilih"
                          : "Untuk sequence mode, biasanya sama dengan jumlah role"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
