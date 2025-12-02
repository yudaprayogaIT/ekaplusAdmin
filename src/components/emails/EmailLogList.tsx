// src/components/emails/EmailLogList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import EmailLogCard from "./EmailLogCard";
import EmailDetailModal from "./EmailDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaEnvelope,
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHourglassHalf,
  FaBan,
  FaSync,
} from "react-icons/fa";
import { motion } from "framer-motion";

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

type SortOption =
  | "date-desc"
  | "date-asc"
  | "priority-asc"
  | "priority-desc"
  | "status-asc"
  | "status-desc";

const DATA_URL = "/data/email_logs.json";
const SNAP_KEY = "ekatalog_email_logs_snapshot";

const statusOrder = {
  Error: 1,
  "Not Sent": 2,
  Pending: 3,
  Expired: 4,
  Sent: 5,
};

export default function EmailLogList() {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEmail, setDetailEmail] = useState<EmailLog | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load emails
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);

      try {
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as EmailLog[];
          if (!cancelled) {
            setEmails(data);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(data));
            } catch {}
          }
        } else {
          if (!cancelled)
            setError(`Failed to fetch email logs (${res.status})`);
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
        setEmails(JSON.parse(raw) as EmailLog[]);
      } catch {}
    }
    window.addEventListener("ekatalog:email_logs_update", handler);
    return () =>
      window.removeEventListener("ekatalog:email_logs_update", handler);
  }, []);

  function saveSnapshot(arr: EmailLog[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:email_logs_update"));
  }

  function promptRetryEmail(email: EmailLog) {
    setConfirmTitle("Retry Sending Email");
    setConfirmDesc(
      `Yakin ingin mencoba mengirim ulang email "${email.subject}"?`
    );
    actionRef.current = async () => {
      // Simulate retry - in real app, call API
      const updated = emails.map((e) =>
        e.id === email.id
          ? {
              ...e,
              status: "Pending" as const,
              retry_count: e.retry_count + 1,
              updated_at: new Date().toISOString(),
            }
          : e
      );
      setEmails(updated);
      saveSnapshot(updated);
    };
    setConfirmOpen(true);
  }

  function openDetail(email: EmailLog) {
    setDetailEmail(email);
    setDetailOpen(true);
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailEmail(null);
  }

  function onDetailRetry(email: EmailLog) {
    closeDetail();
    setTimeout(() => promptRetryEmail(email), 80);
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
        setEmails(data);
        saveSnapshot(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat data email logs...
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

  // Get unique email types
  const emailTypes = Array.from(new Set(emails.map((e) => e.email_type)));

  // Filter emails
  let filteredEmails = emails;

  if (searchQuery.trim()) {
    filteredEmails = filteredEmails.filter(
      (email) =>
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.recipients.some((r) =>
          r.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }

  if (selectedStatus) {
    filteredEmails = filteredEmails.filter(
      (email) => email.status === selectedStatus
    );
  }

  if (selectedType) {
    filteredEmails = filteredEmails.filter(
      (email) => email.email_type === selectedType
    );
  }

  // Sort emails
  const sortedEmails = [...filteredEmails].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "date-asc":
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "priority-asc":
        return a.priority - b.priority;
      case "priority-desc":
        return b.priority - a.priority;
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
    total: emails.length,
    sent: emails.filter((e) => e.status === "Sent").length,
    error: emails.filter((e) => e.status === "Error").length,
    pending: emails.filter((e) => e.status === "Pending").length,
    expired: emails.filter((e) => e.status === "Expired").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Email Logs
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Riwayat dan status pengiriman email sistem
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={refreshData}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaSync className="w-4 h-4" />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FaEnvelope className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">Total</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <FaCheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Terkirim</span>
          </div>
          <div className="text-3xl font-bold text-green-900">{stats.sent}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <FaExclamationTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-700 font-medium">Error</span>
          </div>
          <div className="text-3xl font-bold text-red-900">{stats.error}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <FaHourglassHalf className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-700 font-medium">Pending</span>
          </div>
          <div className="text-3xl font-bold text-yellow-900">
            {stats.pending}
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <FaBan className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">Expired</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats.expired}
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
                placeholder="Cari email, subject, pengirim, penerima..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="date-desc">Tanggal: Terbaru</option>
                <option value="date-asc">Tanggal: Terlama</option>
                <option value="priority-asc">Priority: Low - High</option>
                <option value="priority-desc">Priority: High - Low</option>
                <option value="status-asc">Status: Error First</option>
                <option value="status-desc">Status: Sent First</option>
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
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaTh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
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

            {/* Status Filter */}
            <button
              onClick={() => setSelectedStatus(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === null
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua Status
            </button>
            {["Sent", "Error", "Pending", "Expired", "Not Sent"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedStatus === status
                      ? status === "Sent"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                        : status === "Error"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                        : status === "Pending"
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-200"
                        : "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              )
            )}

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Type Filter */}
            {emailTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setSelectedType(selectedType === type ? null : type)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                  selectedType === type
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Active Filters Info */}
          {(searchQuery ||
            selectedStatus ||
            selectedType ||
            sortBy !== "date-desc") && (
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
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Status: {selectedStatus}
                </span>
              )}
              {selectedType && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                  Type: {selectedType}
                </span>
              )}
              {sortBy !== "date-desc" && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  Sort: {sortBy.split("-").join(" ").toUpperCase()}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus(null);
                  setSelectedType(null);
                  setSortBy("date-desc");
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                Reset Semua
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Email List Display */}
      {sortedEmails.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada email log
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada email log yang tercatat"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {sortedEmails.map((email) => (
            <EmailLogCard
              key={email.id}
              email={email}
              viewMode={viewMode}
              onView={() => openDetail(email)}
              onRetry={() => promptRetryEmail(email)}
            />
          ))}
        </div>
      )}

      {/* Results count */}
      {sortedEmails.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Menampilkan {sortedEmails.length} dari {emails.length} email log
        </div>
      )}

      {/* Modals */}
      <EmailDetailModal
        open={detailOpen}
        onClose={closeDetail}
        email={detailEmail}
        onRetry={onDetailRetry}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Ya, Kirim Ulang"
        cancelLabel="Batal"
      />
    </div>
  );
}
