"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaClock,
} from "react-icons/fa";
import { Role } from "./RoleList";

export default function RoleDetailModal({
  open,
  onClose,
  role,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
  onEdit?: (r: Role) => void;
  onDelete?: (r: Role) => void;
}) {
  if (!role) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-5 border-b border-gray-100">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-gray-100 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>

              <div className="pr-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                    <FaUserShield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Detail Role</p>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {role.Name}
                    </h2>
                  </div>
                </div>

                <code className="inline-flex rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {role.Slug}
                </code>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                {role.Description ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-gray-700 leading-relaxed text-xs">
                      {role.Description}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
                    <p className="text-xs text-gray-400 italic">
                      Belum ada deskripsi role.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FaClock className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-semibold text-gray-700">
                      Dibuat
                    </label>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(role.CreatedAt)}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FaClock className="w-4 h-4 text-gray-500" />
                    <label className="text-sm font-semibold text-gray-700">
                      Diupdate
                    </label>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(role.UpdatedAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(role)}
                  className="flex-1 flex items-center justify-center gap-3 px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Role</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete?.(role)}
                  className="flex-1 flex items-center justify-center gap-3 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Hapus</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
