// src/components/roles/RoleList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import RoleCard from "./RoleCard";
import AddRoleModal from "./AddRoleModal";
import RoleDetailModal from "./RoleDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import { FaPlus, FaSearch, FaShieldAlt, FaUsers, FaKey, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

export type Permission = {
  id: string;
  module: string;
  name: string;
  display_name: string;
  description: string;
  scope: string;
  created_at: string;
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
  created_at: string;
  updated_at: string;
};

export type RolePermission = {
  id: string;
  role_id: string;
  role_name: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
};

const ROLES_URL = "/data/roles.json";
const PERMISSIONS_URL = "/data/permissions.json";
const ROLE_PERMISSIONS_URL = "/data/role_permissions.json";
const SNAP_KEY = "ekaplus_roles_snapshot";
const PERM_SNAP_KEY = "ekaplus_role_permissions_snapshot";

export default function RoleList() {
  const { hasPermission, isAuthenticated, isLoading: authLoading } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Role | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Role | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Permission checks
  const canViewRoles = hasPermission('roles.view');
  const canManageRoles = hasPermission('roles.manage');

  // Load data - only if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      
      try {
        // Load roles
        const rolesRes = await fetch(ROLES_URL, { cache: "no-store" });
        if (rolesRes.ok) {
          const data = await rolesRes.json();
          if (!cancelled) {
            const rolesList = data.roles || [];
            setRoles(rolesList);
            try { localStorage.setItem(SNAP_KEY, JSON.stringify(rolesList)); } catch {}
          }
        }

        // Load permissions
        const permRes = await fetch(PERMISSIONS_URL, { cache: "no-store" });
        if (permRes.ok) {
          const permData = await permRes.json();
          if (!cancelled) {
            setPermissions(permData.permissions || []);
          }
        }

        // Load role permissions mapping
        const rpRes = await fetch(ROLE_PERMISSIONS_URL, { cache: "no-store" });
        if (rpRes.ok) {
          const rpData = await rpRes.json();
          if (!cancelled) {
            const rpList = rpData.role_permissions || [];
            setRolePermissions(rpList);
            try { localStorage.setItem(PERM_SNAP_KEY, JSON.stringify(rpList)); } catch {}
          }
        }

      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try { setRoles(JSON.parse(raw) as Role[]); } catch {}
    }
    window.addEventListener("ekaplus:roles_update", handler);
    return () => window.removeEventListener("ekaplus:roles_update", handler);
  }, []);

  function saveSnapshot(arr: Role[]) {
    try { localStorage.setItem(SNAP_KEY, JSON.stringify(arr)); } catch {}
    window.dispatchEvent(new Event("ekaplus:roles_update"));
  }

  function getRolePermissions(roleId: string): string[] {
    const rp = rolePermissions.find(r => r.role_id === roleId);
    return rp?.permissions || [];
  }

  function getPermissionDetails(permName: string): Permission | undefined {
    return permissions.find(p => p.name === permName);
  }

  function promptDeleteRole(role: Role) {
    if (role.is_system || !role.can_be_deleted) {
      alert("Role sistem tidak dapat dihapus!");
      return;
    }
    setConfirmTitle("Hapus Role");
    setConfirmDesc(`Yakin ingin menghapus role "${role.display_name}"?`);
    actionRef.current = async () => {
      const next = roles.filter((x) => x.id !== role.id);
      setRoles(next);
      saveSnapshot(next);
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }
  
  function handleEdit(role: Role) {
    setModalInitial(role);
    setModalOpen(true);
  }

  function openDetail(role: Role) {
    setDetailItem(role);
    setDetailOpen(true);
  }
  
  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(role: Role) {
    closeDetail();
    setTimeout(() => handleEdit(role), 80);
  }
  
  function onDetailDelete(role: Role) {
    closeDetail();
    setTimeout(() => promptDeleteRole(role), 80);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) { 
      await actionRef.current(); 
      actionRef.current = null; 
    }
  }
  
  function confirmCancel() { 
    actionRef.current = null; 
    setConfirmOpen(false); 
  }

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login required
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Diperlukan</h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Roles.
            Klik tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaShieldAlt className="w-4 h-4" />
            <span>Data roles dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  // Check permission
  if (!canViewRoles) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Akses Ditolak</h2>
          <p className="text-gray-600">
            Anda tidak memiliki permission untuk melihat data Roles.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat data roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Filter roles
  let filteredRoles = roles;
  
  if (searchQuery.trim()) {
    filteredRoles = filteredRoles.filter(r => 
      r.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort by level descending
  const sortedRoles = [...filteredRoles].sort((a, b) => b.level - a.level);

  // Get unique modules from permissions
  const modules = Array.from(new Set(permissions.map(p => p.module)));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Roles & Permissions</h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola role dan hak akses pengguna
          </p>
        </div>
        
        {canManageRoles ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Role</span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed">
            <FaLock className="w-4 h-4" />
            <span>Tambah Role</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FaShieldAlt className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Total Roles</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">{roles.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <FaKey className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Total Permissions</span>
          </div>
          <div className="text-3xl font-bold text-green-900">{permissions.length}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-700 font-medium">Modules</span>
          </div>
          <div className="text-3xl font-bold text-purple-900">{modules.length}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <FaShieldAlt className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-amber-700 font-medium">System Roles</span>
          </div>
          <div className="text-3xl font-bold text-amber-900">
            {roles.filter(r => r.is_system).length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari role..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Roles Display */}
      {sortedRoles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaShieldAlt className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada role</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada role yang ditambahkan'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedRoles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              permissionCount={getRolePermissions(role.id).length}
              onEdit={() => handleEdit(role)}
              onDelete={() => promptDeleteRole(role)}
              onView={() => openDetail(role)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddRoleModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initial={modalInitial}
        permissions={permissions}
        rolePermissions={rolePermissions}
      />
      
      <RoleDetailModal 
        open={detailOpen} 
        onClose={closeDetail} 
        role={detailItem}
        permissions={permissions}
        rolePermissions={getRolePermissions(detailItem?.id || '')}
        getPermissionDetails={getPermissionDetails}
        onEdit={onDetailEdit} 
        onDelete={onDetailDelete} 
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