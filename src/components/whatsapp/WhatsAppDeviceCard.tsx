// src/components/whatsapp/WhatsAppDeviceCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaPhone,
  FaUser,
  FaClock,
  FaPlug,
  FaUnlink,
  FaQrcode,
  FaStar,
  FaBan,
  FaMobileAlt,
  FaApple,
  FaAndroid,
  FaGlobe,
  FaPaperPlane,
  FaChartLine,
} from "react-icons/fa";

type WhatsAppDevice = {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  phone_formatted: string;
  session_path: string | null;
  status: "connected" | "disconnected" | "connecting";
  is_default: boolean;
  disabled: number;
  webhook_url: string;
  daily_limit: number;
  message_sent_today: number;
  total_message_sent: number;
  last_login_at: string | null;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  device_info: {
    platform: string;
    device_manufacturer: string;
    device_model: string;
    os_version: string;
    wa_version: string;
  } | null;
};

const statusConfig = {
  connected: {
    color: "bg-green-100 text-green-700 border-green-200",
    dotColor: "bg-green-500",
    label: "Connected",
  },
  disconnected: {
    color: "bg-red-100 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    label: "Disconnected",
  },
  connecting: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dotColor: "bg-yellow-500 animate-pulse",
    label: "Connecting...",
  },
};

function getRelativeTime(dateString: string | null): string {
  if (!dateString) return "Belum pernah";
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
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPlatformIcon(platform: string | undefined) {
  switch (platform) {
    case "ios":
      return FaApple;
    case "android":
      return FaAndroid;
    case "web":
      return FaGlobe;
    default:
      return FaMobileAlt;
  }
}

export default function WhatsAppDeviceCard({
  device,
  viewMode = "grid",
  onView,
  onConnect,
  onDisconnect,
}: {
  device: WhatsAppDevice;
  viewMode?: "grid" | "list";
  onView?: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}) {
  const statusInfo = statusConfig[device.status] || statusConfig["disconnected"];
  const PlatformIcon = getPlatformIcon(device.device_info?.platform);
  const usagePercent = Math.round(
    (device.message_sent_today / device.daily_limit) * 100
  );

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={onView}
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer transition-all group hover:shadow-lg ${
          device.disabled === 1 ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div
            className={`hidden md:flex w-14 h-14 rounded-xl items-center justify-center flex-shrink-0 ${
              device.status === "connected"
                ? "bg-green-100"
                : device.status === "connecting"
                ? "bg-yellow-100"
                : "bg-gray-100"
            }`}
          >
            <FaWhatsapp
              className={`w-7 h-7 ${
                device.status === "connected"
                  ? "text-green-600"
                  : device.status === "connecting"
                  ? "text-yellow-600"
                  : "text-gray-400"
              }`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {device.name}
                  </h3>
                  {device.is_default && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                      <FaStar className="w-3 h-3" />
                      Default
                    </span>
                  )}
                  {device.disabled === 1 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      <FaBan className="w-3 h-3" />
                      Disabled
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`}
                    />
                    {statusInfo.label}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <FaPhone className="w-3 h-3 text-gray-400" />
                    <span>{device.phone_formatted}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              {device.device_info && (
                <div className="flex items-center gap-1.5">
                  <PlatformIcon className="w-3 h-3 text-gray-400" />
                  <span>
                    {device.device_info.device_manufacturer}{" "}
                    {device.device_info.device_model}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <FaClock className="w-3 h-3 text-gray-400" />
                <span>Last seen: {getRelativeTime(device.last_seen_at)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaPaperPlane className="w-3 h-3 text-gray-400" />
                <span>
                  {device.message_sent_today.toLocaleString()}/
                  {device.daily_limit.toLocaleString()} hari ini
                </span>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="mb-3">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    usagePercent >= 90
                      ? "bg-red-500"
                      : usagePercent >= 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {device.status === "disconnected" && device.disabled === 0 && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnect?.();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-all text-sm font-medium text-green-700"
                >
                  <FaQrcode className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </motion.button>
              )}
              {device.status === "connected" && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDisconnect?.();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-all text-sm font-medium text-red-600"
                >
                  <FaUnlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </motion.button>
              )}
            </div>
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
        boxShadow: "0 20px 40px -10px rgba(34, 197, 94, 0.15)",
      }}
      onClick={onView}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group ${
        device.disabled === 1 ? "opacity-60" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`px-5 py-4 ${
          device.status === "connected"
            ? "bg-gradient-to-r from-green-500 to-green-600"
            : device.status === "connecting"
            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
            : "bg-gradient-to-r from-gray-500 to-gray-600"
        } text-white`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FaWhatsapp className="w-5 h-5" />
            <span className="text-sm font-semibold">{statusInfo.label}</span>
          </div>
          <div className="flex items-center gap-2">
            {device.is_default && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                <FaStar className="w-3 h-3" />
                Default
              </span>
            )}
          </div>
        </div>
        <div className="text-lg font-bold truncate">{device.phone_formatted}</div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-bold text-gray-900 text-base group-hover:text-green-600 transition-colors truncate">
            {device.name}
          </h3>
          {device.disabled === 1 && (
            <FaBan className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
        </div>

        <div className="space-y-2 mb-4">
          {device.device_info && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <PlatformIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="truncate">
                {device.device_info.device_model}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaClock className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="text-xs">
              {getRelativeTime(device.last_seen_at)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {device.message_sent_today.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Hari ini</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {device.total_message_sent.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>

        {/* Usage Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Kuota harian</span>
            <span>
              {usagePercent}% ({device.daily_limit.toLocaleString()})
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                usagePercent >= 90
                  ? "bg-red-500"
                  : usagePercent >= 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {device.status === "disconnected" && device.disabled === 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onConnect?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 border-2 border-green-200 hover:bg-green-100 transition-all"
            >
              <FaQrcode className="w-3.5 h-3.5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                Connect
              </span>
            </motion.button>
          )}
          {device.status === "connected" && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onDisconnect?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-all"
            >
              <FaUnlink className="w-3.5 h-3.5 text-red-600" />
              <span className="text-sm font-semibold text-red-600">
                Disconnect
              </span>
            </motion.button>
          )}
          {device.status === "connecting" && (
            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-50 border-2 border-yellow-200">
              <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold text-yellow-700">
                Scanning...
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}