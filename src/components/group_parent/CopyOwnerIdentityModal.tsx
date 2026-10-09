"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCopy,
  FaExclamationTriangle,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { API_CONFIG, apiFetch, getResourceUrl } from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

export interface OwnerIdentityValues {
  owner_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  owner_place_of_birth?: string | null;
  owner_date_of_birth?: string | null;
}

interface GroupCustomerOwnerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  company_name?: string | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  owner_place_of_birth?: string | null;
  owner_date_of_birth?: string | null;
}

interface CopyOwnerIdentityModalProps {
  isOpen: boolean;
  gpId: number;
  gpCode: string;
  token: string;
  currentIdentity: OwnerIdentityValues;
  onClose: () => void;
  onCopied: (identity: OwnerIdentityValues) => void;
}

type ModalStep = "select" | "preview" | "success";
type LoadState = "loading" | "loaded" | "empty" | "error";

const IDENTITY_FIELDS = [
  { key: "owner_name", label: "Nama Pemilik" },
  { key: "owner_phone", label: "No. Telepon" },
  { key: "owner_email", label: "Email" },
  { key: "owner_place_of_birth", label: "Tempat Lahir" },
  { key: "owner_date_of_birth", label: "Tanggal Lahir" },
] as const;

function cleanValue(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDate(value?: string | null): string {
  return cleanValue(value).split("T")[0];
}

function normalizeForComparison(
  key: (typeof IDENTITY_FIELDS)[number]["key"],
  value?: string | null,
): string {
  const cleaned = key === "owner_date_of_birth" ? normalizeDate(value) : cleanValue(value);
  return key === "owner_email" ? cleaned.toLowerCase() : cleaned;
}

function identityFromRow(row: GroupCustomerOwnerRow): OwnerIdentityValues {
  return {
    owner_name: row.owner_full_name,
    owner_phone: row.owner_phone,
    owner_email: row.owner_email,
    owner_place_of_birth: row.owner_place_of_birth,
    owner_date_of_birth: row.owner_date_of_birth,
  };
}

function identitySignature(identity: OwnerIdentityValues): string {
  return IDENTITY_FIELDS.map(({ key }) =>
    normalizeForComparison(key, identity[key]),
  ).join("\u0000");
}

function completeness(identity: OwnerIdentityValues): number {
  return IDENTITY_FIELDS.filter(({ key }) => cleanValue(identity[key])).length;
}

function formatDate(value?: string | null): string {
  const normalized = normalizeDate(value);
  if (!normalized) return "-";
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return cleanValue(value) || "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function displayValue(
  key: (typeof IDENTITY_FIELDS)[number]["key"],
  value?: string | null,
): string {
  if (key === "owner_date_of_birth") return formatDate(value);
  return cleanValue(value) || "-";
}

export function CopyOwnerIdentityModal({
  isOpen,
  gpId,
  gpCode,
  token,
  currentIdentity,
  onClose,
  onCopied,
}: CopyOwnerIdentityModalProps) {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [step, setStep] = useState<ModalStep>("select");
  const [rows, setRows] = useState<GroupCustomerOwnerRow[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadCandidates = useCallback(async () => {
    setLoadState("loading");
    setErrorMessage("");
    setRows([]);
    setSelectedId(null);
    setStep("select");
    try {
      const candidates = await fetchAllQueryRows<GroupCustomerOwnerRow>({
        endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
        token,
        spec: {
          fields: [
            "id",
            "name",
            "gc_name",
            "company_name",
            "owner_full_name",
            "owner_phone",
            "owner_email",
            "owner_place_of_birth",
            "owner_date_of_birth",
          ],
          filters: [["gpid", "=", gpId]],
          order_by: [["name", "asc"]],
          limit: 100,
        },
        errorMessage: "Gagal mengambil data Group Customer.",
      });
      setRows(candidates);
      setLoadState(candidates.length > 0 ? "loaded" : "empty");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data Group Customer.",
      );
      setLoadState("error");
    }
  }, [gpId, token]);

  useEffect(() => {
    if (isOpen) void loadCandidates();
  }, [isOpen, loadCandidates]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  const candidates = useMemo(
    () =>
      rows.map((row) => {
        const identity = identityFromRow(row);
        return {
          row,
          identity,
          filled: completeness(identity),
          signature: identitySignature(identity),
        };
      }),
    [rows],
  );
  const maxCompleteness = Math.max(0, ...candidates.map((item) => item.filled));
  const signatureCounts = useMemo(() => {
    const counts = new Map<string, number>();
    candidates
      .filter((item) => item.filled > 0)
      .forEach((item) => counts.set(item.signature, (counts.get(item.signature) || 0) + 1));
    return counts;
  }, [candidates]);
  const hasConflict = signatureCounts.size > 1;
  const hasAnyIdentity = candidates.some((item) => item.filled > 0);
  const selected = candidates.find((item) => item.row.id === selectedId);

  const handleCopy = async () => {
    if (!selected || selected.filled === 0 || isSaving) return;
    setIsSaving(true);
    setErrorMessage("");
    const copiedIdentity: OwnerIdentityValues = {
      owner_name: cleanValue(selected.identity.owner_name) || null,
      owner_phone: cleanValue(selected.identity.owner_phone) || null,
      owner_email: cleanValue(selected.identity.owner_email) || null,
      owner_place_of_birth:
        cleanValue(selected.identity.owner_place_of_birth) || null,
      // The Group Parent API persists this value in a SQL DATE column.
      owner_date_of_birth:
        normalizeDate(selected.identity.owner_date_of_birth) || null,
    };

    try {
      const payload = {
        owner_full_name: copiedIdentity.owner_name,
        owner_phone: copiedIdentity.owner_phone,
        owner_email: copiedIdentity.owner_email,
        owner_place_of_birth: copiedIdentity.owner_place_of_birth,
        owner_date_of_birth: copiedIdentity.owner_date_of_birth,
      };
      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpId),
        {
          method: "PUT",
          cache: "no-store",
          body: JSON.stringify(payload),
        },
        token,
      );
      if (!response.ok) {
        const json = (await response.json().catch(() => null)) as
          | { message?: unknown; error?: unknown }
          | null;
        const backendMessage =
          typeof json?.message === "string"
            ? json.message
            : typeof json?.error === "string"
              ? json.error
              : null;
        throw new Error(
          backendMessage ||
            `Gagal memperbarui Group Parent (${response.status}).`,
        );
      }
      onCopied(copiedIdentity);
      setStep("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyalin identitas pemilik ke Group Parent.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSaving) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              {step === "preview" ? "Preview Identitas Pemilik" : "Owner Identity"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {step === "preview"
                ? "Periksa data sebelum disalin"
                : step === "success"
                  ? "Identitas berhasil disalin"
                  : "Salin Identitas Pemilik dari GC"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">Group Parent {gpCode}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Tutup"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <FaTimes />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50 p-5 md:p-6">
          {loadState === "loading" ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-slate-600">
              <FaSpinner className="h-7 w-7 animate-spin text-orange-500" />
              <p className="font-medium">Memuat data GC...</p>
            </div>
          ) : null}

          {loadState === "error" ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <FaExclamationTriangle className="h-8 w-8 text-red-500" />
              <p className="mt-4 font-semibold text-slate-900">Gagal mengambil data Group Customer.</p>
              <p className="mt-1 text-sm text-slate-500">{errorMessage} Silakan coba lagi.</p>
              <button type="button" onClick={() => void loadCandidates()} className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                Coba Lagi
              </button>
            </div>
          ) : null}

          {loadState === "empty" ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <FaExclamationTriangle className="h-8 w-8 text-amber-500" />
              <p className="mt-4 font-semibold text-slate-900">Tidak ditemukan Group Customer untuk GP ini.</p>
              <p className="mt-1 text-sm text-slate-500">Tidak ada data yang dapat disalin.</p>
            </div>
          ) : null}

          {loadState === "loaded" && step === "select" ? (
            <div className="space-y-4">
              <div className={`rounded-2xl border px-4 py-3 text-sm ${hasConflict ? "border-amber-200 bg-amber-50 text-amber-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>
                {hasConflict ? (
                  <><strong>Ditemukan perbedaan identitas pemilik pada GC turunan.</strong> Silakan pilih GC yang akan digunakan sebagai sumber.</>
                ) : hasAnyIdentity && candidates.length > 1 ? (
                  <><strong>Identitas pemilik antar-GC sama.</strong> Tetap pilih GC sumber secara manual.</>
                ) : hasAnyIdentity ? (
                  <><strong>Satu GC ditemukan.</strong> Pilih GC tersebut untuk memeriksa preview sebelum menyalin.</>
                ) : (
                  <strong>Tidak ditemukan data identitas pemilik pada GC turunan.</strong>
                )}
              </div>

              <div className="grid gap-3">
                {candidates.map((item) => {
                  const isSelected = selectedId === item.row.id;
                  const isEmpty = item.filled === 0;
                  const identicalCount = signatureCounts.get(item.signature) || 0;
                  return (
                    <label
                      key={item.row.id}
                      className={`block rounded-2xl border bg-white p-4 transition ${isEmpty ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-orange-300"} ${isSelected ? "border-orange-500 ring-2 ring-orange-100" : "border-slate-200"}`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="owner-identity-source"
                          checked={isSelected}
                          disabled={isEmpty}
                          onChange={() => setSelectedId(item.row.id)}
                          className="mt-1 h-4 w-4 accent-orange-600"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-900">{item.row.name || `GC${item.row.id}`}</span>
                              <span className="text-slate-400"> — </span>
                              <span className="font-medium text-slate-700">{item.row.company_name || item.row.gc_name || "-"}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.filled === maxCompleteness && maxCompleteness > 0 ? <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">Paling Lengkap</span> : null}
                              {identicalCount > 1 ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">Identik pada {identicalCount} GC</span> : null}
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{item.filled} / 5 terisi</span>
                            </div>
                          </div>
                          <div className="mt-3 grid gap-x-5 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
                            {IDENTITY_FIELDS.map(({ key, label }) => (
                              <div key={key} className="min-w-0">
                                <p className="text-xs text-slate-500">{label}</p>
                                <p className="mt-0.5 break-words font-medium text-slate-800">{displayValue(key, item.identity[key])}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : null}

          {loadState === "loaded" && step === "preview" && selected ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
                <strong>Sumber:</strong> {selected.row.name || `GC${selected.row.id}`} — {selected.row.company_name || selected.row.gc_name || "-"}
              </div>
              {IDENTITY_FIELDS.some(({ key }) => cleanValue(currentIdentity[key])) ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <strong>Perhatian:</strong> Beberapa data Owner Identity pada GP sudah terisi. Data dari GC yang dipilih akan menggantikan nilai tersebut, termasuk dengan nilai kosong yang terlihat di bawah.
                </div>
              ) : null}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <span>Field</span><span>GP Saat Ini</span><span>Dari GC</span>
                </div>
                {IDENTITY_FIELDS.map(({ key, label }) => {
                  const changed = normalizeForComparison(key, currentIdentity[key]) !== normalizeForComparison(key, selected.identity[key]);
                  return (
                    <div key={key} className={`grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 ${changed ? "bg-orange-50/60" : ""}`}>
                      <div className="font-semibold text-slate-700">{label}{changed ? <span className="ml-2 inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-700">Berubah</span> : null}</div>
                      <div className="break-words text-slate-600">{displayValue(key, currentIdentity[key])}</div>
                      <div className="break-words font-semibold text-slate-900">{displayValue(key, selected.identity[key])}</div>
                    </div>
                  );
                })}
              </div>
              {errorMessage ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}
            </div>
          ) : null}

          {step === "success" ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <FaCheckCircle className="h-12 w-12 text-emerald-500" />
              <p className="mt-4 text-lg font-bold text-slate-900">Identitas pemilik berhasil disalin ke GP.</p>
              <p className="mt-1 text-sm text-slate-500">Data Group Parent telah diperbarui menggunakan GC yang dipilih.</p>
            </div>
          ) : null}
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 md:px-6">
          {step === "select" && loadState === "loaded" ? (
            <>
              <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Batal</button>
              <button type="button" onClick={() => setStep("preview")} disabled={!selected || selected.filled === 0 || loadState !== "loaded"} className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Lanjutkan</button>
            </>
          ) : step === "preview" ? (
            <>
              <button type="button" onClick={() => { setErrorMessage(""); setStep("select"); }} disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"><FaArrowLeft /> Kembali</button>
              <button type="button" onClick={() => void handleCopy()} disabled={isSaving} className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white disabled:bg-orange-300">{isSaving ? <FaSpinner className="animate-spin" /> : <FaCopy />} {isSaving ? "Menyimpan..." : "Salin ke GP"}</button>
            </>
          ) : step === "success" ? (
            <button type="button" onClick={onClose} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Selesai</button>
          ) : (
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Tutup</button>
          )}
        </footer>
      </div>
    </div>
  );
}
