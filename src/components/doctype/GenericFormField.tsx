// src/components/doctype/GenericFormField.tsx
/**
 * Generic Form Field Component
 *
 * Renders a form field based on FieldConfig. Supports all field types:
 * text, textarea, number, select, file, link, date, checkbox, location
 *
 * @example
 * ```typescript
 * <GenericFormField
 *   config={fieldConfig}
 *   value={formData.name}
 *   onChange={(value) => setFormData({...formData, name: value})}
 *   error={errors.name}
 * />
 * ```
 */

import React, { useId } from "react";
import Image from "next/image";
import type { FieldConfig } from "@/lib/doctype/types";

export interface GenericFormFieldProps<T = Record<string, unknown>> {
  /** Field configuration */
  config: FieldConfig<T>;

  /** Current value */
  value: unknown;

  /** Change handler */
  onChange: (value: unknown) => void;

  /** Validation error message */
  error?: string | null;

  /** Whether field is disabled */
  disabled?: boolean;

  /** Additional CSS class */
  className?: string;
}

/**
 * Generic Form Field Component
 */
export function GenericFormField<T = Record<string, unknown>>({
  config,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
}: GenericFormFieldProps<T>) {
  const id = useId();

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  // Render label
  const renderLabel = () => (
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {config.label}
      {config.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );

  // Render description
  const renderDescription = () => {
    if (!config.description) return null;
    return (
      <p className="text-xs text-gray-500 mt-1">{config.description}</p>
    );
  };

  // Render error
  const renderError = () => {
    if (!error) return null;
    return (
      <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
    );
  };

  // Common input classes
  const inputClasses = `w-full px-4 py-3 border-2 rounded-xl transition-all ${
    error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-200 focus:border-red-500 focus:ring-red-500"
  } focus:ring-2 focus:outline-none ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`;

  // Render field based on type
  const renderField = () => {
    switch (config.type) {
      case "text":
        return (
          <input
            id={id}
            type="text"
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            disabled={disabled || config.readonly}
            required={config.required}
            className={inputClasses}
          />
        );

      case "textarea":
        return (
          <textarea
            id={id}
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={config.placeholder}
            disabled={disabled || config.readonly}
            required={config.required}
            rows={4}
            className={inputClasses}
          />
        );

      case "number":
        return (
          <input
            id={id}
            type="number"
            value={value as number || ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            placeholder={config.placeholder}
            disabled={disabled || config.readonly}
            required={config.required}
            className={inputClasses}
          />
        );

      case "select":
        return (
          <select
            id={id}
            value={value as string | number || ""}
            onChange={(e) => {
              const val = e.target.value;
              // Try to parse as number if it looks like a number
              const numVal = Number(val);
              onChange(isNaN(numVal) ? val : numVal);
            }}
            disabled={disabled || config.readonly}
            required={config.required}
            className={inputClasses}
          >
            <option value="">
              {config.placeholder || `Select ${config.label}`}
            </option>
            {config.options?.map((opt, idx) => {
              // Handle both string[] and {value, label}[] formats
              if (typeof opt === "string") {
                return (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                );
              } else {
                return (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                );
              }
            })}
          </select>
        );

      case "file":
        return (
          <div>
            <input
              id={id}
              type="file"
              onChange={handleFileChange}
              accept={config.accept}
              disabled={disabled || config.readonly}
              required={config.required}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            {/* Image preview */}
            {value && typeof value === "string" && config.accept?.includes("image") && (
              <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {/* File preview */}
            {value && value instanceof File && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {value.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(value.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "date":
        return (
          <input
            id={id}
            type="date"
            value={value as string || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || config.readonly}
            required={config.required}
            className={inputClasses}
          />
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              id={id}
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled || config.readonly}
              className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
            />
            <label htmlFor={id} className="ml-3 text-sm text-gray-700">
              {config.label}
            </label>
          </div>
        );

      case "link":
        // TODO: Implement autocomplete for linked doctypes
        // For now, simple text input
        return (
          <div>
            <input
              id={id}
              type="text"
              value={value as string || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={config.placeholder || `Select ${config.linkDoctype}`}
              disabled={disabled || config.readonly}
              required={config.required}
              className={inputClasses}
            />
            <p className="text-xs text-gray-500 mt-1">
              Link to: {config.linkDoctype}
            </p>
          </div>
        );

      case "location":
        // Special field for lat/lng coordinates
        const locValue = value as { lat?: number; lng?: number } || {};
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={locValue.lat || ""}
                onChange={(e) =>
                  onChange({
                    ...locValue,
                    lat: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="e.g., -6.2088"
                disabled={disabled || config.readonly}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={locValue.lng || ""}
                onChange={(e) =>
                  onChange({
                    ...locValue,
                    lng: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 106.8456"
                disabled={disabled || config.readonly}
                className={inputClasses}
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              Unsupported field type: {config.type}
            </p>
          </div>
        );
    }
  };

  // Special rendering for checkbox (different layout)
  if (config.type === "checkbox") {
    return (
      <div className={`${className} ${config.gridColumn || ""}`}>
        {renderField()}
        {renderDescription()}
        {renderError()}
      </div>
    );
  }

  // Standard field rendering
  return (
    <div className={`${className} ${config.gridColumn || ""}`}>
      {renderLabel()}
      {renderField()}
      {renderDescription()}
      {renderError()}
    </div>
  );
}
