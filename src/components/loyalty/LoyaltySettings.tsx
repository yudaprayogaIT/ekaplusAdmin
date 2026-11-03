"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import { API_CONFIG } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  listLoyaltyResource,
  saveLoyaltyResource,
} from "@/services/loyaltyService";
import type { LoyaltyRow } from "@/types/loyalty";
import ActionResultModal from "@/components/ui/ActionResultModal";
import {
  EmptyState,
  ErrorState,
  formatCurrency,
  formatDate,
  formatPoint,
  LoadingState,
  Panel,
  primaryButton,
  relationLabel,
  secondaryButton,
  StatusBadge,
} from "./LoyaltyUI";

export type SettingsSection = "periods" | "rules" | "rewards";
const sections: { key: SettingsSection; label: string }[] = [
  { key: "periods", label: "Periods" },
  { key: "rules", label: "Point Rules" },
  { key: "rewards", label: "Rewards" },
];
const endpoints = {
  periods: API_CONFIG.ENDPOINTS.LOYALTY_PERIOD,
  rules: API_CONFIG.ENDPOINTS.LOYALTY_RULE,
  rewards: API_CONFIG.ENDPOINTS.LOYALTY_REWARD,
};

const emptyForm = (section: SettingsSection): LoyaltyRow =>
  section === "periods"
    ? {
        name: "",
        date_from: "",
        date_to: "",
        expiry_mode: "NEVER",
        expiry_months: "",
        point_ready: "IMMEDIATE",
        status: "OPEN",
      }
    : section === "rules"
      ? { name: "", date_from: "", date_to: "", status: "ACTIVE" }
      : {
          name: "",
          reward_type: "ITEM",
          point_required: "",
          quota: "",
          valid_from: "",
          valid_to: "",
          requires_approval: true,
          status: "ACTIVE",
        };

export default function LoyaltySettings({
  section,
}: {
  section: SettingsSection;
}) {
  const { token, isAuthenticated, hasPermission } = useAuth();
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<LoyaltyRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [selectedRule, setSelectedRule] = useState<LoyaltyRow | null>(null);
  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const response = await listLoyaltyResource(endpoints[section], token, {
        perPage: 200,
        orderBy: [[section === "periods" ? "date_from" : "created_at", "desc"]],
      });
      setRows(response.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, section, token]);
  useEffect(() => {
    setEditing(null);
    setSelectedRule(null);
    void load();
  }, [load]);
  const save = async (payload: LoyaltyRow) => {
    if (!token) return;
    setSaving(true);
    try {
      const id = editing?.id ?? (editing?.name ? editing.name : undefined);
      const response = await saveLoyaltyResource(
        endpoints[section],
        token,
        payload,
        id as string | number | undefined,
      );
      setResult({ type: "success", message: response.message });
      setEditing(null);
      await load();
    } catch (err) {
      setResult({
        type: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSaving(false);
    }
  };
  const canManage = hasPermission("loyalty_settings.update");
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-xl border bg-white p-1.5">
          {sections.map((item) => (
            <Link
              key={item.key}
              href={`/customer/loyalty-point/settings/${item.key}`}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${section === item.key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {canManage && (
          <button
            onClick={() => setEditing(emptyForm(section))}
            className={primaryButton}
          >
            <FaPlus /> Add{" "}
            {sections.find((item) => item.key === section)?.label}
          </button>
        )}
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={() => void load()} />
      ) : (
        <SettingsTable
          section={section}
          rows={rows}
          canManage={canManage}
          edit={setEditing}
          selectRule={setSelectedRule}
        />
      )}
      {selectedRule && (
        <RuleDetails rule={selectedRule} close={() => setSelectedRule(null)} />
      )}
      {editing && (
        <SettingsModal
          section={section}
          initial={editing}
          saving={saving}
          close={() => !saving && setEditing(null)}
          save={save}
        />
      )}
      <ActionResultModal
        isOpen={Boolean(result)}
        type={result?.type}
        title={result?.type === "success" ? "Berhasil" : "Gagal menyimpan"}
        message={result?.message ?? ""}
        onClose={() => setResult(null)}
      />
    </div>
  );
}

function SettingsTable({
  section,
  rows,
  canManage,
  edit,
  selectRule,
}: {
  section: SettingsSection;
  rows: LoyaltyRow[];
  canManage: boolean;
  edit: (row: LoyaltyRow) => void;
  selectRule: (row: LoyaltyRow) => void;
}) {
  const headers =
    section === "periods"
      ? [
          "Name",
          "Date From",
          "Date To",
          "Expiry Mode",
          "Expiry Months",
          "Point Ready",
          "Status",
          "Action",
        ]
      : section === "rules"
        ? ["Rule Name", "Valid Period / Date", "Status", "Action"]
        : [
            "Reward Name",
            "Reward Type",
            "Point Required",
            "Quota",
            "Remaining Quota",
            "Valid From",
            "Valid To",
            "Requires Approval",
            "Status",
            "Action",
          ];
  return (
    <Panel>
      {rows.length === 0 ? (
        <EmptyState
          title={`No ${sections.find((item) => item.key === section)?.label} Found`}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                {headers.map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={String(row.id ?? row.name)}>
                  {section === "periods" ? (
                    <>
                      <td className="px-4 py-4 font-semibold">
                        {String(row.name ?? "-")}
                      </td>
                      <td className="px-4 py-4">{formatDate(row.date_from)}</td>
                      <td className="px-4 py-4">{formatDate(row.date_to)}</td>
                      <td className="px-4 py-4">
                        {String(row.expiry_mode ?? "-").replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-4">
                        {String(row.expiry_mode) === "DURATION"
                          ? String(row.expiry_months ?? "-")
                          : "-"}
                      </td>
                      <td className="px-4 py-4">
                        {String(row.point_ready ?? "-").replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={String(row.status ?? "-")} />
                      </td>
                    </>
                  ) : section === "rules" ? (
                    <>
                      <td className="px-4 py-4 font-semibold">
                        {String(row.rule_name ?? row.name ?? "-")}
                      </td>
                      <td className="px-4 py-4">
                        {relationLabel(
                          row.period_name ?? row.period,
                          `${formatDate(row.date_from)} - ${formatDate(row.date_to)}`,
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={String(row.status ?? "-")} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-4 font-semibold">
                        {String(row.reward_name ?? row.name ?? "-")}
                      </td>
                      <td className="px-4 py-4">
                        {String(row.reward_type ?? "-")}
                      </td>
                      <td className="px-4 py-4">
                        {formatPoint(row.point_required, true)}
                      </td>
                      <td className="px-4 py-4">{formatPoint(row.quota)}</td>
                      <td className="px-4 py-4">
                        {formatPoint(
                          row.remaining_quota ??
                            Number(row.quota ?? 0) -
                              Number(row.used_quota ?? 0),
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {formatDate(row.valid_from)}
                      </td>
                      <td className="px-4 py-4">{formatDate(row.valid_to)}</td>
                      <td className="px-4 py-4">
                        {row.requires_approval ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={String(row.status ?? "-")} />
                      </td>
                    </>
                  )}
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {section === "rules" && (
                        <button
                          className={secondaryButton}
                          onClick={() => selectRule(row)}
                        >
                          Manage Divider
                        </button>
                      )}
                      {canManage && (
                        <button
                          className={primaryButton}
                          onClick={() => edit({ ...row })}
                        >
                          <FaEdit /> Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function SettingsModal({
  section,
  initial,
  saving,
  close,
  save,
}: {
  section: SettingsSection;
  initial: LoyaltyRow;
  saving: boolean;
  close: () => void;
  save: (row: LoyaltyRow) => Promise<void>;
}) {
  const [form, setForm] = useState<LoyaltyRow>({ ...initial });
  const update = (key: string, value: unknown) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...form };
    delete payload.id;
    if (section === "periods" && payload.expiry_mode !== "DURATION")
      delete payload.expiry_months;
    void save(payload);
  };
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-bold">
            {initial.id || (initial.name && section !== "periods")
              ? "Edit"
              : "Add"}{" "}
            {sections.find((item) => item.key === section)?.label}
          </h3>
          <button type="button" onClick={close}>
            <FaTimes />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <Input
            label={
              section === "rules"
                ? "Rule Name"
                : section === "rewards"
                  ? "Reward Name"
                  : "Name"
            }
            value={form.rule_name ?? form.reward_name ?? form.name}
            onChange={(v) =>
              update(
                section === "rules"
                  ? "rule_name"
                  : section === "rewards"
                    ? "reward_name"
                    : "name",
                v,
              )
            }
            required
          />
          {section === "periods" && (
            <>
              <Input
                label="Date From"
                type="date"
                value={form.date_from}
                onChange={(v) => update("date_from", v)}
                required
              />
              <Input
                label="Date To"
                type="date"
                value={form.date_to}
                onChange={(v) => update("date_to", v)}
                required
              />
              <Select
                label="Expiry Mode"
                value={form.expiry_mode}
                options={["NEVER", "DURATION", "PERIOD_END"]}
                onChange={(v) => update("expiry_mode", v)}
              />
              {form.expiry_mode === "DURATION" && (
                <Input
                  label="Expiry Months"
                  type="number"
                  value={form.expiry_months}
                  onChange={(v) => update("expiry_months", Number(v))}
                  required
                />
              )}
              <Select
                label="Point Ready"
                value={form.point_ready}
                options={["IMMEDIATE", "AFTER_PERIOD_END"]}
                onChange={(v) => update("point_ready", v)}
              />
              <Select
                label="Status"
                value={form.status}
                options={["OPEN", "CLOSED", "INACTIVE"]}
                onChange={(v) => update("status", v)}
              />
            </>
          )}
          {section === "rules" && (
            <>
              <Input
                label="Valid From"
                type="date"
                value={form.date_from}
                onChange={(v) => update("date_from", v)}
              />
              <Input
                label="Valid To"
                type="date"
                value={form.date_to}
                onChange={(v) => update("date_to", v)}
              />
              <Select
                label="Status"
                value={form.status}
                options={["ACTIVE", "INACTIVE"]}
                onChange={(v) => update("status", v)}
              />
            </>
          )}
          {section === "rewards" && (
            <>
              <Select
                label="Reward Type"
                value={form.reward_type}
                options={["ITEM", "VOUCHER", "OTHER"]}
                onChange={(v) => update("reward_type", v)}
              />
              <Input
                label="Point Required"
                type="number"
                value={form.point_required}
                onChange={(v) => update("point_required", Number(v))}
                required
              />
              <Input
                label="Quota"
                type="number"
                value={form.quota}
                onChange={(v) => update("quota", Number(v))}
              />
              <Input
                label="Valid From"
                type="date"
                value={form.valid_from}
                onChange={(v) => update("valid_from", v)}
              />
              <Input
                label="Valid To"
                type="date"
                value={form.valid_to}
                onChange={(v) => update("valid_to", v)}
              />
              <Select
                label="Status"
                value={form.status}
                options={["ACTIVE", "INACTIVE"]}
                onChange={(v) => update("status", v)}
              />
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={Boolean(form.requires_approval)}
                  onChange={(e) =>
                    update("requires_approval", e.target.checked)
                  }
                />{" "}
                Requires Approval
              </label>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button
            type="button"
            onClick={close}
            disabled={saving}
            className={secondaryButton}
          >
            Cancel
          </button>
          <button type="submit" disabled={saving} className={primaryButton}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function RuleDetails({ rule, close }: { rule: LoyaltyRow; close: () => void }) {
  const { token, isAuthenticated, hasPermission } = useAuth();
  const [rows, setRows] = useState<LoyaltyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LoyaltyRow | null>(null);
  const ruleId = String(rule.id ?? rule.name);
  const load = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setLoading(true);
    try {
      const response = await listLoyaltyResource(
        API_CONFIG.ENDPOINTS.LOYALTY_RULE_DETAIL,
        token,
        { perPage: 200, filters: [["rule_id", "=", ruleId]] },
      );
      setRows(response.rows);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, ruleId, token]);
  useEffect(() => void load(), [load]);
  const save = async (payload: LoyaltyRow) => {
    if (!token) return;
    const id = editing?.id as string | number | undefined;
    await saveLoyaltyResource(
      API_CONFIG.ENDPOINTS.LOYALTY_RULE_DETAIL,
      token,
      { ...payload, rule_id: ruleId },
      id,
    );
    setEditing(null);
    await load();
  };
  return (
    <div className="fixed inset-0 z-[75] overflow-y-auto bg-black/40 p-4">
      <div className="mx-auto my-8 max-w-4xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-lg font-bold">
              {String(rule.rule_name ?? rule.name)}
            </h3>
            <p className="text-sm text-gray-500">
              Standard Divider per Sales Account
            </p>
          </div>
          <button onClick={close}>
            <FaTimes />
          </button>
        </div>
        <div className="p-5">
          {hasPermission("loyalty_settings.update") && (
            <div className="mb-4 flex justify-end">
              <button
                className={primaryButton}
                onClick={() =>
                  setEditing({
                    sales_account: "",
                    standard_divider: "",
                    status: "ACTIVE",
                  })
                }
              >
                <FaPlus /> Add Divider
              </button>
            </div>
          )}
          {loading ? (
            <LoadingState />
          ) : rows.length === 0 ? (
            <EmptyState title="No Divider Configured" />
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Sales Account</th>
                    <th className="px-4 py-3">Standard Divider</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row) => (
                    <tr key={String(row.id ?? row.name)}>
                      <td className="px-4 py-4 font-semibold">
                        {relationLabel(row.sales_account)}
                      </td>
                      <td className="px-4 py-4">
                        <p>{formatCurrency(row.standard_divider)}</p>
                        <p className="text-xs text-gray-500">
                          Setiap {formatCurrency(row.standard_divider)} omzet
                          menghasilkan 1 Point.
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={String(row.status ?? "-")} />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          className={secondaryButton}
                          onClick={() => setEditing({ ...row })}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {editing && (
        <DividerModal
          initial={editing}
          close={() => setEditing(null)}
          save={save}
        />
      )}
    </div>
  );
}

function DividerModal({
  initial,
  close,
  save,
}: {
  initial: LoyaltyRow;
  close: () => void;
  save: (row: LoyaltyRow) => Promise<void>;
}) {
  const [form, setForm] = useState({ ...initial });
  const [saving, setSaving] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.id;
      await save(payload);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
      >
        <h3 className="mb-4 text-lg font-bold">Sales Account Divider</h3>
        <div className="space-y-4">
          <Input
            label="Sales Account"
            value={relationLabel(form.sales_account, "")}
            onChange={(v) => setForm((x) => ({ ...x, sales_account: v }))}
            required
          />
          <Input
            label="Standard Divider"
            type="number"
            value={form.standard_divider}
            onChange={(v) =>
              setForm((x) => ({ ...x, standard_divider: Number(v) }))
            }
            required
          />
          <Select
            label="Status"
            value={form.status}
            options={["ACTIVE", "INACTIVE"]}
            onChange={(v) => setForm((x) => ({ ...x, status: v }))}
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className={secondaryButton} onClick={close}>
            Cancel
          </button>
          <button disabled={saving} className={primaryButton}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: unknown;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value == null ? "" : String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
      />
    </label>
  );
}
function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: unknown;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-gray-700">
        {label}
      </span>
      <select
        value={String(value ?? options[0])}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
