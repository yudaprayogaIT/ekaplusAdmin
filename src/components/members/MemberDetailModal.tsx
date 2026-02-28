"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaPhone, FaEnvelope, FaLink, FaBuilding, FaStore } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";

export interface MemberOfRef {
  id: number;
  ref_type: "nbid" | "gpid" | "gcid" | "bcid" | string;
  ref_id: number;
  is_owner?: number | boolean;
  is_sharing?: number | boolean;
  share_from?: number | string | null;
}

export interface UserMember {
  user_id: string;
  owner_name: string;
  owner_phone?: string;
  owner_email?: string;
  refs: MemberOfRef[];
  counts: {
    nbid: number;
    gpid: number;
    gcid: number;
    bcid: number;
  };
  totalCompanies: number;
  registrations: MemberCustomerRegistration[];
}

export interface MemberCustomerRegistration {
  id: number;
  name: string;
  status: string;
  source?: string;
  owner_full_name?: string;
  owner_phone?: string;
  owner_email?: string;
  branch_name?: string;
  branch_city?: string;
  company_type?: string;
  company_title?: string;
  product_need?: string;
  nb_name?: string;
  gp_name?: string;
  gc_name?: string;
  bc_name?: string;
}

interface MemberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserMember | null;
}

function typeLabel(refType: string): string {
  if (refType === "nbid") return "National Brand";
  if (refType === "gpid") return "Group Parent";
  if (refType === "gcid") return "Group Customer";
  if (refType === "bcid") return "Branch Customer";
  return refType;
}

export function MemberDetailModal({
  isOpen,
  onClose,
  user,
}: MemberDetailModalProps) {
  if (!user) return null;

  const refsByType = user.refs.reduce<Record<string, MemberOfRef[]>>((acc, ref) => {
    if (!acc[ref.ref_type]) acc[ref.ref_type] = [];
    acc[ref.ref_type].push(ref);
    return acc;
  }, {});

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
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <FaUser className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{user.owner_name}</h2>
                  <p className="text-sm text-purple-100">
                    {user.totalCompanies} relasi member_of
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

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Contact Information
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border-2 border-purple-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <FaUser className="w-4 h-4 text-purple-500" />
                    <p className="text-sm text-gray-900 font-semibold">{user.owner_name}</p>
                  </div>
                  {user.owner_phone && (
                    <div className="flex items-center gap-3">
                      <FaPhone className="w-4 h-4 text-green-500" />
                      <p className="text-sm text-gray-900">{user.owner_phone}</p>
                    </div>
                  )}
                  {user.owner_email && (
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="w-4 h-4 text-orange-500" />
                      <p className="text-sm text-gray-900">{user.owner_email}</p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Member Of References
                </h3>
                <div className="space-y-4">
                  {Object.entries(refsByType).map(([refType, rows]) => (
                    <div
                      key={refType}
                      className="bg-white rounded-xl border-2 border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-gray-900">
                          {typeLabel(refType)}
                        </p>
                        <span className="text-xs text-gray-500">{rows.length} data</span>
                      </div>
                      <div className="space-y-2">
                        {rows.map((row) => (
                          <div
                            key={row.id}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm"
                          >
                            <div className="flex items-center gap-2 text-gray-800">
                              <FaLink className="w-3.5 h-3.5 text-gray-500" />
                              <span className="font-medium">
                                ref_id: {row.ref_id}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              <span className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-700">
                                owner: {row.is_owner ? "yes" : "no"}
                              </span>
                              <span className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-700">
                                sharing: {row.is_sharing ? "yes" : "no"}
                              </span>
                              {row.share_from ? (
                                <span className="px-2 py-1 rounded-md bg-white border border-gray-200 text-gray-700">
                                  share_from: {String(row.share_from)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Customer Register
                </h3>
                <div className="space-y-3">
                  {user.registrations.length > 0 ? (
                    user.registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="bg-white rounded-xl border-2 border-gray-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-bold text-gray-900">{reg.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Register ID: {reg.id} {reg.source ? `| Source: ${reg.source}` : ""}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              reg.status.toLowerCase() === "approved"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : reg.status.toLowerCase() === "rejected"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}
                          >
                            {reg.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
                          <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                              Owner
                            </p>
                            <p className="text-gray-900 font-medium">{reg.owner_full_name || "-"}</p>
                            <p className="text-gray-700">{reg.owner_phone || "-"}</p>
                            <p className="text-gray-700">{reg.owner_email || "-"}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg border border-green-100 p-3">
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                              Company & Branch
                            </p>
                            <div className="flex items-center gap-2 text-gray-900">
                              <FaBuilding className="w-3.5 h-3.5 text-green-700" />
                              <span>{reg.company_type || "-"} {reg.company_title ? `- ${reg.company_title}` : ""}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-800 mt-1">
                              <FaStore className="w-3.5 h-3.5 text-green-700" />
                              <span>
                                {reg.branch_name || "-"}{reg.branch_city ? `, ${reg.branch_city}` : ""}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1">{reg.product_need || "-"}</p>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div className="px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900">
                            NB: {reg.nb_name || "-"}
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-purple-50 border border-purple-100 text-purple-900">
                            GP: {reg.gp_name || "-"}
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-900">
                            GC: {reg.gc_name || "-"}
                          </div>
                          <div className="px-3 py-2 rounded-lg bg-orange-50 border border-orange-100 text-orange-900">
                            BC: {reg.bc_name || "-"}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500 italic">
                      Belum ada customer register untuk user ini
                    </div>
                  )}
                </div>
              </section>
            </div>

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
