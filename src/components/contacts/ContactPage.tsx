"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaAddressBook,
  FaCheckCircle,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { API_CONFIG, apiFetch, getAuthHeaders, getQueryUrl, getResourceUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import type { Contact, ContactIdentity } from "@/types/contact";

type SortOption = "name-asc" | "name-desc" | "id-asc" | "id-desc";

type ContactApiRow = {
  id: number | string;
  name?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  notes?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
};

type ContactIdentityApiRow = {
  id: number | string;
  name?: string | null;
  contact_id?: number | string | { id?: number | string } | null;
  channel?: string | null;
  handle?: string | null;
  external_id?: string | null;
  is_verified?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type EditableIdentity = {
  id: number;
  channel: string;
  handle: string;
  external_id: string;
  is_verified: boolean;
};

type ContactWithIdentities = Contact & {
  identities: ContactIdentity[];
};

const CONTACT_EVENT = "ekaplus:contacts_update";
const DEFAULT_PAGE_SIZE = 20;
const CHANNEL_OPTIONS = [
  "whatsapp",
  "facebook",
  "telegram",
  "email",
  "line",
  "instagram",
  "ekaplus",
  "phone",
];

function normalizeIdentityHandle(channel: string, handle: string): string {
  const trimmedHandle = handle.trim();
  const normalizedChannel = channel.trim().toLowerCase();

  if (!trimmedHandle) return "";
  if (!["whatsapp", "phone"].includes(normalizedChannel)) return trimmedHandle;
  if (!trimmedHandle.startsWith("0")) return trimmedHandle;

  return `62${trimmedHandle.slice(1)}`;
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "id" in value) {
    return toNumber((value as { id?: unknown }).id);
  }
  return 0;
}

function mapContact(row: ContactApiRow): Contact {
  return {
    id: toNumber(row.id),
    name: row.name || undefined,
    full_name: row.full_name || row.name || "-",
    display_name: row.display_name || undefined,
    notes: row.notes || undefined,
    disabled: Number(row.disabled || 0),
    created_at: row.created_at || undefined,
    updated_at: row.updated_at || undefined,
    created_by: row["created_by.full_name"] || undefined,
    updated_by: row["updated_by.full_name"] || undefined,
  };
}

function mapIdentity(row: ContactIdentityApiRow): ContactIdentity {
  return {
    id: toNumber(row.id),
    name: row.name || undefined,
    contact_id: toNumber(row.contact_id),
    channel: row.channel || "",
    handle: row.handle || "",
    external_id: row.external_id || undefined,
    is_verified: Number(row.is_verified || 0),
    created_at: row.created_at || undefined,
    updated_at: row.updated_at || undefined,
  };
}

function buildIdentityDraft(identity?: ContactIdentity): EditableIdentity {
  return {
    id: identity?.id ?? -Date.now() - Math.floor(Math.random() * 1000),
    channel: identity?.channel || "whatsapp",
    handle: identity?.handle || "",
    external_id: identity?.external_id || "",
    is_verified: Number(identity?.is_verified || 0) === 1,
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

function ContactFormModal({
  open,
  onClose,
  onSubmit,
  saving,
  error,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    id?: number;
    full_name: string;
    display_name: string;
    notes: string;
    disabled: boolean;
    identities: EditableIdentity[];
  }) => Promise<void>;
  saving: boolean;
  error: string | null;
  initial: ContactWithIdentities | null;
}) {
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [notes, setNotes] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [identities, setIdentities] = useState<EditableIdentity[]>([]);

  useEffect(() => {
    if (!open) return;
    setFullName(initial?.full_name || "");
    setDisplayName(initial?.display_name || "");
    setNotes(initial?.notes || "");
    setDisabled(Number(initial?.disabled || 0) === 1);
    setIdentities(
      initial?.identities?.length
        ? initial.identities.map((identity) => buildIdentityDraft(identity))
        : [buildIdentityDraft()],
    );
  }, [initial, open]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit({
      id: initial?.id,
      full_name: fullName,
      display_name: displayName,
      notes,
      disabled,
      identities,
    });
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !saving) onClose();
          }}
        >
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            onSubmit={submit}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
          >
            <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(135deg,#eff6ff,#ffffff_55%,#f8fafc)] px-6 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700">
                Contact Form
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {initial ? "Edit Contact" : "Tambah Contact"}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Kelola data contact dan seluruh identity yang melekat.
              </p>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <section className="grid items-start gap-4 md:grid-cols-2">
                <label className="flex h-full flex-col gap-2">
                  <span className="min-h-[20px] text-sm font-semibold text-slate-700">
                    Full Name
                  </span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition focus:border-blue-500"
                    placeholder="Nama lengkap contact"
                    required
                    disabled={saving}
                  />
                </label>

                <label className="flex h-full flex-col gap-2">
                  <span className="min-h-[20px] text-sm font-semibold text-slate-700">
                    Display Name
                  </span>
                  <input
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                    placeholder="Nama panggilan / nama tampil"
                    disabled={saving}
                  />
                </label>

                <label className="flex h-full flex-col gap-2 md:col-span-2">
                  <span className="min-h-[20px] text-sm font-semibold text-slate-700">
                    Notes
                  </span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="min-h-[96px] w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                    placeholder="Catatan tambahan"
                    disabled={saving}
                  />
                </label>

                <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={disabled}
                    onChange={(event) => setDisabled(event.target.checked)}
                    disabled={saving}
                  />
                  Nonaktifkan contact ini
                </label>
              </section>

              <section className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Contact Identities
                    </p>
                    <h4 className="mt-1 text-lg font-bold text-slate-900">
                      Channel komunikasi
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setIdentities((prev) => [...prev, buildIdentityDraft()])
                    }
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    <FaPlus className="text-xs" />
                    Tambah Identity
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {identities.map((identity, index) => (
                    <div
                      key={identity.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-800">
                          Identity #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setIdentities((prev) =>
                              prev.length === 1
                                ? [buildIdentityDraft()]
                                : prev.filter((item) => item.id !== identity.id),
                            )
                          }
                          disabled={saving}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                        >
                          <FaTrash className="text-[10px]" />
                          Hapus
                        </button>
                      </div>

                      <div className="grid items-start gap-4 md:grid-cols-2">
                        <label className="flex h-full flex-col gap-2">
                          <span className="min-h-[20px] text-sm font-semibold text-slate-700">
                            Channel
                          </span>
                          <select
                            value={identity.channel}
                            onChange={(event) =>
                              setIdentities((prev) =>
                                prev.map((item) =>
                                  item.id === identity.id
                                    ? { ...item, channel: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                            disabled={saving}
                          >
                            {CHANNEL_OPTIONS.map((channel) => (
                              <option key={channel} value={channel}>
                                {channel}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="flex h-full flex-col gap-2">
                          <span className="min-h-[20px] text-sm font-semibold text-slate-700">
                            Handle
                          </span>
                          <input
                            value={identity.handle}
                            onChange={(event) =>
                              setIdentities((prev) =>
                                prev.map((item) =>
                                  item.id === identity.id
                                    ? { ...item, handle: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                            placeholder="62812xxxx / email / username"
                            disabled={saving}
                          />
                        </label>

                        <label className="flex h-full flex-col gap-2">
                          <span className="min-h-[20px] text-sm font-semibold text-slate-700">
                            External ID
                          </span>
                          <input
                            value={identity.external_id}
                            onChange={(event) =>
                              setIdentities((prev) =>
                                prev.map((item) =>
                                  item.id === identity.id
                                    ? {
                                        ...item,
                                        external_id: event.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                            placeholder="ID eksternal bila ada"
                            disabled={saving}
                          />
                        </label>

                        <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 md:self-end">
                          <input
                            type="checkbox"
                            checked={identity.is_verified}
                            onChange={(event) =>
                              setIdentities((prev) =>
                                prev.map((item) =>
                                  item.id === identity.id
                                    ? {
                                        ...item,
                                        is_verified: event.target.checked,
                                      }
                                    : item,
                                ),
                              )
                            }
                            disabled={saving}
                          />
                          Sudah terverifikasi
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
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
                {saving ? "Menyimpan..." : initial ? "Update Contact" : "Simpan Contact"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function ContactDetailModal({
  open,
  item,
  onClose,
}: {
  open: boolean;
  item: ContactWithIdentities | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-2xl"
          >
            <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#172554_45%,#2563eb_100%)] px-6 py-6 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-200">
                Contact Detail
              </p>
              <h3 className="mt-2 text-2xl font-bold">{item.full_name}</h3>
              <p className="mt-1 text-sm text-blue-100">
                Display name: {item.display_name || "-"}
              </p>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {Number(item.disabled || 0) === 1 ? "Disabled" : "Active"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Identity Count
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {item.identities.length}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {item.notes || "-"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Contact Identities
                    </p>
                    <h4 className="mt-1 text-lg font-bold text-slate-900">
                      Channel yang terdaftar
                    </h4>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {item.identities.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
                      Belum ada identity.
                    </div>
                  ) : (
                    item.identities.map((identity) => (
                      <div
                        key={identity.id}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {identity.channel}
                          </p>
                          <p className="text-sm text-slate-600">{identity.handle}</p>
                          <p className="text-xs text-slate-500">
                            External ID: {identity.external_id || "-"}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            Number(identity.is_verified || 0) === 1
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          <FaCheckCircle className="text-[10px]" />
                          {Number(identity.is_verified || 0) === 1
                            ? "Verified"
                            : "Unverified"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Created
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Updated
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(item.updated_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 text-right">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function ContactPage() {
  const { token, isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<ContactWithIdentities | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<ContactWithIdentities | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
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

  const loadContactIdentities = useCallback(
    async (contactId: number): Promise<ContactIdentity[]> => {
      if (!token || !contactId) return [];
      const rows = await fetchAllQueryRows<ContactIdentityApiRow>({
        endpoint: API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES,
        spec: {
          fields: ["*"],
          filters: [["contact_id", "=", contactId]],
        },
        token,
        requestInit: {
          headers: getAuthHeaders(token),
        },
        errorMessage: "Gagal memuat contact identities",
      });
      return rows.map(mapIdentity);
    },
    [token],
  );

  const loadData = useCallback(async (page: number, replace = false) => {
    if (!isAuthenticated || !token) {
      setContacts([]);
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
      const headers = getAuthHeaders(token);
      const [sortField, sortDirection] = sortBy.split("-") as [
        "name" | "id",
        "asc" | "desc",
      ];
      const contactRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.CONTACT, {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
          page,
          ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
          order_by: [[sortField === "name" ? "full_name" : "id", sortDirection]],
        }),
        { method: "GET", cache: "no-store", headers },
      );

      if (!contactRes.ok) {
        throw new Error(`Gagal memuat contact (${contactRes.status})`);
      }

      const contactJson = await contactRes.json();
      const rows = (Array.isArray(contactJson?.data) ? contactJson.data : []).map(mapContact);
      const perPage = Number(contactJson?.meta?.per_page || DEFAULT_PAGE_SIZE);
      setContacts((current) =>
        replace
          ? rows
          : [
              ...current,
              ...rows.filter(
                (item) => !current.some((existing) => existing.id === item.id),
              ),
            ],
      );
      setCurrentPage(page);
      setHasMore(rows.length >= perPage);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
      if (replace) setContacts([]);
      setHasMore(false);
    } finally {
      if (replace) setLoading(false);
      else setLoadingMore(false);
    }
  }, [debouncedSearchQuery, isAuthenticated, sortBy, token]);

  useEffect(() => {
    setContacts([]);
    setCurrentPage(1);
    setHasMore(true);
    void loadData(1, true);
  }, [loadData]);

  useEffect(() => {
    const refresh = () => {
      setContacts([]);
      setCurrentPage(1);
      setHasMore(true);
      void loadData(1, true);
    };
    window.addEventListener(CONTACT_EVENT, refresh);
    return () => window.removeEventListener(CONTACT_EVENT, refresh);
  }, [loadData]);

  const filteredContacts = useMemo(() => [...contacts], [contacts]);

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

  const stats = useMemo(() => {
    const activeContacts = contacts.filter((item) => Number(item.disabled || 0) !== 1).length;
    const disabledContacts = contacts.length - activeContacts;
    return {
      totalContacts: contacts.length,
      activeContacts,
      disabledContacts,
    };
  }, [contacts]);

  const submitContact = async (payload: {
    id?: number;
    full_name: string;
    display_name: string;
    notes: string;
    disabled: boolean;
    identities: EditableIdentity[];
  }) => {
    if (!token) return;
    setSaving(true);
    setModalError(null);
    try {
      const contactPayload = {
        full_name: payload.full_name.trim(),
        display_name: payload.display_name.trim() || null,
        notes: payload.notes.trim() || null,
        disabled: payload.disabled ? 1 : 0,
      };
      const contactRes = await apiFetch(
        payload.id
          ? getResourceUrl(API_CONFIG.ENDPOINTS.CONTACT, payload.id)
          : getResourceUrl(API_CONFIG.ENDPOINTS.CONTACT),
        {
          method: payload.id ? "PUT" : "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify(contactPayload),
        },
        token,
      );

      if (!contactRes.ok) {
        const errorData = await contactRes.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Gagal menyimpan contact (${contactRes.status})`,
        );
      }

      const contactJson = await contactRes.json().catch(() => ({}));
      const persistedContactId =
        toNumber(contactJson?.data?.id) ||
        toNumber(contactJson?.data?.name) ||
        payload.id ||
        0;

      if (!persistedContactId) {
        throw new Error("ID contact tidak ditemukan setelah proses simpan.");
      }

      const previousIdentities = await loadContactIdentities(persistedContactId);
      const incoming = payload.identities.filter(
        (identity) => identity.handle.trim() || identity.external_id.trim(),
      );
      const incomingIds = new Set(
        incoming.filter((identity) => identity.id > 0).map((identity) => identity.id),
      );

      for (const identity of previousIdentities) {
        if (!incomingIds.has(identity.id)) {
          const deleteRes = await apiFetch(
            getResourceUrl(API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES, identity.id),
            {
              method: "DELETE",
              headers: getAuthHeaders(token),
            },
            token,
          );
          if (!deleteRes.ok) {
            const errorData = await deleteRes.json().catch(() => ({}));
            throw new Error(
              errorData.message ||
                `Gagal menghapus identity lama (${deleteRes.status})`,
            );
          }
        }
      }

      for (const identity of incoming) {
        const normalizedHandle = normalizeIdentityHandle(
          identity.channel,
          identity.handle,
        );
        if (!normalizedHandle) continue;
        const identityPayload = {
          contact_id: persistedContactId,
          channel: identity.channel,
          handle: normalizedHandle,
          external_id: identity.external_id.trim() || null,
          is_verified: identity.is_verified ? 1 : 0,
        };

        const identityRes = await apiFetch(
          identity.id > 0
            ? getResourceUrl(API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES, identity.id)
            : getResourceUrl(API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES),
          {
            method: identity.id > 0 ? "PUT" : "POST",
            headers: getAuthHeaders(token),
            body: JSON.stringify(identityPayload),
          },
          token,
        );

        if (!identityRes.ok) {
          const errorData = await identityRes.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Gagal menyimpan contact identity (${identityRes.status})`,
          );
        }
      }

      setModalOpen(false);
      setModalInitial(null);
      window.dispatchEvent(new Event(CONTACT_EVENT));
    } catch (submitError) {
      setModalError(
        submitError instanceof Error ? submitError.message : String(submitError),
      );
    } finally {
      setSaving(false);
    }
  };

  const askDelete = (title: string, description: string, action: () => Promise<void>) => {
    setConfirmTitle(title);
    setConfirmDesc(description);
    actionRef.current = action;
    setConfirmOpen(true);
  };

  const deleteContact = async (item: Contact) => {
    if (!token) return;
    askDelete(
      "Hapus Contact",
      `Yakin ingin menghapus contact "${item.full_name}" beserta identity terkait?`,
      async () => {
        const linkedIdentities = await loadContactIdentities(item.id);
        for (const identity of linkedIdentities) {
          const identityRes = await apiFetch(
            getResourceUrl(API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES, identity.id),
            {
              method: "DELETE",
              headers: getAuthHeaders(token),
            },
            token,
          );
          if (!identityRes.ok) {
            const errorData = await identityRes.json().catch(() => ({}));
            throw new Error(
              errorData.message ||
                `Gagal menghapus identity (${identityRes.status})`,
            );
          }
        }

        const contactRes = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.CONTACT, item.id),
          {
            method: "DELETE",
            headers: getAuthHeaders(token),
          },
          token,
        );
        if (!contactRes.ok) {
          const errorData = await contactRes.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Gagal menghapus contact (${contactRes.status})`,
          );
        }
        if (detailItem?.id === item.id) {
          setDetailOpen(false);
          setDetailItem(null);
        }
        window.dispatchEvent(new Event(CONTACT_EVENT));
      },
    );
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    const action = actionRef.current;
    actionRef.current = null;
    if (!action) return;
    try {
      await action();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : String(deleteError));
    }
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
              <FaAddressBook className="text-blue-600" />
              Contact
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Kelola contact reusable lengkap dengan WhatsApp, email, phone, dan channel identity lainnya.
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
            Tambah Contact
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Total Contact
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{stats.totalContacts}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Active Contact
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{stats.activeContacts}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Disabled Contact
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-900">{stats.disabledContacts}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-xl">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500"
              placeholder="Cari nama, display name, notes, atau identity"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
          >
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="id-asc">ID Terkecil</option>
            <option value="id-desc">ID Terbesar</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-sm">
          Memuat data contact...
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <FaUser className="mx-auto text-3xl text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-700">
            Belum ada contact yang cocok
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tambahkan contact baru atau ubah kata kunci pencarian.
          </p>
        </div>
      ) : (
        <>
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredContacts.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#ffffff,#f8fafc)] px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{item.full_name}</h3>
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
                    <p className="mt-1 text-sm text-slate-500">
                      Display: {item.display_name || "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setError(null);
                          const linkedIdentities = await loadContactIdentities(item.id);
                          setDetailItem({ ...item, identities: linkedIdentities });
                          setDetailOpen(true);
                        } catch (loadError) {
                          setError(
                            loadError instanceof Error
                              ? loadError.message
                              : String(loadError),
                          );
                        }
                      }}
                      className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      title="Lihat detail"
                    >
                      <FaEye className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          setModalError(null);
                          const linkedIdentities = await loadContactIdentities(item.id);
                          setModalInitial({ ...item, identities: linkedIdentities });
                          setModalOpen(true);
                        } catch (loadError) {
                          setError(
                            loadError instanceof Error
                              ? loadError.message
                              : String(loadError),
                          );
                        }
                      }}
                      className="rounded-xl border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                      title="Edit contact"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteContact(item)}
                      className="rounded-xl border border-rose-200 p-2 text-rose-700 hover:bg-rose-50"
                      title="Hapus contact"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Notes
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-700">
                      {item.notes || "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Link Behavior
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      Identity dikelola per-contact
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Linked Data
                  </p>
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                    `Contact Identities` bukan master data terpisah. Buka detail atau edit contact ini untuk mengelola identity yang terhubung.
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-500">
                      <FaEnvelope className="text-xs" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.24em]">
                        Updated
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {formatDate(item.updated_at)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      Contact ID
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      #{item.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 pt-2 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            Showing {filteredContacts.length} loaded contacts
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

      <ContactFormModal
        open={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setModalInitial(null);
          setModalError(null);
        }}
        onSubmit={submitContact}
        saving={saving}
        error={modalError}
        initial={modalInitial}
      />

      <ContactDetailModal
        open={detailOpen}
        item={detailItem}
        onClose={() => {
          setDetailOpen(false);
          setDetailItem(null);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onCancel={() => {
          setConfirmOpen(false);
          actionRef.current = null;
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
