// src/config/api.ts
/**
 * Centralized API configuration
 * Change the base URL here when switching to production or different server
 */
export const API_CONFIG = {
  BASE_URL: "http://192.168.101.214:8000/api",
  FILE_BASE_URL: "http://192.168.101.214:8000",

  // Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",

    // File Upload
    UPLOAD: "/upload",

    // Resources
    BRANCH: "/resource/branch",
    TYPE: "/resource/ekatalog_type",
    CATEGORY: "/resource/ekatalog_category",
    ITEM: "/resource/item",
    ROLE: "/resource/role",
    PERMISSION: "/resource/permission",
    USER: "/resource/user",
    EMAIL: "/resource/email",
    WHATSAPP: "/resource/whatsapp",
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