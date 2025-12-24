// src/config/api.ts
/**
 * Centralized API configuration
 * Change the base URL here when switching to production or different server
 */
export const API_CONFIG = {
  // BASE_URL: "http://192.168.101.214:8000",
  BASE_URL: "https://api-ekaplus.ekatunggal.com",
  // BASE_URL: "https://estrella-subgeniculate-dollie.ngrok-free.dev",
  // FILE_BASE_URL: "http://192.168.101.214:8000",
  FILE_BASE_URL: "https://api-ekaplus.ekatunggal.com",
  // FILE_BASE_URL: "https://estrella-subgeniculate-dollie.ngrok-free.dev",

  // Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/auth/me",

    // File Upload
    UPLOAD: "/api/upload",

    // Resources
    BRANCH: "/api/resource/branch",
    TYPE: "/api/resource/ekatalog_type",
    CATEGORY: "/api/resource/ekatalog_category",
    ITEM: "/api/resource/item",
    PRODUCT: "/api/resource/ekatalog_product",
    PRODUCT_VARIANT: "/api/resource/ekatalog_variant",
    WISHLIST: "/api/resource/wishlist",
    ROLE: "/api/resource/role",
    PERMISSION: "/resource/permission",
    USER: "/api/resource/user",
    EMAIL: "/resource/email",
    WHATSAPP: "/api/resource/whatsapp",
    WORKFLOW_STATE: "/api/workflow/state",
  },
} as const;

/**
 * Helper function to build full API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * Helper function to build resource URL with ID
 */
export function getResourceUrl(endpoint: string, id?: number | string): string {
  const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  return id ? `${baseUrl}/${id}` : baseUrl;
}

/**
 * Helper function to build query URL
 */
export function getQueryUrl(
  endpoint: string,
  spec?: Record<string, unknown>
): string {
  const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
  if (spec) {
    return `${baseUrl}?spec=${JSON.stringify(spec)}`;
  }
  return baseUrl;
}

/**
 * Common headers for authenticated requests (JSON)
 */
export function getAuthHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Common headers for FormData requests
 * Don't set Content-Type, let browser set it automatically with boundary
 */
export function getAuthHeadersFormData(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    // DO NOT set Content-Type for FormData - browser will set multipart/form-data with boundary
  };
}

/**
 * Helper function to convert filename to full URL
 * Handles both filename and full URL
 */
export function getFileUrl(filename?: string | null): string | undefined {
  if (!filename) return undefined;

  // Jika sudah berupa URL lengkap, return as is
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  // Jika hanya filename, buat full URL
  return `${API_CONFIG.FILE_BASE_URL}/files/${filename}`;
}