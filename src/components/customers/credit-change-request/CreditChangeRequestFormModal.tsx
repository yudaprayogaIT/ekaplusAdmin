"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaImage,
  FaSearch,
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

interface PolicyLookupMeta {
  page: number;
  hasMore: boolean;
  loaded: boolean;
  search: string;
}

type PolicyLookupMetaMap = Record<PolicyType, PolicyLookupMeta>;

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
    identityAttachment?: File | null;
  }) => Promise<void>;
}

const POLICY_TYPE_OPTIONS: Array<{ value: PolicyType; label: string }> = [
  { value: "nbid", label: "National Brand" },
  { value: "gpid", label: "Group Parent" },
  { value: "gcid", label: "Group Customer" },
  { value: "bcid", label: "Branch Customer" },
];

const LOOKUP_PAGE_SIZE = 20;
const EMPTY_LOOKUP_META: PolicyLookupMetaMap = {
  nbid: { page: 0, hasMore: true, loaded: false, search: "" },
  gpid: { page: 0, hasMore: true, loaded: false, search: "" },
  gcid: { page: 0, hasMore: true, loaded: false, search: "" },
  bcid: { page: 0, hasMore: true, loaded: false, search: "" },
};

function buildBranchCustomerLabel(
  row: BranchCustomerRow,
  gcMap: Map<number, string>,
  branchMap: Map<number, string>,
): string {
  const gcObject =
    row.gcid && typeof row.gcid === "object" ? row.gcid : null;
  const branchObject =
    row.branch && typeof row.branch === "object" ? row.branch : null;

  const gcId =
    gcObject ? Number(gcObject.id || 0) : Number(row.gcid || 0);
  const branchId =
    branchObject ? Number(branchObject.id || 0) : Number(row.branch || 0);
  const gcName =
    gcObject?.gc_name ||
    gcObject?.name ||
    gcMap.get(gcId) ||
    "";
  const branchName =
    branchObject?.city ||
    branchObject?.branch_name ||
    branchMap.get(branchId) ||
    "";
  const combined = [gcName, branchName].filter(Boolean).join(" - ");
  return combined || row.name || `Branch Customer ${row.id}`;
}

async function loadLookupPage(
  token: string,
  policyType: PolicyType,
  page: number,
  search: string,
): Promise<{ items: EntityOption[]; hasMore: boolean }> {
  const searchValue = search.trim();

  switch (policyType) {
    case "nbid": {
      const res = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
          fields: ["id", "name", "nb_name"],
          page,
          ...(searchValue ? { search: searchValue } : {}),
        }),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch national brand (${res.status})`);
      }

      const json = await res.json();
      const rows = (Array.isArray(json?.data) ? json.data : []) as NationalBrandRow[];
      return {
        items: rows.map((row) => ({
          id: row.id,
          label: row.nb_name || row.name || `National Brand ${row.id}`,
        })),
        hasMore: rows.length >= LOOKUP_PAGE_SIZE,
      };
    }
    case "gpid": {
      const res = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
          fields: ["id", "name", "gp_name"],
          page,
          ...(searchValue ? { search: searchValue } : {}),
        }),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch group parent (${res.status})`);
      }

      const json = await res.json();
      const rows = (Array.isArray(json?.data) ? json.data : []) as GroupParentRow[];
      return {
        items: rows.map((row) => ({
          id: row.id,
          label: row.gp_name || row.name || `Group Parent ${row.id}`,
        })),
        hasMore: rows.length >= LOOKUP_PAGE_SIZE,
      };
    }
    case "gcid": {
      const res = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
          fields: ["id", "name", "gc_name"],
          page,
          ...(searchValue ? { search: searchValue } : {}),
        }),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch group customer (${res.status})`);
      }

      const json = await res.json();
      const rows = (Array.isArray(json?.data) ? json.data : []) as GroupCustomerRow[];
      return {
        items: rows.map((row) => ({
          id: row.id,
          label: row.gc_name || row.name || `Group Customer ${row.id}`,
        })),
        hasMore: rows.length >= LOOKUP_PAGE_SIZE,
      };
    }
    case "bcid": {
      const [bcRes, gcRes, branchRes] = await Promise.all([
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
            fields: ["id", "name", "gcid", "branch"],
            page,
            ...(searchValue ? { search: searchValue } : {}),
          }),
          { method: "GET", cache: "no-store" },
          token,
        ),
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
            fields: ["id", "name", "gc_name"],
            page: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        ),
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
            fields: ["id", "branch_name", "city"],
            page: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        ),
      ]);

      if (!bcRes.ok) {
        throw new Error(`Failed to fetch branch customer (${bcRes.status})`);
      }
      if (!gcRes.ok) {
        throw new Error(`Failed to fetch group customer (${gcRes.status})`);
      }
      if (!branchRes.ok) {
        throw new Error(`Failed to fetch branch (${branchRes.status})`);
      }

      const [bcJson, gcJson, branchJson] = await Promise.all([
        bcRes.json(),
        gcRes.json(),
        branchRes.json(),
      ]);

      const branchCustomers = (Array.isArray(bcJson?.data)
        ? bcJson.data
        : []) as BranchCustomerRow[];
      const groupCustomers = (Array.isArray(gcJson?.data)
        ? gcJson.data
        : []) as GroupCustomerRow[];
      const branches = (Array.isArray(branchJson?.data)
        ? branchJson.data
        : []) as BranchRow[];

      const gcMap = new Map(
        groupCustomers.map((row) => [
          row.id,
          row.gc_name || row.name || `Group Customer ${row.id}`,
        ]),
      );
      const branchMap = new Map(
        branches.map((row) => [
          row.id,
          row.city || row.branch_name || `Branch ${row.id}`,
        ]),
      );

      return {
        items: branchCustomers.map((row) => ({
          id: row.id,
          label: buildBranchCustomerLabel(row, gcMap, branchMap),
        })),
        hasMore: branchCustomers.length >= LOOKUP_PAGE_SIZE,
      };
    }
    default:
      return { items: [], hasMore: false };
  }
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
  const policyDropdownRef = useRef<HTMLDivElement | null>(null);
  const [policyType, setPolicyType] = useState<PolicyType>("nbid");
  const [policyId, setPolicyId] = useState("");
  const [policySearch, setPolicySearch] = useState("");
  const [debouncedPolicySearch, setDebouncedPolicySearch] = useState("");
  const [policyDropdownOpen, setPolicyDropdownOpen] = useState(false);
  const [requestedCreditLimit, setRequestedCreditLimit] = useState("");
  const [requestedPaymentTerm, setRequestedPaymentTerm] = useState("");
  const [requestedLimitCustomerOverdue, setRequestedLimitCustomerOverdue] =
    useState("");
  const [reason, setReason] = useState("");
  const [identityAttachment, setIdentityAttachment] = useState<File | null>(null);
  const [lookups, setLookups] = useState<PolicyLookups>({
    nbid: [],
    gpid: [],
    gcid: [],
    bcid: [],
  });
  const [lookupMeta, setLookupMeta] = useState<PolicyLookupMetaMap>(EMPTY_LOOKUP_META);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPolicyType("nbid");
    setPolicyId("");
    setPolicySearch("");
    setDebouncedPolicySearch("");
    setPolicyDropdownOpen(false);
    setRequestedCreditLimit("");
    setRequestedPaymentTerm("");
    setRequestedLimitCustomerOverdue("");
    setReason("");
    setIdentityAttachment(null);
    setError(null);
    setLookups({
      nbid: [],
      gpid: [],
      gcid: [],
      bcid: [],
    });
    setLookupMeta(EMPTY_LOOKUP_META);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      setDebouncedPolicySearch(policySearch.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [open, policySearch]);

  useEffect(() => {
    if (!policyDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (
        policyDropdownRef.current &&
        !policyDropdownRef.current.contains(event.target as Node)
      ) {
        setPolicyDropdownOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [policyDropdownOpen]);

  useEffect(() => {
    let cancelled = false;

    async function fetchLookupPage(page: number) {
      if (!open || !token || !isAuthenticated) return;

      setLookupLoading(true);
      try {
        const result = await loadLookupPage(
          token,
          policyType,
          page,
          debouncedPolicySearch,
        );
        if (!cancelled) {
          setLookups((current) => ({
            ...current,
            [policyType]:
              page === 1
                ? result.items
                : [
                    ...current[policyType],
                    ...result.items.filter(
                      (item) => !current[policyType].some((existing) => existing.id === item.id),
                    ),
                  ],
          }));
          setLookupMeta((current) => ({
            ...current,
            [policyType]: {
              page,
              hasMore: result.hasMore,
              loaded: true,
              search: debouncedPolicySearch,
            },
          }));
        }
      } catch (loadError) {
        if (!cancelled) {
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

    if (
      !lookupMeta[policyType].loaded ||
      lookupMeta[policyType].search !== debouncedPolicySearch
    ) {
      void fetchLookupPage(1);
    }

    return () => {
      cancelled = true;
    };
  }, [debouncedPolicySearch, isAuthenticated, lookupMeta, open, policyType, token]);

  useEffect(() => {
    if (!open) return;
    setPolicyId("");
    setPolicySearch("");
    setDebouncedPolicySearch("");
    setPolicyDropdownOpen(false);
  }, [open, policyType]);

  const policyOptions = useMemo(() => lookups[policyType] || [], [lookups, policyType]);
  const activeLookupMeta = lookupMeta[policyType];
  const selectedPolicyOption = useMemo(
    () => policyOptions.find((option) => String(option.id) === policyId) || null,
    [policyId, policyOptions],
  );

  const handleLoadMore = async () => {
    if (!token || !isAuthenticated || lookupLoading || !activeLookupMeta.hasMore) {
      return;
    }

    setError(null);
    setLookupLoading(true);
    try {
      const nextPage = activeLookupMeta.page + 1;
      const result = await loadLookupPage(
        token,
        policyType,
        nextPage,
        activeLookupMeta.search,
      );
      setLookups((current) => ({
        ...current,
        [policyType]: [
          ...current[policyType],
          ...result.items.filter(
            (item) => !current[policyType].some((existing) => existing.id === item.id),
          ),
        ],
      }));
      setLookupMeta((current) => ({
        ...current,
        [policyType]: {
          page: nextPage,
          hasMore: result.hasMore,
          loaded: true,
          search: activeLookupMeta.search,
        },
      }));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat data policy tambahan",
      );
    } finally {
      setLookupLoading(false);
    }
  };

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
        identityAttachment,
      });
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Gagal menyimpan credit change request",
      );
    }
  };

  const handlePolicySearchChange = (value: string) => {
    setPolicySearch(value);
    setPolicyId("");
    setPolicyDropdownOpen(true);
  };

  const handlePolicySelect = (option: EntityOption) => {
    setPolicyId(String(option.id));
    setPolicySearch(option.label);
    setPolicyDropdownOpen(false);
    setError(null);
  };

  const handlePolicyOptionsScroll = async (
    event: React.UIEvent<HTMLDivElement>,
  ) => {
    const element = event.currentTarget;
    const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;

    if (remaining < 24) {
      await handleLoadMore();
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
                <div className="relative" ref={policyDropdownRef}>
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={policySearch}
                    onChange={(e) => handlePolicySearchChange(e.target.value)}
                    onFocus={() => setPolicyDropdownOpen(true)}
                    disabled={saving}
                    placeholder="Cari policy..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300 focus:bg-white"
                  />

                  {policyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
                    >
                      <motion.div
                        layout
                        className="max-h-64 overflow-y-auto py-2"
                        onScroll={handlePolicyOptionsScroll}
                      >
                        <AnimatePresence mode="popLayout" initial={false}>
                          {policyOptions.length > 0 ? (
                            policyOptions.map((option) => {
                              const isSelected = String(option.id) === policyId;

                              return (
                                <motion.button
                                  layout
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  key={option.id}
                                  type="button"
                                  onClick={() => handlePolicySelect(option)}
                                  className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition ${
                                    isSelected
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="line-clamp-2">{option.label}</span>
                                  <span className="shrink-0 text-xs text-gray-400">
                                    #{option.id}
                                  </span>
                                </motion.button>
                              );
                            })
                          ) : lookupLoading ? (
                            <motion.div
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="px-4 py-4 text-sm text-gray-500"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                <span>Memuat policy...</span>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="px-4 py-4 text-sm text-gray-500"
                            >
                              Tidak ada policy yang cocok
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {lookupLoading && policyOptions.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-t border-gray-100 px-4 py-3 text-xs text-gray-500"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                              <span>Memuat data tambahan...</span>
                            </div>
                          </motion.div>
                        ) : null}
                      </motion.div>
                    </motion.div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Nilai yang dikirim ke database adalah `id` dari policy yang dipilih.
                </p>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
                  <p>{policyOptions.length} policy dimuat</p>
                  <p>
                    {lookupLoading
                      ? "Memuat..."
                      : activeLookupMeta.hasMore
                        ? "Scroll dropdown untuk memuat data berikutnya"
                        : activeLookupMeta.loaded
                          ? "Semua data sudah dimuat"
                          : ""}
                  </p>
                </div>
                {selectedPolicyOption ? (
                  <p className="mt-2 text-xs font-medium text-emerald-700">
                    Policy terpilih: {selectedPolicyOption.label}
                  </p>
                ) : null}
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

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Identity Attachment
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600 transition hover:border-emerald-300 hover:bg-white">
                  <FaImage className="h-4 w-4 text-emerald-600" />
                  <span className="flex-1">
                    {identityAttachment
                      ? identityAttachment.name
                      : "Pilih gambar attachment untuk pengajuan credit"}
                  </span>
                  <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={saving}
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setIdentityAttachment(file);
                    }}
                  />
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Attachment ini akan dikirim sebagai `identity_attachment`.
                </p>
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
