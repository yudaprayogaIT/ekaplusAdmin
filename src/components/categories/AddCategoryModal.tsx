// src/components/categories/AddCategoryModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUpload, FaImage, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

type Category = {
  id?: number;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  title?: string;
  subtitle?: string;
  type: {
    id: number;
    name: string;
  };
  docstatus: number;
  status: string;
  disabled: number;
  updated_at?: string;
  updated_by?: { id: number; name: string };
  created_at?: string;
  created_by?: { id: number; name: string };
  owner?: { id: number; name: string };
};

type CategoryType = {
  id: number;
  name: string;
  type_name: string;
};

type StoredCategory = {
  id: number;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
  title?: string;
  subtitle?: string;
  type: {
    id: number;
    name: string;
  };
  docstatus: number;
  status: string;
  disabled: number;
  updated_at?: string;
  updated_by?: { id: number; name: string };
  created_at?: string;
  created_by?: { id: number; name: string };
  owner?: { id: number; name: string };
};

const SNAP_KEY = "ekatalog_categories_snapshot";

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [typeId, setTypeId] = useState<number>(1);
  const [iconPath, setIconPath] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setDescription(initial.description ?? "");
      setTitle(initial.title ?? "");
      setSubtitle(initial.subtitle ?? "");
      setTypeId(initial.type?.id ?? 1);
      setIconPath(initial.icon ?? "");
      setImagePath(initial.image ?? "");
      setIconPreview(initial.icon ?? null);
      setImagePreview(initial.image ?? null);
      setIconFile(null);
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setTitle("");
      setSubtitle("");
      setTypeId(types[0]?.id ?? 1);
      setIconPath("");
      setImagePath("");
      setIconPreview(null);
      setImagePreview(null);
      setIconFile(null);
      setImageFile(null);
    }
  }, [initial, open, types]);

  // Icon file preview
  useEffect(() => {
    if (!iconFile) return;
    const fr = new FileReader();
    fr.onload = () => {
      setIconPreview(String(fr.result));
      setIconPath(String(fr.result));
    };
    fr.readAsDataURL(iconFile);
  }, [iconFile]);

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const selectedType = types.find(t => t.id === typeId);
    const payload: Omit<StoredCategory, 'id'> = {
      name: name.trim(),
      description: description || undefined,
      title: title || undefined,
      subtitle: subtitle || undefined,
      type: {
        id: typeId,
        name: selectedType?.name || "",
      },
      icon: iconPath || undefined,
      image: imagePath || undefined,
      docstatus: 1,
      status: "Enabled",
      disabled: 0,
    };

    try {
      const raw = localStorage.getItem(SNAP_KEY);
      let list: StoredCategory[] = raw ? JSON.parse(raw) : [];
      
      if (initial && initial.id) {
        list = list.map((c) => (c.id === initial.id ? { ...c, ...payload, id: initial.id } : c));
      } else {
        const maxId = list.reduce((m: number, it: StoredCategory) => Math.max(m, Number(it.id) || 0), 0);
        const newCategory: StoredCategory = { 
          id: maxId + 1, 
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        list.push(newCategory);
      }
      
      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekatalog:categories_update"));
    } catch (error) {
      console.error('Failed to save category:', error);
    }
    
    setSaving(false);
    onClose();
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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          
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
                    {initial ? "Perbarui informasi kategori" : "Lengkapi form untuk menambahkan kategori"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
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
                    {types.map(type => (
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
                    <label className="flex flex-col items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 cursor-pointer transition-all group">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <FaUpload className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                          Upload Icon
                        </span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setIconFile(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>
                    
                    {iconPreview && (
                      <div className="relative w-full h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500 text-white p-1 rounded-full">
                            <FaCheckCircle className="w-4 h-4" />
                          </div>
                        </div>
                        <Image width={1000} height={1000} src={iconPreview} alt="icon preview" className="object-contain w-full h-full p-3" />
                      </div>
                    )}
                    
                    <input
                      value={iconPath}
                      onChange={(e) => {
                        setIconPath(e.target.value);
                        setIconPreview(e.target.value || null);
                      }}
                      placeholder="atau path: assets/icons/kategori/..."
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gambar Kategori
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
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>
                    
                    {imagePreview && (
                      <div className="relative w-full h-32 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500 text-white p-1 rounded-full">
                            <FaCheckCircle className="w-4 h-4" />
                          </div>
                        </div>
                        <Image src={imagePreview} alt="image preview" width={1000} height={1000} className="object-cover w-full h-full" />
                      </div>
                    )}
                    
                    <input
                      value={imagePath}
                      onChange={(e) => {
                        setImagePath(e.target.value);
                        setImagePreview(e.target.value || null);
                      }}
                      placeholder="atau path: assets/images/kategori/..."
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                    />
                  </div>
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
                    <span>{initial ? "Simpan Perubahan" : "Tambah Kategori"}</span>
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