"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaCalculator, FaGift, FaSearch } from "react-icons/fa";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { getLoyaltyBalance, listLoyaltyResource } from "@/services/loyaltyService";
import type { LoyaltyBalance, LoyaltyRow } from "@/types/loyalty";
import { display, EmptyState, ErrorState, fieldClass, formatDate, formatPoint, KpiCard, LoadingState, Panel, primaryButton, StatusBadge } from "./LoyaltyUI";

export function LoyaltyDashboard() {
  const { token, isAuthenticated } = useAuth();
  const [data, setData] = useState<{ batch?: LoyaltyRow; recent: LoyaltyRow[]; pending: number; calculations: LoyaltyRow[] } | null>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true); setError("");
    try {
      const [batches, recent, pending, calculations] = await Promise.all([
        listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION_BATCH, token, { perPage: 1, orderBy: [["created_at", "desc"]] }),
        listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_REDEMPTION, token, { perPage: 5, orderBy: [["created_at", "desc"]] }),
        listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_REDEMPTION, token, { perPage: 1, filters: [["status", "=", "PENDING"]] }),
        listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION, token, { perPage: 5, orderBy: [["created_at", "desc"]] }),
      ]);
      setData({ batch: batches.rows[0], recent: recent.rows, pending: pending.total, calculations: calculations.rows });
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, [isAuthenticated, token]);
  useEffect(() => void load(), [load]);
  if (loading) return <LoadingState/>; if (error) return <ErrorState message={error} retry={() => void load()}/>; if (!data) return null;
  const b = data.batch;
  return <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3"><KpiCard label="GP dengan saldo" value="—" icon="users" tone="blue"/><KpiCard label="Total poin diperoleh" value="—"/><KpiCard label="Poin tersedia" value="—" tone="green"/><KpiCard label="Poin digunakan" value="—" tone="purple"/><KpiCard label="Poin reserved" value="—" tone="amber"/><KpiCard label="Redemption pending" value={formatPoint(data.pending)} icon="reward" tone="amber"/></div>
    <p className="text-xs text-gray-500">Metrik poin global ditampilkan sebagai “—” karena endpoint agregasi global tidak tersedia; dashboard tidak mengestimasi dari satu halaman data.</p>
    <div className="grid gap-6 xl:grid-cols-2"><Panel title="Batch kalkulasi terakhir">{!b ? <EmptyState title="Belum ada kalkulasi"/> : <div className="space-y-5 p-5"><div className="flex items-start justify-between"><div><p className="text-xl font-bold">Batch #{display(b.batch_id ?? b.batch_no ?? b.id)}</p><p className="text-sm text-gray-500">{formatDate(b.started_at ?? b.created_at, true)}</p></div><StatusBadge status={String(b.status ?? "-")}/></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{[["Total GP", "total_gp"], ["Sukses", "success_count"], ["Gagal", "failed_count"], ["Review", "need_review_count"], ["Incomplete", "incomplete_count"]].map(([label, key]) => <div key={key} className="rounded-lg bg-gray-50 p-3"><p className="text-xs text-gray-500">{label}</p><p className="text-lg font-bold">{formatPoint(b[key] ?? 0)}</p></div>)}</div><Link href="/loyalty/calculations" className={primaryButton}>Lihat kalkulasi</Link></div>}</Panel>
    <Panel title="Quick Actions"><div className="grid gap-3 p-5 sm:grid-cols-2"><Link className={primaryButton} href="/loyalty/calculations"><FaCalculator/>Jalankan Kalkulasi</Link><Link className={primaryButton} href="/loyalty/redemptions?status=PENDING">Lihat Pending</Link><Link className={primaryButton} href="/loyalty/rewards"><FaGift/>Tambah Reward</Link><Link className={primaryButton} href="/loyalty/balances"><FaSearch/>Lihat Saldo</Link></div></Panel></div>
    <div className="grid gap-6 xl:grid-cols-2"><Panel title="Redemption terbaru">{data.recent.length === 0 ? <EmptyState title="Belum ada redemption"/> : <div className="divide-y">{data.recent.map(r => <div key={String(r.id ?? r.name)} className="flex items-center justify-between gap-3 px-5 py-4"><div><p className="font-semibold">{display(r.redemption_number ?? r.name ?? r.id)}</p><p className="text-sm text-gray-500">{display(r.reward_snapshot_name ?? r.reward_name ?? r.reward)}</p></div><StatusBadge status={String(r.status ?? "-")}/></div>)}</div>}</Panel><Panel title="Kalkulasi terbaru">{data.calculations.length === 0 ? <EmptyState title="Belum ada hasil kalkulasi"/> : <div className="divide-y">{data.calculations.map(r => <div key={String(r.id ?? r.name)} className="flex items-center justify-between gap-3 px-5 py-4"><div><p className="font-semibold">{display(r.calculation_number ?? r.name ?? r.id)}</p><p className="text-sm text-gray-500">{display(r.gpid ?? r.group_parent)} · {formatPoint(r.total_point)} poin</p></div><StatusBadge status={String(r.status ?? "-")}/></div>)}</div>}</Panel></div>
  </div>;
}

export function BalanceLookup() {
  const { token } = useAuth();
  const [kind, setKind] = useState<"gpid" | "bcid">("gpid"); const [query, setQuery] = useState("");
  const [balance, setBalance] = useState<LoyaltyBalance | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const submit = async (e: FormEvent) => { e.preventDefault(); if (!token || !query.trim()) return; setLoading(true); setError(""); setBalance(null); try { setBalance(await getLoyaltyBalance(kind === "gpid" ? { gpid: query.trim() } : { bcid: query.trim() }, token)); } catch (err) { setError(err instanceof Error ? err.message : String(err)); } finally { setLoading(false); } };
  return <div className="space-y-5"><form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-[180px_1fr_auto]"><select className={fieldClass} value={kind} onChange={e => setKind(e.target.value as "gpid" | "bcid")}><option value="gpid">Group Parent</option><option value="bcid">Branch Customer</option></select><input className={fieldClass} value={query} onChange={e => setQuery(e.target.value)} placeholder={kind === "gpid" ? "Masukkan GPID..." : "Masukkan BCID..."} required/><button className={primaryButton} disabled={loading}><FaSearch/>{loading ? "Mencari..." : "Cek Saldo"}</button></form>
    {loading && <LoadingState/>}{error && <ErrorState message={error}/>} {!loading && !error && !balance && <Panel><EmptyState title="Cari saldo customer" message="Pilih konteks GP atau BC lalu masukkan kodenya."/></Panel>}
    {balance && <><Panel title="Informasi Customer"><dl className="grid gap-4 p-5 sm:grid-cols-3"><div><dt className="text-xs font-semibold uppercase text-gray-400">Konteks</dt><dd className="font-semibold">{kind === "gpid" ? "Group Parent" : "Branch Customer"}</dd></div><div><dt className="text-xs font-semibold uppercase text-gray-400">Kode</dt><dd className="font-semibold">{query}</dd></div><div><dt className="text-xs font-semibold uppercase text-gray-400">Sumber saldo</dt><dd className="font-semibold">Backend Loyalty</dd></div></dl></Panel><div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><KpiCard label="Total Poin" value={formatPoint(balance.total_point)}/><KpiCard label="Digunakan" value={formatPoint(balance.redeemed_point)} tone="purple"/><KpiCard label="Reserved" value={formatPoint(balance.reserved_point)} tone="amber"/><KpiCard label="Tersedia" value={formatPoint(balance.available_point)} tone="green"/></div><Panel title="Rincian Kantong Poin">{balance.buckets.length === 0 ? <EmptyState title="Tidak ada kantong poin"/> : <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-sm"><thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr>{["Periode", "Earned", "Used", "Reserved", "Available", "Berlaku Sampai", "Status"].map(h => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead><tbody className="divide-y">{balance.buckets.map((r, i) => <tr key={String(r.id ?? i)}>{[display(r.period_name ?? r.period), formatPoint(r.earned_point ?? r.total_point), formatPoint(r.used_point ?? r.redeemed_point), formatPoint(r.reserved_point), formatPoint(r.available_point), formatDate(r.valid_to ?? r.expiry_date)].map((v, j) => <td key={j} className="px-4 py-4">{v}</td>)}<td className="px-4 py-4"><StatusBadge status={String(r.status ?? (r.expired ? "EXPIRED" : r.ready === false ? "NOT_READY" : "AVAILABLE"))}/></td></tr>)}</tbody></table></div>}</Panel></>}
  </div>;
}
