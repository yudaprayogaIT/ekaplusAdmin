// src/components/permissions/PermissionDetailModal.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaEdit, FaTrash, FaShieldAlt, FaClock } from "react-icons/fa";
import { Permission } from "./PermissionList";

type Props = {
  open: boolean;
  onClose: () => void;
  permission: Permission | null;
  onEdit: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
};

export default function PermissionDetailModal({
  open,
  onClose,
  permission,
  onEdit,
  onDelete,
}: Props) {
  if (!open || !permission) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Permission Detail
                </h2>
                <p className="text-sm text-gray-600">
                  Informasi lengkap permission
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Permission Info Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">
                    {permission.Name}
                  </h3>
                  <p className="text-purple-700 font-mono text-lg">
                    {permission.Slug}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  Permission ID
                </p>
                <p className="text-lg font-bold text-gray-900">
                  #{permission.ID}
                </p>
              </div>

              {/* Name */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  Nama Permission
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {permission.Name}
                </p>
              </div>

              {/* Slug */}
              <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                <p className="text-sm text-gray-500 mb-1 font-medium">Slug</p>
                <p className="text-lg font-mono font-bold text-gray-900">
                  {permission.Slug}
                </p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaClock className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-blue-900">Timestamps</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 font-medium">
                    Created At:
                  </span>
                  <span className="text-sm text-blue-900 font-semibold">
                    {new Date(permission.CreatedAt).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700 font-medium">
                    Updated At:
                  </span>
                  <span className="text-sm text-blue-900 font-semibold">
                    {new Date(permission.UpdatedAt).toLocaleString("id-ID", {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => onEdit(permission)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FaEdit className="w-4 h-4" />
                <span>Edit Permission</span>
              </button>
              <button
                onClick={() => onDelete(permission)}
                className="px-6 py-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-all flex items-center justify-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
