"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBuilding,
  FaClock,
  FaEdit,
  FaCheckCircle,
  FaBan,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaSave,
  FaTimes,
  FaChevronRight,
  FaUsers,
  FaStore,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { GlobalParty, GlobalCustomer, BranchCustomer } from "@/types/customer";
import { mockGlobalCustomers } from "@/data/mockGlobalCustomers";
import { mockBranchCustomers } from "@/data/mockBranchCustomers";

interface GPDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gp: GlobalParty | null;
  onGPUpdate?: (updatedGP: GlobalParty) => void;
  onViewGC?: (gc: GlobalCustomer) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

export function GPDetailModal({
  isOpen,
  onClose,
  gp,
  onGPUpdate,
  onViewGC,
  onViewBC,
}: GPDetailModalProps) {
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Children data
  const [childGCs, setChildGCs] = useState<GlobalCustomer[]>([]);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);

  // Reset state when modal opens/closes or GP changes
  useEffect(() => {
    if (isOpen && gp) {
      setIsEditMode(false);
      setEditedName(gp.name);

      // Load children data
      const gcs = mockGlobalCustomers.filter(gc => gc.gp_id === gp.id);
      const bcs = mockBranchCustomers.filter(bc => bc.gp_name === gp.name);

      setChildGCs(gcs);
      setChildBCs(bcs);
    }
  }, [isOpen, gp]);

  if (!gp) return null;

  const handleEditClick = () => {
    setEditedName(gp.name);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditedName(gp.name);
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!editedName.trim()) {
      alert("GP Name tidak boleh kosong");
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update the GP object
      const updatedGP: GlobalParty = {
        ...gp,
        name: editedName,
        updated_at: new Date().toISOString(),
        updated_by: "Admin", // TODO: Get from auth context
      };

      // Trigger update event
      window.dispatchEvent(new Event("ekatalog:gp_update"));

      // Callback to parent
      if (onGPUpdate) {
        onGPUpdate(updatedGP);
      }

      setIsEditMode(false);
      alert(`GP Name berhasil diupdate menjadi "${editedName}"`);
    } catch (error) {
      alert("Gagal update GP Name");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Global Party Details
                  </h2>
                  <p className="text-sm text-purple-100">GP ID: #{gp.id}</p>
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
              {/* GP Name - Editable */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    GP Name
                  </h3>
                  {!isEditMode && (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg hover:bg-purple-200 transition-all"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>

                {isEditMode ? (
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border-2 border-purple-200">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full text-2xl font-bold text-gray-900 bg-white border-2 border-purple-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Masukkan GP Name"
                      disabled={isSaving}
                      autoFocus
                    />
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <FaSave className="w-4 h-4" />
                            <span>Simpan</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTimes className="w-4 h-4" />
                        <span>Batal</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border-2 border-purple-100">
                    <p className="text-2xl font-bold text-gray-900">{gp.name}</p>
                  </div>
                )}
              </section>

              {/* Owner Information */}
              {(gp.owner_name || gp.owner_phone || gp.owner_email) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Informasi Owner
                  </h3>

                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100 space-y-3">
                    {gp.owner_name && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FaUser className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Nama Owner</p>
                          <p className="text-base font-bold text-gray-900">{gp.owner_name}</p>
                        </div>
                      </div>
                    )}

                    {gp.owner_phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <FaPhone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Nomor Telepon</p>
                          <p className="text-base font-bold text-gray-900">{gp.owner_phone}</p>
                        </div>
                      </div>
                    )}

                    {gp.owner_email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <FaEnvelope className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">Email</p>
                          <p className="text-base font-bold text-gray-900">{gp.owner_email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Status */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Status
                </h3>
                <div>
                  {gp.disabled === 1 ? (
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

              {/* Children: GCs and BCs */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaUsers className="w-4 h-4" />
                  Hierarki Children
                </h3>

                <div className="space-y-4">
                  {/* Global Customers */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FaBuilding className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Global Customers (GC)</p>
                          <p className="text-xs text-gray-500">{childGCs.length} GC terdaftar</p>
                        </div>
                      </div>
                    </div>

                    {childGCs.length > 0 ? (
                      <div className="space-y-2">
                        {childGCs.map((gc) => (
                          <button
                            key={gc.id}
                            onClick={() => onViewGC && onViewGC(gc)}
                            className="w-full bg-white border-2 border-blue-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all text-left group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600">
                                  {gc.name}
                                </p>
                                <p className="text-xs text-gray-500">GC ID: #{gc.id}</p>
                              </div>
                              <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Belum ada GC terdaftar</p>
                    )}
                  </div>

                  {/* Branch Customers */}
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
                </div>
              </section>

              {/* Activity Log */}
              {(gp.created_at || gp.updated_at) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Catatan Aktivitas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Created Info */}
                    {gp.created_at && (
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
                              {gp.created_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-green-500" />
                          <p className="text-sm">
                            {new Date(gp.created_at).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Updated Info */}
                    {gp.updated_at && (
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
                              {gp.updated_by || "System"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock className="w-4 h-4 text-blue-500" />
                          <p className="text-sm">
                            {new Date(gp.updated_at).toLocaleString("id-ID", {
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
