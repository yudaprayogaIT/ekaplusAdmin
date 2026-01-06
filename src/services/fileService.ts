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

export interface FileListResponse {
  status: string;
  code: string;
  message: string;
  data: FileItem[];
}

export interface FileDeleteResponse {
  status: string;
  code: string;
  message: string;
}

/**
 * Fetch all files
 */
export async function fetchFiles(token: string): Promise<FileItem[]> {
  const url = getApiUrl(API_CONFIG.ENDPOINTS.FILES);

  const response = await apiFetch(url, {}, token);

  if (!response.ok) {
    throw new Error(`Failed to fetch files: ${response.statusText}`);
  }

  const json: FileListResponse = await response.json();
  return json.data || [];
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
  const fullUrl = fileUrl.startsWith("http")
    ? fileUrl
    : `${API_CONFIG.FILE_BASE_URL}${fileUrl}`;

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
  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }
  return `${API_CONFIG.FILE_BASE_URL}${fileUrl}`;
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
