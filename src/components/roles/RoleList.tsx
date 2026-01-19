// src/components/roles/RoleList.tsx
"use client";

import { useEffect, useState } from "react";
import RoleCard from "./RoleCard";
import AddRoleModal from "./AddRoleModal";
import RoleDetailModal from "./RoleDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaPlus,
  FaSearch,
  FaList,
  FaTh,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders, API_CONFIG } from "@/config/api";

export type Role = {
  ID: number;
  Name: string;
  Slug: string;
  Description: string;
  IsSystem: boolean;
  CreatedAt: string;
  UpdatedAt: string;
};

type RoleAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Role[];
  meta: {
    request_id: string;
    trace_id: string;
    timestamp: string;
    processing_time_ms: number;
  };
};

export default function RoleList() {
  const { token, isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Role | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRole, setDetailRole] = useState<Role | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);

  // Load roles from API
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
        const DATA_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`;

        console.log("[RoleList] Fetching roles from:", DATA_URL);

        const res = await fetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        console.log("[RoleList] Response status:", res.status);
        console.log("[RoleList] Response content-type:", res.headers.get("content-type"));

        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("[RoleList] Non-JSON response:", text.substring(0, 200));
            throw new Error("Server returned non-JSON response. Please check the API endpoint.");
          }

          const response = (await res.json()) as RoleAPIResponse;
          console.log("[RoleList] Roles loaded:", response.data?.length || 0);
          const mappedRoles: Role[] = response.data;

          if (!cancelled) {
            setRoles(mappedRoles);
          }
        } else {
          const errorText = await res.text();
          console.error("[RoleList] Error response:", errorText.substring(0, 200));
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan."
            );
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
        const DATA_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`;

        console.log("[RoleList] Auto-reloading roles from:", DATA_URL);

        const res = await fetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as RoleAPIResponse;
          console.log("[RoleList] Roles reloaded successfully:", response.data?.length || 0);
          setRoles(response.data);
        }
      } catch (error) {
        console.error("Failed to reload roles:", error);
      }
    }

    window.addEventListener("ekatalog:roles_update", handler);
    return () => window.removeEventListener("ekatalog:roles_update", handler);
  }, [isAuthenticated, token]);

  // Filter roles based on search
  let displayedRoles = roles;
  if (searchQuery.trim()) {
    displayedRoles = displayedRoles.filter(
      (role) =>
        role.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.Slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.Description &&
          role.Description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(role: Role) {
    setModalInitial(role);
    setModalOpen(true);
  }

  function promptDeleteRole(role: Role) {
    if (role.IsSystem) {
      alert("System roles cannot be deleted!");
      return;
    }

    setConfirmTitle("Hapus Role");
    setConfirmDesc(`Yakin ingin menghapus role "${role.Name}"?`);
    setConfirmAction(() => async () => {
      await deleteRole(role);
    });
    setConfirmOpen(true);
  }

  async function deleteRole(role: Role) {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);
      const DELETE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}/${role.ID}`;

      console.log("[RoleList] Deleting role at:", DELETE_URL);

      const res = await fetch(DELETE_URL, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        window.dispatchEvent(new Event("ekatalog:roles_update"));
        setConfirmOpen(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete role");
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
      alert(
        error instanceof Error ? error.message : "Gagal menghapus role. Silakan coba lagi."
      );
    }
  }

  function openDetail(role: Role) {
    setDetailRole(role);
    setDetailOpen(true);
  }

  function onDetailEdit(role: Role) {
    setDetailOpen(false);
    setTimeout(() => handleEdit(role), 100);
  }

  function onDetailDelete(role: Role) {
    setDetailOpen(false);
    setTimeout(() => promptDeleteRole(role), 100);
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
            <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat roles...</p>
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
              <FaUserShield className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Roles
            </h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Roles & Permissions
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Kelola roles dan hak akses pengguna
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Role</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">
                  Total Roles
                </p>
                <p className="text-3xl font-bold">{roles.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaUserShield className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">
                  System Roles
                </p>
                <p className="text-3xl font-bold">
                  {roles.filter((r) => r.IsSystem).length}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaUserShield className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">
                  Custom Roles
                </p>
                <p className="text-3xl font-bold">
                  {roles.filter((r) => !r.IsSystem).length}
                </p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaUsers className="w-7 h-7" />
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
                placeholder="Cari role berdasarkan nama, slug..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
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
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="List View"
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Roles Display */}
        {displayedRoles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tidak ada role
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Belum ada role yang ditambahkan"}
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
            {displayedRoles.map((role) => (
              <RoleCard
                key={role.ID}
                role={role}
                viewMode={viewMode}
                onEdit={() => handleEdit(role)}
                onDelete={() => promptDeleteRole(role)}
                onView={() => openDetail(role)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddRoleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={modalInitial}
      />

      <RoleDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        role={detailRole}
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
