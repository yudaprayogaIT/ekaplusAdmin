// src/components/types/TypeList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaBox } from "react-icons/fa";
import Image from "next/image";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import AddTypeModal from "./AddTypeModal";

type ItemType = {
  id: number;
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

const DATA_URL = "/data/itemType.json";
const SNAP_KEY = "ekatalog_types_snapshot";

export default function TypeList() {
  const [types, setTypes] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<ItemType | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load types
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as ItemType[];
          if (!cancelled) {
            setTypes(data);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(data));
            } catch {}
          }
        } else {
          if (!cancelled) setError(`Failed to fetch (${res.status})`);
        }
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try {
        setTypes(JSON.parse(raw) as ItemType[]);
      } catch {}
    }
    window.addEventListener("ekatalog:types_update", handler);
    return () => window.removeEventListener("ekatalog:types_update", handler);
  }, []);

  function saveSnapshot(arr: ItemType[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:types_update"));
  }

  function promptDeleteType(type: ItemType) {
    setConfirmTitle("Hapus Type");
    setConfirmDesc(`Yakin ingin menghapus type "${type.name}"?`);
    actionRef.current = async () => {
      const next = types.filter((x) => x.id !== type.id);
      setTypes(next);
      saveSnapshot(next);
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(type: ItemType) {
    setModalInitial(type);
    setModalOpen(true);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) {
      await actionRef.current();
      actionRef.current = null;
    }
  }

  function confirmCancel() {
    actionRef.current = null;
    setConfirmOpen(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg">
          <span className="text-sm">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Item Types
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kelola tipe kategori produk
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all"
        >
          <FaPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Type</span>
        </motion.button>
      </div>

      {/* Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {types.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{
              y: -4,
              boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.2)",
            }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
              {type.image ? (
                <Image
                  width={400}
                  height={400}
                  src={type.image}
                  alt={type.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaBox className="w-12 h-12 text-gray-300" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    type.status === "Enabled"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      type.status === "Enabled" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  {type.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-base mb-2">
                {type.name}
              </h3>

              {type.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {type.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(type)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FaEdit className="w-3 h-3 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Edit
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => promptDeleteType(type)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                >
                  <FaTrash className="w-3 h-3 text-red-600" />
                  <span className="text-xs font-medium text-red-600">
                    Delete
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <AddTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
      />
    </div>
  );
}
