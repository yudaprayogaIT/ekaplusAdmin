"use client";

import React, { useState, useEffect } from "react";
import EntityFormModal from "@/components/entity-management/EntityFormModal";
import { FaUserShield } from "react-icons/fa";
import { Role } from "./RoleList";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, getAuthHeaders, apiFetch } from "@/config/api";

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
  const [isSystem, setIsSystem] = useState(true);
  const [loading, setLoading] = useState(false);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setName(initialData.Name || "");
      setSlug(initialData.Slug || "");
      setDescription(initialData.Description || "");
      setIsSystem(Boolean(initialData.IsSystem));
      return;
    }

    setName("");
    setSlug("");
    setDescription("");
    setIsSystem(true);
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
      const headers = getAuthHeaders(token);
      const payload = {
        Name: name.trim(),
        Slug: slug.trim(),
        Description: description.trim(),
        ...(isEditMode ? { IsSystem: isSystem } : { is_system: isSystem }),
      };

      let response;
      if (isEditMode && initialData) {
        const UPDATE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}/${initialData.ID}`;
        response = await apiFetch(UPDATE_URL, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        const CREATE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_ROLE}`;
        response = await apiFetch(CREATE_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        window.dispatchEvent(new Event("ekatalog:roles_update"));
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to ${isEditMode ? "update" : "create"} role`,
        );
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : `Gagal ${
              isEditMode ? "mengupdate" : "membuat"
            } role. Silakan coba lagi.`,
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
      icon={<FaUserShield className="w-5 h-5" />}
      title={isEditMode ? "Edit Role" : "Tambah Role Baru"}
      subtitle={
        isEditMode
          ? "Update informasi role"
          : "Buat role baru dengan pengaturan standar"
      }
      loading={loading}
      submitLabel={isEditMode ? "Update" : "Simpan"}
      loadingLabel={isEditMode ? "Mengupdate..." : "Menyimpan..."}
      accentClasses={{
        iconBg: "bg-gradient-to-br from-red-500 to-red-600",
        buttonBg: "bg-gradient-to-r from-red-500 to-red-600",
      }}
    >
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
          placeholder="e.g., product_manager"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono text-sm"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Slug akan digunakan sebagai identifier unik. Gunakan lowercase dan
          underscore.
        </p>
      </div>

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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Is System <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: true, label: "True" },
            { value: false, label: "False" },
          ].map((option) => (
            <label
              key={String(option.value)}
              className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                isSystem === option.value
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role_is_system"
                checked={isSystem === option.value}
                onChange={() => setIsSystem(option.value)}
                className="sr-only"
                disabled={loading}
              />
              {option.label}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Hanya role dengan nilai True yang tersedia saat memilih role user.
        </p>
      </div>
    </EntityFormModal>
  );
}
