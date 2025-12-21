// src/components/doctype/GenericDetailModal.tsx
/**
 * Generic Detail Modal Component
 *
 * Displays detailed view of an item based on DocTypeConfig.
 * Shows all fields with proper formatting, images, and metadata.
 *
 * @example
 * ```typescript
 * <GenericDetailModal
 *   config={branchConfig}
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   item={selectedBranch}
 *   onEdit={(item) => handleEdit(item)}
 *   onDelete={(item) => handleDelete(item)}
 *   canEdit={hasPermission('edit')}
 *   canDelete={hasPermission('delete')}
 * />
 * ```
 */

import React from "react";
import Image from "next/image";
import { FaTimes, FaEdit, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { DocTypeConfig } from "@/lib/doctype/types";

export interface GenericDetailModalProps<T extends Record<string, unknown>> {
  /** DocType configuration */
  config: DocTypeConfig<T>;

  /** Whether modal is open */
  open: boolean;

  /** Close handler */
  onClose: () => void;

  /** Item to display */
  item?: T | null;

  /** Edit handler */
  onEdit?: (item: T) => void;

  /** Delete handler */
  onDelete?: (item: T) => void;

  /** Whether user can edit */
  canEdit?: boolean;

  /** Whether user can delete */
  canDelete?: boolean;
}

/**
 * Generic Detail Modal Component
 */
export function GenericDetailModal<T extends Record<string, unknown>>({
  config,
  open,
  onClose,
  item,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: GenericDetailModalProps<T>) {
  if (!item) return null;

  // Get formatted value for a field
  const getFieldValue = (fieldName: keyof T): string => {
    const value = item[fieldName];
    if (value === null || value === undefined) return "-";

    const field = config.fields.find((f) => f.name === fieldName);

    // Use custom format function if provided
    if (field?.format) {
      return field.format(value, item);
    }

    // Default formatting based on type
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    return String(value);
  };

  // Get image URL
  const imageUrl = config.imageField ? (item[config.imageField] as string) : null;
  const iconUrl = config.iconField ? (item[config.iconField] as string) : null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  {/* Icon/Image */}
                  {(iconUrl || imageUrl) && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/20">
                      <Image
                        src={iconUrl || imageUrl || ""}
                        alt="Icon"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {getFieldValue(config.titleField)}
                    </h2>
                    {config.badgeField && (
                      <span className="text-xs text-white/80">
                        {getFieldValue(config.badgeField)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Main Image */}
                {imageUrl && !iconUrl && (
                  <div className="mb-6 relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                    <Image
                      src={imageUrl}
                      alt="Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {config.fields
                    .filter((field) => field.showInDetail !== false)
                    .map((field) => (
                      <div
                        key={String(field.name)}
                        className={field.type === "textarea" ? "md:col-span-2" : ""}
                      >
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {field.label}
                        </label>
                        <div className="text-sm text-gray-900 font-medium break-words">
                          {field.type === "file" && item[field.name] ? (
                            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                              <Image
                                src={item[field.name] as string}
                                alt={field.label}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            getFieldValue(field.name)
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Metadata (created_at, updated_at, etc.) if available */}
                {("created_at" in item || "updated_at" in item) && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Metadata
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {"created_at" in item && (
                        <div>
                          <span className="text-gray-500">Created:</span>{" "}
                          <span className="font-medium text-gray-900">
                            {new Date(item.created_at as string).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {"updated_at" in item && (
                        <div>
                          <span className="text-gray-500">Updated:</span>{" "}
                          <span className="font-medium text-gray-900">
                            {new Date(item.updated_at as string).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with actions */}
              {(canEdit || canDelete) && (onEdit || onDelete) && (
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                  {canDelete && onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                  {canEdit && onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
