"use client";

import EntityDetailModal from "@/components/entity-management/EntityDetailModal";
import { FaEdit, FaTrash, FaShieldAlt, FaClock } from "react-icons/fa";
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
    <EntityDetailModal
      open={open}
      onClose={onClose}
      icon={<FaShieldAlt className="w-5 h-5" />}
      eyebrow="Permission Detail"
      title={permission.Name}
      subtitle={
        <code className="inline-flex rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
          {permission.Slug}
        </code>
      }
      maxWidthClassName="max-w-3xl"
      accentClasses={{ iconBg: "bg-purple-50", iconText: "text-purple-600" }}
      actions={
        <>
          <button
            onClick={() => onEdit(permission)}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
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
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1 font-medium">
            Permission ID
          </p>
          <p className="text-lg font-bold text-gray-900">#{permission.ID}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1 font-medium">
            Nama Permission
          </p>
          <p className="text-lg font-bold text-gray-900">{permission.Name}</p>
        </div>
      </div>

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
    </EntityDetailModal>
  );
}
