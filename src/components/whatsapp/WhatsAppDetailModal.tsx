// src/components/whatsapp/WhatsAppDetailModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
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
  FaCopy,
  FaCheck,
  FaLink,
  FaInfoCircle,
  FaCog,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaToggleOn,
  FaToggleOff,
  FaTrash,
  FaEdit,
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
  created_by: {
    id: number;
    name: string;
  };
};

const statusConfig = {
  connected: {
    color: "bg-green-500",
    gradient: "from-green-500 via-green-600 to-green-700",
    label: "Connected",
    icon: FaCheckCircle,
  },
  disconnected: {
    color: "bg-red-500",
    gradient: "from-gray-500 via-gray-600 to-gray-700",
    label: "Disconnected",
    icon: FaExclamationTriangle,
  },
  connecting: {
    color: "bg-yellow-500",
    gradient: "from-yellow-500 via-yellow-600 to-yellow-700",
    label: "Connecting",
    icon: FaQrcode,
  },
};

function formatDate(dateString: string | null): string {
  if (!dateString) return "Belum pernah";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

// Simulated QR Code component (in real app, get from API)
function QRCodePlaceholder() {
  return (
    <div className="relative w-64 h-64 bg-white p-4 rounded-2xl shadow-lg">
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
        {/* Simulated QR pattern */}
        <div className="grid grid-cols-8 gap-1 p-4">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-sm ${
                Math.random() > 0.5 ? "bg-gray-900" : "bg-white"
              }`}
            />
          ))}
        </div>
        {/* WhatsApp logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <FaWhatsapp className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppDetailModal({
  open,
  onClose,
  device,
  onConnect,
  onDisconnect,
  onToggleStatus,
  onDelete,
  onEdit,
}: {
  open: boolean;
  onClose: () => void;
  device?: WhatsAppDevice | null;
  onConnect?: (device: WhatsAppDevice) => void;
  onDisconnect?: (device: WhatsAppDevice) => void;
  onToggleStatus?: (device: WhatsAppDevice) => void;
  onDelete?: (device: WhatsAppDevice) => void;
  onEdit?: (device: WhatsAppDevice) => void;
}) {
  const [activeTab, setActiveTab] = useState<"info" | "qrcode" | "settings">(
    "info"
  );
  const [copied, setCopied] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (activeTab === "qrcode" && device?.status !== "connected") {
      setQrLoading(true);
      const timer = setTimeout(() => setQrLoading(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, device?.status]);

  useEffect(() => {
    if (activeTab === "qrcode" && !qrLoading && device?.status !== "connected") {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab, qrLoading, device?.status]);

  if (!device) return null;

  const statusInfo = statusConfig[device.status] || statusConfig["disconnected"];
  const StatusIcon = statusInfo.icon;
  const PlatformIcon = getPlatformIcon(device.device_info?.platform);
  const usagePercent = Math.round(
    (device.message_sent_today / device.daily_limit) * 100
  );

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
            className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${statusInfo.gradient} px-8 py-8 text-white relative overflow-hidden`}
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FaWhatsapp className="w-10 h-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                      {device.is_default && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/90 rounded-full text-sm font-semibold">
                          <FaStar className="w-3 h-3" />
                          Default
                        </span>
                      )}
                      {device.disabled === 1 && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-gray-500/90 rounded-full text-sm font-semibold">
                          <FaBan className="w-3 h-3" />
                          Disabled
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold">{device.name}</h2>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-lg text-white/90">
                  <FaPhone className="w-4 h-4" />
                  <span className="font-mono">{device.phone_formatted}</span>
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
                      ? "bg-green-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaInfoCircle className="w-4 h-4" />
                  Informasi
                </button>
                <button
                  onClick={() => setActiveTab("qrcode")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === "qrcode"
                      ? "bg-green-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaQrcode className="w-4 h-4" />
                  QR Code
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === "settings"
                      ? "bg-green-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaCog className="w-4 h-4" />
                  Pengaturan
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaPaperPlane className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">
                          Hari Ini
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {device.message_sent_today.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaChartLine className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700 font-medium">
                          Total
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {device.total_message_sent.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaHistory className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-purple-700 font-medium">
                          Kuota
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        {device.daily_limit.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border-2 border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-orange-700 font-medium">
                          Penggunaan
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-orange-900">
                        {usagePercent}%
                      </div>
                    </div>
                  </div>

                  {/* Usage Progress */}
                  <div className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">
                        Kuota Harian
                      </span>
                      <span className="text-sm text-gray-500">
                        {device.message_sent_today.toLocaleString()} /{" "}
                        {device.daily_limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
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

                  {/* Device Info */}
                  {device.device_info && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <PlatformIcon className="w-5 h-5 text-gray-600" />
                        <label className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                          Informasi Perangkat
                        </label>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-xs text-gray-500">Platform</span>
                          <p className="text-gray-900 font-semibold capitalize">
                            {device.device_info.platform}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Perangkat</span>
                          <p className="text-gray-900 font-semibold">
                            {device.device_info.device_manufacturer}{" "}
                            {device.device_info.device_model}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">OS Version</span>
                          <p className="text-gray-900 font-semibold">
                            {device.device_info.os_version}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            WhatsApp Version
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {device.device_info.wa_version}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Webhook URL */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <FaLink className="w-5 h-5 text-blue-600" />
                      <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                        Webhook URL
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm text-blue-800 bg-white p-3 rounded-xl border border-blue-200 break-all">
                        {device.webhook_url}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(device.webhook_url, "webhook")
                        }
                        className="p-2 hover:bg-blue-200 rounded-lg transition-colors"
                      >
                        {copied === "webhook" ? (
                          <FaCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <FaCopy className="w-4 h-4 text-blue-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                      <FaClock className="w-6 h-6 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Last Login
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {formatDate(device.last_login_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                      <FaClock className="w-6 h-6 text-gray-500" />
                      <div>
                        <span className="text-xs text-gray-500 block">
                          Last Seen
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {formatDate(device.last_seen_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Created By */}
                  <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                      {device.created_by.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">
                        Dibuat oleh
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {device.created_by.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "qrcode" && (
                <div className="flex flex-col items-center justify-center py-8">
                  {device.status === "connected" ? (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        WhatsApp Sudah Terhubung
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Perangkat {device.phone_formatted} sudah terhubung dan
                        siap mengirim pesan.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onDisconnect?.(device)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
                      >
                        <FaUnlink className="w-4 h-4" />
                        Disconnect
                      </motion.button>
                    </div>
                  ) : qrLoading ? (
                    <div className="text-center">
                      <div className="w-64 h-64 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-gray-600">Generating QR Code...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <QRCodePlaceholder />
                      <div className="mt-6 space-y-4">
                        <h3 className="text-xl font-bold text-gray-800">
                          Scan QR Code dengan WhatsApp
                        </h3>
                        <div className="text-sm text-gray-600 space-y-2">
                          <p>1. Buka WhatsApp di ponsel Anda</p>
                          <p>2. Ketuk Menu atau Settings dan pilih Linked Devices</p>
                          <p>3. Ketuk Link a Device</p>
                          <p>4. Arahkan ponsel ke layar ini untuk memindai kode</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <span className="text-gray-500">
                            QR Code akan diperbarui dalam
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-lg font-mono font-bold text-gray-800">
                            {countdown}s
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setQrLoading(true);
                            setCountdown(60);
                            setTimeout(() => setQrLoading(false), 1500);
                          }}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors mx-auto"
                        >
                          <FaQrcode className="w-4 h-4" />
                          Refresh QR Code
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Toggle Status */}
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <div className="flex items-center gap-4">
                      {device.disabled === 0 ? (
                        <FaToggleOn className="w-8 h-8 text-green-500" />
                      ) : (
                        <FaToggleOff className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Status Perangkat
                        </h4>
                        <p className="text-sm text-gray-500">
                          {device.disabled === 0
                            ? "Perangkat aktif dan dapat mengirim pesan"
                            : "Perangkat dinonaktifkan"}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onToggleStatus?.(device)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                        device.disabled === 0
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {device.disabled === 0 ? "Nonaktifkan" : "Aktifkan"}
                    </motion.button>
                  </div>

                  {/* Set as Default */}
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <div className="flex items-center gap-4">
                      <FaStar
                        className={`w-6 h-6 ${
                          device.is_default ? "text-yellow-500" : "text-gray-400"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Perangkat Default
                        </h4>
                        <p className="text-sm text-gray-500">
                          {device.is_default
                            ? "Perangkat ini adalah default untuk pengiriman OTP"
                            : "Jadikan perangkat ini sebagai default"}
                        </p>
                      </div>
                    </div>
                    {!device.is_default && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                      >
                        Set Default
                      </motion.button>
                    )}
                  </div>

                  {/* Edit */}
                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border-2 border-gray-200">
                    <div className="flex items-center gap-4">
                      <FaEdit className="w-6 h-6 text-blue-500" />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Edit Perangkat
                        </h4>
                        <p className="text-sm text-gray-500">
                          Ubah nama, kuota, atau webhook URL
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEdit?.(device)}
                      className="px-4 py-2 rounded-xl font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </motion.button>
                  </div>

                  {/* Delete */}
                  <div className="flex items-center justify-between p-5 bg-red-50 rounded-2xl border-2 border-red-200">
                    <div className="flex items-center gap-4">
                      <FaTrash className="w-6 h-6 text-red-500" />
                      <div>
                        <h4 className="font-semibold text-red-800">
                          Hapus Perangkat
                        </h4>
                        <p className="text-sm text-red-600">
                          Tindakan ini tidak dapat dibatalkan
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete?.(device)}
                      className="px-4 py-2 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      Hapus
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
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

                {device.status === "disconnected" && device.disabled === 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab("qrcode");
                      onConnect?.(device);
                    }}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-green-200"
                  >
                    <FaQrcode className="w-5 h-5" />
                    <span>Connect WhatsApp</span>
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