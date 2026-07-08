"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import {
  registerSessionExpiredCallback,
  unregisterSessionExpiredCallback,
  apiFetch,
  API_CONFIG,
  getApiUrl,
} from "../config/api";
import {
  PermissionRule,
  dedupePermissionRules,
  deriveFlatPermissions,
  expandPermissionCandidates,
  extractPermissionRules,
} from "@/lib/authz";
import {
  isFeatureTourSeen,
  profileFeatureTourConfig,
  setPendingFeatureTourStep,
} from "@/lib/featureTour";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  password?: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  gender: string;
  date_of_birth: string;
  birth_place: string;
  profile_pic: string | null;
  profile_bg_color: string;
  role_id: string;
  role: string;
  branch_id: string | null;
  status: string;
  workflow_state: string | null;
  is_system?: boolean;
  created_at: string;
  updated_at: string;
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

export type LoginResult = {
  success: boolean;
  message?: string;
};

type ApiUser = {
  ID?: string | number;
  id?: string | number;
  FirstName?: string;
  first_name?: string;
  LastName?: string;
  last_name?: string;
  FullName?: string;
  full_name?: string;
  Username?: string;
  username?: string;
  Email?: string;
  email?: string;
  Phone?: string;
  phone?: string;
  IsEmailVerified?: boolean;
  is_email_verified?: boolean;
  IsPhoneVerified?: boolean;
  is_phone_verified?: boolean;
  Gender?: string;
  gender?: string;
  DateOfBirth?: string;
  date_of_birth?: string;
  BirthPlace?: string;
  birth_place?: string;
  PlaceOfBirth?: string;
  place_of_birth?: string;
  ProfilePic?: string | null;
  profile_pic?: string | null;
  ProfileBgColor?: string;
  profile_bg_color?: string;
  RoleID?: string | number;
  role_id?: string | number;
  Role?: string;
  role?: string;
  BranchID?: string | number;
  branch_id?: string | number;
  Status?: string | number;
  status?: string | number;
  WorkflowState?: string | null;
  workflow_state?: string | null;
  IsSystem?: boolean;
  is_system?: boolean;
  CreatedAt?: string;
  created_at?: string;
  UpdatedAt?: string;
  updated_at?: string;
};

type ApiLoginResponse = {
  status: string;
  code: string;
  message: string;
  data?: {
    access_token?: string;
    user?: ApiUser;
    permissions?: unknown;
    permission_rules?: unknown;
    role_permissions?: unknown;
    roles?: unknown;
    current_role?: unknown;
  };
};

type ApiUserMeResponse = {
  status?: string;
  code?: string;
  message?: string;
  data?: Record<string, unknown> | null;
};

type ApiErrorResponse = {
  status?: string;
  message?: string;
};

type AuthzSnapshot = {
  currentRole: Role | null;
  permissions: string[];
  permissionRules: PermissionRule[];
};

type ResolvedSessionState = AuthzSnapshot & {
  user: User;
};

type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};

type AuthContextType = {
  currentUser: User | null;
  currentRole: Role | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  handleSessionExpired: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccessBranch: (branchId?: string | null) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "ekaplus_current_user";
const TOKEN_KEY = "ekaplus_auth_token";
const USER_DATA_KEY = "ekaplus_user_data";
const AUTHZ_DATA_KEY = "ekaplus_authz_data";
const API_BASE_URL = "https://api-ekaplus.ekatunggal.com";

function mapApiUserToUser(apiUser: ApiUser): User {
  const roleId = apiUser.RoleID ?? apiUser.role_id ?? "";
  const birthPlace =
    apiUser.BirthPlace ||
    apiUser.birth_place ||
    apiUser.PlaceOfBirth ||
    apiUser.place_of_birth ||
    "";
  const statusValue = apiUser.Status ?? apiUser.status ?? "active";

  return {
    id: String(apiUser.ID || apiUser.id || ""),
    first_name: apiUser.FirstName || apiUser.first_name || "",
    last_name: apiUser.LastName || apiUser.last_name || "",
    full_name:
      apiUser.FullName ||
      apiUser.full_name ||
      `${apiUser.FirstName || apiUser.first_name || ""} ${apiUser.LastName || apiUser.last_name || ""}`.trim(),
    username: apiUser.Username || apiUser.username || "",
    email: apiUser.Email || apiUser.email || "",
    phone: apiUser.Phone || apiUser.phone || "",
    is_email_verified:
      apiUser.IsEmailVerified || apiUser.is_email_verified || false,
    is_phone_verified:
      apiUser.IsPhoneVerified || apiUser.is_phone_verified || false,
    gender: apiUser.Gender || apiUser.gender || "",
    date_of_birth: apiUser.DateOfBirth || apiUser.date_of_birth || "",
    birth_place: birthPlace,
    profile_pic: apiUser.ProfilePic || apiUser.profile_pic || null,
    profile_bg_color:
      apiUser.ProfileBgColor || apiUser.profile_bg_color || "#3B82F6",
    role_id: String(roleId),
    role: apiUser.Role || apiUser.role || "",
    branch_id:
      apiUser.BranchID !== undefined && apiUser.BranchID !== null && apiUser.BranchID !== ""
        ? String(apiUser.BranchID)
        : apiUser.branch_id !== undefined &&
            apiUser.branch_id !== null &&
            apiUser.branch_id !== ""
          ? String(apiUser.branch_id)
          : null,
    status: String(statusValue),
    workflow_state: apiUser.WorkflowState || apiUser.workflow_state || null,
    is_system: apiUser.IsSystem || apiUser.is_system || false,
    created_at: apiUser.CreatedAt || apiUser.created_at || "",
    updated_at: apiUser.UpdatedAt || apiUser.updated_at || "",
  };
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 <= Date.now();
}

async function isForbiddenAuth(response: Response): Promise<boolean> {
  if (response.status !== 403) return false;

  try {
    const cloned = response.clone();
    const contentType = cloned.headers.get("content-type") || "";
    let message = "";

    if (contentType.includes("application/json")) {
      const data = (await cloned.json().catch(() => null)) as
        | { message?: string; error?: string; detail?: string }
        | null;
      message =
        `${data?.message || ""} ${data?.error || ""} ${data?.detail || ""}`.toLowerCase();
    } else {
      message = (await cloned.text().catch(() => "")).toLowerCase();
    }

    return (
      message.includes("token") ||
      message.includes("expired") ||
      message.includes("unauthorized") ||
      message.includes("authentication") ||
      message.includes("session")
    );
  } catch {
    return false;
  }
}

function normalizeRoleName(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function resolveRoleColor(roleName: string, isSystem: boolean): string {
  if (isSystem) return "#DC2626";
  if (roleName.includes("admin")) return "#DC2626";
  if (roleName.includes("manager")) return "#D97706";
  if (roleName.includes("sales")) return "#2563EB";
  return "#6B7280";
}

function createRoleFromRecord(record: Record<string, unknown>): Role | null {
  const displayName =
    (typeof record.display_name === "string" && record.display_name) ||
    (typeof record.displayName === "string" && record.displayName) ||
    (typeof record.Name === "string" && record.Name) ||
    (typeof record.name === "string" && record.name) ||
    (typeof record.role_name === "string" && record.role_name) ||
    (typeof record.roleName === "string" && record.roleName) ||
    "";
  const roleSlug =
    (typeof record.slug === "string" && record.slug) ||
    (typeof record.Slug === "string" && record.Slug) ||
    normalizeRoleName(displayName);

  if (!displayName && !roleSlug) return null;

  const isSystem = Boolean(
    record.is_system ?? record.IsSystem ?? roleSlug.includes("admin"),
  );

  return {
    id: String(record.id ?? record.ID ?? (roleSlug || displayName)),
    name: normalizeRoleName(roleSlug || displayName),
    display_name: displayName || roleSlug,
    description:
      (typeof record.description === "string" && record.description) ||
      (typeof record.Description === "string" && record.Description) ||
      "",
    level: Number(record.level ?? 0),
    color:
      (typeof record.color === "string" && record.color) ||
      resolveRoleColor(roleSlug || displayName, isSystem),
    icon: (typeof record.icon === "string" && record.icon) || "",
    is_system: isSystem,
    can_be_deleted: !isSystem,
    status: String(record.status ?? "active"),
  };
}

function resolveCurrentRole(user: User, sources: unknown[]): Role | null {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    const record = source as Record<string, unknown>;

    const directRoleKeys = [
      record.current_role,
      record.currentRole,
      record.primary_role,
      record.primaryRole,
      record.role_details,
      record.roleDetails,
    ];

    for (const candidate of directRoleKeys) {
      if (candidate && typeof candidate === "object") {
        const role = createRoleFromRecord(candidate as Record<string, unknown>);
        if (role) return role;
      }
    }

    if (Array.isArray(record.roles)) {
      for (const item of record.roles) {
        if (typeof item === "object" && item) {
          const role = createRoleFromRecord(item as Record<string, unknown>);
          if (role) return role;
        }
        if (typeof item === "string" && item.trim()) {
          const name = item.trim();
          return {
            id: normalizeRoleName(name),
            name: normalizeRoleName(name),
            display_name: name,
            description: "",
            level: 0,
            color: resolveRoleColor(name, false),
            icon: "",
            is_system: false,
            can_be_deleted: true,
            status: "active",
          };
        }
      }
    }

    if (typeof record.role === "object" && record.role) {
      const role = createRoleFromRecord(record.role as Record<string, unknown>);
      if (role) return role;
    }
  }

  if (!user.role && !user.role_id) return null;

  const displayName = user.role || user.role_id;
  const roleName = normalizeRoleName(displayName);
  const isSystem = Boolean(user.is_system || roleName.includes("admin"));

  return {
    id: user.role_id || roleName,
    name: roleName,
    display_name: displayName,
    description: "",
    level: 0,
    color: resolveRoleColor(roleName, isSystem),
    icon: "",
    is_system: isSystem,
    can_be_deleted: !isSystem,
    status: user.status || "active",
  };
}

function mergeUser(baseUser: User, nextUser: User): User {
  return {
    ...baseUser,
    ...nextUser,
    id: nextUser.id || baseUser.id,
    full_name: nextUser.full_name || baseUser.full_name,
    username: nextUser.username || baseUser.username,
    email: nextUser.email || baseUser.email,
    role: nextUser.role || baseUser.role,
    role_id: nextUser.role_id || baseUser.role_id,
    branch_id: nextUser.branch_id || baseUser.branch_id,
    status: nextUser.status || baseUser.status,
  };
}

function safeParseAuthzSnapshot(rawValue: string | null): AuthzSnapshot | null {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as Partial<AuthzSnapshot>;
    return {
      currentRole:
        parsed.currentRole && typeof parsed.currentRole === "object"
          ? parsed.currentRole
          : null,
      permissions: Array.isArray(parsed.permissions)
        ? parsed.permissions.filter(
            (permission): permission is string => typeof permission === "string",
          )
        : [],
      permissionRules: Array.isArray(parsed.permissionRules)
        ? dedupePermissionRules(
            parsed.permissionRules.filter(
              (rule): rule is PermissionRule =>
                Boolean(rule) &&
                typeof rule.slug === "string" &&
                typeof rule.effect === "string" &&
                typeof rule.scopeType === "string",
            ),
          )
        : [],
    };
  } catch {
    return null;
  }
}

function hasElevatedAccess(
  user: User | null,
  role: Role | null,
  currentPermissions: string[],
): boolean {
  if (!user) return false;
  if (user.is_system || role?.is_system) return true;
  if (role && ["administrator", "admin"].includes(role.name)) return true;
  return currentPermissions.includes("*") || currentPermissions.includes("*.*");
}

async function fetchLatestUserPayload(token: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await apiFetch(
      getApiUrl(API_CONFIG.ENDPOINTS.USER_ME),
      { method: "GET", cache: "no-store" },
      token,
    );

    if (!response.ok) return null;

    const data = (await response.json().catch(() => null)) as ApiUserMeResponse | null;
    return data?.data && typeof data.data === "object" ? data.data : null;
  } catch {
    return null;
  }
}

async function resolveSessionState(
  token: string,
  baseUser: User,
  sources: unknown[],
): Promise<ResolvedSessionState> {
  const latestUserPayload = await fetchLatestUserPayload(token);
  const effectiveSources = latestUserPayload
    ? [...sources, latestUserPayload]
    : sources;

  const latestUser =
    latestUserPayload && Object.keys(latestUserPayload).length > 0
      ? mapApiUserToUser(latestUserPayload as ApiUser)
      : null;
  const user = latestUser ? mergeUser(baseUser, latestUser) : baseUser;
  const permissionRules = dedupePermissionRules(
    extractPermissionRules([user, ...effectiveSources]),
  );
  const permissions = deriveFlatPermissions(permissionRules);
  const currentRole = resolveCurrentRole(user, effectiveSources);

  return {
    user,
    currentRole,
    permissions,
    permissionRules,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [permissionRules, setPermissionRules] = useState<PermissionRule[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const originalFetchRef = useRef<typeof fetch | null>(null);

  const applyResolvedSession = useCallback(
    (session: ResolvedSessionState, tokenValue: string) => {
      setCurrentUser(session.user);
      setCurrentRole(session.currentRole);
      setPermissions(session.permissions);
      setPermissionRules(session.permissionRules);
      setToken(tokenValue);

      localStorage.setItem(AUTH_KEY, session.user.id);
      localStorage.setItem(TOKEN_KEY, tokenValue);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(session.user));
      localStorage.setItem(
        AUTHZ_DATA_KEY,
        JSON.stringify({
          currentRole: session.currentRole,
          permissions: session.permissions,
          permissionRules: session.permissionRules,
        } satisfies AuthzSnapshot),
      );
    },
    [],
  );

  const handleSessionExpired = useCallback(() => {
    setCurrentUser(null);
    setCurrentRole(null);
    setPermissions([]);
    setPermissionRules([]);
    setToken(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTHZ_DATA_KEY);
    window.location.reload();
  }, []);

  useEffect(() => {
    registerSessionExpiredCallback(handleSessionExpired);
    return () => {
      unregisterSessionExpiredCallback();
    };
  }, [handleSessionExpired]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (originalFetchRef.current) return;

    const originalFetch = window.fetch.bind(window);
    originalFetchRef.current = originalFetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      const hasSession = Boolean(localStorage.getItem(TOKEN_KEY));

      if (hasSession) {
        if (response.status === 401) {
          handleSessionExpired();
        } else if (response.status === 403) {
          const storedToken = localStorage.getItem(TOKEN_KEY);
          const tokenExpired = storedToken ? isJwtExpired(storedToken) : false;

          if (tokenExpired || (await isForbiddenAuth(response))) {
            handleSessionExpired();
          }
        }
      }

      return response;
    };

    return () => {
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
        originalFetchRef.current = null;
      }
    };
  }, [handleSessionExpired]);

  useEffect(() => {
    setDataLoaded(true);
  }, []);

  const restoreSession = useCallback(
    async (savedToken: string): Promise<boolean> => {
      try {
        const savedUserData = localStorage.getItem(USER_DATA_KEY);
        if (!savedUserData) return false;

        const savedUser = JSON.parse(savedUserData) as User;
        const savedAuthz = safeParseAuthzSnapshot(localStorage.getItem(AUTHZ_DATA_KEY));

        setCurrentUser(savedUser);
        setCurrentRole(savedAuthz?.currentRole || resolveCurrentRole(savedUser, []));
        setPermissions(savedAuthz?.permissions || []);
        setPermissionRules(savedAuthz?.permissionRules || []);
        setToken(savedToken);

        const resolved = await resolveSessionState(savedToken, savedUser, [
          savedUser,
          savedAuthz,
        ]);
        applyResolvedSession(resolved, savedToken);
        return true;
      } catch {
        return false;
      }
    },
    [applyResolvedSession],
  );

  useEffect(() => {
    async function checkSession() {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY);

        if (savedToken) {
          if (isJwtExpired(savedToken)) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            localStorage.removeItem(AUTHZ_DATA_KEY);
            return;
          }

          const restored = await restoreSession(savedToken);
          if (!restored) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            localStorage.removeItem(AUTHZ_DATA_KEY);
          }
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        localStorage.removeItem(AUTHZ_DATA_KEY);
      } finally {
        setIsLoading(false);
      }
    }

    if (dataLoaded) {
      void checkSession();
    }
  }, [dataLoaded, restoreSession]);

  async function login(
    identifier: string,
    password: string,
  ): Promise<LoginResult> {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: identifier,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = (await response
          .json()
          .catch(() => ({}))) as ApiErrorResponse;
        return {
          success: false,
          message:
            errorData.message ||
            "Login gagal. Periksa email dan password Anda.",
        };
      }

      const responseData = (await response.json()) as ApiLoginResponse;
      if (responseData.status !== "success" || !responseData.data) {
        return {
          success: false,
          message: responseData.message || "Login gagal",
        };
      }

      const authToken = responseData.data.access_token;
      const apiUserData = responseData.data.user;
      if (!authToken) {
        return {
          success: false,
          message: "Token tidak ditemukan dalam response",
        };
      }

      if (!apiUserData) {
        return {
          success: false,
          message: "Data user tidak ditemukan dalam response",
        };
      }

      const userData = mapApiUserToUser(apiUserData);
      if (!userData.is_system) {
        return {
          success: false,
          message:
            "Akun ini belum diizinkan masuk ke EKA+ Admin Panel. Aktifkan opsi System User pada data user agar akun bisa login.",
        };
      }

      const resolved = await resolveSessionState(authToken, userData, [
        responseData.data,
        apiUserData,
      ]);

      applyResolvedSession(resolved, authToken);
      if (
        typeof window !== "undefined" &&
        !isFeatureTourSeen(profileFeatureTourConfig)
      ) {
        setPendingFeatureTourStep(profileFeatureTourConfig, "menu");
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat login",
      };
    }
  }

  function logout() {
    setCurrentUser(null);
    setCurrentRole(null);
    setPermissions([]);
    setPermissionRules([]);
    setToken(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTHZ_DATA_KEY);
  }

  function hasPermission(permission: string): boolean {
    void permission;
    return currentUser !== null;
  }

  function hasAnyPermission(requestedPermissions: string[]): boolean {
    void requestedPermissions;
    return currentUser !== null;
  }

  function hasAllPermissions(requestedPermissions: string[]): boolean {
    void requestedPermissions;
    return currentUser !== null;
  }

  function canAccessBranch(branchId?: string | null): boolean {
    void branchId;
    return currentUser !== null;
  }

  const value: AuthContextType = {
    currentUser,
    currentRole,
    permissions,
    isAuthenticated: currentUser !== null,
    isLoading,
    token,
    login,
    logout,
    handleSessionExpired,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessBranch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
