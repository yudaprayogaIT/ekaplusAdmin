// src/components/workflows/WorkflowList.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AddWorkflowModal from "./AddWorkflowModal";
import WorkflowDetailModal from "./WorkflowDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ActionResultModal from "@/components/ui/ActionResultModal";
import EntityPageHeader from "@/components/entity-management/EntityPageHeader";
import EntityTable, {
  EntityTableColumn,
} from "@/components/entity-management/EntityTable";
import {
  FaSearch,
  FaSitemap,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders, API_CONFIG, apiFetch } from "@/config/api";

// Types
export type GlobalState = {
  id: number;
  name: string;
  docstatus: number;
  description?: string;
  color?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
};

export type DocumentState = {
  id?: number;
  workflow_id?: number;
  state_id: number;
  state_name: string;
  docstatus: number;
  editable: boolean;
  color?: string;
  icon?: string;
  created_by?: number;
  updated_by?: number;
};

export type Transition = {
  id?: number;
  workflow_id?: number;
  from_state_id: number;
  to_state_id: number;
  action: string;
  mode: "single" | "parallel" | "sequence";
  allowed_role_ids: number[];
  min_required: number;
  condition_js?: string;
  before_js?: string;
  after_js?: string;
  auto?: boolean;
  schedule_cron?: string;
  stop_if_fail?: boolean;
  created_by?: number;
  updated_by?: number;
};

export type WorkflowWithDetails = {
  workflow: {
    id?: number;
    resource: string;
    name: string;
    description?: string;
    is_active: boolean;
    created_by?: number;
    updated_by?: number;
  };
  document_states: DocumentState[];
  transitions: Transition[];
};

export type Role = {
  ID: number;
  Name: string;
  Slug: string;
  Description: string;
  IsSystem: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

export type AuthzResource = {
  ID: number;
  Module: string;
  Name: string;
  Slug: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type RoleAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Role[];
};

type ResourceAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: AuthzResource[];
};

function normalizeWorkflowResponse(payload: unknown): WorkflowWithDetails[] {
  if (Array.isArray(payload)) {
    return payload as WorkflowWithDetails[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: WorkflowWithDetails[] }).data;
  }

  return [];
}

function normalizeGlobalStateResponse(payload: unknown): GlobalState[] {
  if (Array.isArray(payload)) {
    return payload as GlobalState[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: GlobalState[] }).data;
  }

  return [];
}

export default function WorkflowList() {
  const { token, isAuthenticated } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowWithDetails[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [globalStates, setGlobalStates] = useState<GlobalState[]>([]);
  const [resources, setResources] = useState<AuthzResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<WorkflowWithDetails | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailWorkflow, setDetailWorkflow] =
    useState<WorkflowWithDetails | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const [confirmAction, setConfirmAction] = useState<
    (() => Promise<void>) | null
  >(null);
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    description?: string;
    details?: { label: string; value: string }[];
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  async function fetchGlobalStates(tokenValue: string): Promise<GlobalState[]> {
    const headers = getAuthHeaders(tokenValue);
    const response = await apiFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW_STATE}`,
      {
        method: "GET",
        cache: "no-store",
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch workflow states (${response.status})`);
    }

    const payload = await response.json();
    return normalizeGlobalStateResponse(payload);
  }

  // Load data from APIs
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          setLoading(false);
          return;
        }

        const headers = getAuthHeaders(token);

        // Fetch all data in parallel
        const [workflowsRes, rolesRes, statesRes, resourcesRes] =
          await Promise.all([
            apiFetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}`, {
              method: "GET",
              cache: "no-store",
              headers,
            }),
            apiFetch(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`,
              {
                method: "GET",
                cache: "no-store",
                headers,
              },
            ),
            apiFetch(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW_STATE}`,
              {
                method: "GET",
                cache: "no-store",
                headers,
              },
            ),
            apiFetch(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_RESOURCE}`,
              {
                method: "GET",
                cache: "no-store",
                headers,
              },
            ),
          ]);

        if (workflowsRes.ok && rolesRes.ok && statesRes.ok && resourcesRes.ok) {
          const workflowsData = await workflowsRes.json();
          const rolesData = (await rolesRes.json()) as RoleAPIResponse;
          const statesData = await statesRes.json();
          const resourcesData =
            (await resourcesRes.json()) as ResourceAPIResponse;

          if (!cancelled) {
            setWorkflows(normalizeWorkflowResponse(workflowsData));
            setRoles(rolesData.data || []);
            setGlobalStates(normalizeGlobalStateResponse(statesData));
            setResources(resourcesData.data || []);
          }
        } else {
          throw new Error("Failed to load data");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
          } else if (errorMessage.includes("401")) {
            setError("Session expired. Silakan login kembali.");
          } else if (errorMessage.includes("403")) {
            setError("Akses ditolak. Anda tidak memiliki izin.");
          } else {
            setError(errorMessage);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const nextStates = await fetchGlobalStates(token);
        setGlobalStates(nextStates);
      } catch {}
    }

    window.addEventListener("ekaplus:workflow_states_update", handler);
    return () =>
      window.removeEventListener("ekaplus:workflow_states_update", handler);
  }, [isAuthenticated, token]);

  // Listen for updates
  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const headers = getAuthHeaders(token);
        const res = await apiFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}`,
          {
            method: "GET",
            cache: "no-store",
            headers,
          },
        );

        if (res.ok) {
          const response = await res.json();
          setWorkflows(normalizeWorkflowResponse(response));
        }
      } catch {}
    }

    window.addEventListener("ekatalog:workflows_update", handler);
    return () =>
      window.removeEventListener("ekatalog:workflows_update", handler);
  }, [isAuthenticated, token]);

  // Filter workflows based on search
  let displayedWorkflows = workflows;
  if (searchQuery.trim()) {
    displayedWorkflows = displayedWorkflows.filter(
      (wf) =>
        wf.workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.workflow.resource
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (wf.workflow.description &&
          wf.workflow.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())),
    );
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(workflow: WorkflowWithDetails) {
    setModalInitial(workflow);
    setModalOpen(true);
  }

  function handleWorkflowSaved(payload: {
    mode: "create" | "update";
    name: string;
    resource: string;
  }) {
    setResultModal({
      isOpen: true,
      type: "success",
      title:
        payload.mode === "create"
          ? "Workflow Berhasil Dibuat"
          : "Workflow Berhasil Diperbarui",
      message:
        payload.mode === "create"
          ? `Workflow "${payload.name}" berhasil dibuat`
          : `Workflow "${payload.name}" berhasil diperbarui`,
      description:
        "Perubahan sudah tersimpan dan daftar workflow akan otomatis diperbarui.",
      details: [
        { label: "Resource", value: payload.resource || "-" },
        { label: "Nama Workflow", value: payload.name || "-" },
      ],
    });
  }

  function promptDeleteWorkflow(workflow: WorkflowWithDetails) {
    setConfirmTitle("Hapus Workflow");
    setConfirmDesc(
      `Yakin ingin menghapus workflow "${workflow.workflow.name}"?`,
    );
    setConfirmAction(() => async () => {
      await deleteWorkflow(workflow);
    });
    setConfirmOpen(true);
  }

  async function deleteWorkflow(workflow: WorkflowWithDetails) {
    if (!token || !workflow.workflow.id) return;

    try {
      const headers = getAuthHeaders(token);
      const DELETE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}/${workflow.workflow.id}`;

      const res = await apiFetch(DELETE_URL, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        window.dispatchEvent(new Event("ekatalog:workflows_update"));
        setConfirmOpen(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete workflow");
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus workflow. Silakan coba lagi.",
      );
    }
  }

  function openDetail(workflow: WorkflowWithDetails) {
    setDetailWorkflow(workflow);
    setDetailOpen(true);
  }

  function onDetailEdit(workflow: WorkflowWithDetails) {
    setDetailOpen(false);
    setTimeout(() => handleEdit(workflow), 100);
  }

  function onDetailDelete(workflow: WorkflowWithDetails) {
    setDetailOpen(false);
    setTimeout(() => promptDeleteWorkflow(workflow), 100);
  }

  async function executeConfirmAction() {
    if (confirmAction) {
      await confirmAction();
    }
    setConfirmOpen(false);
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat workflows...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSitemap className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Workflows
            </h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeWorkflows = workflows.filter((wf) => wf.workflow.is_active);
  const inactiveWorkflows = workflows.filter((wf) => !wf.workflow.is_active);
  const resourceNameBySlug = new Map(
    resources.map((resource) => [resource.Slug, resource.Name]),
  );

  const columns: EntityTableColumn<WorkflowWithDetails>[] = [
    {
      key: "name",
      header: "Workflow Name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <FaSitemap className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {item.workflow.name}
            </p>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openDetail(item);
              }}
              className="text-xs font-medium text-purple-500 hover:text-purple-600"
            >
              Lihat detail
            </button>
          </div>
        </div>
      ),
    },
    // {
    //   key: "resource",
    //   header: "Resource",
    //   render: (item) => (
    //     <div className="space-y-1">
    //       <code className="inline-flex rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
    //         {item.workflow.resource}
    //       </code>
    //       <p className="text-xs text-gray-500">
    //         {resourceNameBySlug.get(item.workflow.resource) || "-"}
    //       </p>
    //     </div>
    //   ),
    // },
    {
      key: "status",
      header: "Status",
      render: (item) =>
        item.workflow.is_active ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
            <FaCheckCircle className="h-3 w-3" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
            <FaTimesCircle className="h-3 w-3" />
            Inactive
          </span>
        ),
    },
    {
      key: "states",
      header: "States",
      className: "whitespace-nowrap",
      cellClassName: "text-sm text-gray-600 whitespace-nowrap",
      render: (item) => `${item.document_states.length} state`,
    },
    {
      key: "transitions",
      header: "Transitions",
      className: "whitespace-nowrap",
      cellClassName: "text-sm text-gray-600 whitespace-nowrap",
      render: (item) => `${item.transitions.length} transisi`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
      <div className="mx-auto space-y-6">
        <EntityPageHeader
          icon={<FaSitemap className="w-5 h-5" />}
          title="Workflows"
          description="Kelola workflow dan approval flow untuk sistem."
          addLabel="Tambah Workflow"
          onAdd={handleAdd}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari workflow berdasarkan nama, resource, atau deskripsi..."
          summary={
            <>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                Total {workflows.length} workflow
              </span>
              <span className="text-gray-500">
                {activeWorkflows.length} aktif, {inactiveWorkflows.length}{" "}
                nonaktif
              </span>
            </>
          }
          accentClasses={{
            iconBg: "bg-purple-50",
            iconText: "text-purple-600",
            buttonBg: "bg-gradient-to-r from-purple-600 to-purple-700",
            buttonShadow: "shadow-purple-200",
            searchRing: "focus:ring-purple-500",
          }}
        />

        {globalStates.length === 0 && (
          <div className="flex items-start gap-4 rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <FaInfoCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" />
            <div className="flex-1">
              <h3 className="mb-2 text-base font-bold text-blue-900">
                Belum Ada Global States
              </h3>
              <p className="mb-3 text-sm text-blue-700">
                Sebelum membuat workflow, Anda perlu membuat global states
                terlebih dahulu.
              </p>
              <Link
                href="/workflow-states"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <FaSitemap className="h-4 w-4" />
                Kelola Global States
              </Link>
            </div>
          </div>
        )}

        {displayedWorkflows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tidak ada workflow
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Belum ada workflow yang ditambahkan"}
            </p>
          </div>
        ) : (
          <EntityTable
            columns={columns}
            rows={displayedWorkflows}
            getRowKey={(workflow) =>
              workflow.workflow.id || workflow.workflow.resource
            }
            onRowClick={openDetail}
            footer={
              <>
                <span>Click row untuk lihat detail workflow</span>
                <span>Showing {displayedWorkflows.length} workflows</span>
              </>
            }
          />
        )}
      </div>

      <AddWorkflowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleWorkflowSaved}
        workflow={modalInitial}
        roles={roles}
        globalStates={globalStates}
        resources={resources}
      />

      <WorkflowDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        workflow={detailWorkflow}
        roles={roles}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={executeConfirmAction}
        onCancel={() => setConfirmOpen(false)}
      />

      <ActionResultModal
        isOpen={resultModal.isOpen}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        description={resultModal.description}
        details={resultModal.details}
        onClose={() =>
          setResultModal((current) => ({
            ...current,
            isOpen: false,
          }))
        }
      />
    </div>
  );
}
