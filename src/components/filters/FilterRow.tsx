// src/components/filters/FilterRow.tsx

import React from "react";
import {
  FilterState,
  EntityFilterConfig,
  GobackOperator,
  FilterValue,
} from "@/types/filter";
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
  const operatorLabelMap: Partial<Record<GobackOperator, string>> = {
    is: "is",
    "is not": "is set",
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center">
      {/* Field Dropdown */}
      <select
        value={filter.field}
        onChange={(e) => {
          const newField = e.target.value;
          onChange({
            ...filter,
            field: newField,
            operator: "", // Reset operator when field changes
            value: undefined, // Reset value when field changes
          });
        }}
        className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-[180px]"
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
          let autoValue: FilterValue = undefined;
          if (newOperator === "is" || newOperator === "is not") {
            autoValue = "set"; // Default to "set" for image existence checks
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
        className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:w-[140px]"
      >
        <option value="">Operator...</option>
        {availableOperators.map((op) => (
          <option key={op} value={op}>
            {operatorLabelMap[op] || op}
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
        className="self-end rounded-md p-2 text-red-500 transition-colors hover:bg-red-50 sm:self-auto"
        title="Remove filter"
      >
        <FaTimes />
      </button>
    </div>
  );
}
