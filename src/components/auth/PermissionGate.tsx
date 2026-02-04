// src/components/auth/PermissionGate.tsx
"use client";

import React, { ReactNode } from "react";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

type PermissionGateProps = {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showLocked?: boolean;
  branchId?: string | null;
};

export function PermissionGate({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback,
  showLocked = false,
  branchId,
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccessBranch, isAuthenticated } = useAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    if (showLocked) {
      return <LockedContent message="Silakan login untuk mengakses fitur ini" />;
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Check branch access if branchId is provided
  if (branchId !== undefined && !canAccessBranch(branchId)) {
    if (showLocked) {
      return <LockedContent message="Anda tidak memiliki akses ke cabang ini" />;
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Check single permission
  if (permission) {
    if (!hasPermission(permission)) {
      if (showLocked) {
        return <LockedContent message={`Permission "${permission}" diperlukan`} />;
      }
      return fallback ? <>{fallback}</> : null;
    }
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      if (showLocked) {
        return <LockedContent message="Anda tidak memiliki izin untuk mengakses fitur ini" />;
      }
      return fallback ? <>{fallback}</> : null;
    }
  }

  return <>{children}</>;
}

function LockedContent({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FaLock className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Akses Ditolak</h3>
      <p className="text-sm text-gray-500 max-w-md">{message}</p>
    </div>
  );
}

// Hook for checking permission in code
export function usePermission(permission: string): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Component for showing content only to specific roles
type RoleGateProps = {
  children: ReactNode;
  roles: string[];
  fallback?: ReactNode;
  showLocked?: boolean;
};

export function RoleGate({ children, roles, fallback, showLocked = false }: RoleGateProps) {
  const { currentRole, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentRole) {
    if (showLocked) {
      return <LockedContent message="Silakan login untuk mengakses fitur ini" />;
    }
    return fallback ? <>{fallback}</> : null;
  }

  if (!roles.includes(currentRole.name)) {
    if (showLocked) {
      return <LockedContent message={`Role ${roles.join(' atau ')} diperlukan`} />;
    }
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

// Not Authenticated Gate - shows content only when NOT logged in
export function NotAuthenticatedGate({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}

// Authenticated Gate - shows content only when logged in
export function AuthenticatedGate({ 
  children, 
  fallback 
}: { 
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
          <FaExclamationTriangle className="w-9 h-9 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Login Diperlukan</h3>
        <p className="text-gray-500 max-w-md mb-6">
          Silakan login terlebih dahulu untuk mengakses halaman ini. 
          Klik tombol login di pojok kanan atas.
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
}