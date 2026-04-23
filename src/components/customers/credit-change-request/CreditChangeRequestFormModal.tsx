"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCopy,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaInfoCircle,
  FaImage,
  FaPaperPlane,
  FaSearch,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import {
  buildBranchCustomerLabel,
  buildDirectorWhatsappText,
  type BranchCustomerRow,
  type BranchRow,
  type EntityOption,
  formatRequestDate,
  type GroupCustomerRow,
  type GroupParentRow,
  type NationalBrandRow,
  type PolicyType,
} from "./utils";

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

interface PolicyCurrentProfile {
  creditLimit: number | null;
  paymentTerm: number | null;
  limitCustomerOverdue: number | null;
  createdBy: string;
}

interface CreditChangeRequestFormModalProps {
  open: boolean;
  onClose: () => void;
  saving?: boolean;
  onSave: (payload: {
    policyType: PolicyType;
    policyId: number;
    applyToChilds: boolean;
    requestedCreditLimit?: number;
    requestedPaymentTerm?: number;
    requestedLimitCustomerOverdue?: number;
    reason: string;
    identityAttachment?: File | null;
    customerApprovalAttachment?: File | null;
  }) => Promise<void>;
}

const POLICY_TYPE_OPTIONS: Array<{ value: PolicyType; label: string }> = [
  { value: "nbid", label: "National Brand" },
  { value: "gpid", label: "Group Parent" },
  // { value: "gcid", label: "Group Customer" },
  // { value: "bcid", label: "Branch Customer" },
];

const LOOKUP_PAGE_SIZE = 20;
const EMPTY_LOOKUP_META: PolicyLookupMetaMap = {
  nbid: { page: 0, hasMore: true, loaded: false, search: "" },
  gpid: { page: 0, hasMore: true, loaded: false, search: "" },
  gcid: { page: 0, hasMore: true, loaded: false, search: "" },
  bcid: { page: 0, hasMore: true, loaded: false, search: "" },
};

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
      const rows = (
        Array.isArray(json?.data) ? json.data : []
      ) as NationalBrandRow[];
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
      const rows = (
        Array.isArray(json?.data) ? json.data : []
      ) as GroupParentRow[];
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
      const rows = (
        Array.isArray(json?.data) ? json.data : []
      ) as GroupCustomerRow[];
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

      const branchCustomers = (
        Array.isArray(bcJson?.data) ? bcJson.data : []
      ) as BranchCustomerRow[];
      const groupCustomers = (
        Array.isArray(gcJson?.data) ? gcJson.data : []
      ) as GroupCustomerRow[];
      const branches = (
        Array.isArray(branchJson?.data) ? branchJson.data : []
      ) as BranchRow[];

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

  return decimalPart
    ? `${formattedIntegerPart},${decimalPart}`
    : formattedIntegerPart;
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

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatDays(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${new Intl.NumberFormat("id-ID").format(value)} hari`;
}

function resolveUserName(value: unknown): string {
  if (!value) return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number") return `User #${value}`;
  if (typeof value === "object") {
    const candidate = value as {
      full_name?: string | null;
      name?: string | null;
      email?: string | null;
      id?: number | string | null;
    };
    return (
      candidate.full_name ||
      candidate.name ||
      candidate.email ||
      (candidate.id ? `User #${candidate.id}` : "-")
    );
  }
  return "-";
}

async function copyToClipboard(value: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard tidak tersedia");
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const success = document.execCommand("copy");
    if (!success) {
      throw new Error("Gagal menyalin teks WA");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

function endpointForPolicyType(policyType: PolicyType): string {
  switch (policyType) {
    case "nbid":
      return API_CONFIG.ENDPOINTS.NATIONAL_BRAND;
    case "gpid":
      return API_CONFIG.ENDPOINTS.GROUP_PARENT;
    case "gcid":
      return API_CONFIG.ENDPOINTS.GROUP_CUSTOMER;
    case "bcid":
      return API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2;
    default:
      return API_CONFIG.ENDPOINTS.NATIONAL_BRAND;
  }
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
  const [applyToChilds, setApplyToChilds] = useState(true);
  const [reason, setReason] = useState("");
  const [identityAttachment, setIdentityAttachment] = useState<File | null>(
    null,
  );
  const [customerApprovalAttachment, setCustomerApprovalAttachment] =
    useState<File | null>(null);
  const [lookups, setLookups] = useState<PolicyLookups>({
    nbid: [],
    gpid: [],
    gcid: [],
    bcid: [],
  });
  const [lookupMeta, setLookupMeta] =
    useState<PolicyLookupMetaMap>(EMPTY_LOOKUP_META);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [currentProfile, setCurrentProfile] =
    useState<PolicyCurrentProfile | null>(null);
  const [currentProfileLoading, setCurrentProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waPreviewOpen, setWaPreviewOpen] = useState(false);

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
    setApplyToChilds(true);
    setReason("");
    setIdentityAttachment(null);
    setCustomerApprovalAttachment(null);
    setError(null);
    setCurrentProfile(null);
    setCurrentProfileLoading(false);
    setWaPreviewOpen(false);
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
                      (item) =>
                        !current[policyType].some(
                          (existing) => existing.id === item.id,
                        ),
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
  }, [
    debouncedPolicySearch,
    isAuthenticated,
    lookupMeta,
    open,
    policyType,
    token,
  ]);

  useEffect(() => {
    if (!open) return;
    setPolicyId("");
    setPolicySearch("");
    setDebouncedPolicySearch("");
    setPolicyDropdownOpen(false);
    setCurrentProfile(null);
    setCurrentProfileLoading(false);
  }, [open, policyType]);

  useEffect(() => {
    let cancelled = false;

    async function fetchCurrentProfile() {
      const parsedPolicyId = Number(policyId || 0);
      if (!open || !token || !isAuthenticated || !parsedPolicyId) {
        setCurrentProfile(null);
        setCurrentProfileLoading(false);
        return;
      }

      setCurrentProfileLoading(true);
      try {
        const response = await apiFetch(
          getResourceUrl(endpointForPolicyType(policyType), parsedPolicyId),
          { method: "GET", cache: "no-store" },
          token,
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat profil policy (${response.status})`);
        }

        const json = await response.json();
        const data = json?.data as
          | {
              credit_limit?: number | null;
              payment_term?: number | null;
              limit_customer_overdue?: number | null;
              created_by?: unknown;
            }
          | undefined;

        if (!cancelled) {
          setCurrentProfile({
            creditLimit:
              typeof data?.credit_limit === "number" ? data.credit_limit : null,
            paymentTerm:
              typeof data?.payment_term === "number" ? data.payment_term : null,
            limitCustomerOverdue:
              typeof data?.limit_customer_overdue === "number"
                ? data.limit_customer_overdue
                : null,
            createdBy: resolveUserName(data?.created_by),
          });
        }
      } catch (fetchError) {
        if (!cancelled) {
          setCurrentProfile(null);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Gagal memuat profil policy saat ini",
          );
        }
      } finally {
        if (!cancelled) {
          setCurrentProfileLoading(false);
        }
      }
    }

    void fetchCurrentProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, open, policyId, policyType, token]);

  const policyOptions = useMemo(
    () => lookups[policyType] || [],
    [lookups, policyType],
  );
  const activeLookupMeta = lookupMeta[policyType];
  const selectedPolicyOption = useMemo(
    () =>
      policyOptions.find((option) => String(option.id) === policyId) || null,
    [policyId, policyOptions],
  );
  const selectedPolicyLabel =
    selectedPolicyOption?.label || policySearch.trim() || "-";
  const effectiveRequestedCreditLimit = useMemo(() => {
    const parsedValue = parseCurrencyInput(requestedCreditLimit);
    if (parsedValue !== undefined && Number.isFinite(parsedValue)) {
      return parsedValue;
    }
    return currentProfile?.creditLimit ?? null;
  }, [currentProfile?.creditLimit, requestedCreditLimit]);
  const effectiveRequestedPaymentTerm = useMemo(() => {
    const parsedValue = parseIntegerInput(requestedPaymentTerm);
    if (parsedValue !== undefined && Number.isInteger(parsedValue)) {
      return parsedValue;
    }
    return currentProfile?.paymentTerm ?? null;
  }, [currentProfile?.paymentTerm, requestedPaymentTerm]);
  const waText = useMemo(
    () =>
      buildDirectorWhatsappText({
        policyName: selectedPolicyLabel,
        requestDate: formatRequestDate(),
        creditLimitText:
          effectiveRequestedCreditLimit === null
            ? "-"
            : `Rp ${formatCurrency(effectiveRequestedCreditLimit)}`,
        paymentTermText:
          effectiveRequestedPaymentTerm === null
            ? "-"
            : formatDays(effectiveRequestedPaymentTerm),
      }),
    [
      effectiveRequestedCreditLimit,
      effectiveRequestedPaymentTerm,
      selectedPolicyLabel,
    ],
  );

  const handleLoadMore = async () => {
    if (
      !token ||
      !isAuthenticated ||
      lookupLoading ||
      !activeLookupMeta.hasMore
    ) {
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
            (item) =>
              !current[policyType].some((existing) => existing.id === item.id),
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
    const resolvedRequestedCreditLimit =
      parsedCreditLimit !== undefined
        ? parsedCreditLimit
        : (currentProfile?.creditLimit ?? undefined);
    const resolvedRequestedPaymentTerm =
      parsedPaymentTerm !== undefined
        ? parsedPaymentTerm
        : (currentProfile?.paymentTerm ?? undefined);
    const resolvedRequestedLimitCustomerOverdue =
      parsedLimitCustomerOverdue !== undefined
        ? parsedLimitCustomerOverdue
        : (currentProfile?.limitCustomerOverdue ?? undefined);

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
        setError(
          "Requested credit limit harus berupa angka valid 0 atau lebih.",
        );
        return;
      }
    }

    if (parsedPaymentTerm !== undefined) {
      if (!Number.isInteger(parsedPaymentTerm) || parsedPaymentTerm < 0) {
        setError(
          "Requested payment term harus berupa angka bulat 0 atau lebih.",
        );
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
        applyToChilds,
        requestedCreditLimit: resolvedRequestedCreditLimit,
        requestedPaymentTerm: resolvedRequestedPaymentTerm,
        requestedLimitCustomerOverdue: resolvedRequestedLimitCustomerOverdue,
        reason: trimmedReason,
        identityAttachment,
        customerApprovalAttachment,
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
    const remaining =
      element.scrollHeight - element.scrollTop - element.clientHeight;

    if (remaining < 24) {
      await handleLoadMore();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        key="credit-change-request-form-modal"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
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
                  Ajukan perubahan credit limit, payment term, atau overdue
                  limit
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

          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {error ? (
                  <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FaExclamationTriangle className="mt-0.5" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <div className=" gap-4 grid md:grid-cols-10">
                  <div className="md:col-span-5">
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Policy Type
                    </label>
                    <select
                      value={policyType}
                      onChange={(e) =>
                        setPolicyType(e.target.value as PolicyType)
                      }
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

                  <div className="md:col-span-3">
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Policy ID
                    </label>
                    <div className="relative" ref={policyDropdownRef}>
                      <FaSearch className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={policySearch}
                        onChange={(e) =>
                          handlePolicySearchChange(e.target.value)
                        }
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
                                  const isSelected =
                                    String(option.id) === policyId;

                                  return (
                                    <motion.button
                                      layout
                                      initial={{ opacity: 0, y: 6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{
                                        duration: 0.15,
                                        ease: "easeOut",
                                      }}
                                      key={option.id}
                                      type="button"
                                      onClick={() => handlePolicySelect(option)}
                                      className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm transition ${
                                        isSelected
                                          ? "bg-emerald-50 text-emerald-700"
                                          : "text-gray-700 hover:bg-gray-50"
                                      }`}
                                    >
                                      <span className="line-clamp-2">
                                        {option.label}
                                      </span>
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
                    {/* <p className="mt-1 text-xs text-gray-500">
                      Nilai yang dikirim ke database adalah `id` dari policy
                      yang dipilih.
                    </p> */}
                    {/* <div className="mt-3 flex items-center justify-between gap-3 text-xs text-gray-500">
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
                    </div> */}
                    {/* {selectedPolicyOption ? (
                      <p className="mt-2 text-xs font-medium text-emerald-700">
                        Policy terpilih: {selectedPolicyOption.label}
                      </p>
                    ) : null} */}
                  </div>

                  <div className="md:col-span-2 self-end">
                    <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={applyToChilds}
                        onChange={() => undefined}
                        disabled
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                      />
                      {/* <span>Terapkan perubahan ini ke child policy terkait</span> */}
                      <span>Apply to Childs</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2 grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-5">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-800">
                            Current Credit Profile
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            Data saat ini dari policy yang dipilih.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                          <FaInfoCircle className="h-3 w-3" />
                          {currentProfileLoading ? "Memuat..." : "Aktif"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Current Credit Limit
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-800">
                            {currentProfileLoading
                              ? "Memuat..."
                              : currentProfile
                                ? `Rp ${formatCurrency(currentProfile.creditLimit)}`
                                : "-"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Current Payment Term
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-800">
                            {currentProfileLoading
                              ? "Memuat..."
                              : currentProfile
                                ? formatDays(currentProfile.paymentTerm)
                                : "-"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Current Limit Customer Overdue
                          </p>
                          <p className="mt-2 text-lg font-semibold text-slate-800">
                            {currentProfileLoading
                              ? "Memuat..."
                              : currentProfile
                                ? formatDays(
                                    currentProfile.limitCustomerOverdue,
                                  )
                                : "-"}
                          </p>
                        </div>

                        {/* <div className="rounded-xl border border-gray-200 bg-white p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Created By
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-700">
                            {currentProfileLoading
                              ? "Memuat..."
                              : currentProfile?.createdBy || "-"}
                          </p>
                        </div> */}

                        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                            Policy ID
                          </p>
                          <p className="mt-2 text-sm font-medium text-slate-700">
                            {selectedPolicyLabel}
                          </p>
                        </div>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
                      <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-800">
                          Requested Changes
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Isi hanya nilai yang ingin diubah.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Requested Credit Limit
                          </label>
                          <input
                            type="text"
                            value={requestedCreditLimit}
                            onChange={(e) =>
                              setRequestedCreditLimit(
                                normalizeCurrencyInput(e.target.value),
                              )
                            }
                            disabled={saving}
                            placeholder="Contoh: 1.000.000"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                              Requested Payment Term
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={requestedPaymentTerm}
                              onChange={(e) =>
                                setRequestedPaymentTerm(e.target.value)
                              }
                              disabled={saving}
                              placeholder="Hari"
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                              Requested Limit Customer Overdue
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={requestedLimitCustomerOverdue}
                              onChange={(e) =>
                                setRequestedLimitCustomerOverdue(e.target.value)
                              }
                              disabled={saving}
                              placeholder="Hari"
                              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-semibold text-gray-700">
                            Reason
                          </label>
                          <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={saving}
                            rows={6}
                            placeholder="Jelaskan alasan pengajuan perubahan credit"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-300"
                          />
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Apply to Childs
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={applyToChilds}
                        onChange={() => undefined}
                        disabled
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600"
                      />
                      {/* <span>Terapkan perubahan ini ke child policy terkait</span> */}
                      <span>Apply to Childs</span>
                    </label>
                    {/* <p className="mt-1 text-xs text-gray-500">
                      Nilai ini selalu aktif dan akan dikirim sebagai `1`.
                    </p> */}
                  </div>

                  <div>
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

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Customer Approval Attachment
                    </label>
                    <div className="mb-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setWaPreviewOpen(true);
                        }}
                        disabled={!policyId}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <FaPaperPlane className="h-4 w-4" />
                        Generate Teks WA
                      </button>
                    </div>
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 text-sm text-gray-600 transition hover:border-emerald-300 hover:bg-white">
                      <FaImage className="h-4 w-4 text-emerald-600" />
                      <span className="flex-1">
                        {customerApprovalAttachment
                          ? customerApprovalAttachment.name
                          : "Pilih gambar approval customer"}
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
                          setCustomerApprovalAttachment(file);
                        }}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Attachment ini akan dikirim sebagai
                      `customer_approval_attachment`.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
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
      <AnimatePresence key="credit-change-request-wa-preview">
        {waPreviewOpen && (
          <div
            key="credit-change-request-wa-preview-modal"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Preview Teks WhatsApp
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Teks ini siap disalin untuk dikirim ke customer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWaPreviewOpen(false)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4 px-6 py-5">
                <textarea
                  readOnly
                  value={waText}
                  rows={14}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setWaPreviewOpen(false)}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await copyToClipboard(waText);
                        setError(null);
                        setWaPreviewOpen(false);
                      } catch (copyError) {
                        setError(
                          copyError instanceof Error
                            ? copyError.message
                            : "Gagal menyalin teks WhatsApp",
                        );
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg"
                  >
                    <FaCopy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}
