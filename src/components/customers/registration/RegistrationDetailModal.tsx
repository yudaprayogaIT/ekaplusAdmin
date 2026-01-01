"use client";

import React, { useState } from "react";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { DocumentViewer } from "./DocumentViewer";
import { HiXMark } from "react-icons/hi2";
import { IoDocumentTextOutline } from "react-icons/io5";
import { HiOutlinePhotograph } from "react-icons/hi";
import {
  FaBuilding,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaEdit,
} from "react-icons/fa";
import Image from "next/image";

interface RegistrationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
}

export function RegistrationDetailModal({
  isOpen,
  onClose,
  registration,
}: RegistrationDetailModalProps) {
  const [documentViewer, setDocumentViewer] = useState<{
    isOpen: boolean;
    url: string;
    filename: string;
    title: string;
  }>({
    isOpen: false,
    url: "",
    filename: "",
    title: "",
  });

  if (!isOpen || !registration) return null;

  const openDocumentViewer = (url: string, filename: string, title: string) => {
    setDocumentViewer({ isOpen: true, url, filename, title });
  };

  // Format phone number to be more readable
  const formatPhoneNumber = (phone: string) => {
    if (!phone || phone === "-") return "-";
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    // If starts with 62, replace with 0
    if (cleaned.startsWith("62")) {
      return "0" + cleaned.substring(2);
    }
    return cleaned;
  };

  // Format date to be more readable (DD MMMM YYYY)
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "-") return "-";
    try {
      // Handle ISO format (2000-01-01T00:00:00Z)
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

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
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
    if (status.toLowerCase() === "draft") return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  console.log("Modal opened with registration:", registration);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-[#000000b3] transition-opacity"
            onClick={onClose}
          ></div>

          {/* Center modal */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
            &#8203;
          </span>

          {/* Modal Panel */}
          <div className="inline-block relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
            {/* Header */}
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
                    registration.status
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

            {/* Body - Scrollable */}
            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto bg-gray-50">
              {/* 1. Identitas Pemilik/Pimpinan */}
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Identitas Pemilik/Pimpinan
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Nama Lengkap
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.owner.full_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        No. Handphone
                      </label>
                      <div className="flex items-center gap-2">
                        <FaPhone className="w-3 h-3 text-gray-400" />
                        <p className="text-sm text-gray-900 font-medium">
                          {formatPhoneNumber(registration.owner.phone)}
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
                          {registration.owner.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tempat Lahir
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.owner.place_of_birth}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Tanggal Lahir
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(registration.owner.date_of_birth)}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Informasi Perusahaan */}
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
                        Jenis Perusahaan
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.company.business_type}
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
                        NIK
                      </label>
                      <p className="text-sm text-gray-900 font-medium font-mono">
                        {registration.company.nik}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        NPWP
                      </label>
                      <p className="text-sm text-gray-900 font-medium font-mono">
                        {registration.company.npwp || "-"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Cabang Terdekat
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

              {/* 3. Alamat Perusahaan */}
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
                          Kelurahan/Desa
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.address.village_name}
                        </p>
                      </div>
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
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          RT
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.address.rt}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          RW
                        </label>
                        <p className="text-sm text-gray-900 font-medium">
                          {registration.address.rw}
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

              {/* 4. Data Pendukung */}
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <IoDocumentTextOutline className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Data Pendukung
                  </h3>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Contact Person
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.support_data.contact_person || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Email Perusahaan
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.support_data.company_email || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Fax
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.support_data.fax || "-"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Alamat Pabrik
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {registration.support_data.factory_address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Dokumen */}
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <HiOutlinePhotograph className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Dokumen</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* KTP Photo */}
                  {registration.documents.ktp_photo ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Foto KTP
                      </label>
                      <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden">
                        <Image
                          src={registration.documents.ktp_photo.url}
                          alt="KTP"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() =>
                          openDocumentViewer(
                            registration.documents.ktp_photo!.url,
                            registration.documents.ktp_photo!.filename,
                            "Foto KTP"
                          )
                        }
                        className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
                      >
                        View Full Size
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Foto KTP
                      </label>
                      <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        Not uploaded
                      </div>
                    </div>
                  )}

                  {/* NPWP Photo */}
                  {registration.documents.npwp_photo ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Foto NPWP
                      </label>
                      <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden">
                        <Image
                          src={registration.documents.npwp_photo.url}
                          alt="NPWP"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() =>
                          openDocumentViewer(
                            registration.documents.npwp_photo!.url,
                            registration.documents.npwp_photo!.filename,
                            "Foto NPWP"
                          )
                        }
                        className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
                      >
                        View Full Size
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Foto NPWP
                      </label>
                      <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        Not uploaded
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 6. Catatan Aktivitas */}
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
                    {/* Created Info */}
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
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Updated Info */}
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
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={documentViewer.isOpen}
        onClose={() => setDocumentViewer({ ...documentViewer, isOpen: false })}
        imageUrl={documentViewer.url}
        filename={documentViewer.filename}
        title={documentViewer.title}
      />
    </>
  );
}
