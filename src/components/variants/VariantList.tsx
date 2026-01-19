// src/components/variants/VariantList.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VariantCard from "./VariantCard";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import {
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountUp,
  FaSortAmountDown,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVariants, deleteVariant } from "@/services/variantService";
import {
  API_CONFIG,
  getQueryUrl,
  getAuthHeaders,
  getFileUrl,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { Item, Product, Category } from "@/types";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { VARIANT_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
import { groupItemsByPattern } from "@/utils/itemGrouping";
import { buildSearchParams, parseSearchParams } from "@/utils/urlSync";

type ItemVariant = {
  id: number;
  item: Item;
  productid: number;
  created_at?: string;
  updated_at?: string;
};

type SortField =
  | "name"
  | "item"
  | "parent_id"
  | "idx"
  | "created_at"
  | "updated_at";
type SortDirection = "asc" | "desc";

export default function VariantList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();

  // Parse initial state from URL
  const urlState = parseSearchParams(searchParams);

  const [variants, setVariants] = useState<ItemVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staticDataLoaded, setStaticDataLoaded] = useState(false);
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

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(urlState.page);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Track if this is initial mount to prevent resetting page on first load
  const isInitialMount = useRef(true);

  // Use filter system with initial filters from URL
  const { filters, setFilters } = useFilters({
    entity: "variant",
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
    });

    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(newUrl, { scroll: false });
  }, [filters, sortField, sortDirection, currentPage, searchQuery, router]);

  // Handle filter apply
  function handleApplyFilters(newFilters: FilterTriple[]) {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    console.log("[VariantList] Filters applied:", newFilters);
  }

  // Helper function to load variants only (for pagination/sorting)
  const loadVariants = useCallback(
    async (
      filterTriples: FilterTriple[] = [],
      sort_by?: SortField,
      sort_order?: SortDirection,
      page: number = 1
    ): Promise<{
      variantsData: ItemVariant[];
      totalItems: number;
      totalPages: number;
    }> => {
      if (!token) {
        return {
          variantsData: [],
          totalItems: 0,
          totalPages: 0,
        };
      }

      const headers = getAuthHeaders(token);

      // Load variants from API with filters and sorting
      const variantSpec: {
        fields: string[];
        filters?: FilterTriple[];
        order_by?: [string, string][];
        limit: number;
        page: number;
      } = {
        fields: ["*"],
        limit: 20,
        page: page,
      };

      if (filterTriples.length > 0) {
        variantSpec.filters = filterTriples;
      }

      // Server-side sorting with correct array of arrays format
      if (sort_by && sort_order) {
        variantSpec.order_by = [[sort_by, sort_order]];
      }

      console.log("[VariantList] Filter Triples:", filterTriples);
      console.log("[VariantList] Variant Spec:", variantSpec);

      const variantsUrl = getQueryUrl(
        API_CONFIG.ENDPOINTS.PRODUCT_VARIANT,
        variantSpec
      );
      console.log("[VariantList] Request URL:", variantsUrl);

      const variantsRes = await fetch(variantsUrl, { headers });

      let variantsData: ItemVariant[] = [];
      let totalItems = 0;
      let totalPages = 0;

      if (variantsRes.ok) {
        const json = await variantsRes.json();

        console.log("[VariantList] Full API Response:", json);

        // Parse pagination metadata - check multiple possible field names
        totalItems = json.total || json.count || json.total_count || 0;

        if (totalItems > 0) {
          // API returned total count
          totalPages = Math.ceil(totalItems / 20);
          console.log("[VariantList] Using API total count");
        } else if (json.data.length > 0) {
          // API didn't return total count, use optimistic pagination
          console.warn("[VariantList] API did not return total count, using optimistic pagination");

          if (json.data.length < 20) {
            // Less than page size means this is the last page
            totalPages = page;
            totalItems = (page - 1) * 20 + json.data.length;
            console.log("[VariantList] Last page detected (less than 20 items)");
          } else {
            // Full page (exactly 20 items), assume there might be more pages
            totalPages = page + 1; // Show "next" button
            totalItems = (page + 1) * 20; // Approximate total to show pagination
            console.log("[VariantList] Full page detected, showing next page button");
          }
        } else {
          totalPages = 1;
          totalItems = 0;
          console.log("[VariantList] No data");
        }

        console.log("[VariantList] Pagination metadata:", {
          totalItems,
          totalPages,
          currentPage: page,
          dataLength: json.data.length,
          responseKeys: Object.keys(json),
          usingOptimisticPagination: !json.total
        });

        variantsData = json.data.map(
          (v: {
            id: number;
            item: number;
            parent_id: number;
            idx: number;
            created_at?: string;
            updated_at?: string;
          }) => {
            const item = items.find((i) => i.id === v.item);
            if (!item) {
              console.warn(`Item ${v.item} not found in items list`);
              return {
                id: v.id,
                item: {
                  id: v.item,
                  code: `ITEM-${v.item}`,
                  name: `Item ${v.item} (Not Found)`,
                  color: "",
                  type: "",
                  uom: "",
                },
                productid: v.parent_id,
                displayOrder: v.idx,
                created_at: v.created_at,
                updated_at: v.updated_at,
              };
            }

            return {
              id: v.id,
              item: item,
              productid: v.parent_id,
              displayOrder: v.idx,
              created_at: v.created_at,
              updated_at: v.updated_at,
            };
          }
        );
      }

      return { variantsData, totalItems, totalPages };
    },
    [token, items]
  );

  // Load static data (categories, products, items) once on mount
  useEffect(() => {
    if (!token) return;

    async function loadStatic() {
      if (!token) {
        console.warn("[VariantList] No token available");
        return;
      }

      console.log("[VariantList] Loading static data (categories, products, items)...");
      const headers = getAuthHeaders(token);

      try {
        // Load categories
        const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
          fields: ["*"],
          limit: 1000,
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
          setCategories(categoriesData);
          console.log("[VariantList] Categories loaded:", categoriesData.length);
        }

        // Load products (all products, including disabled ones for variant mapping view)
        const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, {
          fields: ["*", "item_category.id", "item_category.category_name"],
          limit: 5000,
        });
        const productsRes = await fetch(productsUrl, { headers });
        if (productsRes.ok) {
          const json = await productsRes.json();
          const productsData = json.data.map(
            (p: {
              id: number;
              product_name: string;
              item_category: number | { id?: number; category_name?: string };
              item_category_id?: number;
              disabled: number;
              hot_deals: boolean;
            }) => {
              // Use nested category if available
              let itemCategory;
              if (typeof p.item_category === "object" && p.item_category?.category_name) {
                itemCategory = {
                  id: p.item_category.id || p.item_category_id || 0,
                  name: p.item_category.category_name,
                };
              } else {
                const catId = typeof p.item_category === "number" ? p.item_category : p.item_category_id;
                itemCategory = {
                  id: catId || 0,
                  name: `Category ${catId}`,
                };
              }

              return {
                id: p.id,
                name: p.product_name,
                itemCategory,
                disabled: p.disabled,
                isHotDeals: Boolean(p.hot_deals),
              };
            }
          );
          setProducts(productsData);
          console.log("[VariantList] Products loaded:", productsData.length);
        }

        // Load items (only active items)
        const itemsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, {
          fields: ["*"],
          filters: [["disabled", "=", 0]],
          limit: 10000,
        });
        const itemsRes = await fetch(itemsUrl, { headers });
        if (itemsRes.ok) {
          const json = await itemsRes.json();
          const itemsData = json.data.map(
            (i: {
              id: number;
              item_code: string;
              item_name: string;
              item_color?: string;
              ekatalog_type?: string;
              uom: string;
              image?: string;
              item_desc?: string;
              item_category?: string;
              item_group?: string;
              disabled?: number;
            }) => ({
              id: i.id,
              code: i.item_code,
              name: i.item_name,
              color: i.item_color || "",
              type: i.ekatalog_type || "",
              uom: i.uom,
              image: getFileUrl(i.image),
              description: i.item_desc,
              category: i.item_category,
              group: i.item_group,
              disabled: i.disabled,
            })
          );
          setItems(itemsData);
          console.log("[VariantList] Items loaded:", itemsData.length);
        }

        setStaticDataLoaded(true);
        console.log("[VariantList] Static data loading complete");
      } catch (error) {
        console.error("[VariantList] Failed to load static data:", error);
      }
    }

    loadStatic();

    // Reload items when they're updated
    const handleItemsUpdate = () => {
      console.log("[VariantList] Items updated, reloading static data...");
      loadStatic();
    };

    window.addEventListener("ekatalog:items_update", handleItemsUpdate);
    return () => {
      window.removeEventListener("ekatalog:items_update", handleItemsUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Reset to first page when sort changes (but not on initial mount)
  useEffect(() => {
    if (staticDataLoaded && !isInitialMount.current) {
      console.log(
        "[VariantList] Sort changed, resetting to first page:",
        sortField,
        sortDirection
      );
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticDataLoaded, sortField, sortDirection]);

  // Load variants with filters and pagination (only after static data is loaded)
  useEffect(() => {
    if (!staticDataLoaded || !token) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        console.log(
          "[VariantList] Loading variants with server-side sort and pagination:",
          sortField,
          sortDirection,
          "page:",
          currentPage
        );

        const { variantsData, totalItems, totalPages } =
          await loadVariants(filters, sortField, sortDirection, currentPage);

        if (!cancelled) {
          setVariants(variantsData);
          setTotalItems(totalItems);
          setTotalPages(totalPages);

          // Mark initial mount as complete after first successful load
          if (isInitialMount.current) {
            isInitialMount.current = false;
          }
        }
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [staticDataLoaded, token, filters, sortField, sortDirection, currentPage, loadVariants]);

  // Listen for variant updates and refresh variants only
  useEffect(() => {
    if (!staticDataLoaded) return;

    async function handler() {
      if (!token) return;
      try {
        console.log("[VariantList] Refreshing variants after update...");

        // Reload variants only
        const { variantsData, totalItems, totalPages } =
          await loadVariants(filters, sortField, sortDirection, currentPage);

        setVariants(variantsData);
        setTotalItems(totalItems);
        setTotalPages(totalPages);

        console.log("[VariantList] Variants refreshed successfully");
      } catch (err) {
        console.error("Failed to refresh variants:", err);
      }
    }
    window.addEventListener("ekatalog:variants_update", handler);
    window.addEventListener("ekatalog:products_update", handler);

    return () => {
      window.removeEventListener("ekatalog:variants_update", handler);
      window.removeEventListener("ekatalog:products_update", handler);
    };
  }, [staticDataLoaded, token, filters, sortField, sortDirection, currentPage, loadVariants]);

  // Helper to refresh variants from API
  async function refreshVariants() {
    if (!token) return;
    try {
      const variantsData = await fetchVariants(token, items);
      setVariants(variantsData);
      window.dispatchEvent(new Event("ekatalog:variants_update"));
    } catch (err) {
      console.error("Failed to refresh variants:", err);
    }
  }

  function promptDeleteVariant(v: ItemVariant) {
    setConfirmTitle("Hapus Variant Mapping");
    setConfirmDesc(`Yakin ingin menghapus mapping "${v.item.name}"?`);
    actionRef.current = async () => {
      if (!token) return;
      try {
        await deleteVariant(token, v.id);
        await refreshVariants();
        window.dispatchEvent(new Event("ekatalog:products_update"));
      } catch (err) {
        console.error("Failed to delete variant:", err);
        alert("Gagal menghapus variant. Silakan coba lagi.");
      }
    };
    setConfirmOpen(true);
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

  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter variants (client-side quick search only)
  // Note: With server-side pagination, client-side search is limited to current page only
  let filteredVariants = variants;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredVariants = filteredVariants.filter(
      (v) =>
        v.item.name.toLowerCase().includes(query) ||
        v.item.code.toLowerCase().includes(query)
    );
  }

  // Group by product
  const groupedByProduct = useMemo(() => {
    console.log("[VariantList] Grouping variants by product...");
    const startTime = performance.now();

    // Optimize: Group variants by productid first
    const variantsByProduct = new Map<number, ItemVariant[]>();
    filteredVariants.forEach((variant) => {
      if (!variantsByProduct.has(variant.productid)) {
        variantsByProduct.set(variant.productid, []);
      }
      variantsByProduct.get(variant.productid)!.push(variant);
    });

    // Then map to products
    const result = products
      .map((product) => ({
        product,
        items: variantsByProduct.get(product.id) || [],
      }))
      .filter((group) => group.items.length > 0);

    const endTime = performance.now();
    console.log("[VariantList] Created", result.length, "product groups in", Math.round(endTime - startTime), "ms");
    return result;
  }, [products, filteredVariants]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat variants...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
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
            Variant Mappings
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Lihat mapping antara items dan products
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">
            Total Mappings
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {variants.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">
            Products
          </div>
          <div className="text-3xl font-bold text-green-900">
            {products.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">Items</div>
          <div className="text-3xl font-bold text-purple-900">
            {items.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <div className="text-sm text-orange-700 font-medium mb-1">
            Categories
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {categories.length}
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari variant berdasarkan item..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sort & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Advanced Filters */}
            <FilterBuilder
              entity="variant"
              config={VARIANT_FILTER_FIELDS}
              onApply={handleApplyFilters}
              categories={categories}
            />

            {/* Sort Direction Button */}
            <button
              onClick={() => {
                const newDirection = sortDirection === "asc" ? "desc" : "asc";
                console.log(
                  "[VariantList] Sort direction changed:",
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
            </button>

            {/* Sort Field Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortFieldDropdownOpen(!sortFieldDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <span>
                  {sortField === "name" && "Variant Name"}
                  {sortField === "item" && "Item"}
                  {sortField === "parent_id" && "Product"}
                  {sortField === "idx" && "Display Order"}
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
                        { value: "name" as SortField, label: "Variant Name" },
                        { value: "item" as SortField, label: "Item" },
                        { value: "parent_id" as SortField, label: "Product" },
                        { value: "idx" as SortField, label: "Display Order" },
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
                              "[VariantList] Sort field changed:",
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

      {/* Content Display */}
      {filteredVariants.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada variant mapping
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada variant yang di-mapping"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-10">
            {groupedByProduct.map(({ product, items }) => (
              <section key={product.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {product.name}
                    </h2>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                    {items.length} variants
                  </span>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {items.map((v) => (
                    <VariantCard
                      key={v.id}
                      variant={v}
                      product={product}
                      viewMode={viewMode}
                      onDelete={() => promptDeleteVariant(v)}
                    />
                  ))}
                </div>
              </section>
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