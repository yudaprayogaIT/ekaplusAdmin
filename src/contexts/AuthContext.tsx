// src/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Types
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

export type RolePermission = {
  role_id: string;
  role_name: string;
  permissions: string[];
};

export type LoginResult = {
  success: boolean;
  message?: string;
};

type ApiUser = {
  ID?: string;
  id?: string;
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
  Status?: string;
  status?: string;
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
    token?: string;
    user?: ApiUser;
  };
};

type ApiErrorResponse = {
  status?: string;
  message?: string;
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
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canAccessBranch: (branchId?: string | null) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "ekaplus_current_user";
const TOKEN_KEY = "ekaplus_auth_token";
const USER_DATA_KEY = "ekaplus_user_data";
// const API_BASE_URL = "http://192.168.100.203:8000/api";
const API_BASE_URL = "https://estrella-subgeniculate-dollie.ngrok-free.dev/api";

// Mapping API response fields to internal User type
function mapApiUserToUser(apiUser: ApiUser): User {
  return {
    id: String(apiUser.ID || apiUser.id),
    first_name: apiUser.FirstName || apiUser.first_name || "",
    last_name: apiUser.LastName || apiUser.last_name || "",
    full_name:
      apiUser.FullName ||
      apiUser.full_name ||
      `${apiUser.FirstName || ""} ${apiUser.LastName || ""}`.trim(),
    username: apiUser.Username || apiUser.username || "",
    email: apiUser.Email || apiUser.email || "",
    phone: apiUser.Phone || apiUser.phone || "",
    is_email_verified:
      apiUser.IsEmailVerified || apiUser.is_email_verified || false,
    is_phone_verified:
      apiUser.IsPhoneVerified || apiUser.is_phone_verified || false,
    gender: apiUser.Gender || apiUser.gender || "",
    date_of_birth: apiUser.DateOfBirth || apiUser.date_of_birth || "",
    birth_place: apiUser.BirthPlace || apiUser.birth_place || "",
    profile_pic: apiUser.ProfilePic || apiUser.profile_pic || null,
    profile_bg_color:
      apiUser.ProfileBgColor || apiUser.profile_bg_color || "#3B82F6",
    role_id: String(apiUser.RoleID || apiUser.role_id || ""),
    role: apiUser.Role || apiUser.role || "",
    branch_id: apiUser.BranchID
      ? String(apiUser.BranchID)
      : apiUser.branch_id
      ? String(apiUser.branch_id)
      : null,
    status: apiUser.Status || apiUser.status || "active",
    workflow_state: apiUser.WorkflowState || apiUser.workflow_state || null,
    is_system: apiUser.IsSystem || apiUser.is_system || false,
    created_at: apiUser.CreatedAt || apiUser.created_at || "",
    updated_at: apiUser.UpdatedAt || apiUser.updated_at || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load roles and permissions data - DISABLED FOR NOW (migrasi ke SQL)
  useEffect(() => {
    // async function loadData() {
    //   try {
    //     // Load roles
    //     const rolesRes = await fetch("/data/roles.json");
    //     if (rolesRes.ok) {
    //       const data = await rolesRes.json();
    //       setRoles(data.roles || []);
    //     } else {
    //       console.error("Failed to load roles:", rolesRes.status);
    //     }

    //     // Load role permissions
    //     const rpRes = await fetch("/data/role_permissions.json");
    //     if (rpRes.ok) {
    //       const data = await rpRes.json();
    //       setRolePermissions(data.role_permissions || []);
    //     } else {
    //       console.error("Failed to load role_permissions:", rpRes.status);
    //     }
    //   } catch (error) {
    //     console.error("Failed to load auth data:", error);
    //   } finally {
    //     setDataLoaded(true);
    //   }
    // }
    // loadData();

    // Just mark as loaded without loading JSON files
    setDataLoaded(true);
  }, []);

  // Restore session from saved user data
  const restoreSession = useCallback(
    async (savedToken: string): Promise<boolean> => {
      try {
        // Try to get user data from localStorage first
        const savedUserData = localStorage.getItem(USER_DATA_KEY);

        if (savedUserData) {
          const userData = JSON.parse(savedUserData) as User;

          // DISABLED: Find role and permissions (migrasi ke SQL)
          // const role = roles.find(
          //   (r) => r.id === userData.role_id || r.name === userData.role
          // );

          // const rp = rolePermissions.find(
          //   (r) =>
          //     r.role_id === userData.role_id || r.role_name === userData.role
          // );
          // const userPermissions = rp?.permissions || [];

          setCurrentUser(userData);
          setCurrentRole(null); // No role checking for now
          setPermissions([]); // No permissions for now
          setToken(savedToken);

          // console.log("✅ Session restored from localStorage");
          return true;
        }

        // console.log("⚠️ No saved user data found");
        return false;
      } catch (error) {
        // console.error("❌ Session restore failed:", error);
        return false;
      }
    },
    [] // DISABLED: removed roles, rolePermissions dependency
  );

  // Check for existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY);

        // DISABLED: removed roles and rolePermissions check (migrasi ke SQL)
        if (savedToken) {
          // console.log("🔍 Found saved token, restoring session...");
          const restored = await restoreSession(savedToken);

          if (!restored) {
            // console.log("🧹 Session restore failed, clearing storage...");
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(AUTH_KEY);
            localStorage.removeItem(USER_DATA_KEY);
          }
        } else {
          // console.log("ℹ️ No saved session found");
        }
      } catch (error) {
        console.error("❌ Session check failed:", error);
        // Clear invalid session
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      } finally {
        setIsLoading(false);
      }
    }

    if (dataLoaded) {
      checkSession();
    }
  }, [dataLoaded, restoreSession]); // DISABLED: removed roles, rolePermissions

  // Login with email/username + password via API
  async function login(
    identifier: string,
    password: string
  ): Promise<LoginResult> {
    try {
      // console.log("🔐 Attempting login...");

      const response = await fetch(`${API_BASE_URL}/user/login`, {
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
        // console.log("❌ Login failed:", errorData.message);
        return {
          success: false,
          message:
            errorData.message ||
            "Login gagal. Periksa email dan password Anda.",
        };
      }

      const responseData = (await response.json()) as ApiLoginResponse;
      // console.log("📦 Login API Response:", responseData);

      // Check response structure based on your API
      if (responseData.status !== "success" || !responseData.data) {
        // console.log("❌ Invalid response structure");
        return {
          success: false,
          message: responseData.message || "Login gagal",
        };
      }

      // Extract token and user from data object
      const authToken = responseData.data.token;
      const apiUserData = responseData.data.user;

      if (!authToken) {
        console.log("❌ Token not found in response");
        return {
          success: false,
          message: "Token tidak ditemukan dalam response",
        };
      }

      if (!apiUserData) {
        console.log("❌ User data not found in response");
        return {
          success: false,
          message: "Data user tidak ditemukan dalam response",
        };
      }

      // Save token
      setToken(authToken);
      localStorage.setItem(TOKEN_KEY, authToken);
      // console.log("💾 Token saved to localStorage");

      // Map API user data to internal User type
      const userData = mapApiUserToUser(apiUserData);

      // DISABLED: Find role and permissions (migrasi ke SQL)
      // const role = roles.find(
      //   (r) => r.id === userData.role_id || r.name === userData.role
      // );

      // const rp = rolePermissions.find(
      //   (r) => r.role_id === userData.role_id || r.role_name === userData.role
      // );
      // const userPermissions = rp?.permissions || [];

      setCurrentUser(userData);
      setCurrentRole(null); // No role checking for now
      setPermissions([]); // No permissions for now

      // Save session - Save both user ID and complete user data
      localStorage.setItem(AUTH_KEY, userData.id);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      // console.log("💾 User data saved to localStorage");
      // console.log("✅ Login successful, session saved");

      return { success: true };
    } catch (error) {
      console.error("❌ Login error:", error);
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
    // console.log("🚪 Logging out...");
    setCurrentUser(null);
    setCurrentRole(null);
    setPermissions([]);
    setToken(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    // console.log("✅ Logged out, session cleared");
  }

  function hasPermission(permission: string): boolean {
    // DISABLED: Permission checking disabled (migrasi ke SQL)
    // Allow all users to access all features for now
    return true;

    // // Administrator has all permissions
    // if (currentRole?.name === "administrator") {
    //   return true;
    // }
    // return permissions.includes(permission);
  }

  function hasAnyPermission(perms: string[]): boolean {
    // DISABLED: Permission checking disabled (migrasi ke SQL)
    // Allow all users to access all features for now
    return true;

    // if (currentRole?.name === "administrator") {
    //   return true;
    // }
    // return perms.some((p) => permissions.includes(p));
  }

  function hasAllPermissions(perms: string[]): boolean {
    // DISABLED: Permission checking disabled (migrasi ke SQL)
    // Allow all users to access all features for now
    return true;

    // if (currentRole?.name === "administrator") {
    //   return true;
    // }
    // return perms.every((p) => permissions.includes(p));
  }

  function canAccessBranch(branchId?: string | null): boolean {
    // DISABLED: Branch access control disabled (migrasi ke SQL)
    // Allow all users to access all branches for now
    return true;

    // // if no branch specified, allow (permission check not applicable)
    // if (branchId === undefined || branchId === null || branchId === "") {
    //   return true;
    // }

    // // if not logged in, deny
    // if (!currentUser) return false;

    // // admins and system users can access any branch
    // if (currentRole?.name === "administrator" || currentUser.is_system) {
    //   return true;
    // }

    // // otherwise only allow if user's branch matches requested branch
    // return currentUser.branch_id === branchId;
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
