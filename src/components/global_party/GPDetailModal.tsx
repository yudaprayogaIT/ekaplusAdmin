"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { API_CONFIG, apiFetch, getQueryUrl, getResourceUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface GPDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gp: GlobalParty | null;
  onGPUpdate?: (updatedGP: GlobalParty) => void;
  onViewGC?: (gc: GlobalCustomer) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

interface GroupCustomerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gpid?: number | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface BranchCustomerRow {
  id: number;
  name?: string | null;
  gcid?: number | { id?: number; name?: string; gc_name?: string } | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
  branch_owner_email?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface BranchLookupRow {
  id: number;
  branch_name?: string | null;
  city?: string | null;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function resolveUserName(
  directName: string | null | undefined,
  value: number | { full_name?: string } | null | undefined
): string | undefined {
  if (directName) return directName;
  if (value && typeof value === "object" && value.full_name) return value.full_name;
  return undefined;
}

export function GPDetailModal({
  isOpen,
  onClose,
  gp,
  onGPUpdate,
  onViewGC,
  onViewBC,
}: GPDetailModalProps) {
  const { token, isAuthenticated } = useAuth();

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [loadingChildren, setLoadingChildren] = useState(false);
  const [childGCs, setChildGCs] = useState<GlobalCustomer[]>([]);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);

  useEffect(() => {
    if (isOpen && gp) {
      setIsEditMode(false);
      setEditedName(gp.name);
    }
  }, [isOpen, gp]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const loadChildren = useCallback(async () => {
    if (!isOpen || !gp || !isAuthenticated || !token) return;

    setLoadingChildren(true);
    try {
      const gcSpec = {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["gpid", "=", gp.id]],
        limit: 1000000,
      };
      const gcRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gcSpec),
        { method: "GET", cache: "no-store" },
        token
      );

      const gcJson = gcRes.ok ? await gcRes.json() : { data: [] };
      const gcRows: GroupCustomerRow[] = Array.isArray(gcJson?.data) ? gcJson.data : [];

      const mappedGCs: GlobalCustomer[] = gcRows.map((row) => ({
        id: Number(row.id),
        code: row.name || undefined,
        name: row.gc_name || row.name || "-",
        gp_id: gp.id,
        gp_name: gp.name,
        gp_code: gp.code,
        owner_name: row.owner_full_name || undefined,
        owner_phone: row.owner_phone || undefined,
        owner_email: row.owner_email || undefined,
        created_at: row.created_at || new Date(0).toISOString(),
        updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
        created_by: resolveUserName(row["created_by.full_name"], row.created_by),
        updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
        disabled: Number(row.disabled || 0),
      }));

      setChildGCs(mappedGCs);

      const gcIds = mappedGCs.map((item) => item.id);
      if (gcIds.length === 0) {
        setChildBCs([]);
        return;
      }

      const bcSpec = {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["gcid", "in", gcIds]],
        limit: 1000000,
      };
      const bcRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bcSpec),
        { method: "GET", cache: "no-store" },
        token
      );
      const bcJson = bcRes.ok ? await bcRes.json() : { data: [] };
      const bcRows: BranchCustomerRow[] = Array.isArray(bcJson?.data) ? bcJson.data : [];

      const branchIds = Array.from(
        new Set(
          bcRows
            .map((row) => (row.branch && typeof row.branch === "object" ? toNumber(row.branch.id) : toNumber(row.branch)))
            .filter((id): id is number => typeof id === "number")
        )
      );

      const branchMap = new Map<number, { name?: string; city?: string }>();
      if (branchIds.length > 0) {
        const branchRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
            fields: ["id", "branch_name", "city"],
            filters: [["id", "in", branchIds]],
            limit: branchIds.length,
          }),
          { method: "GET", cache: "no-store" },
          token
        );
        if (branchRes.ok) {
          const branchJson = await branchRes.json();
          const branchRows: BranchLookupRow[] = Array.isArray(branchJson?.data)
            ? branchJson.data
            : [];
          branchRows.forEach((row) => {
            branchMap.set(Number(row.id), {
              name: row.branch_name || undefined,
              city: row.city || undefined,
            });
          });
        }
      }

      const gcMap = new Map<number, GlobalCustomer>();
      mappedGCs.forEach((item) => gcMap.set(item.id, item));

      const mappedBCs: BranchCustomer[] = bcRows.map((row) => {
        const gcId = row.gcid && typeof row.gcid === "object" ? toNumber(row.gcid.id) || 0 : toNumber(row.gcid) || 0;
        const branchId = row.branch && typeof row.branch === "object" ? toNumber(row.branch.id) || 0 : toNumber(row.branch) || 0;

        const gcRef = gcMap.get(gcId);
        const directGcName = row.gcid && typeof row.gcid === "object" ? row.gcid.gc_name || row.gcid.name : undefined;
        const directBranchName = row.branch && typeof row.branch === "object" ? row.branch.branch_name : undefined;
        const directBranchCity = row.branch && typeof row.branch === "object" ? row.branch.city : undefined;
        const branchRef = branchMap.get(branchId);
        const branchCity = directBranchCity || branchRef?.city;

        return {
          id: Number(row.id),
          code: row.name || undefined,
          name: row.name || `${directGcName || gcRef?.name || "GC"} - ${branchCity || "-"}`,
          gc_id: gcId,
          gc_name: directGcName || gcRef?.name,
          gc_code: (row.gcid && typeof row.gcid === "object" ? row.gcid.name : undefined) || gcRef?.code,
          gp_name: gp.name,
          gp_code: gp.code,
          branch_id: branchId,
          branch_name: directBranchName || branchRef?.name,
          branch_city: branchCity,
          owner_name: row.branch_owner || undefined,
          owner_phone: row.branch_owner_phone || undefined,
          owner_email: row.branch_owner_email || undefined,
          created_at: row.created_at || new Date(0).toISOString(),
          updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
          created_by: resolveUserName(row["created_by.full_name"], row.created_by),
          updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
          disabled: Number(row.disabled || 0),
        };
      });

      setChildBCs(mappedBCs);
    } finally {
      setLoadingChildren(false);
    }
  }, [gp, isAuthenticated, isOpen, token]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

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
    if (!editedName.trim() || !token || !isAuthenticated) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = { gp_name: editedName.trim() };
      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gp.id),
        { method: "PUT", body: JSON.stringify(payload), cache: "no-store" },
        token
      );
      if (!res.ok) {
        throw new Error(`Failed to update Group Parent (${res.status})`);
      }

      const updatedGP: GlobalParty = {
        ...gp,
        name: editedName.trim(),
        updated_at: new Date().toISOString(),
      };

      if (onGPUpdate) onGPUpdate(updatedGP);
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Gagal update Group Parent");
    } finally {
      setIsSaving(false);
    }
  };

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
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Group Parent Details</h2>
                  <p className="text-sm text-purple-100">GPID: {gp.code || `GP${gp.id}`}</p>
                </div>
              </div>

              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">GP Name</h3>
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
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
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
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

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Status</h3>
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

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaUsers className="w-4 h-4" />
                  Hierarki Children
                </h3>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <FaBuilding className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Group Customers (GC)</p>
                          <p className="text-xs text-gray-500">
                            {loadingChildren ? "Loading..." : `${childGCs.length} GC terdaftar`}
                          </p>
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
                                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600">{gc.name}</p>
                                <p className="text-xs text-gray-500">GCID: {gc.code || `GC${gc.id}`}</p>
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

                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-2 border-orange-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                          <FaStore className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Branch Customers (BC)</p>
                          <p className="text-xs text-gray-500">
                            {loadingChildren ? "Loading..." : `${childBCs.length} BC terdaftar`}
                          </p>
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
                                <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600">{bc.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">BCID: {bc.code || `BC${bc.id}`}</span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">{bc.branch_city || "-"}</span>
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

              {(gp.created_at || gp.updated_at) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Catatan Aktivitas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gp.created_at && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                            <FaBuilding className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Created By</p>
                            <p className="text-sm font-bold text-gray-900">{gp.created_by || "System"}</p>
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

                    {gp.updated_at && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <FaEdit className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Last Updated</p>
                            <p className="text-sm font-bold text-gray-900">{gp.updated_by || "System"}</p>
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


