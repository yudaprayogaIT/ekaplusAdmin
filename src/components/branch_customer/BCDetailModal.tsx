"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBuilding,
  FaClock,
  FaEdit,
  FaCheckCircle,
  FaBan,
  FaLink,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
  FaStream,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { BranchCustomer, GlobalParty, GlobalCustomer } from "@/types/customer";
import { mockGlobalParties } from "@/data/mockGlobalParties";
import { mockGlobalCustomers } from "@/data/mockGlobalCustomers";

interface BCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bc: BranchCustomer | null;
  onViewGP?: (gp: GlobalParty) => void;
  onViewGC?: (gc: GlobalCustomer) => void;
}

export function BCDetailModal({
  isOpen,
  onClose,
  bc,
  onViewGP,
  onViewGC,
}: BCDetailModalProps) {
  // Parent entities
  const [parentGC, setParentGC] = useState<GlobalCustomer | null>(null);
  const [parentGP, setParentGP] = useState<GlobalParty | null>(null);

  // Load parents when modal opens
  useEffect(() => {
    if (isOpen && bc) {
      // Find parent GC
      const gc = mockGlobalCustomers.find(g => g.id === bc.gc_id);
      setParentGC(gc || null);

      // Find parent GP (through GC)
      if (gc) {
        const gp = mockGlobalParties.find(g => g.id === gc.gp_id);
        setParentGP(gp || null);
      } else {
        setParentGP(null);
      }
    }
  }, [isOpen, bc]);

  if (!bc) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Branch Customer Details
                  </h2>
                  <p className="text-sm text-orange-100">BC ID: #{bc.id}</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* BC Name */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  BC Name
                </h3>
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-2 border-orange-100">
                  <p className="text-2xl font-bold text-gray-900">{bc.name}</p>
                </div>
              </section>

              {/* Branch Info */}
              {(bc.branch_name || bc.branch_city) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaMapMarkerAlt className="w-4 h-4" />
                    Branch Information
                  </h3>
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border-2 border-green-100">
                    <p className="text-lg font-bold text-green-900">
                      {bc.branch_name}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <FaMapMarkerAlt className="w-3.5 h-3.5 text-green-600" />
                      <p className="text-sm text-green-700">{bc.branch_city}</p>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Branch ID: #{bc.branch_id}
                    </p>
                  </div>
                </section>
              )}

              {/* Owner Information */}
              {(bc.owner_name || bc.owner_phone || bc.owner_email) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Informasi Owner
                  </h3>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100 space-y-3">
                    {bc.owner_name && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FaUser className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Nama Owner</p>
                          <p className="text-base font-bold text-gray-900">{bc.owner_name}</p>
                        </div>
                      </div>
                    )}

                    {bc.owner_phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <FaPhone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Nomor Telepon</p>
                          <p className="text-base font-bold text-gray-900">{bc.owner_phone}</p>
                        </div>
                      </div>
                    )}

                    {bc.owner_email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <FaEnvelope className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="text-base font-bold text-gray-900">{bc.owner_email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Full Hierarchy: GP → GC → BC */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaStream className="w-4 h-4" />
                  Hierarki Lengkap
                </h3>

                <div className="space-y-3">
                  {/* GP (Root) */}
                  {parentGP ? (
                    <button
                      onClick={() => onViewGP && onViewGP(parentGP)}
                      className="w-full bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border-2 border-purple-100 hover:border-purple-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <FaBuilding className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Level 1: Global Party (GP)
                            </p>
                            <p className="text-lg font-bold text-gray-900 group-hover:text-purple-600">
                              {parentGP.name}
                            </p>
                            <p className="text-sm text-purple-600 mt-0.5">GP ID: #{parentGP.id}</p>
                          </div>
                        </div>
                        <FaChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                      </div>
                    </button>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 italic">GP tidak ditemukan</p>
                    </div>
                  )}

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-purple-300 to-blue-300"></div>
                  </div>

                  {/* GC (Middle) */}
                  {parentGC ? (
                    <button
                      onClick={() => onViewGC && onViewGC(parentGC)}
                      className="w-full bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <FaBuilding className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-medium">
                              Level 2: Global Customer (GC)
                            </p>
                            <p className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                              {parentGC.name}
                            </p>
                            <p className="text-sm text-blue-600 mt-0.5">GC ID: #{parentGC.id}</p>
                          </div>
                        </div>
                        <FaChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                      </div>
                    </button>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <p className="text-sm text-gray-500 italic">GC tidak ditemukan</p>
                    </div>
                  )}

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-blue-300 to-orange-300"></div>
                  </div>

                  {/* BC (Current - This entity) */}
                  <div className="w-full bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-2 border-orange-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <FaBuilding className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Level 3: Branch Customer (BC) - Current
                        </p>
                        <p className="text-lg font-bold text-orange-900">{bc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-orange-600">BC ID: #{bc.id}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-sm text-orange-600">{bc.branch_city}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                        YOU ARE HERE
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Status */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Status
                </h3>
                <div>
                  {bc.disabled === 1 ? (
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
                </div>
              </section>

              {/* Activity Log */}
              {(bc.created_at || bc.updated_at) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Catatan Aktivitas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created Info */}
                    {bc.created_at && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                            <FaBuilding className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Created By
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {bc.created_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-green-500" />
                          <p className="text-sm">
                            {new Date(bc.created_at).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Updated Info */}
                    {bc.updated_at && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <FaEdit className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Last Updated
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {bc.updated_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-blue-500" />
                          <p className="text-sm">
                            {new Date(bc.updated_at).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
