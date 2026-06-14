"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaEdit,
  FaEye,
  FaIdBadge,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { API_CONFIG, apiFetch, getAuthHeaders, getQueryUrl, getResourceUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import type { CustomerPosition } from "@/types/contact";

type SortOption = "name-asc" | "name-desc" | "id-asc" | "id-desc";
const DEFAULT_PAGE_SIZE = 20;

type PositionApiRow = {
  id: number | string;
  name?: string | null;
  position_name?: string | null;
  notes?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const POSITION_EVENT = "ekaplus:customer_positions_update";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function mapPosition(row: PositionApiRow): CustomerPosition {
  return {
    id: toNumber(row.id),
    name: row.name || undefined,
    position_name: row.position_name || row.name || "-",
    notes: row.notes || undefined,
    disabled: Number(row.disabled || 0),
    created_at: row.created_at || undefined,
    updated_at: row.updated_at || undefined,
  };
}

function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function PositionFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  error,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    id?: number;
    position_name: string;
    notes: string;
    disabled: boolean;
  }) => Promise<void>;
  initial: CustomerPosition | null;
  error: string | null;
  saving: boolean;
}) {
  const [positionName, setPositionName] = useState("");
  const [notes, setNotes] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPositionName(initial?.position_name || "");
    setNotes(initial?.notes || "");
    setDisabled(Number(initial?.disabled || 0) === 1);
  }, [initial, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !saving) onClose();
          }}
        >
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            onSubmit={async (event) => {
              event.preventDefault();
              await onSubmit({
                id: initial?.id,
                position_name: positionName,
                notes,
                disabled,
              });
            }}
            className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
          >
            <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(135deg,#eff6ff,#ffffff_55%,#f8fafc)] px-6 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700">
                Customer Position
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {initial ? "Edit Position" : "Tambah Position"}
              </h3>
            </div>

            <div className="space-y-5 p-6">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">
                  Position Name
                </span>
                <input
                  value={positionName}
                  onChange={(event) => setPositionName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  required
                  disabled={saving}
                  placeholder="Contoh: Purchasing Manager"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-[96px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  disabled={saving}
                  placeholder="Catatan posisi"
                />
              </label>

              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(event) => setDisabled(event.target.checked)}
                  disabled={saving}
                />
                Nonaktifkan position ini
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : initial ? "Update Position" : "Simpan Position"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function CustomerPositionPage() {
  const { token, isAuthenticated } = useAuth();
  const [positions, setPositions] = useState<CustomerPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<CustomerPosition | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [detailItem, setDetailItem] = useState<CustomerPosition | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const actionRef = useRef<(() => Promise<void>) | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const loadData = useCallback(async (page: number, replace = false) => {
    if (!isAuthenticated || !token) {
      setPositions([]);
      setHasMore(false);
      setLoading(false);
      return;
    }
    if (replace) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const [sortField, sortDirection] = sortBy.split("-") as [
        "name" | "id",
        "asc" | "desc",
      ];
      const response = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_POSITION, {
          fields: ["*"],
          page,
          ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
          order_by: [[sortField === "name" ? "position_name" : "id", sortDirection]],
        }),
        {
          method: "GET",
          cache: "no-store",
          headers: getAuthHeaders(token),
        },
        token,
      );

      if (!response.ok) {
        throw new Error(`Gagal memuat customer position (${response.status})`);
      }

      const json = await response.json();
      const rows: CustomerPosition[] = (Array.isArray(json?.data) ? json.data : []).map(
        mapPosition,
      );
      const perPage = Number(json?.meta?.per_page || DEFAULT_PAGE_SIZE);
      setPositions((current) =>
        replace
          ? rows
          : [
              ...current,
              ...rows.filter(
                (item: CustomerPosition) =>
                  !current.some(
                    (existing: CustomerPosition) => existing.id === item.id,
                  ),
              ),
            ],
      );
      setCurrentPage(page);
      setHasMore(rows.length >= perPage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
      if (replace) setPositions([]);
      setHasMore(false);
    } finally {
      if (replace) setLoading(false);
      else setLoadingMore(false);
    }
  }, [debouncedSearchQuery, isAuthenticated, sortBy, token]);

  useEffect(() => {
    setPositions([]);
    setCurrentPage(1);
    setHasMore(true);
    void loadData(1, true);
  }, [loadData]);

  useEffect(() => {
    const refresh = () => {
      setPositions([]);
      setCurrentPage(1);
      setHasMore(true);
      void loadData(1, true);
    };
    window.addEventListener(POSITION_EVENT, refresh);
    return () => window.removeEventListener(POSITION_EVENT, refresh);
  }, [loadData]);

  const filteredPositions = useMemo(() => [...positions], [positions]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        void loadData(currentPage + 1, false);
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPage, hasMore, loadData, loading, loadingMore]);

  const submitPosition = async (payload: {
    id?: number;
    position_name: string;
    notes: string;
    disabled: boolean;
  }) => {
    if (!token) return;
    setSaving(true);
    setModalError(null);
    try {
      const response = await apiFetch(
        payload.id
          ? getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_POSITION, payload.id)
          : getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_POSITION),
        {
          method: payload.id ? "PUT" : "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            position_name: payload.position_name.trim(),
            notes: payload.notes.trim() || null,
            disabled: payload.disabled ? 1 : 0,
          }),
        },
        token,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Gagal menyimpan customer position (${response.status})`,
        );
      }

      setModalOpen(false);
      setModalInitial(null);
      window.dispatchEvent(new Event(POSITION_EVENT));
    } catch (submitError) {
      setModalError(
        submitError instanceof Error ? submitError.message : String(submitError),
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePosition = (item: CustomerPosition) => {
    if (!token) return;
    actionRef.current = async () => {
      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_POSITION, item.id),
        {
          method: "DELETE",
          headers: getAuthHeaders(token),
        },
        token,
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Gagal menghapus customer position (${response.status})`,
        );
      }
      if (detailItem?.id === item.id) {
        setDetailItem(null);
      }
      window.dispatchEvent(new Event(POSITION_EVENT));
    };
    setConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(135deg,#eff6ff,#ffffff_55%,#f8fafc)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700">
              Customer Master
            </p>
            <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold text-slate-900">
              <FaIdBadge className="text-blue-600" />
              Contact Position
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Master posisi/jabatan yang dipakai di relasi contact customer.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setModalInitial(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
          >
            <FaPlus className="text-xs" />
            Tambah Position
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500"
            placeholder="Cari position name atau notes"
          />
        </div>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
        >
          <option value="name-asc">Nama A-Z</option>
          <option value="name-desc">Nama Z-A</option>
          <option value="id-asc">ID Terkecil</option>
          <option value="id-desc">ID Terbesar</option>
        </select>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Memuat customer position...
        </div>
      ) : filteredPositions.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">
            Belum ada position yang cocok
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tambahkan data baru atau ubah kata kunci pencarian.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            {filteredPositions.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.position_name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          Number(item.disabled || 0) === 1
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {Number(item.disabled || 0) === 1 ? "Disabled" : "Active"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{item.notes || "-"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailItem(item)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <FaEye className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setModalError(null);
                        setModalInitial(item);
                        setModalOpen(true);
                      }}
                      className="rounded-xl border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePosition(item)}
                      className="rounded-xl border border-rose-200 p-2 text-rose-700 hover:bg-rose-50"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Position ID
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">#{item.id}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Updated
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {formatDate(item.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>
              Showing {filteredPositions.length} loaded positions
              {debouncedSearchQuery ? " matching current search" : ""}
            </p>
            <p>
              {hasMore
                ? "Scroll ke bawah untuk memuat lebih banyak"
                : "Semua data yang tersedia sudah dimuat"}
            </p>
          </div>
          {hasMore ? (
            <div
              ref={loadMoreRef}
              className="flex h-16 items-center justify-center text-sm text-slate-400"
            >
              {loadingMore
                ? "Memuat data berikutnya..."
                : "Siap memuat data berikutnya..."}
            </div>
          ) : null}
        </>
      )}

      <PositionFormModal
        open={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setModalInitial(null);
          setModalError(null);
        }}
        onSubmit={submitPosition}
        initial={modalInitial}
        error={modalError}
        saving={saving}
      />

      <AnimatePresence>
        {detailItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] flex items-center justify-center bg-slate-950/60 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) setDetailItem(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
            >
              <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#172554_45%,#2563eb_100%)] px-6 py-6 text-white">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-200">
                  Position Detail
                </p>
                <h3 className="mt-2 text-2xl font-bold">{detailItem.position_name}</h3>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Notes
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                    {detailItem.notes || "-"}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {Number(detailItem.disabled || 0) === 1 ? "Disabled" : "Active"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Updated
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                      {formatDate(detailItem.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => setDetailItem(null)}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus Position"
        description="Yakin ingin menghapus customer position ini?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onCancel={() => {
          setConfirmOpen(false);
          actionRef.current = null;
        }}
        onConfirm={async () => {
          setConfirmOpen(false);
          const action = actionRef.current;
          actionRef.current = null;
          if (!action) return;
          try {
            await action();
          } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : String(deleteError));
          }
        }}
      />
    </div>
  );
}
