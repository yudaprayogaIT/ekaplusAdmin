// src/components/workflows/AddWorkflowModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaProjectDiagram } from "react-icons/fa";
import type { Workflow } from "./WorkflowList";

const SNAP_KEY = "ekaplus_workflows_snapshot";

const COLOR_OPTIONS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
];

const DOCUMENT_TYPES = [
  { value: 'customer', label: 'Customer Registration' },
  { value: 'item', label: 'Item/Product' },
  { value: 'credit', label: 'Credit Limit' },
  { value: 'order', label: 'Order' },
  { value: 'return', label: 'Return/Refund' },
];

export default function AddWorkflowModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Workflow | null;
}) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [documentType, setDocumentType] = useState("customer");
  const [isActive, setIsActive] = useState(true);
  const [color, setColor] = useState("#3B82F6");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setDisplayName(initial.display_name ?? "");
      setDescription(initial.description ?? "");
      setDocumentType(initial.document_type ?? "customer");
      setIsActive(initial.is_active ?? true);
      setColor(initial.color ?? "#3B82F6");
    } else {
      setName("");
      setDisplayName("");
      setDescription("");
      setDocumentType("customer");
      setIsActive(true);
      setColor("#3B82F6");
    }
  }, [initial, open]);

  // Auto-generate name from display name
  useEffect(() => {
    if (!initial && displayName) {
      const auto = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      setName(auto);
    }
  }, [displayName, initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const now = new Date().toISOString();
    const payload: Partial<Workflow> = {
      name: name.trim(),
      display_name: displayName.trim(),
      description: description.trim(),
      document_type: documentType,
      is_active: isActive,
      initial_state: "draft",
      color,
      icon: "project-diagram",
      updated_at: now,
    };

    try {
      const raw = localStorage.getItem(SNAP_KEY);
      let list: Workflow[] = raw ? JSON.parse(raw) : [];
      
      if (initial && initial.id) {
        list = list.map((w) => (w.id === initial.id ? { ...w, ...payload, id: initial.id } as Workflow : w));
      } else {
        const newWorkflow: Workflow = {
          id: `wf_${Date.now()}`,
          ...payload,
          created_by: "admin",
          created_at: now,
        } as Workflow;
        list.push(newWorkflow);
      }
      
      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekaplus:workflows_update"));
    } catch (error) {
      console.error('Failed to save workflow:', error);
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaProjectDiagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {initial ? "Edit Workflow" : "Tambah Workflow Baru"}
                    </h3>
                    <p className="text-purple-100 text-sm">
                      {initial ? "Perbarui konfigurasi workflow" : "Buat workflow approval baru"}
                    </p>
                  </div>
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
            <form onSubmit={submit} className="p-6 space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Workflow <span className="text-red-500">*</span>
                </label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Registrasi Member"
                  required
                />
              </div>

              {/* Name (slug) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Sistem <span className="text-red-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-mono text-sm"
                  placeholder="member_registration"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Nama unik untuk sistem (tanpa spasi)</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  rows={3}
                  placeholder="Jelaskan tujuan workflow ini..."
                />
              </div>

              {/* Document Type & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipe Dokumen <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    {DOCUMENT_TYPES.map(dt => (
                      <option key={dt.value} value={dt.value}>{dt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex gap-3">
                    <label
                      className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isActive
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={isActive}
                        onChange={() => setIsActive(true)}
                        className="sr-only"
                      />
                      <span className="font-medium">Active</span>
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        !isActive
                          ? 'border-gray-500 bg-gray-50 text-gray-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={!isActive}
                        onChange={() => setIsActive(false)}
                        className="sr-only"
                      />
                      <span className="font-medium">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Warna
                </label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-xl transition-all ${
                        color === c
                          ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
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
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{initial ? "Simpan Perubahan" : "Tambah Workflow"}</span>
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