"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBan,
  FaBuilding,
  FaCheckCircle,
  FaClock,
  FaStore,
  FaTags,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { API_CONFIG, apiFetch, getApiUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

export interface NationalBrandDetailData {
  id: number;
  code: string;
  name: string;
  disabled: number;
  created_at: string;
  updated_at: string;
  owners: string[];
  active_gp_count: number;
  active_gc_count: number;
  active_bc_count: number;
  active_gp_names: string[];
  active_gc_names: string[];
  active_bc_names: string[];
}

interface NBDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NationalBrandDetailData | null;
}

type DetailTab = "summary" | "owner" | "hierarchy" | "activity";

interface PolicyHierarchyGpRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  credit_limit?: number | null;
  payment_term?: number | null;
}

interface PolicyHierarchyGcRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
}

interface PolicyHierarchyBcRow {
  id: number;
  name?: string | null;
  _relations?: {
    branch?: {
      city?: string | null;
    } | null;
    gcid?: {
      id?: number | null;
      name?: string | null;
      gc_name?: string | null;
    } | null;
  } | null;
}

interface PolicyHierarchyNbRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
  credit_limit?: number | null;
  payment_term?: number | null;
}

interface PolicyHierarchyResponse {
  data?: {
    data?: {
      nb?: PolicyHierarchyNbRow | PolicyHierarchyNbRow[] | null;
      gps?: PolicyHierarchyGpRow[] | null;
      gcs?: PolicyHierarchyGcRow[] | null;
      bcs?: PolicyHierarchyBcRow[] | null;
    } | null;
  } | null;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function formatCurrency(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDays(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value} hari`;
}

export function NBDetailModal({ isOpen, onClose, item }: NBDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<DetailTab>("summary");
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [hierarchyError, setHierarchyError] = useState<string | null>(null);
  const [hierarchyNb, setHierarchyNb] = useState<PolicyHierarchyNbRow | null>(
    null,
  );
  const [hierarchyGps, setHierarchyGps] = useState<PolicyHierarchyGpRow[]>([]);
  const [hierarchyGcs, setHierarchyGcs] = useState<PolicyHierarchyGcRow[]>([]);
  const [hierarchyBcs, setHierarchyBcs] = useState<PolicyHierarchyBcRow[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("summary");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, item?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadHierarchy() {
      if (!isOpen || !item || !token || !isAuthenticated) {
        setHierarchyNb(null);
        setHierarchyGps([]);
        setHierarchyGcs([]);
        setHierarchyBcs([]);
        setHierarchyError(null);
        setHierarchyLoading(false);
        return;
      }

      setHierarchyLoading(true);
      setHierarchyError(null);

      try {
        const response = await apiFetch(
          getApiUrl(
            `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`,
          ),
          {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({
              level: "nbid",
              value: item.id,
              format: "full",
              entities: ["nb", "gps", "gcs", "bcs"],
              query: {
                bcs: {
                  fields: ["id", "name", "branch.city", "gcid"],
                },
                gcs: {
                  fields: ["id", "gc_name", "name"],
                },
                gps: {
                  fields: [
                    "id",
                    "gp_name",
                    "credit_limit",
                    "payment_term",
                    "name",
                  ],
                },
                nb: {
                  fields: [
                    "id",
                    "nb_name",
                    "credit_limit",
                    "payment_term",
                    "name",
                  ],
                },
              },
            }),
          },
          token,
        );

        if (!response.ok) {
          throw new Error(
            `Gagal memuat hierarchy National Brand (${response.status})`,
          );
        }

        const json = (await response.json()) as PolicyHierarchyResponse;
        const data = json.data?.data;
        const nbRow = Array.isArray(data?.nb)
          ? (data?.nb?.[0] ?? null)
          : (data?.nb ?? null);

        if (!cancelled) {
          setHierarchyNb(nbRow);
          setHierarchyGps(Array.isArray(data?.gps) ? data?.gps || [] : []);
          setHierarchyGcs(Array.isArray(data?.gcs) ? data?.gcs || [] : []);
          setHierarchyBcs(Array.isArray(data?.bcs) ? data?.bcs || [] : []);
        }
      } catch (error) {
        if (!cancelled) {
          setHierarchyNb(null);
          setHierarchyGps([]);
          setHierarchyGcs([]);
          setHierarchyBcs([]);
          setHierarchyError(
            error instanceof Error
              ? error.message
              : "Gagal memuat hierarchy National Brand",
          );
        }
      } finally {
        if (!cancelled) {
          setHierarchyLoading(false);
        }
      }
    }

    void loadHierarchy();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isOpen, item, token]);

  const detailTabs = useMemo(
    () => [
      {
        key: "summary" as const,
        label: "Ringkasan",
        caption: "Status & relasi",
        icon: <FaTags className="h-4 w-4" />,
      },
      {
        key: "owner" as const,
        label: "Data Pemilik",
        caption: "Owner / pengguna",
        icon: <FaUser className="h-4 w-4" />,
      },
      {
        key: "hierarchy" as const,
        label: "Hierarki",
        caption: "GP, GC, BC aktif",
        icon: <FaUsers className="h-4 w-4" />,
      },
      {
        key: "activity" as const,
        label: "Aktivitas",
        caption: "Created & updated",
        icon: <FaClock className="h-4 w-4" />,
      },
    ],
    [],
  );

  const nbCreditConfiguredAtGp = useMemo(
    () =>
      hierarchyGps.some(
        (row) =>
          typeof row.credit_limit === "number" &&
          !Number.isNaN(row.credit_limit),
      ),
    [hierarchyGps],
  );
  const nbPaymentConfiguredAtGp = useMemo(
    () =>
      hierarchyGps.some(
        (row) =>
          typeof row.payment_term === "number" &&
          !Number.isNaN(row.payment_term),
      ),
    [hierarchyGps],
  );

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex max-h-[94vh] w-full max-w-[92vw] xl:max-w-[1320px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-indigo-900/20 backdrop-blur-sm">
                    <FaTags className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">
                        National Brand Details
                      </h2>
                      {item.disabled === 1 ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                          <FaBan className="h-3.5 w-3.5" />
                          Disabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                          <FaCheckCircle className="h-3.5 w-3.5" />
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-indigo-100">NBID: {item.code}</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-white transition-colors hover:bg-white/20"
                >
                  <HiXMark className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-4 md:p-5 xl:p-6">
              <div className="grid min-h-0 gap-5 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">
                <aside className="space-y-3">
                  {detailTabs.map((tab) => {
                    const active = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                          active
                            ? "border-indigo-500 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-200/70"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/70"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-indigo-600"
                            }`}
                          >
                            {tab.icon}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{tab.label}</p>
                            <p
                              className={`text-xs ${
                                active ? "text-indigo-100" : "text-slate-500"
                              }`}
                            >
                              {tab.caption}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </aside>

                <div className="min-h-0 space-y-5">
                  <section className="rounded-3xl border border-white bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
                          National Brand
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-slate-900">
                          {item.name}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Pusat identitas brand dan relasi customer aktif.
                        </p>
                      </div>
                      <div className="grid min-w-[240px] gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                            Credit Limit
                          </p>
                          <p className="mt-2 text-base font-bold text-violet-900">
                            {formatCurrency(hierarchyNb?.credit_limit)}
                          </p>
                          <p className="mt-1 text-xs text-violet-700">
                            {typeof hierarchyNb?.credit_limit === "number" &&
                            !Number.isNaN(hierarchyNb.credit_limit)
                              ? "Sumber: NB"
                              : nbCreditConfiguredAtGp
                                ? "Diatur per GP"
                                : "Belum diatur"}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                            Payment Term
                          </p>
                          <p className="mt-2 text-base font-bold text-cyan-900">
                            {formatDays(hierarchyNb?.payment_term)}
                          </p>
                          <p className="mt-1 text-xs text-cyan-700">
                            {typeof hierarchyNb?.payment_term === "number" &&
                            !Number.isNaN(hierarchyNb.payment_term)
                              ? "Sumber: NB"
                              : nbPaymentConfiguredAtGp
                                ? "Diatur per GP"
                                : "Belum diatur"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {activeTab === "summary" && (
                    <section className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                          Status Brand
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-slate-900">
                          {item.disabled === 1 ? (
                            <>
                              <FaBan className="h-5 w-5 text-rose-500" />
                              <span className="text-lg font-semibold">
                                Nonaktif
                              </span>
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="h-5 w-5 text-emerald-500" />
                              <span className="text-lg font-semibold">
                                Aktif
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">
                          Kode Brand
                        </p>
                        <p className="mt-4 text-lg font-semibold text-slate-900">
                          {item.code}
                        </p>
                      </div>
                    </section>
                  )}

                  {activeTab === "owner" && (
                    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white">
                          <FaUser className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                            Data Pemilik
                          </p>
                          <h4 className="text-xl font-bold text-slate-900">
                            Owner / Pengguna NB
                          </h4>
                        </div>
                      </div>
                      {item.owners.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                          {item.owners.map((owner) => (
                            <div
                              key={owner}
                              className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-slate-900"
                            >
                              {owner}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm italic text-slate-500">
                          Belum ada owner atau pengguna yang terhubung.
                        </p>
                      )}
                    </section>
                  )}

                  {activeTab === "hierarchy" && (
                    <section className="grid min-h-0 gap-4 xl:grid-cols-3">
                      <div className="flex min-h-0 flex-col rounded-3xl border border-violet-100 bg-white p-4 shadow-sm xl:p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 text-white">
                            <FaBuilding className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
                              Group Parent
                            </p>
                            <p className="text-sm text-slate-500">
                              {hierarchyLoading
                                ? "Loading..."
                                : `${hierarchyError ? item.active_gp_count : hierarchyGps.length} data aktif`}
                            </p>
                          </div>
                        </div>
                        <div className="max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {hierarchyGps.length > 0 ? (
                            hierarchyGps.map((gpRow) => (
                              <div
                                key={gpRow.id}
                                className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-slate-800"
                              >
                                <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900">
                                  {gpRow.gp_name || gpRow.name || "-"}
                                </p>
                                <p className="mt-2 text-xs text-violet-700">
                                  Limit: {formatCurrency(gpRow.credit_limit)}
                                </p>
                                <p className="mt-1 text-xs text-violet-700">
                                  Payment Term: {formatDays(gpRow.payment_term)}
                                </p>
                              </div>
                            ))
                          ) : item.active_gp_names.length > 0 ? (
                            item.active_gp_names.map((name) => (
                              <div
                                key={name}
                                className="rounded-2xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-slate-800"
                              >
                                {name}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm italic text-slate-500">
                              Belum ada GP aktif.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex min-h-0 flex-col rounded-3xl border border-blue-100 bg-white p-4 shadow-sm xl:p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
                            <FaUsers className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                              Group Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {hierarchyLoading
                                ? "Loading..."
                                : `${hierarchyError ? item.active_gc_count : hierarchyGcs.length} data aktif`}
                            </p>
                          </div>
                        </div>
                        <div className="max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {hierarchyGcs.length > 0 ? (
                            hierarchyGcs.map((gcRow) => (
                              <div
                                key={gcRow.id}
                                className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-slate-800"
                              >
                                <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900">
                                  {gcRow.gc_name || gcRow.name || "-"}
                                </p>
                                <p className="mt-2 text-xs text-blue-700">
                                  GCID: {gcRow.name || `GC${gcRow.id}`}
                                </p>
                              </div>
                            ))
                          ) : item.active_gc_names.length > 0 ? (
                            item.active_gc_names.map((name) => (
                              <div
                                key={name}
                                className="rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-slate-800"
                              >
                                {name}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm italic text-slate-500">
                              Belum ada GC aktif.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex min-h-0 flex-col rounded-3xl border border-orange-100 bg-white p-4 shadow-sm xl:p-5">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                            <FaStore className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                              Branch Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {hierarchyLoading
                                ? "Loading..."
                                : `${hierarchyError ? item.active_bc_count : hierarchyBcs.length} data aktif`}
                            </p>
                          </div>
                        </div>
                        <div className="max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                          {hierarchyBcs.length > 0 ? (
                            hierarchyBcs.map((bcRow) => {
                              const gcName =
                                bcRow._relations?.gcid?.gc_name ||
                                bcRow._relations?.gcid?.name ||
                                "Group Customer";
                              const city =
                                bcRow._relations?.branch?.city || "-";
                              return (
                                <div
                                  key={bcRow.id}
                                  className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-slate-800"
                                >
                                  <p className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900">
                                    {gcName} - {city}
                                  </p>
                                  <p className="mt-2 text-xs text-orange-700">
                                    BCID: {bcRow.name || `BC${bcRow.id}`}
                                  </p>
                                </div>
                              );
                            })
                          ) : item.active_bc_names.length > 0 ? (
                            item.active_bc_names.map((name) => (
                              <div
                                key={name}
                                className="rounded-2xl border border-orange-100 bg-orange-50 px-3 py-2 text-sm text-slate-800"
                              >
                                {name}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm italic text-slate-500">
                              Belum ada BC aktif.
                            </p>
                          )}
                        </div>
                      </div>

                      {hierarchyError ? (
                        <div className="xl:col-span-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                          {hierarchyError}
                        </div>
                      ) : null}
                    </section>
                  )}

                  {activeTab === "activity" && (
                    <section className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                            <FaClock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">
                              Created
                            </p>
                            <p className="text-sm text-slate-500">
                              Pertama kali dibuat
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(item.created_at)}
                        </p>
                      </div>

                      <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
                            <FaClock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                              Updated
                            </p>
                            <p className="text-sm text-slate-500">
                              Perubahan terakhir
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800">
                          {formatDateTime(item.updated_at)}
                        </p>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-white px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
