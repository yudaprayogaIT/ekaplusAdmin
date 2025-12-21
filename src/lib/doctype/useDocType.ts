// src/lib/doctype/useDocType.ts
/**
 * Generic hook for CRUD operations on doctypes
 *
 * Provides create, update, delete, and get functions for a doctype
 * based on its configuration. Handles API calls, loading states,
 * and error handling automatically.
 *
 * @example
 * ```typescript
 * const { create, update, delete: deleteItem, loading, error } = useDocType(branchConfig, token)
 *
 * // Create a new item
 * const newBranch = await create({ name: 'New Branch', city: 'Jakarta', ... })
 *
 * // Update an item
 * await update(123, { name: 'Updated Name' })
 *
 * // Delete an item
 * await deleteItem(123)
 * ```
 */

import { useState, useCallback } from "react";
import {
  getResourceUrl,
  getAuthHeaders,
  getAuthHeadersFormData,
} from "@/config/api";
import type { DocTypeConfig, ApiResourceResponse, ApiErrorResponse } from "./types";

/**
 * Hook return type
 */
export interface UseDocTypeReturn<T> {
  /** Create a new record */
  create: (data: T) => Promise<T>;

  /** Update an existing record */
  update: (id: number | string, data: Partial<T>) => Promise<T>;

  /** Delete a record */
  delete: (id: number | string) => Promise<void>;

  /** Get a single record by ID */
  get: (id: number | string) => Promise<T>;

  /** Loading state */
  loading: boolean;

  /** Error message if any */
  error: string | null;

  /** Clear error */
  clearError: () => void;
}

/**
 * Generic CRUD hook for doctypes
 *
 * @template T The type of the doctype
 * @param config DocType configuration
 * @param token Authentication token
 * @returns CRUD operations and state
 */
export function useDocType<T extends Record<string, unknown>>(
  config: DocTypeConfig<T>,
  token: string | null
): UseDocTypeReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if we're in mock mode (using localStorage instead of API)
  const isMockMode = token === "mock-token-for-testing";
  const cacheKey = config.cacheKey || `ekatalog_${config.name}_snapshot`;

  /**
   * Create a new record (API or localStorage)
   */
  const create = useCallback(
    async (data: T): Promise<T> => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        // MOCK MODE: Use localStorage
        if (isMockMode) {
          const cached = localStorage.getItem(cacheKey);
          const items = cached ? JSON.parse(cached) as T[] : [];

          // Generate new ID
          const newId = items.length > 0 ? Math.max(...items.map((i) => Number(i.id))) + 1 : 1;

          const newItem = {
            ...data,
            id: newId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as T;

          items.push(newItem);
          localStorage.setItem(cacheKey, JSON.stringify(items));

          // Dispatch update event
          const eventName = config.eventName || `ekatalog:${config.name}_update`;
          window.dispatchEvent(new Event(eventName));

          console.log(`✅ Created ${config.label} (MOCK MODE)`);
          setLoading(false);
          return newItem;
        }

        // REAL API MODE
        // Call beforeSave hook if provided
        let processedData = data;
        if (config.hooks?.beforeSave) {
          processedData = await config.hooks.beforeSave(data, false);
        }

        // Transform data to API format
        const apiData = config.hooks?.transformToApi
          ? config.hooks.transformToApi(processedData)
          : processedData;

        // Determine headers based on data type
        const isFormData = apiData instanceof FormData;
        const headers = isFormData
          ? getAuthHeadersFormData(token)
          : getAuthHeaders(token);

        // Make API request
        const response = await fetch(getResourceUrl(config.endpoint), {
          method: "POST",
          headers,
          body: isFormData ? apiData : JSON.stringify(apiData),
        });

        if (!response.ok) {
          const errorData = (await response
            .json()
            .catch(() => ({}))) as ApiErrorResponse;
          throw new Error(
            errorData.message || `Failed to create ${config.label} (${response.status})`
          );
        }

        const responseData = (await response.json()) as ApiResourceResponse<unknown>;

        // Transform API response to frontend model
        const createdItem = config.hooks?.transformApiResponse
          ? config.hooks.transformApiResponse(responseData.data)
          : (responseData.data as T);

        // Call afterSave hook if provided
        if (config.hooks?.afterSave) {
          await config.hooks.afterSave(createdItem, false);
        }

        // Dispatch update event
        const eventName = config.eventName || `ekatalog:${config.name}_update`;
        window.dispatchEvent(new Event(eventName));

        return createdItem;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, token]
  );

  /**
   * Update an existing record (API or localStorage)
   */
  const update = useCallback(
    async (id: number | string, data: Partial<T>): Promise<T> => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        // MOCK MODE: Use localStorage
        if (isMockMode) {
          const cached = localStorage.getItem(cacheKey);
          const items = cached ? JSON.parse(cached) as T[] : [];

          const index = items.findIndex((item) => item.id === id);
          if (index === -1) {
            throw new Error(`${config.label} with ID ${id} not found`);
          }

          const updatedItem = {
            ...items[index],
            ...data,
            updated_at: new Date().toISOString(),
          } as T;

          items[index] = updatedItem;
          localStorage.setItem(cacheKey, JSON.stringify(items));

          // Dispatch update event
          const eventName = config.eventName || `ekatalog:${config.name}_update`;
          window.dispatchEvent(new Event(eventName));

          console.log(`✅ Updated ${config.label} (MOCK MODE)`);
          setLoading(false);
          return updatedItem;
        }

        // REAL API MODE
        // Call beforeSave hook if provided
        let processedData = data as T;
        if (config.hooks?.beforeSave) {
          processedData = await config.hooks.beforeSave(data as T, true);
        }

        // Transform data to API format
        const apiData = config.hooks?.transformToApi
          ? config.hooks.transformToApi(processedData)
          : processedData;

        // Determine headers based on data type
        const isFormData = apiData instanceof FormData;
        const headers = isFormData
          ? getAuthHeadersFormData(token)
          : getAuthHeaders(token);

        // Make API request
        const response = await fetch(getResourceUrl(config.endpoint, id), {
          method: "PUT",
          headers,
          body: isFormData ? apiData : JSON.stringify(apiData),
        });

        if (!response.ok) {
          const errorData = (await response
            .json()
            .catch(() => ({}))) as ApiErrorResponse;
          throw new Error(
            errorData.message || `Failed to update ${config.label} (${response.status})`
          );
        }

        const responseData = (await response.json()) as ApiResourceResponse<unknown>;

        // Transform API response to frontend model
        const updatedItem = config.hooks?.transformApiResponse
          ? config.hooks.transformApiResponse(responseData.data)
          : (responseData.data as T);

        // Call afterSave hook if provided
        if (config.hooks?.afterSave) {
          await config.hooks.afterSave(updatedItem, true);
        }

        // Dispatch update event
        const eventName = config.eventName || `ekatalog:${config.name}_update`;
        window.dispatchEvent(new Event(eventName));

        return updatedItem;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, token]
  );

  /**
   * Delete a record (API or localStorage)
   */
  const deleteRecord = useCallback(
    async (id: number | string): Promise<void> => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        // MOCK MODE: Use localStorage
        if (isMockMode) {
          const cached = localStorage.getItem(cacheKey);
          const items = cached ? JSON.parse(cached) as T[] : [];

          const index = items.findIndex((item) => item.id === id);
          if (index === -1) {
            throw new Error(`${config.label} with ID ${id} not found`);
          }

          items.splice(index, 1);
          localStorage.setItem(cacheKey, JSON.stringify(items));

          // Dispatch update event
          const eventName = config.eventName || `ekatalog:${config.name}_update`;
          window.dispatchEvent(new Event(eventName));

          console.log(`✅ Deleted ${config.label} (MOCK MODE)`);
          setLoading(false);
          return;
        }

        // REAL API MODE
        // Call beforeDelete hook if provided
        // Note: We don't have the full item data here, might need to fetch it first
        // if beforeDelete hook needs it
        if (config.hooks?.beforeDelete) {
          // For now, pass an empty object with just the id
          const shouldDelete = await config.hooks.beforeDelete({ id } as T);
          if (shouldDelete === false) {
            throw new Error("Delete cancelled by beforeDelete hook");
          }
        }

        const headers = getAuthHeaders(token);

        const response = await fetch(getResourceUrl(config.endpoint, id), {
          method: "DELETE",
          headers,
        });

        if (!response.ok) {
          const errorData = (await response
            .json()
            .catch(() => ({}))) as ApiErrorResponse;
          throw new Error(
            errorData.message || `Failed to delete ${config.label} (${response.status})`
          );
        }

        // Call afterDelete hook if provided
        if (config.hooks?.afterDelete) {
          await config.hooks.afterDelete({ id } as T);
        }

        // Dispatch update event
        const eventName = config.eventName || `ekatalog:${config.name}_update`;
        window.dispatchEvent(new Event(eventName));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, token]
  );

  /**
   * Get a single record by ID
   */
  const get = useCallback(
    async (id: number | string): Promise<T> => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      setLoading(true);
      setError(null);

      try {
        const headers = getAuthHeaders(token);

        const response = await fetch(getResourceUrl(config.endpoint, id), {
          method: "GET",
          headers,
        });

        if (!response.ok) {
          const errorData = (await response
            .json()
            .catch(() => ({}))) as ApiErrorResponse;
          throw new Error(
            errorData.message || `Failed to fetch ${config.label} (${response.status})`
          );
        }

        const responseData = (await response.json()) as ApiResourceResponse<unknown>;

        // Transform API response to frontend model
        const item = config.hooks?.transformApiResponse
          ? config.hooks.transformApiResponse(responseData.data)
          : (responseData.data as T);

        return item;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config, token]
  );

  return {
    create,
    update,
    delete: deleteRecord,
    get,
    loading,
    error,
    clearError,
  };
}
