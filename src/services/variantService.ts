import {
  API_CONFIG,
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  apiFetch,
} from "@/config/api";
import type {
  ItemVariant,
  ItemVariantApiResponse,
  CreateVariantRequest,
  UpdateVariantRequest,
  Item,
} from "@/types";

/**
 * Helper: Transform API response ke frontend format
 * Hydrate item ID dengan full Item object
 */
function transformVariantResponse(
  apiData: ItemVariantApiResponse,
  items: Item[]
): ItemVariant {
  const item = items.find((i) => i.id === apiData.item);
  if (!item) {
    // Return placeholder if item not found
    return {
      id: apiData.id,
      item: {
        id: apiData.item,
        code: `ITEM-${apiData.item}`,
        name: `Item ${apiData.item} (Not Found)`,
        color: "",
        type: "",
        uom: "",
      },
      productid: apiData.parent_id || 0,
      displayOrder: apiData.idx || 0,
    };
  }

  return {
    id: apiData.id,
    item,
    productid: apiData.parent_id || 0,
    displayOrder: apiData.idx || 0,
    created_at: apiData.created_at,
    created_by: apiData.created_by,
    updated_at: apiData.updated_at,
    updated_by: apiData.updated_by,
    owner: apiData.owner,
  };
}

/**
 * Fetch all variants dengan items hydrated
 */
export async function fetchVariants(
  token: string,
  items: Item[]
): Promise<ItemVariant[]> {
  if (!token) {
    throw new Error("Authentication required");
  }

  const url = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT, {
    fields: [
      "id",
      "name",
      "item",
      "idx",
      "parent_id",
      "parent_type",
      "parent_field",
      "created_at",
      "created_by",
      "updated_at",
      "updated_by",
      "owner",
    ],
  });

  const response = await apiFetch(url, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }

    throw new Error(`Failed to fetch variants: ${response.status} ${errorText}`);
  }

  const json = await response.json();

  if (!json.data || !Array.isArray(json.data)) {
    throw new Error("Invalid API response format");
  }

  return json.data.map((v: ItemVariantApiResponse) =>
    transformVariantResponse(v, items)
  );
}

/**
 * Fetch variants untuk specific product
 */
export async function fetchVariantsByProduct(
  token: string,
  productId: number,
  items: Item[]
): Promise<ItemVariant[]> {
  const url = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT, {
    fields: [
      "id",
      "name",
      "item",
      "idx",
      "parent_id",
      "parent_type",
      "parent_field",
      "created_at",
      "created_by",
      "updated_at",
      "updated_by",
      "owner",
    ],
    filters: [["parent_id", "=", productId]],
  });

  const response = await apiFetch(url, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch variants for product");
  }

  const json = await response.json();
  return json.data.map((v: ItemVariantApiResponse) =>
    transformVariantResponse(v, items)
  );
}

/**
 * Create new variant
 */
export async function createVariant(
  token: string,
  data: CreateVariantRequest,
  items: Item[]
): Promise<ItemVariant> {
  const url = getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT);

  const response = await apiFetch(url, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create variant");
  }

  const json = await response.json();
  return transformVariantResponse(json.data, items);
}

/**
 * Update variant
 */
export async function updateVariant(
  token: string,
  id: number,
  data: UpdateVariantRequest,
  items: Item[]
): Promise<ItemVariant> {
  const url = getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT, id);

  const response = await apiFetch(url, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update variant");
  }

  const json = await response.json();
  return transformVariantResponse(json.data, items);
}

/**
 * Delete variant
 */
export async function deleteVariant(
  token: string,
  id: number
): Promise<void> {
  const url = getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT, id);

  const response = await apiFetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to delete variant");
  }
}

/**
 * Bulk create variants (untuk bulk operations)
 */
export async function bulkCreateVariants(
  token: string,
  requests: CreateVariantRequest[],
  items: Item[]
): Promise<ItemVariant[]> {
  const promises = requests.map((req) => createVariant(token, req, items));
  return Promise.all(promises);
}
