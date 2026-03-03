// src/components/workflow-states/WorkflowStateList.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import WorkflowStateCard from "./WorkflowStateCard";
import AddWorkflowStateModal from "./AddWorkflowStateModal";
import WorkflowStateDetailModal from "./WorkflowStateDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  useAuth,
} from "@/contexts/AuthContext";
import {
  FaPlus,
  FaSearch,
  FaCircle,
  FaLock,
  FaPalette,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  API_CONFIG,
  apiFetch,
} from "@/config/api";

export type WorkflowState = {
  id: number;
  name: string;
  color: string;
  icon: string;
  docstatus: number;
  created_by: number;
  updated_by: number;
};

// API Response structure - returns array directly
type WorkflowStateAPIResponse = WorkflowState[];

const SNAP_KEY = "ekaplus_workflow_states_snapshot";

export default function WorkflowStateList() {
  const { token, isAuthenticated } = useAuth();
  const [states, setStates] = useState<WorkflowState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<WorkflowState | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<WorkflowState | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load workflow states from API
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

        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await apiFetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as WorkflowStateAPIResponse;
          console.log(response);

          if (!cancelled) {
            console.log("Loaded workflow states:", response);
            setStates(response);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(response));
            } catch (e) {
              console.error("Failed to save snapshot:", e);
            }
          }
        } else {
          if (!cancelled) {
            if (res.status === 401) {
              setError("Session expired. Silakan login kembali.");
            } else if (res.status === 403) {
              setError("Akses ditolak. Anda tidak memiliki izin.");
            } else {
              setError(`Failed to fetch workflow states (${res.status})`);
            }
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan."
            );
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
        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await apiFetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as WorkflowStateAPIResponse;
          setStates(response);
          localStorage.setItem(SNAP_KEY, JSON.stringify(response));
        }
      } catch (error) {
        console.error("Failed to reload workflow states:", error);
      }
    }

    window.addEventListener("ekaplus:workflow_states_update", handler);
    return () =>
      window.removeEventListener("ekaplus:workflow_states_update", handler);
  }, [isAuthenticated, token]);

  function saveSnapshot(arr: WorkflowState[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekaplus:workflow_states_update"));
  }

  function promptDeleteState(state: WorkflowState) {
    setConfirmTitle("Hapus Workflow State");
    setConfirmDesc(`Yakin ingin menghapus state "${state.name}"?`);
    actionRef.current = async () => {
      try {
        if (!token) {
          throw new Error("Not authenticated");
        }

        const headers = getAuthHeaders(token);

        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, state.id),
          {
            method: "DELETE",
            headers,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete state (${response.status})`
          );
        }

        console.log("Workflow state deleted successfully");

        // Remove from local state
        const next = states.filter((x) => x.id !== state.id);
        setStates(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        console.error("Failed to delete workflow state:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
      }
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(state: WorkflowState) {
    setModalInitial(state);
    setModalOpen(true);
  }

  function openDetail(state: WorkflowState) {
    setDetailItem(state);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(state: WorkflowState) {
    closeDetail();
    setTimeout(() => handleEdit(state), 80);
  }

  function onDetailDelete(state: WorkflowState) {
    closeDetail();
    setTimeout(() => promptDeleteState(state), 80);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) {
      await actionRef.current();
      actionRef.current = null;
    }
  }

  function confirmCancel() {
    actionRef.current = null;
    setConfirmOpen(false);
  }

  // Filter states
  let filteredStates = states;

  if (searchQuery.trim()) {
    filteredStates = filteredStates.filter((state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Get unique colors count
  const uniqueColors = Array.from(
    new Set(states.map((s) => s.color).filter(Boolean))
  );

  // Early returns AFTER all hooks
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Diperlukan
          </h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Workflow States.
            Klik tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaCircle className="w-4 h-4" />
            <span>Data workflow states dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat data workflow states...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex flex-col items-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-md">
          <span className="text-sm font-medium">{error}</span>
          {error.includes("terhubung") && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Workflow States
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola state untuk workflow system
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah State</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FaCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              Total States
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {states.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700 font-medium">Active</span>
          </div>
          <div className="text-3xl font-bold text-green-900">
            {states.filter((s) => s.docstatus === 1).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FaPalette className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700 font-medium">Colors</span>
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {uniqueColors.length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari workflow state..."
            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* States Display */}
      {filteredStates.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada workflow state
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada workflow state yang ditambahkan"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStates.map((state) => (
            <WorkflowStateCard
              key={state.id}
              state={state}
              onEdit={() => handleEdit(state)}
              onDelete={() => promptDeleteState(state)}
              onView={() => openDetail(state)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddWorkflowStateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
      />

      <WorkflowStateDetailModal
        open={detailOpen}
        onClose={closeDetail}
        state={detailItem}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
      />
    </div>
  );
}
