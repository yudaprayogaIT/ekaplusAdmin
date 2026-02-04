// src/components/auth/RequireAuth.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLock, FaSignInAlt, FaHome } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

type RequireAuthProps = {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions. Default is ANY.
  fallbackUrl?: string;
  showAccessDenied?: boolean; // If true, show access denied instead of redirect
};

export default function RequireAuth({
  children,
  permission,
  permissions,
  requireAll = false,
  fallbackUrl = "/",
  showAccessDenied = true,
}: RequireAuthProps) {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  // Check if user has required permissions
  const checkPermissions = (): boolean => {
    // If no specific permission required, just need to be authenticated
    if (!permission && !permissions) return true;

    // Check single permission
    if (permission) {
      return hasPermission(permission);
    }

    // Check multiple permissions
    if (permissions && permissions.length > 0) {
      return requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }

    return true;
  };

  const hasRequiredPermissions = isAuthenticated && checkPermissions();

  // Redirect if not authenticated and showAccessDenied is false
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !showAccessDenied) {
      router.push(fallbackUrl);
    }
  }, [isLoading, isAuthenticated, showAccessDenied, router, fallbackUrl]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login required
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[60vh] p-4"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Login Diperlukan
          </h2>

          <p className="text-gray-600 mb-6">
            Anda harus login terlebih dahulu untuk mengakses halaman ini.
          </p>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Klik tombol <strong className="text-red-600">Login</strong> di
              pojok kanan atas
            </p>

            <div className="pt-4 border-t border-gray-100">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <FaHome className="w-4 h-4" />
                  Kembali ke Dashboard
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Authenticated but no permission - show access denied
  if (!hasRequiredPermissions) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[60vh] p-4"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-amber-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h2>

          <p className="text-gray-600 mb-6">
            Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi
            administrator jika Anda merasa ini adalah kesalahan.
          </p>

          <div className="p-4 bg-amber-50 rounded-xl mb-6 text-left">
            <p className="text-sm text-amber-800">
              <strong>Permission yang diperlukan:</strong>
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {permission && (
                <code className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                  {permission}
                </code>
              )}
              {permissions?.map((p) => (
                <code
                  key={p}
                  className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs"
                >
                  {p}
                </code>
              ))}
            </div>
          </div>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <FaHome className="w-4 h-4" />
              Kembali ke Dashboard
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  // All checks passed - render children
  return <>{children}</>;
}

// ============================================================
// PermissionButton - Button yang hanya muncul jika punya permission
// ============================================================
type PermissionButtonProps = {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode; // What to show if no permission
  hideIfNoPermission?: boolean; // If true, hide completely. If false, show disabled.
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function PermissionButton({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback,
  hideIfNoPermission = true,
  disabled,
  className,
  ...props
}: PermissionButtonProps) {
  const {
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  const checkPermissions = (): boolean => {
    if (!isAuthenticated) return false;
    if (!permission && !permissions) return true;
    if (permission) return hasPermission(permission);
    if (permissions && permissions.length > 0) {
      return requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }
    return true;
  };

  const hasAccess = checkPermissions();

  if (!hasAccess) {
    if (hideIfNoPermission) return null;
    if (fallback) return <>{fallback}</>;
    return (
      <button
        {...props}
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
      >
        {children}
      </button>
    );
  }

  return (
    <button {...props} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

// ============================================================
// PermissionGate - Wrapper untuk conditional rendering
// ============================================================
type PermissionGateProps = {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  requireAuth?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGate({
  permission,
  permissions,
  requireAll = false,
  requireAuth = true,
  children,
  fallback = null,
}: PermissionGateProps) {
  const {
    isAuthenticated,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuth();

  // Check auth requirement
  if (requireAuth && !isAuthenticated) {
    return <>{fallback}</>;
  }

  // If authenticated but no specific permission needed
  if (!permission && !permissions) {
    return <>{children}</>;
  }

  // Check permissions
  let hasAccess = false;
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
