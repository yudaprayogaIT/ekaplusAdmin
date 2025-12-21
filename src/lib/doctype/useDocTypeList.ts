// src/lib/doctype/useDocTypeList.ts
/**
 * Generic hook for managing list data for doctypes
 *
 * Handles fetching, caching, and real-time updates for a list of items.
 * Automatically subscribes to custom events for updates and manages
 * localStorage caching for better UX.
 *
 * @example
 * ```typescript
 * const { items, loading, error, reload } = useDocTypeList(branchConfig, token, isAuthenticated)
 *
 * // items will be automatically loaded and kept in sync
 * // reload() can be called to manually refresh
 * ```
 */

import { useState, useEffect, useCallback } from "react";
import { getQueryUrl, getAuthHeaders } from "@/config/api";
import type { DocTypeConfig, ApiResponse } from "./types";

/**
 * Hook return type
 */
export interface UseDocTypeListReturn<T> {
  /** Array of items */
  items: T[];

  /** Loading state */
  loading: boolean;

  /** Error message if any */
  error: string | null;

  /** Manually reload data from API */
  reload: () => Promise<void>;

  /** Set items (useful for optimistic updates) */
  setItems: (items: T[] | ((prev: T[]) => T[])) => void;
}

/**
 * Generic hook for managing list data
 *
 * @template T The type of the doctype
 * @param config DocType configuration
 * @param token Authentication token
 * @param isAuthenticated Whether user is authenticated
 * @returns List data and state
 */
export function useDocTypeList<T extends Record<string, unknown>>(
  config: DocTypeConfig<T>,
  token: string | null,
  isAuthenticated: boolean
): UseDocTypeListReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate cache key
  const cacheKey = config.cacheKey || `ekatalog_${config.name}_snapshot`;

  /**
   * Load data from API or localStorage (for mock data)
   */
  const loadData = useCallback(async () => {
    // Check if auth is required
    const requireAuth = config.requireAuth !== false; // Default to true
    if (requireAuth && (!isAuthenticated || !token)) {
      setLoading(false);
      setItems([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to load from localStorage first (for mock data / offline mode)
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const cachedItems = JSON.parse(cached) as T[];
        setItems(cachedItems);
        console.log(`✅ Loaded ${config.name} from localStorage (${cachedItems.length} items)`);

        // Call onLoad hook if provided
        if (config.hooks?.onLoad) {
          await config.hooks.onLoad(cachedItems);
        }

        setLoading(false);
        return;
      }

      // No cached data - try API
      const dataUrl = getQueryUrl(config.endpoint, { fields: ["*"] });
      const headers = token ? getAuthHeaders(token) : {};

      const response = await fetch(dataUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Silakan login kembali.");
        } else if (response.status === 403) {
          setError("Akses ditolak. Anda tidak memiliki izin.");
        } else {
          setError(`Failed to fetch ${config.labelPlural} (${response.status})`);
        }
        setLoading(false);
        return;
      }

      const responseData = (await response.json()) as ApiResponse<unknown>;

      // Transform API response to frontend model
      const mappedItems: T[] = responseData.data.map((item) =>
        config.hooks?.transformApiResponse
          ? config.hooks.transformApiResponse(item)
          : (item as T)
      );

      setItems(mappedItems);

      // Save to localStorage cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(mappedItems));
      } catch (e) {
        console.error(`Failed to save ${config.name} snapshot:`, e);
      }

      // Call onLoad hook if provided
      if (config.hooks?.onLoad) {
        await config.hooks.onLoad(mappedItems);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);

      // Try to load from cache on error
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const cachedItems = JSON.parse(cached) as T[];
          setItems(cachedItems);
          console.log(`⚠️ Loaded ${config.name} from cache due to API error`);
          setError(null); // Clear error since we have cached data
        } else {
          // No cached data and API failed
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "No cached data available. Cannot connect to server."
            );
          } else {
            setError(errorMessage);
          }
        }
      } catch (cacheErr) {
        console.error(`Failed to load ${config.name} from cache:`, cacheErr);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [config, token, isAuthenticated, cacheKey]);

  /**
   * Reload data (exposed for manual refresh)
   */
  const reload = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Initial load
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Subscribe to update events
   */
  useEffect(() => {
    const eventName = config.eventName || `ekatalog:${config.name}_update`;

    const handler = async () => {
      console.log(`${config.name} update event received, reloading...`);
      await loadData();
    };

    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [config.name, config.eventName, loadData]);

  return {
    items,
    loading,
    error,
    reload,
    setItems,
  };
}
