// src/components/items/ItemList.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ItemCard from "./ItemCard";
import AddItemModal from "./AddItemModal";
import ItemDetailModal from "./ItemDetailModal";
import BulkProductCreationModal from "@/components/variants/BulkProductCreationModal";
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
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getAuthHeaders,
  getFileUrl,
  API_CONFIG,
  apiFetch,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { ITEM_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
import { Product, Category } from "@/types";
import type {
  EntityFilterConfig,
  FieldType,
  GobackOperator,
} from "@/types/filter";
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
  subcategory?: string;
  generator_item: string;
  image?: string;
  description?: string;
  item_desc?: string;
  disabled: number;
  status: string;
  docstatus: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string | number;
  updated_by?: string | number;
  owner?: string | number;
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
  length?: string | number | null;
  width?: string | number | null;
  height?: string | number | null;
  weight?: string | number | null;
  purchasing?: string | number | null;
  standard_colly_item?: string | number | null;
  default_expense_account?: string | null;
  default_income_account?: string | null;
  ppn_name?: string | null;
  uom_ppn?: string | null;
  igen_created_by?: string | null;
  igen_updated_by?: string | null;
  last_item_updater?: string | null;
  version?: number;
  // Branches
  branches?: Array<{
    id: number;
    name: string;
  }>;
};

type ItemDetailResponse = Partial<{
  item_code: string;
  item_name: string;
  item_desc: string | null;
  item_group: string;
  item_category: string;
  item_subcategory: string;
  generator_item: string;
  uom: string;
  image: string | null;
  disabled: number;
  status: string;
  docstatus: number;
  created_at: string;
  updated_at: string;
  created_by: string | number;
  updated_by: string | number;
  owner: string | number;
  panjang: string;
  lebar: string;
  tinggi: string;
  diameter: string;
  length: string | number | null;
  width: string | number | null;
  height: string | number | null;
  weight: string | number | null;
  purchasing: string | number | null;
  standard_colly_item: string | number | null;
  default_expense_account: string | null;
  default_income_account: string | null;
  ppn_name: string | null;
  uom_ppn: string | null;
  igen_created_by: string | null;
  igen_updated_by: string | null;
  last_item_updater: string | null;
  version: number;
  branches: Array<{
    branch?: number | { id?: number; branch_name?: string };
    branch_id?: number;
    branch_name?: string;
  }>;
}>;

function enrichItemDetail(item: Item, detail: ItemDetailResponse): Item {
  const branches = Array.isArray(detail.branches)
    ? detail.branches
        .map((row) => {
          const nested =
            typeof row.branch === "object" && row.branch !== null
              ? row.branch
              : undefined;
          const id =
            nested?.id ??
            row.branch_id ??
            (typeof row.branch === "number" ? row.branch : 0);
          return {
            id,
            name: nested?.branch_name ?? row.branch_name ?? `Cabang #${id}`,
          };
        })
        .filter((branch) => branch.id > 0)
    : item.branches || [];

  return {
    ...item,
    code: detail.item_code ?? item.code,
    item_code: detail.item_code ?? item.item_code,
    name: detail.item_name ?? item.name,
    item_name: detail.item_name ?? item.item_name,
    description: detail.item_desc ?? item.description,
    item_desc: detail.item_desc ?? item.item_desc,
    group: detail.item_group ?? item.group,
    item_group: detail.item_group ?? item.item_group,
    category: detail.item_category ?? item.category,
    subcategory: detail.item_subcategory ?? item.subcategory,
    generator_item: detail.generator_item ?? item.generator_item,
    uom: detail.uom ?? item.uom,
    image: detail.image !== undefined ? getFileUrl(detail.image) : item.image,
    disabled: detail.disabled ?? item.disabled,
    status: detail.status ?? item.status,
    docstatus: detail.docstatus ?? item.docstatus,
    created_at: detail.created_at ?? item.created_at,
    updated_at: detail.updated_at ?? item.updated_at,
    created_by: detail.created_by ?? item.created_by,
    updated_by: detail.updated_by ?? item.updated_by,
    owner: detail.owner ?? item.owner,
    panjang: detail.panjang ?? item.panjang,
    lebar: detail.lebar ?? item.lebar,
    tinggi: detail.tinggi ?? item.tinggi,
    diameter: detail.diameter ?? item.diameter,
    length: detail.length ?? item.length,
    width: detail.width ?? item.width,
    height: detail.height ?? item.height,
    weight: detail.weight ?? item.weight,
    purchasing: detail.purchasing ?? item.purchasing,
    standard_colly_item: detail.standard_colly_item ?? item.standard_colly_item,
    default_expense_account:
      detail.default_expense_account ?? item.default_expense_account,
    default_income_account:
      detail.default_income_account ?? item.default_income_account,
    ppn_name: detail.ppn_name ?? item.ppn_name,
    igen_created_by: detail.igen_created_by ?? item.igen_created_by,
    igen_updated_by: detail.igen_updated_by ?? item.igen_updated_by,
    last_item_updater: detail.last_item_updater ?? item.last_item_updater,
    version: detail.version ?? item.version,
    branches,
  };
}

// API Response structure
type ItemAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name?: string;
    item_name: string;
    item_code: string;
    item_desc?: string | null;
    item_group: string;
    item_category: string;
    generator_item?: string;
    uom?: string;
    image: string | null;
    disabled: number;
    status?: string;
    docstatus?: number;
    created_at?: string;
    updated_at?: string;
    created_by?: number | { id?: number; full_name?: string };
    updated_by?: number | { id?: number; full_name?: string };
    owner?: number | { id?: number; full_name?: string };
    variants?: Array<{
      id: number;
      parent_id: number;
      item: number;
    }>;
  }>;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
    [key: string]: unknown;
  };
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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuth();

  // Parse initial state from URL
  const urlState = parseSearchParams(searchParams);
  const detailIdParam = searchParams.get("id");
  const searchRouteDetailId =
    detailIdParam && /^\d+$/.test(detailIdParam) ? Number(detailIdParam) : null;
  const [routeDetailId, setRouteDetailId] = useState<number | null>(
    searchRouteDetailId,
  );

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(urlState.searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(
    urlState.searchQuery.trim(),
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState<SortField>(
    (urlState.sortField as SortField) || "created_at",
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    urlState.sortDirection || "desc",
  );
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [showOnlyUnmapped, setShowOnlyUnmapped] = useState(
    urlState.showOnlyUnmapped,
  );

  // Infinite-scroll state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 20;

  const [modalOpen, setModalOpen] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Item | null>(null);

  // Multi-select state for mapping to products
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
    new Set(),
  );
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const routedDetailRequestRef = useRef<number | null>(null);

  // Products and categories for BulkProductCreationModal
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);

  // Use filter system with initial filters from URL
  const { filters, setFilters } = useFilters({
    entity: "item",
    initialFilters: urlState.filters,
  });

  useEffect(() => {
    setRouteDetailId(searchRouteDetailId);
  }, [searchRouteDetailId]);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      300,
    );
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const syncRouteFromBrowser = () => {
      const id = new URLSearchParams(window.location.search).get("id");
      setRouteDetailId(id && /^\d+$/.test(id) ? Number(id) : null);
    };
    window.addEventListener("popstate", syncRouteFromBrowser);
    return () => window.removeEventListener("popstate", syncRouteFromBrowser);
  }, []);

  const itemFilterConfig: EntityFilterConfig = useMemo(() => {
    const categoryOptions = Array.from(
      new Set(
        categoriesData
          .map((c) => c.name)
          .filter((name) => typeof name === "string" && name.trim() !== ""),
      ),
    ).map((name) => ({ value: name, label: name }));

    return {
      ...ITEM_FILTER_FIELDS,
      fields: ITEM_FILTER_FIELDS.fields.map((field) => {
        if (field.field !== "item_category") return field;
        return {
          ...field,
          type: "select" as FieldType,
          operators: ["=", "!=", "in", "not in"] as GobackOperator[],
          options: categoryOptions,
        };
      }),
    };
  }, [categoriesData]);

  // Watch for URL changes and update filters accordingly
  useEffect(() => {
    const newUrlState = parseSearchParams(searchParams);

    // Only update if filters actually changed
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(newUrlState.filters);

    if (filtersChanged && newUrlState.filters.length > 0) {
      setFilters(newUrlState.filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams to avoid infinite loop

  // Helper function to load data with filters and sorting
  async function loadAllData(
    filterTriples: FilterTriple[] = [],
    sort_by?: SortField,
    sort_order?: SortDirection,
    page: number = 1,
    search?: string,
  ): Promise<{
    items: Item[];
    totalItems: number;
    totalPages: number;
    page: number;
  }> {
    if (!token) return { items: [], totalItems: 0, totalPages: 0, page: 1 };

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
      with_total: boolean;
      search?: string;
      childs?: ChildQuerySpec[];
    } = {
      fields: [
        "id",
        "image",
        "item_code",
        "item_name",
        "item_category",
        "item_group",
        "disabled",
      ],
      limit: itemsPerPage,
      page: page,
      with_total: true,
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

    if (search) {
      itemSpec.search = search;
    }

    // Add server-side sorting - Goback format: [["field", "direction"]]
    if (sort_by && sort_order) {
      itemSpec.order_by = [[sort_by, sort_order]];
    }

    const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, itemSpec);

    const res = await apiFetch(DATA_URL, {
      method: "GET",
      cache: "no-store",
      headers,
    });

    if (res.ok) {
      const response = (await res.json()) as ItemAPIResponse;

      const responsePage = Number(response.meta?.page ?? page);
      const perPage = Number(response.meta?.per_page ?? itemsPerPage);
      const totalItems = Number(
        response.meta?.total ??
          response.total ??
          response.count ??
          response.total_count ??
          0,
      );
      const totalPages = Number(
        response.meta?.total_pages ??
          (totalItems > 0 ? Math.ceil(totalItems / perPage) : responsePage),
      );

      // console.log("[ItemList] Pagination metadata:", {
      //   totalItems,
      //   totalPages,
      //   currentPage: page,
      //   dataLength: response.data.length,
      //   responseKeys: Object.keys(response),
      //   usingOptimisticPagination: !response.total,
      // });

      const mappedItems: Item[] = response.data.map((item) => ({
        id: item.id,
        code: item.item_code,
        item_code: item.item_code,
        name: item.item_name,
        item_name: item.item_name,
        uom: item.uom || "",
        group: item.item_group,
        item_group: item.item_group,
        category: item.item_category,
        generator_item: item.generator_item || "",
        image: getFileUrl(item.image),
        description: item.item_desc || undefined,
        item_desc: item.item_desc || undefined,
        disabled: item.disabled,
        status: item.disabled === 0 ? "Aktif" : "Nonaktif",
        docstatus: item.docstatus ?? 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
        created_by:
          typeof item.created_by === "object"
            ? item.created_by.full_name || "Unknown"
            : item.created_by,
        updated_by:
          typeof item.updated_by === "object"
            ? item.updated_by.full_name || "Unknown"
            : item.updated_by,
        owner:
          typeof item.owner === "object"
            ? item.owner.full_name || "Unknown"
            : item.owner,
        variants: item.variants || [],
        variantCount: item.variants ? item.variants.length : 0,
      }));

      return {
        items: mappedItems,
        totalItems,
        totalPages,
        page: responsePage,
      };
    }

    // Log error details for debugging
    let errorDetail = `HTTP ${res.status}`;
    try {
      const errorBody = await res.json();
      // console.error("[ItemList] API Error Response:", errorBody);
      errorDetail = errorBody.message || errorBody.error || errorDetail;
    } catch {
      // console.error(
      //   "[ItemList] API Error (no JSON body):",
      //   res.status,
      //   res.statusText
      // );
    }

    throw new Error(`Failed to fetch items (${res.status}): ${errorDetail}`);
  }

  // Sync filter, sort, and search state to URL. Loaded pages are transient.
  useEffect(() => {
    const params = buildSearchParams({
      filters,
      sortField,
      sortDirection,
      page: 1,
      searchQuery,
      showOnlyUnmapped,
    });
    if (routeDetailId !== null) {
      params.set("id", String(routeDetailId));
    }

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  }, [
    filters,
    sortField,
    sortDirection,
    searchQuery,
    showOnlyUnmapped,
    routeDetailId,
    router,
  ]);

  // Handle filter apply
  function handleApplyFilters(newFilters: FilterTriple[]) {
    setFilters(newFilters);
  }

  const loadItems = useCallback(
    async (page: number, replace = false) => {
      if (replace) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        if (!isAuthenticated || !token) {
          setItems([]);
          setHasMore(false);
          return;
        }

        const result = await loadAllData(
          filters,
          sortField,
          sortDirection,
          page,
          debouncedSearch,
        );

        setItems((current) => {
          const next = replace
            ? result.items
            : [
                ...current,
                ...result.items.filter(
                  (item) =>
                    !current.some((existing) => existing.id === item.id),
                ),
              ];
          try {
            localStorage.setItem(SNAP_KEY, JSON.stringify(next));
          } catch {}
          return next;
        });
        setTotalItems(result.totalItems);
        setCurrentPage(result.page);
        setHasMore(
          result.totalPages > 0
            ? result.page < result.totalPages
            : result.items.length >= itemsPerPage,
        );
      } catch (err: unknown) {
        if (replace) setItems([]);
        setHasMore(false);
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes("Failed to fetch")) {
          setError(
            "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan.",
          );
        } else if (errorMessage.includes("401")) {
          setError("Session expired. Silakan login kembali.");
        } else if (errorMessage.includes("403")) {
          setError("Akses ditolak. Anda tidak memiliki izin.");
        } else {
          setError(errorMessage);
        }
      } finally {
        if (replace) setLoading(false);
        else setLoadingMore(false);
      }
    },
    // loadAllData is scoped to this component and uses the latest auth token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      debouncedSearch,
      filters,
      isAuthenticated,
      sortDirection,
      sortField,
      token,
    ],
  );

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    void loadItems(1, true);
  }, [loadItems]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadItems(currentPage + 1, false);
        }
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPage, hasMore, loadItems, loading, loadingMore]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        await loadItems(1, true);
      } catch {
        // console.error("[ItemList] ❌ Failed to reload items:", error);
      }
    }

    const itemsHandler = () => handler();
    const variantsHandler = () => handler();
    const productsHandler = () => handler();

    window.addEventListener("ekatalog:items_update", itemsHandler);
    window.addEventListener("ekatalog:variants_update", variantsHandler);
    window.addEventListener("ekatalog:products_update", productsHandler);

    return () => {
      window.removeEventListener("ekatalog:items_update", itemsHandler);
      window.removeEventListener("ekatalog:variants_update", variantsHandler);
      window.removeEventListener("ekatalog:products_update", productsHandler);
    };
  }, [isAuthenticated, loadItems, token]);

  function handleAdd() {
    setModalOpen(true);
  }

  async function openDetail(item: Item, updateRoute = true) {
    if (updateRoute) {
      setRouteDetailId(item.id);
      const params = new URLSearchParams(window.location.search);
      params.set("id", String(item.id));
      window.history.pushState(
        { ...window.history.state, ekaModalBase: "/items" },
        "",
        `${pathname}?${params.toString()}`,
      );
    }

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
        },
      );

      const itemRes = await apiFetch(itemDetailUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (itemRes.ok) {
        const itemResponse = await itemRes.json();
        const detailItem = itemResponse.data;

        const itemWithBranches = enrichItemDetail(item, detailItem);

        setDetailItem(itemWithBranches);
        setDetailOpen(true);
      } else {
        // Fallback: buka modal dengan data yang ada
        setDetailItem(item);
        setDetailOpen(true);
      }
    } catch {
      // console.error("Failed to fetch item detail:", error);
      // Fallback: buka modal dengan data yang ada
      setDetailItem(item);
      setDetailOpen(true);
    }
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
    setRouteDetailId(null);
    if (window.history.state?.ekaModalBase === "/items") {
      window.history.back();
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.delete("id");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  useEffect(() => {
    if (routeDetailId === null) {
      routedDetailRequestRef.current = null;
      setDetailOpen(false);
      setDetailItem(null);
      return;
    }

    const loaded = items.find((item) => item.id === routeDetailId);
    if (loaded) {
      if (detailItem?.id !== loaded.id || !detailOpen) {
        void openDetail(loaded, false);
      }
      return;
    }

    if (!isAuthenticated || !token) return;
    if (routedDetailRequestRef.current === routeDetailId) return;
    routedDetailRequestRef.current = routeDetailId;
    let cancelled = false;

    async function loadRoutedItem() {
      try {
        const result = await loadAllData(
          [["id", "=", routeDetailId]],
          undefined,
          undefined,
          1,
        );
        const item = result.items.find((row) => row.id === routeDetailId);
        if (!cancelled && item) {
          await openDetail(item, false);
        }
      } catch {
        // The list error state remains responsible for API error feedback.
      }
    }

    void loadRoutedItem();
    return () => {
      cancelled = true;
    };
    // openDetail/loadAllData intentionally use the current auth and route state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    detailItem?.id,
    detailOpen,
    isAuthenticated,
    items,
    routeDetailId,
    token,
  ]);

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
      const categoryRows = await fetchAllQueryRows<{
        id: number;
        category_name: string;
      }>({
        endpoint: API_CONFIG.ENDPOINTS.CATEGORY,
        spec: { fields: ["*"] },
        token,
        requestInit: { headers },
      });

      if (categoryRows.length > 0) {
        const categoriesData = categoryRows.map(
          (cat: { id: number; category_name: string }) => ({
            id: cat.id,
            name: cat.category_name,
          }),
        );
        setCategoriesData(categoriesData);
      }

      // Load products
      const productRows = await fetchAllQueryRows<{
        id: number;
        product_name: string;
        item_category: number;
        disabled: number;
        hot_deals: boolean;
      }>({
        endpoint: API_CONFIG.ENDPOINTS.PRODUCT,
        spec: { fields: ["*"] },
        token,
        requestInit: { headers },
      });

      if (productRows.length > 0) {
        const productsData = productRows.map(
          (p: {
            id: number;
            product_name: string;
            item_category: number;
            disabled: number;
            hot_deals: boolean;
          }) => ({
            id: p.id,
            name: p.product_name,
            itemCategory: {
              id: p.item_category,
              name: `Category ${p.item_category}`,
            },
            variants: [],
            disabled: p.disabled,
            isHotDeals: Boolean(p.hot_deals),
          }),
        );
        setProducts(productsData);
      }
    } catch {
      // console.error("Failed to load products and categories:", error);
    }
  }, [token]);

  React.useEffect(() => {
    loadProductsAndCategories();
  }, [loadProductsAndCategories]);

  // Listen for product updates
  React.useEffect(() => {
    const handleProductsUpdate = () => {
      loadProductsAndCategories();
    };

    window.addEventListener("ekatalog:products_update", handleProductsUpdate);

    return () => {
      window.removeEventListener(
        "ekatalog:products_update",
        handleProductsUpdate,
      );
    };
  }, [loadProductsAndCategories]);

  // Filtering for mapping status remains client-side because it uses child data.
  let displayedItems = items;

  // Filter for unmapped items
  if (showOnlyUnmapped) {
    displayedItems = displayedItems.filter(
      (item) => !item.variantCount || item.variantCount === 0,
    );
  }

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

  if (loading && items.length === 0) {
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
      <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 lg:flex lg:items-baseline lg:gap-3">
          <h1 className="mb-1 text-2xl font-bold text-gray-800 lg:mb-0">
            Items
          </h1>
          <p className="text-sm text-gray-600">
            Kelola item produk dan mapping ke products
          </p>
        </div>

        <div className="flex gap-2">
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
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-md transition-all ${
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
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-red-200 transition-all hover:shadow-lg"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Item</span>
          </motion.button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          {/* Search Row */}
          <div className="flex min-w-0 flex-1 gap-2">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari item, kode, atau group..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg px-3 py-2.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Tampilan card"
                aria-label="Tampilan card"
              >
                <FaTh className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-lg px-3 py-2.5 transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Tampilan list"
                aria-label="Tampilan list"
              >
                <FaList className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 xl:flex-none">
            <div className="flex flex-wrap items-center gap-2">
              {/* Advanced FilterBuilder Component */}
              <FilterBuilder
                entity="item"
                config={itemFilterConfig}
                onApply={handleApplyFilters}
                dropdownAlign="right"
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
                              // console.log(
                              //   "[ItemList] Sort field changed:",
                              //   sortField,
                              //   "->",
                              //   option.value
                              // );
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
      {displayedItems.length === 0 && !hasMore ? (
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
          {viewMode === "list" ? (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <div className="grid min-w-[920px] grid-cols-[minmax(260px,2fr)_110px_minmax(150px,1fr)_minmax(190px,1.2fr)_minmax(180px,1fr)] items-center gap-4 bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>Nama Item</span>
                  <span>Status</span>
                  <span>Kategori</span>
                  <span>Item Group</span>
                  <span className="flex items-center justify-between gap-3">
                    <span>Kode Item</span>
                    <span className="whitespace-nowrap text-[11px] font-medium normal-case tracking-normal text-gray-400">
                      {items.length} dari {totalItems}
                    </span>
                  </span>
                </div>
                <div>
                  {displayedItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      viewMode="list"
                      onView={() => openDetail(item)}
                      selected={selectedItemIds.has(item.id)}
                      onToggleSelect={
                        selectionMode ? () => toggleItem(item.id) : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-2 text-sm text-gray-500">
                Menampilkan {items.length} dari {totalItems} item
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {displayedItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    viewMode="grid"
                    onView={() => openDetail(item)}
                    selected={selectedItemIds.has(item.id)}
                    onToggleSelect={
                      selectionMode ? () => toggleItem(item.id) : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}

          {hasMore && (
            <div ref={loadMoreRef} className="h-8" aria-hidden="true" />
          )}
          {loadingMore && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
            </div>
          )}
          {!hasMore && items.length > 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              Semua item sudah ditampilkan.
            </p>
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
        initial={null}
      />

      <ItemDetailModal
        open={detailOpen}
        onClose={closeDetail}
        item={detailItem}
      />

      <BulkProductCreationModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        selectedItems={items.filter((item) => selectedItemIds.has(item.id))}
        categories={categoriesData}
        products={products}
        onSuccess={handleBulkProductSuccess}
      />
    </div>
  );
}
