// src/components/roles/RoleCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaKey,
  FaLock,
} from "react-icons/fa";
import type { Role } from "./RoleList";

export default function RoleCard({
  role,
  permissionCount,
  onEdit,
  onDelete,
  onView,
}: {
  role: Role;
  permissionCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => onView?.()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Header with Color */}
      <div 
        className="h-24 relative overflow-hidden"
        style={{ backgroundColor: role.color }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-black/10 rounded-full" />
        
        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-800">
            Level {role.level}
          </span>
        </div>

        {/* System Badge */}
        {role.is_system && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full text-xs font-bold text-white flex items-center gap-1">
              <FaLock className="w-2.5 h-2.5" />
              System
            </span>
          </div>
        )}
      </div>

      {/* Icon */}
      <div className="relative -mt-8 px-5">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl border-4 border-white"
          style={{ backgroundColor: role.color }}
        >
          <FaShieldAlt className="w-7 h-7" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-3">
        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-red-600 transition-colors">
          {role.display_name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {role.description}
        </p>

        {/* Permission Count */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
            <FaKey className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">
              {permissionCount} Permissions
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            role.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {role.status}
          </span>
          <code className="text-xs text-gray-400 font-mono">
            {role.name}
          </code>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group/btn"
          >
            <FaEdit className="w-3.5 h-3.5 text-gray-600 group-hover/btn:text-red-600 transition-colors" />
            <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-red-600 transition-colors">
              Edit
            </span>
          </motion.button>

          {role.can_be_deleted && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
            >
              <FaTrash className="w-3.5 h-3.5 text-red-600" />
              <span className="text-sm font-semibold text-red-600">Hapus</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}