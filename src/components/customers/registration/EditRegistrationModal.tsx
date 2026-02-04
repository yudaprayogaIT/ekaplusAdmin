"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl, API_CONFIG, apiFetch } from "@/config/api";

interface EditRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: () => void;
}

export function EditRegistrationModal({
  isOpen,
  onClose,
  registration,
  onSuccess,
}: EditRegistrationModalProps) {
  const { token } = useAuth();

  // Form state - Owner Info
  const [ownerFullName, setOwnerFullName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  // Form state - Company Info
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchCity, setBranchCity] = useState("");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens with new registration
  useEffect(() => {
    if (isOpen && registration) {
      // Owner data
      setOwnerFullName(registration.user.full_name);
      setOwnerPhone(registration.user.phone);
      setOwnerEmail(registration.user.email);

      // Company data
      setCompanyName(registration.company.name);
      setBusinessType(registration.company.business_type);
      setBranchName(registration.company.branch_name);
      setBranchCity(registration.company.branch_city);

      setError(null);
    }
  }, [isOpen, registration]);

  if (!registration) return null;

  const handleSave = async () => {
    // Validation
    if (!ownerFullName.trim()) {
      setError("Nama owner tidak boleh kosong");
      return;
    }
    if (!ownerPhone.trim()) {
      setError("Nomor telepon tidak boleh kosong");
      return;
    }
    if (!ownerEmail.trim()) {
      setError("Email tidak boleh kosong");
      return;
    }
    if (!companyName.trim()) {
      setError("Nama perusahaan tidak boleh kosong");
      return;
    }
    if (!businessType.trim()) {
      setError("Tipe bisnis tidak boleh kosong");
      return;
    }
    if (!branchName.trim()) {
      setError("Nama cabang tidak boleh kosong");
      return;
    }
    if (!branchCity.trim()) {
      setError("Kota cabang tidak boleh kosong");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is ready
      const url = getApiUrl(
        `${API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER}/${registration.id}`
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      console.log("[EditRegistrationModal] Updating registration:", {
        id: registration.id,
        user: {
          full_name: ownerFullName,
          phone: ownerPhone,
          email: ownerEmail,
        },
        company: {
          name: companyName,
          business_type: businessType,
          branch_name: branchName,
          branch_city: branchCity,
        },
      });

      // Trigger update event
      window.dispatchEvent(
        new Event("ekatalog:customer_registrations_update")
      );

      alert(
        `Registrasi "${companyName}" berhasil diupdate!\n\n` +
          `Data telah disimpan dan siap untuk di-review kembali.`
      );

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal update registrasi"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    return (
      ownerFullName !== registration.user.full_name ||
      ownerPhone !== registration.user.phone ||
      ownerEmail !== registration.user.email ||
      companyName !== registration.company.name ||
      businessType !== registration.company.business_type ||
      branchName !== registration.company.branch_name ||
      branchCity !== registration.company.branch_city
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaEdit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Edit Data Registrasi
                  </h2>
                  <p className="text-sm text-orange-100">
                    ID: #{registration.id}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Info Banner */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <FaExclamationTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm text-blue-900">
                  <p className="font-semibold mb-1">
                    Edit Data Sebelum Approval
                  </p>
                  <p className="text-blue-700">
                    Pastikan data sudah sesuai dengan hasil verifikasi telepon.
                    Anda dapat memperbaiki format nama PT dan data lainnya
                    sebelum melakukan approval.
                  </p>
                </div>
              </div>

              {/* Owner Information Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  Informasi Owner
                </h3>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ownerFullName}
                      onChange={(e) => setOwnerFullName(e.target.value)}
                      placeholder="Masukkan nama lengkap owner"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="+62812-xxxx-xxxx"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Company Information Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" />
                  Informasi Perusahaan
                </h3>

                <div className="space-y-4">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Contoh: PT Maju Jaya"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Pastikan format nama sudah sesuai (contoh: PT, CV, UD,
                      dll)
                    </p>
                  </div>

                  {/* Business Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipe Bisnis <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      placeholder="Contoh: Retail, Distributor, Wholesaler"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Branch Information Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  Informasi Cabang
                </h3>

                <div className="space-y-4">
                  {/* Branch Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Cabang <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      placeholder="Contoh: Cabang Jakarta Pusat"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Branch City */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kota Cabang <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={branchCity}
                      onChange={(e) => setBranchCity(e.target.value)}
                      placeholder="Contoh: Jakarta"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Changes Indicator */}
              {hasChanges() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-700 font-medium">
                    Ada perubahan yang belum disimpan
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between gap-3 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FaTimes className="w-4 h-4" />
                Batal
              </button>

              <motion.button
                whileHover={!isSaving ? { scale: 1.02 } : {}}
                whileTap={!isSaving ? { scale: 0.98 } : {}}
                onClick={handleSave}
                disabled={isSaving || !hasChanges()}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
