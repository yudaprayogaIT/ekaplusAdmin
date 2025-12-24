// src/components/products/ProductList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import AddProductModal from "./AddProductModal";
import ProductDetailModal from "./ProductDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination, { usePagination } from "@/components/ui/Pagination";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaFire,
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
import { fetchVariants } from "@/services/variantService";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "category"
  | "variants-most"
  | "variants-least"
  | "newest"
  | "oldest";

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
}

interface ProductApiResponse {
  id: number;
  product_name: string;
  item_category: number;
  hot_deals: number;
  disabled: number;
  docstatus: number;
  status: string;
}

export default function ProductList() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showHotDealsOnly, setShowHotDealsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

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

  // Helper function to load and merge data from API
  async function loadAllData() {
    if (!token)
      return { categoriesData: [], itemsData: [], productsWithVariants: [] };

    const headers = getAuthHeaders(token);

    // Load categories from API
    const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
      fields: ["*"],
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
    const itemsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, { fields: ["*"] });
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
      }));
      console.log(itemsData);
    }

    // Load products from API
    const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, {
      fields: ["*"],
    });
    const productsRes = await fetch(productsUrl, {
      method: "GET",
      cache: "no-store",
      headers,
    });
    let productsWithVariants: Product[] = [];
    if (productsRes.ok) {
      const response = await productsRes.json();

      // Load variants from API
      const variantsData = await fetchVariants(token!, itemsData);

      productsWithVariants = response.data.map((prod: ProductApiResponse) => {
        // Find the category object for this product
        const category = categoriesData.find(
          (c) => c.id === prod.item_category
        ) || {
          id: prod.item_category,
          name: `Category ${prod.item_category}`,
        };

        // Filter variants for this product
        const productVariants = variantsData.filter(
          (v) => v.productid === prod.id
        );

        return {
          id: prod.id,
          name: prod.product_name,
          itemCategory: category,
          disabled: prod.disabled,
          isHotDeals: Boolean(prod.hot_deals),
          variants: productVariants, // Variants from API
        };
      });
    }

    return { categoriesData, itemsData, productsWithVariants };
  }

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const { categoriesData, itemsData, productsWithVariants } =
          await loadAllData();

        if (!cancelled) {
          setCategories(categoriesData);
          setAvailableItems(itemsData);
          setProducts(productsWithVariants);
          localStorage.setItem(SNAP_KEY, JSON.stringify(productsWithVariants));
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for updates
  useEffect(() => {
    async function handler() {
      try {
        const { productsWithVariants } = await loadAllData();
        setProducts(productsWithVariants);
        localStorage.setItem(SNAP_KEY, JSON.stringify(productsWithVariants));
      } catch {
        // Ignore errors on update
      }
    }

    window.addEventListener("ekatalog:products_update", handler);
    window.addEventListener("ekatalog:variants_update", handler);

    return () => {
      window.removeEventListener("ekatalog:products_update", handler);
      window.removeEventListener("ekatalog:variants_update", handler);
    };
  }, []);

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

  // Filter products (MUST be before early returns to comply with Hooks rules)
  let filteredProducts = products;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.variants.some((v) => v.item.name.toLowerCase().includes(query))
    );
  }

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.itemCategory.id === selectedCategory
    );
  }

  if (showHotDealsOnly) {
    filteredProducts = filteredProducts.filter((p) => p.isHotDeals);
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "category":
        return a.itemCategory.name.localeCompare(b.itemCategory.name);
      case "variants-most":
        return b.variants.length - a.variants.length;
      case "variants-least":
        return a.variants.length - b.variants.length;
      case "newest":
        return (b.id || 0) - (a.id || 0);
      case "oldest":
        return (a.id || 0) - (b.id || 0);
      default:
        return 0;
    }
  });

  // Apply pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    totalItems,
    itemsPerPage,
  } = usePagination(sortedProducts, 10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Group by category
  const groupedByCategory = categories
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((cat) => ({
      category: cat,
      items: paginatedProducts.filter((p) => p.itemCategory.id === cat.id),
    }))
    .filter((group) => group.items.length > 0);

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
                placeholder="Cari produk atau varian..."
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

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCategoryDropdownOpen(!categoryDropdownOpen);
                    setSortDropdownOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory !== null
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <FaFilter className="w-3.5 h-3.5" />
                  <span>
                    {selectedCategory !== null
                      ? categories.find((c) => c.id === selectedCategory)?.name
                      : `Semua (${products.length})`}
                  </span>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {categoryDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setCategoryDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20 max-h-[300px] overflow-y-auto"
                      >
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                            selectedCategory === null
                              ? "text-red-600 bg-red-50"
                              : "text-gray-700"
                          }`}
                        >
                          Semua ({products.length})
                        </button>
                        {categories.map((cat) => {
                          const count = products.filter(
                            (p) => p.itemCategory.id === cat.id
                          ).length;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.id);
                                setCategoryDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                                selectedCategory === cat.id
                                  ? "text-red-600 bg-red-50"
                                  : "text-gray-700"
                              }`}
                            >
                              {cat.name} ({count})
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setSortDropdownOpen(!sortDropdownOpen);
                    setCategoryDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <FaSortAmountDown className="w-3.5 h-3.5" />
                  <span>
                    {sortBy === "name-asc" && "A-Z"}
                    {sortBy === "name-desc" && "Z-A"}
                    {sortBy === "category" && "Kategori"}
                    {sortBy === "variants-most" && "Terbanyak Varian"}
                    {sortBy === "variants-least" && "Tersedikit Varian"}
                    {sortBy === "newest" && "Terbaru"}
                    {sortBy === "oldest" && "Terlama"}
                  </span>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {sortDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSortDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20"
                      >
                        {[
                          { value: "newest" as SortOption, label: "Terbaru" },
                          { value: "oldest" as SortOption, label: "Terlama" },
                          {
                            value: "name-asc" as SortOption,
                            label: "Nama A-Z",
                          },
                          {
                            value: "name-desc" as SortOption,
                            label: "Nama Z-A",
                          },
                          {
                            value: "category" as SortOption,
                            label: "Kategori",
                          },
                          {
                            value: "variants-most" as SortOption,
                            label: "Terbanyak Varian",
                          },
                          {
                            value: "variants-least" as SortOption,
                            label: "Tersedikit Varian",
                          },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                              sortBy === option.value
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

              {/* Hot Deals Filter */}
              <button
                onClick={() => setShowHotDealsOnly(!showHotDealsOnly)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  showHotDealsOnly
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-red-700 shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaFire className="w-4 h-4" />
                <span>Hot Deals</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {sortedProducts.length === 0 ? (
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
              : "Belum ada produk yang ditambahkan"}
          </p>
        </div>
      ) : selectedCategory ? (
        <>
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {categories.find((c) => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {sortedProducts.length} items
              </span>
            </div>

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
          </section>

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      ) : (
        <>
          <div className="space-y-10">
            {groupedByCategory.map(({ category, items }) => (
              <section key={category.id}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {category.name}
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                    {items.length} items
                  </span>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {items.map((p) => (
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
              </section>
            ))}
          </div>

          {/* Pagination */}
          {sortedProducts.length > 0 && (
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
