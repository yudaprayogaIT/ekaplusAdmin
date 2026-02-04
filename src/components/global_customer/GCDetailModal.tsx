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
  FaUser,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
  FaUsers,
  FaStore,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { GlobalCustomer, GlobalParty, BranchCustomer } from "@/types/customer";
import { mockGlobalParties } from "@/data/mockGlobalParties";
import { mockBranchCustomers } from "@/data/mockBranchCustomers";

interface GCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gc: GlobalCustomer | null;
  onViewGP?: (gp: GlobalParty) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

export function GCDetailModal({
  isOpen,
  onClose,
  gc,
  onViewGP,
  onViewBC,
}: GCDetailModalProps) {
  // Parent and children data
  const [parentGP, setParentGP] = useState<GlobalParty | null>(null);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);

  // Load parent and children when modal opens
  useEffect(() => {
    if (isOpen && gc) {
      // Find parent GP
      const gp = mockGlobalParties.find(g => g.id === gc.gp_id);
      setParentGP(gp || null);

      // Find child BCs
      const bcs = mockBranchCustomers.filter(bc => bc.gc_id === gc.id);
      setChildBCs(bcs);
    }
  }, [isOpen, gc]);

  if (!gc) return null;

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
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Global Customer Details
                  </h2>
                  <p className="text-sm text-blue-100">GC ID: #{gc.id}</p>
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
              {/* GC Name */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  GC Name
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                  <p className="text-2xl font-bold text-gray-900">{gc.name}</p>
                </div>
              </section>

              {/* Owner Information */}
              {(gc.owner_name || gc.owner_phone || gc.owner_email) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Informasi Owner
                  </h3>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100 space-y-3">
                    {gc.owner_name && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FaUser className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Nama Owner</p>
                          <p className="text-base font-bold text-gray-900">{gc.owner_name}</p>
                        </div>
                      </div>
                    )}

                    {gc.owner_phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <FaPhone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Nomor Telepon</p>
                          <p className="text-base font-bold text-gray-900">{gc.owner_phone}</p>
                        </div>
                      </div>
                    )}

                    {gc.owner_email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <FaEnvelope className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="text-base font-bold text-gray-900">{gc.owner_email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Hierarchy: Parent GP */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaArrowUp className="w-4 h-4" />
                  Parent: Global Party
                </h3>

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
                          <p className="text-xs text-gray-500 font-medium">Global Party (GP)</p>
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
                    <p className="text-sm text-gray-500 italic">Parent GP tidak ditemukan</p>
                  </div>
                )}
              </section>

              {/* Status */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Status
                </h3>
                <div>
                  {gc.disabled === 1 ? (
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

              {/* Hierarchy: Children BCs */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaArrowDown className="w-4 h-4" />
                  Children: Branch Customers
                </h3>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-2 border-orange-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <FaStore className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Branch Customers (BC)</p>
                        <p className="text-xs text-gray-500">{childBCs.length} BC terdaftar</p>
                      </div>
                    </div>
                  </div>

                  {childBCs.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {childBCs.map((bc) => (
                        <button
                          key={bc.id}
                          onClick={() => onViewBC && onViewBC(bc)}
                          className="w-full bg-white border-2 border-orange-200 rounded-lg p-3 hover:border-orange-400 hover:shadow-md transition-all text-left group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600">
                                {bc.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">BC ID: #{bc.id}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{bc.branch_city}</span>
                              </div>
                            </div>
                            <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Belum ada BC terdaftar</p>
                  )}
                </div>
              </section>

              {/* Activity Log */}
              {(gc.created_at || gc.updated_at) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Catatan Aktivitas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created Info */}
                    {gc.created_at && (
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
                              {gc.created_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-green-500" />
                          <p className="text-sm">
                            {new Date(gc.created_at).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Updated Info */}
                    {gc.updated_at && (
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
                              {gc.updated_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-blue-500" />
                          <p className="text-sm">
                            {new Date(gc.updated_at).toLocaleString("id-ID", {
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
