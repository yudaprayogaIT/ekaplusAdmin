// src/components/permissions/PermissionCard.tsx
"use client";

import { motion } from "framer-motion";
import { FaShieldAlt, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Permission } from "./PermissionList";

type Props = {
  permission: Permission;
  viewMode: "grid" | "list";
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
};

export default function PermissionCard({
  permission,
  viewMode,
  onEdit,
  onDelete,
  onView,
}: Props) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Icon and Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaShieldAlt className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {permission.Name}
              </h3>
              <p className="text-sm text-gray-500 font-mono truncate">
                {permission.Slug}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onView}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="View Details"
            >
              <FaEye className="w-4 h-4" />
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      onClick={onView}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all group cursor-pointer"
    >
      {/* Header with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          <FaShieldAlt className="w-7 h-7 text-white" />
        </div>
        {/* <button
          onClick={onView}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          title="View Details"
        >
          <FaEye className="w-4 h-4" />
        </button> */}
      </div>

      {/* Permission Info */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
          {permission.Name}
        </h3>
        <p className="text-sm text-gray-500 font-mono truncate">
          {permission.Slug}
        </p>
      </div>

      {/* Timestamps */}
      <div className="mb-6 space-y-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Created:</span>
          <span>
            {new Date(permission.CreatedAt).toLocaleDateString("id-ID")}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Updated:</span>
          <span>
            {new Date(permission.UpdatedAt).toLocaleDateString("id-ID")}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
        >
          <FaEdit className="w-3 h-3" />
          <span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
          title="Delete"
        >
          <FaTrash className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
