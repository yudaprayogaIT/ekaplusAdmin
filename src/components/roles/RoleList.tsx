"use client";

import { useEffect, useState } from "react";
import AddRoleModal from "./AddRoleModal";
import RoleDetailModal from "./RoleDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FaPlus, FaSearch, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders, API_CONFIG, apiFetch } from "@/config/api";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Role | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRole, setDetailRole] = useState<Role | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const [confirmAction, setConfirmAction] = useState<
    (() => Promise<void>) | null
  >(null);

  const formatUpdatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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

        const res = await apiFetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error(
              "Server returned non-JSON response. Please check the API endpoint.",
            );
          }

          const response = (await res.json()) as RoleAPIResponse;
          if (!cancelled) {
            setRoles(response.data);
          }
        } else {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan.",
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

  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const headers = getAuthHeaders(token);
        const DATA_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`;

        const res = await apiFetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as RoleAPIResponse;
          setRoles(response.data);
        }
      } catch {}
    }

    window.addEventListener("ekatalog:roles_update", handler);
    return () => window.removeEventListener("ekatalog:roles_update", handler);
  }, [isAuthenticated, token]);

  let displayedRoles = roles;
  if (searchQuery.trim()) {
    displayedRoles = displayedRoles.filter(
      (role) =>
        role.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.Slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.Description &&
          role.Description.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }

  const totalRoles = roles.length;
  const shownRoles = displayedRoles.length;

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(role: Role) {
    setModalInitial(role);
    setModalOpen(true);
  }

  function promptDeleteRole(role: Role) {
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

      const res = await apiFetch(DELETE_URL, {
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
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus role. Silakan coba lagi.",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
      <div className="mx-auto space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                  <FaUserShield className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Roles
                  </h1>
                  <p className="text-sm text-gray-600">
                    Kelola role yang ada di Ekaplus.
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="flex items-center justify-center self-end gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
            >
              <FaPlus className="w-4 h-4" />
              <span className="text-sm">Tambah Role</span>
            </motion.button>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-xl">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari role berdasarkan nama, slug, atau deskripsi..."
                className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr className="text-left">
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Role Name
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 whitespace-nowrap">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {displayedRoles.map((role) => (
                    <tr
                      key={role.ID}
                      onClick={() => openDetail(role)}
                      className="cursor-pointer transition-colors hover:bg-red-50/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <FaUserShield className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {role.Name}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetail(role);
                              }}
                              className="text-xs font-medium text-red-500 hover:text-red-600"
                            >
                              Lihat detail
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="inline-flex rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
                          {role.Slug}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <p className="line-clamp-1">
                          {role.Description || "Belum ada deskripsi role."}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {formatUpdatedAt(role.UpdatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
              <span>
                Showing {shownRoles} of {totalRoles} roles
              </span>
            </div>
          </div>
        )}
      </div>

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
