"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaRedo,
  FaSyncAlt,
  FaTimes,
  FaUserCheck,
} from "react-icons/fa";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  CopyOwnerIdentityModal,
  type OwnerIdentityValues,
} from "@/components/group_parent/CopyOwnerIdentityModal";
import type {
  OwnerIdentityScanAction,
  OwnerIdentityScanResult,
  OwnerIdentityScanRow,
  OwnerIdentitySyncProgress,
  OwnerIdentitySyncResult,
} from "@/utils/syncOwnerIdentities";

type ReviewTab = OwnerIdentityScanAction;

const tabs: Array<{ value: ReviewTab; label: string }> = [
  { value: "ready", label: "Siap Sync" },
  { value: "need_review", label: "Perlu Review" },
  { value: "gp_different", label: "GP Berbeda" },
  { value: "already_same", label: "Sudah Sama" },
  { value: "no_data", label: "Tanpa Data" },
];

const identityFields: Array<{
  key: keyof OwnerIdentityValues;
  label: string;
}> = [
  { key: "owner_name", label: "Nama" },
  { key: "owner_phone", label: "Telepon" },
  { key: "owner_email", label: "Email" },
  { key: "owner_place_of_birth", label: "Tempat lahir" },
  { key: "owner_date_of_birth", label: "Tanggal lahir" },
];

function clean(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function identitySummary(identity?: OwnerIdentityValues): string {
  if (!identity) return "-";
  return identityFields
    .map(({ key }) => clean(identity[key]))
    .filter(Boolean)
    .join(" · ") || "-";
}

function statusLabel(action: OwnerIdentityScanAction): string {
  if (action === "ready") return "Siap sync";
  if (action === "need_review") return "Perlu pilih GC";
  if (action === "gp_different") return "Nilai GP berbeda";
  if (action === "already_same") return "Sudah sama";
  return "Tidak ada data";
}

function statusClass(action: OwnerIdentityScanAction): string {
  if (action === "ready") return "bg-blue-100 text-blue-700";
  if (action === "already_same") return "bg-emerald-100 text-emerald-700";
  if (action === "need_review") return "bg-orange-100 text-orange-700";
  if (action === "gp_different") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-600";
}

export function OwnerIdentitySyncModal({
  open,
  token,
  scanning,
  scanResult,
  scanError,
  syncing,
  progress,
  syncResult,
  onClose,
  onRescan,
  onSyncReady,
  onReviewSynced,
}: {
  open: boolean;
  token: string;
  scanning: boolean;
  scanResult: OwnerIdentityScanResult | null;
  scanError: string | null;
  syncing: boolean;
  progress: OwnerIdentitySyncProgress | null;
  syncResult: OwnerIdentitySyncResult | null;
  onClose: () => void;
  onRescan: () => void;
  onSyncReady: () => void;
  onReviewSynced: (gpId: number, identity: OwnerIdentityValues) => void;
}) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("ready");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reviewRow, setReviewRow] = useState<OwnerIdentityScanRow | null>(null);

  useEffect(() => {
    if (!open) {
      setConfirmOpen(false);
      setReviewRow(null);
    }
  }, [open]);

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
            key="owner-identity-checker"
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
              <header className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <FaUserCheck />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-600">Administrator Tool</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">Owner Identity Checker</h2>
                    <p className="mt-1 text-sm text-slate-500">Periksa identitas pemilik GC sebelum menyinkronkannya ke Group Parent.</p>
                  </div>
                </div>
                <button type="button" onClick={onClose} disabled={syncing} className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-50" aria-label="Tutup">
                  <FaTimes />
                </button>
              </header>

              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                {scanning ? (
                  <div className="flex min-h-72 flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-600" />
                    <p className="mt-5 font-semibold text-slate-800">Mengecek Group Parent dan GC turunannya...</p>
                    <p className="mt-1 text-sm text-slate-500">Proses ini hanya membaca dan membandingkan data.</p>
                  </div>
                ) : scanError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                    <div className="flex items-center gap-3 font-semibold"><FaExclamationTriangle /> Pengecekan gagal</div>
                    <p className="mt-2 text-sm">{scanError}</p>
                  </div>
                ) : scanResult ? (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                      {[
                        ["Total GP", scanResult.total, "border-slate-200 bg-slate-50", "text-slate-600"],
                        ["Siap sync", scanResult.ready, "border-blue-200 bg-blue-50", "text-blue-600"],
                        ["Perlu review", scanResult.needReview, "border-orange-200 bg-orange-50", "text-orange-600"],
                        ["GP berbeda", scanResult.gpDifferent, "border-amber-200 bg-amber-50", "text-amber-600"],
                        ["Sudah sama", scanResult.alreadySame, "border-emerald-200 bg-emerald-50", "text-emerald-600"],
                        ["Tanpa data", scanResult.noData, "border-slate-200 bg-slate-50", "text-slate-500"],
                      ].map(([label, count, cardClass, labelClass]) => (
                        <div key={String(label)} className={`rounded-2xl border p-4 ${cardClass}`}>
                          <p className={`text-xs font-bold uppercase tracking-wider ${labelClass}`}>{label}</p>
                          <p className="mt-2 text-3xl font-black text-slate-900">{count}</p>
                        </div>
                      ))}
                    </div>

                    {syncing && progress ? (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex justify-between gap-4 text-sm font-semibold text-blue-800"><span>{progress.label}</span><span>{progress.completed}/{progress.total}</span></div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress.total ? (progress.completed / progress.total) * 100 : 0}%` }} /></div>
                      </div>
                    ) : null}

                    {syncResult ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                        <div className="flex items-center gap-3 font-bold text-emerald-800"><FaCheckCircle /> Sync Ready selesai</div>
                        <div className="mt-3 flex flex-wrap gap-5 text-sm text-emerald-900">
                          <span>Berhasil: <strong>{syncResult.updated}</strong></span>
                          <span>Sudah sama: <strong>{syncResult.alreadySame}</strong></span>
                          <span>Perlu review: <strong>{syncResult.skippedReview}</strong></span>
                          <span>Gagal: <strong>{syncResult.failed.length}</strong></span>
                        </div>
                        {syncResult.failed.length ? <div className="mt-3 rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">{syncResult.failed.map((failure) => <p key={failure.gpId}><strong>{failure.gpCode}:</strong> {failure.message}</p>)}</div> : null}
                      </div>
                    ) : null}

                    <div>
                      <div className="flex gap-2 overflow-x-auto border-b border-slate-200">
                        {tabs.map((tab) => (
                          <button key={tab.value} type="button" onClick={() => setActiveTab(tab.value)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${activeTab === tab.value ? "border-orange-600 text-orange-700" : "border-transparent text-slate-500"}`}>
                            {tab.label} ({countFor(tab.value)})
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                        <div className="max-h-[38vh] overflow-auto">
                          <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                              <tr><th className="px-4 py-3">Group Parent</th><th className="px-4 py-3">GC / Kandidat</th><th className="px-4 py-3">Owner GP Saat Ini</th><th className="px-4 py-3">Owner dari GC</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {rows.map((row) => (
                                <tr key={row.gpId}>
                                  <td className="px-4 py-3"><p className="font-semibold text-slate-900">{row.gpCode}</p><p className="text-xs text-slate-500">{row.gpName}</p></td>
                                  <td className="px-4 py-3"><p className="font-semibold text-slate-800">{row.candidates.length} GC</p><p className="text-xs text-slate-500">{row.uniqueIdentityCount} identitas unik</p></td>
                                  <td className="max-w-56 px-4 py-3 text-xs text-slate-600"><p className="line-clamp-3" title={identitySummary(row.currentIdentity)}>{identitySummary(row.currentIdentity)}</p></td>
                                  <td className="max-w-56 px-4 py-3 text-xs text-slate-700"><p className="line-clamp-3" title={identitySummary(row.candidateIdentity)}>{row.action === "need_review" ? `${row.uniqueIdentityCount} kandidat berbeda` : identitySummary(row.candidateIdentity)}</p></td>
                                  <td className="px-4 py-3"><span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${statusClass(row.action)}`}>{statusLabel(row.action)}</span></td>
                                  <td className="px-4 py-3">
                                    {row.action === "need_review" || row.action === "gp_different" ? (
                                      <button type="button" onClick={() => setReviewRow(row)} disabled={syncing} className="inline-flex items-center gap-2 rounded-lg border border-orange-300 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-50 disabled:opacity-50"><FaEye /> Review</button>
                                    ) : <span className="text-slate-400">-</span>}
                                  </td>
                                </tr>
                              ))}
                              {!rows.length ? <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-500">Tidak ada data pada kategori ini.</td></tr> : null}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={onClose} disabled={syncing} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50">Tutup</button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={onRescan} disabled={scanning || syncing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"><FaRedo /> Cek Ulang</button>
                  <button type="button" onClick={() => setConfirmOpen(true)} disabled={scanning || syncing || !scanResult || scanResult.ready === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"><FaSyncAlt className={syncing ? "animate-spin" : ""} />{syncing ? "Syncing..." : `Sync ${scanResult?.ready || 0} Ready`}</button>
                </div>
              </footer>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        title="Sync Owner Identity yang Siap"
        description={`Salin owner identity ke ${scanResult?.ready || 0} Group Parent berstatus ready? Data akan dicek ulang sebelum setiap update dan data berbeda tidak akan ditimpa.`}
        confirmLabel="Ya, Sync Ready"
        cancelLabel="Batal"
        variant="warning"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); onSyncReady(); }}
      />

      {reviewRow ? (
        <CopyOwnerIdentityModal
          isOpen
          gpId={reviewRow.gpId}
          gpCode={reviewRow.gpCode}
          token={token}
          currentIdentity={reviewRow.currentIdentity}
          onClose={() => setReviewRow(null)}
          onCopied={(identity) => {
            onReviewSynced(reviewRow.gpId, identity);
            setReviewRow(null);
          }}
        />
      ) : null}
    </>
  );
}

