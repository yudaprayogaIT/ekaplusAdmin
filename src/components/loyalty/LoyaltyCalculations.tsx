"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaPlay, FaRedo } from "react-icons/fa";
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
  formatCurrency,
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

type ConfirmAction = {
  type: "run" | "issues" | "all" | "one";
  id?: string;
} | null;

function Result({
  value,
  close,
}: {
  value: { type: "success" | "error"; message: string } | null;
  close: () => void;
}) {
  return (
    <ActionResultModal
      isOpen={Boolean(value)}
      type={value?.type}
      title={value?.type === "success" ? "Berhasil" : "Action gagal"}
      message={value?.message ?? ""}
      onClose={close}
    />
  );
}

export function CalculationList() {
  const { token, isAuthenticated } = useAuth();
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
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
      const response = await listLoyaltyResource(
        API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION_BATCH,
        token,
        { perPage: 100, orderBy: [["started_at", "desc"]] },
      );
      setRows(response.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);
  useEffect(() => void load(), [load]);
  const run = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const response = await callLoyaltyMethod(
        "loyalty_calculation",
        "run_batch",
        token,
        {},
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
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setConfirm({ type: "run" })}
          className={primaryButton}
        >
          <FaPlay /> Run Calculation
        </button>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={() => void load()} />
      ) : (
        <Panel>
          {rows.length === 0 ? (
            <EmptyState title="No Calculation Yet" />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    {[
                      "Batch",
                      "Period",
                      "Trigger",
                      "Started At",
                      "Finished At",
                      "Total",
                      "Success",
                      "Need Review",
                      "Incomplete",
                      "Failed",
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
                        <td className="px-4 py-4 font-bold">
                          #{String(row.batch_no ?? id)}
                        </td>
                        <td className="px-4 py-4">
                          {relationLabel(row.period_name ?? row.period)}
                        </td>
                        <td className="px-4 py-4">
                          {String(row.trigger ?? row.trigger_type ?? "-")}
                        </td>
                        <td className="px-4 py-4">
                          {formatDate(row.started_at, true)}
                        </td>
                        <td className="px-4 py-4">
                          {formatDate(row.finished_at, true)}
                        </td>
                        {[
                          "total_gp",
                          "success_count",
                          "need_review_count",
                          "incomplete_count",
                          "failed_count",
                        ].map((key) => (
                          <td key={key} className="px-4 py-4">
                            {formatPoint(
                              row[key] ?? row[key.replace("_count", "")],
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-4">
                          <StatusBadge status={String(row.status ?? "-")} />
                        </td>
                        <td className="px-4 py-4">
                          <Link
                          href={`/customer/loyalty-point/calculations/detail?id=${encodeURIComponent(id)}`}
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
      )}
      <ConfirmDialog
        open={Boolean(confirm)}
        title="Run Loyalty Calculation?"
        description="System will calculate point for all eligible Group Parents."
        confirmLabel={processing ? "Processing..." : "Run Calculation"}
        variant="warning"
        onCancel={() => !processing && setConfirm(null)}
        onConfirm={() => void run()}
      />
      <Result value={result} close={() => setResult(null)} />
    </div>
  );
}

export function CalculationDetail({
  id,
  calculationOnly = false,
}: {
  id: string;
  calculationOnly?: boolean;
}) {
  const { token, isAuthenticated, hasPermission, hasAnyRole } = useAuth();
  const [item, setItem] = useState<LoyaltyRow | null>(null);
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [errors, setErrors] = useState<LoyaltyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
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
      const endpoint = calculationOnly
        ? API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION
        : API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION_BATCH;
      const detailFilter = calculationOnly
        ? ["calculation_id", "=", id]
        : ["batch_id", "=", id];
      const [head, detail, issueRows] = await Promise.all([
        getLoyaltyResource(endpoint, id, token),
        listLoyaltyResource(
          calculationOnly
            ? API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION_DETAIL
            : API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION,
          token,
          { perPage: 500, filters: [detailFilter] },
        ),
        listLoyaltyResource(
          API_CONFIG.ENDPOINTS.LOYALTY_CALCULATION_ERROR,
          token,
          { perPage: 500, filters: [detailFilter] },
        ).catch(() => ({ rows: [], total: 0, page: 1, perPage: 500 })),
      ]);
      setItem(head);
      setRows(detail.rows);
      setErrors(issueRows.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [calculationOnly, id, isAuthenticated, token]);
  useEffect(() => void load(), [load]);
  const act = async () => {
    if (!token || !confirm) return;
    setProcessing(true);
    try {
      let response;
      if (confirm.type === "one")
        response = await callLoyaltyMethod(
          "loyalty_calculation",
          "recalculate",
          token,
          { calculation_id: confirm.id },
        );
      else
        response = await callLoyaltyMethod(
          "loyalty_calculation",
          "recalculate_batch",
          token,
          { batch_id: id, all: confirm.type === "all" },
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
  if (calculationOnly)
    return (
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Calculation</p>
            <h2 className="text-2xl font-bold">
              {String(item.name ?? item.id ?? id)}
            </h2>
          </div>
          <StatusBadge status={String(item.status ?? "-")} />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="Period"
            value={relationLabel(item.period_name ?? item.period)}
            tone="blue"
          />
          <KpiCard
            label="Total Omzet"
            value={formatCurrency(item.total_omzet)}
            tone="green"
          />
          <KpiCard label="Point Earned" value={formatPoint(item.total_point)} />
          <KpiCard
            label="Calculation Date"
            value={formatDate(item.calculation_date ?? item.created_at, true)}
            tone="gray"
          />
        </div>
        {String(item.status).toUpperCase() !== "SUCCESS" && (
          <button
            className={primaryButton}
            onClick={() => setConfirm({ type: "one", id })}
          >
            <FaRedo /> Recalculate
          </button>
        )}
        <PurchaseDetails rows={rows} />
        {errors.length > 0 && <IssuePanel rows={errors} />}
        <ConfirmDialog
          open={Boolean(confirm)}
          title="Recalculate Point?"
          description="Point customer akan dihitung ulang menggunakan konfigurasi dan data terbaru."
          confirmLabel={processing ? "Processing..." : "Continue"}
          variant="warning"
          onCancel={() => !processing && setConfirm(null)}
          onConfirm={() => void act()}
        />
        <Result value={result} close={() => setResult(null)} />
      </div>
    );

  const counts = [
    "total_gp",
    "success_count",
    "need_review_count",
    "incomplete_count",
    "failed_count",
  ];
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-end gap-2">
        <button
          className={primaryButton}
          onClick={() => setConfirm({ type: "issues" })}
        >
          <FaRedo /> Recalculate Issues
        </button>
        {(hasPermission("loyalty.force_recalculate") ||
          hasAnyRole(["administrator"])) && (
          <button
            className={secondaryButton}
            onClick={() => setConfirm({ type: "all" })}
          >
            Recalculate All
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {counts.map((key, i) => (
          <KpiCard
            key={key}
            label={
              ["Total", "Success", "Need Review", "Incomplete", "Failed"][i]
            }
            value={formatPoint(item[key] ?? item[key.replace("_count", "")])}
            tone={i === 1 ? "green" : i > 1 ? "red" : "blue"}
          />
        ))}
      </div>
      <Panel title="GP Calculation">
        {rows.length === 0 ? (
          <EmptyState title="No Calculation Yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                  {[
                    "GP",
                    "Customer Name",
                    "Status",
                    "Total Omzet",
                    "Point",
                    "Issue",
                    "Recalculated At",
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
                  const rowKey = String(row.id ?? row.name);
                  const issue = errors.find(
                    (value) =>
                      String(value.calculation_id ?? value.calculation) ===
                      rowKey,
                  );
                  return (
                    <tr key={rowKey}>
                      <td className="px-4 py-4 font-semibold">
                        {relationLabel(row.gpid ?? row.group_parent)}
                      </td>
                      <td className="px-4 py-4">
                        {String(row.customer_name ?? row.gp_name ?? "-")}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={String(row.status ?? "-")} />
                      </td>
                      <td className="px-4 py-4">
                        {formatCurrency(row.total_omzet)}
                      </td>
                      <td className="px-4 py-4">
                        {formatPoint(row.total_point, true)}
                      </td>
                      <td className="max-w-xs px-4 py-4 text-red-600">
                        {String(
                          issue?.error_message ??
                            row.error_message ??
                            row.issue ??
                            "-",
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {formatDate(row.recalculated_at, true)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Link
                            className={secondaryButton}
                              href={`/customer/loyalty-point/calculations/detail?id=${encodeURIComponent(rowKey)}&type=calculation`}
                          >
                            View
                          </Link>
                          {String(row.status).toUpperCase() !== "SUCCESS" && (
                            <button
                              className={primaryButton}
                              onClick={() =>
                                setConfirm({ type: "one", id: rowKey })
                              }
                            >
                              Recalculate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <ConfirmDialog
        open={Boolean(confirm)}
        title={
          confirm?.type === "all"
            ? "Recalculate All?"
            : confirm?.type === "one"
              ? "Recalculate Point?"
              : "Recalculate Issues?"
        }
        description={
          confirm?.type === "all"
            ? "Semua calculation termasuk yang SUCCESS akan dihitung ulang."
            : confirm?.type === "one"
              ? "Point customer akan dihitung ulang menggunakan konfigurasi dan data terbaru."
              : "Hanya calculation FAILED, NEED REVIEW, dan INCOMPLETE yang akan diproses."
        }
        confirmLabel={processing ? "Processing..." : "Continue"}
        variant={confirm?.type === "all" ? "danger" : "warning"}
        onCancel={() => !processing && setConfirm(null)}
        onConfirm={() => void act()}
      />
      <Result value={result} close={() => setResult(null)} />
    </div>
  );
}

function PurchaseDetails({ rows }: { rows: LoyaltyRow[] }) {
  return (
    <Panel title="Point Calculation Detail">
      {rows.length === 0 ? (
        <EmptyState title="No Calculation Detail" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                {["Sales Account", "Omzet", "Standard Divider", "Point"].map(
                  (h) => (
                    <th key={h} className="px-5 py-3">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row, i) => (
                <tr key={String(row.id ?? i)}>
                  <td className="px-5 py-4 font-semibold">
                    {relationLabel(row.sales_account)}
                  </td>
                  <td className="px-5 py-4">
                    {formatCurrency(row.omzet ?? row.total_omzet)}
                  </td>
                  <td className="px-5 py-4">
                    {formatCurrency(row.standard_divider ?? row.divider)}
                  </td>
                  <td className="px-5 py-4">{formatPoint(row.point, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
function IssuePanel({ rows }: { rows: LoyaltyRow[] }) {
  return (
    <Panel title="Calculation Issues">
      <div className="space-y-2 p-5">
        {rows.map((row, i) => (
          <div
            key={String(row.id ?? i)}
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {String(row.error_message ?? row.message ?? "Calculation failed")}
          </div>
        ))}
      </div>
    </Panel>
  );
}
