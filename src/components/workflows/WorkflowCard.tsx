// src/components/workflows/WorkflowCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaSitemap,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaCircle,
  FaUser,
  FaUsers,
  FaListOl,
} from "react-icons/fa";
import { WorkflowWithDetails, Role } from "./WorkflowList";

type Props = {
  workflow: WorkflowWithDetails;
  viewMode: "grid" | "list";
  roles: Role[];
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
};

export default function WorkflowCard({
  workflow,
  viewMode,
  roles,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const { workflow: wf, document_states, transitions } = workflow;
  const isActive = wf.is_active;

  // Sort states by state_id for flow visualization
  const sortedStates = [...document_states].sort((a, b) => a.state_id - b.state_id);

  // Mode badge icon
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "single":
        return <FaUser className="w-3 h-3" />;
      case "parallel":
        return <FaUsers className="w-3 h-3" />;
      case "sequence":
        return <FaListOl className="w-3 h-3" />;
      default:
        return <FaCircle className="w-3 h-3" />;
    }
  };

  // Mode badge color
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

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon and Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaSitemap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {wf.name}
                </h3>
                {isActive ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <FaCheckCircle className="w-3 h-3" />
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <FaTimesCircle className="w-3 h-3" />
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-mono truncate">
                {wf.resource}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-gray-600">
                  {document_states.length} States
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">
                  {transitions.length} Transitions
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onView}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="View Details"
            >
              <FaEye className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all group"
    >
      {/* Header with Icon and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <FaSitemap className="w-7 h-7 text-white" />
        </div>
        <div className="flex flex-col items-end gap-2">
          {isActive ? (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1">
              <FaCheckCircle className="w-3 h-3" />
              Active
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold flex items-center gap-1">
              <FaTimesCircle className="w-3 h-3" />
              Inactive
            </span>
          )}
          <button
            onClick={onView}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            title="View Details"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {wf.name}
        </h3>
        <p className="text-sm text-gray-500 font-mono truncate mb-3">
          {wf.resource}
        </p>
        {wf.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {wf.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 px-3 py-2 bg-purple-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FaCircle className="w-3 h-3 text-purple-600" />
            <span className="text-sm font-bold text-purple-900">
              {document_states.length}
            </span>
          </div>
          <div className="text-xs text-purple-700 mt-1">States</div>
        </div>
        <div className="flex-1 px-3 py-2 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FaArrowRight className="w-3 h-3 text-orange-600" />
            <span className="text-sm font-bold text-orange-900">
              {transitions.length}
            </span>
          </div>
          <div className="text-xs text-orange-700 mt-1">Transitions</div>
        </div>
      </div>

      {/* State Flow Preview */}
      {sortedStates.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="text-xs font-semibold text-gray-500 mb-2">
            State Flow:
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {sortedStates.slice(0, 3).map((state, idx) => (
              <div key={state.state_id} className="flex items-center gap-1">
                <span
                  className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 whitespace-nowrap"
                  title={state.state_name}
                >
                  {state.state_name.length > 8
                    ? state.state_name.substring(0, 8) + "..."
                    : state.state_name}
                </span>
                {idx < Math.min(sortedStates.length - 1, 2) && (
                  <FaArrowRight className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                )}
              </div>
            ))}
            {sortedStates.length > 3 && (
              <span className="text-xs text-gray-500 ml-1">
                +{sortedStates.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Transition Modes Preview */}
      {transitions.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Array.from(new Set(transitions.map((t) => t.mode))).map((mode) => (
            <span
              key={mode}
              className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getModeColor(
                mode
              )}`}
            >
              {getModeIcon(mode)}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
        >
          <FaEdit className="w-3 h-3" />
          <span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
          title="Delete"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
