"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaBuilding,
  FaChevronRight,
  FaStore,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { GPDetailModal } from "@/components/global_party/GPDetailModal";
import { GCDetailModal } from "@/components/global_customer/GCDetailModal";
import { BCDetailModal } from "@/components/branch_customer/BCDetailModal";
import type {
  GlobalParty,
  GlobalCustomer,
  BranchCustomer,
} from "@/types/customer";

interface UserMember {
  owner_name: string;
  owner_phone?: string;
  owner_email?: string;
  companies: {
    gps: GlobalParty[];
    gcs: GlobalCustomer[];
    bcs: BranchCustomer[];
  };
  totalCompanies: number;
}

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserMember | null;
}

export function MemberDetailModal({
  isOpen,
  onClose,
  user,
}: MemberDetailModalProps) {
  const [selectedGP, setSelectedGP] = useState<GlobalParty | null>(null);
  const [selectedGC, setSelectedGC] = useState<GlobalCustomer | null>(null);
  const [selectedBC, setSelectedBC] = useState<BranchCustomer | null>(null);

  if (!user) return null;

  return (
    <>
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
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <FaUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {user.owner_name}
                    </h2>
                    <p className="text-sm text-purple-100">
                      {user.totalCompanies} perusahaan terdaftar
                    </p>
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
                {/* User Contact Information */}
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Contact Information
                  </h3>

                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border-2 border-purple-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <FaUser className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Nama</p>
                        <p className="text-base font-bold text-gray-900">
                          {user.owner_name}
                        </p>
                      </div>
                    </div>

                    {user.owner_phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <FaPhone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">
                            Nomor Telepon
                          </p>
                          <p className="text-base font-bold text-gray-900">
                            {user.owner_phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.owner_email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <FaEnvelope className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="text-base font-bold text-gray-900">
                            {user.owner_email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Companies Owned */}
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaBuilding className="w-4 h-4" />
                    Perusahaan yang Dimiliki
                  </h3>

                  <div className="space-y-4">
                    {/* Global Parties */}
                    {user.companies.gps.length > 0 && (
                      <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border-2 border-purple-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                              <FaBuilding className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                Global Parties (GP)
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.companies.gps.length} GP terdaftar
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {user.companies.gps.map((gp) => (
                            <button
                              key={gp.id}
                              onClick={() => setSelectedGP(gp)}
                              className="w-full bg-white border-2 border-purple-200 rounded-lg p-3 hover:border-purple-400 hover:shadow-md transition-all text-left group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900 group-hover:text-purple-600">
                                    {gp.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    GP ID: #{gp.id}
                                  </p>
                                </div>
                                <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Global Customers */}
                    {user.companies.gcs.length > 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                              <FaBuilding className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                Global Customers (GC)
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.companies.gcs.length} GC terdaftar
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {user.companies.gcs.map((gc) => (
                            <button
                              key={gc.id}
                              onClick={() => setSelectedGC(gc)}
                              className="w-full bg-white border-2 border-blue-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600">
                                    {gc.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    GC ID: #{gc.id} • GP: {gc.gp_name}
                                  </p>
                                </div>
                                <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Branch Customers */}
                    {user.companies.bcs.length > 0 && (
                      <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-2 border-orange-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                              <FaStore className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                Branch Customers (BC)
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.companies.bcs.length} BC terdaftar
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {user.companies.bcs.map((bc) => (
                            <button
                              key={bc.id}
                              onClick={() => setSelectedBC(bc)}
                              className="w-full bg-white border-2 border-orange-200 rounded-lg p-3 hover:border-orange-400 hover:shadow-md transition-all text-left group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600">
                                    {bc.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">
                                      BC ID: #{bc.id}
                                    </span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">
                                      {bc.branch_city}
                                    </span>
                                  </div>
                                </div>
                                <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Companies */}
                    {user.totalCompanies === 0 && (
                      <div className="bg-gray-50 rounded-xl p-8 text-center">
                        <FaBuilding className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                          User ini belum memiliki perusahaan terdaftar
                        </p>
                      </div>
                    )}
                  </div>
                </section>
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

      {/* Entity Detail Modals */}
      <GPDetailModal
        isOpen={selectedGP !== null}
        onClose={() => setSelectedGP(null)}
        gp={selectedGP}
        onGPUpdate={(updated) => {
          setSelectedGP(updated);
        }}
        onViewGC={(gc) => {
          setSelectedGP(null);
          setSelectedGC(gc);
        }}
        onViewBC={(bc) => {
          setSelectedGP(null);
          setSelectedBC(bc);
        }}
      />

      <GCDetailModal
        isOpen={selectedGC !== null}
        onClose={() => setSelectedGC(null)}
        gc={selectedGC}
        onViewGP={(gp) => {
          setSelectedGC(null);
          setSelectedGP(gp);
        }}
        onViewBC={(bc) => {
          setSelectedGC(null);
          setSelectedBC(bc);
        }}
      />

      <BCDetailModal
        isOpen={selectedBC !== null}
        onClose={() => setSelectedBC(null)}
        bc={selectedBC}
        onViewGP={(gp) => {
          setSelectedBC(null);
          setSelectedGP(gp);
        }}
        onViewGC={(gc) => {
          setSelectedBC(null);
          setSelectedGC(gc);
        }}
      />
    </>
  );
}
