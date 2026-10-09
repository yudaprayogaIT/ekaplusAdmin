"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaFileImage,
  FaRedo,
  FaSyncAlt,
  FaTimes,
} from "react-icons/fa";
import { getFileUrl } from "@/config/api";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type {
  IdentityAttachmentScanAction,
  IdentityAttachmentScanResult,
  IdentityAttachmentSyncProgress,
  IdentityAttachmentSyncResult,
} from "@/utils/syncIdentityAttachments";

type ReviewTab = IdentityAttachmentScanAction;

const tabs: Array<{ value: ReviewTab; label: string }> = [
  { value: "ready", label: "Siap Sync" },
  { value: "already_synced", label: "Sudah Sinkron" },
  { value: "conflict", label: "Conflict" },
  { value: "missing_group_parent", label: "Bermasalah" },
];

function statusLabel(action: IdentityAttachmentScanAction): string {
  if (action === "ready") return "Siap sync";
  if (action === "already_synced") return "Sudah sama";
  if (action === "conflict") return "Conflict — tidak ditimpa";
  return "Group Parent tidak ditemukan";
}

function statusClass(action: IdentityAttachmentScanAction): string {
  if (action === "ready") return "bg-blue-100 text-blue-700";
  if (action === "already_synced") return "bg-emerald-100 text-emerald-700";
  if (action === "conflict") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function AttachmentLink({ value }: { value?: string | null }) {
  const url = getFileUrl(value);
  if (!url) return <span className="text-slate-400">Kosong</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-48 items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
      title={value || undefined}
    >
      <FaExternalLinkAlt className="shrink-0 text-xs" />
      <span className="truncate">Buka attachment</span>
    </a>
  );
}

export function IdentityAttachmentSyncModal({
  open,
  scanning,
  scanResult,
  scanError,
  syncing,
  progress,
  syncResult,
  onClose,
  onRescan,
  onSync,
}: {
  open: boolean;
  scanning: boolean;
  scanResult: IdentityAttachmentScanResult | null;
  scanError: string | null;
  syncing: boolean;
  progress: IdentityAttachmentSyncProgress | null;
  syncResult: IdentityAttachmentSyncResult | null;
  onClose: () => void;
  onRescan: () => void;
  onSync: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("ready");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const rows = useMemo(
    () => scanResult?.rows.filter((row) => row.action === activeTab) || [],
    [activeTab, scanResult],
  );
  const countFor = (tab: ReviewTab) =>
    scanResult?.rows.filter((row) => row.action === tab).length || 0;

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/60 p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget && !syncing) onClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-orange-50 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <FaFileImage />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-600">
                      Administrator Tool
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Identity Attachment Sync
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review attachment Customer Register sebelum mengisi Group Parent yang masih kosong.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={syncing}
                  className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-50"
                  aria-label="Tutup"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                {scanning ? (
                  <div className="flex min-h-72 flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                    <p className="mt-5 font-semibold text-slate-800">
                      Mengecek Customer Register dan Group Parent...
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Tahap ini hanya membaca data dan belum mengubah attachment.
                    </p>
                  </div>
                ) : scanError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                    <div className="flex items-center gap-3 font-semibold">
                      <FaExclamationTriangle /> Pengecekan gagal
                    </div>
                    <p className="mt-2 text-sm">{scanError}</p>
                  </div>
                ) : scanResult ? (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {[
                        ["Total ditemukan", scanResult.total, "border-slate-200 bg-slate-50", "text-slate-600"],
                        ["Siap sync", scanResult.ready, "border-blue-200 bg-blue-50", "text-blue-600"],
                        ["Sudah sama", scanResult.alreadySynced, "border-emerald-200 bg-emerald-50", "text-emerald-600"],
                        ["Conflict", scanResult.conflict, "border-amber-200 bg-amber-50", "text-amber-600"],
                        ["GP tidak ditemukan", scanResult.missingGroupParent, "border-red-200 bg-red-50", "text-red-600"],
                      ].map(([label, count, cardClass, labelClass]) => (
                        <div
                          key={String(label)}
                          className={`rounded-2xl border p-4 ${cardClass}`}
                        >
                          <p className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>
                            {label}
                          </p>
                          <p className="mt-2 text-3xl font-black text-slate-900">{count}</p>
                        </div>
                      ))}
                    </div>

                    {syncing && progress ? (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex justify-between gap-4 text-sm font-semibold text-blue-800">
                          <span>{progress.label}</span>
                          <span>{progress.completed}/{progress.total}</span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{ width: `${progress.total ? (progress.completed / progress.total) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {syncResult ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                        <div className="flex items-center gap-3 font-bold text-emerald-800">
                          <FaCheckCircle /> Sync selesai
                        </div>
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-5">
                          <p>Berhasil: <strong>{syncResult.updated}</strong></p>
                          <p>Sudah sama: <strong>{syncResult.alreadySynced}</strong></p>
                          <p>Conflict: <strong>{syncResult.conflict}</strong></p>
                          <p>GP hilang: <strong>{syncResult.skippedMissingGroupParent}</strong></p>
                          <p>Gagal: <strong>{syncResult.failed.length}</strong></p>
                        </div>
                        {syncResult.failed.length ? (
                          <div className="mt-4 max-h-36 overflow-y-auto rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">
                            {syncResult.failed.map((failure) => (
                              <p key={`${failure.customerRegisterId}-${failure.gpid || 0}`} className="py-1">
                                <strong>{failure.customerRegisterCode}</strong>: {failure.message}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div>
                      <div className="flex gap-2 overflow-x-auto border-b border-slate-200">
                        {tabs.map((tab) => (
                          <button
                            key={tab.value}
                            type="button"
                            onClick={() => setActiveTab(tab.value)}
                            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${activeTab === tab.value ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500"}`}
                          >
                            {tab.label} ({countFor(tab.value)})
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                        <div className="max-h-[38vh] overflow-auto">
                          <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                              <tr>
                                <th className="px-4 py-3">Customer Register</th>
                                <th className="px-4 py-3">Group Parent</th>
                                <th className="px-4 py-3">Attachment Register</th>
                                <th className="px-4 py-3">Attachment GP</th>
                                <th className="px-4 py-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {rows.map((row) => (
                                <tr key={row.customerRegisterId}>
                                  <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-900">{row.customerRegisterCode}</p>
                                    <p className="text-xs text-slate-500">{row.customerRegisterName || `ID ${row.customerRegisterId}`}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-900">{row.gpCode || (row.gpid ? `GP${row.gpid}` : "-")}</p>
                                    <p className="text-xs text-slate-500">{row.gpName || (row.gpid ? `ID ${row.gpid}` : "Tanpa GP ID")}</p>
                                  </td>
                                  <td className="px-4 py-3"><AttachmentLink value={row.customerRegisterAttachment} /></td>
                                  <td className="px-4 py-3"><AttachmentLink value={row.groupParentAttachment} /></td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusClass(row.action)}`}>
                                      {statusLabel(row.action)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {!rows.length ? (
                                <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">Tidak ada data pada kategori ini.</td></tr>
                              ) : null}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={onClose} disabled={syncing} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50">
                  Tutup
                </button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={onRescan} disabled={scanning || syncing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                    <FaRedo /> Cek Ulang
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    disabled={scanning || syncing || !scanResult || scanResult.ready === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    <FaSyncAlt className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Syncing..." : `Sync ${scanResult?.ready || 0} Attachment`}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        title="Sync Identity Attachment"
        description={`Sinkronkan identity attachment untuk ${scanResult?.ready || 0} Group Parent yang attachment-nya masih kosong? Data yang sudah memiliki attachment tidak akan ditimpa.`}
        confirmLabel="Ya, Sync"
        cancelLabel="Batal"
        variant="warning"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onSync();
        }}
      />
    </>
  );
}
