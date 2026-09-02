"use client";

import EntityDetailModal from "@/components/entity-management/EntityDetailModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaUserShield, FaClock } from "react-icons/fa";
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
  if (!role || !open) return null;

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
    <EntityDetailModal
      open={open}
      onClose={onClose}
      icon={<FaUserShield className="w-5 h-5" />}
      eyebrow="Detail Role"
      title={role.Name}
      subtitle={
        <code className="inline-flex rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
          {role.Slug}
        </code>
      }
      accentClasses={{ iconBg: "bg-red-50", iconText: "text-red-600" }}
      actions={
        <>
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
        </>
      }
    >
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Is System
        </label>
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${
            role.IsSystem
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {role.IsSystem ? "True" : "False"}
        </span>
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
    </EntityDetailModal>
  );
}
