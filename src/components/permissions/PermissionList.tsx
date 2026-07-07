"use client";

import { useEffect, useState } from "react";
import AddPermissionModal from "./AddPermissionModal";
import PermissionDetailModal from "./PermissionDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EntityPageHeader from "@/components/entity-management/EntityPageHeader";
import EntityTable, {
  EntityTableColumn,
} from "@/components/entity-management/EntityTable";
import { FaShieldAlt } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders, API_CONFIG, apiFetch } from "@/config/api";

export type Permission = {
  ID: number;
  Name: string;
  Slug: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type PermissionAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Permission[];
  meta: {
    request_id: string;
    trace_id: string;
    timestamp: string;
    processing_time_ms: number;
  };
};

export default function PermissionList() {
  const { token, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Permission | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPermission, setDetailPermission] = useState<Permission | null>(
    null,
  );
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
        const dataUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_PERMISSION}`;
        const res = await apiFetch(dataUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Server returned non-JSON response. Please check the API endpoint.",
          );
        }

        const response = (await res.json()) as PermissionAPIResponse;
        if (!cancelled) {
          setPermissions(response.data);
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
        const dataUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_PERMISSION}`;
        const res = await apiFetch(dataUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as PermissionAPIResponse;
          setPermissions(response.data);
        }
      } catch {}
    }

    window.addEventListener("ekatalog:permissions_update", handler);
    return () =>
      window.removeEventListener("ekatalog:permissions_update", handler);
  }, [isAuthenticated, token]);

  let displayedPermissions = permissions;
  if (searchQuery.trim()) {
    displayedPermissions = displayedPermissions.filter(
      (permission) =>
        permission.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.Slug.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(permission: Permission) {
    setModalInitial(permission);
    setModalOpen(true);
  }

  function promptDeletePermission(permission: Permission) {
    setConfirmTitle("Hapus Permission");
    setConfirmDesc(`Yakin ingin menghapus permission "${permission.Name}"?`);
    setConfirmAction(() => async () => {
      await deletePermission(permission);
    });
    setConfirmOpen(true);
  }

  async function deletePermission(permission: Permission) {
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);
      const deleteUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_PERMISSION}/${permission.ID}`;
      const res = await apiFetch(deleteUrl, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        window.dispatchEvent(new Event("ekatalog:permissions_update"));
        setConfirmOpen(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete permission");
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus permission. Silakan coba lagi.",
      );
    }
  }

  function openDetail(permission: Permission) {
    setDetailPermission(permission);
    setDetailOpen(true);
  }

  function onDetailEdit(permission: Permission) {
    setDetailOpen(false);
    setTimeout(() => handleEdit(permission), 100);
  }

  function onDetailDelete(permission: Permission) {
    setDetailOpen(false);
    setTimeout(() => promptDeletePermission(permission), 100);
  }

  async function executeConfirmAction() {
    if (confirmAction) {
      await confirmAction();
    }
    setConfirmOpen(false);
  }

  const columns: EntityTableColumn<Permission>[] = [
    {
      key: "name",
      header: "Permission Name",
      render: (permission) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <FaShieldAlt className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {permission.Name}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openDetail(permission);
              }}
              className="text-xs font-medium text-purple-500 hover:text-purple-600"
            >
              Lihat detail
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (permission) => (
        <code className="inline-flex rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
          {permission.Slug}
        </code>
      ),
    },
    {
      key: "updated",
      header: "Updated At",
      className: "whitespace-nowrap",
      cellClassName: "text-sm text-gray-500 whitespace-nowrap",
      render: (permission) => formatUpdatedAt(permission.UpdatedAt),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat permissions...</p>
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
              <FaShieldAlt className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Permissions
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
      <div className="mx-auto space-y-6">
        <EntityPageHeader
          icon={<FaShieldAlt className="w-5 h-5" />}
          title="Permissions"
          description="Kelola permission untuk sistem authorization."
          addLabel="Tambah Permission"
          onAdd={handleAdd}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari permission berdasarkan nama atau slug..."
          accentClasses={{
            iconBg: "bg-purple-50",
            iconText: "text-purple-600",
            buttonBg: "bg-gradient-to-r from-purple-600 to-purple-700",
            buttonShadow: "shadow-purple-200",
            searchRing: "focus:ring-purple-500",
          }}
        />

        {displayedPermissions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tidak ada permission
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? "Coba ubah kata kunci pencarian"
                : "Belum ada permission yang ditambahkan"}
            </p>
          </div>
        ) : (
          <EntityTable
            columns={columns}
            rows={displayedPermissions}
            getRowKey={(permission) => permission.ID}
            onRowClick={openDetail}
            footer={
              <>
                <span>Click row untuk lihat detail permission</span>
                <span>Showing {displayedPermissions.length} permissions</span>
              </>
            }
          />
        )}
      </div>

      <AddPermissionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={modalInitial}
      />

      <PermissionDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        permission={detailPermission}
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
