// src/components/items/MapItemsToProductModal.tsx
"use client";

import React, {
  useState,
  useMemo,
} from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  FaTimes,
  FaSearch,
  FaLink,
  FaBox,
  FaCheckCircle,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAuthHeaders,
  getQueryUrl,
  getResourceUrl,
  API_CONFIG,
  apiFetch,
} from "@/config/api";
import { Item } from "./ItemList";

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

type Category = {
  id: number;
  name: string;
};

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export default function MapItemsToProductModal({
  open,
  onClose,
  selectedItems,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  selectedItems: Item[];
  onSuccess: () => void;
}) {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadData = React.useCallback(async () => {
    if (!token) return;

    const headers = getAuthHeaders(token);

    try {
      // Load categories
      const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
        fields: ["*"],
        limit: 1000,
      });
      const categoriesRes = await apiFetch(categoriesUrl, { headers });

      let categoriesData: Category[] = [];
      if (categoriesRes.ok) {
        const json = await categoriesRes.json();
        categoriesData = json.data.map(
          (cat: { id: number | string; category_name: string }) => {
            const id = toNumber(cat.id);
            return id !== null
              ? {
                  id,
                  name: cat.category_name,
                }
              : null;
          }
        );
        categoriesData = categoriesData.filter(
          (cat): cat is Category => cat !== null
        );
      }

      // Load products (only active products)
      const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, {
        fields: ["*"],
        filters: [["disabled", "=", 0]],
        limit: 5000,
      });
      const productsRes = await apiFetch(productsUrl, { headers });

      let productsData: Product[] = [];
      if (productsRes.ok) {
        const json = await productsRes.json();
        productsData = json.data.map(
          (p: {
            id: number | string;
            product_name: string;
            item_category: number | string | null;
            disabled: number;
            hot_deals: boolean;
          }) => {
            const productId = toNumber(p.id);
            const categoryId = toNumber(p.item_category);
            const category = categoriesData.find(
              (cat) => cat.id === categoryId
            );

            return productId !== null
              ? {
                  id: productId,
                  name: p.product_name,
                  itemCategory: {
                    id: categoryId ?? 0,
                    name: category?.name || `Category ${p.item_category}`,
                  },
                  disabled: p.disabled,
                  isHotDeals: Boolean(p.hot_deals),
                }
              : null;
          }
        );
        productsData = productsData.filter(
          (product): product is Product => product !== null
        );
      }

      setCategories(categoriesData);
      setProducts(productsData);
      setDataLoaded(true);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  }, [token]);

  // Load products and categories when modal opens
  React.useEffect(() => {
    if (open && !dataLoaded && token) {
      loadData();
    }
  }, [open, dataLoaded, token, loadData]);

  // Listen for product updates and reload
  React.useEffect(() => {
    const handleProductsUpdate = () => {
      console.log("[MapItemsToProductModal] Products updated, reloading...");
      if (token && open) {
        loadData();
      }
    };

    window.addEventListener("ekatalog:products_update", handleProductsUpdate);

    return () => {
      window.removeEventListener("ekatalog:products_update", handleProductsUpdate);
    };
  }, [token, open, loadData]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  async function handleConfirm() {
    if (!selectedProductId || selectedItems.length === 0 || !token) return;

    setLoading(true);

    try {
      const headers = getAuthHeaders(token);

      // Create variant mappings for each selected item
      const promises = selectedItems.map(async (item, index) => {
        const variantData = {
          item: item.id,
          parent_id: selectedProductId,
          idx: index + 1, // Simple ordering based on selection order
        };

        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT_VARIANT),
          {
            method: "POST",
            headers,
            body: JSON.stringify(variantData),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to map item ${item.name}`
          );
        }

        return response.json();
      });

      await Promise.all(promises);

      console.log(
        `[MapItemsToProductModal] Successfully mapped ${selectedItems.length} items to product ${selectedProductId}`
      );

      // Dispatch update event
      window.dispatchEvent(new Event("ekatalog:variants_update"));
      window.dispatchEvent(new Event("ekatalog:products_update"));

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Failed to map items to product:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal mapping items ke product. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSearchQuery("");
    setSelectedProductId(null);
    onClose();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Map Items to Product
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {selectedItems.length} item{selectedItems.length !== 1 && "s"}{" "}
                selected
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Selected Items Preview */}
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <FaBox className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Selected Items:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedItems.slice(0, 5).map((item) => (
                <span
                  key={item.id}
                  className="px-3 py-1 bg-white rounded-lg text-xs font-medium text-gray-700 border border-blue-200"
                >
                  {item.name}
                </span>
              ))}
              {selectedItems.length > 5 && (
                <span className="px-3 py-1 bg-blue-200 rounded-lg text-xs font-medium text-blue-900">
                  +{selectedItems.length - 5} more
                </span>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Products List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <FaBox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchQuery
                    ? "No products found"
                    : "No products available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProductId(product.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedProductId === product.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Category: {product.itemCategory.name}
                        </p>
                      </div>
                      {selectedProductId === product.id && (
                        <FaCheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedProductId || loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mapping...</span>
                </>
              ) : (
                <>
                  <FaLink className="w-4 h-4" />
                  <span>Confirm Mapping</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
