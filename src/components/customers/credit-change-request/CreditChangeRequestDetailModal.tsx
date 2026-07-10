"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaCopy,
  FaClock,
  FaExchangeAlt,
  FaFileAlt,
  FaImage,
  FaPaperPlane,
  FaMoneyBillWave,
  FaStickyNote,
  FaTimes,
  FaUpload,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getApiUrl,
  getAuthHeadersFormData,
  getFileUrl,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import ActionResultModal from "@/components/ui/ActionResultModal";
import WorkflowActionBar from "@/components/workflow-actions/WorkflowActionBar";
import WorkflowRejectNoteModal from "@/components/workflow-actions/WorkflowRejectNoteModal";
import {
  executeWorkflowAction,
  type WorkflowActionItem,
} from "@/services/workflowActionService";
import {
  buildDirectorWhatsappText,
  formatRequestDate,
  resolvePolicyDisplayName,
} from "./utils";

export interface ICreditChangeRequestRow {
  id: number;
  code: string;
  policyType: string;
  policyTypeLabel: string;
  policyId?: number;
  applyToChilds?: boolean;
  identityAttachment?: string | null;
  customerApprovalAttachment?: string | null;
  currentCreditLimit?: number | null;
  requestedCreditLimit?: number | null;
  currentPaymentTerm?: number | null;
  requestedPaymentTerm?: number | null;
  currentLimitCustomerOverdue?: number | null;
  requestedLimitCustomerOverdue?: number | null;
  reason?: string | null;
  rejectedNote?: string | null;
  sagaStatus?: string | null;
  syncSagaId?: string | null;
  syncLastError?: string | null;
  syncLastRollbackError?: string | null;
  status: string;
  docstatus: number;
  created_at?: string | null;
  updated_at?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  workflowState?: string | null;
}

export type CreditChangeRequestListItem = ICreditChangeRequestRow;

interface CreditChangeRequestDetailResponse {
  id: number;
  name?: string | null;
  policy_type?: string | null;
  policy_id?: number | null;
  apply_to_childs?: number | boolean | null;
  current_credit_limit?: number | null;
  current_payment_term?: number | null;
  current_limit_customer_overdue?: number | null;
  requested_credit_limit?: number | null;
  requested_payment_term?: number | null;
  requested_limit_customer_overdue?: number | null;
  identity_attachment?: string | null;
  customer_approval_attachment?: string | null;
  reason?: string | null;
  rejected_note?: string | null;
  saga_status?: string | null;
  sync_saga_id?: string | null;
  sync_last_error?: string | null;
  sync_last_rollback_error?: string | null;
  status?: string | null;
  docstatus?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  workflow_state?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface DetailApiEnvelope {
  action?: WorkflowActionItem[] | null;
  data?: CreditChangeRequestDetailResponse | null;
}

interface PolicyHierarchyBranchCustomer {
  id: number;
  name?: string | null;
  _relations?: {
    branch?: {
      city?: string | null;
      id?: number | null;
    } | null;
    gcid?: {
      gc_name?: string | null;
      id?: number | null;
      name?: string | null;
    } | null;
  } | null;
}

interface PolicyHierarchyResponse {
  data?: {
    data?: {
      bcs?: PolicyHierarchyBranchCustomer[] | null;
    } | null;
  } | null;
  message?: string | null;
}

interface CreditChangeRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CreditChangeRequestListItem | null;
  onActionExecuted?: () => Promise<void> | void;
  demoMode?: boolean;
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string {
  if (explicitName) return explicitName;
  if (value && typeof value === "object" && value.full_name)
    return value.full_name;
  if (typeof value === "number") return `User ${value}`;
  return "System";
}

function formatCurrency(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDateTime(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function displayText(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
}

function formatDays(value?: number | null): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `${value} hari`;
}

function getStatusBadgeTone(status?: string | null): string {
  const normalized = (status || "").toLowerCase();

  if (normalized.includes("approve")) {
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
  if (normalized.includes("reject")) {
    return "bg-rose-100 text-rose-700 border-rose-200";
  }
  if (normalized.includes("draft")) {
    return "bg-amber-100 text-amber-700 border-amber-200";
  }
  if (normalized.includes("marketing") || normalized.includes("request")) {
    return "bg-sky-100 text-sky-700 border-sky-200";
  }

  return "bg-white/15 text-white border-white/20";
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

function getPreviewType(params: {
  url?: string | null;
  contentType?: string | null;
}): "image" | "pdf" | "file" | "none" {
  const { url, contentType } = params;
  if (contentType) {
    const normalizedType = contentType.toLowerCase();
    if (normalizedType.startsWith("image/")) return "image";
    if (normalizedType.includes("pdf")) return "pdf";
    return "file";
  }

  if (!url) return "none";
  const normalized = url.toLowerCase();
  if (
    normalized.endsWith(".png") ||
    normalized.endsWith(".jpg") ||
    normalized.endsWith(".jpeg") ||
    normalized.endsWith(".webp") ||
    normalized.endsWith(".gif")
  ) {
    return "image";
  }
  if (normalized.endsWith(".pdf")) {
    return "pdf";
  }
  return "file";
}

function AttachmentPreview({
  label,
  url,
  token,
}: {
  label: string;
  url?: string | null;
  token?: string | null;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [imageZoomOrigin, setImageZoomOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function loadPreview() {
      if (!url || !token) {
        setBlobUrl(null);
        setContentType(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiFetch(
          url,
          { method: "GET", cache: "no-store" },
          token,
        );

        if (!response.ok) {
          throw new Error(`Gagal memuat lampiran (${response.status})`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (!cancelled) {
          setBlobUrl(objectUrl);
          setContentType(blob.type || response.headers.get("Content-Type"));
        }
      } catch (loadError) {
        if (!cancelled) {
          setBlobUrl(null);
          setContentType(null);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat preview lampiran",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [token, url]);

  const previewType = useMemo(
    () => getPreviewType({ url, contentType }),
    [contentType, url],
  );
  const previewUrl = blobUrl || url || "";

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {!url ? (
        <p className="mt-1 text-sm text-slate-700">-</p>
      ) : (
        <div className="mt-2 space-y-3">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Memuat preview lampiran...
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          {!loading && !error && previewType === "image" && (
            <>
              <button
                type="button"
                onClick={() => {
                  setImagePreviewOpen(true);
                  setImageZoomed(false);
                  setImageZoomOrigin({ x: 50, y: 50 });
                }}
                className="block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left transition hover:border-sky-300"
              >
                <div className="relative h-72 w-full bg-white">
                  <Image
                    src={previewUrl}
                    alt={label}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </button>
              <p className="text-xs text-slate-500">
                Klik gambar untuk melihat preview lebih besar.
              </p>
            </>
          )}
          {!loading && !error && previewType === "pdf" && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <iframe src={previewUrl} title={label} className="h-72 w-full" />
            </div>
          )}
          {!loading && !error && previewType === "file" && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Preview tidak tersedia untuk tipe file ini.
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {imagePreviewOpen && previewType === "image" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-100/90 p-4 backdrop-blur-sm"
            onClick={(event) =>
              event.target === event.currentTarget
                ? setImagePreviewOpen(false)
                : undefined
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => {
                  setImagePreviewOpen(false);
                  setImageZoomed(false);
                  setImageZoomOrigin({ x: 50, y: 50 });
                }}
                className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white"
              >
                <FaTimes className="h-5 w-5" />
              </button>
              <div
                className={`relative h-[80vh] w-full overflow-hidden bg-slate-100 ${
                  imageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onDoubleClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;

                  setImageZoomOrigin({ x, y });
                  setImageZoomed((prev) => !prev);
                }}
                onMouseMove={(event) => {
                  if (!imageZoomed) return;

                  const rect = event.currentTarget.getBoundingClientRect();
                  const x = ((event.clientX - rect.left) / rect.width) * 100;
                  const y = ((event.clientY - rect.top) / rect.height) * 100;

                  setImageZoomOrigin({
                    x: Math.min(100, Math.max(0, x)),
                    y: Math.min(100, Math.max(0, y)),
                  });
                }}
              >
                <Image
                  src={previewUrl}
                  alt={label}
                  fill
                  unoptimized
                  className={`object-contain transition-transform duration-200 ${
                    imageZoomed ? "scale-[1.8]" : "scale-100"
                  }`}
                  style={{
                    transformOrigin: `${imageZoomOrigin.x}% ${imageZoomOrigin.y}%`,
                  }}
                />
                <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                  {imageZoomed
                    ? "Arahkan mouse ke area yang ingin dilihat, double click untuk reset zoom."
                    : "Double click untuk zoom."}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CreditChangeRequestDetailModal({
  isOpen,
  onClose,
  item,
  onActionExecuted,
  demoMode = false,
}: CreditChangeRequestDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] =
    useState<CreditChangeRequestDetailResponse | null>(null);
  const [actions, setActions] = useState<WorkflowActionItem[]>([]);
  const [executingActionId, setExecutingActionId] = useState<number | null>(
    null,
  );
  const [pendingRejectAction, setPendingRejectAction] =
    useState<WorkflowActionItem | null>(null);
  const [policyName, setPolicyName] = useState("-");
  const [policyNameLoading, setPolicyNameLoading] = useState(false);
  const [policyNameError, setPolicyNameError] = useState<string | null>(null);
  const [affectedBranches, setAffectedBranches] = useState<
    PolicyHierarchyBranchCustomer[]
  >([]);
  const [affectedBranchesLoading, setAffectedBranchesLoading] = useState(false);
  const [affectedBranchesError, setAffectedBranchesError] = useState<
    string | null
  >(null);
  const [customerApprovalFile, setCustomerApprovalFile] = useState<File | null>(
    null,
  );
  const [uploadingApprovalAttachment, setUploadingApprovalAttachment] =
    useState(false);
  const [waPreviewOpen, setWaPreviewOpen] = useState(false);
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    description?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const loadDetail = useCallback(async () => {
    if (!isOpen || !item || !token || !isAuthenticated) return;

    if (demoMode) {
      setLoading(false);
      setError(null);
      setDetail({
        id: item.id,
        name: item.code,
        policy_type: item.policyType,
        policy_id: item.policyId,
        apply_to_childs: item.applyToChilds ? 1 : 0,
        current_credit_limit: item.currentCreditLimit,
        current_payment_term: item.currentPaymentTerm,
        current_limit_customer_overdue: item.currentLimitCustomerOverdue,
        requested_credit_limit: item.requestedCreditLimit,
        requested_payment_term: item.requestedPaymentTerm,
        requested_limit_customer_overdue: item.requestedLimitCustomerOverdue,
        identity_attachment: item.identityAttachment,
        customer_approval_attachment: item.customerApprovalAttachment,
        reason: item.reason,
        rejected_note: item.rejectedNote,
        saga_status: item.sagaStatus,
        sync_saga_id: item.syncSagaId,
        sync_last_error: item.syncLastError,
        sync_last_rollback_error: item.syncLastRollbackError,
        status: item.status,
        docstatus: item.docstatus,
        created_at: item.created_at,
        updated_at: item.updated_at,
        workflow_state: item.workflowState,
        "created_by.full_name": item.createdBy,
        "updated_by.full_name": item.updatedBy,
      });
      setActions([
        { id: 9901, action: "Approve Director", mode: "approve" },
        { id: 9902, action: "Reject Director", mode: "reject" },
      ]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(
        getQueryUrl(
          `${API_CONFIG.ENDPOINTS.CREDIT_CHANGE_REQUEST}/${item.id}`,
          { fields: ["*", "created_by.full_name", "updated_by.full_name"] },
        ),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch credit change request detail (${response.status})`,
        );
      }

      const json = (await response.json()) as DetailApiEnvelope;
      setDetail(json.data || null);
      setActions(Array.isArray(json.action) ? json.action : []);
    } catch (loadError) {
      setDetail(null);
      setActions([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Gagal memuat detail credit change request",
      );
    } finally {
      setLoading(false);
    }
  }, [demoMode, isAuthenticated, isOpen, item, token]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (!isOpen) return;
    setCustomerApprovalFile(null);
    setWaPreviewOpen(false);
  }, [isOpen, item?.id]);

  const activeDetail = detail || null;
  const normalizedActions = useMemo(() => actions, [actions]);
  const attachmentUrl = getFileUrl(activeDetail?.identity_attachment);
  const customerApprovalAttachmentUrl = getFileUrl(
    activeDetail?.customer_approval_attachment ??
      item?.customerApprovalAttachment,
  );

  const createdBy = useMemo(
    () =>
      resolveUserName(
        activeDetail?.["created_by.full_name"],
        activeDetail?.created_by,
      ),
    [activeDetail],
  );
  const updatedBy = useMemo(
    () =>
      resolveUserName(
        activeDetail?.["updated_by.full_name"],
        activeDetail?.updated_by,
      ),
    [activeDetail],
  );
  const currentStatus = activeDetail?.status || item?.status || "";
  const isInDirector = currentStatus === "In Director";
  const effectivePolicyType = activeDetail?.policy_type ?? item?.policyType;
  const effectivePolicyId = activeDetail?.policy_id ?? item?.policyId;
  const effectiveRequestedCreditLimit =
    activeDetail?.requested_credit_limit ??
    item?.requestedCreditLimit ??
    activeDetail?.current_credit_limit ??
    item?.currentCreditLimit ??
    null;
  const effectiveRequestedPaymentTerm =
    activeDetail?.requested_payment_term ??
    item?.requestedPaymentTerm ??
    activeDetail?.current_payment_term ??
    item?.currentPaymentTerm ??
    null;
  const waPreviewText = useMemo(
    () =>
      buildDirectorWhatsappText({
        policyName,
        requestDate: formatRequestDate(
          activeDetail?.created_at ?? item?.createdAt,
        ),
        creditLimitText: formatCurrency(effectiveRequestedCreditLimit),
        paymentTermText: formatDays(effectiveRequestedPaymentTerm),
      }),
    [
      activeDetail?.created_at,
      effectiveRequestedCreditLimit,
      effectiveRequestedPaymentTerm,
      item?.createdAt,
      policyName,
    ],
  );
  const hasStoredCustomerApprovalAttachment = Boolean(
    activeDetail?.customer_approval_attachment ??
    item?.customerApprovalAttachment,
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPolicyName() {
      if (!isOpen || !token) return;

      if (demoMode) {
        setPolicyName("BC DEMO SEJAHTERA - Surabaya");
        setPolicyNameLoading(false);
        setPolicyNameError(null);
        return;
      }

      setPolicyNameLoading(true);
      setPolicyNameError(null);

      try {
        const resolvedPolicyName = await resolvePolicyDisplayName({
          token,
          policyType: effectivePolicyType,
          policyId: effectivePolicyId,
        });

        if (!cancelled) {
          setPolicyName(resolvedPolicyName);
        }
      } catch (loadError) {
        if (!cancelled) {
          setPolicyName("-");
          setPolicyNameError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat nama policy",
          );
        }
      } finally {
        if (!cancelled) {
          setPolicyNameLoading(false);
        }
      }
    }

    void loadPolicyName();

    return () => {
      cancelled = true;
    };
  }, [demoMode, effectivePolicyId, effectivePolicyType, isOpen, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadAffectedBranches() {
      if (demoMode) {
        setAffectedBranches([
          {
            id: 88001,
            name: "BC-DEMO-SBY",
            _relations: {
              branch: { city: "Surabaya", id: 77 },
              gcid: { gc_name: "DEMO SEJAHTERA CUSTOMER", id: 77001 },
            },
          },
          {
            id: 88002,
            name: "BC-DEMO-SDA",
            _relations: {
              branch: { city: "Sidoarjo", id: 78 },
              gcid: { gc_name: "DEMO SEJAHTERA CUSTOMER", id: 77001 },
            },
          },
        ]);
        setAffectedBranchesError(null);
        setAffectedBranchesLoading(false);
        return;
      }

      if (!isOpen || !token || !effectivePolicyType || !effectivePolicyId) {
        setAffectedBranches([]);
        setAffectedBranchesError(null);
        setAffectedBranchesLoading(false);
        return;
      }

      setAffectedBranchesLoading(true);
      setAffectedBranchesError(null);

      try {
        const response = await apiFetch(
          getApiUrl(
            `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`,
          ),
          {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({
              level: effectivePolicyType,
              value: effectivePolicyId,
              format: "full",
              entities: ["bcs"],
              query: {
                bcs: {
                  fields: ["id", "name", "branch.city", "gcid"],
                },
                gcs: {
                  fields: ["id", "gc_name"],
                },
                gps: {
                  fields: ["id", "gp_name"],
                },
                nb: {
                  fields: ["id", "nb_name"],
                },
              },
            }),
          },
          token,
        );

        if (!response.ok) {
          throw new Error(
            `Gagal memuat daftar customer cabang (${response.status})`,
          );
        }

        const json = (await response.json()) as PolicyHierarchyResponse;
        const rows = json.data?.data?.bcs;

        if (!cancelled) {
          setAffectedBranches(Array.isArray(rows) ? rows : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setAffectedBranches([]);
          setAffectedBranchesError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat daftar customer cabang",
          );
        }
      } finally {
        if (!cancelled) {
          setAffectedBranchesLoading(false);
        }
      }
    }

    void loadAffectedBranches();

    return () => {
      cancelled = true;
    };
  }, [demoMode, effectivePolicyId, effectivePolicyType, isOpen, token]);

  const uploadCustomerApprovalAttachment = useCallback(async () => {
    if (!token || !item?.id || !customerApprovalFile) {
      return;
    }

    setUploadingApprovalAttachment(true);
    try {
      const formData = new FormData();
      formData.append("customer_approval_attachment", customerApprovalFile);

      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.CREDIT_CHANGE_REQUEST, item.id),
        {
          method: "PUT",
          headers: getAuthHeadersFormData(token),
          body: formData,
          cache: "no-store",
        },
        token,
      );

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(
          json?.message ||
            `Gagal mengunggah attachment approval customer (${response.status})`,
        );
      }

      setCustomerApprovalFile(null);
      await loadDetail();
      await onActionExecuted?.();
    } finally {
      setUploadingApprovalAttachment(false);
    }
  }, [customerApprovalFile, item?.id, loadDetail, onActionExecuted, token]);

  const executeAction = useCallback(
    async (
      workflowAction: WorkflowActionItem,
      payload?: Record<string, unknown>,
    ) => {
      if (!token || !item) {
        setResultModal({
          isOpen: true,
          type: "error",
          title: "Action Gagal",
          message: "Token atau dokumen tidak tersedia.",
        });
        return;
      }

      const normalizedLabel = workflowAction.action.toLowerCase();
      const isRejectAction = normalizedLabel.includes("reject");
      const requiresDirectorAttachment =
        !demoMode && isInDirector && !isRejectAction;
      const hasAnyCustomerApprovalAttachment =
        hasStoredCustomerApprovalAttachment || Boolean(customerApprovalFile);

      if (requiresDirectorAttachment && !hasAnyCustomerApprovalAttachment) {
        const message =
          "Screenshot persetujuan customer wajib diunggah dulu sebelum melanjutkan action dari In Director.";
        setError(message);
        setResultModal({
          isOpen: true,
          type: "error",
          title: "Attachment Wajib",
          message,
        });
        return;
      }

      setExecutingActionId(workflowAction.id);
      setError(null);

      try {
        if (demoMode) {
          await new Promise((resolve) => window.setTimeout(resolve, 300));
          await loadDetail();
          await onActionExecuted?.();
          setPendingRejectAction(null);
          setResultModal({
            isOpen: true,
            type: "success",
            title: "Action Berhasil",
            message: `${workflowAction.action} berhasil dijalankan`,
            description:
              "Mode tour aktif. Action ini hanya simulasi dan tidak mengubah data asli.",
          });
          return;
        }

        if (requiresDirectorAttachment && customerApprovalFile) {
          await uploadCustomerApprovalAttachment();
        }

        await executeWorkflowAction({
          token,
          resourceName: "credit_change_request",
          documentId: item.id,
          actionId: workflowAction.id,
          payload,
        });

        await loadDetail();
        await onActionExecuted?.();
        setPendingRejectAction(null);
        setResultModal({
          isOpen: true,
          type: "success",
          title: "Action Berhasil",
          message: `${workflowAction.action} berhasil dijalankan`,
          description:
            "Status dokumen dan daftar credit change request sudah diperbarui.",
        });
      } catch (actionError) {
        const message =
          actionError instanceof Error
            ? actionError.message
            : "Gagal menjalankan action workflow";

        setError(message);
        setResultModal({
          isOpen: true,
          type: "error",
          title: "Action Gagal",
          message,
        });
        throw actionError;
      } finally {
        setExecutingActionId(null);
      }
    },
    [
      customerApprovalFile,
      demoMode,
      hasStoredCustomerApprovalAttachment,
      isInDirector,
      item,
      loadDetail,
      onActionExecuted,
      token,
      uploadCustomerApprovalAttachment,
    ],
  );

  const handleActionClick = useCallback(
    async (workflowAction: WorkflowActionItem) => {
      const normalizedLabel = workflowAction.action.toLowerCase();

      if (normalizedLabel.includes("reject")) {
        setPendingRejectAction(workflowAction);
        return;
      }

      await executeAction(workflowAction);
    },
    [executeAction],
  );

  if (!isOpen || !item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="credit-change-request-detail"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(event) =>
            event.target === event.currentTarget ? onClose() : undefined
          }
        >
          <motion.div
            data-tour={demoMode ? "credit-change-detail-modal" : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Credit Change Request
                </p>
                <h2 className="mt-1 text-2xl font-bold">
                  {policyNameLoading ? item.code : policyName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-emerald-50">
                  <span>{item.policyTypeLabel}</span>
                  <span className="hidden text-emerald-200 sm:inline">•</span>
                  <span>
                    Policy ID:{" "}
                    {displayText(activeDetail?.policy_id ?? item.policyId)}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeTone(
                    currentStatus,
                  )}`}
                >
                  {displayText(currentStatus)}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
              {demoMode && (
                <div
                  data-tour="credit-change-demo-banner"
                  className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                >
                  Mode tour aktif. Semua data di dialog ini adalah dummy dan
                  action workflow tidak akan mengubah data asli.
                </div>
              )}

              {loading && (
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                  Memuat detail credit change request...
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <section
                  data-tour={
                    demoMode ? "credit-change-values-section" : undefined
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-5 grid grid-cols-2 gap-6"
                >
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <FaMoneyBillWave className="text-emerald-600" />
                      <h3 className="text-lg font-bold text-slate-900">
                        Current Values
                      </h3>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Current Credit Limit
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-700">
                        {formatCurrency(
                          activeDetail?.current_credit_limit ??
                            item.currentCreditLimit,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Current Payment Term
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.current_payment_term ??
                            item.currentPaymentTerm,
                        )}
                      </p>
                    </div>
                    {/* <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Limit Customer Overdue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.current_limit_customer_overdue ??
                            item.currentLimitCustomerOverdue,
                        )}
                      </p>
                    </div> */}
                  </div>

                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <FaExchangeAlt className="text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-900">
                        Requested Values
                      </h3>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested Credit Limit
                      </p>
                      <p className="mt-1 text-lg font-bold text-blue-700">
                        {formatCurrency(
                          activeDetail?.requested_credit_limit ??
                            item.requestedCreditLimit,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 mt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested Payment Term
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.requested_payment_term ??
                            item.requestedPaymentTerm,
                        )}
                      </p>
                    </div>
                    {/* <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested Limit Customer Overdue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.requested_limit_customer_overdue ??
                            item.requestedLimitCustomerOverdue,
                        )}
                      </p>
                    </div> */}
                  </div>
                </section>

                {/* <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaExchangeAlt className="text-blue-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Requested Values
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested Credit Limit
                      </p>
                      <p className="mt-1 text-lg font-bold text-blue-700">
                        {formatCurrency(
                          activeDetail?.requested_credit_limit ??
                            item.requestedCreditLimit,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested Payment Term
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.requested_payment_term ??
                            item.requestedPaymentTerm,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested Limit Customer Overdue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.requested_limit_customer_overdue ??
                            item.requestedLimitCustomerOverdue,
                        )}
                      </p>
                    </div>
                  </div>
                </section> */}

                <section
                  data-tour={
                    demoMode
                      ? "credit-change-affected-customers-section"
                      : undefined
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <FaUser className="text-indigo-600" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Daftar Customer Yang Akan Mengikuti Credit Limit Ini
                      </h3>
                      <p className="text-sm text-slate-500">
                        {affectedBranchesLoading
                          ? "Memuat data cabang..."
                          : `${affectedBranches.length} customer dalam cakupan policy ini`}
                      </p>
                    </div>
                  </div>

                  {affectedBranchesError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                      {affectedBranchesError}
                    </div>
                  )}

                  {!affectedBranchesError && affectedBranchesLoading && (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                      Memuat daftar customer yang akan mengikuti credit limit
                      ini...
                    </div>
                  )}

                  {!affectedBranchesError &&
                    !affectedBranchesLoading &&
                    (affectedBranches.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {affectedBranches.map((branch) => {
                          const gcName =
                            branch._relations?.gcid?.gc_name?.trim() || "-";
                          const city =
                            branch._relations?.branch?.city?.trim() || "-";

                          return (
                            <div
                              key={branch.id}
                              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <p className="text-sm font-bold text-slate-900">
                                {gcName} - {city}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-indigo-700">
                                {displayText(branch.name)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                        Tidak ada customer cabang dalam cakupan policy ini.
                      </div>
                    ))}
                </section>

                <section
                  data-tour={demoMode ? "credit-change-notes-section" : undefined}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="mb-4 flex items-center gap-2">
                    <FaStickyNote className="text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900">Notes</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Reason
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.reason ?? item.reason)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Rejected Note
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(
                          activeDetail?.rejected_note ?? item.rejectedNote,
                        )}
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <section
                    data-tour={
                      demoMode
                        ? "credit-change-identity-attachment-section"
                        : undefined
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <FaFileAlt className="text-sky-500" />
                      <h3 className="text-lg font-bold text-slate-900">
                        Identity Attachment
                      </h3>
                    </div>
                    <AttachmentPreview
                      label="Identity Attachment"
                      url={attachmentUrl}
                      token={token}
                    />
                  </section>

                  <section
                    data-tour={
                      demoMode
                        ? "credit-change-customer-approval-section"
                        : undefined
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <FaImage className="text-sky-500" />
                      <h3 className="text-lg font-bold text-slate-900">
                        Customer Approval Attachment
                      </h3>
                    </div>
                    {isInDirector && (
                      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-slate-700">
                            Upload Screenshot Persetujuan Customer
                          </label>
                          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 transition hover:border-emerald-300 hover:bg-white">
                            <FaUpload className="h-4 w-4 text-emerald-600" />
                            <span className="flex-1">
                              {customerApprovalFile
                                ? customerApprovalFile.name
                                : "Pilih file approval customer"}
                            </span>
                            <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Upload
                            </span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              disabled={
                                uploadingApprovalAttachment ||
                                executingActionId !== null
                              }
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0] || null;
                                setCustomerApprovalFile(file);
                                setError(null);
                              }}
                            />
                          </label>
                          <p className="mt-1 text-xs text-slate-500">
                            Saat workflow berada di `In Director`, lampiran ini
                            wajib ada sebelum action lanjut.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {customerApprovalFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomerApprovalFile(null);
                              }}
                              disabled={
                                uploadingApprovalAttachment ||
                                executingActionId !== null
                              }
                              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              Reset File
                            </button>
                          )}
                          <button
                            type="button"
                            data-tour={
                              demoMode
                                ? "credit-change-wa-preview-button"
                                : undefined
                            }
                            onClick={() => {
                              setWaPreviewOpen(true);
                            }}
                            disabled={policyNameLoading}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <FaPaperPlane className="h-4 w-4" />
                            {policyNameLoading
                              ? "Memuat..."
                              : "Preview Teks WA"}
                          </button>
                        </div>
                      </div>
                    )}
                    <AttachmentPreview
                      label="Customer Approval Attachment"
                      url={customerApprovalAttachmentUrl}
                      token={token}
                    />
                    {policyNameError ? (
                      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                        {policyNameError}
                      </div>
                    ) : null}
                  </section>
                </div>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaClock className="text-sky-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Sync Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Saga Status
                      </p>
                      <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.saga_status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sync Saga ID
                      </p>
                      <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.sync_saga_id)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sync Last Error
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.sync_last_error)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sync Last Rollback Error
                      </p>
                      <p className="mt-1 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm text-slate-800">
                        {displayText(activeDetail?.sync_last_rollback_error)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaUser className="text-violet-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Audit Trail
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <FaUser className="h-3 w-3" />
                        Created By
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {createdBy || item.createdBy}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span>
                          {formatDateTime(
                            activeDetail?.created_at ?? item.createdAt,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <FaUser className="h-3 w-3" />
                        Updated By
                      </div>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {updatedBy || item.updatedBy}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <FaCalendarAlt className="h-3 w-3" />
                        <span>
                          {formatDateTime(
                            activeDetail?.updated_at ?? item.updatedAt,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {normalizedActions.length > 0 && (
                  <section
                    data-tour={
                      demoMode ? "credit-change-actions-section" : undefined
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-600" />
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            Available Actions
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Pilih action workflow yang sesuai untuk dokumen ini.
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {normalizedActions.length} action tersedia
                      </span>
                    </div>
                    <WorkflowActionBar
                      actions={normalizedActions}
                      loadingActionId={executingActionId}
                      disabled={loading}
                      getActionTourAttribute={(workflowAction) =>
                        demoMode &&
                        workflowAction.action.toLowerCase().includes("approve")
                          ? "credit-change-approve-action-button"
                          : undefined
                      }
                      onActionClick={(workflowAction) => {
                        void handleActionClick(workflowAction);
                      }}
                    />
                  </section>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <WorkflowRejectNoteModal
        key="credit-change-request-reject-note"
        open={pendingRejectAction !== null}
        action={pendingRejectAction}
        loading={
          pendingRejectAction !== null &&
          executingActionId === pendingRejectAction.id
        }
        onClose={() => {
          if (executingActionId) return;
          setPendingRejectAction(null);
        }}
        onSubmit={async (note) => {
          if (!pendingRejectAction) return;
          await executeAction(pendingRejectAction, { rejected_note: note });
        }}
      />

      <ActionResultModal
        key="credit-change-request-action-result"
        isOpen={resultModal.isOpen}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        description={resultModal.description}
        onClose={() =>
          setResultModal((current) => ({
            ...current,
            isOpen: false,
          }))
        }
      />

      <AnimatePresence>
        {waPreviewOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
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
                    Ringkasan pengajuan untuk konfirmasi customer.
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
                  value={waPreviewText}
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
                        await copyToClipboard(waPreviewText);
                        setResultModal({
                          isOpen: true,
                          type: "success",
                          title: "Teks Berhasil Disalin",
                          message:
                            "Teks WhatsApp berhasil disalin ke clipboard.",
                        });
                      } catch (copyError) {
                        setResultModal({
                          isOpen: true,
                          type: "error",
                          title: "Copy Gagal",
                          message:
                            copyError instanceof Error
                              ? copyError.message
                              : "Gagal menyalin teks WhatsApp",
                        });
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
