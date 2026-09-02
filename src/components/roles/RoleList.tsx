"use client";

import { useEffect, useState } from "react";
import AddRoleModal from "./AddRoleModal";
import RoleDetailModal from "./RoleDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EntityPageHeader from "@/components/entity-management/EntityPageHeader";
import EntityTable, {
  EntityTableColumn,
} from "@/components/entity-management/EntityTable";
import { FaSortAmountDown, FaUserShield } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { getAuthHeaders, API_CONFIG, apiFetch } from "@/config/api";

export type Role = {
  ID: number;
  Name: string;
  Slug: string;
  Description: string;
  IsSystem: boolean;
  is_system?: boolean | number | string;
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

type SortOption =
  | "name-asc"
  | "name-desc"
  | "updated-desc"
  | "updated-asc"
  | "system-first"
  | "non-system-first";

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    return ["1", "true", "yes"].includes(value.trim().toLowerCase());
  }
  return false;
}

function normalizeRole(role: Role): Role {
  return {
    ...role,
    IsSystem: normalizeBoolean(role.IsSystem ?? role.is_system),
  };
}

export default function RoleList() {
  const { token, isAuthenticated } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
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
        const dataUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`;
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

        const response = (await res.json()) as RoleAPIResponse;
        if (!cancelled) {
          setRoles(response.data.map(normalizeRole));
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
        const dataUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`;
        const res = await apiFetch(dataUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as RoleAPIResponse;
          setRoles(response.data.map(normalizeRole));
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

  displayedRoles = [...displayedRoles].sort((left, right) => {
    switch (sortBy) {
      case "name-desc":
        return right.Name.localeCompare(left.Name, "id", {
          sensitivity: "base",
        });
      case "updated-desc":
        return (
          new Date(right.UpdatedAt).getTime() -
          new Date(left.UpdatedAt).getTime()
        );
      case "updated-asc":
        return (
          new Date(left.UpdatedAt).getTime() -
          new Date(right.UpdatedAt).getTime()
        );
      case "system-first":
        return Number(right.IsSystem) - Number(left.IsSystem);
      case "non-system-first":
        return Number(left.IsSystem) - Number(right.IsSystem);
      case "name-asc":
      default:
        return left.Name.localeCompare(right.Name, "id", {
          sensitivity: "base",
        });
    }
  });

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
      const deleteUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}/${role.ID}`;
      const res = await apiFetch(deleteUrl, {
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

  const columns: EntityTableColumn<Role>[] = [
    {
      key: "name",
      header: "Role Name",
      render: (role) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <FaUserShield className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{role.Name}</p>
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
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (role) => (
        <code className="inline-flex rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
          {role.Slug}
        </code>
      ),
    },
    {
      key: "description",
      header: "Description",
      cellClassName: "text-sm text-gray-600",
      render: (role) => (
        <p className="line-clamp-1">
          {role.Description || "Belum ada deskripsi role."}
        </p>
      ),
    },
    {
      key: "is-system",
      header: "Is System",
      className: "whitespace-nowrap",
      render: (role) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            role.IsSystem
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {role.IsSystem ? "True" : "False"}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated At",
      className: "whitespace-nowrap",
      cellClassName: "text-sm text-gray-500 whitespace-nowrap",
      render: (role) => formatUpdatedAt(role.UpdatedAt),
    },
  ];

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
        <EntityPageHeader
          icon={<FaUserShield className="w-5 h-5" />}
          title="Roles"
          description="Kelola role yang ada di Ekaplus."
          addLabel="Tambah Role"
          onAdd={handleAdd}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari role berdasarkan nama, slug, atau deskripsi..."
          rightInfo={
            <div className="relative">
              <FaSortAmountDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="min-w-[190px] appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-red-500"
              >
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="updated-desc">Terbaru Diupdate</option>
                <option value="updated-asc">Terlama Diupdate</option>
                <option value="system-first">Is System: True</option>
                <option value="non-system-first">Is System: False</option>
              </select>
            </div>
          }
          accentClasses={{
            iconBg: "bg-red-50",
            iconText: "text-red-600",
            buttonBg: "bg-gradient-to-r from-red-600 to-red-700",
            buttonShadow: "shadow-red-200",
            searchRing: "focus:ring-red-500",
          }}
        />

        {displayedRoles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserShield className="w-8 h-8 text-gray-400" />
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
          <EntityTable
            columns={columns}
            rows={displayedRoles}
            getRowKey={(role) => role.ID}
            onRowClick={openDetail}
            footer={
              <>
                <span>Click row untuk lihat detail role</span>
                <span>
                  Showing {shownRoles} of {totalRoles} roles
                </span>
              </>
            }
          />
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
