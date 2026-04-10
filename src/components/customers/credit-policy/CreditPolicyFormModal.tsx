"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaExclamationTriangle, FaFileInvoiceDollar, FaSave, FaTimes } from "react-icons/fa";
import type {
  CreditPolicyListItem,
  CreditPolicyLookups,
  EntityOption,
} from "./CreditPolicyList";

type EntityType = "nbid" | "gpid" | "gcid" | "bcid";

interface CreditPolicyFormModalProps {
  open: boolean;
  onClose: () => void;
  initial?: CreditPolicyListItem | null;
  lookups: CreditPolicyLookups;
  saving?: boolean;
  onSave: (payload: {
    id?: number;
    entityType: EntityType;
    entityId: number;
    creditLimit: number;
    paymentTerm: number;
    limitCustomerOverdue: number;
    isActive: boolean;
  }) => Promise<void>;
}

const ENTITY_TYPE_OPTIONS: Array<{ value: EntityType; label: string }> = [
  { value: "nbid", label: "National Brand" },
  { value: "gpid", label: "Group Parent" },
  { value: "gcid", label: "Group Customer" },
  { value: "bcid", label: "Branch Customer" },
];

function formatIntegerWithThousands(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function normalizeCreditLimitInput(value: string): string {
  const sanitized = value.replace(/[^0-9.,]/g, "");
  if (!sanitized) return "";

  if (!sanitized.includes(",")) {
    return formatIntegerWithThousands(sanitized.replace(/\./g, ""));
  }

  const withoutDots = sanitized.replace(/\./g, "");
  const [rawIntegerPart = "", ...rawDecimalParts] = withoutDots.split(",");
  const formattedIntegerPart = formatIntegerWithThousands(rawIntegerPart);
  const decimalPart = rawDecimalParts.join("").replace(/\D/g, "");

  if (sanitized.endsWith(",") && !decimalPart) {
    return `${formattedIntegerPart},`;
  }

  return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
}

function formatCreditLimitInitial(value: string): string {
  if (!value) return "";
  const [integerPart = "", decimalPart = ""] = value.split(".");
  const formattedIntegerPart = formatIntegerWithThousands(integerPart);
  return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
}

function parseCreditLimitInput(value: string): number {
  const sanitized = value.replace(/[^0-9.,]/g, "").trim();
  if (!sanitized) return 0;

  const hasComma = sanitized.includes(",");
  const hasDot = sanitized.includes(".");

  let normalized = sanitized;
  if (hasComma && hasDot) {
    const lastComma = sanitized.lastIndexOf(",");
    const lastDot = sanitized.lastIndexOf(".");
    if (lastComma > lastDot) {
      normalized = sanitized.replace(/\./g, "").replace(/,/g, ".");
    } else {
      normalized = sanitized.replace(/,/g, "");
    }
  } else if (hasComma) {
    normalized = sanitized.replace(/\./g, "").replace(/,/g, ".");
  } else {
    const dotMatches = sanitized.match(/\./g) || [];
    if (dotMatches.length > 1) {
      normalized = sanitized.replace(/\./g, "");
    }
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function optionsForEntityType(
  entityType: EntityType,
  lookups: CreditPolicyLookups,
): EntityOption[] {
  return lookups[entityType] || [];
}

export function CreditPolicyFormModal({
  open,
  onClose,
  initial,
  lookups,
  onSave,
  saving = false,
}: CreditPolicyFormModalProps) {
  const isEditing = Boolean(initial);
  const [entityType, setEntityType] = useState<EntityType>("nbid");
  const [entityId, setEntityId] = useState("");
  const [creditLimitInput, setCreditLimitInput] = useState("");
  const [paymentTerm, setPaymentTerm] = useState("");
  const [limitCustomerOverdue, setLimitCustomerOverdue] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (initial) {
      setEntityType(initial.entityType);
      setEntityId(String(initial.entityId));
      setCreditLimitInput(formatCreditLimitInitial(String(initial.creditLimit)));
      setPaymentTerm(String(initial.paymentTerm));
      setLimitCustomerOverdue(String(initial.limitCustomerOverdue));
      setIsActive(initial.isActive);
      return;
    }
    setEntityType("nbid");
    setEntityId("");
    setCreditLimitInput("");
    setPaymentTerm("");
    setLimitCustomerOverdue("0");
    setIsActive(true);
  }, [initial, open]);

  const entityOptions = useMemo(
    () => optionsForEntityType(entityType, lookups),
    [entityType, lookups],
  );

  useEffect(() => {
    if (!open) return;
    if (initial && entityType === initial.entityType) return;
    setEntityId("");
  }, [entityType, initial, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedEntityId = Number(entityId || 0);
    const parsedCreditLimit = parseCreditLimitInput(creditLimitInput);
    const parsedPaymentTerm = Number(paymentTerm || 0);
    const parsedOverdueLimit = Number(limitCustomerOverdue || 0);

    if (!parsedEntityId) {
      setError("Entity wajib dipilih.");
      return;
    }
    if (!Number.isFinite(parsedCreditLimit) || parsedCreditLimit <= 0) {
      setError("Credit limit wajib diisi dengan angka valid dan tidak boleh negatif.");
      return;
    }
    if (!Number.isInteger(parsedPaymentTerm) || parsedPaymentTerm < 0) {
      setError("Payment term harus berupa angka bulat 0 atau lebih.");
      return;
    }
    if (!Number.isInteger(parsedOverdueLimit) || parsedOverdueLimit < 0) {
      setError("Limit customer overdue harus berupa angka bulat 0 atau lebih.");
      return;
    }

    try {
      await onSave({
        id: initial?.id,
        entityType,
        entityId: parsedEntityId,
        creditLimit: parsedCreditLimit,
        paymentTerm: parsedPaymentTerm,
        limitCustomerOverdue: parsedOverdueLimit,
        isActive,
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Gagal menyimpan credit policy");
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                <FaFileInvoiceDollar className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditing ? "Edit Credit Policy" : "Tambah Credit Policy"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditing
                    ? "Perbarui credit limit dan payment term pada policy ini"
                    : "Atur limit kredit dan payment term per entity customer"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5 p-6">
            {error ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <FaExclamationTriangle className="mt-0.5" />
                <span>{error}</span>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Entity Type</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as EntityType)}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
                >
                  {ENTITY_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Entity</label>
                <select
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  disabled={saving}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
                >
                  <option value="">Pilih entity</option>
                  {entityOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Credit Limit</label>
                <input
                  type="text"
                  value={creditLimitInput}
                  onChange={(e) => setCreditLimitInput(normalizeCreditLimitInput(e.target.value))}
                  disabled={saving}
                  placeholder="Contoh: 1000000,50"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Payment Term</label>
                <input
                  type="number"
                  min="0"
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value)}
                  disabled={saving}
                  placeholder="Hari"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Limit Customer Overdue</label>
                <input
                  type="number"
                  min="0"
                  value={limitCustomerOverdue}
                  onChange={(e) => setLimitCustomerOverdue(e.target.value)}
                  disabled={saving}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  id="credit-policy-active"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={saving}
                  className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
                />
                <label htmlFor="credit-policy-active" className="text-sm font-semibold text-gray-700">
                  Jadikan policy aktif
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSave className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
