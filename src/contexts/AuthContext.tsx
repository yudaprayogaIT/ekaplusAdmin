// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

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

type AuthContextType = {
  currentUser: User | null;
  currentRole: Role | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_KEY = "ekaplus_current_user";
const DEMO_PASSWORD = "admin123"; // Password demo untuk semua user

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load roles and permissions data
  useEffect(() => {
    async function loadData() {
      try {
        // Load roles
        const rolesRes = await fetch("/data/roles.json");
        if (rolesRes.ok) {
          const data = await rolesRes.json();
          setRoles(data.roles || []);
        } else {
          console.error("Failed to load roles:", rolesRes.status);
        }

        // Load role permissions
        const rpRes = await fetch("/data/role_permissions.json");
        if (rpRes.ok) {
          const data = await rpRes.json();
          setRolePermissions(data.role_permissions || []);
        } else {
          console.error("Failed to load role_permissions:", rpRes.status);
        }
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setDataLoaded(true);
      }
    }
    loadData();
  }, []);

  // Login internal function - by user ID (for session restore)
  const loginByUserId = useCallback(async (userId: string): Promise<boolean> => {
    try {
      // Try localStorage first
      const usersSnap = localStorage.getItem("ekaplus_users_snapshot");
      let users: User[] = [];
      
      if (usersSnap) {
        users = JSON.parse(usersSnap);
      } else {
        // Fallback to JSON file
        const res = await fetch("/data/users.json");
        if (res.ok) {
          const data = await res.json();
          users = data.users || [];
        }
      }

      const user = users.find(u => u.id === userId);
      if (!user) {
        return false;
      }

      // Find role
      const role = roles.find(r => r.id === user.role_id || r.name === user.role);
      
      // Get permissions
      const rp = rolePermissions.find(r => r.role_id === user.role_id || r.role_name === user.role);
      const userPermissions = rp?.permissions || [];

      setCurrentUser(user);
      setCurrentRole(role || null);
      setPermissions(userPermissions);

      return true;
    } catch (error) {
      console.error("Login by ID failed:", error);
      return false;
    }
  }, [roles, rolePermissions]);

  // Check for existing session
  useEffect(() => {
    async function checkSession() {
      try {
        const savedUserId = localStorage.getItem(AUTH_KEY);
        if (savedUserId && roles.length > 0) {
          await loginByUserId(savedUserId);
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (dataLoaded) {
      checkSession();
    }
  }, [dataLoaded, roles, loginByUserId]);

  // Login with username/phone + password
  async function login(identifier: string, password: string): Promise<LoginResult> {
    try {
      // Load users
      const usersSnap = localStorage.getItem("ekaplus_users_snapshot");
      let users: User[] = [];
      
      if (usersSnap) {
        users = JSON.parse(usersSnap);
      } else {
        const res = await fetch("/data/users.json");
        if (res.ok) {
          const data = await res.json();
          users = data.users || [];
        }
      }

      // Find user by username or phone
      const normalizedIdentifier = identifier.toLowerCase().trim();
      const user = users.find(u => 
        u.username.toLowerCase() === normalizedIdentifier ||
        u.phone === normalizedIdentifier ||
        u.phone === normalizedIdentifier.replace(/^0/, '62') || // Handle 08xxx format
        u.email.toLowerCase() === normalizedIdentifier
      );

      if (!user) {
        return { 
          success: false, 
          message: "Username, email, atau nomor telepon tidak ditemukan" 
        };
      }

      // Check password (demo mode - accept DEMO_PASSWORD or "hashed_password_here")
      if (password !== DEMO_PASSWORD && user.password !== "hashed_password_here") {
        return { 
          success: false, 
          message: "Password salah" 
        };
      }

      // Check user status
      if (user.status !== "active") {
        return { 
          success: false, 
          message: "Akun tidak aktif. Hubungi administrator." 
        };
      }

      // Find role
      const role = roles.find(r => r.id === user.role_id || r.name === user.role);
      
      // Get permissions
      const rp = rolePermissions.find(r => r.role_id === user.role_id || r.role_name === user.role);
      const userPermissions = rp?.permissions || [];

      // Set state
      setCurrentUser(user);
      setCurrentRole(role || null);
      setPermissions(userPermissions);
      
      // Save session
      localStorage.setItem(AUTH_KEY, user.id);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: "Terjadi kesalahan saat login" 
      };
    }
  }

  function logout() {
    setCurrentUser(null);
    setCurrentRole(null);
    setPermissions([]);
    localStorage.removeItem(AUTH_KEY);
  }

  function hasPermission(permission: string): boolean {
    // Administrator has all permissions
    if (currentRole?.name === 'administrator') {
      return true;
    }
    return permissions.includes(permission);
  }

  function hasAnyPermission(perms: string[]): boolean {
    if (currentRole?.name === 'administrator') {
      return true;
    }
    return perms.some(p => permissions.includes(p));
  }

  function hasAllPermissions(perms: string[]): boolean {
    if (currentRole?.name === 'administrator') {
      return true;
    }
    return perms.every(p => permissions.includes(p));
  }

  const value: AuthContextType = {
    currentUser,
    currentRole,
    permissions,
    isAuthenticated: currentUser !== null,
    isLoading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}