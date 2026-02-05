// src/components/products/ProductList.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import ProductCard from "./ProductCard";
import AddProductModal from "./AddProductModal";
import ProductDetailModal from "./ProductDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
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
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import type {
  Item,
  Product,
  ProductFormData,
  Category,
} from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  getQueryUrl,
  getAuthHeaders,
  getResourceUrl,
  getFileUrl,
  apiFetch,
} from "@/config/api";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { PRODUCT_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
import {
  buildSearchParams,
  parseSearchParams,
} from "@/utils/urlSync";

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
  item_desc?: string;
  item_category: string;
  item_group: string;
  ekatalog_type: string;
  item_color: string;
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

export default function ProductList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  // Parse initial state from URL
  const urlState = parseSearchParams(searchParams);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [staticDataLoaded, setStaticDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code?: number; message: string } | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState<SortField>(
    (urlState.sortField as SortField) || "product_name"
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    urlState.sortDirection || "asc"
  );
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlState.searchQuery);
  const [showHotDealsOnly, setShowHotDealsOnly] = useState(
    urlState.showHotDealsOnly
  );

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(urlState.page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<ProductFormData | null>(
    null
  );

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Product | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Track if this is initial mount to prevent resetting page on first load
  const isInitialMount = useRef(true);

  // Helper function to load products only (for pagination/sorting)
  async function loadProducts(
    filterTriples: FilterTriple[] = [],
    sort_by?: SortField,
    sort_order?: SortDirection,
    page: number = 1
  ): Promise<{
    productsWithVariants: Product[];
    totalItems: number;
    totalPages: number;
  }> {
    if (!token)
      return { productsWithVariants: [], totalItems: 0, totalPages: 0 };

    const headers = getAuthHeaders(token);

    // Load products from API with filters and sorting
    // Use childs to fetch variants directly with products
    const productSpec: {
      fields: string[];
      filters?: FilterTriple[];
      order_by?: [string, string][];
      limit: number;
      page: number;
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
          ],
        },
      ],
      limit: 20,
      page: page,
    };

    if (filterTriples.length > 0) {
      productSpec.filters = filterTriples;
    }

    // Server-side sorting with correct array of arrays format
    if (sort_by && sort_order) {
      productSpec.order_by = [[sort_by, sort_order]];
    }

    // console.log("[ProductList] Filter Triples:", filterTriples);
    // console.log("[ProductList] Product Spec:", productSpec);

    const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, productSpec);
    // console.log("[ProductList] Request URL:", productsUrl);
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

      // console.log("[ProductList] Full API Response:", response);

      // Parse pagination metadata - check multiple possible field names
      totalItems =
        response.total || response.count || response.total_count || 0;

      if (totalItems > 0) {
        // API returned total count
        totalPages = Math.ceil(totalItems / 20);
        // console.log("[ProductList] Using API total count");
      } else if (response.data.length > 0) {
        // API didn't return total count, use optimistic pagination
        console.warn(
          "[ProductList] API did not return total count, using optimistic pagination"
        );

        if (response.data.length < 20) {
          // Less than page size means this is the last page
          totalPages = page;
          totalItems = (page - 1) * 20 + response.data.length;
          // console.log("[ProductList] Last page detected (less than 20 items)");
        } else {
          // Full page (exactly 20 items), assume there might be more pages
          totalPages = page + 1; // Show "next" button
          totalItems = (page + 1) * 20; // Approximate total to show pagination
          // console.log("[ProductList] Full page detected, showing next page button");
        }
      } else {
        totalPages = 1;
        totalItems = 0;
        // console.log("[ProductList] No data");
      }

      console.log("[ProductList] Pagination metadata:", {
        totalItems,
        totalPages,
        currentPage: page,
        dataLength: response.data.length,
        responseKeys: Object.keys(response),
        usingOptimisticPagination: !response.total,
      });

      // console.log("=== PRODUCT LIST - VARIANT LOADING DEBUG ===");
      // console.log("Total products loaded:", response.data.length);

      // // Debug first product
      // if (response.data.length > 0) {
      //   console.log("First product raw:", response.data[0]);
      //   console.log("First product variants:", response.data[0].variants);
      // }

      productsWithVariants = response.data.map(
        (
          prod: ProductApiResponse & {
            variants?: Array<{
              item: {
                id: number | string;
                item_code: string;
                item_name: string;
                image?: string;
              };
            }>;
            item_category:
              | number
              | string
              | { id?: number | string; category_name?: string };
            item_category_id?: number | string;
          }
        ) => {
          const productId = toNumber(prod.id);
          if (productId === null) {
            console.warn(
              `[ProductList] Invalid product id received: ${prod.id}. Product skipped.`
            );
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
              id: toNumber(categoryObj.id) ?? toNumber(prod.item_category_id) ?? 0,
              name: categoryObj.category_name,
            };
            console.log(
              `[ProductList] Using nested category from API: ${finalCategory.name} (ID: ${finalCategory.id})`
            );
          } else {
            // Fallback: lookup from categories array
            const categoryId =
              typeof prod.item_category === "number"
                ? prod.item_category
                : typeof prod.item_category === "string"
                  ? prod.item_category
                  : prod.item_category_id;
            const normalizedCategoryId = toNumber(categoryId);
            console.log(
              `[ProductList] Looking for category ID ${normalizedCategoryId} in ${categories.length} categories`
            );
            const category = categories.find(
              (c) => c.id === normalizedCategoryId
            );

            if (!category) {
              console.warn(
                `[ProductList] Category ${normalizedCategoryId} not found! Using fallback. Available categories:`,
                categories.map((c) => ({ id: c.id, name: c.name }))
              );
            }

            finalCategory = category || {
              id: normalizedCategoryId || 0,
              name: `Category ${normalizedCategoryId}`,
            };
          }

          // Transform variants from API response
          const rawVariants = (prod.variants || []).map((v) => {
            const itemId = toNumber(v.item.id);
            if (itemId === null) return null;

            // Find full item data from availableItems state
            const fullItem = availableItems.find(
              (item) => item.id === itemId
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
                disabled: 0,
              },
              productid: productId,
              displayOrder: 0,
            };
          }).filter((variant): variant is NonNullable<typeof variant> => variant !== null);

          // Deduplicate variants by item.id to prevent duplicate entries
          const productVariants = rawVariants.filter(
            (v, index, self) => index === self.findIndex((t) => t.item.id === v.item.id)
          );

          // Log warning if duplicates found
          if (rawVariants.length !== productVariants.length) {
            console.warn(
              `[ProductList] Product ${prod.id} (${prod.product_name}) has duplicate variants!`,
              `Raw: ${rawVariants.length}, Unique: ${productVariants.length}`
            );
          }

          // Debug: Log first product with details
          if (prod.id === response.data[0]?.id) {
            console.log("=== FIRST PRODUCT DETAILS ===");
            console.log("Product ID:", productId);
            console.log("Product Name:", prod.product_name);
            console.log("Raw variants from API:", prod.variants);
            console.log("Transformed variants:", productVariants);
          }

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
              typeof prod.created_by === "object" && prod.created_by?.full_name
                ? prod.created_by.full_name
                : prod.created_by,
            updated_at: prod.updated_at,
            updated_by:
              typeof prod.updated_by === "object" && prod.updated_by?.full_name
                ? prod.updated_by.full_name
                : prod.updated_by,
            owner:
              typeof prod.owner === "object" && prod.owner?.full_name
                ? prod.owner.full_name
                : prod.owner,
          };
        }
      ).filter((product: Product | null): product is Product => product !== null);

      console.log("=== FINAL PRODUCTS WITH VARIANTS ===");
      productsWithVariants.forEach((p) => {
        console.log(
          `Product ID ${p.id}: "${p.name}" - ${p.variants.length} variants`
        );
      });
    } else {
      // Log error details for debugging
      let errorDetail = `HTTP ${productsRes.status}`;
      try {
        const errorBody = await productsRes.json();
        console.error("[ProductList] API Error Response:", errorBody);
        errorDetail = errorBody.message || errorBody.error || errorDetail;
      } catch {
        console.error(
          "[ProductList] API Error (no JSON body):",
          productsRes.status,
          productsRes.statusText
        );
      }

      // For filter/query errors (400/500), just log and return empty array
      // This allows UI to show "No data found" instead of error message
      if (productsRes.status === 400 || productsRes.status === 500) {
        console.warn(
          "[ProductList] Filter query failed, returning empty results:",
          errorDetail
        );
      }
    }

    return { productsWithVariants, totalItems, totalPages };
  }

  // Use filter system with initial filters from URL
  const { filters, setFilters } = useFilters({
    entity: "product",
    initialFilters: urlState.filters,
  });

  // Sync state to URL whenever filter, sort, page, or search changes
  useEffect(() => {
    const params = buildSearchParams({
      filters,
      sortField,
      sortDirection,
      page: currentPage,
      searchQuery,
      showHotDealsOnly,
    });

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  }, [
    filters,
    sortField,
    sortDirection,
    currentPage,
    searchQuery,
    showHotDealsOnly,
    router,
  ]);

  // Function to load data with filters (wrapped in useCallback to fix warning)
  const loadDataWithFilters = useCallback(
    async (filterTriples: FilterTriple[] = [], page: number = 1) => {
      setLoading(true);
      setError(null);
      try {
        console.log(
          "[ProductList] Loading data with server-side sort and pagination:",
          sortField,
          sortDirection,
          "page:",
          page
        );
        const { productsWithVariants, totalItems, totalPages } =
          await loadProducts(filterTriples, sortField, sortDirection, page);

        setProducts(productsWithVariants);
        setTotalItems(totalItems);
        setTotalPages(totalPages);
        localStorage.setItem(SNAP_KEY, JSON.stringify(productsWithVariants));

        // Mark initial mount as complete after first successful load
        if (isInitialMount.current) {
          isInitialMount.current = false;
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError({ message: errorMessage });
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, sortField, sortDirection]
  );

  // Handle filter apply
  function handleApplyFilters(newFilters: FilterTriple[]) {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    // Reload data when filters are applied
    loadDataWithFilters(newFilters, 1);
  }

  // Load static data (categories and items) once on mount
  useEffect(() => {
    if (!token) return;

    async function loadStatic() {
      console.log("[ProductList] Loading static data (categories & items)...");
      // Inline load to avoid dependency issues
      if (!token) return;
      const headers = getAuthHeaders(token);

      // Load categories
      const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
        fields: ["*"],
        limit: 1000,
      });
      const categoriesRes = await apiFetch(categoriesUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });
      if (categoriesRes.ok) {
        const response = await categoriesRes.json();
        const categoriesData = response.data.map(
          (cat: { id: number | string; category_name: string }) => {
            const id = toNumber(cat.id);
            return id !== null ? { id, name: cat.category_name } : null;
          }
        ).filter((category: Category | null): category is Category => category !== null);
        setCategories(categoriesData);
        console.log("[ProductList] Categories loaded:", categoriesData.length);
      }

      // Load items (including disabled) so mapped variants can still be resolved
      const itemsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, {
        fields: ["*"],
        limit: 10000,
      });
      const itemsRes = await apiFetch(itemsUrl, {
        method: "GET",
        cache: "no-store",
        headers,
      });
      if (itemsRes.ok) {
        const response = await itemsRes.json();
        const itemsData = response.data
          .map((item: ItemApiResponse) => {
            const id = toNumber(item.id);
            if (id === null) return null;
            return {
              id,
              code: item.item_code,
              name: item.item_name,
              description: item.item_desc || "",
              category: item.item_category,
              group: item.item_group,
              type: item.ekatalog_type,
              color: item.item_color,
              image: getFileUrl(item.image),
              disabled: item.disabled,
              created_by: item.created_by,
            };
          })
          .filter((item: Item | null): item is Item => item !== null);
        setAvailableItems(itemsData);
        console.log("[ProductList] Items loaded:", itemsData.length);
      }

      // Mark static data as loaded
      setStaticDataLoaded(true);
      console.log("[ProductList] Static data loading complete");
    }

    loadStatic();

    // Reload items when they're updated
    const handleItemsUpdate = () => {
      console.log("[ProductList] Items updated, reloading static data...");
      loadStatic();
    };

    window.addEventListener("ekatalog:items_update", handleItemsUpdate);
    return () => {
      window.removeEventListener("ekatalog:items_update", handleItemsUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Initial load with filters from URL/localStorage (only after static data is loaded)
  useEffect(() => {
    if (!staticDataLoaded || !token) return;

    let cancelled = false;

    async function load() {
      if (!cancelled) {
        console.log("[ProductList] Static data ready, loading products...");
        await loadDataWithFilters(filters, currentPage);
      }
    }

    if (token) {
      load();
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticDataLoaded, token, filters, currentPage]);

  // Reload data when sort changes (only after static data is loaded, but not on initial mount)
  useEffect(() => {
    if (staticDataLoaded && token && !isInitialMount.current) {
      console.log(
        "[ProductList] Sort changed, reloading data with:",
        sortField,
        sortDirection
      );
      setCurrentPage(1); // Reset to first page when sort changes
      loadDataWithFilters(filters, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticDataLoaded, sortField, sortDirection]);

  // Listen for updates (only after static data is loaded)
  useEffect(() => {
    if (!staticDataLoaded) return;

    async function handler() {
      console.log(
        "[ProductList] 🔄 Event triggered: products_update or variants_update"
      );
      console.log("[ProductList] Reloading data with filters:", filters);
      console.log(
        "[ProductList] Reloading data with sort:",
        sortField,
        sortDirection
      );
      console.log("[ProductList] Reloading data with page:", currentPage);
      try {
        const { productsWithVariants, totalItems, totalPages } =
          await loadProducts(filters, sortField, sortDirection, currentPage);
        console.log(
          "[ProductList] ✅ Reload complete. Total products:",
          productsWithVariants.length
        );
        setProducts(productsWithVariants);
        setTotalItems(totalItems);
        setTotalPages(totalPages);
        localStorage.setItem(SNAP_KEY, JSON.stringify(productsWithVariants));
      } catch (error) {
        console.error("[ProductList] ❌ Reload failed:", error);
      }
    }

    window.addEventListener("ekatalog:products_update", handler);
    window.addEventListener("ekatalog:variants_update", handler);

    return () => {
      window.removeEventListener("ekatalog:products_update", handler);
      window.removeEventListener("ekatalog:variants_update", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticDataLoaded, filters, sortField, sortDirection, currentPage]);

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
            `Gagal menghapus produk: ${errorData.message || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Gagal menghapus produk. Silakan coba lagi.");
      }
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
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
  }

  function openDetail(p: Product) {
    setDetailItem(p);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
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

  // Client-side filtering for quick search and hot deals
  // Note: With server-side pagination, client-side filters are limited to current page only
  let displayedProducts = products;
  const selectableItems = useMemo(
    () => availableItems.filter((item) => item.disabled !== 1),
    [availableItems]
  );

  // Quick search filter (client-side for better UX, limited to current page)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    displayedProducts = displayedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.variants.some((v) => v.item.name.toLowerCase().includes(query))
    );
  }

  // Hot deals quick filter (client-side toggle, limited to current page)
  if (showHotDealsOnly) {
    displayedProducts = displayedProducts.filter((p) => p.isHotDeals);
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Early returns AFTER all hooks
  if (loading) {
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
      loadDataWithFilters(filters, currentPage);
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Products
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola produk dengan varian material dan furniture
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </motion.button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar Row */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk atau varian..."
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
                entity="product"
                config={PRODUCT_FILTER_FIELDS}
                onApply={handleApplyFilters}
                categories={categories}
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
                  console.log(
                    "[ProductList] Sort direction changed:",
                    sortDirection,
                    "->",
                    newDirection
                  );
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
                              console.log(
                                "[ProductList] Sort field changed:",
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

      {/* Products Display */}
      {displayedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada produk
          </h3>
          <p className="text-sm text-gray-500">
            Belum ada produk yang ditambahkan atau coba ubah filter
          </p>
        </div>
      ) : (
        // All products view (no grouping)
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {displayedProducts.map((p) => (
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

          {/* Pagination */}
          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
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
