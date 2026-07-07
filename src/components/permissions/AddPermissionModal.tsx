"use client";

import React, { useState, useEffect } from "react";
import EntityFormModal from "@/components/entity-management/EntityFormModal";
import { FaShieldAlt } from "react-icons/fa";
import { Permission } from "./PermissionList";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, getAuthHeadersFormData, apiFetch } from "@/config/api";

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
    if (!open) return;

    if (initialData) {
      setName(initialData.Name || "");
      setSlug(initialData.Slug || "");
      return;
    }

    setName("");
    setSlug("");
  }, [open, initialData]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditMode) {
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
      const formData = new FormData();
      formData.append("Name", name.trim());
      formData.append("Slug", slug.trim());

      let response;
      if (isEditMode && initialData) {
        const updateUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_PERMISSION}/${initialData.ID}`;
        response = await apiFetch(updateUrl, {
          method: "PUT",
          headers,
          body: formData,
        });
      } else {
        const createUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_PERMISSION}`;
        response = await apiFetch(createUrl, {
          method: "POST",
          headers,
          body: formData,
        });
      }

      if (response.ok) {
        window.dispatchEvent(new Event("ekatalog:permissions_update"));
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditMode ? "update" : "create"} permission`,
        );
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : `Gagal ${
              isEditMode ? "mengupdate" : "membuat"
            } permission. Silakan coba lagi.`,
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <EntityFormModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      icon={<FaShieldAlt className="w-5 h-5" />}
      title={isEditMode ? "Edit Permission" : "Tambah Permission Baru"}
      subtitle={
        isEditMode
          ? "Update informasi permission"
          : "Buat permission baru untuk sistem"
      }
      loading={loading}
      submitLabel={isEditMode ? "Update" : "Simpan"}
      loadingLabel={isEditMode ? "Mengupdate..." : "Menyimpan..."}
      accentClasses={{
        iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
        buttonBg: "bg-gradient-to-r from-purple-500 to-purple-600",
      }}
    >
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
          Slug akan digunakan sebagai identifier unik. Gunakan lowercase dan
          underscore.
        </p>
      </div>
    </EntityFormModal>
  );
}
