"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getApiUrl, getQueryUrl } from "@/config/api";
import {
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaKey,
  FaPlus,
  FaSearch,
  FaSyncAlt,
  FaUser,
} from "react-icons/fa";

type IntegrationTokenApiRow = {
  ID?: number;
  Name?: string;
  UserID?: number;
  IsActive?: boolean;
  LastUsedAt?: string | null;
  CreatedAt?: string;
  UpdatedAt?: string;
};

type IntegrationTokenRow = {
  id: number;
  name: string;
  userId: number;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type UserLookupRow = {
  id: number;
  full_name?: string | null;
  username?: string | null;
  email?: string | null;
};

function toTokenRow(row: IntegrationTokenApiRow): IntegrationTokenRow {
  return {
    id: Number(row.ID || 0),
    name: row.Name || `Token ${row.ID || "-"}`,
    userId: Number(row.UserID || 0),
    isActive: Boolean(row.IsActive),
    lastUsedAt: row.LastUsedAt || null,
    createdAt: row.CreatedAt || "",
    updatedAt: row.UpdatedAt || "",
  };
}

function dt(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function extractServerMessage(json: unknown, fallback: string) {
  if (json && typeof json === "object" && "message" in json) {
    const message = (json as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export default function IntegrationTokenPage() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<IntegrationTokenRow[]>([]);
  const [users, setUsers] = useState<UserLookupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("CRM Sales SPV");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [manualUserId, setManualUserId] = useState("");
  const [createFeedback, setCreateFeedback] = useState<{
    title: string;
    description: string;
    payload?: unknown;
  } | null>(null);

  const loadTokens = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(
        getApiUrl(API_CONFIG.ENDPOINTS.INTEGRATION_TOKEN),
        { method: "GET", cache: "no-store" },
        token,
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          extractServerMessage(
            json,
            `Gagal memuat integration token (${res.status})`,
          ),
        );
      }
      const rows = Array.isArray(json?.data) ? json.data : [];
      setItems(rows.map((row) => toTokenRow(row as IntegrationTokenApiRow)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat integration token",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  const loadUsers = useCallback(async () => {
    if (!token || !isAuthenticated) {
      setUsers([]);
      setUsersLoading(false);
      return;
    }

    setUsersLoading(true);
    setUsersError(null);
    try {
      const res = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.USER, {
          fields: ["id", "full_name", "username", "email"],
          limit: 100000,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          extractServerMessage(json, `Gagal memuat user (${res.status})`),
        );
      }
      setUsers(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setUsersError(
        err instanceof Error ? err.message : "Gagal memuat daftar user",
      );
    } finally {
      setUsersLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    void loadTokens();
    void loadUsers();
  }, [loadTokens, loadUsers]);

  const selectedUser =
    users.find((row) => String(row.id) === selectedUserId) || null;
  const effectiveUserId =
    Number.parseInt(manualUserId || selectedUserId || "", 10) || 0;

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const user = users.find((row) => Number(row.id) === Number(item.userId));
      const label = [
        item.name,
        String(item.userId),
        user?.full_name,
        user?.username,
        user?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return label.includes(q);
    });
  }, [items, search, users]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((item) => item.isActive).length,
      neverUsed: items.filter((item) => !item.lastUsedAt).length,
      recentlyUsed: items.filter((item) => Boolean(item.lastUsedAt)).length,
    }),
    [items],
  );

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setCreateFeedback({
        title: "Nama token wajib diisi",
        description: "Isi nama integration token sebelum disimpan.",
      });
      return;
    }
    if (!effectiveUserId) {
      setCreateFeedback({
        title: "User wajib dipilih",
        description:
          "Pilih user dari daftar atau isi manual `user_id` yang akan dipakai.",
      });
      return;
    }
    if (!token) return;

    setIsSubmitting(true);
    setCreateFeedback(null);
    try {
      const payload = {
        name: trimmedName,
        user_id: effectiveUserId,
      };

      const res = await apiFetch(
        getApiUrl(API_CONFIG.ENDPOINTS.INTEGRATION_TOKEN),
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify(payload),
        },
        token,
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          extractServerMessage(
            json,
            `Gagal membuat integration token (${res.status})`,
          ),
        );
      }

      setCreateFeedback({
        title: "Integration token berhasil dibuat",
        description:
          "Token baru sudah tersimpan. Kalau API mengembalikan secret/token sekali pakai, detail response ditampilkan di bawah.",
        payload: json,
      });
      setName("CRM Sales SPV");
      setSelectedUserId("");
      setManualUserId("");
      await loadTokens();
    } catch (err) {
      setCreateFeedback({
        title: "Gagal membuat integration token",
        description:
          err instanceof Error ? err.message : "Terjadi kesalahan saat submit",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white shadow-xl shadow-red-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              <FaBolt className="h-3 w-3" />
              System Integration
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Integration Token
              </h1>
              <p className="mt-2 max-w-xl text-sm text-red-50/90">
                Kelola token integrasi untuk koneksi CRM atau sistem eksternal
                lain langsung dari EKA+ Admin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="text-xs text-red-100">Total</div>
              <div className="mt-1 text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="text-xs text-red-100">Active</div>
              <div className="mt-1 text-2xl font-bold">{stats.active}</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="text-xs text-red-100">Never Used</div>
              <div className="mt-1 text-2xl font-bold">{stats.neverUsed}</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="text-xs text-red-100">Used</div>
              <div className="mt-1 text-2xl font-bold">{stats.recentlyUsed}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[26px] border border-red-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                Create Token
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Buat integration token baru
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Endpoint `POST /api/user/integration-token`
              </p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3 text-red-500">
              <FaKey className="h-5 w-5" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Token Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: CRM Sales SPV"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Pilih User
              </span>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
                disabled={usersLoading}
              >
                <option value="">
                  {usersLoading ? "Memuat user..." : "Pilih user"}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.username || `User ${user.id}`} - ID{" "}
                    {user.id}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Atau Isi Manual `user_id`
              </span>
              <input
                value={manualUserId}
                onChange={(e) =>
                  setManualUserId(e.target.value.replace(/[^\d]/g, ""))
                }
                placeholder="Contoh: 21"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
              />
            </label>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 md:col-span-2">
              <div className="font-semibold">Payload preview</div>
              <div className="mt-2 font-mono text-xs text-amber-900">
                {`{ "name": "${name.trim() || "..."}", "user_id": ${
                  effectiveUserId || "..."
                } }`}
              </div>
              {selectedUser && (
                <div className="mt-2 text-xs text-amber-700">
                  User terpilih: {selectedUser.full_name || "-"} |{" "}
                  {selectedUser.email || selectedUser.username || "-"}
                </div>
              )}
              {usersError && (
                <div className="mt-2 text-xs text-red-600">{usersError}</div>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              type="button"
              onClick={() => void handleCreate()}
              disabled={isSubmitting || !isAuthenticated}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaPlus className="h-4 w-4" />
              {isSubmitting ? "Menyimpan..." : "Buat Integration Token"}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                setName("CRM Sales SPV");
                setSelectedUserId("");
                setManualUserId("");
                setCreateFeedback(null);
              }}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Reset Form
            </button>
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                API Notes
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Response snapshot
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                void loadTokens();
                void loadUsers();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <FaSyncAlt className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          {createFeedback ? (
            <div className="space-y-4">
              <div
                className={`rounded-2xl border px-4 py-4 ${
                  createFeedback.payload
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-amber-200 bg-amber-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 ${
                      createFeedback.payload
                        ? "text-emerald-600"
                        : "text-amber-500"
                    }`}
                  >
                    <FaCheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      {createFeedback.title}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {createFeedback.description}
                    </p>
                  </div>
                </div>
              </div>

              {createFeedback.payload && (
                <pre className="max-h-[360px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
                  {JSON.stringify(createFeedback.payload, null, 2)}
                </pre>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
              Response dari create token akan tampil di sini. Ini berguna kalau
              backend mengirim secret/token yang hanya muncul sekali saat token
              dibuat.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Token Registry
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Daftar integration token
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Endpoint `GET /api/user/integration-token`
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama token, user id, nama user..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-red-100 border-t-red-500" />
              <p className="text-sm font-medium text-slate-500">
                Memuat integration token...
              </p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-500">
              <FaKey className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Belum ada integration token
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {search.trim()
                ? "Tidak ada data yang cocok dengan pencarian."
                : "Token yang berhasil dibuat akan muncul di daftar ini."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredItems.map((item) => {
              const user =
                users.find((row) => Number(row.id) === Number(item.userId)) ||
                null;
              return (
                <div
                  key={item.id}
                  className="group rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fff7f5_100%)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg shadow-red-200">
                        <FaKey className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Token ID #{item.id}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          item.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Linked User
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-slate-400">
                          <FaUser className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">
                            {user?.full_name || user?.username || `User ${item.userId}`}
                          </div>
                          <div className="truncate text-xs text-slate-500">
                            ID {item.userId}
                            {user?.email ? ` | ${user.email}` : ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-red-50 px-4 py-3">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
                          <FaClock className="h-3.5 w-3.5" />
                          Last Used
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {dt(item.lastUsedAt)}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-orange-50 px-4 py-3">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                          <FaSyncAlt className="h-3.5 w-3.5" />
                          Updated
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {dt(item.updatedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-900 px-4 py-3 text-slate-100">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Created At
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        {dt(item.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
