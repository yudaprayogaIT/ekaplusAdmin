// src/components/wishlist/WishlistList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaSearch, FaList, FaTh, FaPlus } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchWishlist,
  removeFromWishlist,
  addToWishlist,
} from "@/services/wishlistService";
import {
  API_CONFIG,
  getQueryUrl,
  getAuthHeaders,
  getFileUrl,
} from "@/config/api";
import type { WishlistItem, Item } from "@/types";
import WishlistCard from "./WishlistCard";
import WishlistDetailModal from "./WishlistDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination, { usePagination } from "@/components/ui/Pagination";

export default function WishlistList() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState<WishlistItem | null>(
    null
  );

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    (() => Promise<void>) | null
  >(null);

  // Load data from API
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        if (!token) {
          console.error("No auth token found");
          setError("Session expired. Please login again.");
          setLoading(false);
          return;
        }

        // Load items from API
        const itemsUrl = getQueryUrl(API_CONFIG.ENDPOINTS.ITEM, {
          fields: ["*"],
        });
        const itemsRes = await fetch(itemsUrl, {
          headers: getAuthHeaders(token),
        });

        let itemsData: Item[] = [];
        if (itemsRes.ok) {
          const json = await itemsRes.json();
          itemsData = json.data.map(
            (i: {
              id: number;
              item_code: string;
              item_name: string;
              item_color?: string;
              ekatalog_type?: string;
              uom: string;
              image?: string;
              item_desc?: string;
              item_category?: string;
              item_group?: string;
              disabled?: number;
            }) => ({
              id: i.id,
              code: i.item_code,
              name: i.item_name,
              color: i.item_color || "",
              type: i.ekatalog_type || "",
              uom: i.uom,
              image: getFileUrl(i.image),
              description: i.item_desc,
              category: i.item_category,
              group: i.item_group,
              disabled: i.disabled,
            })
          );
        }

        // Load wishlist from API
        const wishlistData = await fetchWishlist(token, itemsData);

        if (!cancelled) {
          setItems(itemsData);
          setWishlist(wishlistData);
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
  }, [token]);

  // Listen for wishlist updates
  useEffect(() => {
    async function handler() {
      if (!token) return;
      try {
        const wishlistData = await fetchWishlist(token, items);
        setWishlist(wishlistData);
      } catch (err) {
        console.error("Failed to refresh wishlist:", err);
      }
    }
    window.addEventListener("ekatalog:wishlist_update", handler);
    return () =>
      window.removeEventListener("ekatalog:wishlist_update", handler);
  }, [items, token]);

  // Helper to refresh wishlist
  async function refreshWishlist() {
    if (!token) return;
    try {
      const wishlistData = await fetchWishlist(token, items);
      setWishlist(wishlistData);
      window.dispatchEvent(new Event("ekatalog:wishlist_update"));
    } catch (err) {
      console.error("Failed to refresh wishlist:", err);
    }
  }

  // View wishlist detail
  function viewDetail(w: WishlistItem) {
    setSelectedWishlist(w);
    setShowDetailModal(true);
  }

  // Prompt remove from wishlist
  function promptRemove(w: WishlistItem) {
    setConfirmAction(() => async () => {
      if (!token) return;
      try {
        await removeFromWishlist(token, w.id);
        await refreshWishlist();
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
        alert("Gagal menghapus dari wishlist. Silakan coba lagi.");
      }
    });
    setConfirmOpen(true);
  }

  // Handle add to wishlist
  async function handleAddToWishlist() {
    if (!selectedItemId || !token) return;

    setAdding(true);
    try {
      await addToWishlist(token, { item: selectedItemId }, items);
      await refreshWishlist();
      setShowAddModal(false);
      setSelectedItemId(null);
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
      alert("Gagal menambahkan ke wishlist. Silakan coba lagi.");
    } finally {
      setAdding(false);
    }
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (confirmAction) {
      await confirmAction();
      setConfirmAction(null);
    }
  }

  function confirmCancel() {
    setConfirmAction(null);
    setConfirmOpen(false);
  }

  // Filter wishlist (MUST be before early returns to comply with Hooks rules)
  let filteredWishlist = wishlist;

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredWishlist = filteredWishlist.filter(
      (w) =>
        w.item.name.toLowerCase().includes(query) ||
        w.item.code.toLowerCase().includes(query) ||
        w.item.category?.toLowerCase().includes(query)
    );
  }

  // Apply pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredWishlist, 20);

  // Get items not in wishlist for add modal
  const wishlistItemIds = new Set(wishlist.map((w) => w.item.id));
  const availableItems = items.filter((item) => !wishlistItemIds.has(item.id));

  // Early returns AFTER all hooks
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat wishlist...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FaHeart className="text-red-500" />
            Wishlist Saya
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Koleksi item favorit Anda
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah ke Wishlist</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
          <div className="text-sm text-red-700 font-medium mb-1">
            Total Wishlist
          </div>
          <div className="text-3xl font-bold text-red-900">
            {wishlist.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">
            Total Items
          </div>
          <div className="text-3xl font-bold text-blue-900">{items.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">
            Available
          </div>
          <div className="text-3xl font-bold text-green-900">
            {availableItems.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">
            Percentage
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {items.length > 0
              ? Math.round((wishlist.length / items.length) * 100)
              : 0}
            %
          </div>
        </div>
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
              placeholder="Cari item di wishlist..."
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

      {/* Wishlist Display */}
      {filteredWishlist.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Wishlist kosong
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada item di wishlist"}
          </p>
          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg font-medium"
            >
              <FaPlus className="w-4 h-4" />
              <span>Tambah Item</span>
            </motion.button>
          )}
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {paginatedItems.map((w) => (
              <WishlistCard
                key={w.id}
                wishlistItem={w}
                onRemove={() => promptRemove(w)}
                onView={() => viewDetail(w)}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {filteredWishlist.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white">
                <h2 className="text-2xl font-bold">Tambah ke Wishlist</h2>
                <p className="text-red-100 text-sm">Pilih item favorit Anda</p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pilih Item <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedItemId || ""}
                    onChange={(e) =>
                      setSelectedItemId(Number(e.target.value) || null)
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                    <option value="">-- Pilih Item --</option>
                    {availableItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.code})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {availableItems.length} item tersedia
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedItemId(null);
                    }}
                    disabled={adding}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    disabled={!selectedItemId || adding}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {adding ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Menambah...</span>
                      </>
                    ) : (
                      <span>Tambahkan</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <WishlistDetailModal
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedWishlist(null);
        }}
        wishlistItem={selectedWishlist}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Hapus dari Wishlist"
        description="Yakin ingin menghapus item ini dari wishlist?"
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Ya, Hapus"
        cancelLabel="Batal"
      />
    </div>
  );
}
