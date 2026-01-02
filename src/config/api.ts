// src/config/api.ts
/**
 * Centralized API configuration
 * Change the base URL here when switching to production or different server
 */
export const API_CONFIG = {
  BASE_URL: "https://api-ekaplus.ekatunggal.com",
  FILE_BASE_URL: "https://api-ekaplus.ekatunggal.com",

  // Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",

    // Resources
    BRANCH: "/api/resource/branch",
    TYPE: "/api/resource/ekatalog_type",
    CATEGORY: "/api/resource/ekatalog_category",
    ITEM: "/api/resource/item",
    PRODUCT: "/api/resource/ekatalog_product",
    PRODUCT_VARIANT: "/api/resource/ekatalog_variant",
    WISHLIST: "/api/resource/wishlist",
    BANNER: "/api/resource/ekatalog_banner",
    ROLE: "/api/resource/role",
    PERMISSION: "/resource/permission",
    USER: "/api/resource/user",
    EMAIL: "/resource/email",
    WHATSAPP: "/api/resource/whatsapp",
    WORKFLOW_STATE: "/api/workflow/state",
    CUSTOMER_REGISTER: "/api/resource/ekatalog_customer_register",

    // Customer Management - GP/GC/BC
    GLOBAL_PARTY: "/api/resource/ekatalog_global_party",
    GLOBAL_CUSTOMER: "/api/resource/ekatalog_global_customer",
    BRANCH_CUSTOMER: "/api/resource/ekatalog_branch_customer",

    // Customer Registration Actions (for temporary static implementation)
    CUSTOMER_REGISTER_APPROVE: "/api/method/customer_registration.approve",
    CUSTOMER_REGISTER_REJECT: "/api/method/customer_registration.reject",
    CUSTOMER_REGISTER_CHECK_GP: "/api/method/customer_registration.check_gp",

    // GP/GC/BC Update Actions
    GP_UPDATE_NAME: "/api/method/global_party.update_name",
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
    return `${baseUrl}?spec=${encodeURIComponent(JSON.stringify(spec))}`;
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

/**
 * Session expiration callback
 * This will be set by the AuthProvider
 */
let sessionExpiredCallback: (() => void) | null = null;

/**
 * Register callback to be called when session expires (401 response)
 */
export function registerSessionExpiredCallback(callback: () => void) {
  sessionExpiredCallback = callback;
}

/**
 * Unregister session expired callback
 */
export function unregisterSessionExpiredCallback() {
  sessionExpiredCallback = null;
}

/**
 * Wrapper around fetch that automatically handles 401 responses
 * Usage: const response = await apiFetch(url, options, token)
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<Response> {
  // Add authorization header if token is provided
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set default Content-Type to JSON if not FormData
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - Session expired
  if (response.status === 401 && sessionExpiredCallback) {
    sessionExpiredCallback();
  }

  return response;
}