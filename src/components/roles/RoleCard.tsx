// src/components/roles/RoleCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaUserShield,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import { Role } from "./RoleList";

export default function RoleCard({
  role,
  viewMode = "grid",
  onEdit,
  onDelete,
  onView,
}: {
  role: Role;
  viewMode?: "grid" | "list";
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={onView}
        className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6 cursor-pointer transition-all group hover:shadow-lg"
      >
        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaUserShield className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {role.Name}
                  </h3>
                  {role.IsSystem ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaCheckCircle className="w-2.5 h-2.5" />
                      Web Admin Access
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaLock className="w-2.5 h-2.5" />
                      No Web Access
                    </span>
                  )}
                </div>
                <code className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  {role.Slug}
                </code>
              </div>
            </div>

            {role.Description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {role.Description}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all text-sm font-medium"
              >
                <FaEdit className="w-3.5 h-3.5" />
                <span>Edit</span>
              </motion.button>

              {!role.IsSystem && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-all text-sm font-medium text-red-600"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.15)",
      }}
      onClick={onView}
      className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Header with Icon */}
      <div className="relative h-32 bg-gradient-to-br from-red-500 to-red-600 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <FaUserShield className="w-16 h-16 text-white/90" />
        </div>

        {/* Access Badge */}
        <div className="absolute top-3 right-3">
          {role.IsSystem ? (
            <span className="px-3 py-1 bg-green-500/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-semibold text-white flex items-center gap-1">
              <FaCheckCircle className="w-2.5 h-2.5" />
              Web Admin
            </span>
          ) : (
            <span className="px-3 py-1 bg-gray-500/90 backdrop-blur-sm rounded-full shadow-sm text-xs font-semibold text-white flex items-center gap-1">
              <FaLock className="w-2.5 h-2.5" />
              No Access
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
          {role.Name}
        </h3>

        <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded block mb-3 truncate">
          {role.Slug}
        </code>

        {role.Description ? (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {role.Description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic mb-4 min-h-[2.5rem]">
            No description
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
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

          {!role.IsSystem && (
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
