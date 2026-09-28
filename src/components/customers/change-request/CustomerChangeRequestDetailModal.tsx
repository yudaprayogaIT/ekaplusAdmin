"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaHistory,
  FaTimes,
} from "react-icons/fa";
import {
  API_CONFIG,
  apiFetch,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import WorkflowActionBar from "@/components/workflow-actions/WorkflowActionBar";
import WorkflowRejectNoteModal from "@/components/workflow-actions/WorkflowRejectNoteModal";
import {
  executeWorkflowAction,
  type WorkflowActionItem,
} from "@/services/workflowActionService";
import type {
  CustomerChangeRequest,
  CustomerChangeRequestDetail,
} from "./types";

interface DetailApiRow {
  id: number;
  idx?: number | null;
  field_label?: string | null;
  field_name?: string | null;
  field_type?: string | null;
  old_value?: unknown;
  new_value?: unknown;
}

interface ParentApiRow {
  id: number;
  name?: string | null;
  reason?: string | null;
  rejected_note?: string | null;
  status?: string | null;
  docstatus?: number | null;
  applied_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: { full_name?: string | null } | number | null;
  updated_by?: { full_name?: string | null } | number | null;
}

interface Props {
  item: CustomerChangeRequest | null;
  onClose: () => void;
  onActionExecuted?: () => Promise<void> | void;
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: { full_name?: string | null } | number | null | undefined,
  fallback: string,
): string {
  if (explicitName?.trim()) return explicitName.trim();
  if (value && typeof value === "object" && value.full_name?.trim()) {
    return value.full_name.trim();
  }
  return fallback;
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "(kosong)";
  if (typeof value === "boolean") return value ? "Ya" : "Tidak";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

type StructuredRecord = Record<string, unknown>;

const ADDRESS_FIELDS = [
  "type",
  "label",
  "address",
  "province",
  "city",
  "district",
  "village",
  "pic_name",
  "pic_phone",
  "same_as_company_address",
] as const;

const CONTACT_FIELDS = [
  "full_name",
  "display_name",
  "channel",
  "handle",
  "position_name",
] as const;

const FIELD_LABELS: Record<string, string> = {
  type: "Tipe Alamat",
  label: "Label Alamat",
  address: "Alamat Lengkap",
  province: "Provinsi",
  city: "Kota / Kabupaten",
  district: "Kecamatan",
  village: "Kelurahan",
  pic_name: "Nama PIC",
  pic_phone: "Telepon PIC",
  same_as_company_address: "Sama dengan Alamat Perusahaan",
  full_name: "Nama Lengkap",
  display_name: "Display Name",
  channel: "Tipe Kontak",
  handle: "Nomor / Email / Handle",
  position_name: "Position",
};

function parseStructuredValue(value: unknown): unknown {
  let parsed = value;

  // JSON columns can arrive as arrays, JSON strings, or double-encoded strings.
  for (let attempt = 0; attempt < 2 && typeof parsed === "string"; attempt += 1) {
    const candidate = parsed.trim();
    if (!candidate.startsWith("[") && !candidate.startsWith("{")) break;
    try {
      parsed = JSON.parse(candidate) as unknown;
    } catch {
      break;
    }
  }

  return parsed;
}

function toRecordArray(value: unknown): StructuredRecord[] | null {
  const parsed = parseStructuredValue(value);
  const items = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
  if (
    !items.every(
      (entry) => entry && typeof entry === "object" && !Array.isArray(entry),
    )
  ) {
    return null;
  }
  return items as StructuredRecord[];
}

function comparableValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function recordKey(
  record: StructuredRecord,
  index: number,
  type: "address" | "contact",
) {
  const preferredKeys =
    type === "contact" ? ["contact_id", "idx_row", "id"] : ["idx_row", "id"];
  for (const key of preferredKeys) {
    const value = record[key];
    if (value !== null && value !== undefined && value !== "") {
      return `${key}:${String(value)}`;
    }
  }
  return `index:${index}`;
}

interface RecordPair {
  key: string;
  oldRecord?: StructuredRecord;
  newRecord?: StructuredRecord;
}

function pairRecords(
  oldRecords: StructuredRecord[],
  newRecords: StructuredRecord[],
  type: "address" | "contact",
): RecordPair[] {
  const pairs = new Map<string, RecordPair>();

  oldRecords.forEach((record, index) => {
    const key = recordKey(record, index, type);
    pairs.set(key, { key, oldRecord: record });
  });
  newRecords.forEach((record, index) => {
    const key = recordKey(record, index, type);
    const existing = pairs.get(key);
    pairs.set(
      key,
      existing ? { ...existing, newRecord: record } : { key, newRecord: record },
    );
  });

  return Array.from(pairs.values());
}

function formattedFieldValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (field === "same_as_company_address") {
    return value === true || value === 1 || value === "1" ? "Ya" : "Tidak";
  }
  return displayValue(value);
}

function recordTitle(
  type: "address" | "contact",
  record: StructuredRecord | undefined,
  fallback: StructuredRecord | undefined,
  index: number,
): string {
  const source = record || fallback || {};
  const name =
    type === "address"
      ? source.label || source.type
      : source.full_name || source.display_name;
  const prefix = type === "address" ? "Alamat" : "Kontak";
  return `${prefix} ${index + 1}${name ? ` · ${String(name)}` : ""}`;
}

function StructuredValueCard({
  type,
  record,
  fallback,
  fields,
  index,
  missingLabel,
}: {
  type: "address" | "contact";
  record?: StructuredRecord;
  fallback?: StructuredRecord;
  fields: readonly string[];
  index: number;
  missingLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-white/80 bg-white/75 p-3 shadow-sm">
      <p className="mb-2 text-xs font-bold text-slate-700">
        {recordTitle(type, record, fallback, index)}
        {missingLabel ? ` (${missingLabel})` : ""}
      </p>
      <dl className="space-y-1.5">
        {fields.map((field) => (
          <div
            key={field}
            className="grid grid-cols-[minmax(0,42%)_minmax(0,58%)] gap-2 text-xs"
          >
            <dt className="text-slate-500">{FIELD_LABELS[field] || field}</dt>
            <dd className="break-words font-medium text-slate-700">
              {formattedFieldValue(field, record?.[field])}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function StructuredComparison({
  type,
  oldValue,
  newValue,
}: {
  type: "address" | "contact";
  oldValue: unknown;
  newValue: unknown;
}) {
  const oldRecords = toRecordArray(oldValue) || [];
  const newRecords = toRecordArray(newValue) || [];
  const allPairs = pairRecords(oldRecords, newRecords, type);
  const pairs =
    type === "address"
      ? allPairs.filter((pair) =>
          ADDRESS_FIELDS.some(
            (field) =>
              comparableValue(pair.oldRecord?.[field]) !==
              comparableValue(pair.newRecord?.[field]),
          ),
        )
      : allPairs;

  const fieldsForPair = (pair: RecordPair) =>
    type === "address"
      ? ADDRESS_FIELDS.filter(
          (field) =>
            comparableValue(pair.oldRecord?.[field]) !==
            comparableValue(pair.newRecord?.[field]),
        )
      : CONTACT_FIELDS;

  return (
    <div className="grid items-start gap-2 md:grid-cols-[1fr_auto_1fr]">
      <div className="min-w-0 rounded-lg border border-rose-100 bg-rose-50 p-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-rose-500">
          {type === "address"
            ? `${oldRecords.length} alamat`
            : `${oldRecords.length} kontak`}
        </p>
        <div className="space-y-2">
          {pairs.map((pair, index) => (
            <StructuredValueCard
              key={pair.key}
              type={type}
              record={pair.oldRecord}
              fallback={pair.newRecord}
              fields={fieldsForPair(pair)}
              index={index}
              missingLabel={!pair.oldRecord ? "ditambahkan" : undefined}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center px-2 py-1 text-gray-400">
        <FaArrowRight className="rotate-90 md:rotate-0" />
      </div>
      <div className="min-w-0 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
          {type === "address"
            ? `${newRecords.length} alamat`
            : `${newRecords.length} kontak`}
        </p>
        <div className="space-y-2">
          {pairs.map((pair, index) => (
            <StructuredValueCard
              key={pair.key}
              type={type}
              record={pair.newRecord}
              fallback={pair.oldRecord}
              fields={fieldsForPair(pair)}
              index={index}
              missingLabel={!pair.newRecord ? "dihapus" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function structuredFieldType(fieldName: string): "address" | "contact" | null {
  const normalized = fieldName.trim().toLowerCase();
  if (normalized === "customer_address") return "address";
  if (normalized === "customer_contact") return "contact";
  return null;
}

function isRejectWorkflowAction(action: WorkflowActionItem): boolean {
  const mode = action.mode?.trim().toLowerCase();
  const label = action.action.trim().toLowerCase();
  return mode === "reject" || label.includes("reject") || label.includes("tolak");
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("reject") || normalized.includes("cancel")) {
    return "border-rose-200 bg-rose-100 text-rose-700";
  }
  if (
    normalized.includes("sync") ||
    normalized.includes("approve") ||
    normalized.includes("applied")
  ) {
    return "border-emerald-200 bg-emerald-100 text-emerald-700";
  }
  if (normalized.includes("draft")) {
    return "border-amber-200 bg-amber-100 text-amber-700";
  }
  return "border-sky-200 bg-sky-100 text-sky-700";
}

export function CustomerChangeRequestDetailModal({
  item,
  onClose,
  onActionExecuted,
}: Props) {
  const { token } = useAuth();
  const [details, setDetails] = useState<CustomerChangeRequestDetail[]>([]);
  const [activeItem, setActiveItem] = useState<CustomerChangeRequest | null>(
    item,
  );
  const [actions, setActions] = useState<WorkflowActionItem[]>([]);
  const [executingActionId, setExecutingActionId] = useState<number | null>(
    null,
  );
  const [pendingRejectAction, setPendingRejectAction] =
    useState<WorkflowActionItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!item || !token) return;
    const baseItem = item;
    const itemId = baseItem.id;
    let cancelled = false;

    async function loadDetails() {
      setLoading(true);
      setError(null);
      setDetails([]);
      try {
        const [parentResponse, detailResponse] = await Promise.all([
          apiFetch(
            getQueryUrl(
              `${API_CONFIG.ENDPOINTS.CUSTOMER_CHANGE_REQUEST}/${itemId}`,
              {
                fields: [
                  "*",
                  "created_by.full_name",
                  "updated_by.full_name",
                ],
              },
            ),
            { method: "GET", cache: "no-store" },
            token,
          ),
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CHANGE_REQUEST_DETAIL, {
              fields: ["*"],
              filters: [["parent_id", "=", itemId]],
              order_by: [["idx", "asc"]],
            }),
            { method: "GET", cache: "no-store" },
            token,
          ),
        ]);
        if (!parentResponse.ok) {
          throw new Error(
            `Gagal memuat customer change request (${parentResponse.status})`,
          );
        }
        if (!detailResponse.ok) {
          throw new Error(
            `Gagal memuat detail perubahan (${detailResponse.status})`,
          );
        }
        const [parentJson, detailJson] = await Promise.all([
          parentResponse.json(),
          detailResponse.json(),
        ]);
        const parent = parentJson?.data as ParentApiRow | null | undefined;
        const rows = Array.isArray(detailJson?.data)
          ? (detailJson.data as DetailApiRow[])
          : [];
        if (!cancelled) {
          setActiveItem(
            parent
              ? {
                  ...baseItem,
                  name: parent.name || baseItem.name,
                  reason: parent.reason ?? baseItem.reason,
                  rejectedNote:
                    parent.rejected_note ?? baseItem.rejectedNote,
                  status: parent.status || baseItem.status,
                  docstatus: Number(parent.docstatus ?? baseItem.docstatus),
                  appliedAt: parent.applied_at ?? baseItem.appliedAt,
                  createdAt: parent.created_at ?? baseItem.createdAt,
                  updatedAt: parent.updated_at ?? baseItem.updatedAt,
                  createdBy: resolveUserName(
                    parent["created_by.full_name"],
                    parent.created_by,
                    baseItem.createdBy,
                  ),
                  updatedBy: resolveUserName(
                    parent["updated_by.full_name"],
                    parent.updated_by,
                    baseItem.updatedBy,
                  ),
                }
              : baseItem,
          );
          setActions(
            Array.isArray(parentJson?.action) ? parentJson.action : [],
          );
          setDetails(
            rows.map((row) => ({
              id: Number(row.id),
              idx: Number(row.idx || 0),
              fieldLabel: row.field_label || row.field_name || "Field",
              fieldName: row.field_name || "-",
              fieldType: row.field_type || "-",
              oldValue: row.old_value,
              newValue: row.new_value,
            })),
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setDetails([]);
          setActions([]);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Gagal memuat detail perubahan",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDetails();
    return () => {
      cancelled = true;
    };
  }, [item, reloadKey, token]);

  useEffect(() => {
    setActiveItem(item);
    setActions([]);
    setPendingRejectAction(null);
    setActionResult(null);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  async function executeAction(
    workflowAction: WorkflowActionItem,
    payload?: Record<string, unknown>,
  ) {
    if (!item || !token) return;

    const isRejectAction = isRejectWorkflowAction(workflowAction);
    const rejectedNote =
      typeof payload?.rejected_note === "string"
        ? payload.rejected_note.trim()
        : "";

    setExecutingActionId(workflowAction.id);
    setActionResult(null);

    try {
      if (isRejectAction && !rejectedNote) {
        throw new Error("Rejected note wajib diisi sebelum workflow di-reject.");
      }

      if (isRejectAction) {
        const updateResponse = await apiFetch(
          getResourceUrl(
            API_CONFIG.ENDPOINTS.CUSTOMER_CHANGE_REQUEST,
            item.id,
          ),
          {
            method: "PUT",
            cache: "no-store",
            body: JSON.stringify({
              rejected_note: rejectedNote,
            }),
          },
          token,
        );

        if (!updateResponse.ok) {
          const updateBody = await updateResponse.json().catch(() => null);
          const message =
            updateBody &&
            typeof updateBody === "object" &&
            "message" in updateBody &&
            typeof updateBody.message === "string"
              ? updateBody.message
              : `Gagal menyimpan rejected note (${updateResponse.status})`;
          throw new Error(message);
        }
      }

      await executeWorkflowAction({
        token,
        resourceName: "customer_change_request",
        documentId: item.id,
        actionId: workflowAction.id,
        payload: isRejectAction
          ? { ...payload, rejected_note: rejectedNote }
          : payload,
      });

      setPendingRejectAction(null);
      setActionResult({
        type: "success",
        message: `${workflowAction.action} berhasil dijalankan.`,
      });
      setReloadKey((value) => value + 1);
      await onActionExecuted?.();
    } catch (actionError) {
      setActionResult({
        type: "error",
        message:
          actionError instanceof Error
            ? actionError.message
            : "Gagal menjalankan action workflow.",
      });
    } finally {
      setExecutingActionId(null);
    }
  }

  function handleActionClick(workflowAction: WorkflowActionItem) {
    if (isRejectWorkflowAction(workflowAction)) {
      setPendingRejectAction(workflowAction);
      return;
    }
    void executeAction(workflowAction);
  }

  const displayedItem = activeItem || item;

  return (
    <>
      <AnimatePresence>
        {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="bg-gradient-to-r from-red-600 to-rose-600 px-5 py-5 text-white sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-100">
                    Customer Change Request
                  </p>
                  <h2 className="truncate text-xl font-bold sm:text-2xl">
                    {displayedItem?.entityDisplayName}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-red-100">
                    <span>
                      {displayedItem?.entityType
                        .split("_")
                        .filter(Boolean)
                        .map(
                          (part) =>
                            part.charAt(0).toUpperCase() + part.slice(1),
                        )
                        .join(" ")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full bg-red-100"
                    />
                    <span>{displayedItem?.name}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup detail"
                  className="rounded-xl bg-white/15 p-2.5 transition hover:bg-white/25"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-5 sm:p-7">
              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(displayedItem?.status || "")}`}
                  >
                    {displayedItem?.status}
                  </span>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Dibuat</p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDate(displayedItem?.createdAt || null)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    oleh {displayedItem?.createdBy}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Diperbarui</p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDate(displayedItem?.updatedAt || null)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    oleh {displayedItem?.updatedBy}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Diterapkan</p>
                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {formatDate(displayedItem?.appliedAt || null)}
                  </p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Alasan Perubahan
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {displayedItem?.reason || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Catatan Penolakan
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {displayedItem?.rejectedNote || "-"}
                  </p>
                </div>
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <FaHistory className="text-red-500" /> Detail Perubahan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Perbandingan nilai sebelum dan sesudah perubahan
                  </p>
                </div>
                {!loading && !error && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {details.length} field
                  </span>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center rounded-xl border border-gray-200 py-14">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                  <FaExclamationCircle className="mx-auto mb-2 text-xl text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    onClick={() => setReloadKey((value) => value + 1)}
                    className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : details.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
                  Tidak ada detail perubahan.
                </div>
              ) : (
                <div className="space-y-3">
                  {details.map((detail) => (
                    <div
                      key={detail.id}
                      className="rounded-xl border border-gray-200 p-4 transition hover:border-red-200 hover:shadow-sm"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {detail.fieldLabel}
                          </p>
                          <p className="text-xs text-gray-500">
                            {detail.fieldName} · {detail.fieldType}
                          </p>
                        </div>
                      </div>
                      {structuredFieldType(detail.fieldName) &&
                      toRecordArray(detail.oldValue) !== null &&
                      toRecordArray(detail.newValue) !== null ? (
                        <StructuredComparison
                          type={structuredFieldType(detail.fieldName)!}
                          oldValue={detail.oldValue}
                          newValue={detail.newValue}
                        />
                      ) : (
                      <div className="grid items-stretch gap-2 md:grid-cols-[1fr_auto_1fr]">
                        <div className="min-w-0 rounded-lg border border-rose-100 bg-rose-50 p-3">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-rose-500">
                            Nilai Lama
                          </p>
                          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-gray-800">
                            {displayValue(detail.oldValue)}
                          </pre>
                        </div>
                        <div className="flex items-center justify-center px-2 py-1 text-gray-400">
                          <FaArrowRight className="rotate-90 md:rotate-0" />
                        </div>
                        <div className="min-w-0 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600">
                            Nilai Baru
                          </p>
                          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-gray-800">
                            {displayValue(detail.newValue)}
                          </pre>
                        </div>
                      </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {actionResult ? (
                <div
                  className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                    actionResult.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {actionResult.message}
                </div>
              ) : null}

              {actions.length > 0 ? (
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-emerald-600" />
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          Available Actions
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Action ini berasal dari workflow backend.
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {actions.length} action tersedia
                    </span>
                  </div>
                  <WorkflowActionBar
                    actions={actions}
                    loadingActionId={executingActionId}
                    disabled={loading}
                    onActionClick={handleActionClick}
                  />
                </section>
              ) : null}

              <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                <FaCalendarAlt /> Docstatus: {displayedItem?.docstatus}
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

      <WorkflowRejectNoteModal
        open={pendingRejectAction !== null}
        action={pendingRejectAction}
        loading={
          pendingRejectAction !== null &&
          executingActionId === pendingRejectAction.id
        }
        onClose={() => {
          if (executingActionId !== null) return;
          setPendingRejectAction(null);
        }}
        onSubmit={async (note) => {
          if (!pendingRejectAction) return;
          await executeAction(pendingRejectAction, { rejected_note: note });
        }}
      />
    </>
  );
}
