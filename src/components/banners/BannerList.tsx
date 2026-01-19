// src/components/banners/BannerList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import BannerCard from "./BannerCard";
import AddBannerModal from "./AddBannerModal";
import BannerDetailModal from "./BannerDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
  FaLock,
  FaImage,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getFileUrl,
  API_CONFIG,
  apiFetch,
} from "@/config/api";
import type { Banner, BannerAPIResponse, ScheduleStatus } from "@/types/banner";

type SortOption =
  | "display_order-asc"
  | "display_order-desc"
  | "name-asc"
  | "name-desc"
  | "id-asc"
  | "id-desc";

const SNAP_KEY = "ekatalog_banners_snapshot";

// Helper function to determine schedule status
function getScheduleStatus(banner: Banner): ScheduleStatus {
  if (!banner.start_date || !banner.end_date) return "none";

  const now = new Date();
  const start = new Date(banner.start_date);
  const end = new Date(banner.end_date);

  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

export default function BannerList() {
  const { token, isAuthenticated } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("display_order-asc");
  const [filterSchedule, setFilterSchedule] = useState<ScheduleStatus | "all">(
    "all"
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Banner | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Banner | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load banners from API
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

        // Load banners from API
        const bannersUrl = getQueryUrl(API_CONFIG.ENDPOINTS.BANNER, {
          fields: ["*"],
        });
        const bannersRes = await apiFetch(
          bannersUrl,
          {
            method: "GET",
            cache: "no-store",
          },
          token
        );

        if (bannersRes.ok) {
          const bannersResponse =
            (await bannersRes.json()) as BannerAPIResponse;
          if (!cancelled) {
            const mappedBanners: Banner[] = bannersResponse.data.map(
              (item) => ({
                id: item.id,
                name: item.name,
                banner_name: item.banner_name,
                image: getFileUrl(item.image),
                type: item.type as Banner["type"],
                type_value: item.type_value,
                disabled: item.disabled as 0 | 1,
                display_order: item.display_order ?? 0,
                start_date: item.start_date,
                end_date: item.end_date,
                click_count: item.click_count,
                docstatus: item.docstatus,
                created_at: item.created_at,
                updated_at: item.updated_at,
                created_by: item.created_by,
                updated_by: item.updated_by,
                owner: item.owner,
              })
            );

            console.log("Loaded banners:", mappedBanners);
            setBanners(mappedBanners);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(mappedBanners));
            } catch {}
          }
        } else {
          if (!cancelled) {
            setError(`Failed to fetch banners (${bannersRes.status})`);
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
      if (!isAuthenticated || !token) return;

      try {
        const bannersUrl = getQueryUrl(API_CONFIG.ENDPOINTS.BANNER, {
          fields: ["*"],
        });

        const res = await apiFetch(
          bannersUrl,
          {
            method: "GET",
            cache: "no-store",
          },
          token
        );

        if (res.ok) {
          const response = (await res.json()) as BannerAPIResponse;
          const mappedBanners: Banner[] = response.data.map((item) => ({
            id: item.id,
            name: item.name,
            banner_name: item.banner_name,
            image: getFileUrl(item.image),
            type: item.type as Banner["type"],
            type_value: item.type_value,
            disabled: item.disabled as 0 | 1,
            display_order: item.display_order ?? 0,
            start_date: item.start_date,
            end_date: item.end_date,
            click_count: item.click_count,
            docstatus: item.docstatus,
            created_at: item.created_at,
            updated_at: item.updated_at,
          }));

          setBanners(mappedBanners);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedBanners));
        }
      } catch (error) {
        console.error("Failed to reload banners:", error);
      }
    }

    window.addEventListener("ekatalog:banners_update", handler);
    return () => window.removeEventListener("ekatalog:banners_update", handler);
  }, [isAuthenticated, token]);

  function saveSnapshot(arr: Banner[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:banners_update"));
  }

  async function toggleBannerStatus(banner: Banner) {
    try {
      if (!token) {
        throw new Error("Not authenticated");
      }

      const newDisabled = banner.disabled === 1 ? 0 : 1;

      // Prepare FormData for update
      const formData = new FormData();
      formData.append("name", banner.name);
      formData.append("banner_name", banner.banner_name);
      formData.append("type", banner.type);
      formData.append("type_value", banner.type_value || "");
      formData.append("disabled", newDisabled.toString());
      formData.append("display_order", banner.display_order.toString());
      formData.append("start_date", banner.start_date || "");
      formData.append("end_date", banner.end_date || "");
      formData.append("docstatus", banner.docstatus.toString());

      // Include existing image UUID if available
      if (banner.image) {
        const imageUuidMatch = banner.image.match(/\/files\/(.+)$/);
        const imageUuid = imageUuidMatch ? imageUuidMatch[1] : banner.image;
        formData.append("image", imageUuid);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.BANNER, banner.id),
        {
          method: "PUT",
          headers,
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to toggle banner status (${response.status})`
        );
      }

      console.log("Banner status toggled successfully");

      // Update local state
      const next = banners.map((b) =>
        b.id === banner.id ? { ...b, disabled: newDisabled as 0 | 1 } : b
      );
      setBanners(next);
      saveSnapshot(next);
    } catch (err: unknown) {
      console.error("Failed to toggle banner status:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
    }
  }

  function promptDeleteBanner(banner: Banner) {
    setConfirmTitle("Hapus Banner");
    setConfirmDesc(`Yakin ingin menghapus banner "${banner.banner_name}"?`);
    actionRef.current = async () => {
      try {
        if (!token) {
          throw new Error("Not authenticated");
        }

        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.BANNER, banner.id),
          {
            method: "DELETE",
          },
          token
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete banner (${response.status})`
          );
        }

        console.log("Banner deleted successfully");

        // Remove from local state
        const next = banners.filter((b) => b.id !== banner.id);
        setBanners(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        console.error("Failed to delete banner:", err);
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

  function handleEdit(banner: Banner) {
    setModalInitial(banner);
    setModalOpen(true);
  }

  function openDetail(banner: Banner) {
    setDetailItem(banner);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(banner: Banner) {
    closeDetail();
    setTimeout(() => handleEdit(banner), 80);
  }

  function onDetailDelete(banner: Banner) {
    closeDetail();
    setTimeout(() => promptDeleteBanner(banner), 80);
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

  // Not authenticated - show login required
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Diperlukan
          </h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Banner. Klik
            tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaImage className="w-4 h-4" />
            <span>Data banner dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat banners...</p>
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

  // Filter banners by search and schedule
  let filteredBanners = banners;

  if (searchQuery.trim()) {
    filteredBanners = filteredBanners.filter((b) =>
      b.banner_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterSchedule !== "all") {
    filteredBanners = filteredBanners.filter(
      (b) => getScheduleStatus(b) === filterSchedule
    );
  }

  // Sort banners
  const sortedBanners = [...filteredBanners].sort((a, b) => {
    switch (sortBy) {
      case "display_order-asc":
        return a.display_order - b.display_order;
      case "display_order-desc":
        return b.display_order - a.display_order;
      case "name-asc":
        return a.banner_name.localeCompare(b.banner_name);
      case "name-desc":
        return b.banner_name.localeCompare(a.banner_name);
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalBanners = banners.length;
  const enabledCount = banners.filter((b) => b.disabled === 0).length;
  const disabledCount = banners.filter((b) => b.disabled === 1).length;
  const activeCount = banners.filter(
    (b) => getScheduleStatus(b) === "active"
  ).length;
  const scheduledCount = banners.filter(
    (b) => getScheduleStatus(b) === "scheduled"
  ).length;
  const expiredCount = banners.filter(
    (b) => getScheduleStatus(b) === "expired"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Banners
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola banner promosi untuk Aplikasi Eka+
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Banner</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">
            Total Banners
          </div>
          <div className="text-3xl font-bold text-blue-900">{totalBanners}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">Enabled</div>
          <div className="text-3xl font-bold text-green-900">
            {enabledCount}
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
          <div className="text-sm text-red-700 font-medium mb-1">Disabled</div>
          <div className="text-3xl font-bold text-red-900">{disabledCount}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border-2 border-emerald-200">
          <div className="text-sm text-emerald-700 font-medium mb-1">
            Active
          </div>
          <div className="text-3xl font-bold text-emerald-900">
            {activeCount}
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-5 border-2 border-sky-200">
          <div className="text-sm text-sky-700 font-medium mb-1">Scheduled</div>
          <div className="text-3xl font-bold text-sky-900">
            {scheduledCount}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
          <div className="text-sm text-gray-700 font-medium mb-1">Expired</div>
          <div className="text-3xl font-bold text-gray-900">{expiredCount}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search, Sort & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari banner..."
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="display_order-asc">Order: Terkecil</option>
                <option value="display_order-desc">Order: Terbesar</option>
                <option value="id-asc">ID: Terlama</option>
                <option value="id-desc">ID: Terbaru</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
              </select>
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

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />

            {/* Schedule Filter */}
            <button
              onClick={() => setFilterSchedule("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterSchedule === "all"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua Schedule
            </button>
            <button
              onClick={() => setFilterSchedule("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterSchedule === "active"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterSchedule("scheduled")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterSchedule === "scheduled"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setFilterSchedule("expired")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterSchedule === "expired"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Expired
            </button>
          </div>
        </div>
      </div>

      {/* Banners Display */}
      {sortedBanners.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada banner
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada banner yang ditambahkan"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {sortedBanners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              viewMode={viewMode}
              onEdit={() => handleEdit(banner)}
              onDelete={() => promptDeleteBanner(banner)}
              onView={() => openDetail(banner)}
              onToggle={() => toggleBannerStatus(banner)}
              scheduleStatus={getScheduleStatus(banner)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddBannerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
      />

      <BannerDetailModal
        open={detailOpen}
        onClose={closeDetail}
        banner={detailItem}
        onEdit={onDetailEdit}
        onDelete={onDetailDelete}
        scheduleStatus={detailItem ? getScheduleStatus(detailItem) : "none"}
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
