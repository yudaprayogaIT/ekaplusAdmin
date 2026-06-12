"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBan,
  FaBuilding,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaStream,
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
  const [openHierarchy, setOpenHierarchy] = useState(false);

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
    if (!isOpen) {
      setOpenHierarchy(false);
      return;
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><FaBuilding className="w-6 h-6 text-white" /></div>
                <div><h2 className="text-xl font-bold text-white">Branch Customer Details</h2><p className="text-sm text-orange-100">BCID: {bc.code || `BC${bc.id}`}</p></div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors"><HiXMark className="w-6 h-6 text-white" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-2 border-orange-100">
                <p className="text-2xl font-bold text-gray-900">{displayName}</p>
                <p className="text-sm text-orange-700 mt-1">Code: {detail?.name || bc.code || "-"}</p>
              </div>

              {detailError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex gap-2"><FaExclamationTriangle className="mt-0.5" />{detailError}</div>}
              {loading && <div className="text-sm text-gray-600">Memuat detail BC...</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm">
                <div><b>ID:</b> {detail?.id ?? bc.id}</div>
                <div><b>GCID:</b> {toNum(detail?.gcid) ?? bc.gc_id ?? "-"}</div>
                <div><b>Branch:</b> {toNum(detail?.branch) ?? bc.branch_id}</div>
                <div><b>Customer Register:</b> {detail?.customer_register ?? "-"}</div>
                <div><b>Product Need:</b> {detail?.product_need || "-"}</div>
                <div><b>Docstatus:</b> {detail?.docstatus ?? "-"}</div>
                <div><b>Status:</b> {detail?.status || "-"}</div>
                <div><b>Sync Saga:</b> {detail?.sync_saga_id || "-"}</div>
                <div className="md:col-span-2"><b>Sync Last Error:</b> {detail?.sync_last_error || "-"}</div>
                <div className="md:col-span-2"><b>Sync Last Rollback Error:</b> {detail?.sync_last_rollback_error || "-"}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-blue-50 rounded-xl p-4 border border-blue-100 text-sm">
                <div><b>Branch Owner:</b> {detail?.branch_owner || bc.owner_name || "-"}</div>
                <div><b>Phone:</b> {detail?.branch_owner_phone || bc.owner_phone || "-"}</div>
                <div><b>Email:</b> {detail?.branch_owner_email || bc.owner_email || "-"}</div>
                <div><b>Place of Birth:</b> {detail?.branch_owner_place_of_birth || "-"}</div>
                <div><b>Date of Birth:</b> {detail?.branch_owner_date_of_birth?.split("T")[0] || "-"}</div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <button type="button" onClick={() => setOpenHierarchy((v) => !v)} className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2"><FaStream />Hierarki Lengkap</span>
                  <span className="text-xs text-gray-600 flex items-center gap-3">NB: {nb?.code || "-"} GP: {gp?.code || bc.gp_code || "-"} GC: {gc?.code || bc.gc_code || "-"} {openHierarchy ? <FaChevronUp /> : <FaChevronDown />}</span>
                </button>
                <AnimatePresence initial={false}>
                  {openHierarchy && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-4 space-y-3">
                      {nb && <div className="rounded-xl p-3 border border-indigo-200 bg-indigo-50"><div className="text-xs text-gray-500">Level 0: NB</div><div className="font-bold">{nb.name}</div><div className="text-sm text-indigo-600">NBID: {nb.code}</div></div>}
                      {gp ? <button onClick={() => onViewGP?.(gp)} className="w-full rounded-xl p-3 border border-purple-200 bg-purple-50 text-left hover:border-purple-400"><div className="text-xs text-gray-500">Level 1: GP</div><div className="font-bold">{gp.name}</div><div className="text-sm text-purple-600">GPID: {gp.code || `GP${gp.id}`}</div></button> : <div className="text-sm text-gray-500 italic">GP tidak ditemukan</div>}
                      {gc ? <button onClick={() => onViewGC?.(gc)} className="w-full rounded-xl p-3 border border-blue-200 bg-blue-50 text-left hover:border-blue-400"><div className="text-xs text-gray-500">Level 2: GC</div><div className="font-bold">{gc.name}</div><div className="text-sm text-blue-600">GCID: {gc.code || `GC${gc.id}`}</div></button> : <div className="text-sm text-gray-500 italic">GC tidak ditemukan</div>}
                      <div className="rounded-xl p-3 border border-orange-300 bg-orange-50"><div className="text-xs text-gray-500">Level 3: BC (Current)</div><div className="font-bold text-orange-900">{displayName}</div><div className="text-sm text-orange-600">BCID: {bc.code || `BC${bc.id}`}</div></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {addressError && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 flex gap-2"><FaExclamationTriangle className="mt-0.5" />{addressError}</div>}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Customer Address (Semua Row)</h3>
                {rows.length === 0 ? <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-600">Tidak ada data `customer_address`.</div> : rows.map((r) => (
                  <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{r.label || "-"}</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs">{r.type || "-"}</span>
                        {r.is_default ? <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs">Default</span> : null}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      <div><b>ID:</b> {r.id}</div><div><b>IDX:</b> {r.idx ?? "-"}</div>
                      <div className="md:col-span-2"><b>Address:</b> {r.address || "-"}</div>
                      <div><b>City:</b> {r.city || "-"}</div><div><b>District:</b> {r.district || "-"}</div>
                      <div><b>Province:</b> {r.province || "-"}</div><div><b>Postal Code:</b> {r.postal_code || "-"}</div>
                      <div><b>PIC Name:</b> {r.pic_name || "-"}</div><div><b>PIC Phone:</b> {r.pic_phone || "-"}</div>
                      <div><b>Parent Type:</b> {r.parent_type || "-"}</div><div><b>Parent ID:</b> {r.parent_id ?? "-"}</div>
                      <div><b>Created:</b> {dt(r.created_at)}</div><div><b>Updated:</b> {dt(r.updated_at)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                {Number(detail?.disabled ?? bc.disabled ?? 0) === 1 ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg border-2 border-red-200"><FaBan />Disabled</span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-lg border-2 border-green-200"><FaCheckCircle />Active</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-sm"><b>Created By:</b> {detail?.["created_by.full_name"] || bc.created_by || "System"}<br /><b>Created At:</b> {dt(detail?.created_at || bc.created_at)}</div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-sm"><b>Updated By:</b> {detail?.["updated_by.full_name"] || bc.updated_by || "System"}<br /><b>Updated At:</b> {dt(detail?.updated_at || bc.updated_at)}</div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button onClick={onClose} className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-all">Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
