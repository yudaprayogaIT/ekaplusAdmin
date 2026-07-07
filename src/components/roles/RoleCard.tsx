"use client";

import EntityCard from "@/components/entity-management/EntityCard";
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
    <EntityCard
      icon={<FaUserShield className="w-5 h-5" />}
      title={role.Name}
      subtitle={
        <code className="inline-block text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded truncate max-w-full">
          {role.Slug}
        </code>
      }
      description={role.Description || "Belum ada deskripsi role."}
      detailLabel="Detail"
      onView={onView}
      actions={
        <>
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
        </>
      }
      accentClasses={{
        iconBg: "bg-red-50",
        iconText: "text-red-600",
        hoverBorder: "hover:border-red-200",
        hoverText: "group-hover:text-red-600",
        detailText: "text-red-600 hover:text-red-700",
      }}
    />
  );
}
