"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaFilter,
  FaGoogle,
  FaList,
  FaLock,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaTh,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getAuthHeaders,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import AddUserModal from "./AddUserModal";
import UserCard from "./UserCard";
import UserDetailModal from "./UserDetailModal";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  birth_place: string;
  profile_pic: string | null;
  picture: string | null;
  google_id: string | null;
  referral_code: string | null;
  referred_by: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  role_id: string;
  role: string;
  status: string;
  workflow_state: string | null;
  token_version: number;
  last_login: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_system: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
};

export type Role = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  level: number;
  color: string;
  icon: string;
  is_system: boolean;
  can_be_deleted: boolean;
  status: string;
};

export type UserMutationPayload = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  gender: string;
  date_of_birth: string | null;
  birth_place: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  role_id: string | null;
  role: string;
  status: string;
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "created-asc"
  | "created-desc"
  | "role-asc"
  | "role-desc";

type UsersApiRow = Record<string, unknown>;

type RolesApiResponse = {
  data?: Array<Record<string, unknown>>;
};

type UsersApiResponse = {
  data?: UsersApiRow[];
  message?: string;
};

const USER_EVENT = "ekaplus:users_update";
const USER_ENDPOINTS = ["/api/resource/users", API_CONFIG.ENDPOINTS.USER];
const ROLE_PALETTE: Record<string, { color: string; level: number }> = {
  administrator: { color: "#b91c1c", level: 100 },
  admin: { color: "#dc2626", level: 90 },
  admin_pusat: { color: "#7c3aed", level: 80 },
  admin_cabang: { color: "#0891b2", level: 70 },
  manager: { color: "#2563eb", level: 60 },
  sales: { color: "#0d9488", level: 50 },
  user: { color: "#4f46e5", level: 20 },
  customer: { color: "#6b7280", level: 10 },
};

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function toNullableString(value: unknown): string | null {
  const normalized = toStringValue(value).trim();
  return normalized || null;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "yes";
  }
  return false;
}

function normalizeStatus(value: unknown): string {
  if (typeof value === "number") {
    return value === 1 ? "active" : "inactive";
  }
  const normalized = toStringValue(value).trim().toLowerCase();
  if (!normalized) return "inactive";
  if (["1", "active", "enabled", "aktif"].includes(normalized)) return "active";
  if (["0", "inactive", "disabled", "nonaktif"].includes(normalized))
    return "inactive";
  return normalized;
}

function formatRoleName(role: string): string {
  return role
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mapRole(row: Record<string, unknown>): Role {
  const slug =
    toStringValue(row.Slug) ||
    toStringValue(row.slug) ||
    toStringValue(row.Name) ||
    toStringValue(row.name) ||
    "user";
  const displayName =
    toStringValue(row.Name) ||
    toStringValue(row.display_name) ||
    formatRoleName(slug);
  const palette = ROLE_PALETTE[slug.toLowerCase()] || {
    color: "#6b7280",
    level: 30,
  };

  return {
    id: toStringValue(row.ID) || toStringValue(row.id) || slug,
    name: slug,
    display_name: displayName,
    description:
      toStringValue(row.Description) || toStringValue(row.description),
    level:
      typeof row.Level === "number"
        ? row.Level
        : typeof row.level === "number"
          ? row.level
          : palette.level,
    color:
      toStringValue(row.Color) || toStringValue(row.color) || palette.color,
    icon: toStringValue(row.Icon) || toStringValue(row.icon),
    is_system: toBoolean(row.IsSystem ?? row.is_system),
    can_be_deleted: !toBoolean(row.IsSystem ?? row.is_system),
    status: normalizeStatus(row.Status ?? row.status ?? 1),
  };
}

function mapUser(row: UsersApiRow): User {
  const firstName = toStringValue(row.first_name);
  const lastName = toStringValue(row.last_name);
  const fullName =
    toStringValue(row.full_name) ||
    [firstName, lastName].filter(Boolean).join(" ") ||
    toStringValue(row.name) ||
    toStringValue(row.username) ||
    "User";

  return {
    id: toStringValue(row.id) || toStringValue(row.ID),
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    username: toStringValue(row.username),
    email: toStringValue(row.email),
    phone: toStringValue(row.phone),
    gender: toStringValue(row.gender),
    date_of_birth: toStringValue(row.date_of_birth),
    birth_place:
      toStringValue(row.birth_place) || toStringValue(row.place_of_birth),
    profile_pic: toNullableString(row.profile_pic),
    picture: toNullableString(row.picture),
    google_id: toNullableString(row.google_id),
    referral_code: toNullableString(row.referral_code),
    referred_by: toNullableString(row.referred_by),
    address: toNullableString(row.address),
    city: toNullableString(row.city),
    province: toNullableString(row.province),
    postal_code: toNullableString(row.postal_code),
    country: toNullableString(row.country),
    role_id: toStringValue(row.role_id),
    role: toStringValue(row.role) || "user",
    status: normalizeStatus(row.status),
    workflow_state: toNullableString(row.workflow_state),
    token_version:
      typeof row.token_version === "number"
        ? row.token_version
        : Number.parseInt(toStringValue(row.token_version), 10) || 0,
    last_login: toNullableString(row.last_login),
    email_verified_at: toNullableString(row.email_verified_at),
    phone_verified_at: toNullableString(row.phone_verified_at),
    created_by: toNullableString(row.created_by),
    updated_by: toNullableString(row.updated_by),
    created_at: toStringValue(row.created_at),
    updated_at: toStringValue(row.updated_at),
    is_system: toBoolean(row.is_system),
    is_email_verified: toBoolean(row.is_email_verified),
    is_phone_verified: toBoolean(row.is_phone_verified),
  };
}

export default function UserList() {
  const {
    hasPermission,
    token,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("created-desc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<User | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);
  const activeEndpointRef = useRef<string>(USER_ENDPOINTS[0]);

  const canViewUsers = hasPermission("user.read");
  const canCreateUsers = hasPermission("user.create");
  const canEditUsers = hasPermission("user.update");
  const canDeleteUsers = hasPermission("user.delete");

  const loadRoles = useCallback(async () => {
    if (!token) return [];
    const res = await apiFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`,
      {
        method: "GET",
        cache: "no-store",
        headers: getAuthHeaders(token),
      },
      token,
    );

    if (!res.ok) return [];

    const json = (await res
      .json()
      .catch(() => null)) as RolesApiResponse | null;
    return Array.isArray(json?.data) ? json.data.map(mapRole) : [];
  }, [token]);

  const loadUsers = useCallback(async () => {
    if (!token) {
      setUsers([]);
      return;
    }

    let lastError = "Gagal memuat data users.";

    for (const endpoint of USER_ENDPOINTS) {
      const url = getQueryUrl(endpoint, {
        fields: ["*"],
        limit: 100000,
      });

      const res = await apiFetch(
        url,
        {
          method: "GET",
          cache: "no-store",
          headers: getAuthHeaders(token),
        },
        token,
      );

      const json = (await res
        .json()
        .catch(() => null)) as UsersApiResponse | null;
      if (!res.ok) {
        lastError = json?.message || `Gagal memuat users (${res.status})`;
        continue;
      }

      const rows = Array.isArray(json?.data) ? json.data : [];
      activeEndpointRef.current = endpoint;
      setUsers(rows.map(mapUser));
      return;
    }

    throw new Error(lastError);
  }, [token]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated || !token) {
        setUsers([]);
        setRoles([]);
        return;
      }

      const [nextRoles] = await Promise.all([loadRoles(), loadUsers()]);
      setRoles(nextRoles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat users");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, loadRoles, loadUsers, token]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  useEffect(() => {
    const handler = () => {
      void refreshData();
    };
    window.addEventListener(USER_EVENT, handler);
    return () => window.removeEventListener(USER_EVENT, handler);
  }, [refreshData]);

  const allRoles = useMemo(() => {
    const existing = new Map<string, Role>();
    roles.forEach((role) => existing.set(role.name, role));

    users.forEach((user) => {
      if (existing.has(user.role)) return;
      const palette = ROLE_PALETTE[user.role.toLowerCase()] || {
        color: "#6b7280",
        level: 30,
      };
      existing.set(user.role, {
        id: user.role,
        name: user.role,
        display_name: formatRoleName(user.role),
        description: "",
        level: palette.level,
        color: palette.color,
        icon: "",
        is_system: false,
        can_be_deleted: false,
        status: "active",
      });
    });

    return Array.from(existing.values()).sort((a, b) => b.level - a.level);
  }, [roles, users]);

  const getRoleInfo = useCallback(
    (roleName: string) => allRoles.find((role) => role.name === roleName),
    [allRoles],
  );

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((user) =>
        [
          user.full_name,
          user.username,
          user.email,
          user.phone,
          user.role,
          user.city || "",
        ].some((value) => value.toLowerCase().includes(query)),
      );
    }

    if (selectedRole) {
      result = result.filter((user) => user.role === selectedRole);
    }

    if (selectedStatus) {
      result = result.filter((user) => user.status === selectedStatus);
    }

    return result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.full_name.localeCompare(b.full_name);
        case "name-desc":
          return b.full_name.localeCompare(a.full_name);
        case "created-asc":
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        case "role-asc":
          return (
            (getRoleInfo(a.role)?.level || 0) -
            (getRoleInfo(b.role)?.level || 0)
          );
        case "role-desc":
          return (
            (getRoleInfo(b.role)?.level || 0) -
            (getRoleInfo(a.role)?.level || 0)
          );
        case "created-desc":
        default:
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
      }
    });
  }, [getRoleInfo, searchQuery, selectedRole, selectedStatus, sortBy, users]);

  const stats = useMemo(() => {
    const active = users.filter((user) => user.status === "active").length;
    const verifiedEmail = users.filter((user) => user.is_email_verified).length;
    const verifiedPhone = users.filter((user) => user.is_phone_verified).length;
    const googleLinked = users.filter((user) => Boolean(user.google_id)).length;
    const systemUsers = users.filter((user) => user.is_system).length;
    return {
      total: users.length,
      active,
      verifiedEmail,
      verifiedPhone,
      googleLinked,
      systemUsers,
    };
  }, [users]);

  const statusList = useMemo(
    () =>
      Array.from(
        new Set(users.map((user) => user.status).filter(Boolean)),
      ).sort((a, b) => a.localeCompare(b)),
    [users],
  );

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setModalInitial(null);
    setModalError(null);
  };

  const handleAdd = () => {
    setModalInitial(null);
    setModalError(null);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setModalInitial(user);
    setModalError(null);
    setModalOpen(true);
  };

  const openDetail = (user: User) => {
    setDetailItem(user);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailItem(null);
  };

  const onDetailEdit = (user: User) => {
    closeDetail();
    setTimeout(() => handleEdit(user), 80);
  };

  const onDetailDelete = (user: User) => {
    closeDetail();
    setTimeout(() => promptDeleteUser(user), 80);
  };

  const submitUser = async (payload: UserMutationPayload) => {
    if (!token) return;

    setSaving(true);
    setModalError(null);
    try {
      const body = {
        first_name: payload.first_name.trim(),
        last_name: payload.last_name.trim(),
        full_name:
          `${payload.first_name.trim()} ${payload.last_name.trim()}`.trim(),
        username: payload.username.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        gender: payload.gender.trim() || null,
        date_of_birth: payload.date_of_birth || null,
        place_of_birth: payload.birth_place || null,
        address: payload.address || null,
        city: payload.city || null,
        province: payload.province || null,
        postal_code: payload.postal_code || null,
        country: payload.country || null,
        role: payload.role,
        status: payload.status === "active" ? 1 : 0,
        workflow_state: payload.status === "active" ? "Active" : "Inactive",
      } as Record<string, unknown>;

      if (payload.role_id) {
        body.role_id = payload.role_id;
      }

      if (payload.password?.trim()) {
        body.password = payload.password.trim();
      }

      const endpoint = activeEndpointRef.current;
      const res = await apiFetch(
        modalInitial
          ? getResourceUrl(endpoint, modalInitial.id)
          : getResourceUrl(endpoint),
        {
          method: modalInitial ? "PUT" : "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify(body),
        },
        token,
      );

      const json = (await res
        .json()
        .catch(() => null)) as UsersApiResponse | null;
      if (!res.ok) {
        throw new Error(
          json?.message || `Gagal menyimpan user (${res.status})`,
        );
      }

      setModalOpen(false);
      setModalInitial(null);
      window.dispatchEvent(new Event(USER_EVENT));
    } catch (submitError) {
      setModalError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan user",
      );
    } finally {
      setSaving(false);
    }
  };

  function promptDeleteUser(user: User) {
    if (user.is_system) {
      alert("User sistem tidak dapat dihapus.");
      return;
    }

    setConfirmTitle("Hapus User");
    setConfirmDesc(`Yakin ingin menghapus user "${user.full_name}"?`);
    actionRef.current = async () => {
      if (!token) return;
      const endpoint = activeEndpointRef.current;
      const res = await apiFetch(
        getResourceUrl(endpoint, user.id),
        {
          method: "DELETE",
          headers: getAuthHeaders(token),
        },
        token,
      );
      const json = (await res
        .json()
        .catch(() => null)) as UsersApiResponse | null;
      if (!res.ok) {
        throw new Error(
          json?.message || `Gagal menghapus user (${res.status})`,
        );
      }
      window.dispatchEvent(new Event(USER_EVENT));
    };
    setConfirmOpen(true);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    const action = actionRef.current;
    actionRef.current = null;
    if (!action) return;
    try {
      await action();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Gagal menghapus user",
      );
    }
  }

  function confirmCancel() {
    actionRef.current = null;
    setConfirmOpen(false);
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-200 border-t-red-500" />
          <p className="text-sm font-medium text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <FaLock className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            Login Diperlukan
          </h2>
          <p className="mb-6 text-gray-600">
            Silakan login terlebih dahulu untuk mengakses data users.
          </p>
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
            <FaUsers className="h-4 w-4" />
            <span>Data user dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  if (!canViewUsers) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FaLock className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-gray-800">
            Akses Ditolak
          </h2>
          <p className="text-gray-600">
            Anda tidak memiliki permission untuk melihat data users.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-200 border-t-red-500" />
          <p className="text-sm font-medium text-gray-600">
            Memuat data users...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 py-8">
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-red-600">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => void refreshData()}
            className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 font-medium text-white shadow-lg shadow-red-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
            Users
          </h1>
          <p className="text-sm text-gray-600 md:text-base">
            Kelola pengguna aplikasi EKA+ dari resource backend.
          </p>
        </div>

        {canCreateUsers ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 font-medium text-white shadow-lg shadow-red-200 transition-all hover:shadow-xl"
          >
            <FaPlus className="h-4 w-4" />
            <span>Tambah User</span>
          </motion.button>
        ) : (
          <div className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-400">
            <FaLock className="h-4 w-4" />
            <span>Tambah User</span>
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FaUsers className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">
              Total Users
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">Active</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">
            {stats.active}
          </div>
        </div>
        <div className="rounded-xl border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-cyan-600" />
            <span className="text-xs font-medium text-cyan-700">
              Email Verified
            </span>
          </div>
          <div className="text-2xl font-bold text-cyan-900">
            {stats.verifiedEmail}
          </div>
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-green-700">
              Phone Verified
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {stats.verifiedPhone}
          </div>
        </div>
        <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FaGoogle className="h-4 w-4 text-orange-600" />
            <span className="text-xs font-medium text-orange-700">
              Google Linked
            </span>
          </div>
          <div className="text-2xl font-bold text-orange-900">
            {stats.googleLinked}
          </div>
        </div>
        <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4">
          <div className="mb-2 flex items-center gap-2">
            <FaUserShield className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              System User
            </span>
          </div>
          <div className="text-2xl font-bold text-amber-900">
            {stats.systemUsers}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama, email, telepon, username, role, atau kota..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="relative">
              <FaSortAmountDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as SortOption)
                }
                className="min-w-[200px] cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-10 font-medium text-gray-700 transition-all focus:border-transparent focus:ring-2 focus:ring-red-500"
              >
                <option value="created-desc">Terbaru</option>
                <option value="created-asc">Terlama</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="role-desc">Role: Tertinggi</option>
                <option value="role-asc">Role: Terendah</option>
              </select>
              <svg
                className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-xl px-4 py-3 font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaTh className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-xl px-4 py-3 font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaList className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="h-4 w-4 flex-shrink-0 text-gray-400" />

            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedRole === null
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua Role
            </button>

            {allRoles.map((role) => (
              <button
                type="button"
                key={role.id}
                onClick={() => setSelectedRole(role.name)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedRole === role.name
                    ? "text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={
                  selectedRole === role.name
                    ? { backgroundColor: role.color }
                    : undefined
                }
              >
                {role.display_name}
              </button>
            ))}

            {statusList.length > 0 ? (
              <div className="mx-2 h-6 w-px bg-gray-300" />
            ) : null}

            {statusList.map((status) => (
              <button
                type="button"
                key={status}
                onClick={() =>
                  setSelectedStatus(selectedStatus === status ? null : status)
                }
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                  selectedStatus === status
                    ? status === "active"
                      ? "bg-green-500 text-white shadow-lg shadow-green-200"
                      : status === "inactive"
                        ? "bg-gray-500 text-white shadow-lg shadow-gray-200"
                        : "bg-red-500 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {searchQuery ||
          selectedRole ||
          selectedStatus ||
          sortBy !== "created-desc" ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2">
              <span className="text-xs font-medium text-gray-500">
                Filter aktif:
              </span>
              {searchQuery ? (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Pencarian: &quot;{searchQuery}&quot;
                </span>
              ) : null}
              {selectedRole ? (
                <span
                  className="rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{
                    backgroundColor:
                      getRoleInfo(selectedRole)?.color || "#6B7280",
                  }}
                >
                  Role:{" "}
                  {getRoleInfo(selectedRole)?.display_name || selectedRole}
                </span>
              ) : null}
              {selectedStatus ? (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    selectedStatus === "active"
                      ? "bg-green-100 text-green-700"
                      : selectedStatus === "inactive"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  Status: {selectedStatus}
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole(null);
                  setSelectedStatus(null);
                  setSortBy("created-desc");
                }}
                className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                Reset Semua
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FaSearch className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Tidak ada user
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada data user dari API"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-4"
          }
        >
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              role={getRoleInfo(user.role)}
              viewMode={viewMode}
              onEdit={() => handleEdit(user)}
              onDelete={() => promptDeleteUser(user)}
              onView={() => openDetail(user)}
              canEdit={canEditUsers}
              canDelete={canDeleteUsers}
            />
          ))}
        </div>
      )}

      <AddUserModal
        open={modalOpen}
        onClose={closeModal}
        initial={modalInitial}
        roles={allRoles}
        saving={saving}
        error={modalError}
        onSubmit={submitUser}
      />

      <UserDetailModal
        open={detailOpen}
        onClose={closeDetail}
        user={detailItem}
        role={detailItem ? getRoleInfo(detailItem.role) : undefined}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
        canEdit={canEditUsers}
        canDelete={canDeleteUsers}
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
