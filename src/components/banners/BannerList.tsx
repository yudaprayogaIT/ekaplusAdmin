// src/components/banners/BannerList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BannerCard from "./BannerCard";
import AddBannerModal from "./AddBannerModal";
import BannerDetailModal from "./BannerDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaPlus,
  FaSearch,
  FaList,
  FaTh,
  FaGripVertical,
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
import type { Banner, BannerAPIResponse } from "@/types/banner";
import { useDetailRoute } from "@/hooks/useDetailRoute";

const SNAP_KEY = "ekatalog_banners_snapshot";

function SortableBannerItem({
  id,
  disabled,
  children,
}: {
  id: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 20 : undefined,
      }}
      className="relative"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        disabled={disabled}
        className="absolute left-2 top-2 z-30 flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-gray-200 bg-white/95 text-gray-500 shadow-sm backdrop-blur transition hover:border-red-200 hover:text-red-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Geser untuk mengubah urutan banner"
        title={disabled ? "Hapus pencarian untuk mengatur urutan" : "Geser banner"}
      >
        <FaGripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

export default function BannerList() {
  const { token, isAuthenticated } = useAuth();
  const { detailRouteId, openDetailRoute, closeDetailRoute } = useDetailRoute();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [reordering, setReordering] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Banner | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Banner | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!detailRouteId) {
      setDetailOpen(false);
      setDetailItem(null);
      return;
    }
    const routed = banners.find(
      (banner) => String(banner.id) === detailRouteId,
    );
    if (routed) {
      setDetailItem(routed);
      setDetailOpen(true);
    }
  }, [banners, detailRouteId]);

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
          fields: [
            "*",
            "created_by.full_name",
            "updated_by.full_name",
            "owner.full_name",
          ],
        });
        const bannersRes = await apiFetch(
          bannersUrl,
          {
            method: "GET",
            cache: "no-store",
          },
          token,
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
                order: typeof item.order === "number" ? item.order : null,
                show_button: item.show_button === 1 ? 1 : 0,
                button_display: item.button_display,
                created_at: item.created_at,
                updated_at: item.updated_at,
                created_by:
                  typeof item.created_by === "object"
                    ? {
                        id: item.created_by.id,
                        name: item.created_by.full_name,
                      }
                    : item.created_by,
                updated_by:
                  typeof item.updated_by === "object"
                    ? {
                        id: item.updated_by.id,
                        name: item.updated_by.full_name,
                      }
                    : item.updated_by,
                owner:
                  typeof item.owner === "object"
                    ? { id: item.owner.id, name: item.owner.full_name }
                    : item.owner,
              }),
            );

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
          fields: [
            "*",
            "created_by.full_name",
            "updated_by.full_name",
            "owner.full_name",
          ],
        });

        const res = await apiFetch(
          bannersUrl,
          {
            method: "GET",
            cache: "no-store",
          },
          token,
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
            order: typeof item.order === "number" ? item.order : null,
            show_button: item.show_button === 1 ? 1 : 0,
            button_display: item.button_display,
            created_at: item.created_at,
            updated_at: item.updated_at,
            created_by:
              typeof item.created_by === "object"
                ? { id: item.created_by.id, name: item.created_by.full_name }
                : item.created_by,
            updated_by:
              typeof item.updated_by === "object"
                ? { id: item.updated_by.id, name: item.updated_by.full_name }
                : item.updated_by,
            owner:
              typeof item.owner === "object"
                ? { id: item.owner.id, name: item.owner.full_name }
                : item.owner,
          }));

          setBanners(mappedBanners);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedBanners));
        }
      } catch {
        // console.error("Failed to reload banners:", error);
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

  function createBannerFormData(
    banner: Banner,
    overrides: Partial<Pick<Banner, "disabled" | "order">> = {},
  ) {
    const nextBanner = { ...banner, ...overrides };
    const formData = new FormData();
    formData.append("banner_name", nextBanner.banner_name);
    formData.append("type", nextBanner.type);
    formData.append("type_value", nextBanner.type_value || "");
    formData.append("disabled", nextBanner.disabled.toString());
    formData.append("show_button", nextBanner.show_button.toString());
    formData.append("button_display", nextBanner.button_display || "");
    if (nextBanner.order !== null) {
      formData.append("order", nextBanner.order.toString());
    }
    if (nextBanner.image) {
      const imageUuidMatch = nextBanner.image.match(/\/files\/(.+)$/);
      formData.append(
        "image",
        imageUuidMatch ? imageUuidMatch[1] : nextBanner.image,
      );
    }
    return formData;
  }

  async function updateBanner(banner: Banner, order?: number) {
    if (!token) throw new Error("Not authenticated");
    const response = await apiFetch(
      getResourceUrl(API_CONFIG.ENDPOINTS.BANNER, banner.id),
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: createBannerFormData(
          banner,
          order === undefined ? {} : { order },
        ),
      },
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Gagal memperbarui banner (${response.status})`,
      );
    }
  }

  async function persistOrder(rows: Banner[]) {
    const maxOrder = Math.max(
      rows.length,
      ...rows.map((banner) => banner.order || 0),
    );
    const temporaryBase = maxOrder + rows.length + 1000;
    await Promise.all(
      rows.map((banner, index) =>
        updateBanner(banner, temporaryBase + index + 1),
      ),
    );
    await Promise.all(
      rows.map((banner, index) => updateBanner(banner, index + 1)),
    );
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || searchQuery.trim() || reordering) {
      return;
    }

    const previous = [...banners].sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB || a.id - b.id;
    });
    const oldIndex = previous.findIndex((banner) => banner.id === active.id);
    const newIndex = previous.findIndex((banner) => banner.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(previous, oldIndex, newIndex).map(
      (banner, index) => ({ ...banner, order: index + 1 }),
    );
    setBanners(reordered);
    setReordering(true);
    setError(null);
    try {
      await persistOrder(reordered);
      localStorage.setItem(SNAP_KEY, JSON.stringify(reordered));
    } catch (reorderError) {
      const restored = previous.map((banner, index) => ({
        ...banner,
        order: index + 1,
      }));
      setBanners(restored);
      try {
        await persistOrder(restored);
      } catch {}
      setError(
        reorderError instanceof Error
          ? reorderError.message
          : "Gagal menyimpan urutan banner",
      );
    } finally {
      setReordering(false);
    }
  }

  async function toggleBannerStatus(banner: Banner) {
    try {
      if (!token) {
        throw new Error("Not authenticated");
      }

      const newDisabled = banner.disabled === 1 ? 0 : 1;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.BANNER, banner.id),
        {
          method: "PUT",
          headers,
          body: createBannerFormData(banner, { disabled: newDisabled }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to toggle banner status (${response.status})`,
        );
      }

      // Update local state
      const next = banners.map((b) =>
        b.id === banner.id ? { ...b, disabled: newDisabled as 0 | 1 } : b,
      );
      setBanners(next);
      saveSnapshot(next);
    } catch (err: unknown) {
      // console.error("Failed to toggle banner status:", err);
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
          token,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete banner (${response.status})`,
          );
        }

        // Remove from local state
        const next = banners.filter((b) => b.id !== banner.id);
        setBanners(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        // console.error("Failed to delete banner:", err);
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
    openDetailRoute(banner.id);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
    closeDetailRoute();
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

  // Filter banners by search
  let filteredBanners = banners;

  if (searchQuery.trim()) {
    filteredBanners = filteredBanners.filter((b) =>
      b.banner_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  // The persisted order is the only display order; name/date sorting would
  // make drag-and-drop ambiguous.
  const sortedBanners = [...filteredBanners].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB || a.id - b.id;
  });

  // Calculate stats
  const totalBanners = banners.length;
  const enabledCount = banners.filter((b) => b.disabled === 0).length;
  const disabledCount = banners.filter((b) => b.disabled === 1).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 lg:flex lg:items-baseline lg:gap-3">
          <h1 className="mb-1 text-2xl font-bold text-gray-800 lg:mb-0">
            Banners
          </h1>
          <p className="text-sm text-gray-600">
            Kelola banner promosi untuk Aplikasi Eka+
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-red-200 transition-all hover:shadow-lg"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Banner</span>
        </motion.button>
      </div>

      {/* Search & Filter */}
      <div className="mb-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          {/* Search, Sort & View Toggle */}
          <div className="flex min-w-0 flex-1 gap-2">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari banner..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg px-3 py-2.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Tampilan card"
                aria-label="Tampilan card"
              >
                <FaTh className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-lg px-3 py-2.5 transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Tampilan list"
                aria-label="Tampilan list"
              >
                <FaList className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 xl:flex-none">
            <FaGripVertical className="h-4 w-4" />
            <span>
              {reordering
                ? "Menyimpan urutan..."
                : searchQuery.trim()
                  ? "Hapus pencarian untuk mengatur urutan"
                  : "Tarik handle untuk mengatur urutan"}
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-2 text-xs text-gray-500">
          <span>{sortedBanners.length} banner ditampilkan</span>
          <span>{totalBanners} total</span>
          <span className="text-emerald-600">{enabledCount} enabled</span>
          <span className="text-red-500">{disabledCount} disabled</span>
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => void handleDragEnd(event)}
        >
          <SortableContext
            items={sortedBanners.map((banner) => banner.id)}
            strategy={
              viewMode === "list"
                ? verticalListSortingStrategy
                : rectSortingStrategy
            }
          >
            {viewMode === "list" ? (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <div className="grid min-w-[900px] grid-cols-[minmax(280px,2fr)_110px_140px_130px_minmax(180px,1fr)] items-center gap-4 bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <span>Banner</span>
                    <span>Status</span>
                    <span>Tipe</span>
                    <span>Tombol</span>
                    <span>Urutan & Aksi</span>
                  </div>
                  <div>
                    {sortedBanners.map((banner) => (
                      <SortableBannerItem
                        key={banner.id}
                        id={banner.id}
                        disabled={Boolean(searchQuery.trim()) || reordering}
                      >
                        <BannerCard
                          banner={banner}
                          viewMode="list"
                          onEdit={() => handleEdit(banner)}
                          onDelete={() => promptDeleteBanner(banner)}
                          onView={() => openDetail(banner)}
                          onToggle={() => toggleBannerStatus(banner)}
                        />
                      </SortableBannerItem>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {sortedBanners.map((banner) => (
                  <SortableBannerItem
                    key={banner.id}
                    id={banner.id}
                    disabled={Boolean(searchQuery.trim()) || reordering}
                  >
                    <BannerCard
                      banner={banner}
                      viewMode="grid"
                      onEdit={() => handleEdit(banner)}
                      onDelete={() => promptDeleteBanner(banner)}
                      onView={() => openDetail(banner)}
                      onToggle={() => toggleBannerStatus(banner)}
                    />
                  </SortableBannerItem>
                ))}
              </div>
            )}
          </SortableContext>
        </DndContext>
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
