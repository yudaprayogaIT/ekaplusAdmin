// src/types/filter.ts

// Goback operator types
export type GobackOperator =
  | "="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "like"
  | "not like"
  | "in"
  | "not in"
  | "is"
  | "is not"
  | "between";

// Special operators for "is set" / "is not set"
export type SpecialOperator = "set" | "not set";

export type FilterOptionValue = string | number | boolean | null;
export type FilterValue =
  | FilterOptionValue
  | FilterOptionValue[]
  | [string, string]
  | undefined;

// Filter triple format: ["field", "operator", "value"]
export type FilterTriple = [string, GobackOperator, FilterValue];

// Field type definitions
export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "multiselect"
  | "relation";

// Field definition for each entity
export interface FilterFieldDef {
  field: string; // Field name in API
  label: string; // Display label
  type: FieldType; // Data type
  operators: GobackOperator[]; // Available operators
  options?: { value: FilterOptionValue; label: string }[]; // For select/multiselect
  relationEntity?: string; // For relation fields (e.g., "category")
}

// Filter state (UI representation)
export interface FilterState {
  id: string; // Unique ID for React key
  field: string;
  operator: GobackOperator | "";
  value: FilterValue;
}

// Saved preset
export interface FilterPreset {
  id: string;
  name: string;
  filters: FilterTriple[];
  createdAt: string;
  entity: string; // "product", "item", "variant", etc.
}

// Entity filter configuration
export interface EntityFilterConfig {
  entity: string;
  fields: FilterFieldDef[];
}
