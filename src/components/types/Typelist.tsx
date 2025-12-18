// src/components/types/TypeList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import TypeCard from "./TypeCard";
import AddTypeModal from "./AddTypeModal";
import TypeDetailModal from "./TypeDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FaPlus, FaSearch, FaList, FaTh } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  getFileUrl,
  API_CONFIG,
} from "@/config/api";

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

// API Response structure from SQL backend
type TypeAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    name: string;
    type_name: string;
    image?: string;
    description?: string;
    docstatus: number;
    status: string;
    disabled: number;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by: number;
    owner: number;
  }>;
  meta: Record<string, unknown>;
};

const SNAP_KEY = "ekatalog_types_snapshot";

export default function TypeList() {
  const { token, isAuthenticated } = useAuth();
  const [types, setTypes] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<ItemType | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<ItemType | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load types from SQL API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          setLoading(false);
          return;
        }

        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.TYPE, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await fetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as TypeAPIResponse;

          if (!cancelled) {
            // Map API response to ItemType
            const mappedTypes: ItemType[] = response.data.map((item) => ({
              id: item.id,
              name: item.name,
              type_name: item.type_name,
              image: getFileUrl(item.image),
              description: item.description || undefined,
              docstatus: item.docstatus,
              status: item.status,
              disabled: item.disabled,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }));

            console.log("Loaded types:", mappedTypes);
            setTypes(mappedTypes);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(mappedTypes));
            } catch (e) {
              console.error("Failed to save snapshot:", e);
            }
          }
        } else {
          if (!cancelled) {
            if (res.status === 401) {
              setError("Session expired. Silakan login kembali.");
            } else {
              setError(`Failed to fetch types (${res.status})`);
            }
          }
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
  }, [isAuthenticated, token]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      // Reload from API instead of localStorage
      if (!isAuthenticated || !token) return;

      try {
        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.TYPE, {
          fields: ["*"],
        });
        const headers = getAuthHeaders(token);

        const res = await fetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as TypeAPIResponse;

          const mappedTypes: ItemType[] = response.data.map((item) => ({
            id: item.id,
            name: item.name,
            type_name: item.type_name,
            image: getFileUrl(item.image),
            description: item.description,
            docstatus: item.docstatus,
            status: item.status,
            disabled: item.disabled,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));

          setTypes(mappedTypes);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedTypes));
        }
      } catch (error) {
        console.error("Failed to reload types:", error);
      }
    }

    window.addEventListener("ekatalog:types_update", handler);
    return () => window.removeEventListener("ekatalog:types_update", handler);
  }, [isAuthenticated, token]);

  function saveSnapshot(arr: ItemType[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:types_update"));
  }

  function promptDeleteType(t: ItemType) {
    setConfirmTitle("Hapus Tipe Item");
    setConfirmDesc(`Yakin ingin menghapus tipe "${t.name}"?`);
    actionRef.current = async () => {
      try {
        if (!token) {
          throw new Error("Not authenticated");
        }

        const headers = getAuthHeaders(token);

        const response = await fetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.TYPE, t.id),
          {
            method: "DELETE",
            headers,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete type (${response.status})`
          );
        }

        console.log("Type deleted successfully");

        // Remove from local state
        const next = types.filter((x) => x.id !== t.id);
        setTypes(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        console.error("Failed to delete type:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
      }
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(t: ItemType) {
    setModalInitial(t);
    setModalOpen(true);
  }

  function openDetail(t: ItemType) {
    setDetailItem(t);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(t: ItemType) {
    closeDetail();
    setTimeout(() => handleEdit(t), 80);
  }

  function onDetailDelete(t: ItemType) {
    closeDetail();
    setTimeout(() => promptDeleteType(t), 80);
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
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat tipe item...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Filter types by search
  let filteredTypes = types;

  if (searchQuery.trim()) {
    filteredTypes = filteredTypes.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Item Types
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola tipe item untuk kategori produk
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Tipe</span>
        </motion.button>
      </div>

      {/* Search & View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tipe item..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaTh className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Types Display */}
      {filteredTypes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada tipe item
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada tipe item yang ditambahkan"}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Semua Tipe Item
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredTypes.length} items
            </span>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredTypes.map((t) => (
              <TypeCard
                key={t.id}
                type={t}
                viewMode={viewMode}
                onEdit={() => handleEdit(t)}
                onDelete={() => promptDeleteType(t)}
                onView={() => openDetail(t)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddTypeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
      />

      <TypeDetailModal
        open={detailOpen}
        onClose={closeDetail}
        type={detailItem}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
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
