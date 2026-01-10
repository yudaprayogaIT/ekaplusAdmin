// src/components/roles/RoleDetailModal.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaCheckCircle,
  FaLock,
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-8 py-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative">
                {/* Icon and Badges */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FaUserShield className="w-8 h-8 text-white" />
                  </div>
                  {role.IsSystem ? (
                    <span className="px-4 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-2">
                      <FaCheckCircle className="w-3 h-3" />
                      Web Admin Access
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 bg-gray-500/90 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-2">
                      <FaLock className="w-3 h-3" />
                      No Web Access
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-3">{role.Name}</h2>

                <code className="text-lg text-red-100 bg-white/10 px-3 py-1 rounded">
                  {role.Slug}
                </code>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Deskripsi
                </label>
                {role.Description ? (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {role.Description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 text-center">
                    <p className="text-gray-400 italic">No description provided</p>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Created At */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaClock className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                      Dibuat
                    </label>
                  </div>
                  <p className="text-blue-900 font-semibold">
                    {formatDate(role.CreatedAt)}
                  </p>
                </div>

                {/* Updated At */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaClock className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-bold text-purple-900 uppercase tracking-wide">
                      Diupdate
                    </label>
                  </div>
                  <p className="text-purple-900 font-semibold">
                    {formatDate(role.UpdatedAt)}
                  </p>
                </div>
              </div>

              {/* Web Access Info */}
              <div className={`mb-8 border-2 rounded-2xl p-6 ${
                role.IsSystem
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    role.IsSystem ? "bg-green-500" : "bg-gray-500"
                  }`}>
                    {role.IsSystem ? (
                      <FaCheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <FaLock className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold mb-2 ${
                      role.IsSystem ? "text-green-900" : "text-gray-900"
                    }`}>
                      {role.IsSystem ? "✅ Web Admin Access Enabled" : "❌ No Web Admin Access"}
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                      role.IsSystem ? "text-green-700" : "text-gray-700"
                    }`}>
                      {role.IsSystem ? (
                        <>
                          <strong>IsSystem = true:</strong> Pengguna dengan role ini <strong>BISA login</strong> ke web admin ekaplus.
                          Role ini memiliki akses penuh ke sistem administrasi.
                          {role.IsSystem && (
                            <> Nama dan slug tidak dapat diubah untuk menjaga integritas sistem.</>
                          )}
                        </>
                      ) : (
                        <>
                          <strong>IsSystem = false:</strong> Pengguna dengan role ini <strong>TIDAK BISA login</strong> ke web admin ekaplus.
                          Role ini hanya untuk customer atau user aplikasi mobile/website publik.
                        </>
                      )}
                    </p>
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

                {!role.IsSystem && (
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
