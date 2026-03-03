// src/components/emails/EmailDetailModal.tsx
"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaRedo,
  FaEnvelope,
  FaUser,
  FaUsers,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaBan,
  FaInfoCircle,
  FaCode,
  FaCopy,
  FaCheck,
  FaFileAlt,
  FaHashtag,
  FaLayerGroup,
} from "react-icons/fa";

type EmailLog = {
  id: string;
  status: "Sent" | "Error" | "Pending" | "Expired" | "Not Sent";
  sender: {
    name: string;
    email: string;
  };
  recipients: Array<{
    email: string;
    status: string;
  }>;
  subject: string;
  message: string;
  raw_message: string;
  error: string | null;
  message_id: string;
  priority: number;
  retry_count: number;
  max_retry: number;
  email_type: string;
  reference_doctype: string;
  reference_name: string;
  created_at: string;
  updated_at: string;
  created_by: {
    id: number;
    name: string;
  };
};

const statusConfig = {
  Sent: {
    color: "bg-green-500",
    textColor: "text-green-700",
    bgLight: "bg-green-100",
    icon: FaCheckCircle,
  },
  Error: {
    color: "bg-red-500",
    textColor: "text-red-700",
    bgLight: "bg-red-100",
    icon: FaExclamationTriangle,
  },
  Pending: {
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgLight: "bg-yellow-100",
    icon: FaHourglassHalf,
  },
  Expired: {
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgLight: "bg-gray-100",
    icon: FaBan,
  },
  "Not Sent": {
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgLight: "bg-orange-100",
    icon: FaTimesCircle,
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function EmailDetailModal({
  open,
  onClose,
  email,
  onRetry,
}: {
  open: boolean;
  onClose: () => void;
  email?: EmailLog | null;
  onRetry?: (email: EmailLog) => void;
}) {
  const [activeTab, setActiveTab] = useState<"info" | "message" | "raw">(
    "info",
  );
  const [copied, setCopied] = useState<string | null>(null);

  if (!email) return null;

  const statusInfo = statusConfig[email.status] || statusConfig["Error"];
  const StatusIcon = statusInfo.icon;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

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
            className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div
              className={`${
                email.status === "Sent"
                  ? "bg-gradient-to-r from-green-500 via-green-600 to-green-700"
                  : email.status === "Error"
                    ? "bg-gradient-to-r from-red-500 via-red-600 to-red-700"
                    : email.status === "Pending"
                      ? "bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700"
                      : email.status === "Expired"
                        ? "bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700"
                        : "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700"
              } px-8 py-8 text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative">
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    <StatusIcon className="w-4 h-4" />
                    {email.status}
                  </span>
                  <span className="px-4 py-1.5 bg-purple-500/90 backdrop-blur-sm rounded-full text-sm font-semibold">
                    {email.email_type}
                  </span>
                  <span className="px-4 py-1.5 bg-blue-500/90 backdrop-blur-sm rounded-full text-sm font-semibold">
                    Priority: {email.priority}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  {email.subject}
                </h2>

                <div className="flex items-center gap-2 text-lg text-white/80">
                  <FaHashtag className="w-4 h-4" />
                  <code className="font-mono text-sm">{email.id}</code>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-1 p-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === "info"
                      ? "bg-red-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaInfoCircle className="w-4 h-4" />
                  Informasi
                </button>
                <button
                  onClick={() => setActiveTab("message")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === "message"
                      ? "bg-red-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaFileAlt className="w-4 h-4" />
                  Pesan
                </button>
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === "raw"
                      ? "bg-red-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaCode className="w-4 h-4" />
                  Raw Message
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Error Alert */}
                  {email.error && (
                    <div className="flex items-start gap-4 p-5 bg-red-50 rounded-2xl border-2 border-red-200">
                      <FaExclamationTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-red-800 mb-1">
                          Error Message
                        </h4>
                        <p className="text-red-700">{email.error}</p>
                      </div>
                    </div>
                  )}

                  {/* Sender & Recipients Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sender */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <FaUser className="w-5 h-5 text-blue-600" />
                        <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                          Pengirim
                        </label>
                      </div>
                      <div className="space-y-2">
                        <p className="text-blue-900 font-semibold">
                          {email.sender.name}
                        </p>
                        <p className="text-blue-700 text-sm">
                          {email.sender.email}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <FaLayerGroup className="w-5 h-5 text-purple-600" />
                        <label className="text-sm font-bold text-purple-900 uppercase tracking-wide">
                          Referensi
                        </label>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-purple-700">
                            Doctype
                          </span>
                          <p className="text-purple-900 font-semibold">
                            {email.reference_doctype}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-purple-700">Name</span>
                          <p className="text-purple-900 font-semibold text-sm">
                            {email.reference_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipients Table */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FaUsers className="w-5 h-5 text-green-600" />
                      <label className="text-lg font-bold text-gray-800">
                        Penerima ({email.recipients.length})
                      </label>
                    </div>
                    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">
                              No.
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">
                              Email Penerima
                            </th>
                            <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {email.recipients.map((recipient, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-5 py-4 text-sm text-gray-500">
                                {idx + 1}
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-sm font-medium text-gray-900">
                                  {recipient.email}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                    recipient.status === "Sent"
                                      ? "bg-green-100 text-green-700"
                                      : recipient.status === "Draft"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {recipient.status === "Sent" ? (
                                    <FaCheckCircle className="w-3 h-3" />
                                  ) : recipient.status === "Draft" ? (
                                    <FaHourglassHalf className="w-3 h-3" />
                                  ) : (
                                    <FaTimesCircle className="w-3 h-3" />
                                  )}
                                  {recipient.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Message ID & Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Message ID
                      </label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200 break-all">
                          {email.message_id}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(email.message_id, "message_id")
                          }
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {copied === "message_id" ? (
                            <FaCheck className="w-4 h-4 text-green-500" />
                          ) : (
                            <FaCopy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
                      <label className="block text-sm font-bold text-orange-900 mb-2">
                        Retry Info
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <span className="text-xs text-orange-700">
                            Retry Count
                          </span>
                          <p className="text-2xl font-bold text-orange-900">
                            {email.retry_count}/{email.max_retry}
                          </p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center">
                          <FaRedo className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                      <FaClock className="w-6 h-6 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Dibuat pada
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {formatDate(email.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                      <FaClock className="w-6 h-6 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Terakhir diupdate
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {formatDate(email.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold">
                      {email.created_by.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Dibuat oleh
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {email.created_by.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "message" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Isi Pesan
                  </label>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100 min-h-[200px]">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {email.message}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "raw" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Raw Message Headers
                    </label>
                    <button
                      onClick={() =>
                        copyToClipboard(email.raw_message, "raw_message")
                      }
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                    >
                      {copied === "raw_message" ? (
                        <>
                          <FaCheck className="w-3 h-3 text-green-500" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-2xl p-6 border-2 border-gray-700 overflow-x-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap break-all">
                      {email.raw_message}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-6 mt-6 border-t-2 border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                >
                  <FaTimes className="w-5 h-5" />
                  <span>Tutup</span>
                </motion.button>

                {(email.status === "Error" || email.status === "Not Sent") && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onRetry?.(email)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                  >
                    <FaRedo className="w-5 h-5" />
                    <span>Retry Sending</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
