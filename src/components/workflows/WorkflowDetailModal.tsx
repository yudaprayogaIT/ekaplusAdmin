// src/components/workflows/WorkflowDetailModal.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaSitemap,
  FaClock,
  FaCircle,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaUsers,
  FaListOl,
  FaProjectDiagram,
} from "react-icons/fa";
import { WorkflowWithDetails, Role } from "./WorkflowList";

type Props = {
  open: boolean;
  onClose: () => void;
  workflow: WorkflowWithDetails | null;
  roles: Role[];
  onEdit: (workflow: WorkflowWithDetails) => void;
  onDelete: (workflow: WorkflowWithDetails) => void;
};

export default function WorkflowDetailModal({
  open,
  onClose,
  workflow,
  roles,
  onEdit,
  onDelete,
}: Props) {
  if (!open || !workflow) return null;

  const { workflow: wf, document_states, transitions } = workflow;

  // Sort states by state_id for flow visualization
  const sortedStates = [...document_states].sort(
    (a, b) => a.state_id - b.state_id
  );

  // Get role name by ID
  const getRoleName = (roleId: number): string => {
    const role = roles.find((r) => r.ID === roleId);
    return role ? role.Name : `Role #${roleId}`;
  };

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaSitemap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Workflow Detail
                </h2>
                <p className="text-sm text-gray-600">
                  Informasi lengkap workflow
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Workflow Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaSitemap className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-purple-900 mb-2">
                      {wf.name}
                    </h3>
                    <p className="text-purple-700 font-mono text-lg mb-3">
                      {wf.resource}
                    </p>
                    {wf.description && (
                      <p className="text-purple-800 text-sm">
                        {wf.description}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {wf.is_active ? (
                    <span className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2">
                      <FaCheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold flex items-center gap-2">
                      <FaTimesCircle className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">
                    Document States
                  </span>
                </div>
                <p className="text-3xl font-bold text-purple-900">
                  {document_states.length}
                </p>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaArrowRight className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700 font-medium">
                    Transitions
                  </span>
                </div>
                <p className="text-3xl font-bold text-orange-900">
                  {transitions.length}
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaProjectDiagram className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Workflow ID
                  </span>
                </div>
                <p className="text-3xl font-bold text-blue-900">#{wf.id}</p>
              </div>
            </div>

            {/* State Flow Diagram */}
            {sortedStates.length > 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaProjectDiagram className="w-5 h-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">
                    State Flow Diagram
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {sortedStates.map((state, idx) => (
                    <div key={state.state_id} className="flex items-center gap-2">
                      <div className="px-4 py-2 rounded-xl bg-white border-2 border-purple-200 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: state.color || "#9333ea",
                            }}
                          />
                          <span className="font-bold text-gray-900">
                            {state.state_name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Docstatus: {state.docstatus}
                          {state.editable && " • Editable"}
                        </div>
                      </div>
                      {idx < sortedStates.length - 1 && (
                        <FaArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document States Table */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-purple-50 border-b-2 border-purple-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FaCircle className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-purple-900">
                    Document States
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        State ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        State Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Docstatus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Editable
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Color
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Icon
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedStates.map((state) => (
                      <tr
                        key={state.state_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            #{state.state_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-gray-900">
                            {state.state_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
                            {state.docstatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {state.editable ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {state.color ? (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded border-2 border-gray-300"
                                style={{ backgroundColor: state.color }}
                              />
                              <span className="text-xs text-gray-600 font-mono">
                                {state.color}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {state.icon || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Transitions Table */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-orange-50 border-b-2 border-orange-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FaArrowRight className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-orange-900">
                    Transitions
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        From State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        To State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Mode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Allowed Roles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                        Min Required
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transitions.map((transition, idx) => {
                      const fromState = document_states.find(
                        (s) => s.state_id === transition.from_state_id
                      );
                      const toState = document_states.find(
                        (s) => s.state_id === transition.to_state_id
                      );

                      return (
                        <tr
                          key={transition.id || idx}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-bold text-gray-900">
                              {transition.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {fromState?.state_name || `#${transition.from_state_id}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {toState?.state_name || `#${transition.to_state_id}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 w-fit ${getModeColor(
                                transition.mode
                              )}`}
                            >
                              {getModeIcon(transition.mode)}
                              {transition.mode.charAt(0).toUpperCase() +
                                transition.mode.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {transition.allowed_role_ids.map((roleId) => (
                                <span
                                  key={roleId}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                                >
                                  {getRoleName(roleId)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transition.mode !== "single" ? (
                              <span className="text-sm font-bold text-gray-900">
                                {transition.min_required}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => onEdit(workflow)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FaEdit className="w-4 h-4" />
                <span>Edit Workflow</span>
              </button>
              <button
                onClick={() => onDelete(workflow)}
                className="px-6 py-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-all flex items-center justify-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
