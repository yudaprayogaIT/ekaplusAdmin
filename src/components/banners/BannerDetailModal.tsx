// src/components/banners/BannerDetailModal.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaLink,
  FaRoute,
  FaBox,
  FaTags,
  FaBan,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaCalendar,
  FaUser,
} from "react-icons/fa";
import Image from "next/image";
import type { Banner, ScheduleStatus } from "@/types/banner";

type Props = {
  open: boolean;
  onClose: () => void;
  banner: Banner | null;
  onEdit: (banner: Banner) => void;
  onDelete: (banner: Banner) => void;
  scheduleStatus: ScheduleStatus;
};

export default function BannerDetailModal({
  open,
  onClose,
  banner,
  onEdit,
  onDelete,
  scheduleStatus,
}: Props) {
  if (!banner) return null;

  // Type badge configuration
  const getTypeBadge = () => {
    const configs = {
      url: {
        icon: FaLink,
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "URL",
      },
      internal_route: {
        icon: FaRoute,
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Internal Route",
      },
      product: {
        icon: FaBox,
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Product",
      },
      category: {
        icon: FaTags,
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Category",
      },
      none: {
        icon: FaBan,
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Display Only",
      },
    };

    return configs[banner.type];
  };

  // Schedule badge configuration
  const getScheduleBadge = () => {
    const configs = {
      active: {
        icon: FaCheckCircle,
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Active",
      },
      scheduled: {
        icon: FaClock,
        bg: "bg-sky-100",
        text: "text-sky-700",
        label: "Scheduled",
      },
      expired: {
        icon: FaTimesCircle,
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Expired",
      },
      none: null,
    };

    return configs[scheduleStatus];
  };

  // Format type value for display
  function formatTypeValue(): string {
    if (!banner) return "-";

    switch (banner.type) {
      case "url":
        return banner.type_value || "-";
      case "internal_route":
        return banner.type_value || "-";
      case "product":
        return banner.type_value ? `Product ID: ${banner.type_value}` : "-";
      case "category":
        return banner.type_value ? `Category ID: ${banner.type_value}` : "-";
      case "none":
        return "No action";
      default:
        return "-";
    }
  }

  // Format date for display
  function formatDate(dateString: string | null): string {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const typeBadge = getTypeBadge();
  const scheduleBadge = getScheduleBadge();
  const TypeIcon = typeBadge.icon;

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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">
                    {banner.banner_name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Type Badge */}
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20`}
                    >
                      <TypeIcon className="w-3 h-3" />
                      <span>{typeBadge.label}</span>
                    </div>

                    {/* Schedule Badge */}
                    {scheduleBadge && (
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20`}
                      >
                        <scheduleBadge.icon className="w-3 h-3" />
                        <span>{scheduleBadge.label}</span>
                      </div>
                    )}

                    {/* Enabled/Disabled Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        banner.disabled === 0
                          ? "bg-green-500/20 text-green-100"
                          : "bg-red-500/20 text-red-100"
                      }`}
                    >
                      {banner.disabled === 0 ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors ml-4"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              {/* Banner Image Preview */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Banner Preview
                </h4>
                <div
                  className="relative w-full bg-gray-100 rounded-xl overflow-hidden"
                  style={{ aspectRatio: "3/1" }}
                >
                  {banner.image ? (
                    <Image
                      src={banner.image}
                      alt={banner.banner_name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>No Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Banner Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Type
                  </label>
                  <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl ${typeBadge.bg} ${typeBadge.text}`}
                  >
                    <TypeIcon className="w-4 h-4" />
                    <span className="font-medium">{typeBadge.label}</span>
                  </div>
                </div>

                {/* Type Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Action Value
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    {banner.type === "url" && banner.type_value ? (
                      <a
                        href={banner.type_value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {banner.type_value}
                      </a>
                    ) : (
                      <span className="text-gray-700 font-medium break-all">
                        {formatTypeValue()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Order
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-700 font-bold">
                      #{banner.display_order}
                    </span>
                  </div>
                </div>

                {/* Schedule */}
                {(banner.start_date || banner.end_date) && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <FaCalendar className="w-3 h-3" />
                        Tanggal Mulai
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-gray-700 font-medium">
                          {formatDate(banner.start_date)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <FaCalendar className="w-3 h-3" />
                        Tanggal Selesai
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-gray-700 font-medium">
                          {formatDate(banner.end_date)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Click Count */}
                {banner.click_count !== undefined && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <FaEye className="w-3 h-3" />
                      Total Clicks
                    </label>
                    <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                      <span className="text-blue-900 font-bold text-lg">
                        {banner.click_count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Audit Trail */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  Audit Trail
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 text-gray-800 font-medium">
                      {formatDate(banner.created_at)}
                    </span>
                    {banner.created_by && (
                      <span className="ml-1 text-gray-500">
                        (User #{banner.created_by})
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <span className="ml-2 text-gray-800 font-medium">
                      {formatDate(banner.updated_at)}
                    </span>
                    {banner.updated_by && (
                      <span className="ml-1 text-gray-500">
                        (User #{banner.updated_by})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  onClick={() => onDelete(banner)}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all font-semibold"
                >
                  <FaTrash className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
                <button
                  onClick={() => onEdit(banner)}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl hover:shadow-green-200 transition-all font-semibold"
                >
                  <FaEdit className="w-4 h-4" />
                  <span>Edit Banner</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
