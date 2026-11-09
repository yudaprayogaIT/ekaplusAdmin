"use client";

import { FormEvent, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import Pagination from "@/components/ui/Pagination";
import ActionResultModal from "@/components/ui/ActionResultModal";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { listLoyaltyResource, saveLoyaltyResource } from "@/services/loyaltyService";
import type { LoyaltyRow } from "@/types/loyalty";
import { display, EmptyState, ErrorState, Field, fieldClass, formatDate, LoadingState, Panel, primaryButton, rowId, secondaryButton, StatusBadge } from "./LoyaltyUI";

type Config = {
  endpoint: string;
  addLabel: string;
  columns: { label: string; value: (row: LoyaltyRow) => ReactNode }[];
  fields: { key: string; label: string; type?: "text" | "number" | "date" | "textarea" | "select" | "checkbox"; options?: string[]; required?: boolean; show?: (row: LoyaltyRow) => boolean; wide?: boolean }[];
};

function ResourceManager({ config, extraFilters = [] }: { config: Config; extraFilters?: unknown[] }) {
  const { token, isAuthenticated } = useAuth();
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<LoyaltyRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const perPage = 20;
  const filtersKey = JSON.stringify(extraFilters);
  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true); setError("");
    try {
      const response = await listLoyaltyResource(config.endpoint, token, { page, perPage, search, filters: JSON.parse(filtersKey) as unknown[], orderBy: [["created_at", "desc"]] });
      setRows(response.rows); setTotal(response.total);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, [config.endpoint, filtersKey, isAuthenticated, page, search, token]);
  useEffect(() => { const id = window.setTimeout(() => void load(), 250); return () => window.clearTimeout(id); }, [load]);

  const save = async (form: LoyaltyRow) => {
    if (!token) return;
    setSaving(true);
    try {
      const id = editing ? rowId(editing) : undefined;
      const response = await saveLoyaltyResource(config.endpoint, token, form, id || undefined);
      setEditing(null); setResult({ type: "success", message: response.message }); await load();
    } catch (e) { setResult({ type: "error", message: e instanceof Error ? e.message : String(e) }); }
    finally { setSaving(false); }
  };
  return <div className="space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <input className={`${fieldClass} sm:max-w-md`} value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cari data..." />
      <button className={primaryButton} onClick={() => setEditing({})}><FaPlus />{config.addLabel}</button>
    </div>
    {loading ? <LoadingState /> : error ? <ErrorState message={error} retry={() => void load()} /> : <Panel>
      {rows.length === 0 ? <EmptyState title="Belum ada data" /> : <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-sm"><thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr>{config.columns.map(c => <th key={c.label} className="px-4 py-3">{c.label}</th>)}<th className="px-4 py-3">Aksi</th></tr></thead><tbody className="divide-y">{rows.map(row => <tr key={rowId(row)} className="hover:bg-gray-50">{config.columns.map(c => <td key={c.label} className="px-4 py-4">{c.value(row)}</td>)}<td className="px-4 py-4"><button className={secondaryButton} onClick={() => setEditing(row)}><FaEdit />Edit</button></td></tr>)}</tbody></table></div>}
      {total > perPage && <div className="border-t px-5"><Pagination currentPage={page} totalPages={Math.ceil(total / perPage)} onPageChange={setPage} totalItems={total} itemsPerPage={perPage}/></div>}
    </Panel>}
    {editing && <ResourceModal config={config} initial={editing} saving={saving} close={() => !saving && setEditing(null)} save={save} />}
    <ActionResultModal isOpen={Boolean(result)} type={result?.type} title={result?.type === "success" ? "Berhasil" : "Gagal"} message={result?.message || ""} onClose={() => setResult(null)} />
  </div>;
}

function ResourceModal({ config, initial, saving, close, save }: { config: Config; initial: LoyaltyRow; saving: boolean; close: () => void; save: (row: LoyaltyRow) => void }) {
  const [form, setForm] = useState<LoyaltyRow>({ ...initial });
  const update = (key: string, value: unknown) => setForm(current => ({ ...current, [key]: value }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form }; delete payload.id;
    if (payload.expiry_mode !== "DURATION") delete payload.expiry_months;
    if (payload.date_from && payload.date_to && String(payload.date_from) > String(payload.date_to)) return;
    save(payload);
  };
  const invalidDates = Boolean(form.date_from && form.date_to && String(form.date_from) > String(form.date_to));
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4"><h3 className="text-lg font-bold">{rowId(initial) ? "Edit" : "Tambah"} data</h3><button type="button" onClick={close}><FaTimes/></button></div><div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
    {config.fields.filter(f => !f.show || f.show(form)).map(f => <Field key={f.key} label={f.label} wide={f.wide}>{f.type === "textarea" ? <textarea className={`${fieldClass} min-h-24`} value={String(form[f.key] ?? "")} onChange={e => update(f.key, e.target.value)} required={f.required}/> : f.type === "select" ? <select className={fieldClass} value={String(form[f.key] ?? "")} onChange={e => update(f.key, e.target.value)} required={f.required}><option value="">Pilih...</option>{f.options?.map(o => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}</select> : f.type === "checkbox" ? <input type="checkbox" className="h-5 w-5 accent-red-600" checked={Boolean(form[f.key])} onChange={e => update(f.key, e.target.checked ? 1 : 0)}/> : <input className={fieldClass} type={f.type || "text"} value={String(form[f.key] ?? "")} min={f.type === "number" ? (f.key === "standard_divider" ? 0.000001 : 0) : undefined} onChange={e => update(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} required={f.required}/>}</Field>)}
    {invalidDates && <p className="sm:col-span-2 text-sm font-semibold text-red-600">Tanggal mulai tidak boleh melebihi tanggal selesai.</p>}
  </div><div className="sticky bottom-0 flex justify-end gap-2 border-t bg-white px-5 py-4"><button type="button" className={secondaryButton} onClick={close}>Batal</button><button disabled={saving || invalidDates} className={primaryButton}>{saving ? "Menyimpan..." : "Simpan"}</button></div></form></div>;
}

const periodConfig: Config = {
  endpoint: API_CONFIG.ENDPOINTS.LOYALTY_PERIOD, addLabel: "Tambah Periode",
  columns: [
    { label: "Nama periode", value: r => <span className="font-semibold">{display(r.name ?? r.period_name)}</span> },
    { label: "Mulai", value: r => formatDate(r.date_from ?? r.start_date) }, { label: "Selesai", value: r => formatDate(r.date_to ?? r.end_date) },
    { label: "Rule", value: r => display(r.rule_name ?? r.rule_id) }, { label: "Expiry", value: r => display(r.expiry_mode) },
    { label: "Point Ready", value: r => display(r.point_ready) }, { label: "Status", value: r => <StatusBadge status={String(r.status ?? "-")} /> },
  ],
  fields: [
    { key: "name", label: "Nama periode", required: true }, { key: "rule_id", label: "Rule ID", type: "number", required: true },
    { key: "date_from", label: "Tanggal mulai", type: "date", required: true }, { key: "date_to", label: "Tanggal selesai", type: "date", required: true },
    { key: "expiry_mode", label: "Expiry Mode", type: "select", options: ["NEVER", "DURATION", "PERIOD_END"], required: true },
    { key: "expiry_months", label: "Durasi (bulan)", type: "number", required: true, show: r => r.expiry_mode === "DURATION" },
    { key: "point_ready", label: "Point Ready", type: "select", options: ["IMMEDIATE", "AFTER_PERIOD_END"], required: true },
    { key: "status", label: "Status", type: "select", options: ["OPEN", "CLOSED", "INACTIVE"], required: true },
  ],
};

const ruleConfig: Config = {
  endpoint: API_CONFIG.ENDPOINTS.LOYALTY_RULE, addLabel: "Tambah Aturan",
  columns: [
    { label: "Kode", value: r => <span className="font-semibold">{display(r.code ?? r.name)}</span> }, { label: "Nama", value: r => display(r.rule_name ?? r.name) },
    { label: "Pembulatan", value: r => display(r.rounding_method ?? r.calculation_method) }, { label: "Jumlah detail", value: r => display(r.detail_count ?? r.details_count ?? 0) },
    { label: "Status", value: r => <StatusBadge status={String(r.status ?? "-")} /> },
  ],
  fields: [
    { key: "code", label: "Kode Rule", required: true }, { key: "rule_name", label: "Nama Rule", required: true },
    { key: "rounding_method", label: "Metode pembulatan", type: "select", options: ["FLOOR", "ROUND", "CEIL"], required: true },
    { key: "status", label: "Status", type: "select", options: ["ACTIVE", "INACTIVE"], required: true },
    { key: "description", label: "Keterangan", type: "textarea", wide: true },
  ],
};

export function PeriodManager() { return <ResourceManager config={periodConfig}/>; }

const ruleDetailConfig: Config = {
  endpoint: API_CONFIG.ENDPOINTS.LOYALTY_RULE_DETAIL,
  addLabel: "Tambah Divider",
  columns: [
    { label: "Rule ID", value: r => display(r.rule_id ?? r.rule) },
    { label: "Sales Account", value: r => <span className="font-semibold">{display(r.sales_account ?? r.sales_account_name)}</span> },
    { label: "Standard Divider", value: r => new Intl.NumberFormat("id-ID").format(Number(r.standard_divider ?? r.divider ?? 0)) },
  ],
  fields: [
    { key: "rule_id", label: "Rule ID", type: "number", required: true },
    { key: "sales_account", label: "Sales Account", required: true },
    { key: "standard_divider", label: "Standard Divider (> 0)", type: "number", required: true },
  ],
};

export function RuleManager() {
  const [ruleId, setRuleId] = useState("");
  return <div className="space-y-6"><ResourceManager config={ruleConfig}/><div><h2 className="text-lg font-bold text-gray-900">Detail Sales Account</h2><p className="mt-1 text-sm text-gray-500">Masukkan Rule ID untuk menampilkan serta mengelola divider rule tersebut.</p></div><input className={`${fieldClass} max-w-sm`} type="number" min="1" value={ruleId} onChange={e => setRuleId(e.target.value)} placeholder="Rule ID..."/>{ruleId ? <ResourceManager key={ruleId} config={ruleDetailConfig} extraFilters={[["rule_id", "=", Number(ruleId)]]}/> : <Panel><EmptyState title="Pilih Rule ID" message="Detail rule disimpan melalui resource loyalty_rule_detail."/></Panel>}</div>;
}

const masterConfigs: Record<string, Config> = {
  types: { endpoint: API_CONFIG.ENDPOINTS.LOYALTY_REWARD_TYPE, addLabel: "Tambah Tipe", columns: [{ label: "Nama", value: r => <b>{display(r.type_name ?? r.name)}</b> }, { label: "Kode", value: r => display(r.code) }, { label: "Fulfillment", value: r => display(r.fulfillment_type) }, { label: "Conversion", value: r => display(r.default_conversion_type) }, { label: "Status", value: r => <StatusBadge status={r.disabled ? "INACTIVE" : "ACTIVE"}/> }], fields: [{ key: "type_name", label: "Nama tipe", required: true }, { key: "code", label: "Kode", required: true }, { key: "description", label: "Deskripsi", type: "textarea", wide: true }, { key: "fulfillment_type", label: "Fulfillment", type: "select", options: ["VOUCHER_CODE", "PHYSICAL", "POS_DISCOUNT", "MANUAL", "EXTERNAL"], required: true }, { key: "default_conversion_type", label: "Default Conversion", type: "select", options: ["FIXED", "VALUE_BASED", "PER_POINT"] }, { key: "default_requires_approval", label: "Requires Approval", type: "checkbox" }, { key: "icon", label: "Icon" }, { key: "sort_order", label: "Sort Order", type: "number" }, { key: "disabled", label: "Disabled", type: "checkbox" }] },
  categories: { endpoint: API_CONFIG.ENDPOINTS.LOYALTY_REWARD_CATEGORY, addLabel: "Tambah Kategori", columns: [{ label: "Nama", value: r => <b>{display(r.category_name ?? r.name)}</b> }, { label: "Slug", value: r => display(r.slug) }, { label: "Induk", value: r => display(r.parent_category) }, { label: "Status", value: r => <StatusBadge status={r.disabled ? "INACTIVE" : "ACTIVE"}/> }], fields: [{ key: "category_name", label: "Nama kategori", required: true }, { key: "slug", label: "Slug", required: true }, { key: "description", label: "Deskripsi", type: "textarea", wide: true }, { key: "image", label: "Image / File ID" }, { key: "parent_category", label: "Parent Category ID", type: "number" }, { key: "sort_order", label: "Sort Order", type: "number" }, { key: "disabled", label: "Disabled", type: "checkbox" }] },
  partners: { endpoint: API_CONFIG.ENDPOINTS.LOYALTY_REWARD_PARTNER, addLabel: "Tambah Partner", columns: [{ label: "Nama", value: r => <b>{display(r.partner_name ?? r.name)}</b> }, { label: "Kode", value: r => display(r.code) }, { label: "Kontak", value: r => display(r.contact) }, { label: "Status", value: r => <StatusBadge status={r.disabled ? "INACTIVE" : "ACTIVE"}/> }], fields: [{ key: "partner_name", label: "Nama partner", required: true }, { key: "code", label: "Kode", required: true }, { key: "description", label: "Deskripsi", type: "textarea", wide: true }, { key: "logo", label: "Logo / File ID" }, { key: "contact", label: "Kontak" }, { key: "terms", label: "Terms", type: "textarea", wide: true }, { key: "disabled", label: "Disabled", type: "checkbox" }] },
};

export function MasterManager() {
  const [tab, setTab] = useState("types");
  const config = useMemo(() => masterConfigs[tab], [tab]);
  return <div className="space-y-4"><div className="flex gap-1 rounded-xl border bg-white p-1.5">{[["types", "Tipe Reward"], ["categories", "Kategori"], ["partners", "Partner"]].map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === key ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{label}</button>)}</div><ResourceManager key={tab} config={config}/></div>;
}
