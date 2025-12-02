// src/components/branches/BranchDetailModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaEdit, FaTrash, FaMapMarkerAlt, FaGlobe, FaCity, FaMapPin, FaExternalLinkAlt, FaLock } from "react-icons/fa";
import Image from "next/image";

type Branch = {
  id: number;
  name: string;
  daerah: string;
  address: string;
  lat: number;
  lng: number;
  pulau: string;
  wilayah: string;
  url: string;
  token: string;
  disabled: number;
};

export default function BranchDetailModal({
  open,
  onClose,
  branch,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: {
  open: boolean;
  onClose: () => void;
  branch?: Branch | null;
  onEdit?: (b: Branch) => void;
  onDelete?: (b: Branch) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  if (!branch) return null;

  const googleMapsUrl = `https://www.google.com/maps?q=${branch.lat},${branch.lng}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
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
                {/* Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    {branch.pulau}
                  </span>
                  <span className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold ${
                    branch.wilayah === 'Barat' ? 'bg-green-500/90' : 'bg-purple-500/90'
                  }`}>
                    Wilayah {branch.wilayah}
                  </span>
                  <span className={`px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-semibold ${
                    branch.disabled === 0 ? 'bg-green-500/90' : 'bg-gray-500/90'
                  }`}>
                    {branch.disabled === 0 ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-4xl font-bold mb-3">{branch.name}</h2>
                
                <div className="flex items-center gap-2 text-lg text-red-100">
                  <FaCity className="w-5 h-5" />
                  <span>{branch.daerah}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Map Preview */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Lokasi</label>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all group"
                >
                  <Image src="/images/maps.jpg" alt="alt" width={1000} height={1000} className="h-80 w-full object-cover"/>
                  {/* <div className="w-full h-80 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <FaMapMarkerAlt className="w-24 h-24 text-red-200" />
                  </div> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <div className="px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full flex items-center gap-2 font-semibold text-gray-800">
                      <FaExternalLinkAlt className="w-4 h-4" />
                      <span>Buka di Google Maps</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Address & Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-100">
                  <div className="flex items-start gap-3 mb-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Alamat</label>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{branch.address}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FaMapPin className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-bold text-blue-900 uppercase tracking-wide">Koordinat</label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-700">Latitude:</span>
                      <code className="px-3 py-1 bg-white rounded-lg text-sm font-mono text-blue-900">
                        {branch.lat.toFixed(6)}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-700">Longitude:</span>
                      <code className="px-3 py-1 bg-white rounded-lg text-sm font-mono text-blue-900">
                        {branch.lng.toFixed(6)}
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* URL & Token */}
              {(branch.url || branch.token) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {branch.url && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-3">
                        <FaGlobe className="w-5 h-5 text-green-600" />
                        <label className="text-sm font-bold text-green-900 uppercase tracking-wide">Website</label>
                      </div>
                      <a
                        href={branch.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 hover:text-green-900 break-all underline text-sm font-medium"
                      >
                        {branch.url}
                      </a>
                    </div>
                  )}

                  {branch.token && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                        </svg>
                        <label className="text-sm font-bold text-purple-900 uppercase tracking-wide">API Token</label>
                      </div>
                      <code className="text-purple-800 font-mono text-sm bg-white px-3 py-2 rounded-lg block break-all">
                        {branch.token}
                      </code>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
                {canEdit ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEdit?.(branch)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all font-semibold text-gray-800 shadow-sm"
                  >
                    <FaEdit className="w-5 h-5" />
                    <span>Edit Cabang</span>
                  </motion.button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 cursor-not-allowed">
                    <FaLock className="w-5 h-5" />
                    <span>Edit Cabang</span>
                  </div>
                )}

                {canDelete ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDelete?.(branch)}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all font-semibold shadow-lg shadow-red-200"
                  >
                    <FaTrash className="w-5 h-5" />
                    <span>Hapus</span>
                  </motion.button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl text-gray-400 cursor-not-allowed">
                    <FaLock className="w-5 h-5" />
                    <span>Hapus</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}