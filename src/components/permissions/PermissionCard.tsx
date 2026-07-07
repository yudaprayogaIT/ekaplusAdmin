"use client";

import EntityCard from "@/components/entity-management/EntityCard";
import { motion } from "framer-motion";
import { FaShieldAlt, FaEdit, FaTrash } from "react-icons/fa";
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
  onEdit,
  onDelete,
  onView,
}: Props) {
  return (
    <EntityCard
      icon={<FaShieldAlt className="w-5 h-5" />}
      title={permission.Name}
      subtitle={
        <code className="inline-block text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded truncate max-w-full">
          {permission.Slug}
        </code>
      }
      description={
        <div className="space-y-1 text-xs text-gray-500">
          <div>
            Created: {new Date(permission.CreatedAt).toLocaleDateString("id-ID")}
          </div>
          <div>
            Updated: {new Date(permission.UpdatedAt).toLocaleDateString("id-ID")}
          </div>
        </div>
      }
      onView={onView}
      accentClasses={{
        iconBg: "bg-purple-50",
        iconText: "text-purple-600",
        hoverBorder: "hover:border-purple-200",
        hoverText: "group-hover:text-purple-600",
        detailText: "text-purple-600 hover:text-purple-700",
      }}
      actions={
        <>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
          >
            <FaEdit className="w-3 h-3" />
            <span>Edit</span>
          </motion.button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
            title="Delete"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </>
      }
    />
  );
}
