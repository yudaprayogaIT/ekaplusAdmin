"use client";

import { apiFetch, getQueryUrl } from "@/config/api";

const DEFAULT_PAGE_SIZE = 20;

type QuerySpec = {
  fields?: string[];
  filters?: unknown[];
  order_by?: [string, string][];
  search?: string;
  limit?: number;
  page?: number;
};

function getPageSignature(rows: unknown[]): string {
  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return JSON.stringify(row);
      const candidate = row as Record<string, unknown>;
      return String(candidate.id ?? candidate.ID ?? candidate.name ?? JSON.stringify(candidate));
    })
    .join("|");
}

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
  let previousPageSignature = "";
  const requestedLimit = Number(spec.limit || DEFAULT_PAGE_SIZE);

  while (true) {
    const response = await apiFetch(
      getQueryUrl(endpoint, {
        ...spec,
        limit: requestedLimit,
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
    const pageSignature = getPageSignature(pageRows);

    if (page > 1 && pageRows.length > 0 && pageSignature === previousPageSignature) {
      break;
    }

    rows.push(...pageRows);

    const total = Number(
      json?.meta?.total || json?.total || json?.count || json?.total_count || 0,
    );
    const perPage = Number(json?.meta?.per_page || json?.per_page || requestedLimit);
    if (total > 0 && rows.length >= total) {
      break;
    }

    if (pageRows.length < perPage || pageRows.length === 0) {
      break;
    }

    previousPageSignature = pageSignature;
    page += 1;
  }

  return rows;
}
