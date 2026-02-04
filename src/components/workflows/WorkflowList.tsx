// src/components/workflows/WorkflowList.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WorkflowCard from "./WorkflowCard";
import AddWorkflowModal from "./AddWorkflowModal";
import WorkflowDetailModal from "./WorkflowDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaPlus,
  FaSearch,
  FaList,
  FaTh,
  FaSitemap,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders, API_CONFIG } from "@/config/api";

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

type WorkflowAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: WorkflowWithDetails[];
  meta?: {
    request_id: string;
    trace_id: string;
    timestamp: string;
    processing_time_ms: number;
  };
};

type RoleAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Role[];
};

type GlobalStateAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: GlobalState[];
};

export default function WorkflowList() {
  const { token, isAuthenticated } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowWithDetails[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [globalStates, setGlobalStates] = useState<GlobalState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<WorkflowWithDetails | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailWorkflow, setDetailWorkflow] = useState<WorkflowWithDetails | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);

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
        const [workflowsRes, rolesRes, statesRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}`, {
            method: "GET",
            cache: "no-store",
            headers,
          }),
          fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`, {
            method: "GET",
            cache: "no-store",
            headers,
          }),
          fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW_STATE}`, {
            method: "GET",
            cache: "no-store",
            headers,
          }),
        ]);

        console.log("[WorkflowList] Workflows response:", workflowsRes.status);
        console.log("[WorkflowList] Roles response:", rolesRes.status);
        console.log("[WorkflowList] States response:", statesRes.status);

        if (workflowsRes.ok && rolesRes.ok && statesRes.ok) {
          const workflowsData = (await workflowsRes.json()) as WorkflowAPIResponse;
          const rolesData = (await rolesRes.json()) as RoleAPIResponse;
          const statesData = (await statesRes.json()) as GlobalStateAPIResponse;

          if (!cancelled) {
            setWorkflows(workflowsData.data || []);
            setRoles(rolesData.data || []);
            setGlobalStates(statesData.data || []);
            console.log("[WorkflowList] Loaded:", {
              workflows: workflowsData.data?.length || 0,
              roles: rolesData.data?.length || 0,
              states: statesData.data?.length || 0,
            });
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

  // Listen for updates
  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const headers = getAuthHeaders(token);
        const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.WORKFLOW}`, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as WorkflowAPIResponse;
          setWorkflows(response.data || []);
        }
      } catch (error) {
        console.error("Failed to reload workflows:", error);
      }
    }

    window.addEventListener("ekatalog:workflows_update", handler);
    return () => window.removeEventListener("ekatalog:workflows_update", handler);
  }, [isAuthenticated, token]);

  // Filter workflows based on search
  let displayedWorkflows = workflows;
  if (searchQuery.trim()) {
    displayedWorkflows = displayedWorkflows.filter(
      (wf) =>
        wf.workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wf.workflow.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (wf.workflow.description &&
          wf.workflow.description.toLowerCase().includes(searchQuery.toLowerCase()))
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

  function promptDeleteWorkflow(workflow: WorkflowWithDetails) {
    setConfirmTitle("Hapus Workflow");
    setConfirmDesc(`Yakin ingin menghapus workflow "${workflow.workflow.name}"?`);
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

      console.log("[WorkflowList] Deleting workflow at:", DELETE_URL);

      const res = await fetch(DELETE_URL, {
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
      console.error("Failed to delete workflow:", error);
      alert(
        error instanceof Error ? error.message : "Gagal menghapus workflow. Silakan coba lagi."
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Workflows
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Kelola workflow dan approval flow untuk sistem
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Workflow</span>
          </motion.button>
        </div>

        {/* Info Banner - Link to workflow-state */}
        {globalStates.length === 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 flex items-start gap-4">
            <FaInfoCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Belum Ada Global States
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Sebelum membuat workflow, Anda perlu membuat global states terlebih dahulu
                (Draft, Submitted, Approved, dll).
              </p>
              <Link
                href="/workflow-state"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FaSitemap className="w-4 h-4" />
                Kelola Global States
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Total Workflows
                </p>
                <p className="text-3xl font-bold">{workflows.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaSitemap className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  Active Workflows
                </p>
                <p className="text-3xl font-bold">{activeWorkflows.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm font-medium mb-1">
                  Inactive Workflows
                </p>
                <p className="text-3xl font-bold">{inactiveWorkflows.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaTimesCircle className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari workflow berdasarkan nama, resource..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Grid View"
              >
                <FaTh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="List View"
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Workflows Display */}
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
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {displayedWorkflows.map((workflow, index) => (
              <WorkflowCard
                key={workflow.workflow.id || index}
                workflow={workflow}
                viewMode={viewMode}
                roles={roles}
                onEdit={() => handleEdit(workflow)}
                onDelete={() => promptDeleteWorkflow(workflow)}
                onView={() => openDetail(workflow)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddWorkflowModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        workflow={modalInitial}
        roles={roles}
        globalStates={globalStates}
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
    </div>
  );
}
