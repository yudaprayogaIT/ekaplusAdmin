import {
  API_CONFIG,
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  apiFetch,
} from "@/config/api";
import type {
  WishlistItem,
  WishlistApiResponse,
  CreateWishlistRequest,
  Item,
} from "@/types";

/**
 * Helper: Transform API response ke frontend format
 * Hydrate item ID dengan full Item object
 */
function transformWishlistResponse(
  apiData: WishlistApiResponse,
  items: Item[]
): WishlistItem {
  const resolvedUserName =
    apiData.user?.full_name ||
    (typeof apiData.owner === "object" ? apiData.owner?.full_name : undefined) ||
    (typeof apiData.created_by === "object"
      ? apiData.created_by?.full_name
      : undefined);
  const resolvedCreatedBy =
    apiData.user?.full_name ||
    (typeof apiData.owner === "object" ? apiData.owner?.full_name : undefined) ||
    (typeof apiData.created_by === "object"
      ? apiData.created_by?.full_name
      : apiData.created_by);
  const resolvedUpdatedBy =
    (typeof apiData.updated_by === "object"
      ? apiData.updated_by?.full_name
      : apiData.updated_by) || undefined;

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
      userId: apiData.user_id,
      userName: resolvedUserName,
      createdAt: apiData.created_at,
      updatedAt: apiData.updated_at,
      createdBy: resolvedCreatedBy,
      updatedBy: resolvedUpdatedBy,
    };
  }

  return {
    id: apiData.id,
    item: item,
    userId: apiData.user_id,
    userName: resolvedUserName,
    createdAt: apiData.created_at,
    updatedAt: apiData.updated_at,
    createdBy: resolvedCreatedBy,
    updatedBy: resolvedUpdatedBy,
  };
}

/**
 * Fetch all wishlist items untuk user yang sedang login
 */
export async function fetchWishlist(
  token: string,
  items: Item[]
): Promise<WishlistItem[]> {
  if (!token) {
    console.error("fetchWishlist: No token provided");
    throw new Error("Authentication required");
  }

  const url = getQueryUrl(API_CONFIG.ENDPOINTS.WISHLIST, {
    fields: [
      "*",
      "user.full_name",
      "owner.full_name",
      "created_by.full_name",
      "updated_by.full_name",
    ],
  });

  console.log("fetchWishlist: Fetching from", url);

  const response = await apiFetch(url, {
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("fetchWishlist failed:", response.status, errorText);

    if (response.status === 401) {
      throw new Error("Unauthorized - Please login again");
    }

    throw new Error(
      `Failed to fetch wishlist: ${response.status} ${errorText}`
    );
  }

  const json = await response.json();

  if (!json.data || !Array.isArray(json.data)) {
    console.error("Invalid API response:", json);
    throw new Error("Invalid API response format");
  }

  return json.data.map((w: WishlistApiResponse) =>
    transformWishlistResponse(w, items)
  );
}

/**
 * Add item to wishlist
 */
export async function addToWishlist(
  token: string,
  data: CreateWishlistRequest,
  items: Item[]
): Promise<WishlistItem> {
  const url = getResourceUrl(API_CONFIG.ENDPOINTS.WISHLIST);

  const response = await apiFetch(url, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add to wishlist");
  }

  const json = await response.json();
  return transformWishlistResponse(json.data, items);
}

/**
 * Remove item from wishlist
 */
export async function removeFromWishlist(
  token: string,
  id: number
): Promise<void> {
  const url = getResourceUrl(API_CONFIG.ENDPOINTS.WISHLIST, id);

  const response = await apiFetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    throw new Error("Failed to remove from wishlist");
  }
}

/**
 * Check if item is in wishlist
 */
export function isInWishlist(wishlist: WishlistItem[], itemId: number): boolean {
  return wishlist.some((w) => w.item.id === itemId);
}

/**
 * Get wishlist item by item ID
 */
export function getWishlistItemByItemId(
  wishlist: WishlistItem[],
  itemId: number
): WishlistItem | undefined {
  return wishlist.find((w) => w.item.id === itemId);
}
