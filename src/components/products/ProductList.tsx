// src/components/products/ProductList.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from "./ProductCard";
import AddProductModal from "./AddProductModal";
import ProductDetailModal from "./ProductDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination, { usePagination } from "@/components/ui/Pagination";
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
} from "@/config/api";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { PRODUCT_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";

type SortField =
  | "product_name"
  | "item_category"
  | "created_at"
  | "updated_at"
  | "hot_deals";
type SortDirection = "asc" | "desc";

const SNAP_KEY = "ekatalog_products_snapshot";

// API Response Types
interface ItemApiResponse {
  id: number;
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
  id: number;
  product_name: string;
  item_category: number;
  hot_deals: number;
  disabled: number;
  docstatus: number;
  status: string;
  // Catatan Aktivitas
  created_at?: string;
  created_by?: number | { id: number; full_name: string };
  updated_at?: string;
  updated_by?: number | { id: number; full_name: string };
  owner?: number | { id: number; full_name: string };
}

export default function ProductList() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortField, setSortField] = useState<SortField>("product_name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHotDealsOnly, setShowHotDealsOnly] = useState(false);

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

  // Helper function to load and merge data from API with filters and sorting
  async function loadAllData(
    filterTriples: FilterTriple[] = [],
    sort_by?: SortField,
    sort_order?: SortDirection
  ): Promise<{
    categoriesData: Category[];
    itemsData: Item[];
    productsWithVariants: Product[];
  }> {
    if (!token)
      return { categoriesData: [], itemsData: [], productsWithVariants: [] };

    const headers = getAuthHeaders(token);

    // Load categories from API
    const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
      fields: ["*"],
      limit: 10000000,
    });
    const categoriesRes = await fetch(categoriesUrl, {
      method: "GET",
      cache: "no-store",
      headers,
    });
    let categoriesData: Category[] = [];
    if (categoriesRes.ok) {
      const response = await categoriesRes.json();
      categoriesData = response.data.map(
        (cat: { id: number; category_name: string }) => ({
          id: cat.id,
          name: cat.category_name,
        })
      );
    }

    // Load items from API
    const itemsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, {
      fields: ["*"],
      limit: 10000000,
    });
    const itemsRes = await fetch(itemsUrl, {
      method: "GET",
      cache: "no-store",
      headers,
    });
    let itemsData: Item[] = [];
    if (itemsRes.ok) {
      const response = await itemsRes.json();
      itemsData = response.data.map((item: ItemApiResponse) => ({
        id: item.id,
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
      }));
    }

    // Load products from API with filters and sorting
    // Use childs to fetch variants directly with products
    const productSpec: {
      fields: string[];
      filters?: FilterTriple[];
      order_by?: [string, string][];
      limit?: number;
      childs?: Array<{
        alias: string;
        table: string;
        fields: string[];
      }>;
    } = {
      fields: [
        "*",
        "created_by.full_name",
        "updated_by.full_name",
        "owner.full_name",
      ],
      childs: [
        {
          alias: "variants",
          table: "ekatalog_variant",
          fields: ["item", "item.id", "item.item_code", "item.item_name", "item.image"],
        },
      ],
      limit: 10000000,
    };

    if (filterTriples.length > 0) {
      productSpec.filters = filterTriples;
    }

    // Server-side sorting with correct array of arrays format
    if (sort_by && sort_order) {
      productSpec.order_by = [[sort_by, sort_order]];
    }

    console.log("[ProductList] Filter Triples:", filterTriples);
    console.log("[ProductList] Product Spec:", productSpec);

    const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, productSpec);
    console.log("[ProductList] Request URL:", productsUrl);
    const productsRes = await fetch(productsUrl, {
      method: "GET",
      cache: "no-store",
      headers,
    });
    let productsWithVariants: Product[] = [];
    if (productsRes.ok) {
      const response = await productsRes.json();

      console.log("=== PRODUCT LIST - VARIANT LOADING DEBUG ===");
      console.log("Total products loaded:", response.data.length);

      // Debug first product
      if (response.data.length > 0) {
        console.log("First product raw:", response.data[0]);
        console.log("First product variants:", response.data[0].variants);
      }

      productsWithVariants = response.data.map((prod: ProductApiResponse & { variants?: Array<{ item: { id: number; item_code: string; item_name: string; image?: string } }> }) => {
        // Find the category object for this product
        const category = categoriesData.find(
          (c) => c.id === prod.item_category
        ) || {
          id: prod.item_category,
          name: `Category ${prod.item_category}`,
        };

        // Transform variants from API response
        const productVariants = (prod.variants || []).map((v) => {
          // Find full item data from itemsData
          const fullItem = itemsData.find((item) => item.id === v.item.id);

          return {
            id: v.item.id, // Use item ID as variant ID for now
            item: fullItem || {
              id: v.item.id,
              code: v.item.item_code,
              name: v.item.item_name,
              color: "",
              type: "",
              uom: "",
              image: v.item.image ? getFileUrl(v.item.image) : undefined,
            },
            productid: prod.id,
            displayOrder: 0,
          };
        });

        // Debug: Log first product with details
        if (prod.id === response.data[0]?.id) {
          console.log("=== FIRST PRODUCT DETAILS ===");
          console.log("Product ID:", prod.id);
          console.log("Product Name:", prod.product_name);
          console.log("Raw variants from API:", prod.variants);
          console.log("Transformed variants:", productVariants);
        }

        return {
          id: prod.id,
          name: prod.product_name,
          itemCategory: category,
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
      });

      console.log("=== FINAL PRODUCTS WITH VARIANTS ===");
      productsWithVariants.forEach((p) => {
        console.log(`Product ID ${p.id}: "${p.name}" - ${p.variants.length} variants`);
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

    return { categoriesData, itemsData, productsWithVariants };
  }

  // Use filter system
  const { filters, setFilters } = useFilters({
    entity: "product",
  });

  // Function to load data with filters (wrapped in useCallback to fix warning)
  const loadDataWithFilters = useCallback(
    async (filterTriples: FilterTriple[] = []) => {
      setLoading(true);
      setError(null);
      try {
        console.log(
          "[ProductList] Loading data with server-side sort:",
          sortField,
          sortDirection
        );
        const { categoriesData, itemsData, productsWithVariants } =
          await loadAllData(filterTriples, sortField, sortDirection);

        setCategories(categoriesData);
        setAvailableItems(itemsData);
        setProducts(productsWithVariants);
        localStorage.setItem(SNAP_KEY, JSON.stringify(productsWithVariants));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
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
    // Reload data when filters are applied
    loadDataWithFilters(newFilters);
  }

  // Initial load with filters from URL/localStorage
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!cancelled && token) {
        await loadDataWithFilters(filters);
      }
    }

    if (token) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [token, filters, loadDataWithFilters]);

  // Reload data when sort changes
  useEffect(() => {
    if (token) {
      console.log(
        "[ProductList] Sort changed, reloading data with:",
        sortField,
        sortDirection
      );
      loadDataWithFilters(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortDirection]);

  // Listen for updates
  useEffect(() => {
    async function handler() {
      console.log("[ProductList] 🔄 Event triggered: products_update or variants_update");
      console.log("[ProductList] Reloading data with filters:", filters);
      console.log("[ProductList] Reloading data with sort:", sortField, sortDirection);
      try {
        const { productsWithVariants } = await loadAllData(filters, sortField, sortDirection);
        console.log("[ProductList] ✅ Reload complete. Total products:", productsWithVariants.length);
        setProducts(productsWithVariants);
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
  }, [filters, sortField, sortDirection]);

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
        const response = await fetch(url, { method: "DELETE", headers });

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
  let filteredProducts = products;

  // Quick search filter (client-side for better UX)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.variants.some((v) => v.item.name.toLowerCase().includes(query))
    );
  }

  // Hot deals quick filter (client-side toggle)
  if (showHotDealsOnly) {
    filteredProducts = filteredProducts.filter((p) => p.isHotDeals);
  }

  // Apply pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredProducts, 20);

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
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
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
      {filteredProducts.length === 0 ? (
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
            {paginatedProducts.map((p) => (
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
          {filteredProducts.length > 0 && (
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
        availableItems={availableItems}
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
