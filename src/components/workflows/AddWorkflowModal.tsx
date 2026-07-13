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
        id: ds.id,
        workflow_id: ds.workflow_id,
        state_id: ds.state_id,
        state_name: ds.state_name,
        docstatus: ds.docstatus,
        editable: ds.editable,
        color: ds.color,
        icon: ds.icon,
        created_by: ds.created_by,
        updated_by: ds.updated_by,
      }))
    );

    setTransitions(
      workflowData.transitions.map((t) => ({
        id: t.id,
        workflow_id: t.workflow_id,
        from_state_id: t.from_state_id,
        to_state_id: t.to_state_id,
        action: t.action,
        mode: t.mode,
        allowed_role_ids: t.allowed_role_ids,
        min_required: t.min_required,
        condition_js: t.condition_js,
        before_js: t.before_js,
        after_js: t.after_js,
        auto: t.auto,
        schedule_cron: t.schedule_cron,
        stop_if_fail: t.stop_if_fail,
        created_by: t.created_by,
        updated_by: t.updated_by,
      }))
    );
  };

  const buildDocumentStatePayload = (
    state: SelectedState,
    originalState?: WorkflowWithDetails["document_states"][number],
  ) => {
    const payload = {
      ...(originalState || {}),
      ...state,
      workflow_id:
        state.workflow_id ||
        originalState?.workflow_id ||
        originalWorkflowData?.workflow.id,
      ...(actorId > 0
        ? {
            created_by:
              originalState?.created_by && originalState.created_by > 0
                ? originalState.created_by
                : state.created_by && state.created_by > 0
                  ? state.created_by
                  : actorId,
            updated_by: actorId,
          }
        : {}),
    };

    if (!originalState) {
      delete (payload as { id?: number }).id;
    }

    return payload;
  };

  const buildDocumentStatesPayload = () => {
    if (!isEdit || !originalWorkflowData) {
      return selectedStates.map((state) => buildDocumentStatePayload(state));
    }

    const merged = originalWorkflowData.document_states.map((originalState) => {
      const editedState = selectedStates.find(
        (state) =>
          state.state_id === originalState.state_id ||
          state.state_name === originalState.state_name
      );

      return editedState
        ? buildDocumentStatePayload(editedState, originalState)
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
      .map((state) => buildDocumentStatePayload(state));

    return [...merged, ...appended];
  };

  const buildTransitionPayload = (
    transition: TransitionInput,
    originalTransition?: WorkflowWithDetails["transitions"][number],
  ) => {
    const payload = {
      ...(originalTransition || {}),
      ...transition,
      workflow_id:
        transition.workflow_id ||
        originalTransition?.workflow_id ||
        originalWorkflowData?.workflow.id,
      condition_js: transition.condition_js ?? originalTransition?.condition_js ?? "",
      before_js: transition.before_js ?? originalTransition?.before_js ?? "",
      after_js: transition.after_js ?? originalTransition?.after_js ?? "",
      auto: transition.auto ?? originalTransition?.auto ?? false,
      schedule_cron:
        transition.schedule_cron ?? originalTransition?.schedule_cron ?? "",
      stop_if_fail:
        transition.stop_if_fail ?? originalTransition?.stop_if_fail ?? true,
      ...(actorId > 0
        ? {
            created_by:
              originalTransition?.created_by && originalTransition.created_by > 0
                ? originalTransition.created_by
                : transition.created_by && transition.created_by > 0
                  ? transition.created_by
                  : actorId,
            updated_by: actorId,
          }
        : {}),
    };

    if (!originalTransition) {
      delete (payload as { id?: number }).id;
    }

    return payload;
  };

  const buildTransitionsPayload = () => {
    if (!isEdit || !originalWorkflowData) {
      return transitions.map((transition) => buildTransitionPayload(transition));
    }

    const merged = originalWorkflowData.transitions.map((originalTransition) => {
      const editedTransition = transitions.find(
        (transition) =>
          transition.id !== undefined &&
          transition.id === originalTransition.id
      );

      return editedTransition
        ? buildTransitionPayload(editedTransition, originalTransition)
        : originalTransition;
    });

    const appended = transitions
      .filter(
        (transition) =>
          transition.id === undefined ||
          !originalWorkflowData.transitions.some(
            (originalTransition) => transition.id === originalTransition.id
          )
      )
      .map((transition) => buildTransitionPayload(transition));

    return [...merged, ...appended];
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

      const shouldReloadPage = isEdit && response.status === 200;

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

      if (shouldReloadPage) {
        window.location.reload();
      }
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <FaSitemap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
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
              className="rounded-xl p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              <FaTimes className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Content */}
            <div className="space-y-5 p-6">
              {/* Step indicator */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    currentStep === 1
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  1. Basic Info
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    currentStep === 2
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  2. States
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    currentStep === 3
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  3. Transitions
                </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="rounded-full bg-white px-2.5 py-1">
                    Resource: {resource.trim() || "-"}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1">
                    States: {selectedStates.length}
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1">
                    Transitions: {transitions.length}
                  </span>
                </div>
              </div>

              {/* Validation summary */}
              {validationErrors.length > 0 && !loadingDetail && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FaExclamationTriangle className="h-4 w-4 text-red-600" />
                    <h4 className="text-sm font-bold text-red-900">
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
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-800">
                  Memuat detail workflow terbaru untuk mode edit...
                </div>
              )}

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-purple-100 bg-purple-50/70 p-5">
                    <h3 className="mb-4 text-base font-bold text-purple-900">
                      Informasi Dasar Workflow
                    </h3>

                    {/* Resource */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-purple-900">
                        Resource Slug *
                      </label>
                      <input
                        type="text"
                        value={resource}
                        onChange={(e) => setResource(e.target.value)}
                        placeholder="e.g., customer_register"
                        list="workflow-resource-options"
                        disabled={isEdit || isBusy}
                        className="w-full rounded-xl border border-purple-200 bg-white px-4 py-2.5 font-mono text-sm focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                      />
                      <datalist id="workflow-resource-options">
                        {sortedResources.map((item) => (
                          <option key={item.ID} value={item.Slug}>
                            {item.Module} - {item.Name}
                          </option>
                        ))}
                      </datalist>
                      <p className="mt-1 text-xs text-purple-700">
                        {isEdit
                          ? "Resource tidak bisa diubah saat edit"
                          : "Pilih slug dari master resources atau ketik manual jika belum tersedia"}
                      </p>
                      {!isEdit && resourceMatch && (
                        <div className="mt-2 inline-flex flex-wrap items-center gap-2 rounded-xl border border-purple-100 bg-white px-3 py-2 text-xs text-purple-800">
                          <span className="rounded-full bg-purple-100 px-2 py-1 font-semibold">
                            Module: {resourceMatch.Module || "-"}
                          </span>
                          <span>{resourceMatch.Name}</span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-purple-900">
                        Display Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Product Approval, Order Processing"
                        disabled={isBusy}
                        className="w-full rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                      />
                      <p className="mt-1 text-xs text-purple-700">
                        Nama yang akan ditampilkan di UI
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-purple-900">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Deskripsi workflow (optional)"
                        rows={3}
                        disabled={isBusy}
                        className="w-full resize-none rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                      />
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between rounded-2xl border border-purple-100 bg-white px-4 py-3">
                      <div>
                        <label className="text-sm font-medium text-purple-900">
                          Status Workflow
                        </label>
                        <p className="mt-1 text-xs text-purple-700">
                          Workflow yang aktif akan langsung bisa digunakan
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setIsActive(!isActive)}
                        className={`relative h-8 w-16 rounded-full transition-all ${
                          isActive ? "bg-green-500" : "bg-gray-300"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div
                          className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform ${
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
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Back: Basic Info
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      disabled={isBusy || selectedStates.length < 2}
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                      disabled={isBusy}
                      className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Back: States
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                disabled={isBusy}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit || isBusy}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
