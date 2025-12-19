// src/components/branches/BranchCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaGlobe,
  FaCity,
} from "react-icons/fa";
import Image from "next/image";
import type { Branch } from "./BranchList";

export default function BranchCard({
  branch,
  viewMode = "grid",
  onEdit,
  onDelete,
  onView,
  canEdit = true,
  canDelete = true,
}: {
  branch: Branch;
  viewMode?: "grid" | "list";
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={() => onView?.()}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 cursor-pointer transition-all group hover:shadow-lg"
      >
        <div className="flex items-start gap-4 md:gap-6">
          {/* Map Preview Icon - Hidden on mobile for space */}
          <div className="hidden md:flex w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex-shrink-0 items-center justify-center">
            <Image
              src="/images/maps.jpg"
              alt="map"
              width={250}
              height={250}
              className="w-25 h-25 object-cover rounded-xl"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 group-hover:text-red-600 transition-colors truncate">
                  {branch.name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <FaCity className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                    <span>{branch.city}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block" />
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {branch.island}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Area {branch.area}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
              <FaMapMarkerAlt className="w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="line-clamp-1 md:line-clamp-2">{branch.address}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all text-sm font-medium"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </motion.button>
              )}

              {canDelete && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-all text-sm font-medium text-red-600"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </motion.button>
              )}

              {branch.url && (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={branch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border-2 border-blue-100 hover:bg-blue-100 transition-all text-sm font-medium text-blue-600"
                >
                  <FaGlobe className="w-3.5 h-3.5" />
                  <span>Visit</span>
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.15)",
      }}
      onClick={() => onView?.()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Map Preview */}
      <div className="relative h-48 bg-gradient-to-br from-red-50 to-red-100 overflow-hidden">
        {/* <div className="w-full h-full flex items-center justify-center text-red-200">
          <FaMapMarkerAlt className="w-20 h-20" />
        </div> */}
        <Image
          src="/images/maps.jpg"
          alt="map"
          width={200}
          height={200}
          className="w-full object-fill"
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span
            className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-semibold shadow-sm ${
              branch.area === "Barat"
                ? "bg-green-500/90 text-white"
                : "bg-purple-500/90 text-white"
            }`}
          >
            {branch.area}
          </span>
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {branch.island}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-semibold ${
              branch.disabled === 0
                ? "bg-green-500/90 text-white"
                : "bg-gray-500/90 text-white"
            }`}
          >
            {branch.disabled === 0 ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
          {branch.name}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <FaCity className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-medium">{branch.city}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
          <FaMapMarkerAlt className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="line-clamp-2 leading-relaxed">{branch.address}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {canEdit ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group/btn"
            >
              <FaEdit className="w-3.5 h-3.5 text-gray-600 group-hover/btn:text-red-600 transition-colors" />
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-red-600 transition-colors">
                Edit
              </span>
            </motion.button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border-2 border-gray-100 text-gray-400 cursor-not-allowed">
              <FaEdit className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">Edit</span>
            </div>
          )}

          {canDelete && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
            >
              <FaTrash className="w-3.5 h-3.5 text-red-600" />
              <span className="text-sm font-semibold text-red-600">Hapus</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
