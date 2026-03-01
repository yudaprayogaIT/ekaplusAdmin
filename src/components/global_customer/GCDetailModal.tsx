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
  FaChevronRight,
  FaStore,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { GlobalCustomer, GlobalParty, BranchCustomer } from "@/types/customer";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface GCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gc: GlobalCustomer | null;
  onViewGP?: (gp: GlobalParty) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
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

export function GCDetailModal({
  isOpen,
  onClose,
  gc,
  onViewGP,
  onViewBC,
}: GCDetailModalProps) {
  const { token, isAuthenticated } = useAuth();

  const [parentGP, setParentGP] = useState<GlobalParty | null>(null);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);

  const loadRelations = useCallback(async () => {
    if (!isOpen || !gc || !isAuthenticated || !token) return;

    if (gc.gp_id) {
      const gpSpec = {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["id", "=", gc.gp_id]],
        limit: 1,
      };
      const gpRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpSpec),
        { method: "GET", cache: "no-store" },
        token
      );
      const gpJson = gpRes.ok ? await gpRes.json() : { data: [] };
      const row: GroupParentRow | undefined = Array.isArray(gpJson?.data)
        ? gpJson.data[0]
        : undefined;

      setParentGP(
        row
          ? {
              id: Number(row.id),
              code: row.name || undefined,
              name: row.gp_name || row.name || "-",
              created_at: row.created_at || new Date(0).toISOString(),
              updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
              created_by: resolveUserName(row["created_by.full_name"], row.created_by),
              updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
              disabled: Number(row.disabled || 0),
            }
          : null
      );
    } else {
      setParentGP(null);
    }

    const bcSpec = {
      fields: ["*", "created_by.full_name", "updated_by.full_name"],
      filters: [["gcid", "=", gc.id]],
      limit: 1000000,
    };
    const bcRes = await apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bcSpec),
      { method: "GET", cache: "no-store" },
      token
    );
    const bcJson = bcRes.ok ? await bcRes.json() : { data: [] };
    const rows: BranchCustomerRow[] = Array.isArray(bcJson?.data) ? bcJson.data : [];

    const branchIds = Array.from(
      new Set(
        rows
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

    const mapped: BranchCustomer[] = rows.map((row) => {
      const branchId = row.branch && typeof row.branch === "object" ? toNumber(row.branch.id) || 0 : toNumber(row.branch) || 0;
      const branchRef = branchMap.get(branchId);
      const directBranchName = row.branch && typeof row.branch === "object" ? row.branch.branch_name : undefined;
      const directBranchCity = row.branch && typeof row.branch === "object" ? row.branch.city : undefined;

      return {
        id: Number(row.id),
        code: row.name || undefined,
        name: row.name || `${gc.name} - ${directBranchCity || branchRef?.city || "-"}`,
        gc_id: gc.id,
        gc_name: gc.name,
        gc_code: gc.code,
        gp_name: gc.gp_name,
        gp_code: gc.gp_code,
        branch_id: branchId,
        branch_name: directBranchName || branchRef?.name,
        branch_city: directBranchCity || branchRef?.city,
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

    setChildBCs(mapped);
  }, [gc, isAuthenticated, isOpen, token]);

  useEffect(() => {
    loadRelations();
  }, [loadRelations]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!gc) return null;

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
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBuilding className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Group Customer Details</h2>
                  <p className="text-sm text-blue-100">GCID: {gc.code || `GC${gc.id}`}</p>
                </div>
              </div>

              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">GC Name</h3>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                  <p className="text-2xl font-bold text-gray-900">{gc.name}</p>
                </div>
              </section>

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

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaArrowUp className="w-4 h-4" />
                  Parent: Group Parent
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
                          <p className="text-xs text-gray-500 font-medium">Group Parent (GP)</p>
                          <p className="text-lg font-bold text-gray-900 group-hover:text-purple-600">{parentGP.name}</p>
                          <p className="text-sm text-purple-600 mt-0.5">GPID: {parentGP.code || `GP${parentGP.id}`}</p>
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

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Status</h3>
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
              </section>

              {(gc.created_at || gc.updated_at) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <FaClock className="w-4 h-4" />
                    Catatan Aktivitas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gc.created_at && (
                      <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                            <FaBuilding className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Created By</p>
                            <p className="text-sm font-bold text-gray-900">{gc.created_by || "System"}</p>
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

                    {gc.updated_at && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <FaEdit className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Last Updated</p>
                            <p className="text-sm font-bold text-gray-900">{gc.updated_by || "System"}</p>
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

