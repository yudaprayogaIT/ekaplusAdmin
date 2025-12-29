// src/components/banners/AddBannerModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaImage, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
  getResourceUrl,
  getAuthHeadersFormData,
  getQueryUrl,
  getFileUrl,
  API_CONFIG,
  apiFetch,
} from "@/config/api";
import type { Banner, BannerType } from "@/types/banner";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import UnsavedChangesDialog from "@/components/ui/UnsavedChangesDialog";

type Product = {
  id: number;
  name: string;
  product_name: string;
};

type Category = {
  id: number;
  name: string;
  category_name: string;
};

export default function AddBannerModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Banner | null;
}) {
  const { token: authToken } = useAuth();
  const [bannerName, setBannerName] = useState("");
  const [type, setType] = useState<BannerType>("url");
  const [typeValue, setTypeValue] = useState("");
  const [disabled, setDisabled] = useState<0 | 1>(0);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUuid, setImageUuid] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For product and category selectors
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Track initial state for dirty checking
  const [initialState, setInitialState] = useState({
    bannerName: "",
    type: "url" as BannerType,
    typeValue: "",
    disabled: 0 as 0 | 1,
    displayOrder: 1,
    startDate: "",
    endDate: "",
    imageUuid: "",
  });

  // Check if form is dirty
  const isDirty =
    bannerName !== initialState.bannerName ||
    type !== initialState.type ||
    typeValue !== initialState.typeValue ||
    disabled !== initialState.disabled ||
    displayOrder !== initialState.displayOrder ||
    startDate !== initialState.startDate ||
    endDate !== initialState.endDate ||
    imageUuid !== initialState.imageUuid ||
    imageFile !== null;

  // Unsaved changes hook
  const { showConfirm, handleClose, handleConfirmClose, handleCancelClose } =
    useUnsavedChanges({ isDirty, onClose });

  useEffect(() => {
    setError(null);
    if (initial) {
      const imageUrl = initial.image ?? "";
      const imageUuidMatch = imageUrl.match(/\/files\/(.+)$/);
      const imageUuidExtracted = imageUuidMatch ? imageUuidMatch[1] : imageUrl;

      setBannerName(initial.banner_name ?? "");
      setType(initial.type);
      setTypeValue(initial.type_value ?? "");
      setDisabled(initial.disabled);
      setDisplayOrder(initial.display_order ?? 1);
      setStartDate(initial.start_date ? initial.start_date.slice(0, 16) : "");
      setEndDate(initial.end_date ? initial.end_date.slice(0, 16) : "");
      setImageUuid(imageUuidExtracted);
      setImagePreview(initial.image || null);
      setImageFile(null);

      // Set initial state for dirty checking
      setInitialState({
        bannerName: initial.banner_name ?? "",
        type: initial.type,
        typeValue: initial.type_value ?? "",
        disabled: initial.disabled,
        displayOrder: initial.display_order ?? 1,
        startDate: initial.start_date ? initial.start_date.slice(0, 16) : "",
        endDate: initial.end_date ? initial.end_date.slice(0, 16) : "",
        imageUuid: imageUuidExtracted,
      });
    } else {
      setBannerName("");
      setType("url");
      setTypeValue("");
      setDisabled(0);
      setDisplayOrder(1);
      setStartDate("");
      setEndDate("");
      setImageUuid("");
      setImagePreview(null);
      setImageFile(null);

      // Set initial state for dirty checking
      setInitialState({
        bannerName: "",
        type: "url",
        typeValue: "",
        disabled: 0,
        displayOrder: 1,
        startDate: "",
        endDate: "",
        imageUuid: "",
      });
    }
  }, [initial, open]);

  // Load products when type is 'product'
  useEffect(() => {
    if (type === "product" && products.length === 0 && authToken) {
      setLoadingProducts(true);
      async function loadProducts() {
        try {
          const productsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.PRODUCT, {
            fields: ["id", "name", "product_name"],
          });
          const res = await apiFetch(productsUrl, { method: "GET" }, authToken);
          if (res.ok) {
            const data = await res.json();
            setProducts(
              data.data.map((p: { id: number; name: string; product_name: string }) => ({
                id: p.id,
                name: p.name,
                product_name: p.product_name,
              }))
            );
          }
        } catch (err) {
          console.error("Failed to load products:", err);
        } finally {
          setLoadingProducts(false);
        }
      }
      loadProducts();
    }
  }, [type, authToken, products.length]);

  // Load categories when type is 'category'
  useEffect(() => {
    if (type === "category" && categories.length === 0 && authToken) {
      setLoadingCategories(true);
      async function loadCategories() {
        try {
          const categoriesUrl = getQueryUrl(API_CONFIG.ENDPOINTS.CATEGORY, {
            fields: ["id", "name", "category_name"],
          });
          const res = await apiFetch(categoriesUrl, { method: "GET" }, authToken);
          if (res.ok) {
            const data = await res.json();
            setCategories(
              data.data.map((c: { id: number; name: string; category_name: string }) => ({
                id: c.id,
                name: c.name,
                category_name: c.category_name,
              }))
            );
          }
        } catch (err) {
          console.error("Failed to load categories:", err);
        } finally {
          setLoadingCategories(false);
        }
      }
      loadCategories();
    }
  }, [type, authToken, categories.length]);

  // Image file preview
  useEffect(() => {
    if (!imageFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) {
          const form = document.querySelector("form");
          if (form) {
            form.requestSubmit();
          }
        }
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        if (!saving) {
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, saving, handleClose]);

  // Validate type value based on type
  function validateTypeValue(): string | null {
    if (type === "none") return null;

    if (!typeValue || typeValue.trim() === "") {
      return `Silakan isi nilai untuk tipe ${type}`;
    }

    switch (type) {
      case "url":
        try {
          new URL(typeValue);
          return null;
        } catch {
          return "Silakan masukkan URL yang valid (contoh: https://example.com)";
        }

      case "product":
      case "category":
        if (!/^\d+$/.test(typeValue)) {
          return "Silakan pilih item yang valid";
        }
        return null;

      case "internal_route":
        if (!typeValue.startsWith("/")) {
          return "Route harus dimulai dengan /";
        }
        return null;

      default:
        return null;
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!authToken) {
        throw new Error("Not authenticated");
      }

      // Validate type value
      const typeValueError = validateTypeValue();
      if (typeValueError) {
        throw new Error(typeValueError);
      }

      // Validate date range
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        throw new Error("Tanggal selesai harus setelah tanggal mulai");
      }

      // Validate image
      if (!imageFile && !imageUuid) {
        throw new Error("Silakan upload gambar banner");
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("name", bannerName.trim());
      formData.append("banner_name", bannerName.trim());
      formData.append("type", type);
      formData.append("type_value", type === "none" ? "" : typeValue.trim());
      formData.append("disabled", disabled.toString());
      formData.append("display_order", displayOrder.toString());
      formData.append("start_date", startDate || "");
      formData.append("end_date", endDate || "");
      formData.append("docstatus", "0");

      // Handle image upload
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUuid) {
        formData.append("image", imageUuid.trim());
      }

      const headers = getAuthHeadersFormData(authToken);

      let response;

      if (initial && initial.id) {
        // UPDATE existing banner
        response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.BANNER, initial.id),
          {
            method: "PUT",
            headers,
            body: formData,
          }
        );
      } else {
        // CREATE new banner
        response = await fetch(getResourceUrl(API_CONFIG.ENDPOINTS.BANNER), {
          method: "POST",
          headers,
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to save banner (${response.status})`
        );
      }

      const result = await response.json();
      console.log("Banner saved successfully:", result);

      // Trigger reload in BannerList
      window.dispatchEvent(new Event("ekatalog:banners_update"));

      setSaving(false);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save banner:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setSaving(false);
    }
  }

  // Render type value field based on selected type
  function renderTypeValueField() {
    switch (type) {
      case "url":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              placeholder="https://www.ekatunggal.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL eksternal yang akan dibuka saat banner diklik
            </p>
          </div>
        );

      case "internal_route":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Internal Route <span className="text-red-500">*</span>
            </label>
            <select
              value={typeValue}
              onChange={(e) => setTypeValue(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              required
            >
              <option value="">Pilih route...</option>
              <option value="/home">Home</option>
              <option value="/products">Products</option>
              <option value="/categories">Categories</option>
              <option value="/profile">Profile</option>
              <option value="/wishlist">Wishlist</option>
              <option value="/orders">Orders</option>
              <option value="/cart">Cart</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Halaman internal yang akan dibuka di customer app
            </p>
          </div>
        );

      case "product":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product <span className="text-red-500">*</span>
            </label>
            {loadingProducts ? (
              <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-500">
                Memuat products...
              </div>
            ) : (
              <select
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                required
              >
                <option value="">Pilih product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id.toString()}>
                    {p.product_name || p.name} (ID: {p.id})
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Product yang akan ditampilkan saat banner diklik
            </p>
          </div>
        );

      case "category":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            {loadingCategories ? (
              <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-500">
                Memuat categories...
              </div>
            ) : (
              <select
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                required
              >
                <option value="">Pilih category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.category_name || c.name} (ID: {c.id})
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Category yang akan ditampilkan saat banner diklik
            </p>
          </div>
        );

      case "none":
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Banner ini hanya untuk display, tidak ada action saat diklik.
            </p>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {initial ? "Edit Banner" : "Tambah Banner Baru"}
                  </h3>
                  <p className="text-red-100 text-sm">
                    {initial
                      ? "Perbarui informasi banner"
                      : "Lengkapi form untuk menambahkan banner"}
                  </p>
                  <p className="text-red-200 text-xs mt-1 opacity-80">
                    💡 Tekan{" "}
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      Ctrl+S
                    </kbd>{" "}
                    untuk simpan atau{" "}
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      Esc
                    </kbd>{" "}
                    untuk batal
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto"
            >
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Banner Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Banner <span className="text-red-500">*</span>
                </label>
                <input
                  value={bannerName}
                  onChange={(e) => setBannerName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Contoh: Promo Lebaran 2025"
                  required
                />
              </div>

              {/* Banner Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipe Banner <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value as BannerType);
                    setTypeValue(""); // Reset type value when type changes
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value="url">URL (External Link)</option>
                  <option value="internal_route">Internal Route</option>
                  <option value="product">Product</option>
                  <option value="category">Category</option>
                  <option value="none">Display Only (No Action)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Tentukan aksi yang terjadi saat banner diklik
                </p>
              </div>

              {/* Type Value Field (conditional) */}
              {renderTypeValueField()}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gambar Banner <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all group hover:border-red-500 hover:bg-red-50">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-gray-100 group-hover:bg-red-100">
                      <FaImage className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                        Upload Gambar Banner
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WebP (Max 5MB) - Rekomendasi: 1920x640px (3:1)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={saving}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            setError("Ukuran gambar terlalu besar. Maksimal 5MB");
                            return;
                          }
                          setImageFile(file);
                          setError(null);
                        }
                      }}
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative w-full bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200" style={{ aspectRatio: "3/1" }}>
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                          <FaCheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                      <Image
                        src={imagePreview}
                        alt="banner preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {imageFile && (
                        <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs truncate">
                          {imageFile.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Display Order & Enabled Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">Urutan tampil banner</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={disabled}
                    onChange={(e) => setDisabled(parseInt(e.target.value) as 0 | 1)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    <option value="0">Enabled</option>
                    <option value="1">Disabled</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Banner enabled atau disabled</p>
                </div>
              </div>

              {/* Schedule: Start Date & End Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Kosongkan jika langsung aktif
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Selesai
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Kosongkan jika tidak ada batas waktu
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{initial ? "Simpan Perubahan" : "Tambah Banner"}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Unsaved Changes Dialog */}
          <UnsavedChangesDialog
            open={showConfirm}
            onConfirm={handleConfirmClose}
            onCancel={handleCancelClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
