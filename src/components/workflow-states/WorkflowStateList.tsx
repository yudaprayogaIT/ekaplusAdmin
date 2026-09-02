"use client";

import React, { useEffect, useRef, useState } from "react";
import AddWorkflowStateModal from "./AddWorkflowStateModal";
import WorkflowStateDetailModal from "./WorkflowStateDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EntityPageHeader from "@/components/entity-management/EntityPageHeader";
import EntityTable, {
  EntityTableColumn,
} from "@/components/entity-management/EntityTable";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaCircle,
  FaLock,
  FaPalette,
  FaSortAmountDown,
} from "react-icons/fa";
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
  updated_by_name?: string;
};

type WorkflowStateAPIRow = Omit<WorkflowState, "updated_by"> & {
  updated_by: number | { id?: number; full_name?: string };
  "updated_by.full_name"?: string;
};

type WorkflowStateAPIResponse = WorkflowStateAPIRow[];
type SortOption =
  | "name-asc"
  | "name-desc"
  | "id-asc"
  | "id-desc"
  | "active-first"
  | "draft-first";

const SNAP_KEY = "ekaplus_workflow_states_snapshot";

function mapWorkflowState(row: WorkflowStateAPIRow): WorkflowState {
  const updatedByObject =
    typeof row.updated_by === "object" && row.updated_by
      ? row.updated_by
      : null;

  return {
    ...row,
    updated_by:
      updatedByObject?.id ??
      (typeof row.updated_by === "number" ? row.updated_by : 0),
    updated_by_name:
      updatedByObject?.full_name || row["updated_by.full_name"] || undefined,
  };
}

export default function WorkflowStateList() {
  const { token, isAuthenticated } = useAuth();
  const [states, setStates] = useState<WorkflowState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<WorkflowState | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<WorkflowState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

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

        const dataUrl = getQueryUrl(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, {
          fields: ["*", "updated_by.full_name"],
        });
        const headers = getAuthHeaders(token);

        const res = await apiFetch(dataUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as WorkflowStateAPIResponse;
          if (!cancelled) {
            const mappedStates = response.map(mapWorkflowState);
            setStates(mappedStates);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(mappedStates));
            } catch {}
          }
        } else if (!cancelled) {
          if (res.status === 401) {
            setError("Session expired. Silakan login kembali.");
          } else if (res.status === 403) {
            setError("Akses ditolak. Anda tidak memiliki izin.");
          } else {
            setError(`Failed to fetch workflow states (${res.status})`);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan.",
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

  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const dataUrl = getQueryUrl(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, {
          fields: ["*", "updated_by.full_name"],
        });
        const headers = getAuthHeaders(token);

        const res = await apiFetch(dataUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as WorkflowStateAPIResponse;
          const mappedStates = response.map(mapWorkflowState);
          setStates(mappedStates);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedStates));
        }
      } catch {}
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
        if (!token) throw new Error("Not authenticated");

        const headers = getAuthHeaders(token);
        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.WORKFLOW_STATE, state.id),
          {
            method: "DELETE",
            headers,
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete state (${response.status})`,
          );
        }

        const next = states.filter((x) => x.id !== state.id);
        setStates(next);
        saveSnapshot(next);
      } catch (err: unknown) {
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

  let filteredStates = states;
  if (searchQuery.trim()) {
    filteredStates = filteredStates.filter((state) =>
      state.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  filteredStates = [...filteredStates].sort((left, right) => {
    switch (sortBy) {
      case "name-desc":
        return right.name.localeCompare(left.name, "id", {
          sensitivity: "base",
        });
      case "id-asc":
        return left.id - right.id;
      case "id-desc":
        return right.id - left.id;
      case "active-first":
        return (
          right.docstatus - left.docstatus ||
          left.name.localeCompare(right.name, "id", { sensitivity: "base" })
        );
      case "draft-first":
        return (
          left.docstatus - right.docstatus ||
          left.name.localeCompare(right.name, "id", { sensitivity: "base" })
        );
      case "name-asc":
      default:
        return left.name.localeCompare(right.name, "id", {
          sensitivity: "base",
        });
    }
  });

  const uniqueColors = Array.from(
    new Set(states.map((s) => s.color).filter(Boolean)),
  );
  const activeStates = states.filter((s) => s.docstatus === 1).length;

  const columns: EntityTableColumn<WorkflowState>[] = [
    {
      key: "name",
      header: "State Name",
      render: (state) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: state.color || "#6B7280" }}
          >
            {state.icon ? state.icon.slice(0, 1).toUpperCase() : <FaCircle className="h-3.5 w-3.5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{state.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openDetail(state);
              }}
              className="text-xs font-medium text-red-500 hover:text-red-600"
            >
              Lihat detail
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (state) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            state.docstatus === 1
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {state.docstatus === 1 ? "Active" : "Draft"}
        </span>
      ),
    },
    {
      key: "color",
      header: "Color",
      render: (state) => (
        <div className="flex items-center gap-2">
          <span
            className="h-4 w-4 rounded-md border border-white shadow-sm"
            style={{ backgroundColor: state.color || "#6B7280" }}
          />
          <code className="text-[11px] text-gray-600">
            {(state.color || "#6B7280").toUpperCase()}
          </code>
        </div>
      ),
    },
    {
      key: "icon",
      header: "Icon",
      render: (state) => (
        <code className="inline-flex rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
          {state.icon || "-"}
        </code>
      ),
    },
    {
      key: "updatedBy",
      header: "Updated By",
      className: "whitespace-nowrap",
      cellClassName: "text-sm text-gray-500 whitespace-nowrap",
      render: (state) =>
        state.updated_by_name || (state.updated_by ? "Unknown User" : "System"),
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto flex items-center justify-center py-20">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <FaLock className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-gray-800">
              Login Diperlukan
            </h2>
            <p className="mb-6 text-gray-600">
              Silakan login terlebih dahulu untuk mengakses data Workflow
              States. Klik tombol Login di pojok kanan atas.
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
              <FaCircle className="h-4 w-4" />
              <span>Data workflow states dilindungi untuk keamanan</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto">
          <div className="text-center py-16">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-200 border-t-red-500"></div>
            <p className="text-gray-600">Memuat workflow states...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto">
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <FaPalette className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Error Loading Workflow States
            </h3>
            <p className="mb-4 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-2 text-white transition-all hover:shadow-lg"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
      <div className="mx-auto space-y-6">
        <EntityPageHeader
          icon={<FaPalette className="w-5 h-5" />}
          title="Workflow States"
          description="Kelola state untuk workflow system."
          addLabel="Tambah State"
          onAdd={handleAdd}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari workflow state..."
          rightInfo={
            <div className="relative">
              <FaSortAmountDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                aria-label="Urutkan workflow state"
                className="min-w-[190px] appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-red-500"
              >
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="id-asc">ID: Lama-Terbaru</option>
                <option value="id-desc">ID: Terbaru-Lama</option>
                <option value="active-first">Status: Active</option>
                <option value="draft-first">Status: Draft</option>
              </select>
            </div>
          }
          summary={
            <>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                Total {states.length} state
              </span>
              <span className="text-gray-500">
                {activeStates} active, {uniqueColors.length} warna digunakan
              </span>
            </>
          }
          accentClasses={{
            iconBg: "bg-red-50",
            iconText: "text-red-600",
            buttonBg: "bg-gradient-to-r from-red-600 to-red-700",
            buttonShadow: "shadow-red-200",
            searchRing: "focus:ring-red-500",
          }}
        />

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
          <EntityTable
            columns={columns}
            rows={filteredStates}
            getRowKey={(state) => state.id}
            onRowClick={openDetail}
            footer={
              <>
                <span>Click row untuk lihat detail workflow state</span>
                <span>Showing {filteredStates.length} states</span>
              </>
            }
          />
        )}
      </div>

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
