"use client";

import React from "react";
import EntityCard from "@/components/entity-management/EntityCard";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaCircle, FaCheckCircle } from "react-icons/fa";
import { renderWorkflowStateIcon } from "./iconRegistry";

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
  const displayColor = state.color || "#6B7280";

  return (
    <EntityCard
      icon={
        state.icon ? (
          renderWorkflowStateIcon(state.icon, "w-5 h-5")
        ) : (
          <FaCircle className="w-5 h-5" />
        )
      }
      title={state.name}
      subtitle={
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
            ID: {state.id}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              state.docstatus === 1
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {state.docstatus === 1 ? (
              <FaCheckCircle className="w-3 h-3" />
            ) : (
              <FaCircle className="w-3 h-3" />
            )}
            {state.docstatus === 1 ? "Active" : "Draft"}
          </span>
        </div>
      }
      description={
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg shadow-md border-2 border-white"
              style={{ backgroundColor: displayColor }}
            />
            <div>
              <div className="text-xs text-gray-400 font-mono">HEX</div>
              <div className="text-sm font-bold text-gray-700">
                {displayColor.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
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
        </div>
      }
      onView={onView}
      accentClasses={{
        iconBg: "bg-red-50",
        iconText: "text-red-600",
        hoverBorder: "hover:border-red-200",
        hoverText: "group-hover:text-red-600",
        detailText: "text-red-600 hover:text-red-700",
      }}
      actions={
        <>
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
        </>
      }
    />
  );
}

export default WorkflowStateCard;
