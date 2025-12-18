// src/components/types/AddTypeModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaImage, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getResourceUrl, getAuthHeaders, API_CONFIG } from "@/config/api";

type ItemType = {
  id?: number;
  name: string;
  image?: string;
  description?: string;
  type_name: string;
  docstatus: number;
  status: string;
  disabled: number;
  updated_at?: string;
  updated_by?: { id: number; name: string };
  created_at?: string;
  created_by?: { id: number; name: string };
  owner?: { id: number; name: string };
};

export default function AddTypeModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: ItemType | null;
}) {
  const { token: authToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (initial) {
      setName(initial.name ?? "");
      setDescription(initial.description ?? "");
      setImagePath(initial.image ?? "");
      setImagePreview(initial.image ?? null);
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setImagePath("");
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initial, open]);

  // Image file preview
  useEffect(() => {
    if (!imageFile) return;
    const fr = new FileReader();
    fr.onload = () => {
      setImagePreview(String(fr.result));
      setImagePath(String(fr.result));
    };
    fr.readAsDataURL(imageFile);
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

    const apiPayload = {
      name: name.trim(),
      type_name: name.trim(),
      description: description.trim() || null,
      image: imagePath.trim() || null,
      docstatus: 0, // 0 = Draft, 1 = Submitted
      disabled: 0,
    };

    try {
      if (!authToken) {
        throw new Error("Not authenticated");
      }

      const headers = getAuthHeaders(authToken);

      let response;

      if (initial && initial.id) {
        // UPDATE existing type
        response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.TYPE, initial.id),
          {
            method: "PUT",
            headers,
            body: JSON.stringify(apiPayload),
          }
        );
      } else {
        // CREATE new type
        response = await fetch(getResourceUrl(API_CONFIG.ENDPOINTS.TYPE), {
          method: "POST",
          headers,
          body: JSON.stringify(apiPayload),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to save type (${response.status})`
        );
      }

      const result = await response.json();
      console.log("Type saved successfully:", result);

      // Trigger reload in TypeList
      window.dispatchEvent(new Event("ekatalog:types_update"));

      setSaving(false);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save type:", err);
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {initial ? "Edit Tipe Item" : "Tambah Tipe Item Baru"}
                  </h3>
                  <p className="text-red-100 text-sm">
                    {initial
                      ? "Perbarui informasi tipe item"
                      : "Lengkapi form untuk menambahkan tipe item"}
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

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Tipe <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Contoh: Material Springbed, Furniture, dll"
                  required
                />
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
                  placeholder="Deskripsi singkat tipe item..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gambar Tipe
                </label>
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 cursor-pointer transition-all group">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <FaImage className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                        Upload Gambar
                      </span>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setImageFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </label>

                  {imagePreview && (
                    <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-500 text-white p-1 rounded-full">
                          <FaCheckCircle className="w-4 h-4" />
                        </div>
                      </div>
                      <Image
                        src={imagePreview}
                        alt="image preview"
                        width={1000}
                        height={1000}
                        className="object-contain w-full h-full p-3"
                      />
                    </div>
                  )}

                  <input
                    value={imagePath}
                    onChange={(e) => {
                      setImagePath(e.target.value);
                      setImagePreview(e.target.value || null);
                    }}
                    placeholder="atau path: /images/type/..."
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
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
                    <span>{initial ? "Simpan Perubahan" : "Tambah Tipe"}</span>
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
