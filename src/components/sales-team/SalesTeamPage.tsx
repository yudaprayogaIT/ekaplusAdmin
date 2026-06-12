"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getAuthHeaders,
  getAuthHeadersFormData,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import {
  FaEdit,
  FaEye,
  FaLayerGroup,
  FaLock,
  FaMapMarkedAlt,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaStickyNote,
  FaTimes,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

type AuditActor = string | number | { id?: number; full_name?: string } | null | undefined;

type LookupRef = {
  id?: number | string | null;
  sales_team_name?: string;
  branch_name?: string;
  city?: string;
};

type ApiEnvelope<T> = {
  data?: T[];
};

type SalesTeamApiRow = {
  id: number;
  name?: string;
  sales_team_name?: string;
  disabled?: number | string | boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: AuditActor;
  updated_by?: AuditActor;
  owner?: AuditActor;
};

type SalesTeamAreaApiRow = {
  id: number;
  name?: string;
  sales_team?: number | string | LookupRef | null;
  branch?: number | string | LookupRef | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: AuditActor;
  updated_by?: AuditActor;
  owner?: AuditActor;
};

export type SalesTeam = {
  id: number;
  name?: string;
  sales_team_name: string;
  disabled: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  owner?: string;
};

export type SalesTeamArea = {
  id: number;
  name?: string;
  sales_team_id?: number | string;
  sales_team_name: string;
  branch_id?: number | string;
  branch_name: string;
  branch_city?: string;
  branch_label: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  owner?: string;
};

type LookupOption = {
  id: number | string;
  label: string;
  sublabel?: string;
};

type TabKey = "sales_team" | "sales_team_area";
type SortOption = "id-asc" | "id-desc" | "name-asc" | "name-desc";

const SALES_TEAM_EVENT = "ekatalog:sales_teams_update";
const SALES_TEAM_AREA_EVENT = "ekatalog:sales_team_areas_update";

function toActorName(value: AuditActor): string | undefined {
  if (typeof value === "object" && value) return value.full_name || undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number") return `User #${value}`;
  return undefined;
}

function toDisabledValue(value: SalesTeamApiRow["disabled"]): number {
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "string") return Number(value) ? 1 : 0;
  return Number(value || 0) ? 1 : 0;
}

function extractLinkId(value: number | string | LookupRef | null | undefined): number | string | undefined {
  if (typeof value === "object" && value) return value.id ?? undefined;
  if (typeof value === "number" || typeof value === "string") return value;
  return undefined;
}

function formatDateTime(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function mapSalesTeam(row: SalesTeamApiRow): SalesTeam {
  return {
    id: row.id,
    name: row.name || undefined,
    sales_team_name: row.sales_team_name || row.name || `Sales Team #${row.id}`,
    disabled: toDisabledValue(row.disabled),
    notes: row.notes || "",
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: toActorName(row.created_by),
    updated_by: toActorName(row.updated_by),
    owner: toActorName(row.owner),
  };
}

function mapSalesTeamArea(row: SalesTeamAreaApiRow): SalesTeamArea {
  const salesTeamObject = typeof row.sales_team === "object" && row.sales_team ? row.sales_team : null;
  const branchObject = typeof row.branch === "object" && row.branch ? row.branch : null;
  const branchName = branchObject?.branch_name || "";
  const branchCity = branchObject?.city || "";
  const branchLabel = [branchName, branchCity].filter(Boolean).join(" - ") || "-";

  return {
    id: row.id,
    name: row.name || undefined,
    sales_team_id: extractLinkId(row.sales_team),
    sales_team_name: salesTeamObject?.sales_team_name || String(extractLinkId(row.sales_team) || "-"),
    branch_id: extractLinkId(row.branch),
    branch_name: branchName || String(extractLinkId(row.branch) || "-"),
    branch_city: branchCity || undefined,
    branch_label: branchLabel,
    notes: row.notes || "",
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: toActorName(row.created_by),
    updated_by: toActorName(row.updated_by),
    owner: toActorName(row.owner),
  };
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-200 border-t-red-500" />
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  locked = false,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  locked?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        {locked ? <FaLock className="h-7 w-7" /> : <FaLayerGroup className="h-7 w-7" />}
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
      <p className="mx-auto mb-6 max-w-xl text-sm text-gray-500">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700"
        >
          <FaPlus className="h-4 w-4" />
          <span>{actionLabel}</span>
        </button>
      ) : null}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone: "red" | "amber" | "blue";
}) {
  const toneMap = {
    red: {
      gradient: "from-red-500 to-red-600",
      surface: "bg-red-50",
      iconText: "text-red-600",
    },
    amber: {
      gradient: "from-amber-500 to-amber-600",
      surface: "bg-amber-50",
      iconText: "text-amber-600",
    },
    blue: {
      gradient: "from-blue-500 to-blue-600",
      surface: "bg-blue-50",
      iconText: "text-blue-600",
    },
  } as const;
  const colors = toneMap[tone];

  return (
    <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colors.surface} ${colors.iconText}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      <div className={`mt-4 h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} />
    </div>
  );
}

function DetailModal({
  open,
  onClose,
  title,
  badge,
  rows,
  notes,
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
  owner,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  badge: string;
  rows: Array<{ label: string; value: string }>;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  owner?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        >
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-7 py-8 text-white">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 rounded-xl p-2 transition hover:bg-white/15"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              {badge}
            </span>
            <h2 className="mt-3 text-3xl font-bold">{title}</h2>
          </div>

          <div className="space-y-6 p-7">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {rows.map((row) => (
                <div key={row.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{row.label}</p>
                  <p className="break-words text-sm font-medium text-gray-800">{row.value || "-"}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-amber-700">
                <FaStickyNote className="h-4 w-4" />
                <p className="text-sm font-semibold">Notes</p>
              </div>
              <p className="text-sm leading-6 text-gray-700">{notes || "-"}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">Created</p>
                <p className="text-sm text-gray-700">{formatDateTime(createdAt)}</p>
                <p className="mt-1 text-sm text-gray-500">{createdBy || owner || "-"}</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-700">Updated</p>
                <p className="text-sm text-gray-700">{formatDateTime(updatedAt)}</p>
                <p className="mt-1 text-sm text-gray-500">{updatedBy || "-"}</p>
              </div>
            </div>

            {(canEdit || canDelete) && (
              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-2">
                {canDelete ? (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <FaTrash className="h-4 w-4" />
                    <span>Hapus</span>
                  </button>
                ) : null}
                {canEdit ? (
                  <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700"
                  >
                    <FaEdit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SalesTeamFormModal({
  open,
  onClose,
  initial,
  onSave,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  initial?: SalesTeam | null;
  onSave: (payload: { id?: number; sales_team_name: string; disabled: boolean; notes: string }) => Promise<void>;
  saving: boolean;
}) {
  const [salesTeamName, setSalesTeamName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSalesTeamName(initial?.sales_team_name || "");
    setDisabled(Boolean(initial?.disabled));
    setNotes(initial?.notes || "");
    setError(null);
  }, [initial, open]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!salesTeamName.trim()) {
      setError("Sales Team Name wajib diisi.");
      return;
    }

    try {
      await onSave({
        id: initial?.id,
        sales_team_name: salesTeamName.trim(),
        disabled,
        notes: notes.trim(),
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan sales team");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {initial ? "Edit Sales Team" : "Tambah Sales Team"}
              </h2>
              <p className="text-sm text-gray-500">Kelola nama tim, status aktif, dan catatan internal.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5 p-6">
            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Sales Team Name</label>
              <input
                value={salesTeamName}
                onChange={(e) => setSalesTeamName(e.target.value)}
                disabled={saving}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                placeholder="Masukkan nama sales team"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={saving}
                rows={4}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                placeholder="Catatan tambahan"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
                disabled={saving}
                className="h-4 w-4 rounded border-gray-300 text-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Nonaktifkan sales team ini</span>
            </label>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700">
                {saving ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Simpan Sales Team"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function SalesTeamAreaFormModal({
  open,
  onClose,
  initial,
  salesTeams,
  branches,
  onSave,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  initial?: SalesTeamArea | null;
  salesTeams: LookupOption[];
  branches: LookupOption[];
  onSave: (payload: { id?: number; sales_team: number | string; branch: number | string; notes: string }) => Promise<void>;
  saving: boolean;
}) {
  const [salesTeamId, setSalesTeamId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSalesTeamId(initial?.sales_team_id ? String(initial.sales_team_id) : "");
    setBranchId(initial?.branch_id ? String(initial.branch_id) : "");
    setNotes(initial?.notes || "");
    setError(null);
  }, [initial, open]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!salesTeamId) {
      setError("Sales Team wajib dipilih.");
      return;
    }
    if (!branchId) {
      setError("Branch wajib dipilih.");
      return;
    }

    try {
      await onSave({
        id: initial?.id,
        sales_team: salesTeamId,
        branch: branchId,
        notes: notes.trim(),
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan sales team area");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 16 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {initial ? "Edit Sales Team Area" : "Tambah Sales Team Area"}
              </h2>
              <p className="text-sm text-gray-500">Hubungkan sales team dengan branch yang menjadi area cakupannya.</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5 p-6">
            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Sales Team</label>
              <select
                value={salesTeamId}
                onChange={(e) => setSalesTeamId(e.target.value)}
                disabled={saving}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
              >
                <option value="">Pilih Sales Team</option>
                {salesTeams.map((option) => (
                  <option key={option.id} value={String(option.id)}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                disabled={saving}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
              >
                <option value="">Pilih Branch</option>
                {branches.map((option) => (
                  <option key={option.id} value={String(option.id)}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={saving}
                rows={4}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                placeholder="Catatan area coverage"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                Batal
              </button>
              <button type="submit" disabled={saving} className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700">
                {saving ? "Menyimpan..." : initial ? "Simpan Perubahan" : "Simpan Sales Team Area"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function RowActions({
  onView,
  onEdit,
  onDelete,
  canManage,
}: {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canManage: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button type="button" onClick={onView} className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800">
        <FaEye className="h-4 w-4" />
      </button>
      {canManage ? (
        <>
          <button type="button" onClick={onEdit} className="rounded-lg p-2 text-amber-500 transition hover:bg-amber-50 hover:text-amber-700">
            <FaEdit className="h-4 w-4" />
          </button>
          <button type="button" onClick={onDelete} className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700">
            <FaTrash className="h-4 w-4" />
          </button>
        </>
      ) : null}
    </div>
  );
}

export default function SalesTeamPage() {
  const { token, isAuthenticated, isLoading: authLoading, hasAnyPermission } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>("sales_team");

  const [salesTeams, setSalesTeams] = useState<SalesTeam[]>([]);
  const [salesTeamAreas, setSalesTeamAreas] = useState<SalesTeamArea[]>([]);

  const [salesTeamsLoading, setSalesTeamsLoading] = useState(true);
  const [salesTeamAreasLoading, setSalesTeamAreasLoading] = useState(true);
  const [lookupsLoading, setLookupsLoading] = useState(true);

  const [salesTeamsError, setSalesTeamsError] = useState<{ code?: number; message: string } | null>(null);
  const [salesTeamAreasError, setSalesTeamAreasError] = useState<{ code?: number; message: string } | null>(null);

  const [salesTeamQuery, setSalesTeamQuery] = useState("");
  const [salesTeamAreaQuery, setSalesTeamAreaQuery] = useState("");
  const [salesTeamSort, setSalesTeamSort] = useState<SortOption>("id-desc");
  const [salesTeamAreaSort, setSalesTeamAreaSort] = useState<SortOption>("id-desc");

  const [salesTeamModalOpen, setSalesTeamModalOpen] = useState(false);
  const [salesTeamInitial, setSalesTeamInitial] = useState<SalesTeam | null>(null);
  const [salesTeamSaving, setSalesTeamSaving] = useState(false);
  const [salesTeamDetail, setSalesTeamDetail] = useState<SalesTeam | null>(null);

  const [salesTeamAreaModalOpen, setSalesTeamAreaModalOpen] = useState(false);
  const [salesTeamAreaInitial, setSalesTeamAreaInitial] = useState<SalesTeamArea | null>(null);
  const [salesTeamAreaSaving, setSalesTeamAreaSaving] = useState(false);
  const [salesTeamAreaDetail, setSalesTeamAreaDetail] = useState<SalesTeamArea | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const confirmActionRef = useRef<(() => Promise<void>) | null>(null);

  const [salesTeamLookupOptions, setSalesTeamLookupOptions] = useState<LookupOption[]>([]);
  const [branchLookupOptions, setBranchLookupOptions] = useState<LookupOption[]>([]);

  const canManageSalesTeams = hasAnyPermission(["sales_team.create", "sales_team.update", "sales_team.delete"]);
  const canManageSalesTeamAreas = hasAnyPermission([
    "sales_team_area.create",
    "sales_team_area.update",
    "sales_team_area.delete",
  ]);

  const loadSalesTeams = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setSalesTeamsLoading(false);
      return;
    }

    setSalesTeamsLoading(true);
    setSalesTeamsError(null);

    try {
      const res = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.SALES_TEAM, {
          fields: ["*", "created_by.full_name", "updated_by.full_name", "owner.full_name"],
        }),
        {
          method: "GET",
          cache: "no-store",
          headers: getAuthHeaders(token),
        },
      );

      if (!res.ok) {
        const message = res.status === 403 ? "Akses ditolak untuk data sales team." : "Gagal memuat data sales team.";
        setSalesTeamsError({ code: res.status, message });
        return;
      }

      const json = (await res.json()) as ApiEnvelope<SalesTeamApiRow>;
      setSalesTeams(Array.isArray(json.data) ? json.data.map(mapSalesTeam) : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memuat data sales team.";
      setSalesTeamsError({ message });
    } finally {
      setSalesTeamsLoading(false);
    }
  }, [isAuthenticated, token]);

  const loadSalesTeamAreas = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setSalesTeamAreasLoading(false);
      return;
    }

    setSalesTeamAreasLoading(true);
    setSalesTeamAreasError(null);

    try {
      const res = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.SALES_TEAM_AREA, {
          fields: [
            "*",
            "sales_team.sales_team_name",
            "branch.branch_name",
            "branch.city",
            "created_by.full_name",
            "updated_by.full_name",
            "owner.full_name",
          ],
        }),
        {
          method: "GET",
          cache: "no-store",
          headers: getAuthHeaders(token),
        },
      );

      if (!res.ok) {
        const message =
          res.status === 403 ? "Akses ditolak untuk data sales team area." : "Gagal memuat data sales team area.";
        setSalesTeamAreasError({ code: res.status, message });
        return;
      }

      const json = (await res.json()) as ApiEnvelope<SalesTeamAreaApiRow>;
      setSalesTeamAreas(Array.isArray(json.data) ? json.data.map(mapSalesTeamArea) : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memuat data sales team area.";
      setSalesTeamAreasError({ message });
    } finally {
      setSalesTeamAreasLoading(false);
    }
  }, [isAuthenticated, token]);

  const loadLookups = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLookupsLoading(false);
      return;
    }

    setLookupsLoading(true);
    try {
      const headers = getAuthHeaders(token);
      const [salesTeamsRes, branchesRes] = await Promise.all([
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.SALES_TEAM, {
            fields: ["id", "sales_team_name"],
          }),
          { method: "GET", cache: "no-store", headers },
        ),
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
            fields: ["id", "branch_name", "city"],
          }),
          { method: "GET", cache: "no-store", headers },
        ),
      ]);

      const salesTeamsJson = salesTeamsRes.ok ? ((await salesTeamsRes.json()) as ApiEnvelope<{ id: number | string; sales_team_name?: string }>) : { data: [] };
      const branchesJson = branchesRes.ok ? ((await branchesRes.json()) as ApiEnvelope<{ id: number | string; branch_name?: string; city?: string }>) : { data: [] };

      setSalesTeamLookupOptions(
        (salesTeamsJson.data || []).map((row) => ({
          id: row.id,
          label: row.sales_team_name || `Sales Team #${row.id}`,
        })),
      );
      setBranchLookupOptions(
        (branchesJson.data || []).map((row) => ({
          id: row.id,
          label: [row.branch_name || `Branch #${row.id}`, row.city].filter(Boolean).join(" - "),
          sublabel: row.city,
        })),
      );
    } finally {
      setLookupsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadSalesTeams();
    loadSalesTeamAreas();
    loadLookups();
  }, [loadLookups, loadSalesTeamAreas, loadSalesTeams]);

  useEffect(() => {
    const refreshSalesTeams = () => {
      void loadSalesTeams();
      void loadLookups();
    };
    const refreshSalesTeamAreas = () => {
      void loadSalesTeamAreas();
      void loadLookups();
    };

    window.addEventListener(SALES_TEAM_EVENT, refreshSalesTeams);
    window.addEventListener(SALES_TEAM_AREA_EVENT, refreshSalesTeamAreas);
    return () => {
      window.removeEventListener(SALES_TEAM_EVENT, refreshSalesTeams);
      window.removeEventListener(SALES_TEAM_AREA_EVENT, refreshSalesTeamAreas);
    };
  }, [loadLookups, loadSalesTeamAreas, loadSalesTeams]);

  const filteredSalesTeams = useMemo(() => {
    const query = salesTeamQuery.trim().toLowerCase();
    const rows = query
      ? salesTeams.filter((item) => {
          const haystacks = [item.sales_team_name, item.name, item.notes].filter(Boolean).map((x) => String(x).toLowerCase());
          return haystacks.some((value) => value.includes(query));
        })
      : salesTeams;

    return [...rows].sort((a, b) => {
      switch (salesTeamSort) {
        case "id-asc":
          return a.id - b.id;
        case "id-desc":
          return b.id - a.id;
        case "name-asc":
          return a.sales_team_name.localeCompare(b.sales_team_name);
        case "name-desc":
          return b.sales_team_name.localeCompare(a.sales_team_name);
      }
    });
  }, [salesTeamQuery, salesTeamSort, salesTeams]);

  const filteredSalesTeamAreas = useMemo(() => {
    const query = salesTeamAreaQuery.trim().toLowerCase();
    const rows = query
      ? salesTeamAreas.filter((item) => {
          const haystacks = [item.sales_team_name, item.branch_name, item.branch_city, item.notes].filter(Boolean).map((x) =>
            String(x).toLowerCase(),
          );
          return haystacks.some((value) => value.includes(query));
        })
      : salesTeamAreas;

    return [...rows].sort((a, b) => {
      switch (salesTeamAreaSort) {
        case "id-asc":
          return a.id - b.id;
        case "id-desc":
          return b.id - a.id;
        case "name-asc":
          return a.sales_team_name.localeCompare(b.sales_team_name) || a.branch_label.localeCompare(b.branch_label);
        case "name-desc":
          return b.sales_team_name.localeCompare(a.sales_team_name) || b.branch_label.localeCompare(a.branch_label);
      }
    });
  }, [salesTeamAreaQuery, salesTeamAreaSort, salesTeamAreas]);

  async function saveSalesTeam(payload: {
    id?: number;
    sales_team_name: string;
    disabled: boolean;
    notes: string;
  }) {
    if (!token) throw new Error("Not authenticated");

    setSalesTeamSaving(true);
    try {
      const formData = new FormData();
      formData.append("sales_team_name", payload.sales_team_name);
      formData.append("disabled", payload.disabled ? "1" : "0");
      formData.append("notes", payload.notes);

      const response = await apiFetch(
        payload.id
          ? getResourceUrl(API_CONFIG.ENDPOINTS.SALES_TEAM, payload.id)
          : getResourceUrl(API_CONFIG.ENDPOINTS.SALES_TEAM),
        {
          method: payload.id ? "PUT" : "POST",
          headers: getAuthHeadersFormData(token),
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save sales team (${response.status})`);
      }

      setSalesTeamModalOpen(false);
      setSalesTeamInitial(null);
      window.dispatchEvent(new Event(SALES_TEAM_EVENT));
    } finally {
      setSalesTeamSaving(false);
    }
  }

  async function saveSalesTeamArea(payload: {
    id?: number;
    sales_team: number | string;
    branch: number | string;
    notes: string;
  }) {
    if (!token) throw new Error("Not authenticated");

    setSalesTeamAreaSaving(true);
    try {
      const formData = new FormData();
      formData.append("sales_team", String(payload.sales_team));
      formData.append("branch", String(payload.branch));
      formData.append("notes", payload.notes);

      const response = await apiFetch(
        payload.id
          ? getResourceUrl(API_CONFIG.ENDPOINTS.SALES_TEAM_AREA, payload.id)
          : getResourceUrl(API_CONFIG.ENDPOINTS.SALES_TEAM_AREA),
        {
          method: payload.id ? "PUT" : "POST",
          headers: getAuthHeadersFormData(token),
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to save sales team area (${response.status})`);
      }

      setSalesTeamAreaModalOpen(false);
      setSalesTeamAreaInitial(null);
      window.dispatchEvent(new Event(SALES_TEAM_AREA_EVENT));
    } finally {
      setSalesTeamAreaSaving(false);
    }
  }

  function askDelete(title: string, description: string, action: () => Promise<void>) {
    setConfirmTitle(title);
    setConfirmDesc(description);
    confirmActionRef.current = action;
    setConfirmOpen(true);
  }

  async function deleteSalesTeam(item: SalesTeam) {
    askDelete("Hapus Sales Team", `Yakin ingin menghapus sales team "${item.sales_team_name}"?`, async () => {
      if (!token) throw new Error("Not authenticated");
      const res = await apiFetch(getResourceUrl(API_CONFIG.ENDPOINTS.SALES_TEAM, item.id), {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete sales team (${res.status})`);
      }
      setSalesTeamDetail(null);
      window.dispatchEvent(new Event(SALES_TEAM_EVENT));
    });
  }

  async function deleteSalesTeamArea(item: SalesTeamArea) {
    askDelete(
      "Hapus Sales Team Area",
      `Yakin ingin menghapus area "${item.sales_team_name} - ${item.branch_label}"?`,
      async () => {
        if (!token) throw new Error("Not authenticated");
        const res = await apiFetch(getResourceUrl(API_CONFIG.ENDPOINTS.SALES_TEAM_AREA, item.id), {
          method: "DELETE",
          headers: getAuthHeaders(token),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed to delete sales team area (${res.status})`);
        }
        setSalesTeamAreaDetail(null);
        window.dispatchEvent(new Event(SALES_TEAM_AREA_EVENT));
      },
    );
  }

  async function confirmDelete() {
    setConfirmOpen(false);
    const action = confirmActionRef.current;
    confirmActionRef.current = null;
    if (!action) return;
    try {
      await action();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus data.";
      if (activeTab === "sales_team") {
        setSalesTeamsError({ message });
      } else {
        setSalesTeamAreasError({ message });
      }
    }
  }

  function cancelDelete() {
    confirmActionRef.current = null;
    setConfirmOpen(false);
  }

  if (authLoading) {
    return <LoadingState label="Memuat akses halaman sales team..." />;
  }

  if (!isAuthenticated) {
    return (
      <EmptyState
        title="Login diperlukan"
        description="Silakan login terlebih dahulu untuk mengakses master sales team dan area coverage."
        locked
      />
    );
  }

  if (activeTab === "sales_team" && salesTeamsLoading) {
    return <LoadingState label="Memuat data sales team..." />;
  }

  if (activeTab === "sales_team_area" && (salesTeamAreasLoading || lookupsLoading)) {
    return <LoadingState label="Memuat data sales team area..." />;
  }

  if (activeTab === "sales_team" && salesTeamsError) {
    return <ErrorMessage errorCode={salesTeamsError.code} message={salesTeamsError.message} onRetry={loadSalesTeams} />;
  }

  if (activeTab === "sales_team_area" && salesTeamAreasError) {
    return <ErrorMessage errorCode={salesTeamAreasError.code} message={salesTeamAreasError.message} onRetry={loadSalesTeamAreas} />;
  }

  const totalSalesTeams = salesTeams.length;
  const activeSalesTeams = salesTeams.filter((item) => item.disabled === 0).length;
  const totalAreas = salesTeamAreas.length;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-500 via-red-600 to-orange-500 px-6 py-8 text-white shadow-xl shadow-red-200 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
              <FaLayerGroup className="h-3.5 w-3.5" />
              <span>Master Data</span>
            </div>
            <h1 className="text-3xl font-bold md:text-4xl">Sales Team</h1>
            <p className="mt-3 text-sm leading-6 text-red-50 md:text-base">
              Kelola tim penjualan dan area branch yang menjadi tanggung jawab masing-masing tim dalam satu workspace.
            </p>
          </div>

          <div className="grid w-full max-w-xl grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard icon={<FaUsers className="h-5 w-5" />} label="Sales Team" value={totalSalesTeams} tone="red" />
            <StatCard icon={<FaLayerGroup className="h-5 w-5" />} label="Tim Aktif" value={activeSalesTeams} tone="amber" />
            <StatCard icon={<FaMapMarkedAlt className="h-5 w-5" />} label="Area Coverage" value={totalAreas} tone="blue" />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/70 bg-white p-3 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {[
            {
              key: "sales_team" as const,
              label: "Sales Team",
              caption: `${totalSalesTeams} data`,
              icon: <FaUsers className="h-4 w-4" />,
            },
            {
              key: "sales_team_area" as const,
              label: "Sales Team Area",
              caption: `${totalAreas} data`,
              icon: <FaMapMarkedAlt className="h-4 w-4" />,
            },
          ].map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl px-4 py-4 text-left transition ${
                  active ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${active ? "bg-white/15" : "bg-white text-red-500"}`}>
                  {tab.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{tab.label}</p>
                  <p className={`text-xs ${active ? "text-red-100" : "text-gray-500"}`}>{tab.caption}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {activeTab === "sales_team" ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={salesTeamQuery}
                  onChange={(e) => setSalesTeamQuery(e.target.value)}
                  placeholder="Cari sales team atau notes..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                />
              </div>
              <div className="relative w-full lg:w-56">
                <FaSortAmountDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={salesTeamSort}
                  onChange={(e) => setSalesTeamSort(e.target.value as SortOption)}
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                >
                  <option value="id-desc">ID: Terbaru</option>
                  <option value="id-asc">ID: Terlama</option>
                  <option value="name-asc">Nama: A-Z</option>
                  <option value="name-desc">Nama: Z-A</option>
                </select>
              </div>
            </div>
            {canManageSalesTeams ? (
              <button
                type="button"
                onClick={() => {
                  setSalesTeamInitial(null);
                  setSalesTeamModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700"
              >
                <FaPlus className="h-4 w-4" />
                <span>Tambah Sales Team</span>
              </button>
            ) : null}
          </div>

          {filteredSalesTeams.length === 0 ? (
            <EmptyState
              title={salesTeams.length === 0 ? "Belum ada sales team" : "Tidak ada hasil pencarian"}
              description={
                salesTeams.length === 0
                  ? "Mulai dengan menambahkan master sales team pertama agar area coverage bisa dipetakan."
                  : "Coba ubah kata kunci pencarian atau reset filter urutan."
              }
              actionLabel={salesTeams.length === 0 && canManageSalesTeams ? "Tambah Sales Team" : undefined}
              onAction={
                salesTeams.length === 0 && canManageSalesTeams
                  ? () => {
                      setSalesTeamInitial(null);
                      setSalesTeamModalOpen(true);
                    }
                  : undefined
              }
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Sales Team</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Notes</th>
                      <th className="px-5 py-4">Updated</th>
                      <th className="px-5 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSalesTeams.map((item) => (
                      <tr key={item.id} className="transition hover:bg-red-50/40">
                        <td className="px-5 py-4 text-sm font-semibold text-gray-600">#{item.id}</td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{item.sales_team_name}</p>
                            <p className="text-xs text-gray-500">{item.name || "sales_team"}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              item.disabled === 0 ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {item.disabled === 0 ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="max-w-sm px-5 py-4 text-sm text-gray-600">{item.notes || "-"}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{formatDateTime(item.updated_at || item.created_at)}</td>
                        <td className="px-5 py-4">
                          <RowActions
                            canManage={canManageSalesTeams}
                            onView={() => setSalesTeamDetail(item)}
                            onEdit={() => {
                              setSalesTeamInitial(item);
                              setSalesTeamModalOpen(true);
                            }}
                            onDelete={() => {
                              void deleteSalesTeam(item);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={salesTeamAreaQuery}
                  onChange={(e) => setSalesTeamAreaQuery(e.target.value)}
                  placeholder="Cari sales team, branch, kota, atau notes..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                />
              </div>
              <div className="relative w-full lg:w-56">
                <FaSortAmountDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  value={salesTeamAreaSort}
                  onChange={(e) => setSalesTeamAreaSort(e.target.value as SortOption)}
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-300 focus:bg-white"
                >
                  <option value="id-desc">ID: Terbaru</option>
                  <option value="id-asc">ID: Terlama</option>
                  <option value="name-asc">Nama: A-Z</option>
                  <option value="name-desc">Nama: Z-A</option>
                </select>
              </div>
            </div>
            {canManageSalesTeamAreas ? (
              <button
                type="button"
                onClick={() => {
                  setSalesTeamAreaInitial(null);
                  setSalesTeamAreaModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700"
              >
                <FaPlus className="h-4 w-4" />
                <span>Tambah Sales Team Area</span>
              </button>
            ) : null}
          </div>

          {filteredSalesTeamAreas.length === 0 ? (
            <EmptyState
              title={salesTeamAreas.length === 0 ? "Belum ada sales team area" : "Tidak ada hasil pencarian"}
              description={
                salesTeamAreas.length === 0
                  ? "Hubungkan sales team dengan branch agar area coverage tiap tim dapat dipantau."
                  : "Coba ubah kata kunci pencarian atau urutan data."
              }
              actionLabel={salesTeamAreas.length === 0 && canManageSalesTeamAreas ? "Tambah Sales Team Area" : undefined}
              onAction={
                salesTeamAreas.length === 0 && canManageSalesTeamAreas
                  ? () => {
                      setSalesTeamAreaInitial(null);
                      setSalesTeamAreaModalOpen(true);
                    }
                  : undefined
              }
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4">ID</th>
                      <th className="px-5 py-4">Sales Team</th>
                      <th className="px-5 py-4">Branch</th>
                      <th className="px-5 py-4">Notes</th>
                      <th className="px-5 py-4">Updated</th>
                      <th className="px-5 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSalesTeamAreas.map((item) => (
                      <tr key={item.id} className="transition hover:bg-red-50/40">
                        <td className="px-5 py-4 text-sm font-semibold text-gray-600">#{item.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">{item.sales_team_name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-gray-800">{item.branch_name}</p>
                            <p className="text-xs text-gray-500">{item.branch_city || "-"}</p>
                          </div>
                        </td>
                        <td className="max-w-sm px-5 py-4 text-sm text-gray-600">{item.notes || "-"}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">{formatDateTime(item.updated_at || item.created_at)}</td>
                        <td className="px-5 py-4">
                          <RowActions
                            canManage={canManageSalesTeamAreas}
                            onView={() => setSalesTeamAreaDetail(item)}
                            onEdit={() => {
                              setSalesTeamAreaInitial(item);
                              setSalesTeamAreaModalOpen(true);
                            }}
                            onDelete={() => {
                              void deleteSalesTeamArea(item);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      <SalesTeamFormModal
        open={salesTeamModalOpen}
        onClose={() => {
          setSalesTeamModalOpen(false);
          setSalesTeamInitial(null);
        }}
        initial={salesTeamInitial}
        onSave={saveSalesTeam}
        saving={salesTeamSaving}
      />

      <SalesTeamAreaFormModal
        open={salesTeamAreaModalOpen}
        onClose={() => {
          setSalesTeamAreaModalOpen(false);
          setSalesTeamAreaInitial(null);
        }}
        initial={salesTeamAreaInitial}
        salesTeams={salesTeamLookupOptions}
        branches={branchLookupOptions}
        onSave={saveSalesTeamArea}
        saving={salesTeamAreaSaving}
      />

      <DetailModal
        open={Boolean(salesTeamDetail)}
        onClose={() => setSalesTeamDetail(null)}
        title={salesTeamDetail?.sales_team_name || "-"}
        badge={salesTeamDetail?.disabled === 0 ? "Aktif" : "Nonaktif"}
        rows={[
          { label: "ID", value: salesTeamDetail ? `#${salesTeamDetail.id}` : "-" },
          { label: "Document Name", value: salesTeamDetail?.name || "-" },
          { label: "Sales Team Name", value: salesTeamDetail?.sales_team_name || "-" },
          { label: "Owner", value: salesTeamDetail?.owner || "-" },
        ]}
        notes={salesTeamDetail?.notes}
        createdAt={salesTeamDetail?.created_at}
        updatedAt={salesTeamDetail?.updated_at}
        createdBy={salesTeamDetail?.created_by}
        updatedBy={salesTeamDetail?.updated_by}
        owner={salesTeamDetail?.owner}
        canEdit={canManageSalesTeams}
        canDelete={canManageSalesTeams}
        onEdit={() => {
          if (!salesTeamDetail) return;
          const current = salesTeamDetail;
          setSalesTeamDetail(null);
          setSalesTeamInitial(current);
          setSalesTeamModalOpen(true);
        }}
        onDelete={() => {
          if (!salesTeamDetail) return;
          void deleteSalesTeam(salesTeamDetail);
        }}
      />

      <DetailModal
        open={Boolean(salesTeamAreaDetail)}
        onClose={() => setSalesTeamAreaDetail(null)}
        title={salesTeamAreaDetail?.sales_team_name || "-"}
        badge="Sales Team Area"
        rows={[
          { label: "ID", value: salesTeamAreaDetail ? `#${salesTeamAreaDetail.id}` : "-" },
          { label: "Sales Team", value: salesTeamAreaDetail?.sales_team_name || "-" },
          { label: "Branch", value: salesTeamAreaDetail?.branch_label || "-" },
          { label: "Owner", value: salesTeamAreaDetail?.owner || "-" },
        ]}
        notes={salesTeamAreaDetail?.notes}
        createdAt={salesTeamAreaDetail?.created_at}
        updatedAt={salesTeamAreaDetail?.updated_at}
        createdBy={salesTeamAreaDetail?.created_by}
        updatedBy={salesTeamAreaDetail?.updated_by}
        owner={salesTeamAreaDetail?.owner}
        canEdit={canManageSalesTeamAreas}
        canDelete={canManageSalesTeamAreas}
        onEdit={() => {
          if (!salesTeamAreaDetail) return;
          const current = salesTeamAreaDetail;
          setSalesTeamAreaDetail(null);
          setSalesTeamAreaInitial(current);
          setSalesTeamAreaModalOpen(true);
        }}
        onDelete={() => {
          if (!salesTeamAreaDetail) return;
          void deleteSalesTeamArea(salesTeamAreaDetail);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        variant="danger"
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={cancelDelete}
      />
    </div>
  );
}
