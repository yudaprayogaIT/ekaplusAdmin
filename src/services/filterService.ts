// src/services/filterService.ts

import {
  FilterTriple,
} from "@/types/filter";
import {
  getQueryUrl,
  getAuthHeaders,
  apiFetch,
} from "@/config/api";

export interface FetchWithFiltersOptions {
  endpoint: string;
  token: string;
  filters: FilterTriple[];
  fields?: string[];
  orderBy?: string;
  limit?: number;
  offset?: number;
}

export async function fetchWithFilters<T>(
  options: FetchWithFiltersOptions
): Promise<T[]> {
  const spec: Record<string, unknown> = {
    fields: options.fields || ["*"],
  };

  if (options.filters.length > 0) {
    spec.filters = options.filters;
  }

  if (options.orderBy) {
    spec.order_by = options.orderBy;
  }

  if (options.limit) {
    spec.limit = options.limit;
  }

  if (options.offset) {
    spec.offset = options.offset;
  }

  const url = getQueryUrl(options.endpoint, spec);
  const response = await apiFetch(url, {
    headers: getAuthHeaders(options.token),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const json = (await response.json()) as { data?: T[] };
  return json.data || [];
}
