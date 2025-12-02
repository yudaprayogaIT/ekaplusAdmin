// src/components/emails/EmailLogCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaUser,
  FaUsers,
  FaClock,
  FaRedo,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaBan,
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
  error: string | null;
  priority: number;
  retry_count: number;
  max_retry: number;
  email_type: string;
  created_at: string;
  updated_at: string;
};

const statusConfig = {
  Sent: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: FaCheckCircle,
    iconColor: "text-green-500",
  },
  Error: {
    color: "bg-red-100 text-red-700 border-red-200",
    icon: FaExclamationTriangle,
    iconColor: "text-red-500",
  },
  Pending: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: FaHourglassHalf,
    iconColor: "text-yellow-500",
  },
  Expired: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: FaBan,
    iconColor: "text-gray-500",
  },
  "Not Sent": {
    color: "bg-orange-100 text-orange-700 border-orange-200",
    icon: FaTimesCircle,
    iconColor: "text-orange-500",
  },
};

const typeConfig: Record<string, string> = {
  notification: "bg-blue-100 text-blue-700",
  report: "bg-purple-100 text-purple-700",
  announcement: "bg-indigo-100 text-indigo-700",
  alert: "bg-red-100 text-red-700",
  transaction: "bg-green-100 text-green-700",
  system: "bg-gray-100 text-gray-700",
  marketing: "bg-pink-100 text-pink-700",
  workflow: "bg-cyan-100 text-cyan-700",
  support: "bg-teal-100 text-teal-700",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return formatDate(dateString);
}

export default function EmailLogCard({
  email,
  viewMode = "grid",
  onView,
  onRetry,
}: {
  email: EmailLog;
  viewMode?: "grid" | "list";
  onView?: () => void;
  onRetry?: () => void;
}) {
  const statusInfo = statusConfig[email.status] || statusConfig["Error"];
  const StatusIcon = statusInfo.icon;
  const typeClass = typeConfig[email.email_type] || "bg-gray-100 text-gray-700";

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={onView}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer transition-all group hover:shadow-lg"
      >
        <div className="flex items-start gap-5">
          {/* Status Icon */}
          <div
            className={`hidden md:flex w-14 h-14 rounded-xl items-center justify-center flex-shrink-0 ${statusInfo.color}`}
          >
            <StatusIcon className={`w-6 h-6 ${statusInfo.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    {email.subject}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}
                  >
                    {email.status}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeClass}`}
                  >
                    {email.email_type}
                  </span>
                  <code className="text-xs text-gray-400 font-mono">
                    {email.id}
                  </code>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1.5">
                <FaUser className="w-3 h-3 text-gray-400" />
                <span>{email.sender.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaUsers className="w-3 h-3 text-gray-400" />
                <span>{email.recipients.length} penerima</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaClock className="w-3 h-3 text-gray-400" />
                <span>{getRelativeTime(email.created_at)}</span>
              </div>
              {email.retry_count > 0 && (
                <div className="flex items-center gap-1.5">
                  <FaRedo className="w-3 h-3 text-gray-400" />
                  <span>
                    Retry: {email.retry_count}/{email.max_retry}
                  </span>
                </div>
              )}
            </div>

            {email.error && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 rounded-lg border border-red-100">
                <FaExclamationTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-600 line-clamp-1">
                  {email.error}
                </p>
              </div>
            )}

            {/* Actions */}
            {(email.status === "Error" || email.status === "Not Sent") && (
              <div className="flex gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry?.();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-all text-sm font-medium text-red-600"
                >
                  <FaRedo className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.15)",
      }}
      onClick={onView}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Header with Status */}
      <div
        className={`px-5 py-4 ${
          email.status === "Sent"
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : email.status === "Error"
            ? "bg-gradient-to-r from-red-500 to-red-600"
            : email.status === "Pending"
            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
            : email.status === "Expired"
            ? "bg-gradient-to-r from-gray-500 to-gray-600"
            : "bg-gradient-to-r from-orange-500 to-orange-600"
        } text-white`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{email.status}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm`}
          >
            {email.email_type}
          </span>
        </div>
        <code className="text-xs text-white/80 font-mono">{email.id}</code>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight min-h-[40px]">
          {email.subject}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaUser className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{email.sender.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaEnvelope className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate text-xs">
              {email.recipients[0]?.email}
              {email.recipients.length > 1 && (
                <span className="text-gray-400">
                  {" "}
                  +{email.recipients.length - 1}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaClock className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs">{getRelativeTime(email.created_at)}</span>
          </div>
        </div>

        {email.error && (
          <div className="flex items-start gap-2 p-2.5 bg-red-50 rounded-xl border border-red-100 mb-4">
            <FaExclamationTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-600 line-clamp-2">{email.error}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {email.retry_count > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <FaRedo className="w-3 h-3" />
                {email.retry_count}/{email.max_retry}
              </span>
            )}
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              P{email.priority}
            </span>
          </div>

          {(email.status === "Error" || email.status === "Not Sent") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onRetry?.();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-all text-xs font-semibold text-red-600"
            >
              <FaRedo className="w-3 h-3" />
              <span>Retry</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
