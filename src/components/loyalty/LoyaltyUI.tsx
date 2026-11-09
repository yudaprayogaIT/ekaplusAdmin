"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FaExclamationTriangle, FaGift, FaStar, FaUsers } from "react-icons/fa";
import type { LoyaltyStatus } from "@/types/loyalty";

const tabs = [
  ["Dashboard", "/loyalty"],
  ["Periode", "/loyalty/periods"],
  ["Aturan Poin", "/loyalty/rules"],
  ["Kalkulasi", "/loyalty/calculations"],
  ["Saldo Poin", "/loyalty/balances"],
  ["Katalog Reward", "/loyalty/rewards"],
  ["Master Reward", "/loyalty/masters"],
  ["Penukaran", "/loyalty/redemptions"],
] as const;

export function LoyaltyShell({ title, description, actions, children }: {
  title: string; description?: string; actions?: ReactNode; children: ReactNode;
}) {
  const pathname = usePathname() || "/loyalty";
  return <div className="space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div><p className="mb-1 text-sm font-semibold text-red-600">Loyalty Management</p>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
    <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
      {tabs.map(([label, href]) => {
        const active = href === "/loyalty" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold transition ${active ? "bg-red-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{label}</Link>;
      })}
    </nav>
    {children}
  </div>;
}

export function StatusBadge({ status }: { status?: LoyaltyStatus | null }) {
  const value = String(status || "-").toUpperCase().replace(/\s+/g, "_");
  const good = ["SUCCESS", "APPROVED", "ACTIVE", "AVAILABLE", "OPEN", "COMPLETED"];
  const pending = ["PENDING", "NEED_REVIEW", "RESERVED", "QUEUED", "RUNNING", "PROCESSING"];
  const bad = ["FAILED", "REJECTED", "EXPIRED", "CANCELLED"];
  const color = good.includes(value) ? "border-green-200 bg-green-100 text-green-700" : pending.includes(value) ? "border-amber-200 bg-amber-100 text-amber-700" : bad.includes(value) ? "border-red-200 bg-red-100 text-red-700" : value === "INCOMPLETE" ? "border-orange-200 bg-orange-100 text-orange-700" : "border-gray-200 bg-gray-100 text-gray-600";
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${color}`}>{value.replace(/_/g, " ")}</span>;
}

const kpiIcons = { point: FaStar, users: FaUsers, reward: FaGift };
export function KpiCard({ label, value, tone = "red", icon = "point" }: {
  label: string; value: ReactNode; tone?: "red" | "green" | "blue" | "amber" | "purple" | "gray"; icon?: keyof typeof kpiIcons;
}) {
  const Icon = kpiIcons[icon];
  const tones = { red: "border-red-200 bg-red-50", green: "border-green-200 bg-green-50", blue: "border-blue-200 bg-blue-50", amber: "border-amber-200 bg-amber-50", purple: "border-purple-200 bg-purple-50", gray: "border-gray-200 bg-gray-50" };
  return <div className={`rounded-xl border p-5 ${tones[tone]}`}><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600"><Icon className="h-4 w-4" />{label}</div><div className="text-2xl font-bold text-gray-900">{value}</div></div>;
}

export function Panel({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">{(title || action) && <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">{title && <h2 className="font-bold text-gray-900">{title}</h2>}{action}</div>}{children}</section>;
}

export function LoadingState() { return <div className="flex min-h-64 items-center justify-center rounded-xl border bg-white"><div className="h-12 w-12 animate-spin rounded-full border-4 border-red-100 border-t-red-600" /></div>; }
export function EmptyState({ title, message }: { title: string; message?: string }) { return <div className="px-6 py-14 text-center text-gray-500"><FaStar className="mx-auto mb-3 h-8 w-8 text-gray-300"/><p className="font-semibold text-gray-800">{title}</p>{message && <p className="mt-1 text-sm">{message}</p>}</div>; }
export function ErrorState({ message, retry }: { message: string; retry?: () => void }) { return <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center"><FaExclamationTriangle className="mx-auto mb-3 h-7 w-7 text-red-600"/><p className="font-semibold text-red-800">Data tidak dapat dimuat</p><p className="mt-1 text-sm text-red-600">{message}</p>{retry && <button onClick={retry} className={`${primaryButton} mt-4`}>Coba lagi</button>}</div>; }

export const primaryButton = "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButton = "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";
export const fieldClass = "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100";

export function formatPoint(value: unknown) { const n = Number(value); return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(Number.isFinite(n) ? n : 0); }
export function formatCurrency(value: unknown) { const n = Number(value); return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0); }
export function formatDate(value: unknown, withTime = false) { if (!value) return "-"; const d = new Date(String(value)); if (Number.isNaN(d.getTime())) return String(value); return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short", year: "numeric", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(d); }
export function rowId(row: Record<string, unknown>) { return String(row.id ?? row.name ?? ""); }
export function display(value: unknown, fallback = "-"): string { if (value && typeof value === "object") { const r = value as Record<string, unknown>; return String(r.gp_name ?? r.reward_name ?? r.name ?? r.code ?? r.id ?? fallback); } return value === null || value === undefined || value === "" ? fallback : String(value); }

export function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) { return <label className={wide ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span>{children}</label>; }
