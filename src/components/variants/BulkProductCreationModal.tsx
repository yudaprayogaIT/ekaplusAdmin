// src/components/variants/BulkProductCreationModal.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaSave,
  FaTag,
  FaLayerGroup,
  FaFire,
  FaTrash,
  FaBox,
  FaPlus,
  FaLink,
} from "react-icons/fa";
import Image from "next/image";
import type { Item, Category, Product } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, getAuthHeaders, getResourceUrl } from "@/config/api";
import { suggestProductName } from "@/utils/itemGrouping";
import { createVariant } from "@/services/variantService";

interface BulkProductCreationModalProps {
  open: boolean;
  onClose: () => void;
  selectedItems: Item[];
  categories: Category[];
  products: Product[];
  onSuccess: () => void;
}

export default function BulkProductCreationModal({
  open,
  onClose,
  selectedItems,
  categories,
  products,
  onSuccess,
}: BulkProductCreationModalProps) {
  const { token } = useAuth();
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isHotDeals, setIsHotDeals] = useState(false);
  const [items, setItems] = useState<Item[]>(selectedItems);
  const [saving, setSaving] = useState(false);

  // Find matching products based on suggested name
  const suggestedName = useMemo(
    () => suggestProductName(selectedItems),
    [selectedItems]
  );

  const matchingProducts = useMemo(() => {
    if (!suggestedName) return [];

    // Find products that start with the suggested name
    return products.filter((p) =>
      p.name.toUpperCase().startsWith(suggestedName.toUpperCase())
    );
  }, [suggestedName, products]);

  // Auto-suggest product name and reset form when modal opens
  useEffect(() => {
    if (open) {
      setName(suggestedName);
      setCategoryId(categories[0]?.id || null);
      setIsHotDeals(false);
      setItems(selectedItems);

      // Auto-select mode based on matching products
      if (matchingProducts.length > 0) {
        setMode("existing");
        setSelectedProductId(matchingProducts[0].id);
      } else {
        setMode("new");
        setSelectedProductId(null);
      }
    }
  }, [open, selectedItems, categories, suggestedName, matchingProducts]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving && items.length > 0) {
          if (mode === "existing" && selectedProductId) {
            handleSave();
          } else if (mode === "new" && name.trim() && categoryId) {
            handleSave();
          }
        }
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        if (!saving) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, saving, mode, name, categoryId, selectedProductId, items.length, onClose]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const removeItem = (itemId: number) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleSave = async () => {
    if (!token || items.length === 0) return;

    // Validation based on mode
    if (mode === "existing" && !selectedProductId) return;
    if (mode === "new" && (!name.trim() || !categoryId)) return;

    setSaving(true);

    try {
      if (mode === "existing") {
        // Add variants to existing product
        console.log(
          "[BulkProductCreationModal] Adding variants to existing product:",
          selectedProductId
        );

        // Create variants one by one
        const promises = items.map((item) =>
          createVariant(
            token,
            {
              item: item.id,
              parent_id: selectedProductId!,
            },
            items
          )
        );

        await Promise.all(promises);

        // Dispatch events to trigger reload
        window.dispatchEvent(new Event("ekatalog:products_update"));
        window.dispatchEvent(new Event("ekatalog:variants_update"));

        // Call success callback
        onSuccess();
        onClose();
      } else {
        // Create new product with variants
        const variantsData = items.map((item) => ({
          item: item.id,
        }));

        const payload = {
          product_name: name.trim(),
          item_category: categoryId,
          hot_deals: isHotDeals ? 1 : 0,
          variants: variantsData,
        };

        const headers = getAuthHeaders(token);
        const url = getResourceUrl(API_CONFIG.ENDPOINTS.PRODUCT);

        console.log("[BulkProductCreationModal] Creating product:", url);
        console.log(
          "[BulkProductCreationModal] Payload:",
          JSON.stringify(payload, null, 2)
        );

        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("[BulkProductCreationModal] ✅ Product created successfully!");
          console.log("[BulkProductCreationModal] Response:", responseData);
          console.log("[BulkProductCreationModal] Product ID:", responseData.data?.id);
          console.log("[BulkProductCreationModal] Expected variants:", items.length);

          // Dispatch events to trigger reload
          console.log("[BulkProductCreationModal] Dispatching events...");
          window.dispatchEvent(new Event("ekatalog:products_update"));
          window.dispatchEvent(new Event("ekatalog:variants_update"));

          // Small delay to ensure events are processed
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Call success callback
          onSuccess();
          onClose();
        } else {
          const errorText = await response.text();
          console.error(
            "[BulkProductCreationModal] Product creation failed:",
            response.status,
            errorText
          );

          let errorMessage = "Unknown error";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.exc || errorText;
          } catch {
            errorMessage = errorText;
          }

          if (response.status === 401) {
            alert("Session expired. Please login again.");
          } else if (
            response.status === 409 ||
            errorMessage.toLowerCase().includes("duplicate")
          ) {
            alert(
              `Product name "${name}" already exists. Please choose a different name.`
            );
          } else {
            alert(`Gagal membuat produk: ${errorMessage}`);
          }
        }
      }
    } catch (error) {
      console.error("[BulkProductCreationModal] Error:", error);
      alert(
        `Gagal menyimpan. Silakan coba lagi.\n\nError: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const canSave =
    !saving &&
    items.length > 0 &&
    (mode === "existing"
      ? selectedProductId !== null
      : name.trim() && categoryId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={saving ? undefined : onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {mode === "existing"
                    ? "Add to Existing Product"
                    : "Create New Product"}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {selectedItems.length} items selected
                  {matchingProducts.length > 0 &&
                    ` · ${matchingProducts.length} matching product(s) found`}
                </p>
              </div>

              <button
                onClick={onClose}
                disabled={saving}
                className="p-2 hover:bg-white/20 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Mode Selector */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
              <label className="block text-sm font-semibold text-blue-900 mb-3">
                Action
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Add to Existing Option */}
                <button
                  onClick={() => setMode("existing")}
                  disabled={saving || matchingProducts.length === 0}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    mode === "existing"
                      ? "bg-white border-blue-500 shadow-lg"
                      : "bg-white/50 border-gray-200 hover:border-blue-300"
                  } ${
                    matchingProducts.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaLink
                      className={`w-5 h-5 ${
                        mode === "existing" ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-bold ${
                        mode === "existing" ? "text-blue-900" : "text-gray-600"
                      }`}
                    >
                      Add to Existing
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {matchingProducts.length > 0
                      ? `Found ${matchingProducts.length} matching product(s)`
                      : "No matching products found"}
                  </p>
                </button>

                {/* Create New Option */}
                <button
                  onClick={() => setMode("new")}
                  disabled={saving}
                  className={`p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                    mode === "new"
                      ? "bg-white border-blue-500 shadow-lg"
                      : "bg-white/50 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaPlus
                      className={`w-5 h-5 ${
                        mode === "new" ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-bold ${
                        mode === "new" ? "text-blue-900" : "text-gray-600"
                      }`}
                    >
                      Create New
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Create a new product with these items
                  </p>
                </button>
              </div>
            </div>

            {/* Conditional Fields based on Mode */}
            {mode === "existing" ? (
              /* Existing Product Selector */
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaLink className="inline w-4 h-4 mr-2 mb-0.5" />
                  Select Product <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProductId || ""}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  disabled={saving}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {matchingProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1.5">
                  Items will be added as variants to the selected product
                </p>
              </div>
            ) : (
              /* Create New Product Fields */
              <>
                {/* Product Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaTag className="inline w-4 h-4 mr-2 mb-0.5" />
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Auto-suggested from first selected item. You can edit this
                    name.
                  </p>
                </div>

                {/* Category Select */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaLayerGroup className="inline w-4 h-4 mr-2 mb-0.5" />
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryId || ""}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    disabled={saving}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hot Deals Toggle */}
                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isHotDeals}
                      onChange={(e) => setIsHotDeals(e.target.checked)}
                      disabled={saving}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500 disabled:cursor-not-allowed"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <FaFire className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-gray-700 group-hover:text-red-600 transition-colors">
                          Hot Deals
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Mark this product as featured/hot deals
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}

            {/* Selected Items Preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Selected Items ({items.length})
                </label>
                {items.length === 0 && (
                  <span className="text-xs text-red-600 font-medium">
                    At least 1 item required
                  </span>
                )}
              </div>

              {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto bg-gray-50 rounded-xl p-4 border border-gray-200">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 group hover:border-blue-300 transition-all"
                    >
                      {/* Image */}
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <Image
                            width={48}
                            height={48}
                            src={item.image}
                            alt={item.name}
                            unoptimized
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <FaBox className="w-6 h-6 text-gray-300" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {item.code}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={saving}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove item"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500">
                    All items removed. Please add at least 1 item.
                  </p>
                </div>
              )}
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                {mode === "existing" ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Action:</span>
                      <span className="font-semibold text-blue-900">
                        Add to Existing Product
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Product:</span>
                      <span className="font-semibold text-blue-900">
                        {selectedProduct?.name || "(Not selected)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">New Variants:</span>
                      <span className="font-semibold text-blue-900">
                        {items.length} items
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Action:</span>
                      <span className="font-semibold text-blue-900">
                        Create New Product
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Product Name:</span>
                      <span className="font-semibold text-blue-900">
                        {name || "(Not set)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Category:</span>
                      <span className="font-semibold text-blue-900">
                        {selectedCategory?.name || "(Not selected)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Items/Variants:</span>
                      <span className="font-semibold text-blue-900">
                        {items.length} items
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Hot Deals:</span>
                      <span className="font-semibold text-blue-900">
                        {isHotDeals ? "Yes" : "No"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={canSave ? { scale: 1.02 } : {}}
              whileTap={canSave ? { scale: 0.98 } : {}}
              onClick={handleSave}
              disabled={!canSave}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "existing" ? "Adding..." : "Creating..."}
                </>
              ) : (
                <>
                  {mode === "existing" ? (
                    <>
                      <FaLink className="w-4 h-4" />
                      Add to Product
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      Create Product
                    </>
                  )}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
