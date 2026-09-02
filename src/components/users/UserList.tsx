"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FaCheckCircle,
  FaEnvelope,
  FaGoogle,
  FaLock,
  FaSortAmountDown,
  FaTimesCircle,
  FaUsers,
  FaPhone,
  FaShieldAlt,
} from "react-icons/fa";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EntityPageHeader from "@/components/entity-management/EntityPageHeader";
import EntityTable, {
  EntityTableColumn,
} from "@/components/entity-management/EntityTable";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getAuthHeaders,
  getApiUrl,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import AddUserModal from "./AddUserModal";
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

export type IntegrationTokenInfo = {
  id: number;
  name: string;
  token: string;
  tokenPreview: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  role_ids: string[];
  initial_role_ids?: string[];
  role: string;
  is_system: number;
  generate_integration_token?: boolean;
  integration_token_name?: string | null;
};

function normalizePhoneForDb(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return `62${digits}`;
}

function areRoleIdsEqual(left: string[], right: string[]): boolean {
  const normalizedLeft = [...new Set(left.filter(Boolean))].sort();
  const normalizedRight = [...new Set(right.filter(Boolean))].sort();
  if (normalizedLeft.length !== normalizedRight.length) return false;
  return normalizedLeft.every(
    (value, index) => value === normalizedRight[index],
  );
}

function extractUserIdFromResponse(data: UsersApiResponse["data"]): string {
  if (!data || Array.isArray(data)) return "";
  return (
    toStringValue(data.id) ||
    toStringValue(data.ID) ||
    toStringValue(data.user_id)
  );
}

type SortOption =
  | "name-asc"
  | "name-desc"
  | "created-asc"
  | "created-desc"
  | "role-asc"
  | "role-desc";

type UsersApiRow = Record<string, unknown>;

type UsersApiResponse = {
  data?: UsersApiRow[] | UsersApiRow | null;
  message?: string;
  meta?: Record<string, unknown> | null;
};

type IntegrationTokenApiRow = {
  ID?: number;
  Name?: string;
  Token?: string;
  TokenPreview?: string;
  UserID?: string | number;
  IsActive?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string;
};

type IntegrationTokensApiResponse = {
  data?: IntegrationTokenApiRow[] | null;
  message?: string;
};

type UserRoleApiRow = Record<string, unknown>;

const USER_EVENT = "ekaplus:users_update";
const USER_ENDPOINT = API_CONFIG.ENDPOINTS.USERS;
const USER_ROLE_OPTIONS_ENDPOINT = "/api/resource/roles";
const DEFAULT_USER_PAGE_SIZE = 20;
const USER_ROLE_ENDPOINTS = [
  "/api/resource/user_roles",
  "/api/resource/user_role",
];
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

function extractServerMessage(json: unknown, fallback: string) {
  if (json && typeof json === "object" && "message" in json) {
    const message = (json as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRoleName(role: string): string {
  return role
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toNumberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getUsersOrderBy(sortBy: SortOption): [string, string][] {
  switch (sortBy) {
    case "name-asc":
      return [["full_name", "asc"]];
    case "name-desc":
      return [["full_name", "desc"]];
    case "created-asc":
      return [["created_at", "asc"]];
    case "role-asc":
      return [["role", "asc"]];
    case "role-desc":
      return [["role", "desc"]];
    case "created-desc":
    default:
      return [["created_at", "desc"]];
  }
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

function mapIntegrationToken(
  row: IntegrationTokenApiRow,
): IntegrationTokenInfo {
  return {
    id: Number(row.ID || 0),
    name: row.Name || `Token ${row.ID || "-"}`,
    token: row.Token || "",
    tokenPreview: row.TokenPreview || "",
    userId: toStringValue(row.UserID),
    isActive: Boolean(row.IsActive),
    createdAt: row.CreatedAt || "",
    updatedAt: row.UpdatedAt || "",
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
  const [userRoleIdsByUserId, setUserRoleIdsByUserId] = useState<
    Map<string, string[]>
  >(new Map());
  const [integrationTokens, setIntegrationTokens] = useState<
    IntegrationTokenInfo[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<User | null>(null);
  const [modalInitialRoleIds, setModalInitialRoleIds] = useState<string[]>([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<User | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const canViewUsers = hasPermission("user.read");
  const canCreateUsers = hasPermission("user.create");
  const canEditUsers = hasPermission("user.update");
  const canDeleteUsers = hasPermission("user.delete");

  const loadRoles = useCallback(async () => {
    if (!token) return [];

    try {
      const rows = await fetchAllQueryRows<Record<string, unknown>>({
        endpoint: USER_ROLE_OPTIONS_ENDPOINT,
        spec: {
          fields: ["id", "name", "is_system"],
          order_by: [["name", "ASC"]],
        },
        token,
        requestInit: {
          headers: getAuthHeaders(token),
        },
        errorMessage: "Gagal memuat role user",
      });

      return rows.map(mapRole);
    } catch {
      return [];
    }
  }, [token]);

  const loadUsersPage = useCallback(
    async (page: number, replace: boolean) => {
      if (replace) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        if (!isAuthenticated || !token) {
          setUsers([]);
          setHasMore(false);
          setTotalUsers(0);
          return;
        }

        const spec = {
          fields: ["*"],
          page,
          ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
          order_by: getUsersOrderBy(sortBy),
        };

        const res = await apiFetch(
          getQueryUrl(USER_ENDPOINT, spec),
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
          throw new Error(
            json?.message || `Gagal memuat users (${res.status})`,
          );
        }

        const rows = Array.isArray(json?.data) ? json.data : [];
        const meta = json?.meta ?? null;
        const perPage =
          toNumberValue(meta && "per_page" in meta ? meta.per_page : null) ||
          DEFAULT_USER_PAGE_SIZE;
        const nextTotal =
          toNumberValue(meta && "total" in meta ? meta.total : null) ||
          toNumberValue(
            meta && "total_count" in meta ? meta.total_count : null,
          ) ||
          toNumberValue(meta && "count" in meta ? meta.count : null);
        const mapped = rows.map(mapUser);

        let appendedCount = 0;
        setUsers((current) => {
          if (replace) {
            appendedCount = mapped.length;
            return mapped;
          }

          const nextRows = mapped.filter(
            (user) => !current.some((existing) => existing.id === user.id),
          );
          appendedCount = nextRows.length;
          return [...current, ...nextRows];
        });
        setCurrentPage(page);
        setHasMore(rows.length >= perPage);
        setTotalUsers((current) => {
          if (nextTotal !== null) return nextTotal;
          if (replace) return mapped.length;
          return (current ?? 0) + appendedCount;
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat users");
        if (replace) {
          setUsers([]);
          setTotalUsers(0);
        }
        setHasMore(false);
      } finally {
        if (replace) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [debouncedSearchQuery, isAuthenticated, sortBy, token],
  );

  const loadIntegrationTokens = useCallback(async () => {
    if (!token) {
      setIntegrationTokens([]);
      return [];
    }

    const res = await apiFetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INTEGRATION_TOKEN}`,
      {
        method: "GET",
        cache: "no-store",
        headers: getAuthHeaders(token),
      },
      token,
    );

    const json = (await res
      .json()
      .catch(() => null)) as IntegrationTokensApiResponse | null;
    if (!res.ok) {
      throw new Error(
        json?.message || `Gagal memuat integration token (${res.status})`,
      );
    }

    const baseRows = Array.isArray(json?.data)
      ? json.data.map(mapIntegrationToken)
      : [];

    const detailedRows = await Promise.all(
      baseRows.map(async (item) => {
        try {
          const detailRes = await apiFetch(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INTEGRATION_TOKEN}/${item.id}`,
            {
              method: "GET",
              cache: "no-store",
              headers: getAuthHeaders(token),
            },
            token,
          );

          const detailJson = (await detailRes
            .json()
            .catch(() => null)) as IntegrationTokensApiResponse | null;
          if (
            !detailRes.ok ||
            !detailJson?.data ||
            Array.isArray(detailJson.data)
          ) {
            return item;
          }

          const detail = mapIntegrationToken(
            detailJson.data as IntegrationTokenApiRow,
          );

          return {
            ...item,
            token: detail.token || item.token,
            tokenPreview: detail.tokenPreview || item.tokenPreview,
          };
        } catch {
          return item;
        }
      }),
    );

    return detailedRows;
  }, [token]);

  const loadUserRoleIds = useCallback(async () => {
    if (!token) {
      setUserRoleIdsByUserId(new Map());
      return new Map<string, string[]>();
    }

    for (const endpoint of USER_ROLE_ENDPOINTS) {
      try {
        const rows = await fetchAllQueryRows<UserRoleApiRow>({
          endpoint,
          spec: {
            fields: ["*"],
          },
          token,
          requestInit: {
            headers: getAuthHeaders(token),
          },
        });

        const mapping = new Map<string, string[]>();
        rows.forEach((row) => {
          const userId =
            toStringValue(row.user_id) ||
            toStringValue(row.UserID) ||
            toStringValue(row.userId);
          const roleId =
            toStringValue(row.role_id) ||
            toStringValue(row.RoleID) ||
            toStringValue(row.roleId);

          if (!userId || !roleId) return;

          const current = mapping.get(userId) || [];
          if (!current.includes(roleId)) {
            mapping.set(userId, [...current, roleId]);
          }
        });

        setUserRoleIdsByUserId(mapping);
        return mapping;
      } catch {
        continue;
      }
    }

    setUserRoleIdsByUserId(new Map());
    return new Map<string, string[]>();
  }, [token]);

  const refreshSupportingData = useCallback(async () => {
    try {
      if (!isAuthenticated || !token) {
        setRoles([]);
        setIntegrationTokens([]);
        setUserRoleIdsByUserId(new Map());
        return;
      }

      const [nextRoles, nextTokens] = await Promise.all([
        loadRoles(),
        loadIntegrationTokens(),
        loadUserRoleIds(),
      ]);
      setRoles(nextRoles);
      setIntegrationTokens(nextTokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat users");
    }
  }, [
    isAuthenticated,
    loadIntegrationTokens,
    loadRoles,
    loadUserRoleIds,
    token,
  ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    void refreshSupportingData();
  }, [refreshSupportingData]);

  useEffect(() => {
    setUsers([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotalUsers(null);
    void loadUsersPage(1, true);
  }, [loadUsersPage]);

  useEffect(() => {
    const handler = () => {
      void refreshSupportingData();
      setUsers([]);
      setCurrentPage(1);
      setHasMore(true);
      setTotalUsers(null);
      void loadUsersPage(1, true);
    };
    window.addEventListener(USER_EVENT, handler);
    return () => window.removeEventListener(USER_EVENT, handler);
  }, [loadUsersPage, refreshSupportingData]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        void loadUsersPage(currentPage + 1, false);
      },
      {
        root: null,
        rootMargin: "240px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [currentPage, hasMore, loadUsersPage, loading, loadingMore]);

  const allRoles = useMemo(
    () => [...roles].sort((a, b) => b.level - a.level),
    [roles],
  );

  const getRoleInfo = useCallback(
    (roleName: string) => allRoles.find((role) => role.name === roleName),
    [allRoles],
  );

  const filteredUsers = useMemo(() => [...users], [users]);

  const integrationTokenByUserId = useMemo(() => {
    const tokenMap = new Map<string, IntegrationTokenInfo>();

    integrationTokens.forEach((tokenItem) => {
      if (!tokenItem.userId) return;

      const existing = tokenMap.get(tokenItem.userId);
      if (!existing) {
        tokenMap.set(tokenItem.userId, tokenItem);
        return;
      }

      const nextTime = new Date(
        tokenItem.updatedAt || tokenItem.createdAt || 0,
      ).getTime();
      const currentTime = new Date(
        existing.updatedAt || existing.createdAt || 0,
      ).getTime();

      if (nextTime >= currentTime) {
        tokenMap.set(tokenItem.userId, tokenItem);
      }
    });

    return tokenMap;
  }, [integrationTokens]);

  const activeUsersCount = useMemo(
    () => users.filter((user) => user.status === "active").length,
    [users],
  );
  const systemUsersCount = useMemo(
    () => users.filter((user) => user.is_system).length,
    [users],
  );
  const verifiedEmailCount = useMemo(
    () => users.filter((user) => user.is_email_verified).length,
    [users],
  );

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setModalInitial(null);
    setModalInitialRoleIds([]);
    setModalError(null);
  };

  const handleAdd = () => {
    setModalInitial(null);
    setModalInitialRoleIds([]);
    setModalError(null);
    setModalOpen(true);
  };

  const loadRoleIdsForUser = useCallback(
    async (userId: string) => {
      if (!token || !userId) return [];

      for (const endpoint of USER_ROLE_ENDPOINTS) {
        try {
          const rows = await fetchAllQueryRows<UserRoleApiRow>({
            endpoint,
            spec: {
              fields: ["*"],
              filters: [["user_id", "=", Number(userId)]],
            },
            token,
            requestInit: {
              headers: getAuthHeaders(token),
            },
          });

          const roleIds = rows
            .map(
              (row) =>
                toStringValue(row.role_id) ||
                toStringValue(row.RoleID) ||
                toStringValue(row.roleId),
            )
            .filter(Boolean);

          if (roleIds.length > 0) {
            return [...new Set(roleIds)];
          }
        } catch {
          continue;
        }
      }

      return [];
    },
    [token],
  );

  const handleEdit = (user: User) => {
    setModalInitial(user);
    setModalInitialRoleIds(userRoleIdsByUserId.get(user.id) || []);
    setModalError(null);
    setModalOpen(true);

    void loadRoleIdsForUser(user.id).then((roleIds) => {
      setModalInitialRoleIds((current) =>
        current.length > 0 || roleIds.length === 0 ? current : roleIds,
      );
    });
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

  const columns: EntityTableColumn<User>[] = [
    {
      key: "user",
      header: "User",
      render: (user) => (
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {user.full_name}
            </p>
            {user.is_system ? (
              <FaShieldAlt
                className="h-3.5 w-3.5 flex-shrink-0 text-amber-500"
                title="System User"
              />
            ) : null}
            {user.google_id ? (
              <FaGoogle
                className="h-3.5 w-3.5 flex-shrink-0 text-blue-500"
                title="Google Account"
              />
            ) : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>@{user.username || "-"}</span>
            <span className="text-gray-300">•</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openDetail(user);
              }}
              className="font-medium text-red-500 hover:text-red-600"
            >
              Lihat detail
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Kontak",
      render: (user) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaEnvelope className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span className="truncate">{user.email || "-"}</span>
            {user.is_email_verified ? (
              <FaCheckCircle className="h-3 w-3 flex-shrink-0 text-green-500" />
            ) : (
              <FaTimesCircle className="h-3 w-3 flex-shrink-0 text-gray-300" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaPhone className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
            <span>{user.phone || "-"}</span>
            {user.is_phone_verified ? (
              <FaCheckCircle className="h-3 w-3 flex-shrink-0 text-green-500" />
            ) : (
              <FaTimesCircle className="h-3 w-3 flex-shrink-0 text-gray-300" />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      className: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      render: (user) => {
        const role = getRoleInfo(user.role);
        return (
          <span
            className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: role?.color || "#6B7280" }}
          >
            {role?.display_name || formatRoleName(user.role)}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      className: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap",
      render: (user) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            user.status === "active"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.status === "active" ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated At",
      className: "whitespace-nowrap",
      cellClassName: "text-sm text-gray-500 whitespace-nowrap",
      render: (user) => formatDate(user.updated_at || user.created_at),
    },
  ];

  const assignRoleToUser = useCallback(
    async (userId: string, roleIds: string[]) => {
      if (!token || !userId || roleIds.length === 0) return;

      const res = await apiFetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_USER_ROLE}`,
        {
          method: "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            user_id: Number(userId),
            role_ids: roleIds.map((roleId) => Number(roleId)),
          }),
        },
        token,
      );

      const json = (await res
        .json()
        .catch(() => null)) as UsersApiResponse | null;
      if (!res.ok) {
        throw new Error(
          json?.message || `Gagal menetapkan role user (${res.status})`,
        );
      }
    },
    [token],
  );

  const createIntegrationTokenForUser = useCallback(
    async (userId: string, tokenName: string | null | undefined) => {
      if (!token || !userId) return;

      const trimmedName = tokenName?.trim();
      if (!trimmedName) {
        throw new Error("Nama integration token wajib diisi.");
      }

      const payload = {
        name: trimmedName,
        user_id: Number(userId),
      };

      let lastError = "Gagal membuat integration token.";

      for (let attempt = 0; attempt < 2; attempt += 1) {
        const res = await apiFetch(
          getApiUrl(API_CONFIG.ENDPOINTS.INTEGRATION_TOKEN),
          {
            method: "POST",
            cache: "no-store",
            headers: getAuthHeaders(token),
            body: JSON.stringify(payload),
          },
          token,
        );

        const json = await res.json().catch(() => null);
        if (res.ok) {
          return;
        }

        lastError = extractServerMessage(
          json,
          `Gagal membuat integration token (${res.status})`,
        );

        if (attempt === 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
      }

      throw new Error(lastError);
    },
    [token],
  );

  const submitUser = async (payload: UserMutationPayload) => {
    if (!token) return;

    setSaving(true);
    setModalError(null);
    let shouldRefresh = false;
    try {
      const body = {
        first_name: payload.first_name.trim(),
        last_name: payload.last_name.trim(),
        full_name:
          `${payload.first_name.trim()} ${payload.last_name.trim()}`.trim(),
        username: payload.username.trim(),
        email: payload.email.trim(),
        phone: normalizePhoneForDb(payload.phone),
        gender: payload.gender.trim() || null,
        date_of_birth: payload.date_of_birth || null,
        place_of_birth: payload.birth_place || null,
        address: payload.address || null,
        city: payload.city || null,
        province: payload.province || null,
        postal_code: payload.postal_code || null,
        country: payload.country || null,
        is_system: modalInitial
          ? payload.is_system
          : Boolean(payload.is_system),
        token_version: 1,
        status: 1,
        workflow_state: "Active",
      } as Record<string, unknown>;

      if (payload.password?.trim()) {
        body.password = payload.password.trim();
      }

      const requestUrl = modalInitial
        ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_UPDATE}/${modalInitial.id}`
        : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_CREATE}`;
      const res = await apiFetch(
        requestUrl,
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

      const userId = modalInitial?.id || extractUserIdFromResponse(json?.data);
      if (!userId) {
        throw new Error(
          "User berhasil disimpan, tetapi user_id tidak ditemukan untuk set role.",
        );
      }

      const shouldAssignRoles =
        !modalInitial ||
        !areRoleIdsEqual(payload.initial_role_ids || [], payload.role_ids);

      if (shouldAssignRoles) {
        await assignRoleToUser(userId, payload.role_ids);
      }
      shouldRefresh = true;

      if (payload.generate_integration_token) {
        await createIntegrationTokenForUser(
          userId,
          payload.integration_token_name,
        );
      }

      setSuccessMessage(
        payload.generate_integration_token
          ? "User berhasil dibuat, role terpasang, dan integration token berhasil dibuat."
          : "User berhasil dibuat dan role berhasil dipasang.",
      );
      setModalOpen(false);
      setModalInitial(null);
      setModalInitialRoleIds([]);
      window.dispatchEvent(new Event(USER_EVENT));
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Gagal menyimpan user";

      if (shouldRefresh) {
        setModalOpen(false);
        setModalInitial(null);
        setModalInitialRoleIds([]);
        setError(
          `User sudah tersimpan, tetapi proses lanjutan gagal: ${message}`,
        );
        window.dispatchEvent(new Event(USER_EVENT));
      } else {
        setModalError(message);
      }
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
      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.USERS, user.id),
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto">
          <div className="py-16 text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-200 border-t-red-500" />
            <p className="text-gray-600">Memuat users...</p>
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
              <FaUsers className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Error Loading Users
            </h3>
            <p className="mb-4 text-sm text-gray-500">{error}</p>
            <button
              type="button"
              onClick={() => {
                void refreshSupportingData();
                setUsers([]);
                setCurrentPage(1);
                setHasMore(true);
                setTotalUsers(null);
                void loadUsersPage(1, true);
              }}
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
        {successMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium">{successMessage}</span>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : null}

        <EntityPageHeader
          icon={<FaUsers className="h-5 w-5" />}
          title="Users"
          description="Kelola pengguna aplikasi EKA+ dari resource backend."
          addLabel={canCreateUsers ? "Tambah User" : undefined}
          onAdd={canCreateUsers ? handleAdd : undefined}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari user berdasarkan nama, email, username, role, atau kota..."
          // summary={
          //   <>
          //     <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          //       {totalUsers ?? users.length} total
          //     </span>
          //     <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          //       {activeUsersCount} aktif
          //     </span>
          //     <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          //       {systemUsersCount} system
          //     </span>
          //     <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          //       {verifiedEmailCount} email verified
          //     </span>
          //   </>
          // }
          rightInfo={
            <div className="flex flex-col items-start gap-2 md:items-end">
              <div className="relative">
                <FaSortAmountDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value as SortOption)
                  }
                  className="min-w-[168px] appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm text-gray-700 focus:border-transparent focus:ring-2 focus:ring-red-500"
                >
                  <option value="created-desc">Terbaru</option>
                  <option value="created-asc">Terlama</option>
                  <option value="name-asc">Nama: A-Z</option>
                  <option value="name-desc">Nama: Z-A</option>
                  <option value="role-desc">Role: Tertinggi</option>
                  <option value="role-asc">Role: Terendah</option>
                </select>
              </div>
            </div>
          }
        />

        {filteredUsers.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <FaUsers className="h-8 w-8 text-gray-400" />
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
          <EntityTable
            columns={columns}
            rows={filteredUsers}
            getRowKey={(user) => user.id}
            onRowClick={openDetail}
            footer={
              <>
                <span>Click row untuk lihat detail user</span>
                <span>
                  Showing {filteredUsers.length}
                  {typeof totalUsers === "number"
                    ? ` / ${totalUsers}`
                    : ""}{" "}
                  users
                </span>
              </>
            }
          />
        )}

        {!loading && filteredUsers.length > 0 ? (
          <div className="pb-2">
            <div
              ref={loadMoreRef}
              className="flex min-h-12 items-center justify-center text-sm text-gray-500"
            >
              {loadingMore ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-200 border-t-red-500" />
                  <span>Memuat user berikutnya...</span>
                </div>
              ) : hasMore ? (
                <span>Scroll ke bawah untuk memuat lebih banyak user</span>
              ) : (
                <span>Semua user sudah dimuat</span>
              )}
            </div>
          </div>
        ) : null}

        <AddUserModal
          open={modalOpen}
          onClose={closeModal}
          onDismissError={() => setModalError(null)}
          initial={modalInitial}
          initialRoleIds={modalInitialRoleIds}
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
          integrationToken={
            detailItem ? integrationTokenByUserId.get(detailItem.id) : undefined
          }
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
    </div>
  );
}
