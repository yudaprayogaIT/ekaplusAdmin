// src/components/products/ProductList.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import AddProductModal from "./AddProductModal";
import ProductDetailModal from "./ProductDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  FaPlus,
  FaSearch,
  FaList,
  FaTh,
  FaFire,
  FaSortAmountUp,
  FaSortAmountDown,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { Item, Product, ProductFormData, Category } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  getQueryUrl,
  getAuthHeaders,
  getResourceUrl,
  getFileUrl,
  apiFetch,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { PRODUCT_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
import { buildSearchParams, parseSearchParams } from "@/utils/urlSync";

type SortField =
  | "product_name"
  | "item_category"
  | "created_at"
  | "updated_at"
  | "hot_deals";
type SortDirection = "asc" | "desc";

const SNAP_KEY = "ekatalog_products_snapshot";

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

// API Response Types
interface ItemApiResponse {
  id: number | string;
  item_code: string;
  item_name: string;
  uom?: string;
  item_desc?: string;
  item_category: string;
  item_group: string;
  image?: string;
  disabled: number;
  created_by: string;
  created_at: string;
}

interface ProductApiResponse {
  id: number | string;
  product_name: string;
  item_category: number | string;
  hot_deals: number;
  disabled: number;
  docstatus: number;
  status: string;
  // Catatan Aktivitas
  created_at?: string;
  created_by?: number | string | { id: number; full_name: string };
  updated_at?: string;
  updated_by?: number | string | { id: number; full_name: string };
  owner?: number | string | { id: number; full_name: string };
}

function mapItemRows(rows: ItemApiResponse[]): Item[] {
  return rows
    .map((item: ItemApiResponse): Item | null => {
      const id = toNumber(item.id);
      if (id === null) return null;
      return {
        id,
        code: item.item_code,
        name: item.item_name,
        uom: item.uom || "",
        description: item.item_desc || "",
        category: item.item_category,
        group: item.item_group,
        type: "",
        color: "",
        image: getFileUrl(item.image),
        disabled: item.disabled,
      };
    })
    .filter((item): item is Item => item !== null);
}

export default function ProductList() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  // Parse initial state from URL
  const urlState = parseSearchParams(searchParams);
  const detailIdParam = searchParams.get("id");
  const searchRouteDetailId =
    detailIdParam && /^\d+$/.test(detailIdParam) ? Number(detailIdParam) : null;
  const [routeDetailId, setRouteDetailId] = useState<number | null>(
    searchRouteDetailId,
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [staticDataLoaded, setStaticDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code?: number; message: string } | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState<SortField>(
    (urlState.sortField as SortField) || "product_name",
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    urlState.sortDirection || "asc",
  );
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlState.searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(
    urlState.searchQuery.trim(),
  );
  const [showHotDealsOnly, setShowHotDealsOnly] = useState(
    urlState.showHotDealsOnly,
  );

  // Infinite-scroll state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const itemsPerPage = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<ProductFormData | null>(
    null,
  );

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Product | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);
  const routedDetailRequestRef = useRef<number | null>(null);
  const hasLoadedOnceRef = useRef(false);
  const latestRequestRef = useRef(0);

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

  // Helper function to load products only (for pagination/sorting)
  async function loadProducts(
    filterTriples: FilterTriple[] = [],
    sort_by?: SortField,
    sort_order?: SortDirection,
    page: number = 1,
    search?: string,
    hotDealsOnly = false,
  ): Promise<{
    productsWithVariants: Product[];
    totalItems: number;
    totalPages: number;
    page: number;
  }> {
    if (!token)
      return {
        productsWithVariants: [],
        totalItems: 0,
        totalPages: 0,
        page: 1,
      };

    const headers = getAuthHeaders(token);

    // Load products from API with filters and sorting
    // Use childs to fetch variants directly with products
    const productSpec: {
      fields: string[];
      filters?: FilterTriple[];
      order_by?: [string, string][];
      limit: number;
      page: number;
      with_total: boolean;
      search?: string;
      childs?: Array<{
        alias: string;
        table: string;
        fields: string[];
      }>;
    } = {
      fields: [
        "*",
        "item_category.id",
        "item_category.category_name",
        "created_by.full_name",
        "updated_by.full_name",
        "owner.full_name",
      ],
      childs: [
        {
          alias: "variants",
          table: "ekatalog_variant",
          fields: [
            "item",
            "item.id",
            "item.item_code",
            "item.item_name",
            "item.image",
            "item.disabled",
          ],
        },
      ],
      limit: itemsPerPage,
      page: page,
      with_total: true,
    };

    const effectiveFilters = hotDealsOnly
      ? [...filterTriples, ["hot_deals", "=", 1] as FilterTriple]
      : filterTriples;
    if (effectiveFilters.length > 0) {
      productSpec.filters = effectiveFilters;
    }

    if (search) {
      productSpec.search = search;
    }

    // Server-side sorting with correct array of arrays format
    if (sort_by && sort_order) {
      productSpec.order_by = [[sort_by, sort_order]];
    }

    const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, productSpec);
    const productsRes = await apiFetch(productsUrl, {
      method: "GET",
      cache: "no-store",
      headers,
    });
    let productsWithVariants: Product[] = [];
    let totalItems = 0;
    let totalPages = 0;

    if (productsRes.ok) {
      const response = await productsRes.json();

      const responsePage = Number(response.meta?.page ?? page);
      const perPage = Number(response.meta?.per_page ?? itemsPerPage);
      totalItems = Number(
        response.meta?.total ??
          response.total ??
          response.count ??
          response.total_count ??
          0,
      );
      totalPages = Number(
        response.meta?.total_pages ??
          (totalItems > 0 ? Math.ceil(totalItems / perPage) : responsePage),
      );

      productsWithVariants = response.data
        .map(
          (
            prod: ProductApiResponse & {
              variants?: Array<{
                item: {
                  id: number | string;
                  item_code: string;
                  item_name: string;
                  image?: string;
                  disabled?: number | string;
                };
              }>;
              item_category:
                | number
                | string
                | { id?: number | string; category_name?: string };
              item_category_id?: number | string;
            },
          ) => {
            const productId = toNumber(prod.id);
            if (productId === null) {
              return null;
            }

            // Use nested category data from API if available, otherwise fallback to lookup
            let finalCategory: { id: number; name: string };

            // Type guard to check if item_category is an object with category_name
            const categoryObj =
              typeof prod.item_category === "object" &&
              prod.item_category !== null
                ? (prod.item_category as {
                    id?: number | string;
                    category_name?: string;
                  })
                : null;

            if (categoryObj && categoryObj.category_name) {
              // Category name fetched directly from API (nested object)
              finalCategory = {
                id:
                  toNumber(categoryObj.id) ??
                  toNumber(prod.item_category_id) ??
                  0,
                name: categoryObj.category_name,
              };
            } else {
              // Fallback: lookup from categories array
              const categoryId =
                typeof prod.item_category === "number"
                  ? prod.item_category
                  : typeof prod.item_category === "string"
                    ? prod.item_category
                    : prod.item_category_id;
              const normalizedCategoryId = toNumber(categoryId);

              const category = categories.find(
                (c) => c.id === normalizedCategoryId,
              );

              finalCategory = category || {
                id: normalizedCategoryId || 0,
                name: `Category ${normalizedCategoryId}`,
              };
            }

            // Transform variants from API response
            const rawVariants = (prod.variants || [])
              .map((v) => {
                const itemId = toNumber(v.item.id);
                if (itemId === null) return null;

                // Find full item data from availableItems state
                const fullItem = availableItems.find(
                  (item) => item.id === itemId,
                );

                return {
                  id: itemId, // Use item ID as variant ID for now
                  item: fullItem || {
                    id: itemId,
                    code: v.item.item_code,
                    name: v.item.item_name,
                    color: "",
                    type: "",
                    uom: "",
                    image: v.item.image ? getFileUrl(v.item.image) : undefined,
                    disabled: toNumber(v.item.disabled) ?? 0,
                  },
                  productid: productId,
                  displayOrder: 0,
                };
              })
              .filter(
                (variant): variant is NonNullable<typeof variant> =>
                  variant !== null,
              );

            // Deduplicate variants by item.id to prevent duplicate entries
            const productVariants = rawVariants.filter(
              (v, index, self) =>
                index === self.findIndex((t) => t.item.id === v.item.id),
            );

            return {
              id: productId,
              name: prod.product_name,
              itemCategory: finalCategory,
              disabled: prod.disabled,
              isHotDeals: Boolean(prod.hot_deals),
              variants: productVariants, // Variants from childs API
              // Catatan Aktivitas - extract name from nested object if available
              created_at: prod.created_at,
              created_by:
                typeof prod.created_by === "object" &&
                prod.created_by?.full_name
                  ? prod.created_by.full_name
                  : prod.created_by,
              updated_at: prod.updated_at,
              updated_by:
                typeof prod.updated_by === "object" &&
                prod.updated_by?.full_name
                  ? prod.updated_by.full_name
                  : prod.updated_by,
              owner:
                typeof prod.owner === "object" && prod.owner?.full_name
                  ? prod.owner.full_name
                  : prod.owner,
            };
          },
        )
        .filter(
          (product: Product | null): product is Product => product !== null,
        );
      return {
        productsWithVariants,
        totalItems,
        totalPages,
        page: responsePage,
      };
    }

    let errorMessage = `Gagal mengambil produk (HTTP ${productsRes.status})`;
    try {
      const errorBody = await productsRes.json();
      errorMessage = errorBody.message || errorBody.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  // Use filter system with initial filters from URL
  const { filters, setFilters } = useFilters({
    entity: "product",
    initialFilters: urlState.filters,
  });

  const loadAvailableItems = useCallback(
    async (force = false) => {
      if (!token || itemsLoading || (itemsLoaded && !force)) return;

      setItemsLoading(true);
      try {
        const headers = getAuthHeaders(token);
        const itemRows = await fetchAllQueryRows<ItemApiResponse>({
          endpoint: API_CONFIG.ENDPOINTS.ITEM,
          spec: { fields: ["*"] },
          token,
          requestInit: { headers },
        });

        setAvailableItems(mapItemRows(itemRows));
        setItemsLoaded(true);
      } catch {
        // Keep the modal usable with the variants already attached to products.
        setItemsLoaded(false);
      } finally {
        setItemsLoading(false);
      }
    },
    [itemsLoaded, itemsLoading, token],
  );

  // Sync filter, sort, and search state to URL. Loaded pages are transient.
  useEffect(() => {
    const params = buildSearchParams({
      filters,
      sortField,
      sortDirection,
      page: 1,
      searchQuery,
      showHotDealsOnly,
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
    showHotDealsOnly,
    routeDetailId,
    router,
  ]);

  const loadProductPage = useCallback(
    async (page: number, replace = false) => {
      const requestId = replace
        ? ++latestRequestRef.current
        : latestRequestRef.current;

      if (replace) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        if (!token) {
          setProducts([]);
          setHasMore(false);
          return;
        }

        const result = await loadProducts(
          filters,
          sortField,
          sortDirection,
          page,
          debouncedSearch,
          showHotDealsOnly,
        );

        // Ignore an older response if the user has already changed the query.
        if (requestId !== latestRequestRef.current) return;

        setProducts((current) => {
          const next = replace
            ? result.productsWithVariants
            : [
                ...current,
                ...result.productsWithVariants.filter(
                  (product) =>
                    !current.some((existing) => existing.id === product.id),
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
            : result.productsWithVariants.length >= itemsPerPage,
        );
      } catch (err: unknown) {
        if (requestId !== latestRequestRef.current) return;
        if (replace) setProducts([]);
        setHasMore(false);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError({ message: errorMessage });
      } finally {
        if (replace) {
          if (requestId === latestRequestRef.current) {
            hasLoadedOnceRef.current = true;
            setLoading(false);
          }
        } else {
          setLoadingMore(false);
        }
      }
    },
    // loadProducts is scoped to this component and uses the latest auth token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      debouncedSearch,
      filters,
      showHotDealsOnly,
      sortDirection,
      sortField,
      token,
    ],
  );

  // Handle filter apply
  function handleApplyFilters(newFilters: FilterTriple[]) {
    setFilters(newFilters);
  }

  // Load static category data once on mount. Items are loaded lazily when
  // the add/edit modal needs the selector data.
  useEffect(() => {
    if (!token) return;

    async function loadStatic() {
      if (!token) return;
      const headers = getAuthHeaders(token);

      // Load categories
      const categoryRows = await fetchAllQueryRows<{
        id: number | string;
        category_name: string;
      }>({
        endpoint: API_CONFIG.ENDPOINTS.CATEGORY,
        spec: { fields: ["*"] },
        token,
        requestInit: { headers },
      });
      if (categoryRows.length > 0) {
        const categoriesData = categoryRows
          .map((cat: { id: number | string; category_name: string }) => {
            const id = toNumber(cat.id);
            return id !== null ? { id, name: cat.category_name } : null;
          })
          .filter(
            (category: Category | null): category is Category =>
              category !== null,
          );
        setCategories(categoriesData);
      }

      setStaticDataLoaded(true);
    }

    loadStatic();

  }, [token]);

  useEffect(() => {
    const handleItemsUpdate = () => {
      if (itemsLoaded) {
        void loadAvailableItems(true);
      }
    };

    window.addEventListener("ekatalog:items_update", handleItemsUpdate);
    return () => {
      window.removeEventListener("ekatalog:items_update", handleItemsUpdate);
    };
  }, [itemsLoaded, loadAvailableItems]);

  // Reset the list whenever the query changes.
  useEffect(() => {
    if (!staticDataLoaded || !token) return;
    setCurrentPage(1);
    setHasMore(true);
    void loadProductPage(1, true);
  }, [loadProductPage, staticDataLoaded, token]);

  // Load the next page when the sentinel approaches the viewport.
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadProductPage(currentPage + 1, false);
        }
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPage, hasMore, loadProductPage, loading, loadingMore]);

  useEffect(() => {
    if (routeDetailId === null) {
      routedDetailRequestRef.current = null;
      setDetailOpen(false);
      setDetailItem(null);
      return;
    }
    const loaded = products.find((item) => item.id === routeDetailId);
    if (loaded) {
      setDetailItem(loaded);
      setDetailOpen(true);
      return;
    }
    if (!staticDataLoaded || !token) return;
    if (routedDetailRequestRef.current === routeDetailId) return;
    routedDetailRequestRef.current = routeDetailId;
    let cancelled = false;

    async function loadRoutedProduct() {
      const result = await loadProducts([["id", "=", routeDetailId]], undefined, undefined, 1);
      const product = result.productsWithVariants[0];
      if (!cancelled && product) {
        setDetailItem(product);
        setDetailOpen(true);
      }
    }
    void loadRoutedProduct();
    return () => {
      cancelled = true;
    };
    // loadProducts maps against the latest category/item state and is
    // intentionally invoked only once per routed ID.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, routeDetailId, staticDataLoaded, token]);

  // Listen for updates (only after static data is loaded)
  useEffect(() => {
    if (!staticDataLoaded) return;

    async function handler() {
      await loadProductPage(1, true);
    }

    window.addEventListener("ekatalog:products_update", handler);
    window.addEventListener("ekatalog:variants_update", handler);

    return () => {
      window.removeEventListener("ekatalog:products_update", handler);
      window.removeEventListener("ekatalog:variants_update", handler);
    };
  }, [loadProductPage, staticDataLoaded]);

  function saveSnapshot(arr: Product[]) {
    localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    window.dispatchEvent(new Event("ekatalog:products_update"));
  }

  function promptDeleteProduct(p: Product) {
    setConfirmTitle("Hapus Produk");
    setConfirmDesc(`Yakin ingin menghapus produk "${p.name}"?`);
    actionRef.current = async () => {
      if (!token) return;

      try {
        const headers = getAuthHeaders(token);
        const url = getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT, p.id);
        const response = await apiFetch(url, { method: "DELETE", headers });

        if (response.ok) {
          // Remove from local state
          const next = products.filter((x) => x.id !== p.id);
          setProducts(next);
          saveSnapshot(next);
        } else {
          const errorData = await response.json();
          alert(
            `Gagal menghapus produk: ${errorData.message || "Unknown error"}`,
          );
        }
      } catch {
        alert("Gagal menghapus produk. Silakan coba lagi.");
      }
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
    void loadAvailableItems();
  }

  // Convert Product (with ItemVariant[]) to ProductFormData (with Item[])
  function convertToModalFormat(p: Product): ProductFormData {
    return {
      id: p.id,
      name: p.name,
      itemCategory: p.itemCategory,
      disabled: p.disabled,
      isHotDeals: p.isHotDeals,
      variants: p.variants.map((v) => v.item), // Extract Item from ItemVariant
    };
  }

  function handleEdit(p: Product) {
    setModalInitial(convertToModalFormat(p));
    setModalOpen(true);
    void loadAvailableItems();
  }

  function openDetail(p: Product) {
    setDetailItem(p);
    setDetailOpen(true);
    setRouteDetailId(p.id);
    const params = new URLSearchParams(window.location.search);
    params.set("id", String(p.id));
    window.history.pushState(
      { ...window.history.state, ekaModalBase: "/products" },
      "",
      `${pathname}?${params.toString()}`,
    );
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
    setRouteDetailId(null);
    if (window.history.state?.ekaModalBase === "/products") {
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

  function onDetailEdit(p: Product) {
    closeDetail();
    setTimeout(() => handleEdit(p), 80);
  }

  function onDetailDelete(p: Product) {
    closeDetail();
    setTimeout(() => promptDeleteProduct(p), 80);
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

  const selectableItems = useMemo(
    () => availableItems.filter((item) => item.disabled !== 1),
    [availableItems],
  );

  // Early returns AFTER all hooks
  if (loading && !hasLoadedOnceRef.current) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const handleRetry = () => {
      setError(null);
      void loadProductPage(1, true);
    };

    return (
      <ErrorMessage
        errorCode={error.code}
        message={error.message}
        onRetry={handleRetry}
        showRetry={true}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 lg:flex lg:items-baseline lg:gap-3">
          <h1 className="mb-1 text-2xl font-bold text-gray-800 lg:mb-0">
            Products
          </h1>
          <p className="text-sm text-gray-600">
            Kelola produk dengan varian material dan furniture
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-red-200 transition-all hover:shadow-lg"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </motion.button>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          {/* Search Bar Row */}
          <div className="flex min-w-0 flex-1 gap-2">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk atau varian..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-red-100 border-t-red-500" />
              )}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-lg px-3 py-2.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Tampilan card"
                aria-label="Tampilan card"
              >
                <FaTh className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-lg px-3 py-2.5 transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                entity="product"
                config={PRODUCT_FILTER_FIELDS}
                onApply={handleApplyFilters}
                categories={categories}
                dropdownAlign="right"
              />

              {/* Hot Deals Quick Filter */}
              <button
                onClick={() => setShowHotDealsOnly(!showHotDealsOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  showHotDealsOnly
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Filter Hot Deals Only"
              >
                <FaFire className="w-4 h-4" />
                <span>Hot Deals</span>
              </button>

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
                    {sortField === "product_name" && "Nama Produk"}
                    {sortField === "item_category" && "Kategori"}
                    {sortField === "created_at" && "Tanggal Dibuat"}
                    {sortField === "updated_at" && "Tanggal Diupdate"}
                    {sortField === "hot_deals" && "Hot Deals"}
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
                            value: "product_name" as SortField,
                            label: "Nama Produk",
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
                          {
                            value: "hot_deals" as SortField,
                            label: "Hot Deals",
                          },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
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

      {/* Products Display */}
      {products.length === 0 && !hasMore ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada produk
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada produk yang ditambahkan atau coba ubah filter"}
          </p>
        </div>
      ) : (
        // All products view (no grouping)
        <>
          <div className="mb-2 text-sm text-gray-500">
            Menampilkan {products.length} dari {totalItems} produk
          </div>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                : "space-y-2"
            }
          >
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                viewMode={viewMode}
                onEdit={() => handleEdit(p)}
                onDelete={() => promptDeleteProduct(p)}
                onView={() => openDetail(p)}
              />
            ))}
          </div>

          {hasMore && (
            <div ref={loadMoreRef} className="h-8" aria-hidden="true" />
          )}
          {loadingMore && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              Semua produk sudah ditampilkan.
            </p>
          )}
        </>
      )}

      {/* Modals */}
      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
        categories={categories}
        availableItems={selectableItems}
        itemsLoading={itemsLoading}
      />

      <ProductDetailModal
        open={detailOpen}
        onClose={closeDetail}
        product={detailItem}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
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
