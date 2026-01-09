// src/utils/urlSync.ts
import { FilterTriple } from "@/types/filter";

/**
 * Serialize filter triples to URL-safe query string
 * Format: field__operator__value,field__operator__value,...
 */
export function serializeFilters(filters: FilterTriple[]): string {
  if (!filters || filters.length === 0) return "";

  return filters
    .map(([field, operator, value]) => {
      // Encode each part to handle special characters
      const encodedField = encodeURIComponent(field);
      const encodedOperator = encodeURIComponent(operator);
      const encodedValue = encodeURIComponent(String(value));
      return `${encodedField}__${encodedOperator}__${encodedValue}`;
    })
    .join(",");
}

/**
 * Deserialize URL query string to filter triples
 */
export function deserializeFilters(filterString: string): FilterTriple[] {
  if (!filterString || filterString.trim() === "") return [];

  try {
    return filterString.split(",").map((part) => {
      const [field, operator, value] = part.split("__").map(decodeURIComponent);

      // Try to parse value as number if it looks like a number
      let parsedValue: string | number = value;
      if (!isNaN(Number(value)) && value !== "") {
        parsedValue = Number(value);
      }

      return [field, operator, parsedValue] as FilterTriple;
    });
  } catch (error) {
    console.error("Failed to deserialize filters:", error);
    return [];
  }
}

/**
 * Build URL search params from current state
 */
export function buildSearchParams(params: {
  filters?: FilterTriple[];
  sortField?: string;
  sortDirection?: string;
  page?: number;
  searchQuery?: string;
  showOnlyUnmapped?: boolean;
  showHotDealsOnly?: boolean;
}): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.filters && params.filters.length > 0) {
    searchParams.set("filter", serializeFilters(params.filters));
  }

  if (params.sortField) {
    searchParams.set("sort", params.sortField);
  }

  if (params.sortDirection) {
    searchParams.set("order", params.sortDirection);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  if (params.searchQuery && params.searchQuery.trim()) {
    searchParams.set("q", params.searchQuery);
  }

  if (params.showOnlyUnmapped) {
    searchParams.set("unmapped", "1");
  }

  if (params.showHotDealsOnly) {
    searchParams.set("hot", "1");
  }

  return searchParams;
}

/**
 * Parse URL search params to state
 */
export function parseSearchParams(searchParams: URLSearchParams): {
  filters: FilterTriple[];
  sortField?: string;
  sortDirection?: "asc" | "desc";
  page: number;
  searchQuery: string;
  showOnlyUnmapped: boolean;
  showHotDealsOnly: boolean;
} {
  const filterString = searchParams.get("filter");
  const filters = filterString ? deserializeFilters(filterString) : [];

  const sortField = searchParams.get("sort") || undefined;
  const sortDirection = (searchParams.get("order") as "asc" | "desc") || undefined;

  const pageStr = searchParams.get("page");
  const page = pageStr ? parseInt(pageStr, 10) : 1;

  const searchQuery = searchParams.get("q") || "";
  const showOnlyUnmapped = searchParams.get("unmapped") === "1";
  const showHotDealsOnly = searchParams.get("hot") === "1";

  return {
    filters,
    sortField,
    sortDirection,
    page: isNaN(page) || page < 1 ? 1 : page,
    searchQuery,
    showOnlyUnmapped,
    showHotDealsOnly,
  };
}
