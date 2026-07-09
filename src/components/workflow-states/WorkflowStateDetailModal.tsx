"use client";

import React from "react";
import EntityDetailModal from "@/components/entity-management/EntityDetailModal";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaCircle,
  FaPalette,
  FaCheckCircle,
  FaUser,
} from "react-icons/fa";
import { WorkflowState } from "./WorkflowStateList";
import {
  getWorkflowStateIconOption,
  renderWorkflowStateIcon,
} from "./iconRegistry";

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
  const iconOption = getWorkflowStateIconOption(state.icon);

  return (
    <EntityDetailModal
      open={open}
      onClose={onClose}
      icon={
        state.icon ? (
          renderWorkflowStateIcon(state.icon, "w-6 h-6")
        ) : (
          <FaCircle className="w-6 h-6" />
        )
      }
      eyebrow="Workflow State"
      title={state.name}
      subtitle={<div className="text-sm text-gray-500">ID: {state.id}</div>}
      maxWidthClassName="max-w-3xl"
      accentClasses={{ iconBg: "bg-red-50", iconText: "text-red-600" }}
      actions={
        <>
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
            <span>Delete</span>
          </motion.button>
        </>
      }
    >
      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: displayColor }}
        >
          {state.icon ? (
            renderWorkflowStateIcon(state.icon, "w-10 h-10")
          ) : (
            <FaCircle className="w-10 h-10" />
          )}
        </div>
        <div className="space-y-2">
          <span
            className={`inline-flex px-4 py-2 rounded-full text-sm font-bold items-center gap-2 ${
              state.docstatus === 1
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
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
          <div className="font-mono text-sm text-gray-500">
            {displayColor.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="text-xs text-gray-500 mb-1">HEX Code</div>
              <div className="font-mono font-bold text-gray-900">
                {displayColor.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Icon</h3>
          </div>
          <div className="flex items-center justify-center h-24 bg-white rounded-xl">
            {state.icon ? (
              <div className="flex flex-col items-center gap-2">
                {renderWorkflowStateIcon(state.icon, "w-10 h-10 text-gray-700")}
                <span className="font-mono text-xs text-gray-500">
                  {state.icon}
                </span>
                {iconOption ? (
                  <span className="text-xs font-medium text-gray-600">
                    {iconOption.label}
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No icon set</div>
            )}
          </div>
        </div>

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

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaCircle className="w-4 h-4 text-gray-600" />
          Badge Preview
        </h3>
        <div className="flex flex-wrap gap-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-white text-xs font-bold"
            style={{ backgroundColor: displayColor }}
          >
            {state.icon && renderWorkflowStateIcon(state.icon, "w-3 h-3")}
            <span>{state.name}</span>
          </div>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold"
            style={{ backgroundColor: displayColor }}
          >
            {state.icon && renderWorkflowStateIcon(state.icon, "w-4 h-4")}
            <span>{state.name}</span>
          </div>

          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-white text-base font-bold"
            style={{ backgroundColor: displayColor }}
          >
            {state.icon && renderWorkflowStateIcon(state.icon, "w-5 h-5")}
            <span>{state.name}</span>
          </div>
        </div>
      </div>
    </EntityDetailModal>
  );
}
