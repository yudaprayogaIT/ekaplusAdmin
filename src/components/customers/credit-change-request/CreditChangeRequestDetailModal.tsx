"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExchangeAlt,
  FaInfoCircle,
  FaMoneyBillWave,
  FaStickyNote,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import ActionResultModal from "@/components/ui/ActionResultModal";
import WorkflowActionBar from "@/components/workflow-actions/WorkflowActionBar";
import WorkflowRejectNoteModal from "@/components/workflow-actions/WorkflowRejectNoteModal";
import {
  executeWorkflowAction,
  type WorkflowActionItem,
} from "@/services/workflowActionService";

export interface CreditChangeRequestListItem {
  id: number;
  code: string;
  policyType: string;
  policyTypeLabel: string;
  currentCreditLimit?: number | null;
  requestedCreditLimit?: number | null;
  currentPaymentTerm?: number | null;
  requestedPaymentTerm?: number | null;
  currentLimitCustomerOverdue?: number | null;
  requestedLimitCustomerOverdue?: number | null;
  reason?: string | null;
  rejectedNote?: string | null;
  status: string;
  docstatus: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface CreditChangeRequestDetailResponse {
  id: number;
  name?: string | null;
  policy_type?: string | null;
  current_credit_limit?: number | null;
  current_payment_term?: number | null;
  current_limit_customer_overdue?: number | null;
  requested_credit_limit?: number | null;
  requested_payment_term?: number | null;
  requested_limit_customer_overdue?: number | null;
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
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface DetailApiEnvelope {
  action?: WorkflowActionItem[] | null;
  data?: CreditChangeRequestDetailResponse | null;
}

interface CreditChangeRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CreditChangeRequestListItem | null;
  onActionExecuted?: () => Promise<void> | void;
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string {
  if (explicitName) return explicitName;
  if (value && typeof value === "object" && value.full_name) return value.full_name;
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

export function CreditChangeRequestDetailModal({
  isOpen,
  onClose,
  item,
  onActionExecuted,
}: CreditChangeRequestDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<CreditChangeRequestDetailResponse | null>(
    null,
  );
  const [actions, setActions] = useState<WorkflowActionItem[]>([]);
  const [executingActionId, setExecutingActionId] = useState<number | null>(null);
  const [pendingRejectAction, setPendingRejectAction] = useState<WorkflowActionItem | null>(
    null,
  );
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
  }, [isAuthenticated, isOpen, item, token]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const activeDetail = detail || null;
  const normalizedActions = useMemo(() => actions, [actions]);

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

  const executeAction = useCallback(
    async (workflowAction: WorkflowActionItem, payload?: Record<string, unknown>) => {
      if (!token || !item) {
        setResultModal({
          isOpen: true,
          type: "error",
          title: "Action Gagal",
          message: "Token atau dokumen tidak tersedia.",
        });
        return;
      }

      setExecutingActionId(workflowAction.id);
      setError(null);

      try {
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
          description: "Status dokumen dan daftar credit change request sudah diperbarui.",
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
    [item, loadDetail, onActionExecuted, token],
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
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Credit Change Request
                </p>
                <h2 className="mt-1 text-2xl font-bold">{item.code}</h2>
                <p className="mt-1 text-sm text-emerald-50">{item.policyTypeLabel}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-white/15 p-2 transition hover:bg-white/25"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
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
                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Informasi Umum
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Name
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(activeDetail?.name || item.code)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Policy Type
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(item.policyTypeLabel)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(activeDetail?.status || item.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Docstatus
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {displayText(activeDetail?.docstatus ?? item.docstatus)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaMoneyBillWave className="text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Current Values
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Credit Limit
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-700">
                        {formatCurrency(
                          activeDetail?.current_credit_limit ??
                            item.currentCreditLimit,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Payment Term
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.current_payment_term ?? item.currentPaymentTerm,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Limit Customer Overdue
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatDays(
                          activeDetail?.current_limit_customer_overdue ??
                            item.currentLimitCustomerOverdue,
                        )}
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
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
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <FaStickyNote className="text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Notes
                    </h3>
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
                        {displayText(activeDetail?.rejected_note ?? item.rejectedNote)}
                      </p>
                    </div>
                  </div>
                </section>

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
                    <h3 className="text-lg font-bold text-slate-900">Audit Trail</h3>
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
                          {formatDateTime(activeDetail?.created_at ?? item.createdAt)}
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
                          {formatDateTime(activeDetail?.updated_at ?? item.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {normalizedActions.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-600" />
                      <h3 className="text-lg font-bold text-slate-900">
                        Available Actions
                      </h3>
                    </div>
                    <p className="mb-4 text-sm text-slate-500">
                      Tombol di bawah ini berasal dari workflow aktif untuk dokumen ini.
                    </p>
                    <WorkflowActionBar
                      actions={normalizedActions}
                      loadingActionId={executingActionId}
                      disabled={loading}
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
    </AnimatePresence>
  );
}
