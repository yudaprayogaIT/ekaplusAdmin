"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { REJECTION_REASONS } from "@/types/customerRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import ActionResultModal from "@/components/ui/ActionResultModal";

interface CustomerRegisterAddressApiResponse {
  id: number;
  parent_id: number;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  postal_code?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
}

interface RejectRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: () => void;
}

function normalizePhone(value?: string): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  return digits || undefined;
}

export function RejectRegistrationModal({
  isOpen,
  onClose,
  registration,
  onSuccess,
}: RejectRegistrationModalProps) {
  const { token } = useAuth();
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form when modal opens with new registration
  useEffect(() => {
    if (isOpen && registration) {
      setSelectedReason("");
      setNotes("");
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, registration]);

  const handleSubmit = async () => {
    // Validation
    if (!selectedReason) {
      setError("Silakan pilih alasan reject");
      return;
    }

    if (!registration || !token) {
      setError("Data tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedLabel =
        REJECTION_REASONS.find((r) => r.code === selectedReason)?.label || selectedReason;
      const notesText = notes.trim();
      const shippingSpec = {
        fields: ["*"],
        filters: [
          ["parent_id", "=", Number(registration.id)],
          ["parent_type", "=", "customer_register"],
        ],
      };
      const shippingRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, shippingSpec),
        { method: "GET", cache: "no-store" },
        token
      );
      const shippingJson = shippingRes.ok ? await shippingRes.json().catch(() => null) : null;
      const shippingRows: CustomerRegisterAddressApiResponse[] = Array.isArray(shippingJson?.data)
        ? shippingJson.data
        : [];
      const effectiveShippingAddresses: CustomerRegisterAddressApiResponse[] =
        registration.same_as_company_address
          ? shippingRows.length > 0
            ? shippingRows
            : [
                {
                  id: -1,
                  parent_id: Number(registration.id),
                  label: "Alamat Perusahaan",
                  address: registration.address.full_address,
                  city: registration.address.city_name,
                  province: registration.address.province_name,
                  district: registration.address.district_name,
                  postal_code: registration.address.postal_code,
                  pic_name:
                    registration.branch_owner?.full_name || registration.user.full_name,
                  pic_phone:
                    registration.branch_owner?.phone || registration.user.phone,
                  is_default: 1,
                },
              ]
          : shippingRows;
      const shippingPayload = effectiveShippingAddresses.map((addr) => ({
        label: addr.label || "Warehouse",
        pic_name: addr.pic_name || undefined,
        pic_phone: normalizePhone(addr.pic_phone || undefined),
        address: addr.address || "",
        city: addr.city || "",
        district: addr.district || "",
        postal_code: addr.postal_code || "",
        province: addr.province || "",
        is_default: addr.is_default ? 1 : undefined,
      }));
      const url = getQueryUrl(
        `${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`,
        { fields: ["*"] }
      );
      const payload = {
        status: "Rejected",
        docstatus: 0,
        nbid: null,
        gpid: null,
        gcid: null,
        bcid: null,
        reject_reason: selectedLabel,
        reject_notes: notesText || null,
        rejection_reason: selectedLabel,
        rejection_notes: notesText || null,
        customer_shipping_address: shippingPayload,
      };
      const res = await apiFetch(
        url,
        {
          method: "PUT",
          cache: "no-store",
          body: JSON.stringify(payload),
        },
        token
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const message =
          json && typeof json === "object" && "message" in json && typeof json.message === "string"
            ? json.message
            : `Gagal reject registrasi (${res.status})`;
        throw new Error(message);
      }

      // Trigger update events
      window.dispatchEvent(
        new Event("ekatalog:customer_registrations_update")
      );

      setSuccessMessage(
        `Registrasi "${registration.company.name}" berhasil di-reject.\nAlasan: ${selectedLabel}${
          notesText ? `\nCatatan: ${notesText}` : ""
        }`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal reject registrasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex items-center gap-3">
              <FaTimesCircle className="w-7 h-7 text-white" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  Reject Registrasi Customer
                </h2>
                <p className="text-sm text-red-100 mt-0.5">
                  Tolak pengajuan registrasi member
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Warning Banner */}
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <FaExclamationTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-900">
                    Perhatian!
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Anda akan menolak registrasi dari{" "}
                    <span className="font-bold">{registration.company.name}</span>
                    . Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              {/* Rejection Reason Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alasan Reject <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => {
                    setSelectedReason(e.target.value);
                    setError(null);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                >
                  <option value="">-- Pilih Alasan --</option>
                  {REJECTION_REASONS.map((reason) => (
                    <option key={reason.code} value={reason.code}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tambahkan catatan atau penjelasan tambahan..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Catatan ini akan disimpan sebagai keterangan reject
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Batal
              </button>

              <motion.button
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="w-4 h-4" />
                    <span>Reject Registrasi</span>
                  </>
                )}
              </motion.button>
            </div>
            </motion.div>
          </div>
          <ActionResultModal
            isOpen={Boolean(successMessage)}
            type="success"
            title="Reject Berhasil"
            message={successMessage || ""}
            onClose={() => {
              setSuccessMessage(null);
              onSuccess();
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
