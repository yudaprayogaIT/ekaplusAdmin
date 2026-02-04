// src/components/items/ItemList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ItemCard from "./ItemCard";
import AddItemModal from "./AddItemModal";
import ItemDetailModal from "./ItemDetailModal";
import BulkProductCreationModal from "@/components/variants/BulkProductCreationModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import {
  FaPlus,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountUp,
  FaSortAmountDown,
  FaChevronDown,
  FaLock,
  FaBoxOpen,
  FaTimes,
  FaCheckSquare,
  FaFilter,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  getFileUrl,
  API_CONFIG,
} from "@/config/api";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { ITEM_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
import { Product, Category } from "@/types";
import { buildSearchParams, parseSearchParams } from "@/utils/urlSync";

export type Item = {
  id: number;
  code: string;
  item_code: string;
  name: string;
  item_name: string;
  uom: string;
  group: string;
  item_group: string;
  category: string;
  generator_item: string;
  image?: string;
  description?: string;
  item_desc?: string;
  disabled: number;
  status: string;
  docstatus: number;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
  owner?: number;
  // Additional fields
  color?: string;
  type?: string;
  // Variant mapping info
  variants?: Array<{
    id: number;
    parent_id: number;
    item: number;
  }>;
  variantCount?: number;
  // Dimension fields
  panjang?: string;
  lebar?: string;
  tinggi?: string;
  diameter?: string;
  // Branches
  branches?: Array<{
    id: number;
    name: string;
  }>;
};

// API Response structure
type ItemAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    item_name: string;
    item_code: string;
    item_desc: string | null;
    item_group: string;
    item_category: string;
    generator_item: string;
    uom: string;
    image: string | null;
    disabled: number;
    status: string;
    docstatus: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    owner: number;
    variants?: Array<{
      id: number;
      parent_id: number;
      item: number;
    }>;
  }>;
  meta: Record<string, unknown>;
  total?: number;
  count?: number;
  total_count?: number;
};

type SortField =
  | "item_name"
  | "item_code"
  | "item_category"
  | "created_at"
  | "updated_at";
type SortDirection = "asc" | "desc";

const SNAP_KEY = "ekatalog_items_snapshot";

export default function ItemList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuth();

  // Parse initial state from URL
  const urlState = parseSearchParams(searchParams);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(urlState.searchQuery);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState<SortField>(
    (urlState.sortField as SortField) || "created_at"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    urlState.sortDirection || "desc"
  );
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [showOnlyUnmapped, setShowOnlyUnmapped] = useState(
    urlState.showOnlyUnmapped
  );

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(urlState.page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Item | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Item | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Multi-select state for mapping to products
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
    new Set()
  );
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Products and categories for BulkProductCreationModal
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  // Use filter system with initial filters from URL
  const { filters, setFilters } = useFilters({
    entity: "item",
    initialFilters: urlState.filters,
  });

  // Watch for URL changes and update filters accordingly
  useEffect(() => {
    const newUrlState = parseSearchParams(searchParams);

    console.log("[ItemList] 🔄 URL changed, new state:", newUrlState);

    // Only update if filters actually changed
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(newUrlState.filters);

    if (filtersChanged && newUrlState.filters.length > 0) {
      console.log("[ItemList] ⚡ Updating filters from URL");
      setFilters(newUrlState.filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams to avoid infinite loop

  // Helper function to load data with filters and sorting
  async function loadAllData(
    filterTriples: FilterTriple[] = [],
    sort_by?: SortField,
    sort_order?: SortDirection,
    page: number = 1
  ): Promise<{ items: Item[]; totalItems: number; totalPages: number }> {
    if (!token) return { items: [], totalItems: 0, totalPages: 0 };

    const headers = getAuthHeaders(token);

    interface ChildQuerySpec {
      alias: string;
      table: string;
      fields: string[];
      parent_key: string;
      parent_value: string;
    }

    const itemSpec: {
      fields: string[];
      filters?: FilterTriple[];
      order_by?: [string, string][];
      limit: number;
      page: number;
      childs?: ChildQuerySpec[];
    } = {
      fields: ["*"],
      limit: 20,
      page: page,
      childs: [
        {
          alias: "variants",
          table: "ekatalog_variant",
          fields: ["id", "parent_id", "item"],
          parent_key: "item",
          parent_value: "id",
        },
      ],
    };

    if (filterTriples.length > 0) {
      itemSpec.filters = filterTriples;
    }

    // Add server-side sorting - Goback format: [["field", "direction"]]
    if (sort_by && sort_order) {
      itemSpec.order_by = [[sort_by, sort_order]];
    }

    console.log("[ItemList] Filter Triples:", filterTriples);
    console.log("[ItemList] Item Spec:", itemSpec);

    const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, itemSpec);
    console.log("[ItemList] Request URL:", DATA_URL);

    const res = await fetch(DATA_URL, {
      method: "GET",
      cache: "no-store",
      headers,
    });

    if (res.ok) {
      const response = (await res.json()) as ItemAPIResponse;

      console.log("[ItemList] Full API Response:", response);

      // Parse pagination metadata - check multiple possible field names
      let totalItems =
        response.total || response.count || response.total_count || 0;
      let totalPages = 0;

      if (totalItems > 0) {
        // API returned total count
        totalPages = Math.ceil(totalItems / 20);
        console.log("[ItemList] Using API total count");
      } else if (response.data.length > 0) {
        // API didn't return total count, use optimistic pagination
        console.warn(
          "[ItemList] API did not return total count, using optimistic pagination"
        );

        if (response.data.length < 20) {
          // Less than page size means this is the last page
          totalPages = page;
          totalItems = (page - 1) * 20 + response.data.length;
          console.log("[ItemList] Last page detected (less than 20 items)");
        } else {
          // Full page (exactly 20 items), assume there might be more pages
          totalPages = page + 1; // Show "next" button
          totalItems = (page + 1) * 20; // Approximate total to show pagination
          console.log(
            "[ItemList] Full page detected, showing next page button"
          );
        }
      } else {
        totalPages = 1;
        totalItems = 0;
        console.log("[ItemList] No data");
      }

      console.log("[ItemList] Pagination metadata:", {
        totalItems,
        totalPages,
        currentPage: page,
        dataLength: response.data.length,
        responseKeys: Object.keys(response),
        usingOptimisticPagination: !response.total,
      });

      const mappedItems: Item[] = response.data.map((item) => ({
        id: item.id,
        code: item.item_code,
        item_code: item.item_code,
        name: item.item_name,
        item_name: item.item_name,
        uom: item.uom,
        group: item.item_group,
        item_group: item.item_group,
        category: item.item_category,
        generator_item: item.generator_item,
        image: getFileUrl(item.image),
        description: item.item_desc || undefined,
        item_desc: item.item_desc || undefined,
        disabled: item.disabled,
        status: item.status,
        docstatus: item.docstatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by: item.created_by,
        updated_by: item.updated_by,
        owner: item.owner,
        variants: item.variants || [],
        variantCount: item.variants ? item.variants.length : 0,
      }));

      return { items: mappedItems, totalItems, totalPages };
    }

    // Log error details for debugging
    let errorDetail = `HTTP ${res.status}`;
    try {
      const errorBody = await res.json();
      console.error("[ItemList] API Error Response:", errorBody);
      errorDetail = errorBody.message || errorBody.error || errorDetail;
    } catch {
      console.error(
        "[ItemList] API Error (no JSON body):",
        res.status,
        res.statusText
      );
    }

    // For filter/query errors (400/500), return empty object instead of throwing
    // This allows UI to show "No data found" instead of error message
    if (res.status === 400 || res.status === 500) {
      console.warn(
        "[ItemList] Filter query failed, returning empty results:",
        errorDetail
      );
      return { items: [], totalItems: 0, totalPages: 0 };
    }

    throw new Error(`Failed to fetch items (${res.status}): ${errorDetail}`);
  }

  // Sync state to URL whenever filter, sort, page, or search changes
  useEffect(() => {
    const params = buildSearchParams({
      filters,
      sortField,
      sortDirection,
      page: currentPage,
      searchQuery,
      showOnlyUnmapped,
    });

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  }, [
    filters,
    sortField,
    sortDirection,
    currentPage,
    searchQuery,
    showOnlyUnmapped,
    router,
  ]);

  // Handle filter apply
  function handleApplyFilters(newFilters: FilterTriple[]) {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }

  // Load items from API with filters and sorting
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          setLoading(false);
          return;
        }

        console.log("[ItemList] 📊 Loading data with:");
        console.log("  - Filters:", JSON.stringify(filters, null, 2));
        console.log("  - Sort:", sortField, sortDirection);
        console.log("  - Page:", currentPage);
        console.log("  - URL State Filters:", JSON.stringify(urlState.filters, null, 2));

        const {
          items: mappedItems,
          totalItems,
          totalPages,
        } = await loadAllData(filters, sortField, sortDirection, currentPage);

        if (!cancelled) {
          setItems(mappedItems);
          setTotalItems(totalItems);
          setTotalPages(totalPages);
          try {
            localStorage.setItem(SNAP_KEY, JSON.stringify(mappedItems));
          } catch (e) {
            console.error("Failed to save snapshot:", e);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError(
              "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan."
            );
          } else if (errorMessage.includes("401")) {
            setError("Session expired. Silakan login kembali.");
          } else if (errorMessage.includes("403")) {
            setError("Akses ditolak. Anda tidak memiliki izin.");
          } else {
            setError(errorMessage);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, filters, sortField, sortDirection, currentPage]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler(eventName: string) {
      if (!isAuthenticated || !token) return;

      console.log(`[ItemList] 🔄 Event triggered: ${eventName}, reloading items...`);

      try {
        const {
          items: mappedItems,
          totalItems,
          totalPages,
        } = await loadAllData(filters, sortField, sortDirection, currentPage);
        setItems(mappedItems);
        setTotalItems(totalItems);
        setTotalPages(totalPages);
        localStorage.setItem(SNAP_KEY, JSON.stringify(mappedItems));
        console.log(`[ItemList] ✅ Reload complete. Total items: ${mappedItems.length}`);
      } catch (error) {
        console.error("[ItemList] ❌ Failed to reload items:", error);
      }
    }

    const itemsHandler = () => handler("items_update");
    const variantsHandler = () => handler("variants_update");
    const productsHandler = () => handler("products_update");

    window.addEventListener("ekatalog:items_update", itemsHandler);
    window.addEventListener("ekatalog:variants_update", variantsHandler);
    window.addEventListener("ekatalog:products_update", productsHandler);

    return () => {
      window.removeEventListener("ekatalog:items_update", itemsHandler);
      window.removeEventListener("ekatalog:variants_update", variantsHandler);
      window.removeEventListener("ekatalog:products_update", productsHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, token, filters, sortField, sortDirection, currentPage]);

  function saveSnapshot(arr: Item[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:items_update"));
  }

  function promptDeleteItem(item: Item) {
    setConfirmTitle("Hapus Item");
    setConfirmDesc(`Yakin ingin menghapus item "${item.name}"?`);
    actionRef.current = async () => {
      try {
        if (!token) {
          throw new Error("Not authenticated");
        }

        const headers = getAuthHeaders(token);

        const response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.ITEM, item.id),
          {
            method: "DELETE",
            headers,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete item (${response.status})`
          );
        }

        console.log("Item deleted successfully");

        // Remove from local state
        const next = items.filter((x) => x.id !== item.id);
        setItems(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        console.error("Failed to delete item:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
      }
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  async function handleEdit(item: Item) {
    // Fetch detail item dengan branches menggunakan childs
    if (!token) return;

    try {
      const headers = getAuthHeaders(token);

      // Fetch item detail dengan childs untuk branches
      const itemDetailUrl = getQueryUrl(
        `${API_CONFIG.ENDPOINTS.ITEM}/${item.id}`,
        {
          fields: ["*"],
          childs: [
            {
              alias: "branches",
              table: "item_branches",
              fields: ["branch", "branch.id", "branch.branch_name"],
            },
          ],
        }
      );

      const itemRes = await fetch(itemDetailUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (itemRes.ok) {
        const itemResponse = await itemRes.json();
        const detailItem = itemResponse.data;

        // Map branches dari response
        let mappedBranches: { id: number; name: string }[] = [];

        if (detailItem.branches && Array.isArray(detailItem.branches)) {
          mappedBranches = detailItem.branches.map(
            (b: { branch: { id?: number; branch_name: string } }) => ({
              id: b.branch.id || 0,
              name: b.branch.branch_name,
            })
          );

          console.log("Mapped branches with names:", mappedBranches);
        }

        const itemWithBranches: Item = {
          ...item,
          branches: mappedBranches,
          panjang: detailItem.panjang,
          lebar: detailItem.lebar,
          tinggi: detailItem.tinggi,
          diameter: detailItem.diameter,
        };

        console.log("Item with branches:", itemWithBranches);

        setModalInitial(itemWithBranches);
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch item detail:", error);
      // Fallback: buka modal dengan data yang ada
      setModalInitial(item);
      setModalOpen(true);
    }
  }

  async function openDetail(item: Item) {
    // Fetch detail item dengan branches menggunakan childs
    if (!token) {
      setDetailItem(item);
      setDetailOpen(true);
      return;
    }

    try {
      const headers = getAuthHeaders(token);

      // Fetch item detail dengan childs untuk branches
      const itemDetailUrl = getQueryUrl(
        `${API_CONFIG.ENDPOINTS.ITEM}/${item.id}`,
        {
          fields: ["*"],
          childs: [
            {
              alias: "branches",
              table: "item_branches",
              fields: ["branch", "branch.id", "branch.branch_name"],
            },
          ],
        }
      );

      const itemRes = await fetch(itemDetailUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (itemRes.ok) {
        const itemResponse = await itemRes.json();
        const detailItem = itemResponse.data;

        // Map branches dari response
        let mappedBranches: { id: number; name: string }[] = [];

        if (detailItem.branches && Array.isArray(detailItem.branches)) {
          mappedBranches = detailItem.branches.map(
            (b: { branch: { id?: number; branch_name: string } }) => ({
              id: b.branch.id || 0,
              name: b.branch.branch_name,
            })
          );

          console.log("Mapped branches with names:", mappedBranches);
        }

        const itemWithBranches: Item = {
          ...item,
          branches: mappedBranches,
          panjang: detailItem.panjang,
          lebar: detailItem.lebar,
          tinggi: detailItem.tinggi,
          diameter: detailItem.diameter,
        };

        console.log("Item with branches for detail view:", itemWithBranches);

        setDetailItem(itemWithBranches);
        setDetailOpen(true);
      } else {
        // Fallback: buka modal dengan data yang ada
        setDetailItem(item);
        setDetailOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch item detail:", error);
      // Fallback: buka modal dengan data yang ada
      setDetailItem(item);
      setDetailOpen(true);
    }
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(item: Item) {
    closeDetail();
    setTimeout(() => handleEdit(item), 80);
  }

  function onDetailDelete(item: Item) {
    closeDetail();
    setTimeout(() => promptDeleteItem(item), 80);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) {
      await actionRef.current();
      actionRef.current = null;
    }
  }

  function confirmCancel() {
    actionRef.current = null;
    setConfirmOpen(false);
  }

  // Multi-select handlers
  const toggleItem = (itemId: number) => {
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedItemIds(new Set());
    setSelectionMode(false);
  };

  const handleBulkProductCreate = () => {
    if (selectedItemIds.size === 0) return;
    setBulkModalOpen(true);
  };

  const handleBulkProductSuccess = () => {
    // Clear selection after successful product creation
    clearSelection();
    // Trigger items update to refresh variant counts
    window.dispatchEvent(new Event("ekatalog:items_update"));
  };

  // Load products and categories for modals
  const loadProductsAndCategories = React.useCallback(async () => {
    if (!token) return;

    const headers = getAuthHeaders(token);

    try {
      // Load categories
      const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
        fields: ["*"],
        limit: 1000000000000,
      });
      const categoriesRes = await fetch(categoriesUrl, { headers });

      if (categoriesRes.ok) {
        const json = await categoriesRes.json();
        const categoriesData = json.data.map(
          (cat: { id: number; category_name: string }) => ({
            id: cat.id,
            name: cat.category_name,
          })
        );
        setCategoriesData(categoriesData);
      }

      // Load products
      const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, {
        fields: ["*"],
        limit: 1000000000000,
      });
      const productsRes = await fetch(productsUrl, { headers });

      if (productsRes.ok) {
        const json = await productsRes.json();
        const productsData = json.data.map(
          (p: {
            id: number;
            product_name: string;
            item_category: [];
            disabled: number;
            hot_deals: boolean;
          }) => ({
            id: p.id,
            name: p.product_name,
            itemCategory: {
              id: p.item_category,
              name: `Category ${p.item_category}`,
            },
            disabled: p.disabled,
            isHotDeals: Boolean(p.hot_deals),
          })
        );
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Failed to load products and categories:", error);
    }
  }, [token]);

  React.useEffect(() => {
    loadProductsAndCategories();
  }, [loadProductsAndCategories]);

  // Listen for product updates
  React.useEffect(() => {
    const handleProductsUpdate = () => {
      console.log("[ItemList] Products updated, refreshing products list...");
      loadProductsAndCategories();
    };

    window.addEventListener("ekatalog:products_update", handleProductsUpdate);

    return () => {
      window.removeEventListener(
        "ekatalog:products_update",
        handleProductsUpdate
      );
    };
  }, [loadProductsAndCategories]);

  // Get unique categories and UOMs for stats cards (MUST be before early returns to comply with Hooks rules)
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const uomList = Array.from(new Set(items.map((item) => item.uom)));

  // Client-side filtering for quick search (for better UX)
  // Note: With server-side pagination, client-side filters are limited to current page only
  let displayedItems = items;

  if (searchQuery.trim()) {
    displayedItems = displayedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Filter for unmapped items
  if (showOnlyUnmapped) {
    displayedItems = displayedItems.filter(
      (item) => !item.variantCount || item.variantCount === 0
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Early returns AFTER all hooks
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Diperlukan
          </h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Items. Klik
            tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaBoxOpen className="w-4 h-4" />
            <span>Data items dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat data items...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex flex-col items-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-md">
          <span className="text-sm font-medium">{error}</span>
          {error.includes("terhubung") && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Items
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola item produk dan mapping ke products
          </p>
        </div>

        <div className="flex gap-3">
          {/* Selection Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectionMode(!selectionMode);
              if (selectionMode) {
                clearSelection();
              }
            }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl shadow-lg transition-all font-medium ${
              selectionMode
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300"
            }`}
          >
            <FaCheckSquare className="w-4 h-4" />
            <span>{selectionMode ? "Cancel" : "Select Items"}</span>
          </motion.button>

          {/* Add Item Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Item</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">
            Total Items
          </div>
          <div className="text-3xl font-bold text-blue-900">{items.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">
            Categories
          </div>
          <div className="text-3xl font-bold text-green-900">
            {categories.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">Active</div>
          <div className="text-3xl font-bold text-purple-900">
            {items.filter((i) => i.disabled === 0).length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <div className="text-sm text-orange-700 font-medium mb-1">
            UOM Types
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {uomList.length}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari item, kode, atau group..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Grid View"
              >
                <FaTh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="List View"
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Advanced FilterBuilder Component */}
              <FilterBuilder
                entity="item"
                config={ITEM_FILTER_FIELDS}
                onApply={handleApplyFilters}
              />

              {/* Unmapped Items Filter */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowOnlyUnmapped(!showOnlyUnmapped)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showOnlyUnmapped
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Tampilkan hanya item yang belum dimapping"
              >
                <FaExclamationTriangle className="w-3.5 h-3.5" />
                <span>Belum Dimapping</span>
              </motion.button>

              {/* Sort Direction Button */}
              <button
                onClick={() => {
                  const newDirection = sortDirection === "asc" ? "desc" : "asc";
                  setSortDirection(newDirection);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                title={
                  sortDirection === "asc"
                    ? "Ascending (A-Z, 1-9, Oldest)"
                    : "Descending (Z-A, 9-1, Newest)"
                }
              >
                {sortDirection === "asc" ? (
                  <FaSortAmountUp className="w-3.5 h-3.5" />
                ) : (
                  <FaSortAmountDown className="w-3.5 h-3.5" />
                )}
                {/* <span>{sortDirection === "asc" ? "A-Z" : "Z-A"}</span> */}
              </button>

              {/* Sort Field Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setSortFieldDropdownOpen(!sortFieldDropdownOpen)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <span>
                    {sortField === "item_name" && "Nama Item"}
                    {sortField === "item_code" && "Kode Item"}
                    {sortField === "item_category" && "Kategori"}
                    {sortField === "created_at" && "Tanggal Dibuat"}
                    {sortField === "updated_at" && "Tanggal Diupdate"}
                  </span>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform ${
                      sortFieldDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {sortFieldDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSortFieldDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20"
                      >
                        {[
                          {
                            value: "item_name" as SortField,
                            label: "Nama Item",
                          },
                          {
                            value: "item_code" as SortField,
                            label: "Kode Item",
                          },
                          {
                            value: "item_category" as SortField,
                            label: "Kategori",
                          },
                          {
                            value: "created_at" as SortField,
                            label: "Tanggal Dibuat",
                          },
                          {
                            value: "updated_at" as SortField,
                            label: "Tanggal Diupdate",
                          },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              console.log(
                                "[ItemList] Sort field changed:",
                                sortField,
                                "->",
                                option.value
                              );
                              setSortField(option.value);
                              setSortFieldDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                              sortField === option.value
                                ? "text-red-600 bg-red-50"
                                : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Display */}
      {displayedItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada item
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada item yang ditambahkan"}
          </p>
        </div>
      ) : (
        // All items view (no grouping)
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {displayedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onEdit={() => handleEdit(item)}
                onDelete={() => promptDeleteItem(item)}
                onView={() => openDetail(item)}
                selected={selectedItemIds.has(item.id)}
                onToggleSelect={
                  selectionMode ? () => toggleItem(item.id) : undefined
                }
              />
            ))}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
            <>
              {console.log("[ItemList] Rendering Pagination with:", {
                currentPage,
                totalPages,
                totalItems,
                itemsPerPage,
              })}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </>
      )}

      {/* Floating Action Toolbar - shows when items selected */}
      <AnimatePresence>
        {selectionMode && selectedItemIds.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-2xl px-8 py-4 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-bold text-lg">
                    {selectedItemIds.size}
                  </span>
                </div>
                <span className="font-semibold">
                  {selectedItemIds.size === 1 ? "item" : "items"} selected
                </span>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSelection}
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <FaTimes className="w-4 h-4" />
                  Clear
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkProductCreate}
                  className="px-6 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                  <FaPlus className="w-4 h-4" />
                  Create Product
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AddItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
      />

      <ItemDetailModal
        open={detailOpen}
        onClose={closeDetail}
        item={detailItem}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
      />

      <BulkProductCreationModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        selectedItems={items.filter((item) => selectedItemIds.has(item.id))}
        categories={categoriesData}
        products={products}
        onSuccess={handleBulkProductSuccess}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
      />
    </div>
  );
}
