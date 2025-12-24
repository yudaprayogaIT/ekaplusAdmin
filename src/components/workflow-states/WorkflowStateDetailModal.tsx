// src/components/workflow-states/WorkflowStateDetailModal.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaCircle,
  FaPalette,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
import { WorkflowState } from "./WorkflowStateList";

type WorkflowStateDetailModalProps = {
  open: boolean;
  onClose: () => void;
  state: WorkflowState | null;
  onEdit?: (state: WorkflowState) => void;
  onDelete?: (state: WorkflowState) => void;
};

export default function WorkflowStateDetailModal({
  open,
  onClose,
  state,
  onEdit,
  onDelete,
}: WorkflowStateDetailModalProps) {
  if (!open || !state) return null;

  const displayColor = state.color || "#6B7280";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header with Color */}
              <div
                className="h-32 relative overflow-hidden rounded-t-2xl"
                style={{ backgroundColor: displayColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full" />
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-black/10 rounded-full" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-4 py-2 backdrop-blur-sm rounded-full text-sm font-bold flex items-center gap-2 ${
                      state.docstatus === 1
                        ? "bg-green-500/90 text-white"
                        : "bg-gray-500/90 text-white"
                    }`}
                  >
                    {state.docstatus === 1 ? (
                      <>
                        <FaCheckCircle className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <FaCircle className="w-4 h-4" />
                        Draft
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Icon */}
              <div className="relative -mt-16 px-8">
                <div
                  className="w-32 h-32 rounded-3xl flex items-center justify-center text-white shadow-2xl border-8 border-white"
                  style={{ backgroundColor: displayColor }}
                >
                  {state.icon ? (
                    <span className="text-5xl">{state.icon}</span>
                  ) : (
                    <FaCircle className="w-12 h-12" />
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 pt-6">
                {/* Title */}
                <div className="mb-8">
                  <div className="text-sm text-gray-500 mb-2">
                    Workflow State
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {state.name}
                  </h2>
                  <div className="text-sm text-gray-500">ID: {state.id}</div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Color Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaPalette className="w-5 h-5 text-purple-600" />
                      <h3 className="font-bold text-gray-900">Color</h3>
                    </div>
                    <div className="space-y-3">
                      <div
                        className="w-full h-24 rounded-xl shadow-md border-4 border-white"
                        style={{ backgroundColor: displayColor }}
                      />
                      <div className="bg-white rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">
                          HEX Code
                        </div>
                        <div className="font-mono font-bold text-gray-900">
                          {displayColor.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Icon Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaCircle className="w-5 h-5 text-blue-600" />
                      <h3 className="font-bold text-gray-900">Icon</h3>
                    </div>
                    <div className="flex items-center justify-center h-24 bg-white rounded-xl">
                      {state.icon ? (
                        <span className="text-6xl">{state.icon}</span>
                      ) : (
                        <div className="text-gray-400 text-sm">No icon set</div>
                      )}
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaUser className="w-5 h-5 text-green-600" />
                      <h3 className="font-bold text-gray-900">Created By</h3>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        User #{state.created_by}
                      </div>
                    </div>
                  </div>

                  {/* Updated By */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaUser className="w-5 h-5 text-orange-600" />
                      <h3 className="font-bold text-gray-900">Updated By</h3>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                      <div className="text-2xl font-bold text-gray-900">
                        User #{state.updated_by}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCircle className="w-4 h-4 text-gray-600" />
                    Badge Preview
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {/* Small Badge */}
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                      style={{ backgroundColor: displayColor }}
                    >
                      {state.icon && <span>{state.icon}</span>}
                      <span>{state.name}</span>
                    </div>

                    {/* Medium Badge */}
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
                      style={{ backgroundColor: displayColor }}
                    >
                      {state.icon && <span className="text-lg">{state.icon}</span>}
                      <span>{state.name}</span>
                    </div>

                    {/* Large Badge */}
                    <div
                      className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-white text-base font-bold"
                      style={{ backgroundColor: displayColor }}
                    >
                      {state.icon && <span className="text-2xl">{state.icon}</span>}
                      <span>{state.name}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEdit?.(state)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span>Edit State</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete?.(state)}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition-all"
                  >
                    <FaTrash className="w-5 h-5" />
                    <span>Hapus</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
