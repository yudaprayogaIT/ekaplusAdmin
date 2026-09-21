"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaAddressBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLink,
  FaPlusCircle,
  FaRedo,
  FaTimes,
} from "react-icons/fa";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type {
  CustomerContactGenerationProgress,
  CustomerContactGenerationResult,
  CustomerContactScanResult,
  MissingCustomerContactRow,
} from "@/utils/generateCustomerContacts";

type ReviewTab = "group_customer" | "branch_customer";

function actionLabel(row: MissingCustomerContactRow): string {
  if (row.action === "link_existing") return "Link existing contact";
  if (row.action === "create_new") return "Create new contact";
  return "Missing name/phone";
}

function actionClass(row: MissingCustomerContactRow): string {
  if (row.action === "link_existing") return "bg-blue-100 text-blue-700";
  if (row.action === "create_new") return "bg-emerald-100 text-emerald-700";
  return "bg-amber-100 text-amber-700";
}

export function MissingCustomerContactModal({
  open,
  scanning,
  scanResult,
  scanError,
  generating,
  progress,
  generationResult,
  onClose,
  onRescan,
  onGenerate,
}: {
  open: boolean;
  scanning: boolean;
  scanResult: CustomerContactScanResult | null;
  scanError: string | null;
  generating: boolean;
  progress: CustomerContactGenerationProgress | null;
  generationResult: CustomerContactGenerationResult | null;
  onClose: () => void;
  onRescan: () => void;
  onGenerate: () => void;
}) {
  const [activeTab, setActiveTab] = useState<ReviewTab>("group_customer");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const rows = useMemo(() => {
    if (!scanResult) return [];
    return activeTab === "group_customer"
      ? scanResult.groupCustomers
      : scanResult.branchCustomers;
  }, [activeTab, scanResult]);

  const totalMissing =
    (scanResult?.groupCustomers.length || 0) +
    (scanResult?.branchCustomers.length || 0);
  const readyCount = scanResult
    ? [...scanResult.groupCustomers, ...scanResult.branchCustomers].filter(
        (row) => row.action !== "missing_data",
      ).length
    : 0;

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
              if (event.target === event.currentTarget && !generating) onClose();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-blue-50 px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <FaAddressBook />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-600">
                      Administrator Tool
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Missing Customer Contacts
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Review hasil pengecekan sebelum membuat atau menghubungkan contact.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={generating}
                  className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-slate-700 disabled:opacity-50"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-6">
                {scanning ? (
                  <div className="flex min-h-72 flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
                    <p className="mt-5 font-semibold text-slate-800">
                      Mengecek Group Customer dan Branch Customer...
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Tahap ini hanya membaca data dan belum membuat contact.
                    </p>
                  </div>
                ) : scanError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                    <div className="flex items-center gap-3 font-semibold">
                      <FaExclamationTriangle />
                      Pengecekan gagal
                    </div>
                    <p className="mt-2 text-sm">{scanError}</p>
                  </div>
                ) : scanResult ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                          Group Customer
                        </p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                          {scanResult.groupCustomers.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                          Branch Customer
                        </p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                          {scanResult.branchCustomers.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                          Total Belum Terhubung
                        </p>
                        <p className="mt-2 text-3xl font-black text-slate-900">
                          {totalMissing}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {readyCount} siap diproses
                        </p>
                      </div>
                    </div>

                    {generating && progress ? (
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <div className="flex items-center justify-between gap-4 text-sm font-semibold text-blue-800">
                          <span>{progress.label}</span>
                          <span>
                            {progress.completed}/{progress.total}
                          </span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all"
                            style={{
                              width: `${
                                progress.total
                                  ? (progress.completed / progress.total) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ) : null}

                    {generationResult ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                        <div className="flex items-center gap-3 font-bold text-emerald-800">
                          <FaCheckCircle />
                          Proses generate selesai
                        </div>
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
                          <p>Link existing: <strong>{generationResult.linkedExistingContact}</strong></p>
                          <p>Contact baru: <strong>{generationResult.createdContactAndLinked}</strong></p>
                          <p>Sudah ada: <strong>{generationResult.skippedExistingRelation}</strong></p>
                          <p>Data kosong: <strong>{generationResult.skippedMissingData}</strong></p>
                          <p>Gagal: <strong>{generationResult.failed.length}</strong></p>
                        </div>
                        {generationResult.failed.length ? (
                          <div className="mt-4 max-h-36 overflow-y-auto rounded-xl border border-red-200 bg-white p-3 text-sm text-red-700">
                            {generationResult.failed.map((failure) => (
                              <p key={`${failure.customerType}-${failure.parentId}`} className="py-1">
                                <strong>{failure.code}</strong>: {failure.message}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div>
                      <div className="flex gap-2 border-b border-slate-200">
                        {(
                          [
                            ["group_customer", "Group Customer", scanResult.groupCustomers.length],
                            ["branch_customer", "Branch Customer", scanResult.branchCustomers.length],
                          ] as const
                        ).map(([value, label, count]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setActiveTab(value)}
                            className={`border-b-2 px-4 py-3 text-sm font-bold ${
                              activeTab === value
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-slate-500"
                            }`}
                          >
                            {label} ({count})
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                        <div className="max-h-[38vh] overflow-auto">
                          <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="sticky top-0 z-10 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                              <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">WhatsApp</th>
                                <th className="px-4 py-3">Rencana</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {rows.map((row) => (
                                <tr key={`${row.customerType}-${row.parentId}`}>
                                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                                    {row.parentId}
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-900">{row.code}</p>
                                    <p className="text-xs text-slate-500">{row.customerName}</p>
                                  </td>
                                  <td className="px-4 py-3 text-slate-700">
                                    {row.contactName || "-"}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                    {row.normalizedPhone || row.phone || "-"}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${actionClass(row)}`}>
                                      {row.action === "link_existing" ? <FaLink /> : row.action === "create_new" ? <FaPlusCircle /> : <FaExclamationTriangle />}
                                      {actionLabel(row)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {rows.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                    Semua customer pada kategori ini sudah memiliki customer contact.
                                  </td>
                                </tr>
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
                <button
                  type="button"
                  onClick={onClose}
                  disabled={generating}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Tutup
                </button>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={onRescan}
                    disabled={scanning || generating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <FaRedo />
                    Cek Ulang
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    disabled={
                      scanning || generating || !scanResult || readyCount === 0
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                  >
                    <FaAddressBook />
                    {generating ? "Generating..." : `Generate ${readyCount} Contact`}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        title="Generate Customer Contact"
        description={`Generate customer contact untuk ${readyCount} customer yang siap diproses? Relasi akan dicek ulang sebelum setiap POST.`}
        confirmLabel="Ya, Generate"
        cancelLabel="Batal"
        variant="warning"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onGenerate();
        }}
      />
    </>
  );
}
