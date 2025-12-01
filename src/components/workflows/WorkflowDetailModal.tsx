// src/components/workflows/WorkflowDetailModal.tsx
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  FaTimes, FaEdit, FaTrash, FaProjectDiagram, FaCircle, FaArrowRight,
  FaCheckCircle, FaTimesCircle, FaBell, FaKey, FaUserShield, FaComment
} from "react-icons/fa";
import type { Workflow, WorkflowState, WorkflowTransition } from "./WorkflowList";

function getButtonColorClass(color: string): string {
  switch (color) {
    case 'primary': return 'bg-blue-500 text-white';
    case 'success': return 'bg-green-500 text-white';
    case 'warning': return 'bg-yellow-500 text-white';
    case 'danger': return 'bg-red-500 text-white';
    case 'info': return 'bg-cyan-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
}

export default function WorkflowDetailModal({
  open,
  onClose,
  workflow,
  states,
  transitions,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  workflow?: Workflow | null;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  onEdit?: (w: Workflow) => void;
  onDelete?: (w: Workflow) => void;
}) {
  const [activeTab, setActiveTab] = useState<'states' | 'transitions'>('states');

  if (!workflow) return null;

  const initialState = states.find(s => s.is_initial);
  const finalStates = states.filter(s => s.is_final);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div 
              className="px-8 py-10 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${workflow.color} 0%, ${workflow.color}dd 100%)` }}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />
              
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative flex items-start gap-6">
                {/* Icon */}
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-white/30 flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <FaProjectDiagram className="w-12 h-12" />
                </div>

                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold capitalize">
                      {workflow.document_type}
                    </span>
                    <span className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1 ${
                      workflow.is_active ? 'bg-green-500/90' : 'bg-gray-500/90'
                    }`}>
                      {workflow.is_active ? (
                        <>
                          <FaCheckCircle className="w-3 h-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="w-3 h-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold mb-2">{workflow.display_name}</h2>
                  <p className="text-white/80">{workflow.description}</p>
                  <code className="inline-block mt-2 px-3 py-1 bg-black/20 rounded-lg text-sm font-mono">
                    {workflow.name}
                  </code>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">States</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-900">{states.length}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaArrowRight className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-bold text-orange-900">Transitions</span>
                  </div>
                  <div className="text-3xl font-bold text-orange-900">{transitions.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-900">Initial State</span>
                  </div>
                  <div className="text-lg font-bold text-green-900 truncate">
                    {initialState?.display_name || '-'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaTimesCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Final States</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">{finalStates.length}</div>
                </div>
              </div>

              {/* Visual Flow Diagram */}
              <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Workflow Flow</h3>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {states.map((state, idx) => (
                    <React.Fragment key={state.id}>
                      <div className="flex flex-col items-center min-w-[120px]">
                        <div 
                          className="px-4 py-2 rounded-xl text-white font-semibold text-sm text-center shadow-lg"
                          style={{ backgroundColor: state.color }}
                        >
                          {state.display_name}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {state.is_initial && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                              Start
                            </span>
                          )}
                          {state.is_final && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                              End
                            </span>
                          )}
                          {state.allow_edit && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Editable
                            </span>
                          )}
                        </div>
                      </div>
                      {idx < states.length - 1 && (
                        <div className="flex-shrink-0">
                          <FaArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab('states')}
                  className={`flex-1 px-6 py-3 text-sm font-semibold transition-all ${
                    activeTab === 'states'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaCircle className="w-4 h-4 inline-block mr-2" />
                  States ({states.length})
                </button>
                <button
                  onClick={() => setActiveTab('transitions')}
                  className={`flex-1 px-6 py-3 text-sm font-semibold transition-all ${
                    activeTab === 'transitions'
                      ? 'text-red-600 border-b-2 border-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FaArrowRight className="w-4 h-4 inline-block mr-2" />
                  Transitions ({transitions.length})
                </button>
              </div>

              {/* States Tab */}
              {activeTab === 'states' && (
                <div className="space-y-3">
                  {states.map((state) => (
                    <div 
                      key={state.id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: state.bg_color }}
                      >
                        <FaCircle className="w-5 h-5" style={{ color: state.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800">{state.display_name}</span>
                          <code className="text-xs text-gray-400 font-mono">{state.name}</code>
                        </div>
                        <p className="text-sm text-gray-500">{state.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {state.is_initial && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Initial
                          </span>
                        )}
                        {state.is_final && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            Final
                          </span>
                        )}
                        {state.allow_edit && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            Editable
                          </span>
                        )}
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                          Seq: {state.sequence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Transitions Tab */}
              {activeTab === 'transitions' && (
                <div className="space-y-4">
                  {transitions.map((transition) => {
                    const fromState = states.find(s => s.name === transition.from_state);
                    const toState = states.find(s => s.name === transition.to_state);

                    return (
                      <div 
                        key={transition.id}
                        className="p-5 rounded-xl border-2 border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span 
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getButtonColorClass(transition.button_color)}`}
                            >
                              {transition.button_label}
                            </span>
                            <code className="text-xs text-gray-400 font-mono">{transition.name}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            {transition.requires_comment && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                <FaComment className="w-3 h-3" />
                                Comment Required
                              </span>
                            )}
                          </div>
                        </div>

                        {/* State Flow */}
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div 
                            className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold"
                            style={{ backgroundColor: fromState?.color || '#6B7280' }}
                          >
                            {fromState?.display_name || transition.from_state}
                          </div>
                          <FaArrowRight className="w-4 h-4 text-gray-400" />
                          <div 
                            className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold"
                            style={{ backgroundColor: toState?.color || '#6B7280' }}
                          >
                            {toState?.display_name || transition.to_state}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Allowed Roles */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <FaUserShield className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-semibold text-gray-700">Allowed Roles</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {transition.allowed_roles.map(role => (
                                <span 
                                  key={role}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Required Permissions */}
                          {transition.required_permissions.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <FaKey className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-semibold text-gray-700">Required Permissions</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {transition.required_permissions.map(perm => (
                                  <span 
                                    key={perm}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                  >
                                    {perm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        {transition.actions.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <FaBell className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-semibold text-gray-700">Actions ({transition.actions.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {transition.actions.map((action, idx) => (
                                <span 
                                  key={idx}
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium"
                                >
                                  {action.type}
                                  {action.template && `: ${action.template}`}
                                  {action.field && `: ${action.field}`}
                                  {action.code_type && `: ${action.code_type}`}
                                  {action.tier && `: ${action.tier}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Confirm Message */}
                        {transition.confirm_message && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                            <strong>Confirmation:</strong> {transition.confirm_message}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-6 mt-6 border-t-2 border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(workflow)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                >
                  <FaEdit className="w-5 h-5" />
                  <span>Edit Workflow</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete?.(workflow)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                >
                  <FaTrash className="w-5 h-5" />
                  <span>Hapus</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}