"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBuilding,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlusCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { API_CONFIG, apiFetch, getApiUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import type { WorkflowActionItem } from "@/services/workflowActionService";

interface MasterRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nb_name?: string | null;
  nbid?: number | null;
  credit_limit?: number | null;
  payment_term?: number | null;
  limit_customer_overdue?: number | null;
}

type ReviewMode = "existing" | "create";

export interface ManualMasterValues {
  gpManual?: string;
  nbManual?: string;
  oldGpid?: number;
  oldNbid?: number;
}

export interface ManualMasterResolution {
  gpid?: number;
  nbid?: number;
}

interface Props {
  open: boolean;
  action: WorkflowActionItem | null;
  values: ManualMasterValues;
  customerName: string;
  onClose: () => void;
  onConfirm: (resolution: ManualMasterResolution) => Promise<void>;
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function formatCurrency(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function MasterPolicySummary({ row }: { row: MasterRow }) {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
      <div className="rounded-lg bg-white/75 px-2.5 py-2">
        <span className="block text-slate-500">Credit Limit</span>
        <span className="mt-0.5 block truncate font-semibold text-slate-700">
          {formatCurrency(row.credit_limit)}
        </span>
      </div>
      <div className="rounded-lg bg-white/75 px-2.5 py-2">
        <span className="block text-slate-500">TOP</span>
        <span className="mt-0.5 block font-semibold text-slate-700">
          {row.payment_term === null || row.payment_term === undefined
            ? "-"
            : `${row.payment_term} hari`}
        </span>
      </div>
      <div className="rounded-lg bg-white/75 px-2.5 py-2">
        <span className="block text-slate-500">Overdue Limit</span>
        <span className="mt-0.5 block font-semibold text-slate-700">
          {row.limit_customer_overdue === null ||
          row.limit_customer_overdue === undefined
            ? "-"
            : `${row.limit_customer_overdue} hari`}
        </span>
      </div>
    </div>
  );
}

function extractCreatedId(body: unknown): number | null {
  if (!body || typeof body !== "object" || !("data" in body)) return null;
  const data = body.data;
  if (!data || typeof data !== "object" || !("id" in data)) return null;
  const id = Number(data.id);
  return Number.isFinite(id) && id > 0 ? id : null;
}

async function createMaster(
  token: string,
  endpoint: string,
  payload: Record<string, unknown>,
  label: string,
): Promise<number> {
  const response = await apiFetch(
    getApiUrl(endpoint),
    {
      method: "POST",
      cache: "no-store",
      body: JSON.stringify(payload),
    },
    token,
  );
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : `Gagal membuat ${label} (${response.status})`;
    throw new Error(message);
  }
  const id = extractCreatedId(body);
  if (!id) throw new Error(`${label} berhasil dibuat, tetapi ID tidak ditemukan.`);
  return id;
}

function MasterReviewCard({
  kind,
  requestedName,
  rows,
  loading,
  mode,
  onModeChange,
  selectedId,
  onSelectedIdChange,
  approvedName,
  onApprovedNameChange,
}: {
  kind: "gp" | "nb";
  requestedName: string;
  rows: MasterRow[];
  loading: boolean;
  mode: ReviewMode;
  onModeChange: (mode: ReviewMode) => void;
  selectedId: number | null;
  onSelectedIdChange: (id: number | null) => void;
  approvedName: string;
  onApprovedNameChange: (name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const label = kind === "gp" ? "Group Parent" : "National Brand";
  const selectedRow = rows.find((row) => Number(row.id) === selectedId);
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? rows.filter((row) =>
          `${row.name || ""} ${row.gp_name || ""} ${row.nb_name || ""}`
            .toLowerCase()
            .includes(query),
        )
      : rows;
    return filtered.slice(0, 20);
  }, [rows, search]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
            Usulan sales · {label}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {requestedName}
          </h3>
        </div>
        <FaBuilding className="mt-1 text-blue-500" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => onModeChange("existing")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "existing"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Pilih Existing
        </button>
        <button
          type="button"
          onClick={() => onModeChange("create")}
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            mode === "create"
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Buat Baru
        </button>
      </div>

      {mode === "existing" ? (
        <div className="mt-4">
          {selectedRow ? (
            <div className="rounded-xl border-2 border-blue-400 bg-blue-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                    {label} terpilih
                  </p>
                  <p className="mt-1 truncate font-bold text-blue-950">
                    {(kind === "gp"
                      ? selectedRow.gp_name
                      : selectedRow.nb_name) || selectedRow.name}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-blue-700">
                    {selectedRow.name || `${label} #${selectedRow.id}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectedIdChange(null)}
                  className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                >
                  Ganti
                </button>
              </div>
              <MasterPolicySummary row={selectedRow} />
            </div>
          ) : (
            <>
              <label className="text-sm font-semibold text-slate-700">
                Cari {label}
              </label>
              <div className="relative mt-2">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Nama atau kode ${label}`}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
            {loading ? (
              <p className="py-5 text-center text-sm text-slate-500">
                Memuat referensi...
              </p>
            ) : filteredRows.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 py-5 text-center text-sm text-slate-500">
                Master tidak ditemukan.
              </p>
            ) : (
              filteredRows.map((row) => {
                const rowLabel =
                  (kind === "gp" ? row.gp_name : row.nb_name) ||
                  row.name ||
                  `${label} #${row.id}`;
                const selected = selectedId === Number(row.id);
                return (
                  <button
                    type="button"
                    key={row.id}
                    onClick={() => onSelectedIdChange(Number(row.id))}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                      selected
                        ? "border-blue-400 bg-blue-50 text-blue-800"
                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {rowLabel}
                      </span>
                      {row.name && row.name !== rowLabel ? (
                        <span className="text-xs text-slate-500">{row.name}</span>
                      ) : null}
                      </span>
                      {selected ? <FaCheckCircle className="shrink-0" /> : null}
                    </span>
                    <MasterPolicySummary row={row} />
                  </button>
                );
              })
            )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <label className="flex items-center gap-2 text-sm font-bold text-emerald-800">
            <FaPlusCircle /> Nama {label} Baru
          </label>
          <input
            value={approvedName}
            onChange={(event) => onApprovedNameChange(event.target.value.toUpperCase())}
            className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm font-semibold uppercase focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <p className="mt-2 text-xs text-emerald-700">
            Marketing dapat memperbaiki penamaan sebelum master dibuat.
          </p>
        </div>
      )}
    </section>
  );
}

export function ManualMasterApprovalModal({
  open,
  action,
  values,
  customerName,
  onClose,
  onConfirm,
}: Props) {
  const { token } = useAuth();
  const [nationalBrands, setNationalBrands] = useState<MasterRow[]>([]);
  const [groupParents, setGroupParents] = useState<MasterRow[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nbMode, setNbMode] = useState<ReviewMode>("create");
  const [gpMode, setGpMode] = useState<ReviewMode>("create");
  const [selectedNbid, setSelectedNbid] = useState<number | null>(null);
  const [selectedGpid, setSelectedGpid] = useState<number | null>(null);
  const [nbName, setNbName] = useState("");
  const [gpName, setGpName] = useState("");

  useEffect(() => {
    if (!open) return;
    setNbMode("create");
    setGpMode("create");
    setSelectedNbid(null);
    setSelectedGpid(null);
    setNbName(normalizeName(values.nbManual || ""));
    setGpName(normalizeName(values.gpManual || ""));
    setError(null);
  }, [open, values.gpManual, values.nbManual]);

  useEffect(() => {
    if (!open || !token) return;
    let cancelled = false;
    setLoadingReferences(true);
    Promise.all([
      values.nbManual
        ? fetchAllQueryRows<MasterRow>({
            endpoint: API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
            spec: {
              fields: [
                "id",
                "name",
                "nb_name",
                "credit_limit",
                "payment_term",
                "limit_customer_overdue",
              ],
              limit: 100,
            },
            token,
            errorMessage: "Gagal memuat referensi National Brand",
          })
        : Promise.resolve([]),
      values.gpManual
        ? fetchAllQueryRows<MasterRow>({
            endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
            spec: {
              fields: [
                "id",
                "name",
                "gp_name",
                "nbid",
                "credit_limit",
                "payment_term",
                "limit_customer_overdue",
              ],
              limit: 100,
            },
            token,
            errorMessage: "Gagal memuat referensi Group Parent",
          })
        : Promise.resolve([]),
    ])
      .then(([nbRows, gpRows]) => {
        if (cancelled) return;
        setNationalBrands(nbRows);
        setGroupParents(gpRows);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat referensi master.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingReferences(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, token, values.gpManual, values.nbManual]);

  async function handleConfirm() {
    if (!token || !action) return;

    if (values.nbManual && nbMode === "existing" && !selectedNbid) {
      setError("Pilih National Brand existing yang sesuai.");
      return;
    }
    if (values.gpManual && gpMode === "existing" && !selectedGpid) {
      setError("Pilih Group Parent existing yang sesuai.");
      return;
    }
    if (values.nbManual && nbMode === "create" && !normalizeName(nbName)) {
      setError("Nama National Brand baru wajib diisi.");
      return;
    }
    if (values.gpManual && gpMode === "create" && !normalizeName(gpName)) {
      setError("Nama Group Parent baru wajib diisi.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      let nbid = values.nbManual ? selectedNbid : null;
      if (values.nbManual && nbMode === "create") {
        nbid = await createMaster(
          token,
          API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
          {
            nb_name: normalizeName(nbName),
            credit_limit_active: 0,
            credit_limit: null,
            payment_term_active: 0,
            payment_term: null,
            limit_customer_overdue_active: 0,
            limit_customer_overdue: null,
          },
          "National Brand",
        );
        setNationalBrands((rows) => [
          { id: nbid!, name: `NB${nbid}`, nb_name: normalizeName(nbName) },
          ...rows,
        ]);
        setSelectedNbid(nbid);
        setNbMode("existing");
      }

      let gpid = values.gpManual ? selectedGpid : null;
      if (values.gpManual && gpMode === "create") {
        const inheritedNbid =
          nbid ||
          groupParents.find(
            (row) => Number(row.id) === Number(values.oldGpid),
          )?.nbid ||
          values.oldNbid ||
          null;
        gpid = await createMaster(
          token,
          API_CONFIG.ENDPOINTS.GROUP_PARENT,
          {
            gp_name: normalizeName(gpName),
            ...(inheritedNbid ? { nbid: inheritedNbid } : {}),
            credit_limit_active: 0,
            credit_limit: null,
            payment_term_active: 0,
            payment_term: null,
            limit_customer_overdue_active: 0,
            limit_customer_overdue: null,
          },
          "Group Parent",
        );
        setGroupParents((rows) => [
          {
            id: gpid!,
            name: `GP${gpid}`,
            gp_name: normalizeName(gpName),
            nbid,
          },
          ...rows,
        ]);
        setSelectedGpid(gpid);
        setGpMode("existing");
      }

      await onConfirm({
        ...(nbid ? { nbid } : {}),
        ...(gpid ? { gpid } : {}),
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Gagal memproses review master.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={() => {
            if (!submitting) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-slate-50 shadow-2xl"
          >
            <header className="bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-5 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-2xl" />
                    <div>
                      <h2 className="text-xl font-bold sm:text-2xl">
                        Review Master Customer
                      </h2>
                      <p className="mt-1 text-sm text-emerald-50">
                        Waiting Marketing · {customerName}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Tutup review master"
                  disabled={submitting}
                  onClick={onClose}
                  className="rounded-xl bg-white/15 p-2.5 transition hover:bg-white/25 disabled:opacity-50"
                >
                  <FaTimes />
                </button>
              </div>
            </header>

            <div className="overflow-y-auto p-5 sm:p-7">
              <div className="mb-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <FaExclamationTriangle className="mt-0.5 shrink-0" />
                <p>
                  Nama manual dari sales belum akan langsung dipakai. Cocokkan
                  dengan master existing atau koreksi nama sebelum membuat master
                  baru.
                </p>
              </div>

              <div className="space-y-4">
                {values.nbManual ? (
                  <MasterReviewCard
                    kind="nb"
                    requestedName={values.nbManual}
                    rows={nationalBrands}
                    loading={loadingReferences}
                    mode={nbMode}
                    onModeChange={(mode) => {
                      setNbMode(mode);
                      setError(null);
                    }}
                    selectedId={selectedNbid}
                    onSelectedIdChange={setSelectedNbid}
                    approvedName={nbName}
                    onApprovedNameChange={setNbName}
                  />
                ) : null}
                {values.gpManual ? (
                  <MasterReviewCard
                    kind="gp"
                    requestedName={values.gpManual}
                    rows={groupParents}
                    loading={loadingReferences}
                    mode={gpMode}
                    onModeChange={(mode) => {
                      setGpMode(mode);
                      setError(null);
                    }}
                    selectedId={selectedGpid}
                    onSelectedIdChange={setSelectedGpid}
                    approvedName={gpName}
                    onApprovedNameChange={setGpName}
                  />
                ) : null}
              </div>

              {error ? (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
              <button
                type="button"
                disabled={submitting}
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={submitting || loadingReferences}
                onClick={() => void handleConfirm()}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Memproses..." : `Konfirmasi & ${action?.action || "Approve"}`}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
