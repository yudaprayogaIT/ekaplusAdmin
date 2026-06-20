// src/services/fileService.ts

import { API_CONFIG, getApiUrl, apiFetch } from "@/config/api";

export interface FileItem {
  id: number;
  uuid: string;
  file_name: string;
  object_key: string;
  file_url: string;
  is_private: boolean;
  folder: string;
  description: string;
  mime_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface FileListMeta {
  request_id?: string;
  trace_id?: string;
  timestamp?: string;
  processing_time_ms?: number;
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface FileListResponse {
  status: string;
  code: string;
  message: string;
  data: FileItem[];
  meta?: FileListMeta;
}

export interface FileDeleteResponse {
  status: string;
  code: string;
  message: string;
}

export interface FetchFilesParams {
  page?: number;
  limit?: number;
}

/**
 * Fetch files by page
 */
export async function fetchFiles(
  token: string,
  params: FetchFilesParams = {}
): Promise<{ data: FileItem[]; meta: FileListMeta | null }> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const spec = encodeURIComponent(
    JSON.stringify({
      fields: ["*"],
      page,
      limit,
    })
  );
  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.FILES)}?spec=${spec}`;

  const response = await apiFetch(url, {}, token);

  if (!response.ok) {
    throw new Error(`Failed to fetch files: ${response.statusText}`);
  }

  const json: FileListResponse = await response.json();
  return {
    data: json.data || [],
    meta: json.meta ?? null,
  };
}

/**
 * Delete a file by UUID
 */
export async function deleteFile(
  uuid: string,
  token: string
): Promise<FileDeleteResponse> {
  const url = `${getApiUrl(API_CONFIG.ENDPOINTS.FILES)}/${uuid}`;

  const response = await apiFetch(
    url,
    {
      method: "DELETE",
    },
    token
  );

  if (!response.ok) {
    throw new Error(`Failed to delete file: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Download a file
 */
export function downloadFile(fileUrl: string, fileName: string): void {
  const fullUrl = getFilePreviewUrl(fileUrl);

  // Create a temporary anchor element to trigger download
  const link = document.createElement("a");
  link.href = fullUrl;
  link.download = fileName;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get file preview URL
 */
export function getFilePreviewUrl(fileUrl: string): string {
  if (!fileUrl) {
    return "";
  }
  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }
  if (fileUrl.startsWith("/")) {
    return `${API_CONFIG.FILE_BASE_URL}${fileUrl}`;
  }
  return `${API_CONFIG.FILE_BASE_URL}/files/${fileUrl}`;
}

/**
 * Build preview/download URL from file object
 */
export function getFileAccessUrl(file: FileItem): string {
  if (file.file_url) {
    return getFilePreviewUrl(file.file_url);
  }
  return `${API_CONFIG.FILE_BASE_URL}/files/${file.uuid}`;
}

/**
 * Build transformed image preview URL from file uuid
 */
export function getImagePreviewUrl(
  file: FileItem,
  format: string = "rs:fill:500:500/q:80/ext:webp"
): string {
  const url = new URL(`${API_CONFIG.FILE_BASE_URL}/files/${file.uuid}`);
  url.searchParams.set("format", format);
  return url.toString();
}

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Get file type badge color
 */
export function getFileTypeBadgeColor(mimeType: string): string {
  if (mimeType.startsWith("image/")) {
    return "bg-green-100 text-green-700";
  } else if (mimeType.startsWith("video/")) {
    return "bg-purple-100 text-purple-700";
  } else if (mimeType.startsWith("application/pdf")) {
    return "bg-red-100 text-red-700";
  } else if (
    mimeType.startsWith("application/") ||
    mimeType.startsWith("text/")
  ) {
    return "bg-blue-100 text-blue-700";
  }
  return "bg-gray-100 text-gray-700";
}

/**
 * Get folder badge color
 */
export function getFolderBadgeColor(folder: string): string {
  switch (folder) {
    case "item":
      return "bg-blue-100 text-blue-700";
    case "ekatalog_category":
      return "bg-orange-100 text-orange-700";
    case "ekatalog_banner":
      return "bg-purple-100 text-purple-700";
    case "ekatalog_customer_register":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
