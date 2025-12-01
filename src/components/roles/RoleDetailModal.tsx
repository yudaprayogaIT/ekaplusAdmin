// src/components/roles/RoleDetailModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  FaTimes, FaEdit, FaTrash, FaShieldAlt, FaKey, FaLock,
  FaEye, FaPlus, FaPen, FaTrashAlt, FaCheck, FaBan, FaGlobe
} from "react-icons/fa";
import type { Role, Permission } from "./RoleList";

function getPermissionIcon(permName: string) {
  if (permName.includes('.view')) return <FaEye className="w-3.5 h-3.5" />;
  if (permName.includes('.create')) return <FaPlus className="w-3.5 h-3.5" />;
  if (permName.includes('.edit')) return <FaPen className="w-3.5 h-3.5" />;
  if (permName.includes('.delete')) return <FaTrashAlt className="w-3.5 h-3.5" />;
  if (permName.includes('.approve')) return <FaCheck className="w-3.5 h-3.5" />;
  if (permName.includes('.reject')) return <FaBan className="w-3.5 h-3.5" />;
  if (permName.includes('.manage')) return <FaShieldAlt className="w-3.5 h-3.5" />;
  return <FaKey className="w-3.5 h-3.5" />;
}

function getScopeColor(scope: string) {
  switch (scope) {
    case 'all': return 'bg-green-100 text-green-700';
    case 'branch': return 'bg-blue-100 text-blue-700';
    case 'own': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

function getScopeIcon(scope: string) {
  switch (scope) {
    case 'all': return <FaGlobe className="w-3 h-3" />;
    case 'branch': return <FaShieldAlt className="w-3 h-3" />;
    case 'own': return <FaLock className="w-3 h-3" />;
    default: return <FaKey className="w-3 h-3" />;
  }
}

export default function RoleDetailModal({
  open,
  onClose,
  role,
  permissions,
  rolePermissions,
  getPermissionDetails,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
  permissions: Permission[];
  rolePermissions: string[];
  getPermissionDetails: (name: string) => Permission | undefined;
  onEdit?: (r: Role) => void;
  onDelete?: (r: Role) => void;
}) {
  if (!role) return null;

  // Group permissions by module
  const permissionsByModule: Record<string, Permission[]> = {};
  rolePermissions.forEach(permName => {
    const perm = getPermissionDetails(permName);
    if (perm) {
      if (!permissionsByModule[perm.module]) {
        permissionsByModule[perm.module] = [];
      }
      permissionsByModule[perm.module].push(perm);
    }
  });

  const moduleOrder = ['users', 'customers', 'items', 'categories', 'credits', 'memberships', 'workflows', 'roles', 'branches'];
  const sortedModules = Object.keys(permissionsByModule).sort((a, b) => {
    const aIdx = moduleOrder.indexOf(a);
    const bIdx = moduleOrder.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div 
              className="px-8 py-10 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)` }}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />
              
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative flex items-start gap-6">
                {/* Icon */}
                <div 
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-white shadow-2xl border-4 border-white/30 flex-shrink-0"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                >
                  <FaShieldAlt className="w-12 h-12" />
                </div>

                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                      Level {role.level}
                    </span>
                    <span className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold capitalize ${
                      role.status === 'active' ? 'bg-green-500/90' : 'bg-gray-500/90'
                    }`}>
                      {role.status}
                    </span>
                    {role.is_system && (
                      <span className="px-4 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaLock className="w-3 h-3" />
                        System Role
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold mb-2">{role.display_name}</h2>
                  <p className="text-white/80">{role.description}</p>
                  <code className="inline-block mt-2 px-3 py-1 bg-black/20 rounded-lg text-sm font-mono">
                    {role.name}
                  </code>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaKey className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">Total Permissions</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">{rolePermissions.length}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaGlobe className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-900">Global Access</span>
                  </div>
                  <div className="text-3xl font-bold text-green-900">
                    {rolePermissions.filter(p => getPermissionDetails(p)?.scope === 'all').length}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaShieldAlt className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">Modules</span>
                  </div>
                  <div className="text-3xl font-bold text-purple-900">{sortedModules.length}</div>
                </div>
              </div>

              {/* Permissions by Module */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaKey className="w-5 h-5 text-gray-400" />
                  Permissions by Module
                </h3>
                
                <div className="space-y-4">
                  {sortedModules.map(module => (
                    <div key={module} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <span 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: role.color }}
                        >
                          {module[0].toUpperCase()}
                        </span>
                        {module}
                        <span className="ml-auto text-xs font-normal text-gray-500 bg-white px-2 py-1 rounded-full">
                          {permissionsByModule[module].length} permissions
                        </span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {permissionsByModule[module].map(perm => (
                          <div
                            key={perm.id}
                            className="group relative"
                          >
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${getScopeColor(perm.scope)}`}>
                              {getPermissionIcon(perm.name)}
                              <span>{perm.display_name}</span>
                              <span className="flex items-center gap-1 opacity-60">
                                {getScopeIcon(perm.scope)}
                              </span>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {perm.description}
                              <br />
                              <span className="text-gray-400">Scope: {perm.scope}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {rolePermissions.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <FaKey className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No permissions assigned to this role</p>
                  </div>
                )}
              </div>

              {/* Scope Legend */}
              <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-3">Permission Scope Legend</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getScopeColor('all')}`}>
                      {getScopeIcon('all')}
                      All
                    </span>
                    <span className="text-xs text-gray-500">Access to all data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getScopeColor('branch')}`}>
                      {getScopeIcon('branch')}
                      Branch
                    </span>
                    <span className="text-xs text-gray-500">Limited to own branch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getScopeColor('own')}`}>
                      {getScopeIcon('own')}
                      Own
                    </span>
                    <span className="text-xs text-gray-500">Only own data</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(role)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                >
                  <FaEdit className="w-5 h-5" />
                  <span>Edit Role</span>
                </motion.button>

                {role.can_be_deleted && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete?.(role)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                  >
                    <FaTrash className="w-5 h-5" />
                    <span>Hapus</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}