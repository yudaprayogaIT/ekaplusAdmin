// src/components/roles/AddRoleModal.tsx
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
  FaUserShield,
} from "react-icons/fa";
import { Role } from "./RoleList";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  getAuthHeadersFormData,
  apiFetch,
} from "@/config/api";

export default function AddRoleModal({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData?: Role | null;
}) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [is_system, setIsSystem] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.Name || "");
        setSlug(initialData.Slug || "");
        setDescription(initialData.Description || "");
        setIsSystem(initialData.IsSystem || false);
      } else {
        setName("");
        setSlug("");
        setDescription("");
        setIsSystem(false);
      }
    }
  }, [open, initialData]);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditMode) {
      // Only auto-generate slug when creating new role
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

      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append("Name", name.trim());
      formData.append("Slug", slug.trim());
      formData.append("Description", description.trim());
      formData.append("IsSystem", is_system ? "1" : "0");

      let response;
      if (isEditMode && initialData) {
        // Update existing role
        const UPDATE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}/${initialData.ID}`;
        console.log("[AddRoleModal] Updating role at:", UPDATE_URL);
        response = await apiFetch(UPDATE_URL, {
          method: "PUT",
          headers,
          body: formData,
        });
      } else {
        // Create new role
        const CREATE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`;
        console.log("[AddRoleModal] Creating role at:", CREATE_URL);
        console.log("[AddRoleModal] FormData fields:", {
          Name: name.trim(),
          Slug: slug.trim(),
          Description: description.trim(),
          IsSystem: is_system ? "1" : "0",
        });
        response = await apiFetch(CREATE_URL, {
          method: "POST",
          headers,
          body: formData,
        });
      }

      console.log("[AddRoleModal] Response status:", response.status);

      if (response.ok) {
        window.dispatchEvent(new Event("ekatalog:roles_update"));
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditMode ? "update" : "create"} role`
        );
      }
    } catch (error) {
      console.error("Failed to save role:", error);
      alert(
        error instanceof Error
          ? error.message
          : `Gagal ${
              isEditMode ? "mengupdate" : "membuat"
            } role. Silakan coba lagi.`
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
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <FaUserShield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditMode ? "Edit Role" : "Tambah Role Baru"}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEditMode
                    ? "Update informasi role"
                    : "Buat role baru untuk sistem"}
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
                Nama Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Product Manager"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required
                disabled={initialData?.IsSystem}
              />
              {initialData?.IsSystem && (
                <p className="text-xs text-gray-500 mt-1">
                  System roles cannot change their name
                </p>
              )}
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
                placeholder="e.g., product_manager"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono text-sm"
                required
                disabled={initialData?.IsSystem}
              />
              {initialData?.IsSystem && (
                <p className="text-xs text-gray-500 mt-1">
                  System roles cannot change their slug
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Slug akan digunakan sebagai identifier unik. Gunakan lowercase
                dan underscore.
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan fungsi dan tanggung jawab role ini..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* IsSystem Field */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="is_system"
                  checked={is_system}
                  onChange={(e) => setIsSystem(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={initialData?.IsSystem}
                />
                <div className="flex-1">
                  <label
                    htmlFor="is_system"
                    className="block text-sm font-semibold text-blue-900 mb-1 cursor-pointer"
                  >
                    System Role (Admin Web Access)
                  </label>
                  {initialData?.IsSystem && (
                    <p className="text-xs text-blue-600 mt-2 italic">
                      System roles cannot change this setting
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* System Role Warning */}
            {initialData?.IsSystem && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaUserShield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      System Role
                    </p>
                    <p className="text-sm text-blue-700">
                      Ini adalah system role. Nama dan slug tidak dapat diubah.
                      Hanya deskripsi yang dapat diupdate.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
