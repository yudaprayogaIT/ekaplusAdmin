// src/components/wishlist/WishlistDetailModal.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaBox,
  FaUser,
  FaCalendar,
  FaTag,
  FaClock,
  FaHistory,
  FaEdit,
} from "react-icons/fa";
import Image from "next/image";
import type { WishlistItem } from "@/types";

type WishlistDetailModalProps = {
  open: boolean;
  onClose: () => void;
  wishlistItem: WishlistItem | null;
};

export default function WishlistDetailModal({
  open,
  onClose,
  wishlistItem,
}: WishlistDetailModalProps) {
  if (!wishlistItem) return null;

  const { item, createdAt, userName, updatedAt, createdBy, updatedBy } =
    wishlistItem;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(createdAt).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasActivity = createdAt || updatedAt;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">Detail Wishlist Item</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Image Section */}
              <div className="bg-gray-50 p-8 border-b border-gray-200">
                <div className="max-w-md mx-auto aspect-square bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={400}
                      height={400}
                      className="object-contain w-full h-full p-6"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBox className="w-24 h-24 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 space-y-6">
                {/* Item Name */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm">
                      {item.code}
                    </span>
                    {item.type && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">
                        {item.type}
                      </span>
                    )}
                    {item.category && (
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-semibold text-sm">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <FaTag className="text-blue-600" />
                      Deskripsi
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* UOM */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Satuan</p>
                    <p className="font-semibold text-gray-800">{item.uom}</p>
                  </div>

                  {/* Color */}
                  {item.color && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Warna</p>
                      <p className="font-semibold text-gray-800">
                        {item.color}
                      </p>
                    </div>
                  )}

                  {/* Group */}
                  {item.group && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Product</p>
                      <p className="font-semibold text-gray-800">
                        {item.group}
                      </p>
                    </div>
                  )}
                </div>

                {/* Wishlist Info */}
                <div className="bg-red-50 rounded-xl p-4 border border-red-100 space-y-3">
                  <h4 className="text-sm font-semibold text-red-900 mb-3">
                    Informasi Wishlist
                  </h4>

                  {/* User */}
                  {userName && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-red-700 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">
                          Ditambahkan oleh
                        </p>
                        <p className="font-semibold text-gray-800">
                          {userName}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCalendar className="text-red-700 w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Waktu</p>
                      <p className="font-semibold text-gray-800">
                        {formattedDate}
                      </p>
                      <p className="text-xs text-gray-500">{formattedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Activity Notes */}
                {hasActivity && (
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <FaHistory className="text-blue-600 w-4 h-4" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Catatan Aktivitas
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {createdAt && (
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border border-green-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center">
                              <FaUser className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Created
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {createdBy
                                  ? typeof createdBy === "string"
                                    ? createdBy
                                    : `User #${createdBy}`
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock className="w-4 h-4 text-green-500" />
                            <p className="text-sm">
                              {new Date(createdAt).toLocaleString("id-ID", {
                                dateStyle: "long",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {updatedAt && (
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                              <FaEdit className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Last Updated
                              </p>
                              <p className="text-sm font-bold text-gray-900">
                                {updatedBy
                                  ? typeof updatedBy === "string"
                                    ? updatedBy
                                    : `User #${updatedBy}`
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock className="w-4 h-4 text-blue-500" />
                            <p className="text-sm">
                              {new Date(updatedAt).toLocaleString("id-ID", {
                                dateStyle: "long",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Branches */}
                {item.branches && item.branches.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Cabang Tersedia
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.branches.map((branch) => (
                        <span
                          key={branch.id}
                          className="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm border border-gray-200"
                        >
                          {branch.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
