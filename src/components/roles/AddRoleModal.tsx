// src/components/roles/AddRoleModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaShieldAlt, FaKey, FaCheck } from "react-icons/fa";
import type { Role, Permission, RolePermission } from "./RoleList";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import UnsavedChangesDialog from "@/components/ui/UnsavedChangesDialog";

const SNAP_KEY = "ekaplus_roles_snapshot";
const PERM_SNAP_KEY = "ekaplus_role_permissions_snapshot";

const COLOR_OPTIONS = [
  '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', 
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
];

const STATUS_OPTIONS = ['active', 'inactive'];

export default function AddRoleModal({
  open,
  onClose,
  initial,
  permissions,
  rolePermissions,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Role | null;
  permissions: Permission[];
  rolePermissions: RolePermission[];
}) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState(10);
  const [color, setColor] = useState("#3B82F6");
  const [status, setStatus] = useState("active");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<'basic' | 'permissions'>('basic');

  // Track initial state for dirty checking
  const [initialState, setInitialState] = useState({
    name: "",
    displayName: "",
    description: "",
    level: 10,
    color: "#3B82F6",
    status: "active",
    selectedPermissions: [] as string[],
  });

  // Check if form is dirty
  const isDirty =
    name !== initialState.name ||
    displayName !== initialState.displayName ||
    description !== initialState.description ||
    level !== initialState.level ||
    color !== initialState.color ||
    status !== initialState.status ||
    JSON.stringify(selectedPermissions) !== JSON.stringify(initialState.selectedPermissions);

  // Unsaved changes hook
  const { showConfirm, handleClose, handleConfirmClose, handleCancelClose } =
    useUnsavedChanges({ isDirty, onClose });

  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  permissions.forEach(perm => {
    if (!permissionsByModule[perm.module]) {
      permissionsByModule[perm.module] = [];
    }
    permissionsByModule[perm.module].push(perm);
  });

  const modules = Object.keys(permissionsByModule).sort();

  useEffect(() => {
    if (initial) {
      const existingRp = rolePermissions.find(rp => rp.role_id === initial.id);
      const perms = existingRp?.permissions || [];

      setName(initial.name ?? "");
      setDisplayName(initial.display_name ?? "");
      setDescription(initial.description ?? "");
      setLevel(initial.level ?? 10);
      setColor(initial.color ?? "#3B82F6");
      setStatus(initial.status ?? "active");
      setSelectedPermissions(perms);

      // Set initial state for dirty checking
      setInitialState({
        name: initial.name ?? "",
        displayName: initial.display_name ?? "",
        description: initial.description ?? "",
        level: initial.level ?? 10,
        color: initial.color ?? "#3B82F6",
        status: initial.status ?? "active",
        selectedPermissions: perms,
      });
    } else {
      setName("");
      setDisplayName("");
      setDescription("");
      setLevel(10);
      setColor("#3B82F6");
      setStatus("active");
      setSelectedPermissions([]);

      // Set initial state for dirty checking
      setInitialState({
        name: "",
        displayName: "",
        description: "",
        level: 10,
        color: "#3B82F6",
        status: "active",
        selectedPermissions: [],
      });
    }
    setActiveTab('basic');
  }, [initial, open, rolePermissions]);

  // Auto-generate name from display name
  useEffect(() => {
    if (!initial && displayName) {
      const auto = displayName.toLowerCase().replace(/\s+/g, '_');
      setName(auto);
    }
  }, [displayName, initial]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) {
          const form = document.querySelector("form");
          if (form) {
            form.requestSubmit();
          }
        }
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        if (!saving) {
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, saving, handleClose]);

  function togglePermission(permName: string) {
    setSelectedPermissions(prev => 
      prev.includes(permName)
        ? prev.filter(p => p !== permName)
        : [...prev, permName]
    );
  }

  function toggleModule(module: string) {
    const modulePerms = permissionsByModule[module].map(p => p.name);
    const allSelected = modulePerms.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      setSelectedPermissions(prev => prev.filter(p => !modulePerms.includes(p)));
    } else {
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePerms])]);
    }
  }

  function selectAll() {
    setSelectedPermissions(permissions.map(p => p.name));
  }

  function clearAll() {
    setSelectedPermissions([]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const now = new Date().toISOString();

    const rolePayload: Partial<Role> = {
      name: name.trim(),
      display_name: displayName.trim(),
      description: description.trim(),
      level,
      color,
      icon: 'shield-check',
      status,
      updated_at: now,
    };

    try {
      // Update roles
      const rolesRaw = localStorage.getItem(SNAP_KEY);
      let rolesList: Role[] = rolesRaw ? JSON.parse(rolesRaw) : [];
      
      let roleId = initial?.id;
      
      if (initial && initial.id) {
        rolesList = rolesList.map((r) => (r.id === initial.id ? { 
          ...r, 
          ...rolePayload, 
          id: initial.id,
          is_system: initial.is_system,
          can_be_deleted: initial.can_be_deleted,
        } as Role : r));
      } else {
        roleId = `role_${Date.now()}`;
        const newRole: Role = {
          id: roleId,
          ...rolePayload,
          is_system: false,
          can_be_deleted: true,
          created_at: now,
        } as Role;
        rolesList.push(newRole);
      }
      
      localStorage.setItem(SNAP_KEY, JSON.stringify(rolesList));
      
      // Update role permissions
      const rpRaw = localStorage.getItem(PERM_SNAP_KEY);
      const rpList: RolePermission[] = rpRaw ? JSON.parse(rpRaw) : [];
      
      const existingRpIdx = rpList.findIndex(rp => rp.role_id === roleId);
      const newRp: RolePermission = {
        id: existingRpIdx >= 0 ? rpList[existingRpIdx].id : `rp_${Date.now()}`,
        role_id: roleId!,
        role_name: name.trim(),
        permissions: selectedPermissions,
        created_at: existingRpIdx >= 0 ? rpList[existingRpIdx].created_at : now,
        updated_at: now,
      };
      
      if (existingRpIdx >= 0) {
        rpList[existingRpIdx] = newRp;
      } else {
        rpList.push(newRp);
      }
      
      localStorage.setItem(PERM_SNAP_KEY, JSON.stringify(rpList));
      
      window.dispatchEvent(new Event("ekaplus:roles_update"));
    } catch (error) {
      console.error('Failed to save role:', error);
    }
    
    setSaving(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div 
              className="px-6 py-6 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <FaShieldAlt className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {initial ? "Edit Role" : "Tambah Role Baru"}
                    </h3>
                    <p className="text-white/80 text-sm">
                      {initial ? "Perbarui informasi role" : "Lengkapi form untuk menambahkan role"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === 'basic'
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaShieldAlt className="w-4 h-4 inline-block mr-2" />
                Informasi Dasar
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === 'permissions'
                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaKey className="w-4 h-4 inline-block mr-2" />
                Permissions ({selectedPermissions.length})
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="p-6 max-h-[calc(90vh-220px)] overflow-y-auto">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* Display Name & Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Display Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="Admin Cabang"
                        required
                        disabled={initial?.is_system}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name (System) <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-mono"
                        placeholder="admin_cabang"
                        required
                        disabled={initial?.is_system}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                      rows={3}
                      placeholder="Deskripsi role..."
                    />
                  </div>

                  {/* Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Level <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                        disabled={initial?.is_system}
                      />
                      <div className="w-20 px-4 py-2 bg-gray-100 rounded-xl text-center font-bold text-gray-800">
                        {level}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Higher level = more authority (1-100)
                    </p>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Warna Role
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-12 h-12 rounded-xl transition-all ${
                            color === c
                              ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      {STATUS_OPTIONS.map(s => (
                        <label
                          key={s}
                          className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all capitalize ${
                            status === s
                              ? s === 'active' ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-500 bg-gray-50 text-gray-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={s}
                            checked={status === s}
                            onChange={(e) => setStatus(e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Permissions Tab */}
              {activeTab === 'permissions' && (
                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600">
                      <strong>{selectedPermissions.length}</strong> of {permissions.length} permissions selected
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAll}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  {/* Permissions by Module */}
                  <div className="space-y-4">
                    {modules.map(module => {
                      const modulePerms = permissionsByModule[module];
                      const selectedCount = modulePerms.filter(p => selectedPermissions.includes(p.name)).length;
                      const allSelected = selectedCount === modulePerms.length;
                      const someSelected = selectedCount > 0 && !allSelected;

                      return (
                        <div key={module} className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
                          {/* Module Header */}
                          <div 
                            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => toggleModule(module)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                allSelected ? 'bg-green-500 border-green-500' : 
                                someSelected ? 'bg-green-200 border-green-400' : 
                                'border-gray-300'
                              }`}>
                                {(allSelected || someSelected) && (
                                  <FaCheck className={`w-3 h-3 ${allSelected ? 'text-white' : 'text-green-600'}`} />
                                )}
                              </div>
                              <span className="font-bold text-gray-800 uppercase tracking-wide text-sm">
                                {module}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                              {selectedCount}/{modulePerms.length}
                            </span>
                          </div>

                          {/* Permissions */}
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {modulePerms.map(perm => {
                              const isSelected = selectedPermissions.includes(perm.name);
                              return (
                                <label
                                  key={perm.id}
                                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                    isSelected 
                                      ? 'bg-green-50 border-2 border-green-200' 
                                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => togglePermission(perm.name)}
                                    className="mt-1 w-4 h-4 text-green-500 rounded border-gray-300 focus:ring-green-500"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-800 text-sm">
                                        {perm.display_name}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                        perm.scope === 'all' ? 'bg-green-100 text-green-700' :
                                        perm.scope === 'branch' ? 'bg-blue-100 text-blue-700' :
                                        'bg-purple-100 text-purple-700'
                                      }`}>
                                        {perm.scope}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{perm.description}</p>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{initial ? "Simpan Perubahan" : "Tambah Role"}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Unsaved Changes Dialog */}
          <UnsavedChangesDialog
            open={showConfirm}
            onConfirm={handleConfirmClose}
            onCancel={handleCancelClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}