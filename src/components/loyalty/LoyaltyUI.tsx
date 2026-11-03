"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaGift,
  FaStar,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import type { LoyaltyStatus } from "@/types/loyalty";

export const loyaltyTabs = [
  { label: "Overview", href: "/customer/loyalty-point" },
  { label: "Customer Points", href: "/customer/loyalty-point/customers" },
  { label: "Calculation", href: "/customer/loyalty-point/calculations" },
  { label: "Redemption", href: "/customer/loyalty-point/redemptions" },
  { label: "Settings", href: "/customer/loyalty-point/settings/periods" },
];

export function LoyaltyShell({
  pathname,
  title,
  description,
  actions,
  children,
}: {
  pathname: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-red-600">
            Customer / Loyalty Point
          </p>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
        {loyaltyTabs.map((tab) => {
          const active =
            tab.href === "/customer/loyalty-point"
              ? pathname === tab.href
              : pathname.startsWith(tab.href.replace(/\/periods$/, ""));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}

export function StatusBadge({ status }: { status?: LoyaltyStatus | null }) {
  const normalized = String(status || "-")
    .toUpperCase()
    .replace(/\s+/g, "_");
  const classes = [
    "SUCCESS",
    "APPROVED",
    "ACTIVE",
    "AVAILABLE",
    "OPEN",
    "COMPLETED",
  ].includes(normalized)
    ? "bg-green-100 text-green-700 border-green-200"
    : ["PENDING", "NEED_REVIEW", "RESERVED", "RUNNING", "PROCESSING"].includes(
          normalized,
        )
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : normalized === "INCOMPLETE"
        ? "bg-orange-100 text-orange-700 border-orange-200"
        : ["FAILED", "REJECTED", "EXPIRED"].includes(normalized)
          ? "bg-red-100 text-red-700 border-red-200"
          : "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${classes}`}
    >
      {normalized.replace(/_/g, " ")}
    </span>
  );
}

const icons = {
  point: FaStar,
  users: FaUsers,
  reserved: FaClock,
  reward: FaGift,
  success: FaCheckCircle,
  issue: FaExclamationTriangle,
  failed: FaTimesCircle,
};

export function KpiCard({
  label,
  value,
  icon = "point",
  tone = "red",
}: {
  label: string;
  value: ReactNode;
  icon?: keyof typeof icons;
  tone?: "red" | "green" | "blue" | "amber" | "purple" | "gray";
}) {
  const Icon = icons[icon];
  const tones = {
    red: "bg-red-50 border-red-200 text-red-700",
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  };
  return (
    <div className={`rounded-xl border p-5 ${tones[tone]}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          {title && <h2 className="font-bold text-gray-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function LoadingState() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
    </div>
  );
}

export function ErrorState({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <FaExclamationTriangle className="mx-auto mb-3 h-7 w-7 text-red-600" />
      <p className="font-semibold text-red-800">Data tidak dapat dimuat</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message?: string;
}) {
  return (
    <div className="px-6 py-14 text-center text-gray-500">
      <FaStar className="mx-auto mb-3 h-8 w-8 text-gray-300" />
      <p className="font-semibold text-gray-800">{title}</p>
      {message && <p className="mt-1 text-sm">{message}</p>}
    </div>
  );
}

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

export function formatPoint(value: unknown, suffix = false): string {
  const numeric = Number(value || 0);
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(Number.isFinite(numeric) ? numeric : 0);
  return suffix ? `${formatted} Point` : formatted;
}

export function formatCurrency(value: unknown): string {
  const numeric = Number(value || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(numeric) ? numeric : 0);
}

export function formatDate(value: unknown, withTime = false): string {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

export function rowId(row: Record<string, unknown>): string {
  return String(row.id ?? row.name ?? "");
}

export function relationId(value: unknown): string {
  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    return String(item.id ?? item.name ?? item.gpid ?? "");
  }
  return value == null ? "" : String(value);
}

export function relationLabel(value: unknown, fallback = "-"): string {
  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    return String(
      item.gp_name ??
        item.customer_name ??
        item.reward_name ??
        item.name ??
        item.id ??
        fallback,
    );
  }
  return value == null || value === "" ? fallback : String(value);
}
