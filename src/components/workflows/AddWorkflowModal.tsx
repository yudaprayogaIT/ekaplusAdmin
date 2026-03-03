// src/components/workflows/AddWorkflowModal.tsx
"use client";

import {
  useState,
  useEffect,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  FaTimes,
  FaSave,
  FaSitemap,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  API_CONFIG,
  apiFetch,
} from "@/config/api";
import StateManager, {
  GlobalState,
  SelectedState,
} from "./StateManager";
import TransitionManager, {
  TransitionInput,
} from "./TransitionManager";
import {
  WorkflowWithDetails,
  Role,
} from "./WorkflowList";

type Props = {
  open: boolean;
  onClose: () => void;
  workflow?: WorkflowWithDetails | null;
  globalStates: GlobalState[];
  roles: Role[];
};

export default function AddWorkflowModal({
  open,
  onClose,
  workflow,
  globalStates,
  roles,
}: Props) {
  const isEdit = !!workflow;

  // Form state
  const [resource, setResource] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Complex state
  const [selectedStates, setSelectedStates] = useState<SelectedState[]>([]);
  const [transitions, setTransitions] = useState<TransitionInput[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Reset form
  const resetForm = () => {
    setResource("");
    setName("");
    setDescription("");
    setIsActive(true);
    setSelectedStates([]);
    setTransitions([]);
    setCurrentStep(1);
  };

  // Load workflow data for edit
  useEffect(() => {
    if (isEdit && workflow) {
      setResource(workflow.workflow.resource);
      setName(workflow.workflow.name);
      setDescription(workflow.workflow.description || "");
      setIsActive(workflow.workflow.is_active);

      // Convert document_states to SelectedState format
      setSelectedStates(
        workflow.document_states.map((ds) => ({
          state_id: ds.state_id,
          state_name: ds.state_name,
          docstatus: ds.docstatus,
          editable: ds.editable,
          color: ds.color,
          icon: ds.icon,
        }))
      );

      // Convert transitions to TransitionInput format
      setTransitions(
        workflow.transitions.map((t) => ({
          from_state_id: t.from_state_id,
          to_state_id: t.to_state_id,
          action: t.action,
          mode: t.mode,
          allowed_role_ids: t.allowed_role_ids,
          min_required: t.min_required,
        }))
      );
    } else {
      resetForm();
    }
  }, [isEdit, workflow, open]);

  // Validation
  const validate = (): string[] => {
    const errors: string[] = [];

    if (!resource.trim()) {
      errors.push("Resource tidak boleh kosong");
    }

    if (!name.trim()) {
      errors.push("Name tidak boleh kosong");
    }

    if (selectedStates.length < 2) {
      errors.push("Pilih minimal 2 state");
    }

    if (transitions.length < 1) {
      errors.push("Buat minimal 1 transition");
    }

    // Validate each transition
    transitions.forEach((t, idx) => {
      if (t.from_state_id === t.to_state_id) {
        errors.push(`Transition #${idx + 1}: From dan To state tidak boleh sama`);
      }
      if (!t.action.trim()) {
        errors.push(`Transition #${idx + 1}: Action tidak boleh kosong`);
      }
      if (t.allowed_role_ids.length === 0) {
        errors.push(`Transition #${idx + 1}: Pilih minimal 1 role`);
      }
    });

    return errors;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate();
    if (errors.length > 0) {
      alert("Validation errors:\n" + errors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const formData = new FormData();

      // Basic info
      formData.append("Resource", resource.trim());
      formData.append("Name", name.trim());
      formData.append("Description", description.trim());
      formData.append("IsActive", isActive ? "1" : "0");

      // Document states
      formData.append("DocumentStates", JSON.stringify(selectedStates));

      // Transitions
      formData.append("Transitions", JSON.stringify(transitions));

      let response;
      if (isEdit) {
        // PUT for update (by resource)
        response = await apiFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}/${workflow.workflow.resource}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
      } else {
        // POST for create
        response = await apiFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to ${isEdit ? "update" : "create"} workflow: ${errorText}`
        );
      }

      // Trigger event for refresh
      window.dispatchEvent(new Event("ekatalog:workflows_update"));

      // Close modal
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving workflow:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save workflow"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const validationErrors = validate();
  const canSubmit = validationErrors.length === 0;

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
                  {isEdit ? "Edit Workflow" : "Tambah Workflow Baru"}
                </h2>
                <p className="text-sm text-gray-600">
                  Lengkapi semua informasi workflow
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Step indicator */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    currentStep === 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  1. Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    currentStep === 2
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  2. States
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    currentStep === 3
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  3. Transitions
                </button>
              </div>

              {/* Validation summary */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExclamationTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-red-900">
                      {validationErrors.length} Validation Error
                      {validationErrors.length > 1 ? "s" : ""}
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-red-800 font-medium"
                      >
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-purple-900 mb-4">
                      Informasi Dasar Workflow
                    </h3>

                    {/* Resource */}
                    <div className="mb-4">
                      <label className="block font-medium text-purple-900 mb-2">
                        Resource (API Name) *
                      </label>
                      <input
                        type="text"
                        value={resource}
                        onChange={(e) => setResource(e.target.value)}
                        placeholder="e.g., /api/product, /api/order"
                        disabled={isEdit}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none font-mono disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <p className="text-xs text-purple-700 mt-1">
                        {isEdit
                          ? "Resource tidak bisa diubah saat edit"
                          : "Resource name untuk workflow ini (biasanya nama endpoint API)"}
                      </p>
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <label className="block font-medium text-purple-900 mb-2">
                        Display Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Product Approval, Order Processing"
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
                      />
                      <p className="text-xs text-purple-700 mt-1">
                        Nama yang akan ditampilkan di UI
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block font-medium text-purple-900 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Deskripsi workflow (optional)"
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                      <div>
                        <label className="font-medium text-purple-900">
                          Status Workflow
                        </label>
                        <p className="text-xs text-purple-700 mt-1">
                          Workflow yang aktif akan langsung bisa digunakan
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsActive(!isActive)}
                        className={`relative w-16 h-8 rounded-full transition-all ${
                          isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            isActive ? "translate-x-8" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Next button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all"
                    >
                      Next: Select States
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: States */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <StateManager
                    globalStates={globalStates}
                    selectedStates={selectedStates}
                    onChange={setSelectedStates}
                  />

                  {/* Navigation */}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Back: Basic Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={selectedStates.length < 2}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Create Transitions
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Transitions */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <TransitionManager
                    selectedStates={selectedStates}
                    roles={roles}
                    transitions={transitions}
                    onChange={setTransitions}
                  />

                  {/* Navigation */}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Back: States
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    <span>{isEdit ? "Update Workflow" : "Create Workflow"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
