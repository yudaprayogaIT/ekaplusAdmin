"use client";

import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaUserShield } from "react-icons/fa";
import { Role } from "./RoleList";

export default function RoleCard({
  role,
  onEdit,
  onDelete,
  onView,
}: {
  role: Role;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onView}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer transition-all group hover:shadow-md hover:border-red-200"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
          <FaUserShield className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 text-base md:text-lg line-clamp-1 group-hover:text-red-600 transition-colors">
                {role.Name}
              </h3>
              <code className="mt-1 inline-block text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded truncate max-w-full">
                {role.Slug}
              </code>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView?.();
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Detail
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-600 line-clamp-2 min-h-10">
            {role.Description || "Belum ada deskripsi role."}
          </p>

          <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
