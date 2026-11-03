"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import EntityTable, {
  type EntityTableColumn,
} from "@/components/entity-management/EntityTable";
import ActionResultModal from "@/components/ui/ActionResultModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getApiUrl,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

type RefType = "nbid" | "gpid" | "gcid" | "bcid";

type MemberOfListRow = {
  id: number;
  name?: string | null;
  user?: number | string | { id?: number | string; full_name?: string } | null;
  user_id?: number | string | null;
  ref_type?: string | null;
  ref_id?: number | string | null;
  created_at?: string | null;
};

type MemberOfDetail = MemberOfListRow & {
  is_owner?: number | boolean | null;
  is_sharing?: number | boolean | null;
  share_from?: number | string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type HierarchyBranchCustomer = {
  id: number;
  name?: string | null;
  _relations?: {
    branch?: { city?: string | null } | null;
    gcid?: { gc_name?: string | null; name?: string | null } | null;
  } | null;
};

type PolicyHierarchyResponse = {
  data?: { data?: { bcs?: HierarchyBranchCustomer[] | null } | null } | null;
};

type LookupOption = {
  id: number;
  label: string;
  description?: string;
};

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_count?: number;
  };
};

const PAGE_SIZE = 20;
const REF_CONFIG: Record<
  RefType,
  { label: string; endpoint: string; nameFields: string[] }
> = {
  nbid: {
    label: "National Brand",
    endpoint: API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
    nameFields: ["nb_name", "name"],
  },
  gpid: {
    label: "Group Parent",
    endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
    nameFields: ["gp_name", "name"],
  },
  gcid: {
    label: "Group Customer",
    endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
    nameFields: ["gc_name", "name"],
  },
  bcid: {
    label: "Branch Customer",
    endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
    nameFields: ["name"],
  },
};

function toId(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (value && typeof value === "object" && "id" in value) {
    return toId((value as { id?: unknown }).id);
  }
  return null;
}

function textValue(value: unknown): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

function firstText(row: Record<string, unknown>, fields: string[]): string {
  for (const field of fields) {
    const value = textValue(row[field]).trim();
    if (value) return value;
  }
  return "";
}

function serverMessage(json: unknown, fallback: string): string {
  if (json && typeof json === "object" && "message" in json) {
    const message = (json as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function refLabel(value?: string | null): string {
  return value && value in REF_CONFIG
    ? REF_CONFIG[value as RefType].label
    : value || "-";
}

function memberUserName(row?: MemberOfListRow | null): string {
  if (row?.user && typeof row.user === "object") {
    const fullName = row.user.full_name?.trim();
    if (fullName) return fullName;
  }
  const id = toId(row?.user_id) ?? toId(row?.user);
  return id !== null ? `User #${id}` : "-";
}

async function loadUsers(token: string): Promise<LookupOption[]> {
  const endpoints = [API_CONFIG.ENDPOINTS.USERS, API_CONFIG.ENDPOINTS.USER];
  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      const rows = await fetchAllQueryRows<Record<string, unknown>>({
        endpoint,
        spec: {
          fields: ["*"],
          order_by: [["full_name", "asc"]],
        },
        token,
        errorMessage: "Gagal memuat daftar user",
      });

      const options = rows
        .map((row): LookupOption | null => {
          const id = toId(row.id ?? row.ID);
          if (id === null) return null;
          const fullName = firstText(row, ["full_name"]);
          const combinedName = [row.first_name, row.last_name]
            .map(textValue)
            .filter(Boolean)
            .join(" ");
          const username = firstText(row, ["username"]);
          const email = firstText(row, ["email"]);
          return {
            id,
            label: fullName || combinedName || username || email || `User #${id}`,
            description: [username, email].filter(Boolean).join(" • "),
          };
        })
        .filter((row): row is LookupOption => row !== null);

      if (options.length > 0 || rows.length === 0) return options;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gagal memuat daftar user");
}

async function loadReferences(
  refType: RefType,
  token: string,
): Promise<LookupOption[]> {
  const config = REF_CONFIG[refType];
  const fields =
    refType === "bcid"
      ? ["id", "name", "gcid.company_name"]
      : ["id", ...config.nameFields];
  const rows = await fetchAllQueryRows<Record<string, unknown>>({
    endpoint: config.endpoint,
    spec: {
      fields,
      order_by: [[config.nameFields[0], "asc"]],
    },
    token,
    errorMessage: `Gagal memuat ${config.label}`,
  });

  return rows
    .map((row): LookupOption | null => {
      const id = toId(row.id);
      if (id === null) return null;
      const relation =
        row.gcid && typeof row.gcid === "object"
          ? (row.gcid as Record<string, unknown>)
          : null;
      const companyName =
        textValue(relation?.company_name).trim() ||
        textValue(row["gcid.company_name"]).trim();
      const resourceName = firstText(row, config.nameFields);

      return {
        id,
        label:
          refType === "bcid" && companyName
            ? companyName
            : resourceName || `${config.label} #${id}`,
        description:
          refType === "bcid" && companyName && resourceName
            ? resourceName
            : undefined,
      };
    })
    .filter((row): row is LookupOption => row !== null);
}

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  loading,
}: {
  label: string;
  placeholder: string;
  options: LookupOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  loading?: boolean;
}) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value);
  const selectedLabel = selectedOption?.label || "";

  useEffect(() => {
    if (!open) setQuery(selectedLabel);
  }, [open, selectedLabel]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) =>
      `${option.label} ${option.description || ""} ${option.id}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [options, query]);

  function selectOption(option: LookupOption) {
    onChange(option.id);
    setQuery(option.label);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onFocus={() => {
            setOpen(true);
            if (value !== null) setQuery("");
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            if (value !== null) onChange(null);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              setQuery(selectedLabel);
            }
            if (event.key === "Enter" && open && filtered[0]) {
              event.preventDefault();
              selectOption(filtered[0]);
            }
          }}
          disabled={loading}
          placeholder={loading ? "Memuat data..." : placeholder}
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-autocomplete="list"
          className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-10 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-gray-50"
        />
        {loading ? (
          <FaSpinner className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-red-500" />
        ) : value !== null ? (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setQuery("");
              setOpen(true);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label={`Hapus pilihan ${label}`}
          >
            <HiXMark className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {open && !loading ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl"
        >
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={option.id === value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-red-50 ${
                  option.id === value ? "bg-red-50" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-800">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="mt-0.5 block truncate text-xs text-gray-500">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-[11px] text-gray-500">
                  ID {option.id}
                </span>
              </button>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-sm text-gray-500">
              Tidak ada data yang cocok.
            </div>
          )}
        </div>
      ) : null}

      {!loading && options.length === 0 ? (
        <span className="mt-1.5 block text-xs text-amber-600">
          Data pilihan tidak tersedia.
        </span>
      ) : null}
    </div>
  );
}

function AddMemberOfModal({
  open,
  token,
  onClose,
  onCreated,
}: {
  open: boolean;
  token: string;
  onClose: () => void;
  onCreated: (message: string) => void;
}) {
  const [userId, setUserId] = useState<number | null>(null);
  const [refType, setRefType] = useState<RefType>("gpid");
  const [refId, setRefId] = useState<number | null>(null);
  const [users, setUsers] = useState<LookupOption[]>([]);
  const [references, setReferences] = useState<LookupOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingReferences, setLoadingReferences] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setUserId(null);
    setRefType("gpid");
    setRefId(null);
    setError(null);
    setLoadingUsers(true);
    void loadUsers(token)
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Gagal memuat user"),
      )
      .finally(() => setLoadingUsers(false));
  }, [open, token]);

  useEffect(() => {
    if (!open) return;
    setRefId(null);
    setLoadingReferences(true);
    void loadReferences(refType, token)
      .then(setReferences)
      .catch((err) => {
        setReferences([]);
        setError(
          err instanceof Error ? err.message : "Gagal memuat referensi customer",
        );
      })
      .finally(() => setLoadingReferences(false));
  }, [open, refType, token]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (userId === null || refId === null) {
      setError("User dan referensi customer wajib dipilih.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.MEMBER_OF),
        {
          method: "POST",
          body: JSON.stringify({ user: userId, ref_type: refType, ref_id: refId }),
        },
        token,
      );
      const json = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          serverMessage(json, `Gagal menambahkan member (${response.status})`),
        );
      }

      onCreated(serverMessage(json, "Relasi member berhasil ditambahkan."));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambahkan member");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Tambah Member Of</h2>
                <p className="mt-1 text-sm text-red-100">
                  Berikan user akses ke data customer yang dipilih.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl p-2 hover:bg-white/15 disabled:opacity-50"
              >
                <HiXMark className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5 p-6">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <SearchableSelect
                label="User"
                placeholder="Pilih user"
                options={users}
                value={userId}
                onChange={setUserId}
                loading={loadingUsers}
              />

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Tipe Referensi
                </span>
                <select
                  value={refType}
                  onChange={(event) => setRefType(event.target.value as RefType)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                >
                  {Object.entries(REF_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label} ({value})
                    </option>
                  ))}
                </select>
              </label>

              <SearchableSelect
                key={refType}
                label={REF_CONFIG[refType].label}
                placeholder={`Pilih ${REF_CONFIG[refType].label}`}
                options={references}
                value={refId}
                onChange={setRefId}
                loading={loadingReferences}
              />

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">
                Data yang dikirim: user ID, <strong>{refType}</strong>, dan ID
                {" "}{REF_CONFIG[refType].label}. Relasi ini menentukan data customer
                yang dapat dilihat user di aplikasi EKA+.
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || loadingUsers || loadingReferences}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <FaSpinner className="h-4 w-4 animate-spin" /> : <FaPlus className="h-4 w-4" />}
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function MemberOfDetailModal({
  open,
  detail,
  userName,
  referenceName,
  hierarchy,
  hierarchyError,
  loading,
  onClose,
}: {
  open: boolean;
  detail: MemberOfDetail | null;
  userName: string;
  referenceName: string;
  hierarchy: HierarchyBranchCustomer[];
  hierarchyError: string | null;
  loading: boolean;
  onClose: () => void;
}) {
  const userId = toId(detail?.user_id) ?? toId(detail?.user);

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-300">
                  Detail Member Of
                </p>
                <h2 className="mt-1 text-xl font-bold">
                  {userName || memberUserName(detail)}
                </h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-white/15">
                <HiXMark className="h-6 w-6" />
              </button>
            </div>

            <div className="overflow-y-auto p-5">
              {loading ? (
                <div className="flex min-h-48 items-center justify-center gap-3 text-gray-500">
                  <FaSpinner className="h-5 w-5 animate-spin text-red-500" />
                  Memuat detail...
                </div>
              ) : detail ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-purple-600">
                        <FaUser /> User
                      </div>
                      <p className="mt-2 font-bold text-gray-900">{userName || `User #${userId ?? "-"}`}</p>
                      <p className="mt-1 text-xs text-gray-500">ID: {userId ?? "-"}</p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                        <FaBuilding /> {refLabel(detail.ref_type)}
                      </div>
                      <p className="mt-2 font-bold text-gray-900">
                        {referenceName || `${refLabel(detail.ref_type)} #${detail.ref_id ?? "-"}`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">ref_id: {detail.ref_id ?? "-"}</p>
                    </div>
                  </div>

                  <dl className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200">
                    {[
                      ["Member ID", detail.id],
                      ["Ref Type", detail.ref_type || "-"],
                      ["Owner", detail.is_owner ? "Ya" : "Tidak"],
                      ["Sharing", detail.is_sharing ? "Ya" : "Tidak"],
                      ["Share From", detail.share_from ?? "-"],
                      ["Status", detail.status || "-"],
                      ["Dibuat", formatDate(detail.created_at)],
                      ["Diperbarui", formatDate(detail.updated_at)],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="flex justify-between gap-4 px-4 py-3 text-sm">
                        <dt className="text-gray-500">{label}</dt>
                        <dd className="text-right font-semibold text-gray-800">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>

                  <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          Customer Dalam Cakupan Akses
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Daftar Branch Customer dalam hierarchy {refLabel(detail.ref_type)} yang dipilih.
                        </p>
                      </div>
                      <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
                        {hierarchy.length} customer
                      </span>
                    </div>

                    {hierarchyError ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {hierarchyError}
                      </div>
                    ) : hierarchy.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {hierarchy.map((branch) => {
                          const gcName =
                            branch._relations?.gcid?.gc_name?.trim() ||
                            branch._relations?.gcid?.name?.trim() ||
                            "-";
                          const city = branch._relations?.branch?.city?.trim() || "-";

                          return (
                            <div
                              key={branch.id}
                              className="rounded-xl border border-indigo-100 bg-white p-3"
                            >
                              <p className="text-sm font-bold text-slate-900">
                                {gcName} - {city}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-indigo-700">
                                {branch.name || `Branch Customer #${branch.id}`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-indigo-200 bg-white/70 p-3 text-sm text-slate-500">
                        Tidak ada Branch Customer dalam cakupan akses ini.
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-red-600">Detail tidak dapat dimuat.</p>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export default function MemberOfPage() {
  const { token, isAuthenticated } = useAuth();
  const [rows, setRows] = useState<MemberOfListRow[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [total, setTotal] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<MemberOfDetail | null>(null);
  const [detailUserName, setDetailUserName] = useState("");
  const [detailReferenceName, setDetailReferenceName] = useState("");
  const [detailHierarchy, setDetailHierarchy] = useState<
    HierarchyBranchCustomer[]
  >([]);
  const [detailHierarchyError, setDetailHierarchyError] = useState<
    string | null
  >(null);
  const [result, setResult] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadPage = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.MEMBER_OF, {
          fields: ["*", "user.full_name"],
          page,
          limit: PAGE_SIZE,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          order_by: [["id", "desc"]],
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const json = (await response.json().catch(() => null)) as ApiEnvelope<MemberOfListRow[]> | null;
      if (!response.ok) {
        throw new Error(serverMessage(json, `Gagal memuat member_of (${response.status})`));
      }
      const nextRows = Array.isArray(json?.data) ? json.data : [];
      const perPage = Number(json?.meta?.per_page || PAGE_SIZE);
      const nextTotal = Number(json?.meta?.total || json?.meta?.total_count || 0);
      setRows(nextRows);
      setHasNext(nextTotal > 0 ? page * perPage < nextTotal : nextRows.length >= perPage);
      setTotal(nextTotal > 0 ? nextTotal : null);
    } catch (err) {
      setRows([]);
      setHasNext(false);
      setError(err instanceof Error ? err.message : "Gagal memuat member_of");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, isAuthenticated, page, token]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const openDetail = useCallback(
    async (row: MemberOfListRow) => {
      if (!token) return;
      setDetailOpen(true);
      setDetailLoading(true);
      setDetail({ ...row });
      setDetailUserName(memberUserName(row));
      setDetailReferenceName("");
      setDetailHierarchy([]);
      setDetailHierarchyError(null);
      try {
        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.MEMBER_OF, row.id),
          { method: "GET", cache: "no-store" },
          token,
        );
        const json = (await response.json().catch(() => null)) as ApiEnvelope<MemberOfDetail> | null;
        if (!response.ok || !json?.data) {
          throw new Error(serverMessage(json, "Gagal memuat detail member"));
        }
        const nextDetail = json.data;
        setDetail(nextDetail);

        const userId = toId(nextDetail.user_id) ?? toId(nextDetail.user);
        const type = nextDetail.ref_type as RefType | undefined;
        const referenceId = toId(nextDetail.ref_id);
        const lookups: Promise<void>[] = [];

        if (userId !== null) {
          lookups.push(
            loadUsers(token).then((options) => {
              const matched = options.find((option) => option.id === userId);
              if (matched) setDetailUserName(matched.label);
            }).catch(() => undefined),
          );
        }
        if (type && type in REF_CONFIG && referenceId !== null) {
          lookups.push(
            loadReferences(type, token).then((options) => {
              setDetailReferenceName(options.find((option) => option.id === referenceId)?.label || "");
            }).catch(() => undefined),
          );
          lookups.push(
            apiFetch(
              getApiUrl(
                `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`,
              ),
              {
                method: "POST",
                cache: "no-store",
                body: JSON.stringify({
                  level: type,
                  value: referenceId,
                  format: "full",
                  entities: ["bcs"],
                  query: {
                    bcs: {
                      fields: ["id", "name", "branch.city", "gcid"],
                    },
                    gcs: { fields: ["id", "gc_name"] },
                    gps: { fields: ["id", "gp_name"] },
                    nb: { fields: ["id", "nb_name"] },
                  },
                }),
              },
              token,
            )
              .then(async (hierarchyResponse) => {
                if (!hierarchyResponse.ok) {
                  throw new Error(
                    `Gagal memuat hierarchy customer (${hierarchyResponse.status})`,
                  );
                }
                const hierarchyJson =
                  (await hierarchyResponse.json()) as PolicyHierarchyResponse;
                const hierarchyRows = hierarchyJson.data?.data?.bcs;
                setDetailHierarchy(
                  Array.isArray(hierarchyRows) ? hierarchyRows : [],
                );
              })
              .catch((hierarchyError) => {
                setDetailHierarchyError(
                  hierarchyError instanceof Error
                    ? hierarchyError.message
                    : "Gagal memuat hierarchy customer",
                );
              }),
          );
        }
        await Promise.all(lookups);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat detail member");
      } finally {
        setDetailLoading(false);
      }
    },
    [token],
  );

  const columns = useMemo<EntityTableColumn<MemberOfListRow>[]>(
    () => [
      {
        key: "id",
        header: "ID",
        className: "w-24",
        render: (row) => <span className="font-mono text-sm text-gray-500">#{row.id}</span>,
      },
      {
        key: "user",
        header: "User",
        render: (row) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <FaUser className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {memberUserName(row)}
              </p>
              <p className="text-xs text-gray-500">
                User ID: {toId(row.user_id) ?? toId(row.user) ?? "-"}
              </p>
            </div>
          </div>
        ),
      },
      {
        key: "reference",
        header: "Akses Customer",
        render: (row) => (
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {refLabel(row.ref_type)}
            </p>
            <p className="text-xs text-gray-500">ref_id: {row.ref_id ?? "-"}</p>
          </div>
        ),
      },
      {
        key: "action",
        header: "",
        className: "w-12",
        render: () => <FaChevronRight className="h-3.5 w-3.5 text-gray-400" />,
      },
    ],
    [],
  );

  return (
    <div>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Member Of
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Atur akses user ke data customer di aplikasi EKA+.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
          >
            <FaPlus className="h-4 w-4" />
            Tambah Member
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <FaSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama user..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm transition focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
            </div>
            <span className="whitespace-nowrap rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-600">
              {total !== null
                ? `${total} relasi`
                : `${rows.length} data di halaman ini`}
            </span>
          </div>
        </div>

        {error ? (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => void loadPage()} className="font-bold hover:underline">
              Coba lagi
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
            <FaSpinner className="mr-3 h-5 w-5 animate-spin text-red-500" />
            Memuat member_of...
          </div>
        ) : rows.length > 0 ? (
          <EntityTable
            columns={columns}
            rows={rows}
            getRowKey={(row) => row.id}
            onRowClick={(row) => void openDetail(row)}
            footer={
              <>
                <span>Halaman {page}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Halaman sebelumnya"
                  >
                    <FaChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!hasNext}
                    className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Halaman berikutnya"
                  >
                    <FaChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </>
            }
          />
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
              <FaUsers className="h-7 w-7" />
            </div>
            <h2 className="font-bold text-gray-800">Belum ada data member</h2>
            <p className="mt-1 max-w-sm text-sm text-gray-500">
              Tambahkan relasi untuk memberikan user akses ke customer tertentu.
            </p>
          </div>
        )}
      </div>

      {token ? (
        <AddMemberOfModal
          open={addOpen}
          token={token}
          onClose={() => setAddOpen(false)}
          onCreated={(message) => {
            setAddOpen(false);
            setResult({ open: true, message });
            setPage(1);
            void loadPage();
          }}
        />
      ) : null}

      <MemberOfDetailModal
        open={detailOpen}
        detail={detail}
        userName={detailUserName}
        referenceName={detailReferenceName}
        hierarchy={detailHierarchy}
        hierarchyError={detailHierarchyError}
        loading={detailLoading}
        onClose={() => setDetailOpen(false)}
      />

      <ActionResultModal
        isOpen={result.open}
        title="Berhasil"
        message={result.message}
        description="User sekarang terhubung dengan data customer yang dipilih."
        onClose={() => setResult({ open: false, message: "" })}
      />
    </div>
  );
}
