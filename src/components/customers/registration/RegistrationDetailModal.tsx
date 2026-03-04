"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { EditRegistrationModal } from "./EditRegistrationModal";
import { motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import {
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaLink,
  FaDatabase,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";

interface RegistrationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onApprove?: (registration: CustomerRegistration) => void;
  onReject?: (registration: CustomerRegistration) => void;
  onEdit?: () => void;
}

interface CustomerRegisterAddressApiResponse {
  id: number;
  parent_id: number;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  postal_code?: string | null;
  country?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
}

export function RegistrationDetailModal({
  isOpen,
  onClose,
  registration,
  onApprove,
  onReject,
  onEdit,
}: RegistrationDetailModalProps) {
  const { token } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<
    CustomerRegisterAddressApiResponse[]
  >([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadShippingAddresses() {
      if (!isOpen || !registration?.id || !token) return;

      setShippingLoading(true);
      setShippingError(null);

      try {
        const spec = {
          fields: ["*"],
          filters: [
            ["parent_id", "=", Number(registration.id)],
            ["parent_type", "=", "customer_register"],
          ],
        };

        const res = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, spec),
          { method: "GET", cache: "no-store" },
          token,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch shipping addresses (${res.status})`);
        }

        const json = await res.json();
        if (!cancelled) {
          setShippingAddresses(Array.isArray(json.data) ? json.data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setShippingError(
            err instanceof Error
              ? err.message
              : "Gagal memuat alamat pengiriman",
          );
          setShippingAddresses([]);
        }
      } finally {
        if (!cancelled) {
          setShippingLoading(false);
        }
      }
    }

    loadShippingAddresses();

    return () => {
      cancelled = true;
    };
  }, [isOpen, registration?.id, token]);

  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === "-") return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("62")) {
      return "0" + cleaned.substring(2);
    }
    return cleaned;
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "-") return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const displayValue = (value?: string | number | null) => {
    if (value === null || value === undefined || value === "") return "-";
    return String(value);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      // case "pending":
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status.toLowerCase() === "draft") return "draft";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const normalizedStatus = (registration?.status || "").toLowerCase();
  const canManageRegistration = normalizedStatus === "draft";
  const rejectReason =
    registration?.reject_reason || registration?.rejection_reason || "-";
  const rejectNotes =
    registration?.reject_notes || registration?.rejection_notes || "-";

  const effectiveShippingAddresses = useMemo(() => {
    if (!registration) return [] as CustomerRegisterAddressApiResponse[];
    if (registration.same_as_company_address) {
      return [
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
      ];
    }
    return shippingAddresses;
  }, [registration, shippingAddresses]);

  if (!isOpen || !registration) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-[#000000b3] transition-opacity"
            onClick={onClose}
          ></div>

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
            &#8203;
          </span>

          <div className="inline-block relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <IoDocumentTextOutline className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Registration Details
                  </h2>
                  <p className="text-sm text-red-100 mt-0.5">
                    {registration.company.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 bg-white ${getStatusBadgeClass(
                    registration.status,
                  )}`}
                >
                  {getStatusLabel(registration.status)}
                </span>
                <button
                  onClick={onClose}
                  className="rounded-xl p-2 hover:bg-white/20 transition-colors"
                >
                  <HiXMark className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto bg-gray-50">
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <IoDocumentTextOutline className="w-4 h-4 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data Pengajuan
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Nomor Registrasi
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.registration_number || registration.id}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Source
                      </label>
                      <p className="text-sm text-gray-900 font-medium uppercase">
                        {displayValue(registration.source)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Ekaplus User Full Name
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.ekaplus_user?.full_name)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tanggal Submit
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(registration.submission_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {normalizedStatus === "rejected" && (
                <section className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <FaTimesCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Informasi Rejection
                    </h3>
                  </div>
                  <div className="bg-white rounded-xl border border-red-200 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Reject Reason
                        </label>
                        <p className="text-sm text-red-700 font-semibold">
                          {displayValue(rejectReason)}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Reject Notes
                        </label>
                        <p className="text-sm text-gray-900 bg-red-50 border border-red-100 rounded-lg p-3 whitespace-pre-wrap">
                          {displayValue(rejectNotes)}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Identitas Pemilik
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Nama Lengkap
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.user.full_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        No. Handphone
                      </label>
                      <div className="flex items-center gap-2">
                        <FaPhone className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-900 font-medium">
                          {formatPhoneNumber(registration.user.phone)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.user.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tempat Lahir
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.user.place_of_birth}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tanggal Lahir
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(registration.user.date_of_birth)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Identitas Penanggung Jawab Cabang
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Nama Lengkap
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.branch_owner?.full_name)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        No. Handphone
                      </label>
                      <div className="flex items-center gap-2">
                        <FaPhone className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-900 font-medium">
                          {formatPhoneNumber(
                            registration.branch_owner?.phone || "-",
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-900 font-medium">
                          {displayValue(registration.branch_owner?.email)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tempat Lahir
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(
                          registration.branch_owner?.place_of_birth,
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tanggal Lahir
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(
                          registration.branch_owner?.date_of_birth || "-",
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaBuilding className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Informasi Perusahaan
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Company Type
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.company.company_type)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Company Title
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.company.company_title)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Nama Perusahaan
                      </label>
                      <p className="text-sm text-gray-900 font-bold">
                        {registration.company.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Product Need
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {displayValue(registration.company.product_need)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Cabang
                      </label>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          {registration.company.branch_name} (
                          {registration.company.branch_city})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Alamat Perusahaan
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Alamat Lengkap
                      </label>
                      <p className="text-sm text-gray-900 font-medium leading-relaxed">
                        {registration.address.full_address}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Kecamatan
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.address.district_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Kota/Kabupaten
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.address.city_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Provinsi
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.address.province_name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Kode Pos
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.address.postal_code}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaLink className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Relasi Master Data
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        National Brand (NB)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.nb_name ||
                            registration.master_links?.nb_id,
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Group Parent (GP)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.gp_name ||
                            registration.master_links?.gp_id,
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Group Customer (GC)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.gc_name ||
                            registration.master_links?.gc_id,
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Branch Customer (BC)
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(
                          registration.master_links?.bc_name ||
                            registration.master_links?.bc_id,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FaMapMarkerAlt className="w-4 h-4 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Alamat Pengiriman
                  </h3>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Sama dengan alamat perusahaan:
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        registration.same_as_company_address
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {registration.same_as_company_address ? "Ya" : "Tidak"}
                    </span>
                  </div>

                  {shippingLoading && (
                    <div className="text-sm text-gray-500">
                      Memuat alamat pengiriman...
                    </div>
                  )}

                  {shippingError && (
                    <div className="text-sm text-red-600">{shippingError}</div>
                  )}

                  {!shippingLoading &&
                    !shippingError &&
                    effectiveShippingAddresses.length === 0 && (
                      <div className="text-sm text-gray-500">
                        Tidak ada alamat pengiriman.
                      </div>
                    )}

                  {!shippingLoading &&
                    !shippingError &&
                    effectiveShippingAddresses.length > 0 && (
                      <div className="space-y-4">
                        {effectiveShippingAddresses.map((addr) => (
                          <div
                            key={addr.id ?? `${addr.label}-${addr.address}`}
                            className="rounded-xl border border-gray-200 p-4 bg-gray-50"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="font-semibold text-gray-900">
                                {addr.label || "Alamat Pengiriman"}
                              </div>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                                  addr.is_default
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : "bg-white text-gray-600 border-gray-200"
                                }`}
                              >
                                {addr.is_default ? "Default" : "Non-default"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Alamat
                                </label>
                                <p className="text-gray-900">
                                  {addr.address || "-"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Kota
                                </label>
                                <p className="text-gray-900">
                                  {addr.city || "-"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Provinsi
                                </label>
                                <p className="text-gray-900">
                                  {addr.province || "-"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Kecamatan
                                </label>
                                <p className="text-gray-900">
                                  {addr.district || "-"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Kode Pos
                                </label>
                                <p className="text-gray-900">
                                  {addr.postal_code || "-"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  PIC
                                </label>
                                <p className="text-gray-900">
                                  {addr.pic_name || "-"}
                                </p>
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  No. PIC
                                </label>
                                <p className="text-gray-900">
                                  {addr.pic_phone || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </section>

              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FaDatabase className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data Sinkronisasi
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Sync Saga ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium break-all">
                        {displayValue(registration.sync_info?.sync_saga_id)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        ERP Customer ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(registration.sync_info?.erp_customer_id)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        CRM Customer ID
                      </label>
                      <p className="text-sm text-gray-900 font-mono font-medium">
                        {displayValue(registration.sync_info?.crm_customer_id)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Sync Last Error
                      </label>
                      <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-wrap">
                        {displayValue(registration.sync_info?.sync_last_error)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
              {(registration.created_at || registration.updated_at) && (
                <section className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaClock className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Catatan Aktivitas
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {registration.created_at && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                            <FaUser className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Created
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {registration.created_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-green-500" />
                          <p className="text-sm">
                            {new Date(registration.created_at).toLocaleString(
                              "id-ID",
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {registration.updated_at && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <FaEdit className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Last Updated
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {registration.updated_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-blue-500" />
                          <p className="text-sm">
                            {new Date(registration.updated_at).toLocaleString(
                              "id-ID",
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
              >
                Close
              </button>

              {canManageRegistration && (
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEditModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onReject?.(registration)}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaTimesCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onApprove?.(registration)}
                    className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </motion.button>
                </div>
              )}

              {registration.status === "approved" && registration.gp_name && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl">
                  <FaCheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Approved - GP: {registration.gp_name}
                  </span>
                </div>
              )}

              {normalizedStatus === "rejected" && rejectReason !== "-" && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
                  <FaTimesCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">
                    Rejected - {rejectReason}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditRegistrationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        registration={registration}
        onSuccess={() => {
          setIsEditModalOpen(false);
          onEdit?.();
        }}
      />
    </>
  );
}
