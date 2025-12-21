// src/components/doctype/GenericCard.tsx
/**
 * Generic Card Component
 *
 * Displays an item as a card in either grid or list view.
 * Adapts layout and styling based on view mode and configuration.
 *
 * @example
 * ```typescript
 * <GenericCard
 *   item={branch}
 *   config={branchConfig}
 *   viewMode="grid"
 *   onEdit={() => handleEdit(branch)}
 *   onDelete={() => handleDelete(branch)}
 *   onView={() => showDetail(branch)}
 *   canEdit={true}
 *   canDelete={true}
 * />
 * ```
 */

import React from "react";
import Image from "next/image";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import type { DocTypeConfig, ViewMode } from "@/lib/doctype/types";

export interface GenericCardProps<T extends Record<string, unknown>> {
  /** Item data */
  item: T;

  /** DocType configuration */
  config: DocTypeConfig<T>;

  /** View mode */
  viewMode?: ViewMode;

  /** Edit handler */
  onEdit?: () => void;

  /** Delete handler */
  onDelete?: () => void;

  /** View detail handler */
  onView?: () => void;

  /** Whether user can edit */
  canEdit?: boolean;

  /** Whether user can delete */
  canDelete?: boolean;

  /** Custom render function (overrides default) */
  renderCard?: (item: T, viewMode: ViewMode) => React.ReactNode;
}

/**
 * Generic Card Component
 */
export function GenericCard<T extends Record<string, unknown>>({
  item,
  config,
  viewMode = "grid",
  onEdit,
  onDelete,
  onView,
  canEdit = true,
  canDelete = true,
  renderCard,
}: GenericCardProps<T>) {
  // Use custom render if provided
  if (renderCard) {
    return <>{renderCard(item, viewMode)}</>;
  }

  // Get formatted value for a field
  const getFieldValue = (fieldName: keyof T): string => {
    const value = item[fieldName];
    if (value === null || value === undefined) return "-";

    const field = config.fields.find((f) => f.name === fieldName);

    // Use custom format function if provided
    if (field?.format) {
      return field.format(value, item);
    }

    return String(value);
  };

  // Get title
  const title = getFieldValue(config.titleField);

  // Get image/icon URL
  const imageUrl = config.imageField ? (item[config.imageField] as string) : null;
  const iconUrl = config.iconField ? (item[config.iconField] as string) : null;

  // Get badge value
  const badgeValue = config.badgeField ? getFieldValue(config.badgeField) : null;

  // Render grid view
  if (viewMode === "grid") {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-gray-100 overflow-hidden cursor-pointer group"
        onClick={onView}
      >
        {/* Image/Icon */}
        {(imageUrl || iconUrl) && (
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={imageUrl || iconUrl || ""}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Badge */}
          {badgeValue && (
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full mb-2">
              {badgeValue}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-1">
            {title}
          </h3>

          {/* List fields */}
          <div className="space-y-2 mb-4">
            {config.listFields
              .filter((fieldName) => fieldName !== config.titleField)
              .slice(0, 3)
              .map((fieldName) => {
                const field = config.fields.find((f) => f.name === fieldName);
                return (
                  <div key={String(fieldName)} className="text-sm">
                    <span className="text-gray-500">{field?.label}:</span>{" "}
                    <span className="text-gray-900 font-medium line-clamp-1">
                      {getFieldValue(fieldName)}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Actions */}
          {(canEdit || canDelete) && (onEdit || onDelete) && (
            <div className="flex gap-2 pt-3 border-t">
              {canEdit && onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
              {canDelete && onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Render list view
  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-gray-100 overflow-hidden cursor-pointer group"
      onClick={onView}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Image/Icon */}
        {(imageUrl || iconUrl) && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <Image
              src={imageUrl || iconUrl || ""}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-800 truncate">
              {title}
            </h3>
            {badgeValue && (
              <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                {badgeValue}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {config.listFields
              .filter((fieldName) => fieldName !== config.titleField)
              .slice(0, 3)
              .map((fieldName) => {
                const field = config.fields.find((f) => f.name === fieldName);
                return (
                  <div key={String(fieldName)} className="text-sm">
                    <span className="text-gray-500">{field?.label}:</span>{" "}
                    <span className="text-gray-900 font-medium">
                      {getFieldValue(fieldName)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Actions */}
        {(canEdit || canDelete) && (onEdit || onDelete || onView) && (
          <div className="flex gap-2 flex-shrink-0">
            {onView && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="View Details"
              >
                <FaEye className="w-4 h-4" />
              </button>
            )}
            {canEdit && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="Edit"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            )}
            {canDelete && onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Delete"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
