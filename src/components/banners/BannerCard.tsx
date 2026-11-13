// src/components/banners/BannerCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaLink,
  FaRoute,
  FaBox,
  FaTags,
  FaBan,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEyeSlash,
} from "react-icons/fa";
import type { Banner, ScheduleStatus } from "@/types/banner";

type Props = {
  banner: Banner;
  viewMode: "grid" | "list";
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onToggle: () => void;
  scheduleStatus: ScheduleStatus;
};

export default function BannerCard({
  banner,
  viewMode,
  onEdit,
  onDelete,
  onView,
  onToggle,
  scheduleStatus,
}: Props) {
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
        label: "Route",
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

  const typeBadge = getTypeBadge();
  const scheduleBadge = getScheduleBadge();
  const TypeIcon = typeBadge.icon;

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`grid min-w-[900px] grid-cols-[minmax(280px,2fr)_110px_140px_130px_minmax(180px,1fr)] items-center gap-4 border-t border-gray-100 px-4 py-3 transition-colors first:border-t-0 hover:bg-gray-50 ${
          banner.disabled === 1 ? "bg-gray-50/60" : "bg-white"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onView}
            className="relative h-[50px] w-[114px] shrink-0 overflow-hidden rounded-lg bg-gray-100"
            aria-label={`Lihat detail ${banner.banner_name}`}
          >
            {banner.image ? (
              <Image
                src={banner.image}
                alt={banner.banner_name}
                fill
                className="object-cover transition-transform hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <FaEyeSlash className="h-5 w-5" />
              </div>
            )}
            {banner.disabled === 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <FaEyeSlash className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
          <div className="min-w-0">
            <button
              type="button"
              onClick={onView}
              className="block max-w-full truncate text-left text-sm font-semibold text-gray-800 transition-colors hover:text-red-600"
              title={banner.banner_name}
            >
              {banner.banner_name}
            </button>
            <p className="mt-1 truncate text-xs text-gray-400">{banner.name}</p>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              banner.disabled === 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {banner.disabled === 0 ? "Enabled" : "Disabled"}
          </span>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${typeBadge.bg} ${typeBadge.text}`}
          >
            <TypeIcon className="h-3 w-3" />
            {typeBadge.label}
          </span>
        </div>

        <div>
          {scheduleBadge ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${scheduleBadge.bg} ${scheduleBadge.text}`}
            >
              <scheduleBadge.icon className="h-3 w-3" />
              {scheduleBadge.label}
            </span>
          ) : (
            <span className="text-xs text-gray-400">Tanpa jadwal</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-medium text-gray-600">
            #{banner.display_order}
            {banner.click_count !== undefined && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                {banner.click_count.toLocaleString()} klik
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onToggle}
              className={`relative mr-1 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                banner.disabled === 0 ? "bg-green-500" : "bg-gray-300"
              }`}
              title={banner.disabled === 0 ? "Enabled" : "Disabled"}
              aria-label={
                banner.disabled === 0 ? "Nonaktifkan banner" : "Aktifkan banner"
              }
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  banner.disabled === 0 ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={onView}
              className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
              title="Lihat detail"
              aria-label="Lihat detail"
            >
              <FaEye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
              title="Edit banner"
              aria-label="Edit banner"
            >
              <FaEdit className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
              title="Hapus banner"
              aria-label="Hapus banner"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border-2 ${
        banner.disabled === 1
          ? "border-red-200 opacity-60"
          : "border-gray-100 hover:border-red-200"
      } overflow-hidden group`}
    >
      {/* Banner Image Preview */}
      <div
        className="relative w-full bg-gray-100 cursor-pointer"
        style={{ aspectRatio: "1368 / 600" }}
        onClick={onView}
      >
        {banner.image ? (
          <Image
            src={banner.image}
            alt={banner.banner_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaEyeSlash className="w-8 h-8" />
          </div>
        )}
        {banner.disabled === 1 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-sm font-bold">DISABLED</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Banner Name */}
        <h3
          className="text-base font-bold text-gray-800 mb-2 truncate cursor-pointer hover:text-red-600 transition-colors"
          onClick={onView}
          title={banner.banner_name}
        >
          {banner.banner_name}
        </h3>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {/* Type Badge */}
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${typeBadge.bg} ${typeBadge.text}`}
          >
            <TypeIcon className="w-3 h-3" />
            <span>{typeBadge.label}</span>
          </div>

          {/* Schedule Badge */}
          {scheduleBadge && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${scheduleBadge.bg} ${scheduleBadge.text}`}
            >
              <scheduleBadge.icon className="w-3 h-3" />
              <span>{scheduleBadge.label}</span>
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
          <span>Order: #{banner.display_order}</span>
          {banner.click_count !== undefined && (
            <span className="flex items-center gap-1">
              <FaEye className="w-3 h-3" />
              {banner.click_count.toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Enable/Disable Toggle */}
          <button
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
              banner.disabled === 0 ? "bg-green-500" : "bg-gray-300"
            }`}
            title={banner.disabled === 0 ? "Enabled" : "Disabled"}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                banner.disabled === 0 ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              onClick={onEdit}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
              title="Edit"
            >
              <FaEdit className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
              title="Delete"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
