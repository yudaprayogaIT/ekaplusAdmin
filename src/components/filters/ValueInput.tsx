// src/components/filters/ValueInput.tsx

import React from "react";
import { FilterFieldDef, GobackOperator } from "@/types/filter";
import type { Category } from "@/types";

interface ValueInputProps {
  fieldDef: FilterFieldDef | undefined;
  operator: GobackOperator | "";
  value: any;
  onChange: (value: any) => void;
  categories?: Category[]; // For relation fields
}

export default function ValueInput({
  fieldDef,
  operator,
  value,
  onChange,
  categories,
}: ValueInputProps) {
  // No input needed for "is" / "is not" operators (null checking)
  if (operator === "is" || operator === "is not") {
    // For Goback, "is" and "is not" operators don't need a value input
    // They check for null/not null automatically
    // But we show "null" as the value for clarity
    return (
      <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-500 italic">
        {operator === "is" ? "null (empty)" : "not null (has value)"}
      </div>
    );
  }

  if (!fieldDef) {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter value"
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
      />
    );
  }

  // String fields
  if (fieldDef.type === "string") {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
      />
    );
  }

  // Number fields - Multiple values for "in" / "not in"
  if (
    fieldDef.type === "number" &&
    (operator === "in" || operator === "not in")
  ) {
    return (
      <input
        type="text"
        value={Array.isArray(value) ? value.join(", ") : value || ""}
        onChange={(e) => {
          const text = e.target.value.trim();
          if (!text) {
            onChange([]);
          } else {
            // Parse comma-separated numbers
            const numbers = text
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s !== "")
              .map((s) => Number(s))
              .filter((n) => !isNaN(n));
            onChange(numbers);
          }
        }}
        placeholder="Enter User IDs (comma-separated, e.g. 21, 25, 30)"
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
      />
    );
  }

  // Number fields - Single number
  if (fieldDef.type === "number") {
    return (
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        placeholder={`Enter ${fieldDef.label.toLowerCase()}`}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
      />
    );
  }

  // Boolean fields
  if (fieldDef.type === "boolean") {
    return (
      <select
        value={value === undefined ? "" : String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
      >
        <option value="">Select...</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  // Date fields - Between operator (range)
  if (fieldDef.type === "date" && operator === "between") {
    const dateRange = Array.isArray(value) ? value : ["", ""];
    return (
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateRange[0] || ""}
          onChange={(e) => onChange([e.target.value, dateRange[1] || ""])}
          placeholder="From"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
        />
        <span className="text-gray-500 text-sm font-medium">to</span>
        <input
          type="date"
          value={dateRange[1] || ""}
          onChange={(e) => onChange([dateRange[0] || "", e.target.value])}
          placeholder="To"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
        />
      </div>
    );
  }

  // Date fields - Single date
  if (fieldDef.type === "date") {
    return (
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    );
  }

  // Select fields (single select)
  if (
    fieldDef.type === "select" &&
    (operator === "=" || operator === "!=")
  ) {
    return (
      <select
        value={value || ""}
        onChange={(e) => {
          const val = e.target.value;
          // Try to parse as number if it looks like a number
          const numVal = Number(val);
          onChange(isNaN(numVal) ? val : numVal);
        }}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
      >
        <option value="">Select {fieldDef.label}...</option>
        {fieldDef.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  // Multiselect fields (for "in" / "not in" operators)
  if (
    (fieldDef.type === "select" || fieldDef.type === "multiselect") &&
    (operator === "in" || operator === "not in")
  ) {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <div className="flex flex-wrap gap-2 items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm flex-1">
        {fieldDef.options?.map((opt) => {
          const isSelected = selectedValues.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="flex items-center gap-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selectedValues, opt.value]);
                  } else {
                    onChange(selectedValues.filter((v) => v !== opt.value));
                  }
                }}
                className="rounded"
              />
              <span className="text-xs">{opt.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  // Relation fields (dropdown from related entity)
  if (fieldDef.type === "relation" && fieldDef.relationEntity === "category") {
    if (operator === "in" || operator === "not in") {
      // Multi-select for categories
      const selectedIds = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-2 items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm flex-1">
          {categories?.map((cat) => {
            const isSelected = selectedIds.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selectedIds, cat.id]);
                    } else {
                      onChange(selectedIds.filter((id) => id !== cat.id));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-xs">{cat.name}</span>
              </label>
            );
          })}
        </div>
      );
    } else {
      // Single select for category
      return (
        <select
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
        >
          <option value="">Select Category...</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      );
    }
  }

  // Default fallback for other relation types (just text input for now)
  if (fieldDef.type === "relation") {
    return (
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        placeholder={`Enter ${fieldDef.label} ID`}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
      />
    );
  }

  // Fallback
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter value"
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
    />
  );
}
