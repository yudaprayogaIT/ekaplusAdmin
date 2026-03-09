"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBan,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaChevronRight,
  FaEdit,
  FaEnvelope,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhone,
  FaUsers,
  FaWarehouse,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { BranchCustomer, GroupCustomer, GroupParent } from "@/types/customer";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface BCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bc: BranchCustomer | null;
  onViewGP?: (gp: GroupParent) => void;
  onViewGC?: (gc: GroupCustomer) => void;
}

interface BCDetailApi {
  id: number;
  name?: string | null;
  bcid_name?: string | null;
  gcid?: number | null;
  branch?: number | null;
  customer_register?: number | null;
  product_need?: string | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
  branch_owner_email?: string | null;
  branch_owner_place_of_birth?: string | null;
  branch_owner_date_of_birth?: string | null;
  disabled?: number | null;
  docstatus?: number | null;
  status?: string | null;
  sync_saga_id?: string | null;
  sync_last_error?: string | null;
  sync_last_rollback_error?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface AddressRow {
  id: number;
  idx?: number | null;
  type?: string | null;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  district?: string | null;
  province?: string | null;
  postal_code?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
  parent_id?: number | null;
  parent_type?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

function toNum(v: unknown): number | undefined {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const p = Number.parseInt(v, 10);
    if (Number.isFinite(p)) return p;
  }
  return undefined;
}

function dt(v?: string | null): string {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
}

export function BCDetailModal({ isOpen, onClose, bc, onViewGP, onViewGC }: BCDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [detail, setDetail] = useState<BCDetailApi | null>(null);
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [gp, setGp] = useState<GroupParent | null>(null);
  const [gc, setGc] = useState<GroupCustomer | null>(null);
  const [nb, setNb] = useState<{ code: string; name: string } | null>(null);

  const load = useCallback(async () => {
    if (!isOpen || !bc || !token || !isAuthenticated) return;
    setLoading(true);
    setDetailError(null);
    setAddressError(null);
    setDetail(null);
    setRows([]);
    setGp(null);
    setGc(null);
    setNb(null);
    try {
      const dRes = await apiFetch(
        getQueryUrl(`${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/${bc.id}`, { fields: ["*"] }),
        { method: "GET", cache: "no-store" },
        token,
      );
      if (!dRes.ok) throw new Error(`Gagal memuat detail Branch Customer (${dRes.status})`);
      const dJson = await dRes.json();
      const dRow = (dJson?.data || null) as BCDetailApi | null;
      setDetail(dRow);

      const parentId = dRow?.id ?? bc.id;
      const aRes = await apiFetch(
        getQueryUrl("/api/resource/customer_address", {
          fields: ["*"],
          filters: [
            ["parent_type", "=", "branch_customer"],
            ["parent_id", "=", parentId],
          ],
          limit: 100000,
        }),
        { method: "GET", cache: "no-store" },
        token,
      );
      if (!aRes.ok) setAddressError(`Gagal memuat customer_address (${aRes.status})`);
      const aJson = aRes.ok ? await aRes.json() : { data: [] };
      const sorted = (Array.isArray(aJson?.data) ? aJson.data : []).sort((a: AddressRow, b: AddressRow) => {
        const idxA = toNum(a.idx) ?? Number.MAX_SAFE_INTEGER;
        const idxB = toNum(b.idx) ?? Number.MAX_SAFE_INTEGER;
        if (idxA !== idxB) return idxA - idxB;
        return (toNum(a.id) ?? Number.MAX_SAFE_INTEGER) - (toNum(b.id) ?? Number.MAX_SAFE_INTEGER);
      });
      setRows(sorted);

      const gcid = toNum(dRow?.gcid) ?? bc.gc_id;
      if (!gcid) return;
      const gcRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, { fields: ["*"], filters: [["id", "=", gcid]], limit: 1 }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const gcJson = gcRes.ok ? await gcRes.json() : { data: [] };
      const gcRow = Array.isArray(gcJson?.data) ? gcJson.data[0] : null;
      if (!gcRow) return;
      const gcMapped: GroupCustomer = {
        id: Number(gcRow.id),
        code: gcRow.name || undefined,
        name: gcRow.gc_name || gcRow.name || "-",
        gp_id: Number(gcRow.gpid || 0),
        created_at: gcRow.created_at || new Date(0).toISOString(),
        updated_at: gcRow.updated_at || gcRow.created_at || new Date(0).toISOString(),
        disabled: Number(gcRow.disabled || 0),
      };
      setGc(gcMapped);
      if (!gcMapped.gp_id) return;

      const gpRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, { fields: ["*"], filters: [["id", "=", gcMapped.gp_id]], limit: 1 }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const gpJson = gpRes.ok ? await gpRes.json() : { data: [] };
      const gpRow = Array.isArray(gpJson?.data) ? gpJson.data[0] : null;
      if (!gpRow) return;
      const gpMapped: GroupParent = {
        id: Number(gpRow.id),
        code: gpRow.name || undefined,
        name: gpRow.gp_name || gpRow.name || "-",
        created_at: gpRow.created_at || new Date(0).toISOString(),
        updated_at: gpRow.updated_at || gpRow.created_at || new Date(0).toISOString(),
        disabled: Number(gpRow.disabled || 0),
      };
      setGp(gpMapped);
      const nbId = typeof gpRow.nbid === "number" ? gpRow.nbid : toNum(gpRow.nbid?.id);
      if (!nbId) return;
      const nbRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, { fields: ["id", "name", "nb_name"], filters: [["id", "=", nbId]], limit: 1 }),
        { method: "GET", cache: "no-store" },
        token,
      );
      const nbJson = nbRes.ok ? await nbRes.json() : { data: [] };
      const nbRow = Array.isArray(nbJson?.data) ? nbJson.data[0] : null;
      if (nbRow) setNb({ code: nbRow.name || `NB${nbRow.id}`, name: nbRow.nb_name || nbRow.name || "-" });
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [isOpen, bc, token, isAuthenticated]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const displayName = useMemo(() => {
    const explicit = (detail?.bcid_name || "").trim();
    if (explicit) return explicit;
    const gcName = (bc?.gc_name || "").trim();
    const city = (bc?.branch_city || "").trim();
    return gcName && city ? `${gcName} - ${city}` : bc?.name || "-";
  }, [detail?.bcid_name, bc?.gc_name, bc?.branch_city, bc?.name]);
  if (!bc) return null;

  const bcCode = detail?.name || bc.code || `BC${bc.id}`;
  const gcCode = gc?.code || bc.gc_code || "-";
  const gcName = gc?.name || bc.gc_name || "-";
  const gpCode = gp?.code || bc.gp_code || "-";
  const gpName = gp?.name || bc.gp_name || "-";
  const branchOwner = detail?.branch_owner || bc.owner_name || "-";
  const branchOwnerPhone = detail?.branch_owner_phone || bc.owner_phone || "-";
  const branchOwnerEmail = detail?.branch_owner_email || bc.owner_email || "-";
  const branchOwnerDob = detail?.branch_owner_date_of_birth?.split("T")[0] || "-";
  const branchLocation = [bc.branch_name, bc.branch_city].filter(Boolean).join(", ") || "-";
  const createdBy = detail?.["created_by.full_name"] || bc.created_by || "System";
  const updatedBy = detail?.["updated_by.full_name"] || bc.updated_by || "System";
  const isActive = Number(detail?.disabled ?? bc.disabled ?? 0) !== 1;
  const ownerInitial = branchOwner !== "-" ? branchOwner.charAt(0).toUpperCase() : "B";

  const typeTone = (type?: string | null) => {
    const normalized = (type || "").toLowerCase();
    if (normalized.includes("office")) {
      return {
        card: "bg-blue-50/60 border-blue-200",
        top: "border-t-blue-500",
        badge: "bg-blue-600 text-white",
      };
    }
    return {
      card: "bg-emerald-50/60 border-emerald-200",
      top: "border-t-emerald-500",
      badge: "bg-emerald-100 text-emerald-700",
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex max-h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <FaBuilding className="text-xl text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">Branch Customer Details</h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      {isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <p className="pl-8 text-xs font-semibold text-slate-500">BCID: {bcCode}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-slate-50">
              <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-slate-100/80 px-6 py-3 text-sm whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">L1</span>
                  <button
                    onClick={() => gp && onViewGP?.(gp)}
                    disabled={!gp}
                    className="font-semibold text-purple-900 disabled:cursor-default disabled:opacity-80"
                  >
                    {gpName} - {gpCode}
                  </button>
                </div>
                <FaChevronRight className="text-xs text-slate-300" />
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">L2</span>
                  <button
                    onClick={() => gc && onViewGC?.(gc)}
                    disabled={!gc}
                    className="font-semibold text-blue-900 disabled:cursor-default disabled:opacity-80"
                  >
                    {gcName} - {gcCode}
                  </button>
                </div>
                <FaChevronRight className="text-xs text-slate-300" />
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">L3</span>
                  <span className="font-bold text-orange-900">{displayName} - {bcCode}</span>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {detailError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FaExclamationTriangle className="mt-0.5" />
                    <span>{detailError}</span>
                  </div>
                )}
                {loading && <div className="text-sm text-slate-500">Memuat detail branch customer...</div>}

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900">{displayName}</h3>
                        <p className="text-sm text-slate-500">Branch Code: {bcCode}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow">
                        <FaBuilding className="text-xl" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6 md:grid-cols-3">
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-600">Customer ID</p>
                        <p className="text-sm font-semibold text-slate-900">{bcCode}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">Branch Location</p>
                        <p className="text-sm font-semibold text-slate-900">{branchLocation}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-rose-600">Product Need</p>
                        <p className="text-sm font-semibold text-slate-900">{detail?.product_need || "-"}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Sales Type</p>
                        <p className="text-sm font-semibold text-slate-900">-</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Credit Limit</p>
                        <p className="text-sm font-semibold text-slate-900">-</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Payment Term</p>
                        <p className="text-sm font-semibold text-slate-900">-</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 border-l-4 border-l-blue-600 bg-white p-6">
                    <h4 className="mb-5 flex items-center gap-2 text-sm font-bold text-slate-900">
                      <FaUsers className="text-blue-600" />
                      Branch Owner
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
                          {ownerInitial}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{branchOwner}</p>
                          <p className="text-xs text-slate-500">Managing Director</p>
                        </div>
                      </div>
                      <div className="space-y-3 border-t border-slate-200 pt-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaEnvelope className="text-slate-400" />
                          <span>{branchOwnerEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaPhone className="text-slate-400" />
                          <span>{branchOwnerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="text-slate-400" />
                          <span>
                            {detail?.branch_owner_place_of_birth || "-"},{" "}
                            {branchOwnerDob}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {addressError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FaExclamationTriangle className="mt-0.5" />
                    <span>{addressError}</span>
                  </div>
                )}

                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                      <FaMapMarkerAlt className="text-slate-400" />
                      Registered Addresses
                    </h4>
                    <span className="text-xs font-medium text-slate-500">{rows.length} Addresses total</span>
                  </div>
                  {rows.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                      Tidak ada data `customer_address`.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      {rows.map((r) => {
                        const tone = typeTone(r.type);
                        const typeLabel = (r.type || r.label || "ADDRESS").toUpperCase();
                        return (
                          <div
                            key={r.id}
                            className={`rounded-xl border border-t-4 p-5 ${tone.card} ${tone.top}`}
                          >
                            <div className="mb-3 flex items-start justify-between gap-3">
                              <p className="text-xs font-bold uppercase tracking-tight text-slate-700">
                                {(r.label || "Address").toUpperCase()}
                              </p>
                              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${tone.badge}`}>
                                {typeLabel}
                              </span>
                            </div>
                            <p className="mb-4 text-sm font-medium leading-relaxed text-slate-900">{r.address || "-"}</p>
                            <div className="space-y-1.5 text-xs text-slate-600">
                              <div className="flex items-center justify-between">
                                <span>Province</span>
                                <span className="font-semibold text-slate-900">{r.province || "-"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Postal Code</span>
                                <span className="font-semibold text-slate-900">{r.postal_code || "-"}</span>
                              </div>
                              <div className="mt-2 border-t border-slate-200 pt-2">
                                <p className="font-semibold text-slate-900">PIC: {r.pic_name || "-"}</p>
                                <p className="text-slate-500">{r.pic_phone || "-"}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                    <div className="rounded-lg bg-amber-50 p-2 text-amber-500">
                      <FaCheckCircle />
                    </div>
                    <div className="text-xs">
                      <p className="mb-1 font-bold uppercase tracking-tight text-slate-500">Creation Info</p>
                      <p className="font-medium text-slate-700">
                        <span className="font-bold text-slate-900">{createdBy}</span> on {dt(detail?.created_at || bc.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-500">
                      <FaWarehouse />
                    </div>
                    <div className="text-xs">
                      <p className="mb-1 font-bold uppercase tracking-tight text-slate-500">Last Update</p>
                      <p className="font-medium text-slate-700">
                        <span className="font-bold text-slate-900">{updatedBy}</span> on {dt(detail?.updated_at || bc.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  {nb ? `NBID: ${nb.code} (${nb.name})` : null}
                  {detail?.sync_saga_id ? ` • Sync Saga: ${detail.sync_saga_id}` : null}
                  {detail?.status ? ` • Status: ${detail.status}` : null}
                  {!isActive ? (
                    <span className="ml-2 inline-flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 font-semibold text-red-700">
                      <FaBan className="text-[10px]" /> Disabled
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400"
              >
                <FaEdit className="text-xs" />
                Edit Details
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white opacity-50"
                >
                  Apply Changes
                </button>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
