"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaExternalLinkAlt,
  FaFileAlt,
  FaInfoCircle,
  FaMoneyBillWave,
  FaStickyNote,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getFileUrl, getQueryUrl } from "@/config/api";

interface CustomerLimitListItem {
  id: number;
  code: string;
  bcid: number;
  bcName: string;
  customerLimit: number;
  paymentTerm?: number | null;
  checkCustomerOverdue?: number | null;
  notes?: string | null;
  reasonUpdate?: string | null;
  status: string;
  docstatus: number;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
}

interface CustomerLimitDetailResponse {
  id: number;
  bcid?: number | null;
  customer_limit?: number | null;
  payment_term?: number | null;
  check_customer_overdue?: number | null;
  identity_attachment?: string | null;
  ktp?: string | null;
  notes?: string | null;
  reason_update?: string | null;
  reason_reject?: string | null;
  reject_notes?: string | null;
  sync_saga_id?: string | null;
  saga_status?: string | null;
  sync_last_error?: string | null;
  sync_last_rollback_error?: string | null;
  status?: string | null;
  docstatus?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface DetailApiEnvelope {
  data?: CustomerLimitDetailResponse | null;
  action?: Array<{ id?: number; action?: string; mode?: string }>;
}

interface CustomerLimitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CustomerLimitListItem | null;
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string {
  if (explicitName) return explicitName;
  if (value && typeof value === "object" && value.full_name) {
    return value.full_name;
  }
  if (typeof value === "number") return `User ${value}`;
  return "System";
}

function formatCurrency(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function displayText(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function getPreviewType(params: {
  url?: string | null;
  contentType?: string | null;
}): "image" | "pdf" | "file" | "none" {
  const { url, contentType } = params;
  if (contentType) {
    const normalizedType = contentType.toLowerCase();
    if (normalizedType.startsWith("image/")) return "image";
    if (normalizedType.includes("pdf")) return "pdf";
    return "file";
  }

  if (!url) return "none";
  const normalized = url.toLowerCase();
  if (
    normalized.endsWith(".png") ||
    normalized.endsWith(".jpg") ||
    normalized.endsWith(".jpeg") ||
    normalized.endsWith(".webp") ||
    normalized.endsWith(".gif")
  ) {
    return "image";
  }
  if (normalized.endsWith(".pdf")) {
    return "pdf";
  }
  return "file";
}

function AttachmentPreview({
  label,
  url,
  token,
}: {
  label: string;
  url?: string | null;
  token?: string | null;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadPreview() {
      if (!url || !token) {
        setBlobUrl(null);
        setContentType(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiFetch(
          url,
          { method: "GET", cache: "no-store" },
          token,
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat lampiran (${response.status})`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setBlobUrl(objectUrl);
          setContentType(blob.type || response.headers.get("Content-Type"));
        }
      } catch (loadError) {
        if (!cancelled) {
          setBlobUrl(null);
          setContentType(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat preview lampiran",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [token, url]);

  const previewType = useMemo(
    () => getPreviewType({ url, contentType }),
    [contentType, url],
  );
  const previewUrl = blobUrl || url || "";

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {!url ? (
        <p className="mt-1 text-sm text-slate-700">-</p>
      ) : (
        <div className="mt-2 space-y-3">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Memuat preview lampiran...
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && previewType === "image" && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={previewUrl}
                alt={label}
                className="h-64 w-full object-contain bg-white"
              />
            </div>
          )}
          {!loading && !error && previewType === "pdf" && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <iframe src={previewUrl} title={label} className="h-64 w-full" />
            </div>
          )}
          {!loading && !error && previewType === "file" && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Preview tidak tersedia untuk tipe file ini.
            </div>
          )}
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 hover:bg-sky-100"
          >
            <FaExternalLinkAlt className="h-3 w-3" />
            Buka Lampiran
          </a>
        </div>
      )}
    </div>
  );
}

export function CustomerLimitDetailModal({
  isOpen,
  onClose,
  item,
}: CustomerLimitDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<CustomerLimitDetailResponse | null>(
    null,
  );
  const [actions, setActions] = useState<
    Array<{ id?: number; action?: string; mode?: string }>
  >([]);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      if (!isOpen || !item || !token || !isAuthenticated) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiFetch(
          getQueryUrl(`${API_CONFIG.ENDPOINTS.CUSTOMER_LIMIT}/${item.id}`, {
            fields: ["*", "created_by.full_name", "updated_by.full_name"],
          }),
          { method: "GET", cache: "no-store" },
          token,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch customer limit detail (${response.status})`,
          );
        }

        const json = (await response.json()) as DetailApiEnvelope;
        if (!cancelled) {
          setDetail(json.data || null);
          setActions(Array.isArray(json.action) ? json.action : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setDetail(null);
          setActions([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat detail customer limit",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isOpen, item, token]);

  if (!isOpen || !item) return null;

  const activeDetail = detail || null;
  const createdBy = resolveUserName(
    activeDetail?.["created_by.full_name"],
    activeDetail?.created_by,
  );
  const updatedBy = resolveUserName(
    activeDetail?.["updated_by.full_name"],
    activeDetail?.updated_by,
  );
  const attachmentUrl = getFileUrl(activeDetail?.identity_attachment);
  const ktpUrl = getFileUrl(activeDetail?.ktp);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) =>
            event.target === event.currentTarget ? onClose() : undefined
          }
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Customer Limit
                </p>
                <h2 className="mt-1 text-2xl font-bold">{item.code}</h2>
                <p className="mt-1 text-sm text-emerald-50">{item.bcName}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
              {loading && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                  Memuat detail customer limit...
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaMoneyBillWave className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Ringkasan Limit
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Branch Customer
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {item.bcName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(activeDetail?.status || item.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Customer Limit
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-700">
                        {formatCurrency(
                          activeDetail?.customer_limit ?? item.customerLimit,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payment Term
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(
                          activeDetail?.payment_term ?? item.paymentTerm,
                        )}{" "}
                        {activeDetail?.payment_term || item.paymentTerm
                          ? "hari"
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Check Customer Overdue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(
                          activeDetail?.check_customer_overdue ??
                            item.checkCustomerOverdue,
                        )}{" "}
                        {activeDetail?.check_customer_overdue ||
                        item.checkCustomerOverdue
                          ? "hari"
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Docstatus
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(activeDetail?.docstatus ?? item.docstatus)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaStickyNote className="text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Catatan & Alasan
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Notes
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.notes ?? item.notes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reason Update
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(
                          activeDetail?.reason_update ?? item.reasonUpdate,
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reason Reject
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.reason_reject)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reject Notes
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.reject_notes)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-sky-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Lampiran
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AttachmentPreview
                      label="Identity Attachment"
                      url={attachmentUrl}
                      token={token}
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-violet-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Status Sinkronisasi
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Saga Status
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(activeDetail?.saga_status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sync Saga ID
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                        {displayText(activeDetail?.sync_saga_id)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sync Last Error
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.sync_last_error)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sync Last Rollback Error
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.sync_last_rollback_error)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-green-500 p-3 text-white">
                        <FaUser />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                          Created By
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {createdBy}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                          <FaCalendarAlt className="text-green-600" />
                          {formatDateTime(
                            activeDetail?.created_at || item.createdAt,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-500 p-3 text-white">
                        <FaClock />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          Updated By
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {updatedBy}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                          <FaCalendarAlt className="text-blue-600" />
                          {formatDateTime(
                            activeDetail?.updated_at || item.updatedAt,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {actions.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <FaInfoCircle className="text-orange-500" />
                      <h3 className="text-lg font-bold text-slate-900">
                        Available Actions
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {actions.map((action) => (
                        <span
                          key={`${action.id}-${action.action}`}
                          className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
                        >
                          {displayText(action.action)} (
                          {displayText(action.mode)})
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
