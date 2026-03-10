"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { RegistrationCard } from "./RegistrationCard";
import { RegistrationDetailModal } from "./RegistrationDetailModal";
import { ApproveRegistrationModal } from "./ApproveRegistrationModal";
import { RejectRegistrationModal } from "./RejectRegistrationModal";
import ActionResultModal from "@/components/ui/ActionResultModal";
import type { CustomerRegistration } from "@/types/customerRegistration";
import {
  FaSearch,
  FaUserCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSortAmountUp,
  FaSortAmountDown,
  FaChevronDown,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getQueryUrl, API_CONFIG, apiFetch } from "@/config/api";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { CUSTOMER_REGISTER_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
import Pagination, { usePagination } from "@/components/ui/Pagination";

type SortField =
  | "company_name"
  | "created_at"
  | "updated_at"
  | "status"
  | "company_type";
type SortDirection = "asc" | "desc";

const SNAP_KEY = "ekatalog_customer_registrations_snapshot";

// API Response type from backend
interface CustomerRegistrationApiResponse {
  id: number;
  name: string;
  source?: string | null;
  ekaplus_user?:
    | number
    | { id: number; full_name?: string; email?: string }
    | null;
  owner?: number | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  owner_place_of_birth?: string | null;
  owner_date_of_birth?: string | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
  branch_owner_email?: string | null;
  branch_owner_place_of_birth?: string | null;
  branch_owner_date_of_birth?: string | null;
  branch_id_id?: number | null;
  branch_id?: {
    branch_name: string;
    city: string;
  } | null;
  company_type?: string | null;
  company_title?: string | null;
  company_name?: string | null;
  company_address?: string | null;
  company_province?: string | null;
  company_city?: string | null;
  company_district?: string | null;
  company_postal_code?: string | null;
  product_need?: string | null;
  same_as_company_address?: number | boolean | null;
  nbid?: number | { id?: number; name?: string; nb_name?: string } | null;
  nbid_id?: number | null;
  nbid_name?: string | null;
  nbid_link?: { id?: number; name?: string; nb_name?: string } | null;
  status: string;
  docstatus: number;
  created_at: string;
  "created_by.full_name"?: string | null;
  created_by?: number | { id: number; full_name: string };
  updated_at: string;
  "updated_by.full_name"?: string | null;
  updated_by?: number | { id: number; full_name: string };
  gpid?: number | { id?: number; name?: string; gp_name?: string } | null;
  gpid_id?: number | null;
  gpid_name?: string | null;
  gpid_link?: { id?: number; name?: string; gp_name?: string } | null;
  gcid?: number | { id?: number; name?: string; gc_name?: string } | null;
  gcid_id?: number | null;
  gcid_name?: string | null;
  gcid_link?: { id?: number; name?: string; gc_name?: string } | null;
  bcid?: number | { id?: number; name?: string; bc_name?: string } | null;
  bcid_id?: number | null;
  bcid_name?: string | null;
  bcid_link?: { id?: number; name?: string; bc_name?: string } | null;
  sync_saga_id?: string | null;
  saga_status?: string | null;
  erp_customer_id?: string | null;
  crm_customer_id?: string | null;
  sync_last_error?: string | null;
  sync_last_rollback_error?: string | null;
  reject_reason?: string | null;
  reject_notes?: string | null;
  rejection_reason?: string | null;
  rejection_notes?: string | null;
}

async function fetchNameMap(
  endpoint: string,
  ids: number[],
  nameField: string,
  tokenValue: string,
): Promise<Map<number, string>> {
  const result = new Map<number, string>();
  if (ids.length === 0) return result;

  try {
    const spec = {
      fields: ["id", "name", nameField],
      filters: [["id", "in", ids]],
      limit: ids.length,
    };
    const res = await apiFetch(
      getQueryUrl(endpoint, spec),
      { method: "GET", cache: "no-store" },
      tokenValue,
    );
    if (!res.ok) return result;

    const json = await res.json();
    const rows = Array.isArray(json?.data) ? json.data : [];
    for (const row of rows) {
      const id =
        typeof row?.id === "number"
          ? row.id
          : Number.parseInt(String(row?.id ?? ""), 10);
      if (!Number.isFinite(id)) continue;
      const label =
        (typeof row?.[nameField] === "string" && row[nameField]) ||
        (typeof row?.name === "string" && row.name) ||
        undefined;
      if (label) result.set(id, label);
    }
  } catch {
    // silent fallback to ID-only display
  }

  return result;
}

async function enrichMasterLinkNames(
  data: CustomerRegistration[],
  tokenValue: string,
): Promise<CustomerRegistration[]> {
  const nbIds = Array.from(
    new Set(
      data
        .map((item) => item.master_links?.nb_id)
        .filter((v): v is number => typeof v === "number"),
    ),
  );
  const gpIds = Array.from(
    new Set(
      data
        .map((item) => item.master_links?.gp_id)
        .filter((v): v is number => typeof v === "number"),
    ),
  );
  const gcIds = Array.from(
    new Set(
      data
        .map((item) => item.master_links?.gc_id)
        .filter((v): v is number => typeof v === "number"),
    ),
  );
  const bcIds = Array.from(
    new Set(
      data
        .map((item) => item.master_links?.bc_id)
        .filter((v): v is number => typeof v === "number"),
    ),
  );

  const [nbMap, gpMap, gcMap, bcMap] = await Promise.all([
    fetchNameMap("/api/resource/national_brand", nbIds, "nb_name", tokenValue),
    fetchNameMap("/api/resource/group_parent", gpIds, "gp_name", tokenValue),
    fetchNameMap("/api/resource/group_customer", gcIds, "gc_name", tokenValue),
    fetchNameMap("/api/resource/branch_customer", bcIds, "bc_name", tokenValue),
  ]);

  return data.map((item) => {
    const links = item.master_links;
    if (!links) return item;
    const resolvedGcName =
      links.gc_name || (links.gc_id ? gcMap.get(links.gc_id) : undefined);
    const branchCity = item.company?.branch_city;
    const computedBcName =
      links.bc_name ||
      (links.bc_id ? bcMap.get(links.bc_id) : undefined) ||
      (resolvedGcName && branchCity
        ? `${resolvedGcName} - ${branchCity}`
        : undefined);
    return {
      ...item,
      master_links: {
        ...links,
        nb_name:
          links.nb_name || (links.nb_id ? nbMap.get(links.nb_id) : undefined),
        gp_name:
          links.gp_name || (links.gp_id ? gpMap.get(links.gp_id) : undefined),
        gc_name: resolvedGcName,
        bc_name: computedBcName,
      },
    };
  });
}

export function CustomerRegistrationList() {
  const { token, isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState<CustomerRegistration[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRegistration, setSelectedRegistration] =
    useState<CustomerRegistration | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Sort state
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);

  // Approve/Reject modals state
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedForAction, setSelectedForAction] =
    useState<CustomerRegistration | null>(null);

  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    description?: string;
    details?: { label: string; value: string }[];
  } | null>(null);
  const [syncingIds, setSyncingIds] = useState<Record<string, boolean>>({});
  const [rollbackingIds, setRollbackingIds] = useState<Record<string, boolean>>(
    {},
  );

  // Use filter system
  const { filters, setFilters } = useFilters({
    entity: "customer_register",
  });

  // Map API response to frontend type
  function mapToFrontendType(
    apiData: CustomerRegistrationApiResponse,
  ): CustomerRegistration {
    return {
      id: apiData.id.toString(),
      registration_number: apiData.name || apiData.id.toString(),
      source: apiData.source || undefined,
      ekaplus_user:
        apiData.ekaplus_user !== null &&
        typeof apiData.ekaplus_user === "object"
          ? {
              id: apiData.ekaplus_user.id,
              full_name: apiData.ekaplus_user.full_name,
              email: apiData.ekaplus_user.email,
            }
          : apiData.ekaplus_user
            ? { id: apiData.ekaplus_user }
            : undefined,

      // Owner info - extract from nested objects
      user: {
        user_id: apiData.owner || 0,
        full_name:
          apiData.owner_full_name ||
          (apiData.owner ? `User ${apiData.owner}` : "Unknown User"),
        phone: apiData.owner_phone || "-",
        email: apiData.owner_email || "-",
        place_of_birth: apiData.owner_place_of_birth || "-",
        date_of_birth: apiData.owner_date_of_birth || "-",
      },

      // Company info - extract branch name from nested object
      company: {
        company_type: apiData.company_type || undefined,
        company_title: apiData.company_title || undefined,
        business_type:
          [apiData.company_type, apiData.company_title]
            .filter(Boolean)
            .join(" - ") || "-",
        name: apiData.company_name || apiData.name,
        nik: "-",
        npwp: undefined,
        branch_id: apiData.branch_id_id || 0,
        branch_name:
          apiData.branch_id?.branch_name ||
          (apiData.branch_id_id ? `Branch ${apiData.branch_id_id}` : "-"),
        branch_city: apiData.branch_id?.city || "-",
        product_need: apiData.product_need || undefined,
      },

      // Address
      address: {
        full_address: apiData.company_address || "-",
        province_name: apiData.company_province || "-",
        city_name: apiData.company_city || "-",
        district_name: apiData.company_district || "-",
        village_name: "-",
        rt: "-",
        rw: "-",
        postal_code: apiData.company_postal_code || "-",
      },

      // Support data
      support_data: {
        contact_person: apiData.owner_full_name || undefined,
        company_email: apiData.owner_email || undefined,
        fax: undefined,
        factory_address: undefined,
      },
      branch_owner: {
        full_name: apiData.branch_owner || "-",
        phone: apiData.branch_owner_phone || "-",
        email: apiData.branch_owner_email || "-",
        place_of_birth: apiData.branch_owner_place_of_birth || undefined,
        date_of_birth: apiData.branch_owner_date_of_birth || undefined,
      },
      master_links: {
        nb_id:
          apiData.nbid_link?.id ??
          (typeof apiData.nbid === "object" ? apiData.nbid?.id : undefined) ??
          apiData.nbid_id ??
          (typeof apiData.nbid === "number" ? apiData.nbid : undefined) ??
          undefined,
        nb_name:
          apiData.nbid_link?.nb_name ??
          (typeof apiData.nbid === "object"
            ? apiData.nbid?.nb_name
            : undefined) ??
          apiData.nbid_name ??
          apiData.nbid_link?.name ??
          (typeof apiData.nbid === "object" ? apiData.nbid?.name : undefined) ??
          undefined,
        gp_id:
          apiData.gpid_link?.id ??
          (typeof apiData.gpid === "object" ? apiData.gpid?.id : undefined) ??
          apiData.gpid_id ??
          (typeof apiData.gpid === "number" ? apiData.gpid : undefined) ??
          undefined,
        gp_name:
          apiData.gpid_link?.gp_name ??
          (typeof apiData.gpid === "object"
            ? apiData.gpid?.gp_name
            : undefined) ??
          apiData.gpid_name ??
          apiData.gpid_link?.name ??
          (typeof apiData.gpid === "object" ? apiData.gpid?.name : undefined) ??
          undefined,
        gc_id:
          apiData.gcid_link?.id ??
          (typeof apiData.gcid === "object" ? apiData.gcid?.id : undefined) ??
          apiData.gcid_id ??
          (typeof apiData.gcid === "number" ? apiData.gcid : undefined) ??
          undefined,
        gc_name:
          apiData.gcid_link?.gc_name ??
          (typeof apiData.gcid === "object"
            ? apiData.gcid?.gc_name
            : undefined) ??
          apiData.gcid_name ??
          apiData.gcid_link?.name ??
          (typeof apiData.gcid === "object" ? apiData.gcid?.name : undefined) ??
          undefined,
        bc_id:
          apiData.bcid_link?.id ??
          (typeof apiData.bcid === "object" ? apiData.bcid?.id : undefined) ??
          apiData.bcid_id ??
          (typeof apiData.bcid === "number" ? apiData.bcid : undefined) ??
          undefined,
        bc_name:
          apiData.bcid_link?.bc_name ??
          (typeof apiData.bcid === "object"
            ? apiData.bcid?.bc_name
            : undefined) ??
          apiData.bcid_name ??
          apiData.bcid_link?.name ??
          (typeof apiData.bcid === "object" ? apiData.bcid?.name : undefined) ??
          undefined,
      },
      sync_info: {
        saga_status: apiData.saga_status ?? undefined,
        sync_saga_id: apiData.sync_saga_id ?? undefined,
        erp_customer_id: apiData.erp_customer_id ?? undefined,
        crm_customer_id: apiData.crm_customer_id ?? undefined,
        sync_last_error: apiData.sync_last_error ?? undefined,
        sync_last_rollback_error: apiData.sync_last_rollback_error ?? undefined,
      },
      same_as_company_address: Boolean(apiData.same_as_company_address),
      shipping_addresses: [],

      // Documents
      documents: {
        ktp_photo: undefined,
        npwp_photo: undefined,
      },

      // Status - map to lowercase for consistency
      status: apiData.status.toLowerCase() as
        | "approved"
        | "rejected"
        | "request"
        | "draft",
      docstatus:
        typeof apiData.docstatus === "number"
          ? apiData.docstatus
          : Number(apiData.docstatus || 0),
      submission_date: apiData.created_at,
      created_at: apiData.created_at,
      created_by_id:
        typeof apiData.created_by === "number"
          ? apiData.created_by
          : typeof apiData.created_by === "object" &&
              typeof apiData.created_by?.id === "number"
            ? apiData.created_by.id
            : undefined,
      created_by:
        typeof apiData.created_by === "object" && apiData.created_by?.full_name
          ? apiData.created_by.full_name
          : apiData["created_by.full_name"]
            ? apiData["created_by.full_name"]
            : typeof apiData.created_by === "number"
              ? `User ${apiData.created_by}`
              : undefined,
      updated_at: apiData.updated_at,
      updated_by_id:
        typeof apiData.updated_by === "number"
          ? apiData.updated_by
          : typeof apiData.updated_by === "object" &&
              typeof apiData.updated_by?.id === "number"
            ? apiData.updated_by.id
            : undefined,
      updated_by:
        typeof apiData.updated_by === "object" && apiData.updated_by?.full_name
          ? apiData.updated_by.full_name
          : apiData["updated_by.full_name"]
            ? apiData["updated_by.full_name"]
            : typeof apiData.updated_by === "number"
              ? `User ${apiData.updated_by}`
              : undefined,
      gp_id:
        apiData.gpid_link?.id ??
        (typeof apiData.gpid === "object" ? apiData.gpid?.id : undefined) ??
        apiData.gpid_id ??
        (typeof apiData.gpid === "number" ? apiData.gpid : undefined) ??
        undefined,
      gp_name:
        apiData.gpid_link?.gp_name ??
        (typeof apiData.gpid === "object"
          ? apiData.gpid?.gp_name
          : undefined) ??
        apiData.gpid_name ??
        apiData.gpid_link?.name ??
        (typeof apiData.gpid === "object" ? apiData.gpid?.name : undefined) ??
        undefined,
      gc_id:
        apiData.gcid_link?.id ??
        (typeof apiData.gcid === "object" ? apiData.gcid?.id : undefined) ??
        apiData.gcid_id ??
        (typeof apiData.gcid === "number" ? apiData.gcid : undefined) ??
        undefined,
      gc_name:
        apiData.gcid_link?.gc_name ??
        (typeof apiData.gcid === "object"
          ? apiData.gcid?.gc_name
          : undefined) ??
        apiData.gcid_name ??
        apiData.gcid_link?.name ??
        (typeof apiData.gcid === "object" ? apiData.gcid?.name : undefined) ??
        undefined,
      bc_id:
        apiData.bcid_link?.id ??
        (typeof apiData.bcid === "object" ? apiData.bcid?.id : undefined) ??
        apiData.bcid_id ??
        (typeof apiData.bcid === "number" ? apiData.bcid : undefined) ??
        undefined,
      bc_name:
        apiData.bcid_link?.bc_name ??
        (typeof apiData.bcid === "object"
          ? apiData.bcid?.bc_name
          : undefined) ??
        apiData.bcid_name ??
        apiData.bcid_link?.name ??
        (typeof apiData.bcid === "object" ? apiData.bcid?.name : undefined) ??
        undefined,
      rejection_reason:
        apiData.reject_reason ?? apiData.rejection_reason ?? undefined,
      rejection_notes: apiData.reject_notes ?? undefined,
    };
  }

  // Function to load data with filters and sorting
  const loadDataWithFilters = useCallback(
    async (
      filterTriples: FilterTriple[] = [],
      sort_by?: SortField,
      sort_order?: SortDirection,
    ) => {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          setLoading(false);
          return;
        }

        // Build spec for query - include nested fields, filters, and sorting
        const spec: {
          fields: string[];
          filters?: FilterTriple[];
          order_by?: [string, string][];
          limit?: number;
        } = {
          fields: [
            "*",
            "branch_id.branch_name",
            "branch_id.city",
            "created_by.full_name",
            "updated_by.full_name",
          ],
          limit: 10000000,
        };

        const defaultFilters: FilterTriple[] = [["status", "!=", "Draft"]];
        spec.filters =
          filterTriples.length > 0
            ? [...defaultFilters, ...filterTriples]
            : defaultFilters;

        // Add server-side sorting
        if (sort_by && sort_order) {
          spec.order_by = [[sort_by, sort_order]];
        }

        const url = getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER, spec);
        const res = await apiFetch(
          url,
          {
            method: "GET",
            cache: "no-store",
          },
          token,
        );

        if (res.ok) {
          const response = await res.json();
          const apiData: CustomerRegistrationApiResponse[] =
            response.data || [];
          const mapped = apiData.map((item) => mapToFrontendType(item));
          const enriched = await enrichMasterLinkNames(mapped, token);
          console.log("Loaded registrations:", enriched);
          setRegistrations(enriched);
          try {
            localStorage.setItem(SNAP_KEY, JSON.stringify(enriched));
          } catch {}
        } else {
          setError(`Failed to fetch registrations (${res.status})`);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, token],
  );

  // Load data on mount and when filters change
  useEffect(() => {
    loadDataWithFilters(filters, sortField, sortDirection);
  }, [loadDataWithFilters, filters, sortField, sortDirection]);

  // Reload data when sort changes
  useEffect(() => {
    if (token) {
      loadDataWithFilters(filters, sortField, sortDirection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortDirection]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      loadDataWithFilters(filters, sortField, sortDirection);
    }

    window.addEventListener("ekatalog:customer_registrations_update", handler);
    return () =>
      window.removeEventListener(
        "ekatalog:customer_registrations_update",
        handler,
      );
  }, [loadDataWithFilters, filters, sortField, sortDirection]);

  // Handle filter apply
  const handleApplyFilters = useCallback(
    (newFilters: FilterTriple[]) => {
      console.log("[CustomerRegistrationList] Applying filters:", newFilters);
      setFilters(newFilters);
    },
    [setFilters],
  );

  // Filter locally based on search and status
  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations];

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((reg) => reg.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.company.name.toLowerCase().includes(query) ||
          reg.user.full_name.toLowerCase().includes(query) ||
          reg.company.business_type.toLowerCase().includes(query) ||
          reg.company.branch_name.toLowerCase().includes(query) ||
          (reg.source || "").toLowerCase().includes(query) ||
          (reg.branch_owner?.full_name || "").toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [registrations, selectedStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: registrations.length,
      request: registrations.filter((r) => r.status === "request").length,
      approved: registrations.filter((r) => r.status === "approved").length,
      rejected: registrations.filter((r) => r.status === "rejected").length,
    };
  }, [registrations]);

  // Pagination using usePagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedRegistrations,
    totalItems,
    itemsPerPage,
  } = usePagination(filteredRegistrations, 20);

  const handleViewDetails = (registration: CustomerRegistration) => {
    setSelectedRegistration(registration);
    setIsDetailModalOpen(true);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Approve/Reject action handlers
  const handleApprove = (registration: CustomerRegistration) => {
    setSelectedForAction(registration);
    setIsDetailModalOpen(false); // Close detail modal
    setIsApproveModalOpen(true);
  };

  const handleReject = (registration: CustomerRegistration) => {
    setSelectedForAction(registration);
    setIsDetailModalOpen(false); // Close detail modal
    setIsRejectModalOpen(true);
  };

  const handleApproveSuccess = (message: string) => {
    const active = selectedForAction;
    const gpLine =
      message.match(/GROUP PARENT:\s*(.+)/)?.[1]?.trim() ||
      message.match(/GP ID:\s*(.+)/)?.[1]?.trim() ||
      "-";
    const gcLine =
      message.match(/GROUP CUSTOMER:\s*(.+)/)?.[1]?.trim() ||
      message.match(/GC ID:\s*(.+)/)?.[1]?.trim() ||
      "-";
    const bcLine =
      message.match(/BRANCH CUSTOMER:\s*(.+)/)?.[1]?.trim() ||
      message.match(/BC ID:\s*(.+)/)?.[1]?.trim() ||
      "-";

    setIsApproveModalOpen(false);
    setSelectedForAction(null);
    setResultModal({
      isOpen: true,
      type: "success",
      title: "Syncing Dipicu",
      message: `Registrasi "${active?.company.name || "-"}" berhasil masuk status Syncing`,
      description: "Data customer sedang diproses sinkronisasi melalui Saga.",
      details: [
        { label: "ID Pelanggan", value: active?.registration_number || "-" },
        { label: "Group Parent", value: gpLine },
        { label: "Group Customer", value: gcLine },
        { label: "Branch Customer", value: bcLine },
      ],
    });
  };

  const handleRejectSuccess = (message: string) => {
    const active = selectedForAction;
    const rejectReason = message.match(/Alasan:\s*(.+)/)?.[1]?.trim() || "-";
    const rejectNotes = message.match(/Catatan:\s*(.+)/)?.[1]?.trim() || "-";

    setIsRejectModalOpen(false);
    setSelectedForAction(null);
    setResultModal({
      isOpen: true,
      type: "error",
      title: "Customer di Reject",
      message: `Registrasi "${active?.company.name || "-"}" Ditolak`,
      description:
        "Data customer ditolak dan belum dapat diproses ke tahap berikutnya.",
      details: [
        { label: "Reject Reason", value: rejectReason },
        { label: "Reject Notes", value: rejectNotes },
      ],
    });
  };

  const getSyncLabel = (registration: CustomerRegistration): string => {
    const saga = (registration.sync_info?.saga_status || "").toLowerCase();
    if (!saga || saga === "completed") return "Sync";
    return "Resync";
  };

  const isSyncReadOnly = (registration: CustomerRegistration): boolean => {
    const saga = (registration.sync_info?.saga_status || "").toLowerCase();
    return saga === "completed";
  };

  const handleSync = async (registration: CustomerRegistration) => {
    if (!token) return;
    if (isSyncReadOnly(registration)) return;

    setSyncingIds((prev) => ({ ...prev, [registration.id]: true }));

    try {
      const sagaId = registration.sync_info?.sync_saga_id;
      if (!sagaId) {
        throw new Error("saga_id tidak tersedia pada customer_register");
      }
      const response = await apiFetch(
        `${API_CONFIG.BASE_URL}/api/saga/recover`,
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify({
            status: "Syncing",
            saga_id: sagaId,
          }),
        },
        token,
      );
      if (!response.ok) {
        let serverMessage = "";
        try {
          const json = await response.json();
          if (json?.message && typeof json.message === "string") {
            serverMessage = json.message;
          }
        } catch {}
        throw new Error(
          `HTTP ${response.status}${serverMessage ? `: ${serverMessage}` : ""}`,
        );
      }

      await loadDataWithFilters(filters, sortField, sortDirection);
      setResultModal({
        isOpen: true,
        type: "success",
        title: `${getSyncLabel(registration)} Berhasil`,
        message: `Sinkronisasi untuk "${registration.company.name}" berhasil dijalankan.`,
        description:
          "Data sync ke ERP/CRM/Ekaplus sudah dipicu. Silakan cek Saga Status terbaru.",
      });
    } catch (errorSync) {
      setResultModal({
        isOpen: true,
        type: "error",
        title: `${getSyncLabel(registration)} Gagal`,
        message:
          errorSync instanceof Error
            ? errorSync.message
            : "Terjadi kesalahan saat sinkronisasi.",
      });
    } finally {
      setSyncingIds((prev) => ({ ...prev, [registration.id]: false }));
    }
  };

  const handleRollback = async (registration: CustomerRegistration) => {
    if (!token) return;

    setRollbackingIds((prev) => ({ ...prev, [registration.id]: true }));

    try {
      const sagaId = registration.sync_info?.sync_saga_id;
      if (!sagaId) {
        throw new Error("saga_id tidak tersedia pada customer_register");
      }
      const response = await apiFetch(
        `${API_CONFIG.BASE_URL}/api/saga/force-rollback`,
        {
          method: "POST",
          cache: "no-store",
          body: JSON.stringify({
            status: "Syncing",
            saga_id: sagaId,
          }),
        },
        token,
      );

      if (!response.ok) {
        let serverMessage = "";
        try {
          const json = await response.json();
          if (json?.message && typeof json.message === "string") {
            serverMessage = json.message;
          }
        } catch {}
        throw new Error(
          `HTTP ${response.status}${serverMessage ? `: ${serverMessage}` : ""}`,
        );
      }

      await loadDataWithFilters(filters, sortField, sortDirection);
      setResultModal({
        isOpen: true,
        type: "success",
        title: "Rollback Berhasil",
        message: `Rollback untuk "${registration.company.name}" berhasil dijalankan.`,
        description:
          "Force rollback dipicu. Silakan cek Saga Status terbaru di detail sinkronisasi.",
      });
    } catch (errorRollback) {
      setResultModal({
        isOpen: true,
        type: "error",
        title: "Rollback Gagal",
        message:
          errorRollback instanceof Error
            ? errorRollback.message
            : "Terjadi kesalahan saat rollback.",
      });
    } finally {
      setRollbackingIds((prev) => ({ ...prev, [registration.id]: false }));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat data registrasi...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Customer Registrations
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola pengajuan registrasi member dari customer
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <FaUserCheck className="w-4 h-4 text-blue-700" />
            <div className="text-sm text-blue-700 font-medium">
              Total Registrasi
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <FaClock className="w-4 h-4 text-yellow-700" />
            <div className="text-sm text-yellow-700 font-medium">Request</div>
          </div>
          <div className="text-3xl font-bold text-yellow-900">
            {stats.request}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <FaCheckCircle className="w-4 h-4 text-green-700" />
            <div className="text-sm text-green-700 font-medium">Approved</div>
          </div>
          <div className="text-3xl font-bold text-green-900">
            {stats.approved}
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <FaTimesCircle className="w-4 h-4 text-red-700" />
            <div className="text-sm text-red-700 font-medium">Rejected</div>
          </div>
          <div className="text-3xl font-bold text-red-900">
            {stats.rejected}
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari perusahaan, pemilik, tipe bisnis, atau cabang..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="all">Semua Status</option>
              <option value="request">Request</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
          <FilterBuilder
            entity="customer_register"
            config={CUSTOMER_REGISTER_FILTER_FIELDS}
            onApply={handleApplyFilters}
          />

          {/* Sort Direction Button */}
          <button
            onClick={() => {
              const newDirection = sortDirection === "asc" ? "desc" : "asc";
              setSortDirection(newDirection);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
            title={
              sortDirection === "asc"
                ? "Ascending (A-Z, 1-9, Oldest)"
                : "Descending (Z-A, 9-1, Newest)"
            }
          >
            {sortDirection === "asc" ? (
              <FaSortAmountUp className="w-3.5 h-3.5" />
            ) : (
              <FaSortAmountDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Sort Field Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortFieldDropdownOpen(!sortFieldDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <span>
                {sortField === "company_name" && "Nama Perusahaan"}
                {sortField === "created_at" && "Tanggal Dibuat"}
                {sortField === "updated_at" && "Tanggal Diupdate"}
                {sortField === "status" && "Status"}
                {sortField === "company_type" && "Tipe Bisnis"}
              </span>
              <FaChevronDown
                className={`w-3 h-3 transition-transform ${
                  sortFieldDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {sortFieldDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortFieldDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 min-w-[200px] z-20"
                  >
                    {[
                      {
                        value: "company_name" as SortField,
                        label: "Nama Perusahaan",
                      },
                      {
                        value: "created_at" as SortField,
                        label: "Tanggal Dibuat",
                      },
                      {
                        value: "updated_at" as SortField,
                        label: "Tanggal Diupdate",
                      },
                      { value: "status" as SortField, label: "Status" },
                      {
                        value: "company_type" as SortField,
                        label: "Tipe Bisnis",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortField(option.value);
                          setSortFieldDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors ${
                          sortField === option.value
                            ? "text-red-600 bg-red-50"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!loading && !error && filteredRegistrations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada registrasi
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery || selectedStatus !== "all"
              ? "Coba ubah filter atau kata kunci pencarian"
              : "Belum ada pengajuan registrasi member"}
          </p>
          {(searchQuery || selectedStatus !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("all");
              }}
              className="mt-4 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Registration Cards Grid */}
      {!loading && !error && paginatedRegistrations.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRegistrations.map((registration) => (
              <RegistrationCard
                key={registration.id}
                registration={registration}
                onViewDetails={() => handleViewDetails(registration)}
                onSync={() => handleSync(registration)}
                isSyncing={Boolean(syncingIds[registration.id])}
                syncLabel={getSyncLabel(registration)}
                syncReadOnly={isSyncReadOnly(registration)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      )}

      {/* Detail Modal */}
      <RegistrationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        registration={selectedRegistration}
        onApprove={handleApprove}
        onReject={handleReject}
        onSync={(registration) => handleSync(registration)}
        onRollback={(registration) => handleRollback(registration)}
        isSyncing={
          selectedRegistration
            ? Boolean(syncingIds[selectedRegistration.id])
            : false
        }
        isRollbacking={
          selectedRegistration
            ? Boolean(rollbackingIds[selectedRegistration.id])
            : false
        }
        syncLabel={
          selectedRegistration ? getSyncLabel(selectedRegistration) : "Sync"
        }
        syncReadOnly={
          selectedRegistration ? isSyncReadOnly(selectedRegistration) : false
        }
        rollbackLabel="Rollback"
        rollbackReadOnly={false}
      />

      {/* Approve Modal */}
      <ApproveRegistrationModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setSelectedForAction(null);
        }}
        registration={selectedForAction}
        onSuccess={handleApproveSuccess}
      />

      {/* Reject Modal */}
      <RejectRegistrationModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedForAction(null);
        }}
        registration={selectedForAction}
        onSuccess={handleRejectSuccess}
      />

      <ActionResultModal
        isOpen={Boolean(resultModal?.isOpen)}
        type={resultModal?.type || "success"}
        title={resultModal?.title || "Informasi"}
        message={resultModal?.message || ""}
        description={resultModal?.description}
        details={resultModal?.details}
        onClose={() => setResultModal(null)}
      />
    </div>
  );
}
