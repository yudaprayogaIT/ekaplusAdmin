import {
  API_CONFIG,
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
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
    console.warn(`Item ${apiData.item} not found in items list`);
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
      productid: apiData.parent_id,
      displayOrder: apiData.idx,
    };
  }

  return {
    id: apiData.id,
    item: item,
    productid: apiData.parent_id, // From parent_id
    displayOrder: apiData.idx, // From idx
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
    console.error("fetchVariants: No token provided");
    throw new Error("Authentication required");
  }

  const url = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT, {
    fields: ["*"],
  });

  console.log("fetchVariants: Fetching from", url);

  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("fetchVariants failed:", response.status, errorText);

    if (response.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }

    throw new Error(`Failed to fetch variants: ${response.status} ${errorText}`);
  }

  const json = await response.json();

  if (!json.data || !Array.isArray(json.data)) {
    console.error("Invalid API response:", json);
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
    fields: ["*"],
    filters: [["product", "=", productId]],
  });

  const response = await fetch(url, {
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

  const response = await fetch(url, {
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

  const response = await fetch(url, {
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

  const response = await fetch(url, {
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
