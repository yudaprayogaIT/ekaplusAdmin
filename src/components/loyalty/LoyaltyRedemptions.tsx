"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  callLoyaltyMethod,
  getLoyaltyResource,
  listLoyaltyResource,
} from "@/services/loyaltyService";
import type { LoyaltyRow } from "@/types/loyalty";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ActionResultModal from "@/components/ui/ActionResultModal";
import {
  EmptyState,
  ErrorState,
  formatDate,
  formatPoint,
  KpiCard,
  LoadingState,
  Panel,
  primaryButton,
  relationLabel,
  secondaryButton,
  StatusBadge,
} from "./LoyaltyUI";

export function RedemptionList() {
  const { token, isAuthenticated } = useAuth();
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const response = await listLoyaltyResource(
        API_CONFIG.ENDPOINTS.LOYALTY_REDEMPTION,
        token,
        { perPage: 200, orderBy: [["created_at", "desc"]] },
      );
      setRows(response.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);
  useEffect(() => void load(), [load]);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={() => void load()} />;
  const pending = rows.filter(
    (r) => String(r.status).toUpperCase() === "PENDING",
  ).length;
  const approved = rows.filter(
    (r) => String(r.status).toUpperCase() === "APPROVED",
  ).length;
  const rejected = rows.filter(
    (r) => String(r.status).toUpperCase() === "REJECTED",
  ).length;
  const points = rows
    .filter((r) => String(r.status).toUpperCase() === "APPROVED")
    .reduce((sum, row) => sum + Number(row.point_used ?? 0), 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Pending Approval" value={pending} tone="amber" />
        <KpiCard label="Approved" value={approved} tone="green" />
        <KpiCard label="Rejected" value={rejected} tone="red" />
        <KpiCard
          label="Total Point Redeemed"
          value={formatPoint(points)}
          tone="purple"
        />
      </div>
      <Panel>
        {rows.length === 0 ? (
          <EmptyState title="No Redemption Found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  {[
                    "Redemption",
                    "Group Parent",
                    "Branch Customer",
                    "Reward",
                    "Quantity",
                    "Point Used",
                    "Created At",
                    "Completed At",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3">
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
                      <td className="px-4 py-4 font-bold">{id}</td>
                      <td className="px-4 py-4">
                        {relationLabel(row.gpid ?? row.group_parent)}
                      </td>
                      <td className="px-4 py-4">
                        {relationLabel(row.bcid ?? row.branch_customer)}
                      </td>
                      <td className="px-4 py-4">
                        {relationLabel(
                          row.reward_name ??
                            row.reward_snapshot_name ??
                            row.reward,
                        )}
                      </td>
                      <td className="px-4 py-4">{formatPoint(row.quantity)}</td>
                      <td className="px-4 py-4">
                        {formatPoint(row.point_used, true)}
                      </td>
                      <td className="px-4 py-4">
                        {formatDate(row.created_at, true)}
                      </td>
                      <td className="px-4 py-4">
                        {formatDate(row.completed_at, true)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={String(row.status ?? "-")} />
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/customer/loyalty-point/redemptions/detail?id=${encodeURIComponent(id)}`}
                          className={primaryButton}
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
        )}
      </Panel>
    </div>
  );
}

export function RedemptionDetail({ id }: { id: string }) {
  const { token, isAuthenticated, hasPermission } = useAuth();
  const [item, setItem] = useState<LoyaltyRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      setItem(
        await getLoyaltyResource(
          API_CONFIG.ENDPOINTS.LOYALTY_REDEMPTION,
          id,
          token,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, token]);
  useEffect(() => void load(), [load]);
  const execute = async () => {
    if (!token || !confirm) return;
    setProcessing(true);
    try {
      const response = await callLoyaltyMethod(
        "loyalty_redemption",
        confirm,
        token,
        { redemption_id: id },
      );
      setResult({ type: "success", message: response.message });
      setConfirm(null);
      await load();
    } catch (err) {
      setResult({
        type: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setProcessing(false);
    }
  };
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={() => void load()} />;
  if (!item) return null;
  const fields: [string, unknown][] = [
    ["Redemption Number", item.redemption_number ?? item.name ?? item.id],
    ["Group Parent", relationLabel(item.gpid ?? item.group_parent)],
    ["Branch Customer", relationLabel(item.bcid ?? item.branch_customer)],
    [
      "Reward",
      relationLabel(
        item.reward_snapshot_name ?? item.reward_name ?? item.reward,
      ),
    ],
    ["Reward Type", item.reward_snapshot_type ?? item.reward_type],
    ["Quantity", formatPoint(item.quantity)],
    ["Point Used", formatPoint(item.point_used, true)],
    ["Created At", formatDate(item.created_at, true)],
    ["Completed At", formatDate(item.completed_at, true)],
  ];
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Redemption</p>
          <h2 className="text-2xl font-bold">{id}</h2>
        </div>
        <StatusBadge status={String(item.status ?? "-")} />
      </div>
      <Panel title="Redemption Detail">
        <dl className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase text-gray-400">
                {label}
              </dt>
              <dd className="mt-1 font-semibold text-gray-900">
                {String(value ?? "-")}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>
      {String(item.status).toUpperCase() === "PENDING" &&
        hasPermission("loyalty_redemption.approve") && (
          <div className="flex justify-end gap-2">
            <button
              className={secondaryButton}
              onClick={() => setConfirm("reject")}
            >
              Reject
            </button>
            <button
              className={primaryButton}
              onClick={() => setConfirm("approve")}
            >
              Approve
            </button>
          </div>
        )}
      <ConfirmDialog
        open={Boolean(confirm)}
        title={
          confirm === "approve" ? "Approve Redemption?" : "Reject Redemption?"
        }
        description={
          confirm === "approve"
            ? "Reserved point akan dipindahkan menjadi used point."
            : "Reserved point akan dikembalikan menjadi available point."
        }
        confirmLabel={
          processing
            ? "Processing..."
            : confirm === "approve"
              ? "Approve"
              : "Reject"
        }
        variant={confirm === "approve" ? "info" : "danger"}
        onCancel={() => !processing && setConfirm(null)}
        onConfirm={() => void execute()}
      />
      <ActionResultModal
        isOpen={Boolean(result)}
        type={result?.type}
        title={result?.type === "success" ? "Berhasil" : "Action gagal"}
        message={result?.message ?? ""}
        onClose={() => setResult(null)}
      />
    </div>
  );
}
