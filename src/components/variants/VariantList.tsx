// src/components/variants/VariantList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import VariantCard from "./VariantCard";
import AddVariantMappingModal from "./AddVariantMappingModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaLink,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fetchVariants, deleteVariant } from "@/services/variantService";
import { API_CONFIG, getQueryUrl, getAuthHeaders } from "@/config/api";

type Branch = {
  id: number;
  name: string;
};

type Item = {
  id: number;
  code: string;
  name: string;
  color: string;
  type: string;
  uom: string;
  image?: string;
  branches?: Branch[];
  description?: string;
};

type ItemVariant = {
  id: number;
  item: Item;
  productid: number;
};

type Product = {
  id: number;
  name: string;
  itemCategory: {
    id: number;
    name: string;
  };
  disabled: number;
  isHotDeals: boolean;
};

type SortOption = "item-asc" | "item-desc" | "product" | "newest" | "oldest";

export default function VariantList() {
  const [variants, setVariants] = useState<ItemVariant[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [mappingModalOpen, setMappingModalOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load data from API
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        // Get auth token
        const token = localStorage.getItem("auth_token") || "";

        // Load products from API
        const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, {
          fields: ["*"],
        });
        const productsRes = await fetch(productsUrl, {
          headers: getAuthHeaders(token),
        });

        let productsData: Product[] = [];
        if (productsRes.ok) {
          const json = await productsRes.json();
          productsData = json.data.map((p: any) => ({
            id: p.id,
            name: p.product_name,
            itemCategory: {
              id: p.item_category,
              name: `Category ${p.item_category}`,
            },
            disabled: p.disabled,
            isHotDeals: Boolean(p.hot_deals),
          }));
        }

        // Load items from API
        const itemsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT, {
          fields: ["*"],
        });
        const itemsRes = await fetch(itemsUrl, {
          headers: getAuthHeaders(token),
        });

        let itemsData: Item[] = [];
        if (itemsRes.ok) {
          const json = await itemsRes.json();
          itemsData = json.data.map(
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
              image: i.image,
              description: i.item_desc,
              category: i.item_category,
              group: i.item_group,
              disabled: i.disabled,
            })
          );
        }

        // Load variants from API
        const variantsData = await fetchVariants(token, itemsData);

        if (!cancelled) {
          setProducts(productsData);
          setItems(itemsData);
          setVariants(variantsData);
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
  }, []);

  // Listen for variant updates and refresh from API
  useEffect(() => {
    async function handler() {
      const token = localStorage.getItem("auth_token") || "";
      try {
        const variantsData = await fetchVariants(token, items);
        setVariants(variantsData);
      } catch (err) {
        console.error("Failed to refresh variants:", err);
      }
    }
    window.addEventListener("ekatalog:variants_update", handler);
    return () =>
      window.removeEventListener("ekatalog:variants_update", handler);
  }, [items]);

  // Helper to refresh variants from API
  async function refreshVariants() {
    const token = localStorage.getItem("auth_token") || "";
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
      const token = localStorage.getItem("auth_token") || "";
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

  function handleMappingSave() {
    setMappingModalOpen(false);
  }

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

  // Filter variants
  let filteredVariants = variants;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredVariants = filteredVariants.filter(
      (v) =>
        v.item.name.toLowerCase().includes(query) ||
        v.item.code.toLowerCase().includes(query)
    );
  }

  if (selectedProduct) {
    filteredVariants = filteredVariants.filter(
      (v) => v.productid === selectedProduct
    );
  }

  // Sort variants
  const sortedVariants = [...filteredVariants].sort((a, b) => {
    switch (sortBy) {
      case "item-asc":
        return a.item.name.localeCompare(b.item.name);
      case "item-desc":
        return b.item.name.localeCompare(a.item.name);
      case "product":
        const productA = products.find((p) => p.id === a.productid)?.name || "";
        const productB = products.find((p) => p.id === b.productid)?.name || "";
        return productA.localeCompare(productB);
      case "newest":
        return (b.id || 0) - (a.id || 0);
      case "oldest":
        return (a.id || 0) - (b.id || 0);
      default:
        return 0;
    }
  });

  // Group by product
  const groupedByProduct = products
    .map((product) => ({
      product,
      items: sortedVariants.filter((v) => v.productid === product.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Variant Mappings
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola mapping antara items dan products
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMappingModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all font-medium"
        >
          <FaLink className="w-4 h-4" />
          <span>Smart Mapping</span>
        </motion.button>
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
            Unmapped
          </div>
          <div className="text-3xl font-bold text-orange-900">
            {items.length - variants.length}
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

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Product Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProductDropdownOpen(!productDropdownOpen);
                  setSortDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedProduct !== null
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaFilter className="w-3.5 h-3.5" />
                <span>
                  {selectedProduct !== null
                    ? products.find((p) => p.id === selectedProduct)?.name
                    : `Semua Products (${variants.length})`}
                </span>
                <FaChevronDown
                  className={`w-3 h-3 transition-transform ${
                    productDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {productDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProductDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20 max-h-[300px] overflow-y-auto"
                    >
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          setProductDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                          selectedProduct === null
                            ? "text-red-600 bg-red-50"
                            : "text-gray-700"
                        }`}
                      >
                        Semua ({variants.length})
                      </button>
                      {products.map((product) => {
                        const count = variants.filter(
                          (v) => v.productid === product.id
                        ).length;
                        return (
                          <button
                            key={product.id}
                            onClick={() => {
                              setSelectedProduct(product.id);
                              setProductDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                              selectedProduct === product.id
                                ? "text-red-600 bg-red-50"
                                : "text-gray-700"
                            }`}
                          >
                            {product.name} ({count})
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
                  setProductDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <FaSortAmountDown className="w-3.5 h-3.5" />
                <span>
                  {sortBy === "item-asc" && "Item A-Z"}
                  {sortBy === "item-desc" && "Item Z-A"}
                  {sortBy === "product" && "Product"}
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
                        { value: "item-asc" as SortOption, label: "Item A-Z" },
                        { value: "item-desc" as SortOption, label: "Item Z-A" },
                        { value: "product" as SortOption, label: "Product" },
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
          </div>
        </div>
      </div>

      {/* Variants Display */}
      {sortedVariants.length === 0 ? (
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
          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMappingModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg font-medium"
            >
              <FaLink className="w-4 h-4" />
              <span>Mulai Smart Mapping</span>
            </motion.button>
          )}
        </div>
      ) : selectedProduct ? (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {products.find((p) => p.id === selectedProduct)?.name}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {sortedVariants.length} variants
            </span>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {sortedVariants.map((v) => (
              <VariantCard
                key={v.id}
                variant={v}
                product={products.find((p) => p.id === v.productid)}
                viewMode={viewMode}
                onDelete={() => promptDeleteVariant(v)}
              />
            ))}
          </div>
        </section>
      ) : (
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
      )}

      {/* Modals */}
      <AddVariantMappingModal
        open={mappingModalOpen}
        onClose={() => setMappingModalOpen(false)}
        items={items}
        products={products}
        onSave={handleMappingSave}
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
