"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";

type PolicyType = "nbid" | "gpid" | "gcid" | "bcid";

interface EntityOption {
  id: number;
  label: string;
}

interface PolicyLookups {
  nbid: EntityOption[];
  gpid: EntityOption[];
  gcid: EntityOption[];
  bcid: EntityOption[];
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
}

interface GroupCustomerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
}

interface BranchCustomerRow {
  id: number;
  name?: string | null;
  gcid?: number | { id?: number; gc_name?: string; name?: string } | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
}

interface BranchRow {
  id: number;
  branch_name?: string | null;
  city?: string | null;
}

interface CreditChangeRequestFormModalProps {
  open: boolean;
  onClose: () => void;
  saving?: boolean;
  onSave: (payload: {
    policyType: PolicyType;
    policyId: number;
    requestedCreditLimit?: number;
    requestedPaymentTerm?: number;
    requestedLimitCustomerOverdue?: number;
    reason: string;
  }) => Promise<void>;
}

const POLICY_TYPE_OPTIONS: Array<{ value: PolicyType; label: string }> = [
  { value: "nbid", label: "National Brand" },
  { value: "gpid", label: "Group Parent" },
  { value: "gcid", label: "Group Customer" },
  { value: "bcid", label: "Branch Customer" },
];

function buildBranchCustomerLabel(
  row: BranchCustomerRow,
  gcMap: Map<number, string>,
  branchMap: Map<number, string>,
): string {
  const gcId =
    typeof row.gcid === "object" ? Number(row.gcid.id || 0) : Number(row.gcid || 0);
  const branchId =
    typeof row.branch === "object"
      ? Number(row.branch.id || 0)
      : Number(row.branch || 0);
  const gcName =
    (typeof row.gcid === "object" && (row.gcid.gc_name || row.gcid.name)) ||
    gcMap.get(gcId) ||
    "";
  const branchName =
    (typeof row.branch === "object" && (row.branch.city || row.branch.branch_name)) ||
    branchMap.get(branchId) ||
    "";
  const combined = [gcName, branchName].filter(Boolean).join(" - ");
  return combined || row.name || `Branch Customer ${row.id}`;
}

async function loadLookups(token: string): Promise<PolicyLookups> {
  const [nbRes, gpRes, gcRes, bcRes, branchRes] = await Promise.all([
    apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
        fields: ["id", "name", "nb_name"],
        limit: 1000000,
      }),
      { method: "GET", cache: "no-store" },
      token,
    ),
    apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
        fields: ["id", "name", "gp_name"],
        limit: 1000000,
      }),
      { method: "GET", cache: "no-store" },
      token,
    ),
    apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
        fields: ["id", "name", "gc_name"],
        limit: 1000000,
      }),
      { method: "GET", cache: "no-store" },
      token,
    ),
    apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
        fields: ["id", "name", "gcid", "branch"],
        limit: 1000000,
      }),
      { method: "GET", cache: "no-store" },
      token,
    ),
    apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
        fields: ["id", "branch_name", "city"],
        limit: 1000000,
      }),
      { method: "GET", cache: "no-store" },
      token,
    ),
  ]);

  if (!nbRes.ok) throw new Error(`Failed to fetch national brand (${nbRes.status})`);
  if (!gpRes.ok) throw new Error(`Failed to fetch group parent (${gpRes.status})`);
  if (!gcRes.ok) throw new Error(`Failed to fetch group customer (${gcRes.status})`);
  if (!bcRes.ok) throw new Error(`Failed to fetch branch customer (${bcRes.status})`);
  if (!branchRes.ok) throw new Error(`Failed to fetch branch (${branchRes.status})`);

  const [nbJson, gpJson, gcJson, bcJson, branchJson] = await Promise.all([
    nbRes.json(),
    gpRes.json(),
    gcRes.json(),
    bcRes.json(),
    branchRes.json(),
  ]);

  const nbs = (Array.isArray(nbJson?.data) ? nbJson.data : []) as NationalBrandRow[];
  const gps = (Array.isArray(gpJson?.data) ? gpJson.data : []) as GroupParentRow[];
  const gcs = (Array.isArray(gcJson?.data) ? gcJson.data : []) as GroupCustomerRow[];
  const bcs = (Array.isArray(bcJson?.data) ? bcJson.data : []) as BranchCustomerRow[];
  const branches = (Array.isArray(branchJson?.data) ? branchJson.data : []) as BranchRow[];

  const gcMap = new Map(
    gcs.map((row) => [row.id, row.gc_name || row.name || `Group Customer ${row.id}`]),
  );
  const branchMap = new Map(
    branches.map((row) => [row.id, row.city || row.branch_name || `Branch ${row.id}`]),
  );

  return {
    nbid: nbs.map((row) => ({
      id: row.id,
      label: row.nb_name || row.name || `National Brand ${row.id}`,
    })),
    gpid: gps.map((row) => ({
      id: row.id,
      label: row.gp_name || row.name || `Group Parent ${row.id}`,
    })),
    gcid: gcs.map((row) => ({
      id: row.id,
      label: row.gc_name || row.name || `Group Customer ${row.id}`,
    })),
    bcid: bcs.map((row) => ({
      id: row.id,
      label: buildBranchCustomerLabel(row, gcMap, branchMap),
    })),
  };
}

function formatIntegerWithThousands(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function normalizeCurrencyInput(value: string): string {
  const sanitized = value.replace(/[^0-9.,]/g, "");
  if (!sanitized) return "";

  if (!sanitized.includes(",")) {
    return formatIntegerWithThousands(sanitized.replace(/\./g, ""));
  }

  const withoutDots = sanitized.replace(/\./g, "");
  const [rawIntegerPart = "", ...rawDecimalParts] = withoutDots.split(",");
  const formattedIntegerPart = formatIntegerWithThousands(rawIntegerPart);
  const decimalPart = rawDecimalParts.join("").replace(/\D/g, "");

  if (sanitized.endsWith(",") && !decimalPart) {
    return `${formattedIntegerPart},`;
  }

  return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
}

function parseCurrencyInput(value: string): number | undefined {
  const sanitized = value.replace(/[^0-9.,]/g, "").trim();
  if (!sanitized) return undefined;

  const hasComma = sanitized.includes(",");
  const hasDot = sanitized.includes(".");

  let normalized = sanitized;
  if (hasComma && hasDot) {
    const lastComma = sanitized.lastIndexOf(",");
    const lastDot = sanitized.lastIndexOf(".");
    normalized =
      lastComma > lastDot
        ? sanitized.replace(/\./g, "").replace(/,/g, ".")
        : sanitized.replace(/,/g, "");
  } else if (hasComma) {
    normalized = sanitized.replace(/\./g, "").replace(/,/g, ".");
  } else if ((sanitized.match(/\./g) || []).length > 1) {
    normalized = sanitized.replace(/\./g, "");
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseIntegerInput(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = Number(trimmed);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

export function CreditChangeRequestFormModal({
  open,
  onClose,
  onSave,
  saving = false,
}: CreditChangeRequestFormModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [policyType, setPolicyType] = useState<PolicyType>("nbid");
  const [policyId, setPolicyId] = useState("");
  const [requestedCreditLimit, setRequestedCreditLimit] = useState("");
  const [requestedPaymentTerm, setRequestedPaymentTerm] = useState("");
  const [requestedLimitCustomerOverdue, setRequestedLimitCustomerOverdue] =
    useState("");
  const [reason, setReason] = useState("");
  const [lookups, setLookups] = useState<PolicyLookups>({
    nbid: [],
    gpid: [],
    gcid: [],
    bcid: [],
  });
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPolicyType("nbid");
    setPolicyId("");
    setRequestedCreditLimit("");
    setRequestedPaymentTerm("");
    setRequestedLimitCustomerOverdue("");
    setReason("");
    setError(null);
  }, [open]);

  useEffect(() => {
    let cancelled = false;

    async function fetchLookups() {
      if (!open || !token || !isAuthenticated) return;

      setLookupLoading(true);
      try {
        const data = await loadLookups(token);
        if (!cancelled) {
          setLookups(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setLookups({ nbid: [], gpid: [], gcid: [], bcid: [] });
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat data policy",
          );
        }
      } finally {
        if (!cancelled) {
          setLookupLoading(false);
        }
      }
    }

    void fetchLookups();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, open, token]);

  useEffect(() => {
    if (!open) return;
    setPolicyId("");
  }, [open, policyType]);

  const policyOptions = useMemo(() => lookups[policyType] || [], [lookups, policyType]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const parsedPolicyId = Number(policyId || 0);
    const parsedCreditLimit = parseCurrencyInput(requestedCreditLimit);
    const parsedPaymentTerm = parseIntegerInput(requestedPaymentTerm);
    const parsedLimitCustomerOverdue = parseIntegerInput(
      requestedLimitCustomerOverdue,
    );
    const trimmedReason = reason.trim();

    if (!parsedPolicyId) {
      setError("Policy wajib dipilih.");
      return;
    }

    if (!trimmedReason) {
      setError("Reason wajib diisi.");
      return;
    }

    if (
      parsedCreditLimit === undefined &&
      parsedPaymentTerm === undefined &&
      parsedLimitCustomerOverdue === undefined
    ) {
      setError("Minimal isi salah satu nilai perubahan yang diajukan.");
      return;
    }

    if (parsedCreditLimit !== undefined) {
      if (!Number.isFinite(parsedCreditLimit) || parsedCreditLimit < 0) {
        setError("Requested credit limit harus berupa angka valid 0 atau lebih.");
        return;
      }
    }

    if (parsedPaymentTerm !== undefined) {
      if (!Number.isInteger(parsedPaymentTerm) || parsedPaymentTerm < 0) {
        setError("Requested payment term harus berupa angka bulat 0 atau lebih.");
        return;
      }
    }

    if (parsedLimitCustomerOverdue !== undefined) {
      if (
        !Number.isInteger(parsedLimitCustomerOverdue) ||
        parsedLimitCustomerOverdue < 0
      ) {
        setError(
          "Requested limit customer overdue harus berupa angka bulat 0 atau lebih.",
        );
        return;
      }
    }

    try {
      await onSave({
        policyType,
        policyId: parsedPolicyId,
        requestedCreditLimit: parsedCreditLimit,
        requestedPaymentTerm: parsedPaymentTerm,
        requestedLimitCustomerOverdue: parsedLimitCustomerOverdue,
        reason: trimmedReason,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Gagal menyimpan credit change request",
      );
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <FaFileInvoiceDollar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Tambah Credit Change Request
                </h2>
                <p className="text-sm text-gray-500">
                  Ajukan perubahan credit limit, payment term, atau overdue limit
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5 p-6">
            {error ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <FaExclamationTriangle className="mt-0.5" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Policy Type
                </label>
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value as PolicyType)}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                >
                  {POLICY_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Policy
                </label>
                <select
                  value={policyId}
                  onChange={(e) => setPolicyId(e.target.value)}
                  disabled={saving || lookupLoading}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                >
                  <option value="">
                    {lookupLoading ? "Memuat policy..." : "Pilih policy"}
                  </option>
                  {policyOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Nilai yang dikirim ke database adalah `id` dari policy yang dipilih.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Requested Credit Limit
                </label>
                <input
                  type="text"
                  value={requestedCreditLimit}
                  onChange={(e) =>
                    setRequestedCreditLimit(normalizeCurrencyInput(e.target.value))
                  }
                  disabled={saving}
                  placeholder="Contoh: 1.000.000"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Requested Payment Term
                </label>
                <input
                  type="number"
                  min="0"
                  value={requestedPaymentTerm}
                  onChange={(e) => setRequestedPaymentTerm(e.target.value)}
                  disabled={saving}
                  placeholder="Hari"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Requested Limit Customer Overdue
                </label>
                <input
                  type="number"
                  min="0"
                  value={requestedLimitCustomerOverdue}
                  onChange={(e) => setRequestedLimitCustomerOverdue(e.target.value)}
                  disabled={saving}
                  placeholder="Hari"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={saving}
                  rows={5}
                  placeholder="Jelaskan alasan pengajuan perubahan credit"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaSave className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan Request"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
