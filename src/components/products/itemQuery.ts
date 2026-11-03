import type { Item } from "@/types";
import type { FilterTriple } from "@/types/filter";
import {
  API_CONFIG,
  apiFetch,
  getAuthHeaders,
  getFileUrl,
  getQueryUrl,
} from "@/config/api";

export const PRODUCT_ITEM_PAGE_SIZE = 32;

type ItemApiRow = {
  id: number | string;
  item_code: string;
  item_name: string;
  uom?: string;
  item_desc?: string;
  item_category?: string;
  item_group?: string;
  image?: string | null;
  disabled?: number | string;
};

export type ProductItemPage = {
  items: Item[];
  page: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function mapItem(row: ItemApiRow): Item | null {
  const id = toNumber(row.id);
  if (id === null) return null;

  return {
    id,
    code: row.item_code,
    name: row.item_name,
    uom: row.uom || "",
    description: row.item_desc || "",
    category: row.item_category || "",
    group: row.item_group || "",
    type: "",
    color: "",
    image: getFileUrl(row.image),
    disabled: toNumber(row.disabled) ?? 0,
  };
}

export async function fetchProductItemPage({
  token,
  page = 1,
  limit = PRODUCT_ITEM_PAGE_SIZE,
  search,
  filters = [],
  signal,
}: {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
  filters?: FilterTriple[];
  signal?: AbortSignal;
}): Promise<ProductItemPage> {
  const spec: Record<string, unknown> = {
    fields: [
      "id",
      "item_code",
      "item_name",
      "uom",
      "item_desc",
      "item_category",
      "item_group",
      "image",
      "disabled",
    ],
    filters: [["disabled", "=", 0], ...filters],
    order_by: [["item_name", "asc"]],
    limit,
    page,
    with_total: true,
  };

  if (search?.trim()) spec.search = search.trim();

  const response = await apiFetch(
    getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, spec),
    {
      method: "GET",
      cache: "no-store",
      headers: getAuthHeaders(token),
      signal,
    },
  );

  if (!response.ok) {
    let message = `Gagal mengambil item (HTTP ${response.status})`;
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {}
    throw new Error(message);
  }

  const json = await response.json();
  const rows = Array.isArray(json?.data) ? (json.data as ItemApiRow[]) : [];
  const items = rows.map(mapItem).filter((item): item is Item => item !== null);
  const responsePage = Number(json?.meta?.page ?? page);
  const perPage = Number(json?.meta?.per_page ?? limit);
  const total = Number(
    json?.meta?.total ??
      json?.total ??
      json?.count ??
      json?.total_count ??
      0,
  );
  const reportedTotalPages = Number(json?.meta?.total_pages ?? 0);
  const totalPages =
    reportedTotalPages > 0
      ? reportedTotalPages
      : total > 0
        ? Math.ceil(total / perPage)
        : 0;

  return {
    items,
    page: responsePage,
    total,
    totalPages,
    hasMore: totalPages > 0 ? responsePage < totalPages : items.length >= limit,
  };
}
