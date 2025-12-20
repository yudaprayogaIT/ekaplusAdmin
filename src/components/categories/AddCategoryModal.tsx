// src/components/categories/AddCategoryModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUpload, FaImage, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import {
  getResourceUrl,
  getAuthHeadersFormData,
  API_CONFIG,
} from "@/config/api";
import { Category } from "./CategoryList";

type CategoryType = {
  id: number;
  name: string;
  type_name: string;
};

export default function AddCategoryModal({
  open,
  onClose,
  initial,
  types,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Category | null;
  types: CategoryType[];
}) {
  const { token: authToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [typeId, setTypeId] = useState<number>(1);
  const [iconUuid, setIconUuid] = useState("");
  const [imageUuid, setImageUuid] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (initial) {
      setName(initial.category_name ?? "");
      setDescription(initial.description ?? "");
      setTitle(initial.title ?? "");
      setSubtitle(initial.subtitle ?? "");
      setTypeId(initial.item_type ?? types[0]?.id ?? 1);

      // Extract UUID from full URL if present for icon
      const iconUrl = initial.icon ?? "";
      const iconUuidMatch = iconUrl.match(/\/files\/(.+)$/);
      const iconUuidExtracted = iconUuidMatch ? iconUuidMatch[1] : iconUrl;
      setIconUuid(iconUuidExtracted);
      setIconPreview(initial.icon || null);
      setIconFile(null);

      // Extract UUID from full URL if present for image
      const imageUrl = initial.image ?? "";
      const imageUuidMatch = imageUrl.match(/\/files\/(.+)$/);
      const imageUuidExtracted = imageUuidMatch ? imageUuidMatch[1] : imageUrl;
      setImageUuid(imageUuidExtracted);
      setImagePreview(initial.image || null);
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setTitle("");
      setSubtitle("");
      setTypeId(types[0]?.id ?? 1);
      setIconUuid("");
      setImageUuid("");
      setIconPreview(null);
      setImagePreview(null);
      setIconFile(null);
      setImageFile(null);
    }
  }, [initial, open, types]);

  // Icon file preview
  useEffect(() => {
    if (!iconFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result as string);
    };
    reader.readAsDataURL(iconFile);
  }, [iconFile]);

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
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, saving, onClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!authToken) {
        throw new Error("Not authenticated");
      }

      // Prepare FormData for API - send file directly with data
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("category_name", name.trim());
      formData.append("description", description.trim() || "");
      formData.append("title", title.trim() || "");
      formData.append("subtitle", subtitle.trim() || "");
      formData.append("item_type", String(typeId));
      formData.append("status", "Draft");
      formData.append("docstatus", "0");
      formData.append("disabled", "0");

      // If new icon file, send the file object
      // If no new file but has UUID, send the UUID string
      if (iconFile) {
        formData.append("icon", iconFile);
      } else if (iconUuid) {
        formData.append("icon", iconUuid.trim());
      }

      // If new image file, send the file object
      // If no new file but has UUID, send the UUID string
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageUuid) {
        formData.append("image", imageUuid.trim());
      }

      const headers = getAuthHeadersFormData(authToken);

      let response;

      if (initial && initial.id) {
        // UPDATE existing category
        response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.CATEGORY, initial.id),
          {
            method: "PUT",
            headers,
            body: formData,
          }
        );
      } else {
        // CREATE new category
        response = await fetch(getResourceUrl(API_CONFIG.ENDPOINTS.CATEGORY), {
          method: "POST",
          headers,
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to save category (${response.status})`
        );
      }

      const result = await response.json();
      console.log("Category saved successfully:", result);

      // Trigger reload in CategoryList
      window.dispatchEvent(new Event("ekatalog:categories_update"));

      setSaving(false);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save category:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setSaving(false);
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
            onClick={onClose}
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
                    {initial ? "Edit Kategori" : "Tambah Kategori Baru"}
                  </h3>
                  <p className="text-red-100 text-sm">
                    {initial
                      ? "Perbarui informasi kategori"
                      : "Lengkapi form untuk menambahkan kategori"}
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
                  onClick={onClose}
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
              {/* Name & Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Kategori <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Contoh: HDP, Quilting, dll"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={typeId}
                    onChange={(e) => setTypeId(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                  rows={3}
                  placeholder="Deskripsi singkat kategori..."
                />
              </div>

              {/* Title & Subtitle Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Nyaman dilihat, nyaman dipakai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sub-judul
                  </label>
                  <input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Temukan pilihan motif terbaik"
                  />
                </div>
              </div>

              {/* Icon & Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Icon Kategori
                  </label>
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all group hover:border-red-500 hover:bg-red-50">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-gray-100 group-hover:bg-red-100">
                        <FaUpload className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                          Upload Icon
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, SVG (Max 5MB)
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
                            // Validate file size (5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              setError(
                                "Ukuran icon terlalu besar. Maksimal 5MB"
                              );
                              return;
                            }
                            setIconFile(file);
                            setError(null);
                          }
                        }}
                      />
                    </label>

                    {iconPreview && (
                      <div className="relative w-full h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                            <FaCheckCircle className="w-4 h-4" />
                          </div>
                        </div>
                        <Image
                          width={1000}
                          height={1000}
                          src={iconPreview}
                          alt="icon preview"
                          unoptimized
                          className="object-contain w-full h-full p-3"
                        />
                        {iconFile && (
                          <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs truncate">
                            {iconFile.name}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gambar Kategori
                  </label>
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-all group hover:border-red-500 hover:bg-red-50">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center transition-colors bg-gray-100 group-hover:bg-red-100">
                        <FaImage className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                          Upload Gambar
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG (Max 5MB)
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
                            // Validate file size (5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              setError(
                                "Ukuran gambar terlalu besar. Maksimal 5MB"
                              );
                              return;
                            }
                            setImageFile(file);
                            setError(null);
                          }
                        }}
                      />
                    </label>

                    {imagePreview && (
                      <div className="relative w-full h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                            <FaCheckCircle className="w-4 h-4" />
                          </div>
                        </div>
                        <Image
                          src={imagePreview}
                          alt="image preview"
                          width={1000}
                          height={1000}
                          unoptimized
                          className="object-cover w-full h-full"
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
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
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
                    <span>
                      {initial ? "Simpan Perubahan" : "Tambah Kategori"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
