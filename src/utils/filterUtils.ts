// src/utils/filterUtils.ts

import { FilterState, FilterTriple, FilterPreset } from "@/types/filter";

// Convert UI filter state to Goback triple format
export function stateToTriple(filters: FilterState[]): FilterTriple[] {
  const result: FilterTriple[] = [];

  filters.forEach((f) => {
    // Validate filter has required data
    const isValid = (() => {
      // For "is" and "is not" operators, we don't need a value
      if (f.operator === "is" || f.operator === "is not") {
        return f.field && f.operator;
      }
      // For "between" operator, need both values in array
      if (f.operator === "between") {
        return (
          f.field &&
          Array.isArray(f.value) &&
          f.value[0] &&
          f.value[1]
        );
      }
      // For other operators, we need field, operator, and value
      return f.field && f.operator && f.value !== undefined && f.value !== "";
    })();

    if (!isValid) return;

    // Convert filter to Goback triple(s)
    if (f.operator === "is" || f.operator === "is not") {
      // For "is"/"is not" operators, use Goback convention
      // "is" -> ["field", "is", "set"]
      // "is not" -> ["field", "is", "not set"]
      const value = f.operator === "is" ? "set" : "not set";
      result.push([f.field, "is", value] as FilterTriple);
    } else if (f.operator === "between") {
      // Goback doesn't support "between" operator
      // Convert to two separate filters: >= and <=
      const [startDate, endDate] = f.value as [string, string];
      result.push([f.field, ">=", startDate] as FilterTriple);
      result.push([f.field, "<=", endDate] as FilterTriple);
    } else {
      // Standard filter
      result.push([f.field, f.operator, f.value] as FilterTriple);
    }
  });

  return result;
}

// Convert Goback triple to UI state
export function tripleToState(triples: FilterTriple[]): FilterState[] {
  return triples.map((triple, idx) => ({
    id: `filter-${idx}-${Date.now()}`,
    field: triple[0],
    operator: triple[1],
    value: triple[2],
  }));
}

// Helper: Unicode-safe base64 encode
function base64Encode(str: string): string {
  // Convert string to UTF-8 bytes then to base64
  const utf8Bytes = new TextEncoder().encode(str);
  const binaryString = Array.from(utf8Bytes, (byte) =>
    String.fromCharCode(byte)
  ).join("");
  return btoa(binaryString);
}

// Helper: Unicode-safe base64 decode
function base64Decode(base64: string): string {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// Serialize filters to URL params using base64 for better readability
export function filtersToUrlParam(filters: FilterTriple[]): string {
  try {
    const jsonString = JSON.stringify(filters);
    return base64Encode(jsonString);
  } catch {
    return "";
  }
}

// Parse filters from URL params (supports both base64 and legacy format)
export function urlParamToFilters(param: string | null): FilterTriple[] {
  if (!param) return [];

  try {
    // Try base64 decode first
    const jsonString = base64Decode(param);
    return JSON.parse(jsonString);
  } catch {
    // Fallback to legacy URL encoded format
    try {
      return JSON.parse(decodeURIComponent(param));
    } catch {
      return [];
    }
  }
}

// Save filters to localStorage
export function saveFiltersToStorage(
  entity: string,
  filters: FilterTriple[]
): void {
  const key = `filter_${entity}_last`;
  localStorage.setItem(key, JSON.stringify(filters));
}

// Load filters from localStorage
export function loadFiltersFromStorage(entity: string): FilterTriple[] {
  const key = `filter_${entity}_last`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Preset management
export function savePreset(preset: FilterPreset): void {
  const key = `filter_preset_${preset.entity}`;
  const existing = loadPresets(preset.entity);
  existing.push(preset);
  localStorage.setItem(key, JSON.stringify(existing));
}

export function loadPresets(entity: string): FilterPreset[] {
  const key = `filter_preset_${entity}`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function deletePreset(entity: string, presetId: string): void {
  const presets = loadPresets(entity).filter((p) => p.id !== presetId);
  const key = `filter_preset_${entity}`;
  localStorage.setItem(key, JSON.stringify(presets));
}

// Generate unique ID for filter state
export function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
