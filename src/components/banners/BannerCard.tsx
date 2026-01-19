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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border-2 ${
          banner.disabled === 1
            ? "border-red-200 opacity-60"
            : "border-gray-100 hover:border-red-200"
        }`}
      >
        <div className="p-4 flex items-center gap-4">
          {/* Image Preview */}
          <div className="relative w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                <FaEyeSlash className="w-6 h-6" />
              </div>
            )}
            {banner.disabled === 1 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-xs font-bold">DISABLED</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 mb-1 truncate">
              {banner.banner_name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
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

              {/* Display Order */}
              <span className="text-xs text-gray-500">
                Order: #{banner.display_order}
              </span>

              {/* Click Count */}
              {banner.click_count !== undefined && (
                <span className="text-xs text-gray-500">
                  {banner.click_count} clicks
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
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

            {/* View Button */}
            <button
              onClick={onView}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
              title="View Details"
            >
              <FaEye className="w-4 h-4" />
            </button>

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
        style={{ aspectRatio: "3/1" }}
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
