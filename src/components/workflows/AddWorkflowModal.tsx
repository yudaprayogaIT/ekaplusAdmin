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
  getAuthHeaders,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import AddWorkflowStateModal from "@/components/workflow-states/AddWorkflowStateModal";
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
  AuthzResource,
} from "./WorkflowList";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (payload: {
    mode: "create" | "update";
    name: string;
    resource: string;
  }) => void;
  workflow?: WorkflowWithDetails | null;
  globalStates: GlobalState[];
  roles: Role[];
  resources: AuthzResource[];
};

export default function AddWorkflowModal({
  open,
  onClose,
  onSuccess,
  workflow,
  globalStates,
  roles,
  resources,
}: Props) {
  const isEdit = !!workflow;
  const { token, currentUser } = useAuth();
  const actorId = currentUser?.id ? Number(currentUser.id) || 0 : 0;

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
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [originalWorkflowData, setOriginalWorkflowData] =
    useState<WorkflowWithDetails | null>(null);

  const normalizeWorkflowDetail = (payload: unknown): WorkflowWithDetails | null => {
    if (!payload || typeof payload !== "object") {
      return null;
    }

    if ("workflow" in payload) {
      return payload as WorkflowWithDetails;
    }

    if ("data" in payload) {
      const nested = (payload as { data?: unknown }).data;
      if (nested && typeof nested === "object" && "workflow" in nested) {
        return nested as WorkflowWithDetails;
      }
    }

    return null;
  };

  const applyWorkflowToForm = (workflowData: WorkflowWithDetails) => {
    setResource(workflowData.workflow.resource);
    setName(workflowData.workflow.name);
    setDescription(workflowData.workflow.description || "");
    setIsActive(workflowData.workflow.is_active);

    setSelectedStates(
      workflowData.document_states.map((ds) => ({
        state_id: ds.state_id,
        state_name: ds.state_name,
        docstatus: ds.docstatus,
        editable: ds.editable,
        color: ds.color,
        icon: ds.icon,
      }))
    );

    setTransitions(
      workflowData.transitions.map((t) => ({
        id: t.id,
        from_state_id: t.from_state_id,
        to_state_id: t.to_state_id,
        action: t.action,
        mode: t.mode,
        allowed_role_ids: t.allowed_role_ids,
        min_required: t.min_required,
      }))
    );
  };

  const buildDocumentStatesPayload = () => {
    if (!isEdit || !originalWorkflowData) {
      return selectedStates.map((state) => ({
        ...state,
        ...(actorId > 0
          ? {
              created_by: actorId,
              updated_by: actorId,
            }
          : {}),
      }));
    }

    const merged = originalWorkflowData.document_states.map((originalState) => {
      const editedState = selectedStates.find(
        (state) =>
          state.state_id === originalState.state_id ||
          state.state_name === originalState.state_name
      );

      return editedState
        ? {
            ...originalState,
            ...editedState,
            ...(actorId > 0
              ? {
                  created_by:
                    originalState.created_by && originalState.created_by > 0
                      ? originalState.created_by
                      : actorId,
                  updated_by: actorId,
                }
              : {}),
          }
        : originalState;
    });

    const appended = selectedStates
      .filter(
        (state) =>
          !originalWorkflowData.document_states.some(
            (originalState) =>
              originalState.state_id === state.state_id ||
              originalState.state_name === state.state_name
          )
      )
      .map((state) => ({
        ...state,
        ...(actorId > 0
          ? {
              created_by: actorId,
              updated_by: actorId,
            }
          : {}),
      }));

    return [...merged, ...appended];
  };

  const buildTransitionsPayload = () => {
    if (!isEdit || !originalWorkflowData) {
      return transitions.map((transition) => ({
        ...transition,
        ...(actorId > 0
          ? {
              created_by: actorId,
              updated_by: actorId,
            }
          : {}),
      }));
    }

    const merged = originalWorkflowData.transitions.map((originalTransition) => {
      const editedTransition = transitions.find(
        (transition) =>
          (transition as { id?: number }).id === originalTransition.id ||
          (
            transition.from_state_id === originalTransition.from_state_id &&
            transition.to_state_id === originalTransition.to_state_id &&
            transition.action === originalTransition.action
          )
      );

      return editedTransition
        ? {
            ...originalTransition,
            ...editedTransition,
            ...(actorId > 0
              ? {
                  created_by:
                    originalTransition.created_by && originalTransition.created_by > 0
                      ? originalTransition.created_by
                      : actorId,
                  updated_by: actorId,
                }
              : {}),
          }
        : originalTransition;
    });

    const appended = transitions
      .filter(
        (transition) =>
          !originalWorkflowData.transitions.some(
            (originalTransition) =>
              (transition as { id?: number }).id === originalTransition.id ||
              (
                transition.from_state_id === originalTransition.from_state_id &&
                transition.to_state_id === originalTransition.to_state_id &&
                transition.action === originalTransition.action
              )
          )
      )
      .map((transition) => ({
        ...transition,
        ...(actorId > 0
          ? {
              created_by: actorId,
              updated_by: actorId,
            }
          : {}),
      }));

    return [...merged, ...appended];
  };

  const handleStateDocstatusChange = (stateId: number, docstatus: number) => {
    setSelectedStates((current) =>
      current.map((state) =>
        state.state_id === stateId
          ? {
              ...state,
              docstatus,
              editable: docstatus === 0,
            }
          : state
      )
    );
  };

  // Reset form
  const resetForm = () => {
    setResource("");
    setName("");
    setDescription("");
    setIsActive(true);
    setSelectedStates([]);
    setTransitions([]);
    setCurrentStep(1);
    setOriginalWorkflowData(null);
  };

  // Load workflow data for edit
  useEffect(() => {
    if (!open) {
      return;
    }

    if (!isEdit || !workflow) {
      resetForm();
      return;
    }

    const editWorkflow = workflow;
    let cancelled = false;

    async function loadWorkflowDetail() {
      if (!token) {
        applyWorkflowToForm(editWorkflow);
        setOriginalWorkflowData(editWorkflow);
        return;
      }

      setLoadingDetail(true);

      try {
        const headers = getAuthHeaders(token);
        const identifiers = [editWorkflow.workflow.resource, editWorkflow.workflow.id].filter(
          (value): value is string | number => value !== undefined && value !== null
        );

        let detailData: WorkflowWithDetails | null = null;

        for (const identifier of identifiers) {
          const response = await apiFetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}/${identifier}`,
            {
              method: "GET",
              cache: "no-store",
              headers,
            },
            token
          );

          if (!response.ok) {
            continue;
          }

          const payload = await response.json();
          detailData = normalizeWorkflowDetail(payload);
          if (detailData) {
            break;
          }
        }

        const nextWorkflow = detailData || editWorkflow;

        if (!cancelled) {
          setOriginalWorkflowData(nextWorkflow);
          applyWorkflowToForm(nextWorkflow);
        }
      } catch {
        if (!cancelled) {
          setOriginalWorkflowData(editWorkflow);
          applyWorkflowToForm(editWorkflow);
        }
      } finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    }

    void loadWorkflowDetail();

    return () => {
      cancelled = true;
    };
  }, [isEdit, workflow, open, token]);

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
      if (!token) {
        throw new Error("No auth token found");
      }

      const editWorkflow = workflow ?? null;
      if (isEdit && !editWorkflow) {
        throw new Error("Workflow data not found");
      }

      const payload = {
        workflow: {
          ...(originalWorkflowData?.workflow || {}),
          resource: resource.trim(),
          name: name.trim(),
          description: description.trim(),
          is_active: isActive,
          ...(actorId > 0
            ? {
                created_by:
                  originalWorkflowData?.workflow.created_by &&
                  originalWorkflowData.workflow.created_by > 0
                    ? originalWorkflowData.workflow.created_by
                    : actorId,
                updated_by: actorId,
              }
            : {}),
        },
        document_states: buildDocumentStatesPayload(),
        transitions: buildTransitionsPayload(),
      };

      let response;
      if (isEdit && editWorkflow) {
        // PUT for update (by resource)
        response = await apiFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}/${editWorkflow.workflow.resource}`,
          {
            method: "PUT",
            headers: getAuthHeaders(token),
            body: JSON.stringify(payload),
          },
          token
        );
        console.log(payload)
      } else {
        // POST for create
        response = await apiFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}`,
          {
            method: "POST",
            headers: getAuthHeaders(token),
            body: JSON.stringify(payload),
          },
          token
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
      onSuccess?.({
        mode: isEdit ? "update" : "create",
        name: name.trim(),
        resource: resource.trim(),
      });
      onClose();
      resetForm();
    } catch (error) {
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
  const isBusy = loading || loadingDetail;
  const sortedResources = [...resources].sort((a, b) =>
    a.Slug.localeCompare(b.Slug)
  );
  const resourceMatch = sortedResources.find((item) => item.Slug === resource.trim());

  return (
    <AnimatePresence>
      <>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            onClose();
            resetForm();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
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
              disabled={isBusy}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
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
              {validationErrors.length > 0 && !loadingDetail && (
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

              {loadingDetail && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm font-medium text-blue-800">
                  Memuat detail workflow terbaru untuk mode edit...
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
                        Resource Slug *
                      </label>
                      <input
                        type="text"
                        value={resource}
                        onChange={(e) => setResource(e.target.value)}
                        placeholder="e.g., customer_register"
                        list="workflow-resource-options"
                        disabled={isEdit || isBusy}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none font-mono disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <datalist id="workflow-resource-options">
                        {sortedResources.map((item) => (
                          <option key={item.ID} value={item.Slug}>
                            {item.Module} - {item.Name}
                          </option>
                        ))}
                      </datalist>
                      <p className="text-xs text-purple-700 mt-1">
                        {isEdit
                          ? "Resource tidak bisa diubah saat edit"
                          : "Pilih slug dari master resources atau ketik manual jika belum tersedia"}
                      </p>
                      {!isEdit && resourceMatch && (
                        <div className="mt-2 inline-flex flex-wrap items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-purple-800 shadow-sm">
                          <span className="rounded-full bg-purple-100 px-2 py-1 font-semibold">
                            Module: {resourceMatch.Module || "-"}
                          </span>
                          <span>{resourceMatch.Name}</span>
                        </div>
                      )}
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
                        disabled={isBusy}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        disabled={isBusy}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                        disabled={isBusy}
                        onClick={() => setIsActive(!isActive)}
                        className={`relative w-16 h-8 rounded-full transition-all ${
                          isActive ? "bg-green-500" : "bg-gray-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                      disabled={isBusy}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onAddState={() => setStateModalOpen(true)}
                  />

                  {/* Navigation */}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      disabled={isBusy}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back: Basic Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={isBusy || selectedStates.length < 2}
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
                    onStateDocstatusChange={handleStateDocstatusChange}
                  />

                  {/* Navigation */}
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={isBusy}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isBusy}
                className="flex-1 px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || isBusy}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBusy ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{loadingDetail ? "Memuat data..." : "Menyimpan..."}</span>
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

        <AddWorkflowStateModal
          open={stateModalOpen}
          onClose={() => setStateModalOpen(false)}
        />
      </>
    </AnimatePresence>
  );
}
