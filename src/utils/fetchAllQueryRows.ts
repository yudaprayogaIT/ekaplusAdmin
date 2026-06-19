"use client";

import { apiFetch, getQueryUrl } from "@/config/api";

const DEFAULT_PAGE_SIZE = 20;

type QuerySpec = {
  fields?: string[];
  filters?: unknown[];
  order_by?: [string, string][];
  search?: string;
};

export async function fetchAllQueryRows<T>({
  endpoint,
  spec,
  token,
  requestInit,
  errorMessage,
}: {
  endpoint: string;
  spec: QuerySpec;
  token: string;
  requestInit?: RequestInit;
  errorMessage?: string;
}): Promise<T[]> {
  const rows: T[] = [];
  let page = 1;

  while (true) {
    const response = await apiFetch(
      getQueryUrl(endpoint, {
        ...spec,
        page,
      }),
      {
        method: "GET",
        cache: "no-store",
        ...requestInit,
      },
      token,
    );

    if (!response.ok) {
      throw new Error(errorMessage || `Failed to fetch ${endpoint} (${response.status})`);
    }

    const json = await response.json();
    const pageRows = Array.isArray(json?.data) ? (json.data as T[]) : [];
    rows.push(...pageRows);

    const perPage = Number(json?.meta?.per_page || DEFAULT_PAGE_SIZE);
    if (pageRows.length < perPage || pageRows.length === 0) {
      break;
    }

    page += 1;
  }

  return rows;
}
