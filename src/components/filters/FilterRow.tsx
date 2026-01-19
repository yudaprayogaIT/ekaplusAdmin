// src/components/filters/FilterRow.tsx

import React from "react";
import { FilterState, EntityFilterConfig, GobackOperator } from "@/types/filter";
import ValueInput from "./ValueInput";
import { FaTimes } from "react-icons/fa";
import type { Category } from "@/types";

interface FilterRowProps {
  filter: FilterState;
  config: EntityFilterConfig;
  onChange: (updated: FilterState) => void;
  onRemove: () => void;
  categories?: Category[]; // For relation fields
}

export default function FilterRow({
  filter,
  config,
  onChange,
  onRemove,
  categories,
}: FilterRowProps) {
  const selectedField = config.fields.find((f) => f.field === filter.field);

  // Get available operators based on selected field
  const availableOperators = selectedField?.operators || [];

  return (
    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
      {/* Field Dropdown */}
      <select
        value={filter.field}
        onChange={(e) => {
          const newField = e.target.value;
          const fieldDef = config.fields.find((f) => f.field === newField);
          onChange({
            ...filter,
            field: newField,
            operator: "", // Reset operator when field changes
            value: undefined, // Reset value when field changes
          });
        }}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm min-w-[150px]"
      >
        <option value="">Select Field...</option>
        {config.fields.map((field) => (
          <option key={field.field} value={field.field}>
            {field.label}
          </option>
        ))}
      </select>

      {/* Operator Dropdown */}
      <select
        value={filter.operator}
        onChange={(e) => {
          const newOperator = e.target.value as GobackOperator;
          // Auto-set value based on operator type
          let autoValue: any = undefined;
          if (newOperator === "is" || newOperator === "is not") {
            autoValue = "null"; // For null checking operators
          } else if (newOperator === "between") {
            autoValue = ["", ""]; // For date range operators
          }
          onChange({
            ...filter,
            operator: newOperator,
            value: autoValue,
          });
        }}
        disabled={!filter.field}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed min-w-[120px]"
      >
        <option value="">Operator...</option>
        {availableOperators.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      {/* Value Input (Dynamic based on field type and operator) */}
      {filter.operator && (
        <ValueInput
          fieldDef={selectedField}
          operator={filter.operator}
          value={filter.value}
          onChange={(newValue) => {
            onChange({
              ...filter,
              value: newValue,
            });
          }}
          categories={categories}
        />
      )}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
        title="Remove filter"
      >
        <FaTimes />
      </button>
    </div>
  );
}
