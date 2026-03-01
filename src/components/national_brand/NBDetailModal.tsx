"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTags,
  FaUser,
  FaBuilding,
  FaStore,
  FaCheckCircle,
  FaBan,
  FaClock,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";

export interface NationalBrandDetailData {
  id: number;
  code: string;
  name: string;
  disabled: number;
  created_at: string;
  updated_at: string;
  owners: string[];
  active_gp_count: number;
  active_gc_count: number;
  active_bc_count: number;
  active_gp_names: string[];
  active_gc_names: string[];
  active_bc_names: string[];
}

interface NBDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: NationalBrandDetailData | null;
}

export function NBDetailModal({ isOpen, onClose, item }: NBDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaTags className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">National Brand Details</h2>
                  <p className="text-sm text-indigo-100">NBID: {item.code}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">NB Name</h3>
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border-2 border-indigo-100">
                  <p className="text-2xl font-bold text-gray-900">{item.name}</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Status</h3>
                {item.disabled === 1 ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg border-2 border-red-200">
                    <FaBan className="w-4 h-4" />
                    Disabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg border-2 border-green-200">
                    <FaCheckCircle className="w-4 h-4" />
                    Active
                  </span>
                )}
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Owner / Pengguna NB</h3>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                  {item.owners.length > 0 ? (
                    <div className="space-y-2">
                      {item.owners.map((owner) => (
                        <div key={owner} className="flex items-center gap-2 text-sm text-gray-900">
                          <FaUser className="w-3.5 h-3.5 text-blue-600" />
                          <span>{owner}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada owner/pengguna NB</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Relasi Aktif</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border-2 border-purple-100 bg-purple-50 p-4">
                    <p className="text-xs text-purple-700 font-semibold uppercase tracking-wide">Group Parent (PT)</p>
                    <p className="text-2xl font-bold text-purple-900 mt-1">{item.active_gp_count}</p>
                  </div>
                  <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-4">
                    <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Group Customer (Child)</p>
                    <p className="text-2xl font-bold text-blue-900 mt-1">{item.active_gc_count}</p>
                  </div>
                  <div className="rounded-xl border-2 border-orange-100 bg-orange-50 p-4">
                    <p className="text-xs text-orange-700 font-semibold uppercase tracking-wide">Branch Customer (Child)</p>
                    <p className="text-2xl font-bold text-orange-900 mt-1">{item.active_bc_count}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" />
                  Group Parent Aktif
                </h3>
                <div className="bg-white rounded-xl border-2 border-purple-100 p-4">
                  {item.active_gp_names.length > 0 ? (
                    <div className="space-y-2">
                      {item.active_gp_names.map((name) => (
                        <p key={name} className="text-sm text-gray-900">{name}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada GP aktif</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" />
                  Group Customer Aktif
                </h3>
                <div className="bg-white rounded-xl border-2 border-blue-100 p-4">
                  {item.active_gc_names.length > 0 ? (
                    <div className="space-y-2">
                      {item.active_gc_names.map((name) => (
                        <p key={name} className="text-sm text-gray-900">{name}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada GC aktif</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaStore className="w-4 h-4" />
                  Branch Customer Aktif
                </h3>
                <div className="bg-white rounded-xl border-2 border-orange-100 p-4">
                  {item.active_bc_names.length > 0 ? (
                    <div className="space-y-2">
                      {item.active_bc_names.map((name) => (
                        <p key={name} className="text-sm text-gray-900">{name}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada BC aktif</p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  Catatan Aktivitas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
                    <p className="text-xs text-gray-500 font-medium">Created</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(item.created_at).toLocaleString("id-ID", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
                    <p className="text-xs text-gray-500 font-medium">Updated</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(item.updated_at).toLocaleString("id-ID", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button onClick={onClose} className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
