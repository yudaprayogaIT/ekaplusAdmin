// src/components/types/AddTypeModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUpload } from "react-icons/fa";

type ItemType = {
  id?: number;
  name: string;
  image?: string;
  description?: string;
  type_name: string;
  status?: string;
};

const SNAP_KEY = "ekatalog_types_snapshot";

export default function AddTypeModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: ItemType | null;
}) {
  const [name, setName] = useState("");
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("Enabled");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setTypeName(initial.type_name ?? "");
      setDescription(initial.description ?? "");
      setImagePath(initial.image ?? "");
      setStatus(initial.status ?? "Enabled");
      setPreview(initial.image ?? null);
      setImageFile(null);
    } else {
      setName("");
      setTypeName("");
      setDescription("");
      setImagePath("");
      setStatus("Enabled");
      setPreview(null);
      setImageFile(null);
    }
  }, [initial, open]);

  // Image file preview
  useEffect(() => {
    if (!imageFile) return;
    const fr = new FileReader();
    fr.onload = () => {
      setPreview(String(fr.result));
      setImagePath(String(fr.result));
    };
    fr.readAsDataURL(imageFile);
  }, [imageFile]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: name.trim(),
      type_name: typeName.trim() || name.trim(),
      description: description || undefined,
      image: imagePath || undefined,
      docstatus: 1,
      status,
      disabled: 0,
    };

    try {
      // Update local snapshot
      const raw = localStorage.getItem(SNAP_KEY);
      let list: ItemType[] = raw ? JSON.parse(raw) : [];

      if (initial && initial.id) {
        list = list.map((t) =>
          t.id === initial.id ? { ...t, ...payload } : t
        );
      } else {
        const maxId = list.reduce(
          (m: number, it: ItemType) => Math.max(m, Number(it.id) || 0),
          0
        );
        list.push({ id: maxId + 1, ...payload });
      }

      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekatalog:types_update"));
    } catch {}

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
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                {initial ? "Edit Type" : "Add New Type"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="e.g. Material Springbed"
                  required
                />
              </div>

              {/* Type Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type Name
                </label>
                <input
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Will use Name if empty"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Deskripsi singkat tipe..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 cursor-pointer transition-colors">
                      <FaUpload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Upload Image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setImageFile(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />
                    </label>
                  </div>

                  {preview && (
                    <div className="w-32 h-24 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <input
                  value={imagePath}
                  onChange={(e) => {
                    setImagePath(e.target.value);
                    setPreview(e.target.value || null);
                  }}
                  placeholder="atau masukkan path: assets/images/type/..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all mt-2"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-red-200 transition-all font-medium disabled:opacity-50"
                >
                  {saving ? "Saving..." : initial ? "Save Changes" : "Add Type"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
