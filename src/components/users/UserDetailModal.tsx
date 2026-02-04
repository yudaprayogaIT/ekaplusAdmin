// src/components/users/UserDetailModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaGoogle,
  FaShieldAlt,
  FaUser,
  FaBirthdayCake,
  FaCity,
  FaClock,
  FaKey,
} from "react-icons/fa";
import type { User, Role } from "./UserList";
import Image from "next/image";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function UserDetailModal({
  open,
  onClose,
  user,
  role,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  role?: Role;
  onEdit?: (u: User) => void;
  onDelete?: (u: User) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  if (!user) return null;

  const bgColor = user.profile_bg_color || role?.color || "#6B7280";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div
              className="px-8 py-10 text-white relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
              }}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative flex items-start gap-6">
                {/* Avatar */}
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white/30 flex-shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  {user.profile_pic || user.picture ? (
                    <Image
                      src={user.profile_pic || user.picture || ""}
                      alt={user.full_name}
                      width={120}
                      height={120}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    getInitials(user.full_name)
                  )}
                </div>

                <div className="flex-1">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                      {role?.display_name || user.role}
                    </span>
                    <span
                      className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold capitalize ${
                        user.status === "active"
                          ? "bg-green-500/90"
                          : user.status === "inactive"
                          ? "bg-gray-500/90"
                          : "bg-red-500/90"
                      }`}
                    >
                      {user.status}
                    </span>
                    {user.is_system && (
                      <span className="px-4 py-1.5 bg-amber-500/90 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaShieldAlt className="w-3 h-3" />
                        System
                      </span>
                    )}
                    {user.google_id && (
                      <span className="px-4 py-1.5 bg-white/90 text-blue-600 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaGoogle className="w-3 h-3" />
                        Google
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold mb-2">{user.full_name}</h2>
                  <p className="text-white/80 text-lg">@{user.username}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Contact & Verification */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Email */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-5 h-5 text-blue-600" />
                      <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                        Email
                      </label>
                    </div>
                    {user.is_email_verified ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <FaCheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <FaTimesCircle className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-blue-800 font-medium break-all">
                    {user.email}
                  </p>
                  {user.email_verified_at && (
                    <p className="text-xs text-blue-600 mt-2">
                      Verified: {formatDateTime(user.email_verified_at)}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-5 h-5 text-green-600" />
                      <label className="text-sm font-bold text-green-900 uppercase tracking-wide">
                        Phone
                      </label>
                    </div>
                    {user.is_phone_verified ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <FaCheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        <FaTimesCircle className="w-3 h-3" />
                        Unverified
                      </span>
                    )}
                  </div>
                  <p className="text-green-800 font-medium">{user.phone}</p>
                  {user.phone_verified_at && (
                    <p className="text-xs text-green-600 mt-2">
                      Verified: {formatDateTime(user.phone_verified_at)}
                    </p>
                  )}
                </div>
              </div>

              {/* Personal Info */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="w-5 h-5 text-gray-400" />
                  Informasi Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Gender
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {user.gender || "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaBirthdayCake className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Tanggal Lahir
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {formatDate(user.date_of_birth)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCity className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-500 uppercase">
                        Tempat Lahir
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {user.birth_place || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              {(user.address || user.city || user.province) && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400" />
                    Alamat
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border-2 border-gray-100">
                    <p className="text-gray-700 leading-relaxed">
                      {user.address && (
                        <span>
                          {user.address}
                          <br />
                        </span>
                      )}
                      {user.city && <span>{user.city}, </span>}
                      {user.province && <span>{user.province} </span>}
                      {user.postal_code && (
                        <span>
                          {user.postal_code}
                          <br />
                        </span>
                      )}
                      {user.country && <span>{user.country}</span>}
                    </p>
                  </div>
                </div>
              )}

              {/* Referral Info */}
              {(user.referral_code || user.referred_by) && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaKey className="w-5 h-5 text-gray-400" />
                    Referral
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.referral_code && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                        <span className="text-xs font-semibold text-purple-600 uppercase">
                          Kode Referral
                        </span>
                        <p className="text-purple-800 font-bold text-lg mt-1">
                          {user.referral_code}
                        </p>
                      </div>
                    )}
                    {user.referred_by && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                        <span className="text-xs font-semibold text-orange-600 uppercase">
                          Direferensikan Oleh
                        </span>
                        <p className="text-orange-800 font-bold text-lg mt-1">
                          {user.referred_by}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* System Info */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaClock className="w-5 h-5 text-gray-400" />
                  Informasi Sistem
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                      User ID
                    </span>
                    <code className="text-xs text-gray-700 bg-gray-200 px-2 py-1 rounded break-all">
                      {user.id}
                    </code>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                      Workflow State
                    </span>
                    <p className="text-gray-800 font-medium capitalize">
                      {user.workflow_state || "-"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                      Created At
                    </span>
                    <p className="text-gray-800 font-medium text-sm">
                      {formatDateTime(user.created_at)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                      Last Login
                    </span>
                    <p className="text-gray-800 font-medium text-sm">
                      {formatDateTime(user.last_login)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                {canEdit ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEdit?.(user)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span>Edit User</span>
                  </motion.button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 cursor-not-allowed">
                    <FaShieldAlt className="w-5 h-5" />
                    <span>Edit User</span>
                  </div>
                )}

                {canDelete && !user.is_system ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete?.(user)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                  >
                    <FaTrash className="w-5 h-5" />
                    <span>Hapus</span>
                  </motion.button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 cursor-not-allowed">
                    <FaShieldAlt className="w-5 h-5" />
                    <span>{user.is_system ? "System User" : "Hapus"}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
