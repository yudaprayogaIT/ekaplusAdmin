"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaExclamationCircle,
  FaHistory,
  FaTimes,
} from "react-icons/fa";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import type {
  CustomerChangeRequest,
  CustomerChangeRequestDetail,
} from "./types";

interface DetailApiRow {
  id: number;
  idx?: number | null;
  field_label?: string | null;
  field_name?: string | null;
  field_type?: string | null;
  old_value?: unknown;
  new_value?: unknown;
}

interface Props {
  item: CustomerChangeRequest | null;
  onClose: () => void;
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "(kosong)";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("reject") || normalized.includes("cancel")) {
    return "border-rose-200 bg-rose-100 text-rose-700";
  }
  if (
    normalized.includes("sync") ||
    normalized.includes("approve") ||
    normalized.includes("applied")
  ) {
    return "border-emerald-200 bg-emerald-100 text-emerald-700";
  }
  if (normalized.includes("draft")) {
    return "border-amber-200 bg-amber-100 text-amber-700";
  }
  return "border-sky-200 bg-sky-100 text-sky-700";
}

export function CustomerChangeRequestDetailModal({ item, onClose }: Props) {
  const { token } = useAuth();
  const [details, setDetails] = useState<CustomerChangeRequestDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!item || !token) return;
    const itemId = item.id;
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError(null);
      setDetails([]);
      try {
        const response = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CHANGE_REQUEST_DETAIL, {
            fields: ["*"],
            filters: [["parent_id", "=", itemId]],
            order_by: [["idx", "asc"]],
          }),
          { method: "GET", cache: "no-store" },
          token,
        );
        if (!response.ok) {
          throw new Error(`Gagal memuat detail perubahan (${response.status})`);
        }
        const json = await response.json();
        const rows = Array.isArray(json?.data)
          ? (json.data as DetailApiRow[])
          : [];
        if (!cancelled) {
          setDetails(
            rows.map((row) => ({
              id: Number(row.id),
              idx: Number(row.idx || 0),
              fieldLabel: row.field_label || row.field_name || "Field",
              fieldName: row.field_name || "-",
              fieldType: row.field_type || "-",
              oldValue: row.old_value,
              newValue: row.new_value,
            })),
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setDetails([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat detail perubahan",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDetails();
    return () => {
      cancelled = true;
    };
  }, [item, reloadKey, token]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 py-5 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-100">
                    Customer Change Request
                  </p>
                  <h2 className="truncate text-xl font-bold sm:text-2xl">
                    {item.entityDisplayName}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-red-100">
                    <span>
                      {item.entityType
                        .split("_")
                        .filter(Boolean)
                        .map(
                          (part) =>
                            part.charAt(0).toUpperCase() + part.slice(1),
                        )
                        .join(" ")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-red-100"
                    />
                    <span>{item.name}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup detail"
                  className="rounded-xl bg-white/15 p-2.5 transition hover:bg-white/25"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-5 sm:p-7">
              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(item.status)}`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Dibuat</p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDate(item.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">oleh {item.createdBy}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Diperbarui</p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDate(item.updatedAt)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">oleh {item.updatedBy}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Diterapkan</p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDate(item.appliedAt)}
                  </p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Alasan Perubahan
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {item.reason || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Catatan Penolakan
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {item.rejectedNote || "-"}
                  </p>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <FaHistory className="text-red-500" /> Detail Perubahan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Perbandingan nilai sebelum dan sesudah perubahan
                  </p>
                </div>
                {!loading && !error && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {details.length} field
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center rounded-xl border border-gray-200 py-14">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                  <FaExclamationCircle className="mx-auto mb-2 text-xl text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((value) => value + 1)}
                    className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : details.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
                  Tidak ada detail perubahan.
                </div>
              ) : (
                <div className="space-y-3">
                  {details.map((detail) => (
                    <div
                      key={detail.id}
                      className="rounded-xl border border-gray-200 p-4 transition hover:border-red-200 hover:shadow-sm"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {detail.fieldLabel}
                          </p>
                          <p className="text-xs text-gray-500">
                            {detail.fieldName} · {detail.fieldType}
                          </p>
                        </div>
                      </div>
                      <div className="grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr]">
                        <div className="min-w-0 rounded-lg border border-rose-100 bg-rose-50 p-3">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-rose-500">
                            Nilai Lama
                          </p>
                          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-gray-800">
                            {displayValue(detail.oldValue)}
                          </pre>
                        </div>
                        <div className="flex items-center justify-center px-2 py-1 text-gray-400">
                          <FaArrowRight className="rotate-90 md:rotate-0" />
                        </div>
                        <div className="min-w-0 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
                            Nilai Baru
                          </p>
                          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-gray-800">
                            {displayValue(detail.newValue)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                <FaCalendarAlt /> Docstatus: {item.docstatus}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
