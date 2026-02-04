// src/components/workflow-states/WorkflowStateCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaCircle, FaCheckCircle } from "react-icons/fa";

type WorkflowState = {
  id: number;
  name: string;
  color: string;
  icon: string;
  docstatus: number;
  created_by: number;
  updated_by: number;
};

type WorkflowStateCardProps = {
  state: WorkflowState;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
};

function WorkflowStateCard({
  state,
  onEdit,
  onDelete,
  onView,
}: WorkflowStateCardProps) {
  // Default color if empty
  const displayColor = state.color || "#6B7280";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => onView?.()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Color Header */}
      <div
        className="h-24 relative overflow-hidden"
        style={{ backgroundColor: displayColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-black/10 rounded-full" />

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-bold flex items-center gap-1 ${
              state.docstatus === 1
                ? "bg-green-500/90 text-white"
                : "bg-gray-500/90 text-white"
            }`}
          >
            {state.docstatus === 1 ? (
              <>
                <FaCheckCircle className="w-3 h-3" />
                Active
              </>
            ) : (
              <>
                <FaCircle className="w-3 h-3" />
                Draft
              </>
            )}
          </span>
        </div>

        {/* ID Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700">
            ID: {state.id}
          </span>
        </div>
      </div>

      {/* Icon Circle */}
      <div className="relative -mt-10 px-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white"
          style={{ backgroundColor: displayColor }}
        >
          {state.icon ? (
            <span className="text-3xl">{state.icon}</span>
          ) : (
            <FaCircle className="w-8 h-8" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-3">
        <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-red-600 transition-colors">
          {state.name}
        </h3>

        {/* Color Preview */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="text-xs font-semibold text-gray-500 mb-2">
            Color Preview:
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
              style={{ backgroundColor: displayColor }}
            />
            <div className="flex-1">
              <div className="text-xs text-gray-400 font-mono mb-1">HEX</div>
              <div className="text-sm font-bold text-gray-700">
                {displayColor.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">Created By</div>
            <div className="font-semibold text-gray-700">
              User #{state.created_by}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="text-gray-500 mb-1">Updated By</div>
            <div className="font-semibold text-gray-700">
              User #{state.updated_by}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group/btn"
          >
            <FaEdit className="w-3.5 h-3.5 text-gray-600 group-hover/btn:text-red-600 transition-colors" />
            <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-red-600 transition-colors">
              Edit
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
          >
            <FaTrash className="w-3.5 h-3.5 text-red-600" />
            <span className="text-sm font-semibold text-red-600">Hapus</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default WorkflowStateCard;
