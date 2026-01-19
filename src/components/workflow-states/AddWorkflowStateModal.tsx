// src/components/workflow-states/AddWorkflowStateModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheckCircle, FaPalette, FaCircle } from "react-icons/fa";
import { WorkflowState } from "./WorkflowStateList";
import { useAuth } from "@/contexts/AuthContext";
import {
  getResourceUrl,
  getAuthHeadersFormData,
  API_CONFIG,
} from "@/config/api";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import UnsavedChangesDialog from "@/components/ui/UnsavedChangesDialog";

// Predefined color suggestions for workflow states
const COLOR_SUGGESTIONS = [
  { name: "Gray (Draft)", color: "#6B7280" },
  { name: "Blue (Submitted)", color: "#3B82F6" },
  { name: "Green (Approved)", color: "#10B981" },
  { name: "Red (Rejected)", color: "#EF4444" },
  { name: "Yellow (Pending)", color: "#F59E0B" },
  { name: "Purple (Review)", color: "#8B5CF6" },
  { name: "Indigo (Processing)", color: "#6366F1" },
  { name: "Pink (Escalated)", color: "#EC4899" },
  { name: "Teal (Verified)", color: "#14B8A6" },
  { name: "Orange (Warning)", color: "#F97316" },
];

// Icon suggestions
const ICON_SUGGESTIONS = [
  "📝", // Draft
  "✅", // Approved
  "❌", // Rejected
  "⏳", // Pending
  "🔍", // Review
  "⚠️", // Warning
  "✨", // New
  "🔒", // Locked
  "🔓", // Unlocked
  "📋", // Document
];

export default function AddWorkflowStateModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: WorkflowState | null;
}) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6B7280");
  const [icon, setIcon] = useState("");
  const [docstatus, setDocstatus] = useState(1);
  const [saving, setSaving] = useState(false);

  // Track initial state for dirty checking
  const [initialState, setInitialState] = useState({
    name: "",
    color: "#6B7280",
    icon: "",
    docstatus: 1,
  });

  // Check if form is dirty
  const isDirty =
    name !== initialState.name ||
    color !== initialState.color ||
    icon !== initialState.icon ||
    docstatus !== initialState.docstatus;

  // Unsaved changes hook
  const { showConfirm, handleClose, handleConfirmClose, handleCancelClose } =
    useUnsavedChanges({ isDirty, onClose });

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setColor(initial.color || "#6B7280");
      setIcon(initial.icon ?? "");
      setDocstatus(initial.docstatus ?? 1);

      // Set initial state for dirty checking
      setInitialState({
        name: initial.name ?? "",
        color: initial.color || "#6B7280",
        icon: initial.icon ?? "",
        docstatus: initial.docstatus ?? 1,
      });
    } else {
      setName("");
      setColor("#6B7280");
      setIcon("");
      setDocstatus(1);

      // Set initial state for dirty checking
      setInitialState({
        name: "",
        color: "#6B7280",
        icon: "",
        docstatus: 1,
      });
    }
  }, [initial, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama state harus diisi!");
      return;
    }
    if (!token) {
      alert("Not authenticated");
      return;
    }

    setSaving(true);
    try {
      const headers = getAuthHeadersFormData(token);

      // Use FormData for API request
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("color", color);
      formData.append("icon", icon.trim());
      formData.append("docstatus", docstatus.toString());

      let response;

      if (initial) {
        // Update existing state
        response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, initial.id),
          {
            method: "PUT",
            headers,
            body: formData,
          }
        );
      } else {
        // Create new state
        response = await fetch(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, {
          method: "POST",
          headers,
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${initial ? "update" : "create"} workflow state (${response.status})`
        );
      }

      console.log(
        `Workflow state ${initial ? "updated" : "created"} successfully`
      );

      // Dispatch update event
      window.dispatchEvent(new Event("ekaplus:workflow_states_update"));

      // Reset form
      setName("");
      setColor("#6B7280");
      setIcon("");
      setDocstatus(1);
      setInitialState({
        name: "",
        color: "#6B7280",
        icon: "",
        docstatus: 1,
      });

      onClose();
    } catch (err: unknown) {
      console.error("Failed to save workflow state:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-2xl z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {initial ? "Edit" : "Tambah"} Workflow State
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {initial
                        ? "Perbarui informasi workflow state"
                        : "Tambahkan workflow state baru"}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <FaTimes className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Draft, Submitted, Approved"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaPalette className="inline w-4 h-4 mr-1" />
                      Warna State
                    </label>

                    {/* Color Suggestions */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                      {COLOR_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion.color}
                          type="button"
                          onClick={() => setColor(suggestion.color)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            color === suggestion.color
                              ? "border-red-500 shadow-lg"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-full h-8 rounded-lg mb-2"
                            style={{ backgroundColor: suggestion.color }}
                          />
                          <div className="text-xs font-medium text-gray-700 text-center">
                            {suggestion.name.split(" ")[0]}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Color Input */}
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-16 h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#6B7280"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono"
                      />
                    </div>

                    {/* Color Preview */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                      <div className="text-xs font-semibold text-gray-500 mb-2">
                        Preview:
                      </div>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-white text-2xl"
                          style={{ backgroundColor: color }}
                        >
                          {icon || <FaCircle className="w-8 h-8" />}
                        </div>
                        <div className="flex-1">
                          <div
                            className="inline-block px-4 py-2 rounded-lg text-white font-semibold"
                            style={{ backgroundColor: color }}
                          >
                            {name || "State Name"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Icon (Emoji)
                    </label>

                    {/* Icon Suggestions */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ICON_SUGGESTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setIcon(emoji)}
                          className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl border-2 transition-all ${
                            icon === emoji
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="📝 (optional)"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-center text-2xl"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Gunakan emoji untuk icon visual state
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="docstatus"
                          value="1"
                          checked={docstatus === 1}
                          onChange={() => setDocstatus(1)}
                          className="w-5 h-5 text-red-500"
                        />
                        <span className="flex items-center gap-2 text-gray-700 font-medium">
                          <FaCheckCircle className="w-4 h-4 text-green-500" />
                          Active
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="docstatus"
                          value="0"
                          checked={docstatus === 0}
                          onChange={() => setDocstatus(0)}
                          className="w-5 h-5 text-gray-500"
                        />
                        <span className="flex items-center gap-2 text-gray-700 font-medium">
                          <FaCircle className="w-4 h-4 text-gray-400" />
                          Draft
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving
                        ? "Menyimpan..."
                        : initial
                          ? "Perbarui State"
                          : "Tambah State"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Unsaved Changes Dialog */}
      <UnsavedChangesDialog
        open={showConfirm}
        onConfirm={handleConfirmClose}
        onCancel={handleCancelClose}
      />
    </>
  );
}
