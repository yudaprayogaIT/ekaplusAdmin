// src/components/types/TypeDetailModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaBox,
  FaCalendar,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";
import Image from "next/image";

type ItemType = {
  id: number;
  name: string;
  image?: string;
  description?: string;
  type_name: string;
  docstatus: number;
  status: string;
  disabled: number;
  updated_at?: string;
  updated_by?: { id: number; name: string };
  created_at?: string;
  created_by?: { id: number; name: string };
  owner?: { id: number; name: string };
};

export default function TypeDetailModal({
  open,
  onClose,
  type,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  type?: ItemType | null;
  onEdit?: (t: ItemType) => void;
  onDelete?: (t: ItemType) => void;
}) {
  if (!type) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
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
            className="relative z-10 w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-8 py-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32" />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2.5 hover:bg-white/20 rounded-xl transition-colors z-10"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="relative">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <FaCheckCircle className="w-3.5 h-3.5" />
                  <span className="text-sm font-semibold">{type.status}</span>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-3">{type.name}</h2>

                {type.description && (
                  <p className="text-lg text-red-100">{type.description}</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Image */}
              {type.image ? (
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gambar
                  </label>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center min-h-[16rem] border-2 border-gray-200 shadow-inner">
                    <Image
                      width={400}
                      height={300}
                      src={type.image}
                      alt={type.name}
                      className="object-contain max-h-64 drop-shadow-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[16rem] border-2 border-dashed border-gray-300">
                    <FaBox className="w-16 h-16 text-gray-300 mb-3" />
                    <span className="text-sm font-medium text-gray-400">
                      Tidak ada gambar
                    </span>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Status */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FaCheckCircle className="w-4 h-4 text-green-600" />
                    <label className="text-xs font-bold text-green-900 uppercase tracking-wide">
                      Status
                    </label>
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    {type.status || "Active"}
                  </span>
                </div>

                {/* Created Date */}
                {type.created_at && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCalendar className="w-4 h-4 text-blue-600" />
                      <label className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                        Dibuat
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-blue-900">
                      {formatDate(type.created_at)}
                    </p>
                  </div>
                )}

                {/* Updated By */}
                {type.updated_by && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUser className="w-4 h-4 text-purple-600" />
                      <label className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                        Diupdate Oleh
                      </label>
                    </div>
                    <p className="text-sm font-semibold text-purple-900">
                      {type.updated_by.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEdit?.(type)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                >
                  <FaEdit className="w-5 h-5" />
                  <span>Edit Tipe</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete?.(type)}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                >
                  <FaTrash className="w-5 h-5" />
                  <span>Hapus</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
