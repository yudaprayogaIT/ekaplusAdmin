// src/components/permissions/AddPermissionModal.tsx
"use client";

import React, {
  useState,
  useEffect,
} from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  FaTimes,
  FaSave,
  FaShieldAlt,
} from "react-icons/fa";
import { Permission } from "./PermissionList";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  getAuthHeadersFormData,
  apiFetch,
} from "@/config/api";

export default function AddPermissionModal({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: Permission | null;
}) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.Name || "");
        setSlug(initialData.Slug || "");
      } else {
        setName("");
        setSlug("");
      }
    }
  }, [open, initialData]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditMode) {
      // Only auto-generate slug when creating new permission
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
      setSlug(generatedSlug);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !slug.trim()) {
      alert("Nama dan Slug wajib diisi!");
      return;
    }

    if (!token) return;

    setLoading(true);

    try {
      const headers = getAuthHeadersFormData(token);

      // Create FormData
      const formData = new FormData();
      formData.append("Name", name.trim());
      formData.append("Slug", slug.trim());

      let response;
      if (isEditMode && initialData) {
        // Update existing permission
        const UPDATE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_PERMISSION}/${initialData.ID}`;
        console.log("[AddPermissionModal] Updating permission at:", UPDATE_URL);
        response = await apiFetch(UPDATE_URL, {
          method: "PUT",
          headers,
          body: formData,
        });
      } else {
        // Create new permission
        const CREATE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_PERMISSION}`;
        console.log("[AddPermissionModal] Creating permission at:", CREATE_URL);
        console.log("[AddPermissionModal] FormData fields:", {
          Name: name.trim(),
          Slug: slug.trim(),
        });
        response = await apiFetch(CREATE_URL, {
          method: "POST",
          headers,
          body: formData,
        });
      }

      console.log("[AddPermissionModal] Response status:", response.status);

      if (response.ok) {
        window.dispatchEvent(new Event("ekatalog:permissions_update"));
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditMode ? "update" : "create"} permission`
        );
      }
    } catch (error) {
      console.error("Failed to save permission:", error);
      alert(
        error instanceof Error
          ? error.message
          : `Gagal ${
              isEditMode ? "mengupdate" : "membuat"
            } permission. Silakan coba lagi.`
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaShieldAlt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditMode ? "Edit Permission" : "Tambah Permission Baru"}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEditMode
                    ? "Update informasi permission"
                    : "Buat permission baru untuk sistem"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Permission <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Read, Create, Update, Delete"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Slug Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., read, create, update, delete"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Slug akan digunakan sebagai identifier unik. Gunakan lowercase
                dan underscore.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isEditMode ? "Mengupdate..." : "Menyimpan..."}</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    <span>{isEditMode ? "Update" : "Simpan"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
