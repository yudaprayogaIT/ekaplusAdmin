"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaHistory, FaRedo } from "react-icons/fa";
import { apiFetch, getResourceUrl } from "@/config/api";

interface ResourceHistoryChange {
  ID?: number;
  Field?: string | null;
  OldValue?: unknown;
  NewValue?: unknown;
  OldDisplay?: unknown;
  NewDisplay?: unknown;
}

interface ResourceHistoryItem {
  ID?: number;
  Action?: string | null;
  Version?: number | string | null;
  CreatedByName?: string | null;
  Source?: string | null;
  CreatedAt?: number | string | null;
  Changes?: ResourceHistoryChange[] | null;
}

interface ResourceHistoryProps {
  endpoint: string;
  resourceId: number | string;
  token?: string | null;
  demoMode?: boolean;
}

function displayHistoryValue(displayValue: unknown, rawValue: unknown) {
  const value =
    displayValue !== null &&
    displayValue !== undefined &&
    displayValue !== ""
      ? displayValue
      : rawValue;

  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function parseHistoryDate(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return null;

  const numericValue = typeof value === "number" ? value : Number(value);
  const date = Number.isFinite(numericValue)
    ? new Date(
        numericValue < 10_000_000_000 ? numericValue * 1000 : numericValue,
      )
    : new Date(String(value));

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatHistoryDate(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "-";

  const date = parseHistoryDate(value);
  if (!date) return String(value);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", "");
}

function formatRelativeDate(value?: number | string | null) {
  const date = parseHistoryDate(value);
  if (!date) return "-";

  const differenceInSeconds = (date.getTime() - Date.now()) / 1000;
  const absoluteSeconds = Math.abs(differenceInSeconds);
  if (absoluteSeconds < 60) return "just now";

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];
  const [unit, divisor] =
    units.find(([, unitSeconds]) => absoluteSeconds >= unitSeconds) ||
    units[units.length - 1];

  return new Intl.RelativeTimeFormat("en", { numeric: "always" }).format(
    Math.round(differenceInSeconds / divisor),
    unit,
  );
}

function getActionTone(action?: string | null) {
  switch ((action || "").toLowerCase()) {
    case "create":
      return "border-emerald-200 bg-emerald-100 text-emerald-700";
    case "delete":
      return "border-rose-200 bg-rose-100 text-rose-700";
    default:
      return "border-slate-900 bg-slate-900 text-white";
  }
}

export function ResourceHistory({
  endpoint,
  resourceId,
  token,
  demoMode = false,
}: ResourceHistoryProps) {
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<ResourceHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    [],
  );

  const loadHistory = async () => {
    if (loading) return;

    if (demoMode) {
      setHistory([]);
      setError(null);
      setLoaded(true);
      return;
    }

    if (!token) {
      setError("Token autentikasi tidak tersedia.");
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(
        `${getResourceUrl(endpoint, resourceId)}/history`,
        { method: "GET", cache: "no-store", signal: controller.signal },
        token,
      );

      if (!response.ok) {
        throw new Error(`Gagal memuat history (${response.status})`);
      }

      const json = await response.json();
      const payload = json?.data;
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setHistory(rows as ResourceHistoryItem[]);
      setLoaded(true);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") {
        return;
      }
      setHistory([]);
      setError(
        loadError instanceof Error ? loadError.message : "Gagal memuat history",
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const toggleExpanded = () => {
    const nextExpanded = !expanded;
    setExpanded(nextExpanded);
    if (nextExpanded && !loaded && !loading) void loadHistory();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
            <FaHistory className="h-4 w-4 text-violet-600" />
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-900">
              History Perubahan
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              {loaded ? `${history.length} versi tercatat` : "Klik untuk melihat riwayat"}
            </span>
          </span>
        </span>
        <FaChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-slate-200 px-5 pb-5 pt-4">
          {loading && (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-8 text-sm text-slate-500">
              <FaRedo className="h-4 w-4 animate-spin" />
              Memuat history...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void loadHistory()}
                className="mt-3 font-semibold text-red-700 underline underline-offset-2"
              >
                Coba lagi
              </button>
            </div>
          )}

          {!loading && !error && loaded && history.length === 0 && (
            <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Belum ada history perubahan.
            </div>
          )}

          {!loading && !error && history.length > 0 && (
            <div className="relative ml-1 space-y-5 border-l border-slate-200 pl-5">
              {history.map((item, itemIndex) => (
                <article
                  key={item.ID ?? `${item.Version}-${item.CreatedAt}-${itemIndex}`}
                  className="relative rounded-[1.4rem] border border-slate-200 bg-slate-50/40 p-4 shadow-sm sm:p-5"
                >
                  <span className="absolute -left-[30px] top-4 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-slate-300 bg-white sm:top-5">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                  </span>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getActionTone(
                            item.Action,
                          )}`}
                        >
                          {item.Action || "update"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-500">
                          Version {item.Version ?? "-"}
                        </span>
                        <span className="rounded-full bg-teal-50 px-3 py-1 text-[10px] font-semibold text-teal-600">
                          {item.Source || "-"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">
                        <span className="font-bold text-slate-900">
                          {item.CreatedByName?.trim() || "System"}
                        </span>{" "}
                        mengubah dokumen
                      </p>
                    </div>
                    <div className="shrink-0 text-left text-xs sm:text-right">
                      <p className="font-semibold text-slate-700">
                        {formatHistoryDate(item.CreatedAt)}
                      </p>
                      <p className="mt-1 text-slate-500">
                        {formatRelativeDate(item.CreatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(Array.isArray(item.Changes) ? item.Changes : []).map(
                      (change, changeIndex) => (
                        <div
                          key={change.ID ?? `${change.Field}-${changeIndex}`}
                          className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                        >
                          <p className="mb-3 break-all text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                            {(change.Field || "-").replaceAll("_", " ")}
                          </p>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                Sebelum
                              </p>
                              <p className="mt-1 break-words text-sm text-slate-700">
                                {displayHistoryValue(
                                  change.OldDisplay,
                                  change.OldValue,
                                )}
                              </p>
                            </div>
                            <div className="min-w-0 rounded-2xl border border-teal-200 bg-white p-3">
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-500">
                                Sesudah
                              </p>
                              <p className="mt-1 break-words text-sm text-slate-700">
                                {displayHistoryValue(
                                  change.NewDisplay,
                                  change.NewValue,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
