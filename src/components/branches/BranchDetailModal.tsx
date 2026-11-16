// src/components/branches/BranchDetailModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaCity,
  FaLock,
  FaClock,
  FaHistory,
} from "react-icons/fa";
import Image from "next/image";
import type { Branch } from "./BranchList";

function InfoField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        {value || "-"}
      </div>
    </div>
  );
}

export default function BranchDetailModal({
  open,
  onClose,
  branch,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: {
  open: boolean;
  onClose: () => void;
  branch?: Branch | null;
  onEdit?: (b: Branch) => void;
  onDelete?: (b: Branch) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  if (!branch) return null;

  const googleMapsUrl = `https://www.google.com/maps?q=${branch.lat},${branch.lng}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-8 py-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    {branch.island}
                  </span>
                  <span
                    className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold ${
                      branch.area === "Barat"
                        ? "bg-green-500/90"
                        : "bg-purple-500/90"
                    }`}
                  >
                    Area {branch.area}
                  </span>
                  <span
                    className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold ${
                      branch.disabled === 0
                        ? "bg-green-500/90"
                        : "bg-gray-500/90"
                    }`}
                  >
                    {branch.disabled === 0 ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-3">
                  {branch.branch_name}
                </h2>

                <div className="flex items-center gap-2 text-lg text-red-100">
                  <FaCity className="w-5 h-5" />
                  <span>
                    {branch.city} - ID: {branch.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-slate-50/70 p-8">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-500">
                    Informasi Branch
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    Data Perusahaan
                  </h3>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <InfoField label="Nama Branch" value={branch.branch_name} />
                    <InfoField label="Kode Branch" value={branch.name || "-"} />
                    <InfoField label="Kota" value={branch.city} />
                    <InfoField label="Pulau" value={branch.island} />
                    <InfoField label="Area" value={branch.area} />
                    <InfoField
                      label="Status"
                      value={branch.disabled === 0 ? "Aktif" : "Nonaktif"}
                    />
                    <InfoField
                      label="Alamat"
                      value={branch.address}
                      className="md:col-span-2"
                    />
                    <InfoField
                      label="Latitude"
                      value={
                        typeof branch.lat === "number"
                          ? branch.lat.toFixed(6)
                          : "-"
                      }
                    />
                    <InfoField
                      label="Longitude"
                      value={
                        typeof branch.lng === "number"
                          ? branch.lng.toFixed(6)
                          : "-"
                      }
                    />
                    {branch.url ? (
                      <InfoField
                        label="Website"
                        value={
                          <a
                            href={branch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 underline"
                          >
                            {branch.url}
                          </a>
                        }
                        className="md:col-span-2"
                      />
                    ) : null}
                    {branch.token ? (
                      <InfoField
                        label="API Token"
                        value={<span className="break-all">{branch.token}</span>}
                        className="md:col-span-2"
                      />
                    ) : null}
                  </div>
                </section>

                <div className="space-y-5">
                  <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <FaMapMarkerAlt className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-red-500">
                          Lokasi
                        </p>
                        <h3 className="text-xl font-bold text-slate-900">
                          Google Maps
                        </h3>
                      </div>
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-2xl border border-slate-200"
                    >
                      <div className="relative h-64 w-full">
                        <Image
                          src="/images/maps.jpg"
                          alt="Lokasi branch"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="mb-5 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-900">
                            Buka di Google Maps
                          </div>
                        </div>
                      </div>
                    </a>
                  </section>

                  {(branch.created_at || branch.updated_at) && (
                    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-3">
                        <FaHistory className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-500">
                            Aktivitas
                          </p>
                          <h3 className="text-xl font-bold text-slate-900">
                            Riwayat Data
                          </h3>
                        </div>
                      </div>
                      <div className="grid gap-3">
                        {branch.created_at && (
                          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <FaClock className="h-4 w-4 text-emerald-600" />
                              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                                Created
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">
                              {branch.created_by
                                ? typeof branch.created_by === "string"
                                  ? branch.created_by
                                  : `User #${branch.created_by}`
                                : "Unknown"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {new Date(branch.created_at).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "long",
                                  timeStyle: "short",
                                },
                              )}
                            </p>
                          </div>
                        )}

                        {branch.updated_at && (
                          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <FaEdit className="h-4 w-4 text-blue-600" />
                              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
                                Updated
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-slate-900">
                              {branch.updated_by
                                ? typeof branch.updated_by === "string"
                                  ? branch.updated_by
                                  : `User #${branch.updated_by}`
                                : "Unknown"}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {new Date(branch.updated_at).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "long",
                                  timeStyle: "short",
                                },
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                {canEdit ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEdit?.(branch)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span>Edit Cabang</span>
                  </motion.button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 cursor-not-allowed">
                    <FaLock className="w-5 h-5" />
                    <span>Edit Cabang</span>
                  </div>
                )}

                {canDelete ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete?.(branch)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                  >
                    <FaTrash className="w-5 h-5" />
                    <span>Hapus</span>
                  </motion.button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 cursor-not-allowed">
                    <FaLock className="w-5 h-5" />
                    <span>Hapus</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
