// src/components/whatsapp/WhatsAppDeviceList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import WhatsAppDeviceCard from "./WhatsAppDeviceCard";
import WhatsAppDetailModal from "./WhatsAppDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaWhatsapp,
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaSync,
  FaPlug,
  FaUnlink,
  FaPaperPlane,
} from "react-icons/fa";
import { motion } from "framer-motion";
import AddWhatsAppModal from "./AddWhatsAppModal";

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

type SortOption =
  | "date-desc"
  | "date-asc"
  | "name-asc"
  | "name-desc"
  | "status-asc"
  | "status-desc";

const DATA_URL = "/data/whatsapp_devices.json";
const SNAP_KEY = "ekatalog_whatsapp_devices_snapshot";

const statusOrder = {
  connected: 1,
  connecting: 2,
  disconnected: 3,
};

export default function WhatsAppDeviceList() {
  const [devices, setDevices] = useState<WhatsAppDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("status-asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<WhatsAppDevice | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailDevice, setDetailDevice] = useState<WhatsAppDevice | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load devices
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);

      try {
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as WhatsAppDevice[];
          if (!cancelled) {
            setDevices(data);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(data));
            } catch {}
          }
        } else {
          if (!cancelled) setError(`Failed to fetch devices (${res.status})`);
        }
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try {
        setDevices(JSON.parse(raw) as WhatsAppDevice[]);
      } catch {}
    }
    window.addEventListener("ekatalog:whatsapp_devices_update", handler);
    return () =>
      window.removeEventListener("ekatalog:whatsapp_devices_update", handler);
  }, []);

  function saveSnapshot(arr: WhatsAppDevice[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:whatsapp_devices_update"));
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }

  function handleEdit(device: WhatsAppDevice) {
    setModalInitial(device);
    setModalOpen(true);
  }

  function openDetail(device: WhatsAppDevice) {
    setDetailDevice(device);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailDevice(null);
  }

  function promptConnect(device: WhatsAppDevice) {
    setConfirmTitle("Connect WhatsApp");
    setConfirmDesc(
      `Mulai proses koneksi untuk ${device.name} (${device.phone_formatted})?`
    );
    actionRef.current = async () => {
      const updated = devices.map((d) =>
        d.id === device.id
          ? {
              ...d,
              status: "connecting" as const,
              updated_at: new Date().toISOString(),
            }
          : d
      );
      setDevices(updated);
      saveSnapshot(updated);
      // Open detail to show QR
      setDetailDevice({ ...device, status: "connecting" });
      setDetailOpen(true);
    };
    setConfirmOpen(true);
  }

  function promptDisconnect(device: WhatsAppDevice) {
    setConfirmTitle("Disconnect WhatsApp");
    setConfirmDesc(
      `Yakin ingin memutuskan koneksi ${device.name} (${device.phone_formatted})?`
    );
    actionRef.current = async () => {
      const updated = devices.map((d) =>
        d.id === device.id
          ? {
              ...d,
              status: "disconnected" as const,
              session_path: null,
              updated_at: new Date().toISOString(),
            }
          : d
      );
      setDevices(updated);
      saveSnapshot(updated);
    };
    setConfirmOpen(true);
  }

  function promptToggleStatus(device: WhatsAppDevice) {
    const newDisabled = device.disabled === 0 ? 1 : 0;
    setConfirmTitle(newDisabled === 0 ? "Aktifkan Device" : "Nonaktifkan Device");
    setConfirmDesc(
      newDisabled === 0
        ? `Aktifkan device ${device.name}?`
        : `Nonaktifkan device ${device.name}? Device tidak akan bisa mengirim pesan.`
    );
    actionRef.current = async () => {
      const updated = devices.map((d) =>
        d.id === device.id
          ? {
              ...d,
              disabled: newDisabled,
              updated_at: new Date().toISOString(),
            }
          : d
      );
      setDevices(updated);
      saveSnapshot(updated);
    };
    setConfirmOpen(true);
  }

  function promptDelete(device: WhatsAppDevice) {
    setConfirmTitle("Hapus Device");
    setConfirmDesc(
      `Yakin ingin menghapus device "${device.name}"? Tindakan ini tidak dapat dibatalkan.`
    );
    actionRef.current = async () => {
      const next = devices.filter((x) => x.id !== device.id);
      setDevices(next);
      saveSnapshot(next);
    };
    setConfirmOpen(true);
  }

  function onDetailEdit(device: WhatsAppDevice) {
    closeDetail();
    setTimeout(() => handleEdit(device), 80);
  }

  function onDetailDelete(device: WhatsAppDevice) {
    closeDetail();
    setTimeout(() => promptDelete(device), 80);
  }

  function onDetailToggleStatus(device: WhatsAppDevice) {
    closeDetail();
    setTimeout(() => promptToggleStatus(device), 80);
  }

  function onDetailConnect(device: WhatsAppDevice) {
    // Just update to connecting state
    const updated = devices.map((d) =>
      d.id === device.id
        ? {
            ...d,
            status: "connecting" as const,
            updated_at: new Date().toISOString(),
          }
        : d
    );
    setDevices(updated);
    saveSnapshot(updated);
  }

  function onDetailDisconnect(device: WhatsAppDevice) {
    closeDetail();
    setTimeout(() => promptDisconnect(device), 80);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) {
      await actionRef.current();
      actionRef.current = null;
    }
  }

  function confirmCancel() {
    actionRef.current = null;
    setConfirmOpen(false);
  }

  function refreshData() {
    setLoading(true);
    fetch(DATA_URL, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setDevices(data);
        saveSnapshot(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat data WhatsApp devices...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Filter devices
  let filteredDevices = devices;

  if (searchQuery.trim()) {
    filteredDevices = filteredDevices.filter(
      (device) =>
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.phone.includes(searchQuery) ||
        device.phone_formatted.includes(searchQuery)
    );
  }

  if (selectedStatus) {
    filteredDevices = filteredDevices.filter(
      (device) => device.status === selectedStatus
    );
  }

  // Sort devices
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "date-asc":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "status-asc":
        return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
      case "status-desc":
        return (statusOrder[b.status] || 0) - (statusOrder[a.status] || 0);
      default:
        return 0;
    }
  });

  // Stats
  const stats = {
    total: devices.length,
    connected: devices.filter((d) => d.status === "connected").length,
    disconnected: devices.filter((d) => d.status === "disconnected").length,
    connecting: devices.filter((d) => d.status === "connecting").length,
    messagesToday: devices.reduce((sum, d) => sum + d.message_sent_today, 0),
    totalMessages: devices.reduce((sum, d) => sum + d.total_message_sent, 0),
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            WhatsApp Admin
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola perangkat WhatsApp untuk pengiriman OTP dan notifikasi
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={refreshData}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
          >
            <FaSync className="w-4 h-4" />
            <span>Refresh</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Device</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FaWhatsapp className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">Total</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <FaCheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Connected</span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {stats.connected}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <FaUnlink className="w-4 h-4 text-red-600" />
            <span className="text-xs text-red-700 font-medium">Disconnected</span>
          </div>
          <div className="text-2xl font-bold text-red-900">
            {stats.disconnected}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <FaPlug className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-yellow-700 font-medium">Connecting</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">
            {stats.connecting}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-1">
            <FaPaperPlane className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-purple-700 font-medium">Hari Ini</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.messagesToday.toLocaleString()}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border-2 border-indigo-200">
          <div className="flex items-center gap-2 mb-1">
            <FaPaperPlane className="w-4 h-4 text-indigo-600" />
            <span className="text-xs text-indigo-700 font-medium">Total Pesan</span>
          </div>
          <div className="text-2xl font-bold text-indigo-900">
            {stats.totalMessages.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search, Sort & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama atau nomor WhatsApp..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="status-asc">Status: Connected First</option>
                <option value="status-desc">Status: Disconnected First</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="date-desc">Tanggal: Terbaru</option>
                <option value="date-asc">Tanggal: Terlama</option>
              </select>
              <svg
                className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaTh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />

            <button
              onClick={() => setSelectedStatus(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === null
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua Status
            </button>
            <button
              onClick={() => setSelectedStatus("connected")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === "connected"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Connected
            </button>
            <button
              onClick={() => setSelectedStatus("disconnected")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === "disconnected"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Disconnected
            </button>
            <button
              onClick={() => setSelectedStatus("connecting")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === "connecting"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Connecting
            </button>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedStatus || sortBy !== "status-asc") && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">
                Filter aktif:
              </span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Pencarian: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedStatus && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">
                  Status: {selectedStatus}
                </span>
              )}
              {sortBy !== "status-asc" && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  Sort: {sortBy.split("-").join(" ")}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus(null);
                  setSortBy("status-asc");
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                Reset Semua
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Device List */}
      {sortedDevices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaWhatsapp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada device
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada WhatsApp device yang ditambahkan"}
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Device Pertama</span>
          </motion.button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {sortedDevices.map((device) => (
            <WhatsAppDeviceCard
              key={device.id}
              device={device}
              viewMode={viewMode}
              onView={() => openDetail(device)}
              onConnect={() => promptConnect(device)}
              onDisconnect={() => promptDisconnect(device)}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {sortedDevices.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Menampilkan {sortedDevices.length} dari {devices.length} device
        </div>
      )}

      {/* Modals */}
      <AddWhatsAppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
      />

      <WhatsAppDetailModal
        open={detailOpen}
        onClose={closeDetail}
        device={detailDevice}
        onConnect={onDetailConnect}
        onDisconnect={onDetailDisconnect}
        onToggleStatus={onDetailToggleStatus}
        onDelete={onDetailDelete}
        onEdit={onDetailEdit}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Ya, Lanjutkan"
        cancelLabel="Batal"
      />
    </div>
  );
}