// src/components/whatsapp/AddWhatsAppModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaWhatsapp,
  FaPhone,
  FaUser,
  FaLink,
  FaStar,
  FaHashtag,
} from "react-icons/fa";

type WhatsAppDevice = {
  id?: number;
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

const SNAP_KEY = "ekatalog_whatsapp_devices_snapshot";

export default function AddWhatsAppModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: WhatsAppDevice | null;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [dailyLimit, setDailyLimit] = useState(1000);
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setPhone(initial.phone ?? "");
      setWebhookUrl(initial.webhook_url ?? "");
      setDailyLimit(initial.daily_limit ?? 1000);
      setIsDefault(initial.is_default ?? false);
    } else {
      setName("");
      setPhone("");
      setWebhookUrl("https://api.ekatunggal.com/webhook/whatsapp/");
      setDailyLimit(1000);
      setIsDefault(false);
    }
  }, [initial, open]);

  function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("62")) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)}-${cleaned.slice(
        5,
        9
      )}-${cleaned.slice(9)}`;
    }
    if (cleaned.startsWith("0")) {
      return `+62 ${cleaned.slice(1, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(
        8
      )}`;
    }
    return phone;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload: Omit<WhatsAppDevice, "id"> = {
      user_id: 1,
      name: name.trim(),
      phone: phone.replace(/\D/g, ""),
      phone_formatted: formatPhoneNumber(phone),
      session_path: null,
      status: "disconnected",
      is_default: isDefault,
      disabled: 0,
      webhook_url: webhookUrl.trim(),
      daily_limit: dailyLimit,
      message_sent_today: initial?.message_sent_today ?? 0,
      total_message_sent: initial?.total_message_sent ?? 0,
      last_login_at: initial?.last_login_at ?? null,
      last_seen_at: initial?.last_seen_at ?? null,
      created_at: initial?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
      device_info: initial?.device_info ?? null,
      created_by: initial?.created_by ?? { id: 1, name: "Admin" },
    };

    try {
      const raw = localStorage.getItem(SNAP_KEY);
      let list: WhatsAppDevice[] = raw ? JSON.parse(raw) : [];

      // If setting as default, unset other defaults
      if (isDefault) {
        list = list.map((d) => ({ ...d, is_default: false }));
      }

      if (initial && initial.id) {
        list = list.map((device) =>
          device.id === initial.id
            ? { ...device, ...payload, id: initial.id }
            : device
        );
      } else {
        const maxId = list.reduce(
          (m: number, it: WhatsAppDevice) => Math.max(m, Number(it.id) || 0),
          0
        );
        const newDevice: WhatsAppDevice = {
          id: maxId + 1,
          ...payload,
        };
        list.push(newDevice);
      }

      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekatalog:whatsapp_devices_update"));
    } catch (error) {
      console.error("Failed to save device:", error);
    }

    setSaving(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaWhatsapp className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {initial ? "Edit WhatsApp Device" : "Tambah WhatsApp Device"}
                    </h3>
                    <p className="text-green-100 text-sm">
                      {initial
                        ? "Perbarui informasi perangkat"
                        : "Tambahkan perangkat WhatsApp baru"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Device <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="OTP Service / CS Support / Branch Medan"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="08123456789"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: 08xxxxxxxxxx atau 628xxxxxxxxxx
                </p>
              </div>

              {/* Webhook URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Webhook URL
                </label>
                <div className="relative">
                  <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="https://api.example.com/webhook/whatsapp"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  URL untuk menerima callback pesan masuk
                </p>
              </div>

              {/* Daily Limit */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kuota Harian <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="1000"
                    min={1}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maksimum pesan yang dapat dikirim per hari
                </p>
              </div>

              {/* Is Default */}
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <label htmlFor="isDefault" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-800">
                      Jadikan sebagai Default
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Perangkat default akan digunakan untuk pengiriman OTP
                  </p>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl hover:shadow-green-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{initial ? "Simpan Perubahan" : "Tambah Device"}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}