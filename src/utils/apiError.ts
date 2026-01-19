// src/utils/apiError.ts

export interface ApiError {
  code?: number;
  message: string;
  details?: unknown;
}

/**
 * Extract error information from API response
 * @param response - Fetch Response object
 * @returns ApiError object with code and message
 */
export async function handleApiError(response: Response): Promise<ApiError> {
  const errorCode = response.status;
  let errorMessage = response.statusText || "Unknown error";

  try {
    const errorData = await response.json();
    // Try to extract message from various API response formats
    errorMessage =
      errorData.message ||
      errorData.error ||
      errorData.msg ||
      errorData.detail ||
      errorMessage;
  } catch {
    // If response body is not JSON, use status text
    console.warn("[API Error] Response body is not JSON");
  }

  return {
    code: errorCode,
    message: errorMessage,
  };
}

/**
 * Handle fetch errors (network errors, timeouts, etc)
 * @param error - Error object from catch block
 * @returns ApiError object
 */
export function handleFetchError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Network errors, timeout, etc
    return {
      message: error.message || "Gagal terhubung ke server. Periksa koneksi internet Anda.",
    };
  }

  return {
    message: String(error) || "Terjadi kesalahan yang tidak terduga.",
  };
}
