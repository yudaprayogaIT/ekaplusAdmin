"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  FaTrash,
  FaUsers,
  FaWarehouse,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { BranchCustomer, GroupCustomer, GroupParent } from "@/types/customer";
import { API_CONFIG, apiFetch, getQueryUrl, getResourceUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface BCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bc: BranchCustomer | null;
  onBCUpdate?: (updatedBC: BranchCustomer) => void;
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

interface WilayahOption {
  code: string;
  name: string;
}

interface ShippingAreaState {
  provinceCode: string;
  regencyCode: string;
  regencies: WilayahOption[];
  districts: WilayahOption[];
}

const PRODUCT_NEED_OPTIONS = ["Bahan Baku Springbed & Sofa", "Furniture"];
const WILAYAH_BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

function normalizeName(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function matchByName(options: WilayahOption[], value?: string | null) {
  const target = normalizeName(value);
  if (!target) return null;
  return options.find((opt) => normalizeName(opt.name) === target) || null;
}

function emptyShippingAreaState(): ShippingAreaState {
  return {
    provinceCode: "",
    regencyCode: "",
    regencies: [],
    districts: [],
  };
}

async function fetchWilayah(path: string): Promise<WilayahOption[]> {
  const res = await fetch(`${WILAYAH_BASE_URL}/${path}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed loading wilayah (${res.status})`);
  }
  const json = await res.json();
  const rows: Array<{ code?: string; id?: string; name?: string }> =
    Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];
  return rows
    .map((row) => ({
      code: String(row.code || row.id || ""),
      name: String(row.name || ""),
    }))
    .filter((row) => Boolean(row.code && row.name));
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

function buildEditSnapshot(input: {
  editedOwner: string;
  editedOwnerPhone: string;
  editedOwnerEmail: string;
  editedOwnerPlaceOfBirth: string;
  editedOwnerDateOfBirth: string;
  editedProductNeed: string;
  editedRows: AddressRow[];
  deletedRowIds: number[];
}) {
  return JSON.stringify({
    editedOwner: input.editedOwner.trim(),
    editedOwnerPhone: input.editedOwnerPhone.trim(),
    editedOwnerEmail: input.editedOwnerEmail.trim(),
    editedOwnerPlaceOfBirth: input.editedOwnerPlaceOfBirth.trim(),
    editedOwnerDateOfBirth: input.editedOwnerDateOfBirth,
    editedProductNeed: input.editedProductNeed.trim(),
    editedRows: input.editedRows.map((row) => ({
      id: row.id,
      type: row.type || "",
      label: row.label || "",
      address: row.address || "",
      city: row.city || "",
      district: row.district || "",
      province: row.province || "",
      postal_code: row.postal_code || "",
      pic_name: row.pic_name || "",
      pic_phone: row.pic_phone || "",
      is_default: row.is_default ? 1 : 0,
    })),
    deletedRowIds: [...input.deletedRowIds].sort((a, b) => a - b),
  });
}

export function BCDetailModal({
  isOpen,
  onClose,
  bc,
  onBCUpdate,
  onViewGP,
  onViewGC,
}: BCDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [detail, setDetail] = useState<BCDetailApi | null>(null);
  const [rows, setRows] = useState<AddressRow[]>([]);
  const [gp, setGp] = useState<GroupParent | null>(null);
  const [gc, setGc] = useState<GroupCustomer | null>(null);
  const [nb, setNb] = useState<{ code: string; name: string } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedOwner, setEditedOwner] = useState("");
  const [editedOwnerPhone, setEditedOwnerPhone] = useState("");
  const [editedOwnerEmail, setEditedOwnerEmail] = useState("");
  const [editedOwnerPlaceOfBirth, setEditedOwnerPlaceOfBirth] = useState("");
  const [editedOwnerDateOfBirth, setEditedOwnerDateOfBirth] = useState("");
  const [editedProductNeed, setEditedProductNeed] = useState("");
  const [editedRows, setEditedRows] = useState<AddressRow[]>([]);
  const [deletedRowIds, setDeletedRowIds] = useState<number[]>([]);
  const [editSnapshot, setEditSnapshot] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [shippingAreaStates, setShippingAreaStates] = useState<ShippingAreaState[]>([]);
  const regencyCache = useRef<Record<string, WilayahOption[]>>({});
  const districtCache = useRef<Record<string, WilayahOption[]>>({});

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
      setEditedRows(sorted);

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
    if (isOpen) return;
    setIsEditMode(false);
    setIsSaving(false);
    setShowExitConfirm(false);
    setDeletedRowIds([]);
    setEditSnapshot("");
  }, [isOpen]);

  const getRegencies = useCallback(async (provinceCode: string) => {
    if (!provinceCode) return [];
    if (regencyCache.current[provinceCode]) return regencyCache.current[provinceCode];
    const rows = await fetchWilayah(`regencies/${provinceCode}.json`);
    regencyCache.current[provinceCode] = rows;
    return rows;
  }, []);

  const getDistricts = useCallback(async (regencyCode: string) => {
    if (!regencyCode) return [];
    if (districtCache.current[regencyCode]) return districtCache.current[regencyCode];
    const rows = await fetchWilayah(`districts/${regencyCode}.json`);
    districtCache.current[regencyCode] = rows;
    return rows;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadProvinces() {
      if (!isOpen) return;
      try {
        const rows = await fetchWilayah("provinces.json");
        if (!cancelled) setProvinces(rows);
      } catch {
        if (!cancelled) setProvinces([]);
      }
    }
    void loadProvinces();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;
    async function syncAreaStates() {
      if (!isEditMode || editedRows.length === 0 || provinces.length === 0) {
        setShippingAreaStates(editedRows.map(() => emptyShippingAreaState()));
        return;
      }
      const next = await Promise.all(
        editedRows.map(async (row) => {
          const province = matchByName(provinces, row.province);
          if (!province) return emptyShippingAreaState();
          const regencies = await getRegencies(province.code);
          const regency = matchByName(regencies, row.city);
          if (!regency) {
            return {
              provinceCode: province.code,
              regencyCode: "",
              regencies,
              districts: [],
            };
          }
          const districts = await getDistricts(regency.code);
          return {
            provinceCode: province.code,
            regencyCode: regency.code,
            regencies,
            districts,
          };
        }),
      );
      if (!cancelled) setShippingAreaStates(next);
    }
    void syncAreaStates();
    return () => {
      cancelled = true;
    };
  }, [editedRows, getDistricts, getRegencies, isEditMode, provinces]);

  useEffect(() => {
    if (!isOpen || !bc) return;
    if (isEditMode) return;
    setEditedOwner((detail?.branch_owner || bc.owner_name || "").trim());
    setEditedOwnerPhone((detail?.branch_owner_phone || bc.owner_phone || "").trim());
    setEditedOwnerEmail((detail?.branch_owner_email || bc.owner_email || "").trim());
    setEditedOwnerPlaceOfBirth((detail?.branch_owner_place_of_birth || "").trim());
    setEditedOwnerDateOfBirth(
      detail?.branch_owner_date_of_birth?.split("T")[0] || "",
    );
    setEditedProductNeed((detail?.product_need || "").trim());
  }, [
    isOpen,
    bc,
    detail?.branch_owner,
    detail?.branch_owner_phone,
    detail?.branch_owner_email,
    detail?.branch_owner_place_of_birth,
    detail?.branch_owner_date_of_birth,
    detail?.product_need,
    isEditMode,
  ]);

  const hasUnsavedChanges =
    isEditMode &&
    editSnapshot !==
      buildEditSnapshot({
        editedOwner,
        editedOwnerPhone,
        editedOwnerEmail,
        editedOwnerPlaceOfBirth,
        editedOwnerDateOfBirth,
        editedProductNeed,
        editedRows,
        deletedRowIds,
      });

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || isSaving) return;
      if (hasUnsavedChanges) {
        setShowExitConfirm(true);
        return;
      }
      setShowExitConfirm(false);
      setIsEditMode(false);
      setDeletedRowIds([]);
      setEditSnapshot("");
      onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, hasUnsavedChanges, isSaving, onClose]);

  const startEdit = () => {
    if (!bc) return;
    const owner = (detail?.branch_owner || bc.owner_name || "").trim();
    const ownerPhone = (detail?.branch_owner_phone || bc.owner_phone || "").trim();
    const ownerEmail = (detail?.branch_owner_email || bc.owner_email || "").trim();
    const ownerPob = (detail?.branch_owner_place_of_birth || "").trim();
    const ownerDob = detail?.branch_owner_date_of_birth?.split("T")[0] || "";
    const productNeed = (detail?.product_need || "").trim();
    const rowSnapshot = rows.map((row) => ({ ...row }));
    setEditedOwner(owner);
    setEditedOwnerPhone(ownerPhone);
    setEditedOwnerEmail(ownerEmail);
    setEditedOwnerPlaceOfBirth(ownerPob);
    setEditedOwnerDateOfBirth(ownerDob);
    setEditedProductNeed(productNeed);
    setEditedRows(rowSnapshot);
    setDeletedRowIds([]);
    setEditSnapshot(
      buildEditSnapshot({
        editedOwner: owner,
        editedOwnerPhone: ownerPhone,
        editedOwnerEmail: ownerEmail,
        editedOwnerPlaceOfBirth: ownerPob,
        editedOwnerDateOfBirth: ownerDob,
        editedProductNeed: productNeed,
        editedRows: rowSnapshot,
        deletedRowIds: [],
      }),
    );
    setIsEditMode(true);
  };

  const closeDirectly = () => {
    setShowExitConfirm(false);
    setIsEditMode(false);
    setDeletedRowIds([]);
    setEditSnapshot("");
    onClose();
  };

  const attemptClose = () => {
    if (isSaving) return;
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
      return;
    }
    closeDirectly();
  };

  const cancelEdit = () => {
    setEditedRows(rows);
    setDeletedRowIds([]);
    setEditSnapshot("");
    setShowExitConfirm(false);
    setIsEditMode(false);
  };

  const updateEditedRow = (
    rowId: number,
    field: keyof AddressRow,
    value: string,
  ) => {
    setEditedRows((prev) =>
      prev.map((row) =>
        row.id === rowId
          ? {
              ...row,
              [field]: value,
            }
          : row,
      ),
    );
  };

  const onShippingProvinceChange = async (idx: number, provinceCode: string) => {
    const selected = provinces.find((x) => x.code === provinceCode) || null;
    const row = editedRows[idx];
    if (!row) return;
    updateEditedRow(row.id, "province", selected?.name || "");
    updateEditedRow(row.id, "city", "");
    updateEditedRow(row.id, "district", "");
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        provinceCode,
        regencyCode: "",
        regencies: [],
        districts: [],
      };
      return next;
    });
    if (!provinceCode) return;
    try {
      const regencies = await getRegencies(provinceCode);
      setShippingAreaStates((prev) => {
        const next = [...prev];
        next[idx] = {
          provinceCode,
          regencyCode: "",
          regencies,
          districts: [],
        };
        return next;
      });
    } catch (e) {
      setAddressError(
        e instanceof Error ? e.message : "Gagal memuat kota/kabupaten.",
      );
    }
  };

  const onShippingRegencyChange = async (idx: number, regencyCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const row = editedRows[idx];
    if (!row) return;
    const selected = state.regencies.find((x) => x.code === regencyCode) || null;
    updateEditedRow(row.id, "city", selected?.name || "");
    updateEditedRow(row.id, "district", "");
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        ...state,
        regencyCode,
        districts: [],
      };
      return next;
    });
    if (!regencyCode) return;
    try {
      const districts = await getDistricts(regencyCode);
      setShippingAreaStates((prev) => {
        const next = [...prev];
        const current = next[idx] || emptyShippingAreaState();
        next[idx] = {
          ...current,
          regencyCode,
          districts,
        };
        return next;
      });
    } catch (e) {
      setAddressError(
        e instanceof Error ? e.message : "Gagal memuat kecamatan.",
      );
    }
  };

  const onShippingDistrictChange = (idx: number, districtCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const row = editedRows[idx];
    if (!row) return;
    const selected = state.districts.find((x) => x.code === districtCode) || null;
    updateEditedRow(row.id, "district", selected?.name || "");
  };

  const addShippingAddress = () => {
    if (!bc) return;
    const nextId = -Date.now();
    setEditedRows((prev) => [
      ...prev,
      {
        id: nextId,
        parent_id: bc.id,
        parent_type: "branch_customer",
        type: "shipping",
        label: "Alamat Pengiriman",
        address: "",
        city: "",
        district: "",
        province: "",
        postal_code: "",
        pic_name: "",
        pic_phone: "",
        is_default: 0,
      },
    ]);
    setShippingAreaStates((prev) => [...prev, emptyShippingAreaState()]);
  };

  const removeAddress = (idx: number) => {
    const target = editedRows[idx];
    if (!target) return;
    if (target.id > 0) {
      setDeletedRowIds((prev) => [...new Set([...prev, target.id])]);
    }
    setEditedRows((prev) => prev.filter((_, i) => i !== idx));
    setShippingAreaStates((prev) => prev.filter((_, i) => i !== idx));
  };

  const applyEdit = async () => {
    if (!bc || !token || !isAuthenticated) return;

    setIsSaving(true);
    try {
      const payload = {
        branch_owner: editedOwner.trim() || null,
        branch_owner_phone: editedOwnerPhone.trim() || null,
        branch_owner_email: editedOwnerEmail.trim() || null,
        branch_owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
        branch_owner_date_of_birth: editedOwnerDateOfBirth
          ? `${editedOwnerDateOfBirth}T00:00:00Z`
          : null,
        product_need: editedProductNeed.trim() || null,
      };

      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bc.id),
        { method: "PUT", body: JSON.stringify(payload), cache: "no-store" },
        token,
      );

      if (!res.ok) {
        throw new Error(`Failed to update Branch Customer (${res.status})`);
      }

      const addressUpsertResults = await Promise.allSettled(
        editedRows.map((row) =>
          row.id > 0
            ? apiFetch(
                getResourceUrl("/api/resource/customer_address", row.id),
                {
                  method: "PUT",
                  body: JSON.stringify({
                    address: row.address || null,
                    city: row.city || null,
                    district: row.district || null,
                    province: row.province || null,
                    postal_code: row.postal_code || null,
                    pic_name: row.pic_name || null,
                    pic_phone: row.pic_phone || null,
                    type: row.type || null,
                    label: row.label || null,
                    is_default: row.is_default ? 1 : 0,
                  }),
                  cache: "no-store",
                },
                token,
              )
            : apiFetch(
                getResourceUrl("/api/resource/customer_address"),
                {
                  method: "POST",
                  body: JSON.stringify({
                    parent_type: "branch_customer",
                    parent_id: bc.id,
                    address: row.address || null,
                    city: row.city || null,
                    district: row.district || null,
                    province: row.province || null,
                    postal_code: row.postal_code || null,
                    pic_name: row.pic_name || null,
                    pic_phone: row.pic_phone || null,
                    type: row.type || "shipping",
                    label: row.label || "Alamat Pengiriman",
                    is_default: row.is_default ? 1 : 0,
                  }),
                  cache: "no-store",
                },
                token,
              ),
        ),
      );
      const addressDeleteResults = await Promise.allSettled(
        deletedRowIds.map((id) =>
          apiFetch(
            getResourceUrl("/api/resource/customer_address", id),
            { method: "DELETE", cache: "no-store" },
            token,
          ),
        ),
      );
      const hasAddressError = [...addressUpsertResults, ...addressDeleteResults].some(
        (result) =>
          result.status === "rejected" ||
          (result.status === "fulfilled" && !result.value.ok),
      );
      if (hasAddressError) {
        throw new Error("Gagal update sebagian alamat customer.");
      }

      setDetail((prev) =>
        prev
          ? {
              ...prev,
              branch_owner: editedOwner.trim() || null,
              branch_owner_phone: editedOwnerPhone.trim() || null,
              branch_owner_email: editedOwnerEmail.trim() || null,
              branch_owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
              branch_owner_date_of_birth: editedOwnerDateOfBirth
                ? `${editedOwnerDateOfBirth}T00:00:00Z`
                : null,
              product_need: editedProductNeed.trim() || null,
              updated_at: new Date().toISOString(),
            }
          : prev,
      );
      await load();

      const updatedBC: BranchCustomer = {
        ...bc,
        owner_name: editedOwner.trim() || undefined,
        owner_phone: editedOwnerPhone.trim() || undefined,
        owner_email: editedOwnerEmail.trim() || undefined,
        updated_at: new Date().toISOString(),
      };
      onBCUpdate?.(updatedBC);
      setDeletedRowIds([]);
      setEditSnapshot("");
      setShowExitConfirm(false);
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Gagal update Branch Customer",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
  const displayAddressRows = isEditMode ? editedRows : rows;
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
          onClick={(e) => e.target === e.currentTarget && attemptClose()}
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
                  onClick={attemptClose}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <HiXMark className="h-5 w-5" />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto bg-slate-50">
              {!isEditMode && (
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
              )}

              <div className="space-y-6 p-6">
                {detailError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <FaExclamationTriangle className="mt-0.5" />
                    <span>{detailError}</span>
                  </div>
                )}
                {loading && <div className="text-sm text-slate-500">Memuat detail branch customer...</div>}

                <div className={`grid grid-cols-1 gap-4 ${isEditMode ? "" : "xl:grid-cols-3"}`}>
                  <div className={`${isEditMode ? "" : "xl:col-span-2"} rounded-xl border border-slate-200 bg-white p-6`}>
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
                        {isEditMode ? (
                          <select
                            value={editedProductNeed}
                            onChange={(e) => setEditedProductNeed(e.target.value)}
                            className="w-full rounded-md border border-blue-300 px-2 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                            disabled={isSaving}
                          >
                            <option value="">Pilih kebutuhan produk</option>
                            {PRODUCT_NEED_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-sm font-semibold text-slate-900">
                            {detail?.product_need || "-"}
                          </p>
                        )}
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
                          {isEditMode ? (
                            <input
                              type="text"
                              value={editedOwner}
                              onChange={(e) => setEditedOwner(e.target.value)}
                              className="rounded-md border border-blue-300 px-2 py-1 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                              placeholder="Nama owner"
                              disabled={isSaving}
                            />
                          ) : (
                            <p className="text-sm font-bold text-slate-900">{branchOwner}</p>
                          )}
                          <p className="text-xs text-slate-500">Managing Director</p>
                        </div>
                      </div>
                      <div className="space-y-3 border-t border-slate-200 pt-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaEnvelope className="text-slate-400" />
                          {isEditMode ? (
                            <input
                              type="email"
                              value={editedOwnerEmail}
                              onChange={(e) => setEditedOwnerEmail(e.target.value)}
                              className="w-full rounded-md border border-blue-300 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                              placeholder="Email owner"
                              disabled={isSaving}
                            />
                          ) : (
                            <span>{branchOwnerEmail}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaPhone className="text-slate-400" />
                          {isEditMode ? (
                            <input
                              type="text"
                              value={editedOwnerPhone}
                              onChange={(e) => setEditedOwnerPhone(e.target.value)}
                              className="w-full rounded-md border border-blue-300 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                              placeholder="Phone owner"
                              disabled={isSaving}
                            />
                          ) : (
                            <span>{branchOwnerPhone}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt className="text-slate-400" />
                          {isEditMode ? (
                            <div className="grid w-full grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={editedOwnerPlaceOfBirth}
                                onChange={(e) =>
                                  setEditedOwnerPlaceOfBirth(e.target.value)
                                }
                                className="rounded-md border border-blue-300 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                                placeholder="Tempat lahir"
                                disabled={isSaving}
                              />
                              <input
                                type="date"
                                value={editedOwnerDateOfBirth}
                                onChange={(e) =>
                                  setEditedOwnerDateOfBirth(e.target.value)
                                }
                                className="rounded-md border border-blue-300 px-2 py-1 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
                                disabled={isSaving}
                              />
                            </div>
                          ) : (
                            <span>
                              {detail?.branch_owner_place_of_birth || "-"},{" "}
                              {branchOwnerDob}
                            </span>
                          )}
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
                    <div className="flex items-center gap-3">
                      {isEditMode && (
                        <button
                          type="button"
                          onClick={addShippingAddress}
                          className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700"
                        >
                          + Alamat Pengiriman
                        </button>
                      )}
                      <span className="text-xs font-medium text-slate-500">{displayAddressRows.length} Addresses total</span>
                    </div>
                  </div>
                  {displayAddressRows.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                      Tidak ada data `customer_address`.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      {displayAddressRows.map((r, idx) => {
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
                              <div className="flex items-center gap-2">
                                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${tone.badge}`}>
                                  {typeLabel}
                                </span>
                                {isEditMode && (
                                  <button
                                    type="button"
                                    onClick={() => removeAddress(idx)}
                                    className="rounded border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100"
                                    disabled={isSaving}
                                    title="Hapus alamat"
                                  >
                                    <FaTrash className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            {isEditMode ? (
                              <textarea
                                value={r.address || ""}
                                onChange={(e) =>
                                  updateEditedRow(r.id, "address", e.target.value)
                                }
                                className="mb-3 min-h-[72px] w-full rounded-md border border-blue-300 px-2 py-1 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                                disabled={isSaving}
                              />
                            ) : (
                              <p className="mb-4 text-sm font-medium leading-relaxed text-slate-900">{r.address || "-"}</p>
                            )}
                            <div className="space-y-1.5 text-xs text-slate-600">
                              <div className="flex items-center justify-between">
                                <span>Province</span>
                                {isEditMode ? (
                                  provinces.length > 0 ? (
                                    <select
                                      value={shippingAreaStates[idx]?.provinceCode || ""}
                                      onChange={(e) =>
                                        void onShippingProvinceChange(idx, e.target.value)
                                      }
                                      className="w-36 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                      disabled={isSaving}
                                    >
                                      <option value="">Pilih Provinsi</option>
                                      {provinces.map((p) => (
                                        <option key={p.code} value={p.code}>
                                          {p.name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      value={r.province || ""}
                                      onChange={(e) =>
                                        updateEditedRow(r.id, "province", e.target.value)
                                      }
                                      className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                      disabled={isSaving}
                                    />
                                  )
                                ) : (
                                  <span className="font-semibold text-slate-900">{r.province || "-"}</span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Postal Code</span>
                                {isEditMode ? (
                                  <input
                                    value={r.postal_code || ""}
                                    onChange={(e) =>
                                      updateEditedRow(r.id, "postal_code", e.target.value)
                                    }
                                    className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                    disabled={isSaving}
                                  />
                                ) : (
                                  <span className="font-semibold text-slate-900">{r.postal_code || "-"}</span>
                                )}
                              </div>
                              {isEditMode && (
                                <>
                                  <div className="flex items-center justify-between">
                                    <span>City</span>
                                    {provinces.length > 0 ? (
                                      <select
                                        value={shippingAreaStates[idx]?.regencyCode || ""}
                                        onChange={(e) =>
                                          void onShippingRegencyChange(idx, e.target.value)
                                        }
                                        className="w-36 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                        disabled={
                                          isSaving ||
                                          !shippingAreaStates[idx]?.provinceCode
                                        }
                                      >
                                        <option value="">
                                          {shippingAreaStates[idx]?.provinceCode
                                            ? "Pilih Kota/Kabupaten"
                                            : "Pilih provinsi dulu"}
                                        </option>
                                        {(shippingAreaStates[idx]?.regencies || []).map(
                                          (regency) => (
                                            <option
                                              key={regency.code}
                                              value={regency.code}
                                            >
                                              {regency.name}
                                            </option>
                                          ),
                                        )}
                                      </select>
                                    ) : (
                                      <input
                                        value={r.city || ""}
                                        onChange={(e) =>
                                          updateEditedRow(r.id, "city", e.target.value)
                                        }
                                        className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                        disabled={isSaving}
                                      />
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>District</span>
                                    {provinces.length > 0 ? (
                                      <select
                                        value={
                                          (shippingAreaStates[idx]?.districts || []).find(
                                            (x) =>
                                              normalizeName(x.name) ===
                                              normalizeName(r.district),
                                          )?.code || ""
                                        }
                                        onChange={(e) =>
                                          onShippingDistrictChange(idx, e.target.value)
                                        }
                                        className="w-36 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                        disabled={
                                          isSaving ||
                                          !shippingAreaStates[idx]?.regencyCode
                                        }
                                      >
                                        <option value="">
                                          {shippingAreaStates[idx]?.regencyCode
                                            ? "Pilih Kecamatan"
                                            : "Pilih kota dulu"}
                                        </option>
                                        {(shippingAreaStates[idx]?.districts || []).map(
                                          (district) => (
                                            <option
                                              key={district.code}
                                              value={district.code}
                                            >
                                              {district.name}
                                            </option>
                                          ),
                                        )}
                                      </select>
                                    ) : (
                                      <input
                                        value={r.district || ""}
                                        onChange={(e) =>
                                          updateEditedRow(r.id, "district", e.target.value)
                                        }
                                        className="w-28 rounded border border-blue-300 px-1 py-0.5 text-xs"
                                        disabled={isSaving}
                                      />
                                    )}
                                  </div>
                                </>
                              )}
                              <div className="mt-2 border-t border-slate-200 pt-2">
                                {isEditMode ? (
                                  <div className="space-y-1">
                                    <input
                                      value={r.pic_name || ""}
                                      onChange={(e) =>
                                        updateEditedRow(r.id, "pic_name", e.target.value)
                                      }
                                      className="w-full rounded border border-blue-300 px-1 py-0.5 text-xs"
                                      placeholder="PIC name"
                                      disabled={isSaving}
                                    />
                                    <input
                                      value={r.pic_phone || ""}
                                      onChange={(e) =>
                                        updateEditedRow(r.id, "pic_phone", e.target.value)
                                      }
                                      className="w-full rounded border border-blue-300 px-1 py-0.5 text-xs"
                                      placeholder="PIC phone"
                                      disabled={isSaving}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <p className="font-semibold text-slate-900">PIC: {r.pic_name || "-"}</p>
                                    <p className="text-slate-500">{r.pic_phone || "-"}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                {!isEditMode && (
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
                )}

                {!isEditMode && (
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
                )}
              </div>
            </div>

            {showExitConfirm && (
              <div className="border-t border-amber-200 bg-amber-50 px-6 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Ada perubahan yang belum disimpan.
                    </p>
                    <p className="text-xs text-amber-800">
                      Yakin mau keluar dari mode edit?
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeDirectly}
                      className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100"
                    >
                      Lanjut Keluar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowExitConfirm(false)}
                      className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}

            <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
              <button
                type="button"
                onClick={isEditMode ? cancelEdit : startEdit}
                disabled={isSaving}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  isEditMode
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "border-blue-200 text-blue-700 hover:bg-blue-50"
                } disabled:opacity-50`}
              >
                {isEditMode ? <FaBan className="text-xs" /> : <FaEdit className="text-xs" />}
                {isEditMode ? "Cancel Edit" : "Edit Details"}
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={attemptClose}
                  className="px-6 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => void applyEdit()}
                  disabled={!isEditMode || isSaving}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Apply Changes"}
                </button>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
