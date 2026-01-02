"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowLeft,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { getApiUrl, API_CONFIG, apiFetch } from "@/config/api";

interface ApproveRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: () => void;
}

export function ApproveRegistrationModal({
  isOpen,
  onClose,
  registration,
  onSuccess,
}: ApproveRegistrationModalProps) {
  const { token } = useAuth();

  // Form state
  const [gpName, setGpName] = useState("");
  const [isCheckingGP, setIsCheckingGP] = useState(false);
  const [gpExists, setGpExists] = useState<boolean | null>(null);
  const [existingGPId, setExistingGPId] = useState<number | null>(null);
  const [createNewGP, setCreateNewGP] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  // Reset form when modal opens with new registration
  useEffect(() => {
    if (isOpen && registration) {
      setGpName(registration.company.name);
      setIsCheckingGP(false);
      setGpExists(null);
      setExistingGPId(null);
      setCreateNewGP(true);
      setIsSubmitting(false);
      setError(null);
      setStep(1);
    }
  }, [isOpen, registration]);

  // Auto-generated names for GC and BC
  const gcName = registration?.company.name || "";
  const bcName = registration
    ? `${registration.company.name} - ${registration.company.branch_city}`
    : "";

  const handleCheckGP = async () => {
    if (!gpName.trim()) {
      setError("GP Name tidak boleh kosong");
      return;
    }

    setIsCheckingGP(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is ready
      // For now, simulate GP check with static data
      const url = getApiUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_CHECK_GP);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate checking - for demo, GP exists if name contains "PT" and "Maju"
      const exists = gpName.includes("PT") && gpName.includes("Maju");
      setGpExists(exists);
      setExistingGPId(exists ? 1 : null);

      if (exists) {
        // If GP exists, default to linking (not creating new)
        setCreateNewGP(false);
      }

      // Move to confirmation step
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengecek GP existence"
      );
    } finally {
      setIsCheckingGP(false);
    }
  };

  const handleSubmitApproval = async () => {
    if (!registration || !token) {
      setError("Data tidak lengkap");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is ready
      const url = getApiUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_APPROVE);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log("[ApproveRegistrationModal] Approving registration:", {
        registration_id: registration.id,
        gp_name: gpName,
        create_new_gp: createNewGP,
        existing_gp_id: createNewGP ? undefined : existingGPId,
        gc_name: gcName,
        bc_name: bcName,
        // Owner data (will be copied to GP/GC/BC)
        owner_name: registration.user.full_name,
        owner_phone: registration.user.phone,
        owner_email: registration.user.email,
      });

      // Trigger update events for all affected entities
      window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
      window.dispatchEvent(new Event("ekatalog:gp_update"));
      window.dispatchEvent(new Event("ekatalog:gc_update"));
      window.dispatchEvent(new Event("ekatalog:bc_update"));

      // Show success message
      alert(
        `Registrasi "${registration.company.name}" berhasil diapprove!\n\n` +
          `GP: ${gpName} ${
            createNewGP ? "(Dibuat Baru)" : "(Link ke Existing)"
          }\n` +
          `GC: ${gcName}\n` +
          `BC: ${bcName}`
      );

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal approve registrasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registration) return null;

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
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-5 flex items-center gap-3">
              <FaCheckCircle className="w-7 h-7 text-white" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  Approve Registrasi Customer
                </h2>
                <p className="text-sm text-green-100 mt-0.5">
                  {step === 1
                    ? "Step 1: Verifikasi GP (Global Party)"
                    : "Step 2: Konfirmasi Approval"}
                </p>
              </div>
              {/* Step Indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 1
                      ? "bg-white text-green-600"
                      : "bg-green-400 text-white"
                  }`}
                >
                  1
                </div>
                <div className="w-8 h-0.5 bg-green-300" />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 2
                      ? "bg-white text-green-600"
                      : "bg-green-400 text-white"
                  }`}
                >
                  2
                </div>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Company Info Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  Registrasi Customer
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {registration.company.name}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <FaBuilding className="w-3.5 h-3.5" />
                    <span>{registration.company.business_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-3.5 h-3.5" />
                    <span>{registration.company.branch_name}</span>
                  </div>
                </div>
              </div>

              {/* Step 1: GP Name Input & Check */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Global Party (GP) Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={gpName}
                      onChange={(e) => {
                        setGpName(e.target.value);
                        setError(null);
                        setGpExists(null);
                      }}
                      placeholder="Masukkan nama Global Party"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      disabled={isCheckingGP}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Nama GP biasanya sama dengan nama perusahaan. Sistem akan
                      mengecek apakah GP sudah ada di database.
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <FaInfoCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 text-sm text-blue-900">
                      <p className="font-semibold mb-1">
                        Apa itu Global Party (GP)?
                      </p>
                      <p className="text-blue-700">
                        GP adalah entitas bisnis unik yang mewakili satu
                        perusahaan/badan usaha. Satu GP dapat memiliki banyak
                        Global Customer (GC) dan Branch Customer (BC).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Confirmation & Preview */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* GP Status */}
                  {gpExists ? (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-yellow-900">
                            GP Sudah Ada di Database
                          </p>
                          <p className="text-sm text-yellow-700 mt-1">
                            GP dengan nama &quot;{gpName}&quot; sudah terdaftar
                            (ID: #{existingGPId}). Pilih tindakan:
                          </p>

                          {/* Radio Options */}
                          <div className="mt-3 space-y-2">
                            <label className="flex items-start gap-3 p-3 bg-white border-2 border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-50 transition-all">
                              <input
                                type="radio"
                                name="gp-action"
                                checked={!createNewGP}
                                onChange={() => setCreateNewGP(false)}
                                className="mt-0.5 w-4 h-4 text-green-600"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">
                                  Link ke GP yang sudah ada (Recommended)
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Hubungkan registrasi ini ke GP yang sudah ada
                                </p>
                              </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 bg-white border-2 border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-50 transition-all">
                              <input
                                type="radio"
                                name="gp-action"
                                checked={createNewGP}
                                onChange={() => setCreateNewGP(true)}
                                className="mt-0.5 w-4 h-4 text-green-600"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">
                                  Buat GP baru dengan nama berbeda
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Kembali ke step 1 untuk mengubah nama GP
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-start gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-green-900">
                          GP Belum Ada - Akan Dibuat Baru
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          GP dengan nama &quot;{gpName}&quot; belum terdaftar.
                          Sistem akan membuat GP baru secara otomatis.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Preview Data yang Akan Dibuat */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaInfoCircle className="w-4 h-4 text-blue-600" />
                      Preview Data yang Akan Dibuat
                    </h3>

                    <div className="space-y-3">
                      {/* GP Preview */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-purple-700">
                              GP
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Global Party
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {gpName}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              createNewGP
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {createNewGP ? "Buat Baru" : "Link Existing"}
                          </span>
                        </div>
                      </div>

                      {/* GC Preview */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-700">
                              GC
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Global Customer
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {gcName}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                            Buat Baru
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 pl-10">
                          Linked to GP: {gpName}
                        </p>
                      </div>

                      {/* BC Preview */}
                      <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-orange-700">
                              BC
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Branch Customer
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {bcName}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                            Buat Baru
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 pl-10">
                          Linked to GC: {gcName} • Branch:{" "}
                          {registration.company.branch_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between gap-3 border-t border-gray-200">
              {step === 1 ? (
                <>
                  <button
                    onClick={onClose}
                    disabled={isCheckingGP}
                    className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Batal
                  </button>

                  <motion.button
                    whileHover={!isCheckingGP ? { scale: 1.02 } : {}}
                    whileTap={!isCheckingGP ? { scale: 0.98 } : {}}
                    onClick={handleCheckGP}
                    disabled={isCheckingGP}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isCheckingGP ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengecek GP...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="w-4 h-4" />
                        <span>Cek & Lanjut</span>
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>

                  <motion.button
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    onClick={handleSubmitApproval}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="w-4 h-4" />
                        <span>Approve Registrasi</span>
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
