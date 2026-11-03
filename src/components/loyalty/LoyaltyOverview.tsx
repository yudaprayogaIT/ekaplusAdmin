"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { listLoyaltyResource } from "@/services/loyaltyService";
import type { LoyaltyRow } from "@/types/loyalty";
import {
  EmptyState,
  ErrorState,
  formatDate,
  formatPoint,
  KpiCard,
  LoadingState,
  Panel,
  primaryButton,
  StatusBadge,
} from "./LoyaltyUI";

type OverviewData = {
  period?: LoyaltyRow;
  batch?: LoyaltyRow;
  ledgers: LoyaltyRow[];
  redemptions: LoyaltyRow[];
  calculations: LoyaltyRow[];
};

function num(row: LoyaltyRow | undefined, ...keys: string[]): number {
  for (const key of keys) {
    const value = Number(row?.[key]);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

export default function LoyaltyOverview() {
  const { token, isAuthenticated } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const [periods, batches, ledgers, redemptions, calculations] =
        await Promise.all([
          listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_PERIOD, token, {
            perPage: 10,
            filters: [["status", "=", "OPEN"]],
            orderBy: [["date_from", "desc"]],
          }),
          listLoyaltyResource(
            API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION_BATCH,
            token,
            {
              perPage: 1,
              orderBy: [["created_at", "desc"]],
            },
          ),
          listLoyaltyResource(
            API_CONFIG.ENDPOINTS.LOYALTY_POINT_LEDGER,
            token,
            { perPage: 100 },
          ),
          listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_REDEMPTION, token, {
            perPage: 100,
          }),
          listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION, token, {
            perPage: 100,
            filters: [
              ["status", "in", ["FAILED", "NEED_REVIEW", "INCOMPLETE"]],
            ],
          }),
        ]);
      setData({
        period: periods.rows[0],
        batch: batches.rows[0],
        ledgers: ledgers.rows,
        redemptions: redemptions.rows,
        calculations: calculations.rows,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => void load(), [load]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={() => void load()} />;
  if (!data) return null;

  const available = data.ledgers.reduce(
    (sum, row) => sum + num(row, "available_point", "available"),
    0,
  );
  const reserved = data.ledgers.reduce(
    (sum, row) => sum + num(row, "reserved_point", "reserved"),
    0,
  );
  const redeemed = data.ledgers.reduce(
    (sum, row) => sum + num(row, "used_point", "redeemed_point", "used"),
    0,
  );
  const gpIds = new Set(
    data.ledgers
      .map((row) => String(row.gpid ?? row.group_parent ?? ""))
      .filter(Boolean),
  );
  const pending = data.redemptions.filter(
    (row) => String(row.status).toUpperCase() === "PENDING",
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          label="Total Available Point"
          value={formatPoint(available)}
          tone="green"
        />
        <KpiCard
          label="GP With Point"
          value={formatPoint(gpIds.size)}
          icon="users"
          tone="blue"
        />
        <KpiCard
          label="Reserved Point"
          value={formatPoint(reserved)}
          icon="reserved"
          tone="amber"
        />
        <KpiCard
          label="Redeemed Point"
          value={formatPoint(redeemed)}
          icon="reward"
          tone="purple"
        />
        <KpiCard
          label="Pending Redemption"
          value={formatPoint(pending)}
          icon="reserved"
          tone="amber"
        />
        <KpiCard
          label="Calculation Issues"
          value={formatPoint(data.calculations.length)}
          icon="issue"
          tone="red"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Active Loyalty Period">
          {data.period ? (
            <div className="space-y-5 p-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {String(data.period.name ?? "-")}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(data.period.date_from)} -{" "}
                  {formatDate(data.period.date_to)}
                </p>
              </div>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs font-semibold uppercase text-gray-400">
                    Status
                  </dt>
                  <dd className="mt-1">
                    <StatusBadge
                      status={String(data.period.status ?? "OPEN")}
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-gray-400">
                    Point Ready
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-800">
                    {String(data.period.point_ready ?? "-").replace(/_/g, " ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase text-gray-400">
                    Expiry
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-gray-800">
                    {String(data.period.expiry_mode ?? "NEVER").replace(
                      /_/g,
                      " ",
                    )}
                    {String(data.period.expiry_mode) === "DURATION"
                      ? ` (${String(data.period.expiry_months ?? 0)} bulan)`
                      : ""}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <EmptyState
              title="No Active Period"
              message="Belum ada loyalty period berstatus OPEN."
            />
          )}
        </Panel>

        <Panel title="Last Calculation Batch">
          {data.batch ? (
            <div className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Batch #
                    {String(
                      data.batch.batch_no ??
                        data.batch.id ??
                        data.batch.name ??
                        "-",
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(
                      data.batch.started_at ?? data.batch.created_at,
                      true,
                    )}
                  </p>
                </div>
                <StatusBadge status={String(data.batch.status ?? "-")} />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  ["Total GP", "total_gp"],
                  ["Success", "success_count"],
                  ["Need Review", "need_review_count"],
                  ["Incomplete", "incomplete_count"],
                  ["Failed", "failed_count"],
                ].map(([label, key]) => (
                  <div key={key} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {formatPoint(
                        num(data.batch, key, key.replace("_count", "")),
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href={`/customer/loyalty-point/calculations/detail?id=${encodeURIComponent(String(data.batch.id ?? data.batch.name))}`}
                className={primaryButton}
              >
                View Calculation
              </Link>
            </div>
          ) : (
            <EmptyState title="No Calculation Yet" />
          )}
        </Panel>
      </div>
    </div>
  );
}
