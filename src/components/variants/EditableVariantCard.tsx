// src/components/variants/EditableVariantCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ItemVariant, UpdateVariantRequest } from "@/types";

export function EditableVariantCard({
  variant,
  onUpdate,
  onDelete,
}: {
  variant: ItemVariant;
  onUpdate: (id: number, updates: UpdateVariantRequest) => Promise<void>;
  onDelete: () => void;
}) {
  const [isDefault, setIsDefault] = useState(variant.isDefault);
  const [isActive, setIsActive] = useState(variant.isActive);
  const [saving, setSaving] = useState(false);

  const handleToggleDefault = async () => {
    setSaving(true);
    try {
      const newValue = !isDefault;
      setIsDefault(newValue);
      await onUpdate(variant.id, { is_default: newValue ? 1 : 0 });
    } catch (error) {
      setIsDefault(!isDefault); // Revert on error
      alert("Failed to update default status");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    setSaving(true);
    try {
      const newValue = !isActive;
      setIsActive(newValue);
      await onUpdate(variant.id, { is_active: newValue ? 1 : 0 });
    } catch (error) {
      setIsActive(!isActive); // Revert on error
      alert("Failed to update active status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className={`relative p-4 bg-white rounded-xl border-2 border-gray-200 ${
        !isActive ? "opacity-50" : ""
      }`}
      whileHover={{ scale: 1.02 }}
    >
      {/* Inline controls */}
      <div className="absolute top-2 right-2 flex gap-2">
        {/* Default toggle */}
        <button
          onClick={handleToggleDefault}
          disabled={saving}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
            isDefault
              ? "bg-yellow-400 text-yellow-900"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {isDefault ? "★ Default" : "☆"}
        </button>

        {/* Active toggle */}
        <button
          onClick={handleToggleActive}
          disabled={saving}
          className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
            isActive
              ? "bg-green-400 text-green-900"
              : "bg-red-200 text-red-600 hover:bg-red-300"
          }`}
        >
          {isActive ? "✓ Active" : "✗ Inactive"}
        </button>
      </div>

      {/* Variant content */}
      <div className="pr-32">
        {" "}
        {/* Space for buttons */}
        <div className="flex gap-3">
          <img
            src={variant.item.image || "/placeholder.png"}
            alt={variant.item.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">
              {variant.item.name}
            </h4>
            <p className="text-sm text-gray-500">{variant.item.code}</p>
            {variant.item.type && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                {variant.item.type}
              </span>
            )}

            {/* Audit Trail Info */}
            {(variant.created_at || variant.updated_at) && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                  {variant.created_at && (
                    <span>
                      Created: {new Date(variant.created_at).toLocaleDateString("id-ID", { dateStyle: "short" })}
                      {variant.created_by && ` by User #${variant.created_by}`}
                    </span>
                  )}
                  {variant.updated_at && variant.updated_at !== variant.created_at && (
                    <span>
                      Updated: {new Date(variant.updated_at).toLocaleDateString("id-ID", { dateStyle: "short" })}
                      {variant.updated_by && ` by User #${variant.updated_by}`}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="absolute bottom-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
      >
        Delete
      </button>

      {/* Loading overlay */}
      {saving && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
          <div className="w-8 h-8 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
