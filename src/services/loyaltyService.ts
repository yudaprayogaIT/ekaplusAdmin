import { apiFetch, getApiUrl, getQueryUrl, getResourceUrl } from "@/config/api";
import type {
  LoyaltyActionResult,
  LoyaltyBalance,
  LoyaltyListResult,
  LoyaltyRow,
} from "@/types/loyalty";

function record(value: unknown): LoyaltyRow {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as LoyaltyRow)
    : {};
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function readJson(response: Response): Promise<LoyaltyRow> {
  let body: LoyaltyRow = {};
  try {
    body = record(await response.json());
  } catch {
    // Some action endpoints return an empty body.
  }

  const nested = record(body.data);
  const errorCode = body.error_code ?? nested.error_code;
  const errorMessage = body.error_message ?? nested.error_message;
  if (!response.ok || errorCode) {
    throw new Error(
      String(
        errorMessage ??
          body.message ??
          nested.message ??
          `Request gagal (${response.status})`,
      ),
    );
  }
  return body;
}

export async function listLoyaltyResource<T extends LoyaltyRow = LoyaltyRow>(
  endpoint: string,
  token: string,
  options: {
    page?: number;
    perPage?: number;
    search?: string;
    filters?: unknown[];
    orderBy?: unknown[];
    fields?: string[];
  } = {},
): Promise<LoyaltyListResult<T>> {
  const page = options.page ?? 1;
  const perPage = options.perPage ?? 20;
  const spec: Record<string, unknown> = {
    fields: options.fields ?? ["*"],
    page,
    per_page: perPage,
  };
  if (options.search) spec.search = options.search;
  if (options.filters?.length) spec.filters = options.filters;
  if (options.orderBy?.length) spec.order_by = options.orderBy;

  const response = await apiFetch(
    getQueryUrl(endpoint, spec),
    { method: "GET", cache: "no-store" },
    token,
  );
  const body = await readJson(response);
  const data = body.data;
  const nested = record(data);
  const rows = (Array.isArray(data)
    ? data
    : Array.isArray(nested.data)
      ? nested.data
      : Array.isArray(nested.rows)
        ? nested.rows
        : []) as T[];
  const meta = record(body.meta ?? nested.meta);
  return {
    rows,
    total: numberValue(meta.total ?? meta.total_items ?? body.total, rows.length),
    page: numberValue(meta.current_page ?? meta.page, page),
    perPage: numberValue(meta.per_page ?? meta.page_size, perPage),
  };
}

export async function getLoyaltyResource<T extends LoyaltyRow = LoyaltyRow>(
  endpoint: string,
  id: string | number,
  token: string,
): Promise<T> {
  const response = await apiFetch(
    getResourceUrl(endpoint, id),
    { method: "GET", cache: "no-store" },
    token,
  );
  const body = await readJson(response);
  return record(body.data ?? body) as T;
}

export async function saveLoyaltyResource(
  endpoint: string,
  token: string,
  payload: LoyaltyRow,
  id?: string | number,
): Promise<LoyaltyActionResult> {
  const response = await apiFetch(getResourceUrl(endpoint, id), {
    method: id === undefined ? "POST" : "PUT",
    body: JSON.stringify(payload),
  }, token);
  const body = await readJson(response);
  return {
    data: record(body.data ?? body),
    message: String(body.message ?? "Data berhasil disimpan"),
  };
}

export async function callLoyaltyMethod(
  resource: string,
  method: string,
  token: string,
  payload: LoyaltyRow = {},
): Promise<LoyaltyActionResult> {
  const response = await apiFetch(
    getApiUrl(`/api/resource/${resource}/method/${method}`),
    { method: "POST", body: JSON.stringify(payload) },
    token,
  );
  const body = await readJson(response);
  return {
    data: record(body.data ?? body),
    message: String(body.message ?? record(body.data).message ?? "Action berhasil"),
  };
}

export async function getLoyaltyBalance(
  gpid: string | number,
  token: string,
): Promise<LoyaltyBalance> {
  const result = await callLoyaltyMethod(
    "loyalty_redemption",
    "get_balance",
    token,
    { gpid },
  );
  const data = result.data;
  return {
    total_point: numberValue(data.total_point),
    redeemed_point: numberValue(data.redeemed_point),
    reserved_point: numberValue(data.reserved_point),
    available_point: numberValue(data.available_point),
    buckets: Array.isArray(data.buckets) ? (data.buckets as LoyaltyRow[]) : [],
  };
}
