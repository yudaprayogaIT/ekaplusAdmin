"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBuilding,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaBan,
  FaUser,
  FaChevronRight,
  FaStore,
  FaArrowUp,
  FaArrowDown,
  FaTags,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type {
  GroupCustomer,
  GroupParent,
  BranchCustomer,
} from "@/types/customer";
import { API_CONFIG, apiFetch, getQueryUrl, getResourceUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";

interface GCDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  gc: GroupCustomer | null;
  onGCUpdate?: (updatedGC: GroupCustomer) => void;
  onViewGP?: (gp: GroupParent) => void;
  onViewBC?: (bc: BranchCustomer) => void;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nbid?: number | { id?: number | string; name?: string; nb_name?: string } | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

interface BranchCustomerRow {
  id: number;
  name?: string | null;
  bcid_name?: string | null;
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

interface GroupCustomerDetailRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  company_name?: string | null;
  company_title?: string | null;
  company_type?: string | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  owner_place_of_birth?: string | null;
  owner_date_of_birth?: string | null;
}

const COMPANY_TYPE_OPTIONS = ["Company", "Individual"];
const COMPANY_TITLE_OPTIONS_BY_TYPE: Record<string, string[]> = {
  Individual: ["Home Industri", "Toko", "Freelance"],
  Company: ["PT", "CV", "UD"],
};
const COMPANY_SUFFIX_OPTIONS_BY_TITLE: Record<string, string[]> = {
  "Home Industri": ["HI"],
  Toko: ["TK"],
  Freelance: ["BP", "IBU"],
  PT: ["PT"],
  CV: ["CV"],
  UD: ["UD"],
};

function buildCompanyName(base: string, suffix: string) {
  return `${(base || "").trim()} ${(suffix || "").trim()}`.trim();
}

function splitCompanyName(fullName: string, title: string) {
  const full = (fullName || "").trim();
  const titleOptions = COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [];
  if (!full) {
    return {
      company_name_base: "",
      company_name_suffix: titleOptions[0] || "",
      company_name: "",
    };
  }

  for (const suffix of titleOptions) {
    if (full.toUpperCase().endsWith(` ${suffix.toUpperCase()}`)) {
      const base = full.slice(0, full.length - suffix.length).trim();
      return {
        company_name_base: base,
        company_name_suffix: suffix,
        company_name: buildCompanyName(base, suffix),
      };
    }
  }

  return {
    company_name_base: full,
    company_name_suffix: titleOptions[0] || "",
    company_name: buildCompanyName(full, titleOptions[0] || ""),
  };
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
  value: number | { full_name?: string } | null | undefined,
): string | undefined {
  if (directName) return directName;
  if (value && typeof value === "object" && value.full_name)
    return value.full_name;
  return undefined;
}

export function GCDetailModal({
  isOpen,
  onClose,
  gc,
  onGCUpdate,
  onViewGP,
  onViewBC,
}: GCDetailModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedCompanyType, setEditedCompanyType] = useState("");
  const [editedCompanyTitle, setEditedCompanyTitle] = useState("");
  const [editedCompanyNameBase, setEditedCompanyNameBase] = useState("");
  const [editedCompanyNameSuffix, setEditedCompanyNameSuffix] = useState("");
  const [editedOwnerName, setEditedOwnerName] = useState("");
  const [editedOwnerPhone, setEditedOwnerPhone] = useState("");
  const [editedOwnerEmail, setEditedOwnerEmail] = useState("");
  const [editedOwnerPlaceOfBirth, setEditedOwnerPlaceOfBirth] = useState("");
  const [editedOwnerDateOfBirth, setEditedOwnerDateOfBirth] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [parentGP, setParentGP] = useState<GroupParent | null>(null);
  const [linkedNB, setLinkedNB] = useState<{ id: number; code: string; name: string } | null>(null);
  const [childBCs, setChildBCs] = useState<BranchCustomer[]>([]);

  useEffect(() => {
    if (isOpen && gc) {
      setIsEditMode(false);
      setEditedName(gc.name || "");
      const split = splitCompanyName(gc.name || "", "");
      setEditedCompanyType("");
      setEditedCompanyTitle("");
      setEditedCompanyNameBase(split.company_name_base);
      setEditedCompanyNameSuffix(split.company_name_suffix);
      setEditedOwnerName(gc.owner_name || "");
      setEditedOwnerPhone(gc.owner_phone || "");
      setEditedOwnerEmail(gc.owner_email || "");
      setEditedOwnerPlaceOfBirth("");
      setEditedOwnerDateOfBirth("");
    }
  }, [isOpen, gc]);

  const loadRelations = useCallback(async () => {
    if (!isOpen || !gc || !isAuthenticated || !token) return;

    const gcDetailRes = await apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
        fields: [
          "id",
          "name",
          "gc_name",
          "company_name",
          "company_title",
          "company_type",
          "owner_full_name",
          "owner_phone",
          "owner_email",
          "owner_place_of_birth",
          "owner_date_of_birth",
        ],
        filters: [["id", "=", gc.id]],
        limit: 1,
      }),
      { method: "GET", cache: "no-store" },
      token,
    );
    const gcDetailJson = gcDetailRes.ok ? await gcDetailRes.json() : { data: [] };
    const gcDetailRow: GroupCustomerDetailRow | undefined = Array.isArray(
      gcDetailJson?.data,
    )
      ? gcDetailJson.data[0]
      : undefined;
    const rawCompanyType = gcDetailRow?.company_type || "";
    const rawCompanyTitle = gcDetailRow?.company_title || "";
    const rawCompanyName =
      gcDetailRow?.company_name || gcDetailRow?.gc_name || gc.name || "";
    const companySplit = splitCompanyName(rawCompanyName, rawCompanyTitle);
    setEditedCompanyType(rawCompanyType);
    setEditedCompanyTitle(rawCompanyTitle);
    setEditedCompanyNameBase(companySplit.company_name_base);
    setEditedCompanyNameSuffix(companySplit.company_name_suffix);
    setEditedName(companySplit.company_name || rawCompanyName);
    setEditedOwnerName(gcDetailRow?.owner_full_name || gc.owner_name || "");
    setEditedOwnerPhone(gcDetailRow?.owner_phone || gc.owner_phone || "");
    setEditedOwnerEmail(gcDetailRow?.owner_email || gc.owner_email || "");
    setEditedOwnerPlaceOfBirth(gcDetailRow?.owner_place_of_birth || "");
    setEditedOwnerDateOfBirth(
      gcDetailRow?.owner_date_of_birth?.split("T")[0] || "",
    );

    if (gc.gp_id) {
      const gpSpec = {
        fields: ["*", "created_by.full_name", "updated_by.full_name"],
        filters: [["id", "=", gc.gp_id]],
        limit: 1,
      };
      const gpRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpSpec),
        { method: "GET", cache: "no-store" },
        token,
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
              updated_at:
                row.updated_at || row.created_at || new Date(0).toISOString(),
              created_by: resolveUserName(
                row["created_by.full_name"],
                row.created_by,
              ),
              updated_by: resolveUserName(
                row["updated_by.full_name"],
                row.updated_by,
              ),
              disabled: Number(row.disabled || 0),
            }
          : null,
      );

      const nbId =
        row && typeof row.nbid === "number"
          ? row.nbid
          : row?.nbid && typeof row.nbid === "object"
            ? toNumber(row.nbid.id)
            : undefined;
      if (!nbId) {
        setLinkedNB(null);
      } else {
        const nbRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
            fields: ["id", "name", "nb_name"],
            filters: [["id", "=", nbId]],
            limit: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        );
        const nbJson = nbRes.ok ? await nbRes.json() : { data: [] };
        const nbRow: NationalBrandRow | undefined = Array.isArray(nbJson?.data)
          ? nbJson.data[0]
          : undefined;
        if (!nbRow) {
          setLinkedNB(null);
        } else {
          setLinkedNB({
            id: Number(nbRow.id),
            code: nbRow.name || `NB${nbRow.id}`,
            name: nbRow.nb_name || nbRow.name || "-",
          });
        }
      }
    } else {
      setParentGP(null);
      setLinkedNB(null);
    }

    const bcSpec = {
      fields: ["*", "created_by.full_name", "updated_by.full_name"],
      filters: [["gcid", "=", gc.id]],
      limit: 1000000,
    };
    const bcRes = await apiFetch(
      getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bcSpec),
      { method: "GET", cache: "no-store" },
      token,
    );
    const bcJson = bcRes.ok ? await bcRes.json() : { data: [] };
    const rows: BranchCustomerRow[] = Array.isArray(bcJson?.data)
      ? bcJson.data
      : [];

    const branchIds = Array.from(
      new Set(
        rows
          .map((row) =>
            row.branch && typeof row.branch === "object"
              ? toNumber(row.branch.id)
              : toNumber(row.branch),
          )
          .filter((id): id is number => typeof id === "number"),
      ),
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
        token,
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
      const branchId =
        row.branch && typeof row.branch === "object"
          ? toNumber(row.branch.id) || 0
          : toNumber(row.branch) || 0;
      const branchRef = branchMap.get(branchId);
      const directBranchName =
        row.branch && typeof row.branch === "object"
          ? row.branch.branch_name
          : undefined;
      const directBranchCity =
        row.branch && typeof row.branch === "object"
          ? row.branch.city
          : undefined;

      return {
        id: Number(row.id),
        code: row.name || undefined,
        name:
          row.bcid_name ||
          row.name ||
          `${gc.name} - ${directBranchCity || branchRef?.city || "-"}`,
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
        updated_at:
          row.updated_at || row.created_at || new Date(0).toISOString(),
        created_by: resolveUserName(
          row["created_by.full_name"],
          row.created_by,
        ),
        updated_by: resolveUserName(
          row["updated_by.full_name"],
          row.updated_by,
        ),
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

  const handleEditClick = () => {
    if (!gc) return;
    setIsEditMode(true);
  };

  const companyTitleOptions =
    COMPANY_TITLE_OPTIONS_BY_TYPE[editedCompanyType] || [];
  const companySuffixOptions =
    COMPANY_SUFFIX_OPTIONS_BY_TITLE[editedCompanyTitle] || [];
  const isSuffixEditable = editedCompanyTitle === "Freelance";

  const setCompanyType = (type: string) => {
    const nextTitles = COMPANY_TITLE_OPTIONS_BY_TYPE[type] || [];
    const nextTitle = type ? nextTitles[0] || "" : "";
    const nextSuffix = nextTitle
      ? (COMPANY_SUFFIX_OPTIONS_BY_TITLE[nextTitle] || [])[0] || ""
      : "";
    setEditedCompanyType(type);
    setEditedCompanyTitle(nextTitle);
    setEditedCompanyNameSuffix(nextSuffix);
    setEditedName(buildCompanyName(editedCompanyNameBase, nextSuffix));
  };

  const setCompanyTitle = (title: string) => {
    const nextSuffix = (COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [])[0] || "";
    setEditedCompanyTitle(title);
    setEditedCompanyNameSuffix(nextSuffix);
    setEditedName(buildCompanyName(editedCompanyNameBase, nextSuffix));
  };

  const setCompanyNameBase = (base: string) => {
    setEditedCompanyNameBase(base);
    setEditedName(buildCompanyName(base, editedCompanyNameSuffix));
  };

  const setCompanyNameSuffix = (suffix: string) => {
    setEditedCompanyNameSuffix(suffix);
    setEditedName(buildCompanyName(editedCompanyNameBase, suffix));
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    void loadRelations();
  };

  const handleSaveEdit = async () => {
    const finalName = buildCompanyName(
      editedCompanyNameBase,
      editedCompanyNameSuffix,
    );
    if (
      !gc ||
      !token ||
      !isAuthenticated ||
      !editedCompanyType ||
      !editedCompanyTitle ||
      !finalName
    )
      return;

    setIsSaving(true);
    try {
      const payload = {
        gc_name: finalName,
        company_name: finalName,
        company_title: editedCompanyTitle,
        company_type: editedCompanyType,
        owner_full_name: editedOwnerName.trim() || null,
        owner_phone: editedOwnerPhone.trim() || null,
        owner_email: editedOwnerEmail.trim() || null,
        owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
        owner_date_of_birth: editedOwnerDateOfBirth
          ? `${editedOwnerDateOfBirth}T00:00:00Z`
          : null,
      };
      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gc.id),
        { method: "PUT", body: JSON.stringify(payload), cache: "no-store" },
        token,
      );

      if (!res.ok) {
        throw new Error(`Failed to update Group Customer (${res.status})`);
      }

      const updatedGC: GroupCustomer = {
        ...gc,
        name: finalName,
        owner_name: editedOwnerName.trim() || undefined,
        owner_phone: editedOwnerPhone.trim() || undefined,
        owner_email: editedOwnerEmail.trim() || undefined,
        updated_at: new Date().toISOString(),
      };
      onGCUpdate?.(updatedGC);
      setIsEditMode(false);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Gagal update Group Customer",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
                  <h2 className="text-xl font-bold text-white">
                    Group Customer Details
                  </h2>
                  <p className="text-sm text-blue-100">
                    GCID: {gc.code || `GC${gc.id}`}
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
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    GC Name
                  </h3>
                  {!isEditMode && (
                    <button
                      onClick={handleEditClick}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-all"
                    >
                      <FaEdit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>
                {isEditMode ? (
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-200">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600">
                          Jenis Perusahaan
                        </label>
                        <select
                          value={editedCompanyType}
                          onChange={(e) => setCompanyType(e.target.value)}
                          className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm"
                          disabled={isSaving}
                        >
                          <option value="">Pilih Jenis Perusahaan</option>
                          {COMPANY_TYPE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-600">
                          Gelar Perusahaan
                        </label>
                        <select
                          value={editedCompanyTitle}
                          onChange={(e) => setCompanyTitle(e.target.value)}
                          className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm"
                          disabled={isSaving || !editedCompanyType}
                        >
                          <option value="">Pilih Gelar Perusahaan</option>
                          {companyTitleOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">
                          Nama
                        </label>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                          <input
                            type="text"
                            value={editedCompanyNameBase}
                            onChange={(e) => setCompanyNameBase(e.target.value)}
                            className="md:col-span-8 rounded-lg border border-blue-300 px-3 py-2 text-sm"
                            placeholder="Nama inti perusahaan"
                            disabled={isSaving}
                          />
                          {isSuffixEditable ? (
                            <select
                              value={editedCompanyNameSuffix}
                              onChange={(e) =>
                                setCompanyNameSuffix(e.target.value)
                              }
                              className="md:col-span-4 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm"
                              disabled={isSaving}
                            >
                              <option value="">Pilih Sebutan</option>
                              {companySuffixOptions.map((suffix) => (
                                <option key={suffix} value={suffix}>
                                  {suffix}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={editedCompanyNameSuffix}
                              readOnly
                              className="md:col-span-4 rounded-lg border border-blue-300 bg-gray-100 px-3 py-2 text-sm"
                              placeholder="Sebutan"
                            />
                          )}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-semibold text-gray-600">
                          Nama Final
                        </label>
                        <input
                          type="text"
                          value={editedName}
                          readOnly
                          className="w-full rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => void handleSaveEdit()}
                        disabled={
                          isSaving ||
                          !editedCompanyType ||
                          !editedCompanyTitle ||
                          !editedCompanyNameBase.trim() ||
                          !editedCompanyNameSuffix.trim()
                        }
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
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100">
                    <p className="text-2xl font-bold text-gray-900">
                      {editedName || gc.name}
                    </p>
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  Informasi Owner
                </h3>

                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100 space-y-3">
                  {isEditMode ? (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <input
                        type="text"
                        value={editedOwnerName}
                        onChange={(e) => setEditedOwnerName(e.target.value)}
                        placeholder="Nama owner"
                        className="rounded-lg border border-blue-300 px-3 py-2 text-sm"
                        disabled={isSaving}
                      />
                      <input
                        type="text"
                        value={editedOwnerPhone}
                        onChange={(e) => setEditedOwnerPhone(e.target.value)}
                        placeholder="No. Telepon"
                        className="rounded-lg border border-blue-300 px-3 py-2 text-sm"
                        disabled={isSaving}
                      />
                      <input
                        type="email"
                        value={editedOwnerEmail}
                        onChange={(e) => setEditedOwnerEmail(e.target.value)}
                        placeholder="Email"
                        className="rounded-lg border border-blue-300 px-3 py-2 text-sm"
                        disabled={isSaving}
                      />
                      <input
                        type="text"
                        value={editedOwnerPlaceOfBirth}
                        onChange={(e) =>
                          setEditedOwnerPlaceOfBirth(e.target.value)
                        }
                        placeholder="Tempat lahir"
                        className="rounded-lg border border-blue-300 px-3 py-2 text-sm"
                        disabled={isSaving}
                      />
                      <input
                        type="date"
                        value={editedOwnerDateOfBirth}
                        onChange={(e) =>
                          setEditedOwnerDateOfBirth(e.target.value)
                        }
                        className="rounded-lg border border-blue-300 px-3 py-2 text-sm"
                        disabled={isSaving}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm text-gray-800">
                      <p>
                        <span className="font-semibold">Nama:</span>{" "}
                        {editedOwnerName || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Telepon:</span>{" "}
                        {editedOwnerPhone || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        {editedOwnerEmail || "-"}
                      </p>
                      <p>
                        <span className="font-semibold">TTL:</span>{" "}
                        {editedOwnerPlaceOfBirth || "-"},{" "}
                        {editedOwnerDateOfBirth || "-"}
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {!isEditMode && (
                <>
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <FaArrowUp className="w-4 h-4" />
                  Parent Hierarki
                </h3>

                {linkedNB ? (
                  <div className="w-full bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border-2 border-indigo-100 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <FaTags className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">National Brand (NB)</p>
                        <p className="text-lg font-bold text-gray-900">{linkedNB.name}</p>
                        <p className="text-sm text-indigo-600 mt-0.5">NBID: {linkedNB.code}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

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
                            Group Parent (GP)
                          </p>
                          <p className="text-lg font-bold text-gray-900 group-hover:text-purple-600">
                            {parentGP.name}
                          </p>
                          <p className="text-sm text-purple-600 mt-0.5">
                            GPID: {parentGP.code || `GP${parentGP.id}`}
                          </p>
                        </div>
                      </div>
                      <FaChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                    </div>
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      Parent GP tidak ditemukan
                    </p>
                  </div>
                )}
              </section>

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
                        <p className="text-sm font-bold text-gray-900">
                          Branch Customers (BC)
                        </p>
                        <p className="text-xs text-gray-500">
                          {childBCs.length} BC terdaftar
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
                              <p className="text-sm font-bold text-gray-900 group-hover:text-orange-600">
                                {bc.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  BCID: {bc.code || `BC${bc.id}`}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                  {bc.branch_city || "-"}
                                </span>
                              </div>
                            </div>
                            <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Belum ada BC terdaftar
                    </p>
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
                </>
              )}
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
