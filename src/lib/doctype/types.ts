// src/lib/doctype/types.ts
/**
 * DocType Configuration System
 *
 * This module provides a configuration-driven approach to creating CRUD interfaces
 * for different data types (doctypes). Similar to ERPNext's DocType system, it allows
 * you to define the structure and behavior of a data type through configuration
 * rather than writing repetitive code.
 *
 * @example
 * ```typescript
 * const productConfig: DocTypeConfig<Product> = {
 *   name: 'product',
 *   label: 'Produk',
 *   endpoint: '/resource/product',
 *   fields: [...],
 *   // ... more config
 * }
 * ```
 */

import React from "react";

/**
 * Supported field types for form inputs
 */
export type FieldType =
  | "text"       // Single-line text input
  | "textarea"   // Multi-line text input
  | "number"     // Numeric input
  | "select"     // Dropdown selection
  | "file"       // File upload (single file)
  | "link"       // Foreign key reference to another doctype
  | "date"       // Date picker
  | "checkbox"   // Boolean checkbox
  | "location";  // Special field for lat/lng coordinates

/**
 * Color schemes for UI elements (stats cards, badges, etc.)
 */
export type ColorScheme =
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red"
  | "pink"
  | "gray"
  | "yellow";

/**
 * View modes for displaying items
 */
export type ViewMode = "grid" | "list";

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Configuration for a single form field
 *
 * @template T The type of the doctype (e.g., Branch, ItemType, Category)
 */
export interface FieldConfig<T = Record<string, unknown>> {
  /** Field name - must match a property in type T */
  name: keyof T;

  /** Human-readable label for the field */
  label: string;

  /** Type of the field - determines which input component to render */
  type: FieldType;

  /** Whether the field is required for submission */
  required?: boolean;

  /** Placeholder text for input fields */
  placeholder?: string;

  /** Helper text or description shown below the field */
  description?: string;

  // Select field options
  /** Options for select fields - can be array of objects or simple strings */
  options?: Array<{ value: string | number; label: string }> | string[];

  // Link field options (for foreign key relationships)
  /** Name of the linked doctype (e.g., 'category' for a product's category) */
  linkDoctype?: string;

  /** Which field from the linked doctype to display (e.g., 'category_name') */
  linkDisplayField?: string;

  // File field options
  /** Accepted file types (e.g., 'image/*', '.pdf') */
  accept?: string;

  /** Maximum file size in bytes */
  maxSize?: number;

  /** Field name for the actual file object (used internally for uploads) */
  fileField?: string;

  // Validation
  /** Custom validation function - return error message or null if valid */
  validate?: (value: unknown, formData?: T) => string | null;

  // Display options
  /** Whether field is read-only */
  readonly?: boolean;

  /** Whether to hide this field from forms */
  hidden?: boolean;

  /** CSS grid column span (e.g., "span 2") */
  gridColumn?: string;

  /** Default value for the field */
  defaultValue?: unknown;

  // Formatting for display
  /** Custom formatting function for displaying value (e.g., format currency, dates) */
  format?: (value: unknown, item?: T) => string;

  /** Whether to show this field in card view */
  showInCard?: boolean;

  /** Whether to show this field in detail modal */
  showInDetail?: boolean;
}

/**
 * Configuration for filter options
 *
 * @template T The type of the doctype
 */
export interface FilterConfig<T = Record<string, unknown>> {
  /** Unique identifier for this filter */
  name: string;

  /** Display label for the filter */
  label: string;

  /** Which field to filter on */
  field: keyof T;

  /** Type of filter UI */
  type: "select" | "toggle" | "search" | "multiselect";

  /** Options for select/multiselect filters */
  options?: Array<{ value: unknown; label: string }>;

  /** Default selected value */
  defaultValue?: unknown;

  /** Custom filter function - return true if item matches filter */
  filterFn?: (item: T, filterValue: unknown) => boolean;

  /** Icon to display next to filter label */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Configuration for sort options
 *
 * @template T The type of the doctype
 */
export interface SortConfig<T = Record<string, unknown>> {
  /** Field to sort by */
  field: keyof T;

  /** Human-readable label (e.g., "Nama: A-Z") */
  label: string;

  /** Sort direction */
  direction: SortDirection;

  /** Custom sort function - return -1, 0, or 1 */
  sortFn?: (a: T, b: T, direction: SortDirection) => number;
}

/**
 * Configuration for statistics cards
 *
 * @template T The type of the doctype
 */
export interface StatCardConfig<T = Record<string, unknown>> {
  /** Label for the stat card */
  label: string;

  /** Function to calculate the stat value from items array */
  value: (items: T[]) => number | string;

  /** Color scheme for the card */
  colorScheme?: ColorScheme;

  /** Icon component to display */
  icon?: React.ComponentType<{ className?: string }>;

  /** Format the value for display */
  format?: (value: number | string) => string;

  /** Helper text shown below the value */
  description?: string;
}

/**
 * Configuration for grouping items in the list view
 *
 * @template T The type of the doctype
 */
export interface GroupConfig<T = Record<string, unknown>> {
  /** Field to group by */
  field: keyof T;

  /** Function to generate group label from field value */
  label: (value: unknown) => string;

  /** Function to generate group description */
  description?: (value: unknown) => string;

  /** Custom sort function for groups */
  sortGroups?: (a: unknown, b: unknown) => number;
}

/**
 * Permission configuration for CRUD operations
 */
export interface PermissionConfig {
  /** Permission key for creating records (e.g., 'branches.manage') or boolean */
  create?: boolean | string;

  /** Permission key for reading records */
  read?: boolean | string;

  /** Permission key for updating records */
  update?: boolean | string;

  /** Permission key for deleting records */
  delete?: boolean | string;
}

/**
 * Lifecycle hooks for custom behavior
 *
 * @template T The type of the doctype
 */
export interface DocTypeHooks<T = Record<string, unknown>> {
  /** Called before saving (create/update) - can transform data */
  beforeSave?: (data: T, isEdit: boolean) => T | Promise<T>;

  /** Called after successful save */
  afterSave?: (data: T, isEdit: boolean) => void | Promise<void>;

  /** Called before delete - return false to cancel */
  beforeDelete?: (data: T) => boolean | Promise<boolean>;

  /** Called after successful delete */
  afterDelete?: (data: T) => void | Promise<void>;

  /** Transform API response to frontend model */
  transformApiResponse?: (apiData: unknown) => T;

  /** Transform frontend model to API format (FormData or JSON) */
  transformToApi?: (data: T) => FormData | Record<string, unknown>;

  /** Called when data is loaded from API */
  onLoad?: (items: T[]) => void | Promise<void>;

  /** Custom validation for the entire form */
  validate?: (data: T) => Record<string, string> | null;
}

/**
 * Main DocType configuration
 *
 * This is the primary configuration object that defines everything about
 * a doctype including its fields, API endpoint, permissions, UI behavior, etc.
 *
 * @template T The type of the doctype
 *
 * @example
 * ```typescript
 * const branchConfig: DocTypeConfig<Branch> = {
 *   name: 'branch',
 *   label: 'Cabang',
 *   labelPlural: 'Branches',
 *   endpoint: '/resource/branch',
 *   titleField: 'name',
 *   fields: [
 *     { name: 'name', label: 'Nama', type: 'text', required: true },
 *     { name: 'city', label: 'Kota', type: 'text', required: true },
 *     // ... more fields
 *   ],
 *   stats: [
 *     { label: 'Total', value: (items) => items.length, colorScheme: 'blue' }
 *   ],
 *   permissions: { create: 'branches.manage', update: 'branches.manage' }
 * }
 * ```
 */
export interface DocTypeConfig<T = Record<string, unknown>> {
  // ============ Metadata ============

  /** Unique identifier for this doctype (lowercase, no spaces) */
  name: string;

  /** Singular label for display (e.g., "Cabang") */
  label: string;

  /** Plural label for display (e.g., "Branches") */
  labelPlural: string;

  /** Optional description */
  description?: string;

  // ============ API Configuration ============

  /** API endpoint (e.g., '/resource/branch') */
  endpoint: string;

  /** Field mapping for API (API field name -> Frontend field name) */
  fieldMapping?: Record<string, string>;

  /** Custom event name for updates (e.g., 'ekatalog:branches_update') */
  eventName?: string;

  /** localStorage key for caching (auto-generated from name if not provided) */
  cacheKey?: string;

  // ============ Field Definitions ============

  /** Array of field configurations */
  fields: FieldConfig<T>[];

  /** Fields to display in list/card view */
  listFields: Array<keyof T>;

  /** Primary field used as title/name (e.g., 'name', 'product_name') */
  titleField: keyof T;

  /** Optional image field name for displaying images */
  imageField?: keyof T;

  /** Optional icon field name for displaying icons */
  iconField?: keyof T;

  /** Badge field for showing status/type badges */
  badgeField?: keyof T;

  // ============ Filtering & Sorting ============

  /** Available filter configurations */
  filters?: FilterConfig<T>[];

  /** Default filter values */
  defaultFilters?: Record<string, unknown>;

  /** Available sort options */
  sortOptions?: SortConfig<T>[];

  /** Default sort configuration */
  defaultSort?: SortConfig<T>;

  /** Fields to include in search */
  searchFields?: Array<keyof T>;

  // ============ Statistics ============

  /** Statistics card configurations */
  stats?: StatCardConfig<T>[];

  // ============ Grouping ============

  /** Optional grouping configuration */
  groupBy?: GroupConfig<T>;

  // ============ Permissions ============

  /** Permission configuration */
  permissions?: PermissionConfig;

  /** Whether authentication is required to view (default: true) */
  requireAuth?: boolean;

  // ============ UI Customization ============

  /** Default view mode */
  defaultViewMode?: ViewMode;

  /** Whether to show view mode toggle */
  showViewModeToggle?: boolean;

  /** Whether to show search bar */
  showSearch?: boolean;

  /** Whether to show filters */
  showFilters?: boolean;

  /** Whether to show sort dropdown */
  showSort?: boolean;

  /** Whether to show stats cards */
  showStats?: boolean;

  /** Custom header component */
  customHeader?: React.ComponentType<{ items: T[] }>;

  /** Custom empty state component */
  customEmptyState?: React.ComponentType;

  // ============ Lifecycle Hooks ============

  /** Lifecycle hooks for custom behavior */
  hooks?: DocTypeHooks<T>;

  // ============ Advanced Options ============

  /** Page size for pagination (if enabled) */
  pageSize?: number;

  /** Whether to enable infinite scroll */
  infiniteScroll?: boolean;

  /** Whether to enable bulk actions */
  bulkActions?: boolean;

  /** Custom bulk action configurations */
  customBulkActions?: Array<{
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    action: (selectedItems: T[]) => void | Promise<void>;
    confirm?: boolean;
    confirmTitle?: string;
    confirmMessage?: string;
  }>;
}

/**
 * Props for custom render functions
 */
export interface RenderProps<T> {
  item: T;
  config: DocTypeConfig<T>;
  viewMode?: ViewMode;
}

/**
 * Type guard to check if value is a FieldConfig
 */
export function isFieldConfig<T>(value: unknown): value is FieldConfig<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "label" in value &&
    "type" in value
  );
}

/**
 * Type guard to check if value is a DocTypeConfig
 */
export function isDocTypeConfig<T>(value: unknown): value is DocTypeConfig<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "endpoint" in value &&
    "fields" in value &&
    Array.isArray((value as DocTypeConfig<T>).fields)
  );
}

/**
 * Helper type for form data with file fields
 */
export type FormData<T> = T & {
  [K in keyof T as `${string & K}File`]?: File | null;
};

/**
 * Helper type for API responses
 */
export interface ApiResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T[];
  meta?: Record<string, unknown>;
}

/**
 * Helper type for API single resource response
 */
export interface ApiResourceResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Helper type for API error response
 */
export interface ApiErrorResponse {
  status: string;
  code: string;
  message: string;
  errors?: Record<string, string[]>;
}
