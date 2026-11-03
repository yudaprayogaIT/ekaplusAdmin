"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  getLoyaltyBalance,
  getLoyaltyResource,
  listLoyaltyResource,
} from "@/services/loyaltyService";
import type { LoyaltyBalance, LoyaltyRow } from "@/types/loyalty";
import Pagination from "@/components/ui/Pagination";
import {
  EmptyState,
  ErrorState,
  formatCurrency,
  formatDate,
  formatPoint,
  KpiCard,
  LoadingState,
  Panel,
  primaryButton,
  relationId,
  relationLabel,
  StatusBadge,
} from "./LoyaltyUI";

const PAGE_SIZE = 20;
const number = (value: unknown) =>
  Number.isFinite(Number(value)) ? Number(value) : 0;

export function CustomerPointsList() {
  const { token, isAuthenticated } = useAuth();
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("");
  const [hasReserved, setHasReserved] = useState(false);
  const [expiring, setExpiring] = useState(false);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const filters: unknown[] = [];
      if (period) filters.push(["period_id", "=", period]);
      if (hasReserved) filters.push(["reserved_point", ">", 0]);
      if (expiring) filters.push(["valid_to", "is", "set"]);
      const result = await listLoyaltyResource(
        API_CONFIG.ENDPOINTS.LOYALTY_POINT_LEDGER,
        token,
        {
          page: 1,
          perPage: 500,
          search,
          filters,
        },
      );
      setRows(result.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [expiring, hasReserved, isAuthenticated, period, search, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 300);
    return () => window.clearTimeout(timer);
  }, [load]);
  useEffect(() => setPage(1), [search, period, hasReserved, expiring]);

  const customers = useMemo(() => {
    const map = new Map<string, LoyaltyRow>();
    rows.forEach((row) => {
      const gp = row.gpid ?? row.group_parent;
      const id = relationId(gp) || String(row.gp_code ?? "");
      if (!id) return;
      const current = map.get(id) ?? {
        id,
        gp_name: row.gp_name ?? relationLabel(gp, id),
        total_point: 0,
        reserved_point: 0,
        available_point: 0,
        expiring_point: 0,
      };
      current.total_point =
        number(current.total_point) +
        number(row.earned_point ?? row.total_point);
      current.reserved_point =
        number(current.reserved_point) + number(row.reserved_point);
      current.available_point =
        number(current.available_point) + number(row.available_point);
      if (
        row.valid_to &&
        new Date(String(row.valid_to)).getTime() < Date.now() + 90 * 86400000
      )
        current.expiring_point =
          number(current.expiring_point) + number(row.available_point);
      map.set(id, current);
    });
    return [...map.values()];
  }, [rows]);
  const visible = customers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-white p-4 lg:grid-cols-[1fr_220px_auto_auto]">
        <label className="relative">
          <FaSearch className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari GP code atau nama..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm"
          />
        </label>
        <input
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="Period ID"
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={hasReserved}
            onChange={(e) => setHasReserved(e.target.checked)}
          />{" "}
          Has Reserved
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={expiring}
            onChange={(e) => setExpiring(e.target.checked)}
          />{" "}
          Expiring Soon
        </label>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={() => void load()} />
      ) : (
        <Panel>
          {visible.length === 0 ? (
            <EmptyState
              title="No Loyalty Point Data"
              message="No Group Parent currently has point balance."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    {[
                      "Group Parent",
                      "Total Point",
                      "Reserved",
                      "Available",
                      "Expiring Soon",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th key={h} className="px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {visible.map((row) => (
                    <tr key={String(row.id)} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900">
                          {String(row.id)}
                        </p>
                        <p className="text-gray-500">
                          {String(row.gp_name ?? "-")}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-semibold">
                        {formatPoint(row.total_point)}
                      </td>
                      <td className="px-5 py-4">
                        {formatPoint(row.reserved_point)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-green-700">
                        {formatPoint(row.available_point)}
                      </td>
                      <td className="px-5 py-4">
                        {formatPoint(row.expiring_point)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            number(row.available_point) > 0
                              ? "AVAILABLE"
                              : "NOT_READY"
                          }
                        />
                      </td>
                      <td className="px-5 py-4">
                        <Link
                        href={`/customer/loyalty-point/customers/detail?gpid=${encodeURIComponent(String(row.id))}`}
                          className={primaryButton}
                        >
                          View Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {customers.length > PAGE_SIZE && (
            <div className="border-t px-5">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(customers.length / PAGE_SIZE)}
                onPageChange={setPage}
                totalItems={customers.length}
                itemsPerPage={PAGE_SIZE}
              />
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}

export function CustomerPointDetail({ gpid }: { gpid: string }) {
  const { token, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<LoyaltyBalance | null>(null);
  const [gp, setGp] = useState<LoyaltyRow>({});
  const [calculations, setCalculations] = useState<LoyaltyRow[]>([]);
  const [redemptions, setRedemptions] = useState<LoyaltyRow[]>([]);
  const [tab, setTab] = useState<"balance" | "calculations" | "redemptions">(
    "balance",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const [balanceData, gpData, calcData, redemptionData] = await Promise.all(
        [
          getLoyaltyBalance(gpid, token),
          getLoyaltyResource(
            API_CONFIG.ENDPOINTS.GROUP_PARENT,
            gpid,
            token,
          ).catch(() => ({ name: gpid })),
          listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION, token, {
            perPage: 100,
            filters: [["gpid", "=", gpid]],
            orderBy: [["calculation_date", "desc"]],
          }),
          listLoyaltyResource(API_CONFIG.ENDPOINTS.LOYALTY_REDEMPTION, token, {
            perPage: 100,
            filters: [["gpid", "=", gpid]],
            orderBy: [["created_at", "desc"]],
          }),
        ],
      );
      setBalance(balanceData);
      setGp(gpData);
      setCalculations(calcData.rows);
      setRedemptions(redemptionData.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [gpid, isAuthenticated, token]);
  useEffect(() => void load(), [load]);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={() => void load()} />;
  if (!balance) return null;
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-red-600">{gpid}</p>
        <h2 className="text-xl font-bold text-gray-900">
          {String(gp.gp_name ?? gp.name ?? gpid)}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Total Earned"
          value={formatPoint(balance.total_point)}
        />
        <KpiCard
          label="Used"
          value={formatPoint(balance.redeemed_point)}
          tone="purple"
        />
        <KpiCard
          label="Reserved"
          value={formatPoint(balance.reserved_point)}
          tone="amber"
        />
        <KpiCard
          label="Available"
          value={formatPoint(balance.available_point)}
          tone="green"
        />
      </div>
      <div className="flex gap-1 overflow-x-auto rounded-xl border bg-white p-1.5">
        {[
          ["balance", "Point Balance"],
          ["calculations", "Calculation History"],
          ["redemptions", "Redemption History"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "balance" && (
        <Panel title="Point Allocation">
          {balance.buckets.length === 0 ? (
            <EmptyState title="No Point Balance" />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    {[
                      "Period",
                      "Earned",
                      "Used",
                      "Reserved",
                      "Available",
                      "Valid Until",
                      "Status",
                    ].map((h) => (
                      <th key={h} className="px-5 py-3">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {balance.buckets.map((row, i) => {
                    const status = row.expired
                      ? "EXPIRED"
                      : row.ready === false || row.ready === 0
                        ? "NOT_READY"
                        : "AVAILABLE";
                    return (
                      <tr key={String(row.ledger_id ?? row.id ?? i)}>
                        <td className="px-5 py-4 font-semibold">
                          {String(row.period_name ?? row.period_id ?? "-")}
                        </td>
                        <td className="px-5 py-4">
                          {formatPoint(row.earned_point)}
                        </td>
                        <td className="px-5 py-4">
                          {formatPoint(row.used_point)}
                        </td>
                        <td className="px-5 py-4">
                          {formatPoint(row.reserved_point)}
                        </td>
                        <td className="px-5 py-4 font-semibold text-green-700">
                          {formatPoint(row.available_point)}
                        </td>
                        <td className="px-5 py-4">
                          {row.valid_to
                            ? formatDate(row.valid_to)
                            : "No Expiry"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={status} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
      {tab === "calculations" && (
        <HistoryTable type="calculation" rows={calculations} />
      )}
      {tab === "redemptions" && (
        <HistoryTable type="redemption" rows={redemptions} />
      )}
    </div>
  );
}

function HistoryTable({
  rows,
  type,
}: {
  rows: LoyaltyRow[];
  type: "calculation" | "redemption";
}) {
  if (!rows.length)
    return (
      <Panel>
        <EmptyState
          title={
            type === "calculation"
              ? "No Calculation Yet"
              : "No Redemption Found"
          }
        />
      </Panel>
    );
  return (
    <Panel
      title={
        type === "calculation" ? "Calculation History" : "Redemption History"
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              {(type === "calculation"
                ? [
                    "Calculation",
                    "Period",
                    "Date",
                    "Total Omzet",
                    "Point",
                    "Status",
                    "Action",
                  ]
                : [
                    "Redemption",
                    "Reward",
                    "Quantity",
                    "Point Used",
                    "Created At",
                    "Status",
                    "Action",
                  ]
              ).map((h) => (
                <th key={h} className="px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => {
              const id = String(row.id ?? row.name);
              return (
                <tr key={id}>
                  <td className="px-5 py-4 font-semibold">{id}</td>
                  {type === "calculation" ? (
                    <>
                      <td className="px-5 py-4">
                        {relationLabel(row.period ?? row.period_name)}
                      </td>
                      <td className="px-5 py-4">
                        {formatDate(
                          row.calculation_date ?? row.created_at,
                          true,
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {formatCurrency(row.total_omzet)}
                      </td>
                      <td className="px-5 py-4">
                        {formatPoint(row.total_point, true)}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-4">
                        {relationLabel(row.reward_name ?? row.reward)}
                      </td>
                      <td className="px-5 py-4">{formatPoint(row.quantity)}</td>
                      <td className="px-5 py-4">
                        {formatPoint(row.point_used, true)}
                      </td>
                      <td className="px-5 py-4">
                        {formatDate(row.created_at, true)}
                      </td>
                    </>
                  )}
                  <td className="px-5 py-4">
                    <StatusBadge status={String(row.status ?? "-")} />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      className={primaryButton}
                      href={
                        type === "calculation"
                      ? `/customer/loyalty-point/calculations/detail?id=${encodeURIComponent(id)}&type=calculation`
                      : `/customer/loyalty-point/redemptions/detail?id=${encodeURIComponent(id)}`
                      }
                    >
                      View Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
