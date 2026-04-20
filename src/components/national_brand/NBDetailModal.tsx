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

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export function NBDetailModal({ isOpen, onClose, item }: NBDetailModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("summary");

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("summary");
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, item?.id]);

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
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
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
                    <p className="text-sm text-indigo-100">
                      NBID: {item.code}
                    </p>
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

            <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 md:p-6">
              <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
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

                <div className="space-y-6">
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
                      <div className="grid min-w-[240px] gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                            Group Parent
                          </p>
                          <p className="mt-1 text-2xl font-bold text-violet-900">
                            {item.active_gp_count}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Group Customer
                          </p>
                          <p className="mt-1 text-2xl font-bold text-blue-900">
                            {item.active_gc_count}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                            Branch Customer
                          </p>
                          <p className="mt-1 text-2xl font-bold text-orange-900">
                            {item.active_bc_count}
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
                    <section className="grid gap-4 xl:grid-cols-3">
                      <div className="rounded-3xl border border-violet-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 text-white">
                            <FaBuilding className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-500">
                              Group Parent
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.active_gp_count} data aktif
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.active_gp_names.length > 0 ? (
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

                      <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white">
                            <FaUsers className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
                              Group Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.active_gc_count} data aktif
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.active_gc_names.length > 0 ? (
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

                      <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white">
                            <FaStore className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-500">
                              Branch Customer
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.active_bc_count} data aktif
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {item.active_bc_names.length > 0 ? (
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
