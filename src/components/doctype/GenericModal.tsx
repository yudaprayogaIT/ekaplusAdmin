// src/components/doctype/GenericModal.tsx
/**
 * Generic Add/Edit Modal Component
 *
 * Dynamically renders a form modal based on DocTypeConfig.
 * Handles form state, validation, file uploads, and API calls.
 *
 * @example
 * ```typescript
 * <GenericModal
 *   config={branchConfig}
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   initial={editingBranch}  // null for add, object for edit
 *   token={token}
 * />
 * ```
 */

import React, { useState, useEffect, useCallback } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { GenericFormField } from "./GenericFormField";
import { useDocType } from "@/lib/doctype/useDocType";
import type { DocTypeConfig, FieldConfig, FormData } from "@/lib/doctype/types";

export interface GenericModalProps<T extends Record<string, unknown>> {
  /** DocType configuration */
  config: DocTypeConfig<T>;

  /** Whether modal is open */
  open: boolean;

  /** Close handler */
  onClose: () => void;

  /** Initial data for edit mode (null = add mode) */
  initial?: T | null;

  /** Authentication token */
  token: string | null;

  /** Custom submit handler (overrides default) */
  onSubmit?: (data: T, isEdit: boolean) => Promise<void>;
}

/**
 * Generic Add/Edit Modal Component
 */
export function GenericModal<T extends Record<string, unknown>>({
  config,
  open,
  onClose,
  initial = null,
  token,
  onSubmit,
}: GenericModalProps<T>) {
  const isEditMode = initial !== null;

  // CRUD operations
  const { create, update, loading, error, clearError } = useDocType<T>(config, token);

  // Form state
  const [formData, setFormData] = useState<Partial<FormData<T>>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize form data
  useEffect(() => {
    if (open) {
      if (initial) {
        // Edit mode - populate with initial data
        setFormData({ ...initial });
      } else {
        // Add mode - set default values
        const defaults: Partial<FormData<T>> = {};
        config.fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            defaults[field.name] = field.defaultValue as never;
          }
        });
        setFormData(defaults);
      }
      setValidationErrors({});
      clearError();
    }
  }, [open, initial, config.fields, clearError]);

  // Update field value
  const updateField = useCallback((fieldName: keyof T, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear validation error for this field
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next[String(fieldName)];
      return next;
    });
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Validate each field
    config.fields.forEach((field) => {
      const value = formData[field.name];

      // Check required fields
      if (field.required && (value === undefined || value === null || value === "")) {
        errors[String(field.name)] = `${field.label} is required`;
        return;
      }

      // Run custom validation if provided
      if (field.validate && value !== undefined && value !== null) {
        const validationError = field.validate(value, formData as T);
        if (validationError) {
          errors[String(field.name)] = validationError;
        }
      }
    });

    // Run global validation hook if provided
    if (config.hooks?.validate) {
      const globalErrors = config.hooks.validate(formData as T);
      if (globalErrors) {
        Object.assign(errors, globalErrors);
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [config, formData]);

  // Handle submit
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (onSubmit) {
        // Custom submit handler
        await onSubmit(formData as T, isEditMode);
      } else {
        // Default submit handler
        if (isEditMode && initial?.id) {
          await update(initial.id as number | string, formData as T);
        } else {
          await create(formData as T);
        }
      }

      // Success - close modal
      onClose();
    } catch (err) {
      // Error is handled by useDocType hook
      console.error("Form submission error:", err);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit();
      }

      // Escape to close
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleSubmit, onClose]);

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">
                  {isEditMode ? `Edit ${config.label}` : `Add ${config.label}`}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                {/* Error message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* Form fields */}
                <div className="grid grid-cols-1 gap-6">
                  {config.fields
                    .filter((field) => !field.hidden)
                    .map((field) => (
                      <GenericFormField<T>
                        key={String(field.name)}
                        config={field as FieldConfig<T>}
                        value={formData[field.name]}
                        onChange={(value) => updateField(field.name, value)}
                        error={validationErrors[String(field.name)]}
                        disabled={loading}
                      />
                    ))}
                </div>
              </form>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
                <div className="text-xs text-gray-500">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">
                    Ctrl+S
                  </kbd>{" "}
                  to save,{" "}
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">
                    Esc
                  </kbd>{" "}
                  to cancel
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-5 py-2.5 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
