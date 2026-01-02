"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { RegistrationCard } from "./RegistrationCard";
import { RegistrationDetailModal } from "./RegistrationDetailModal";
import { ApproveRegistrationModal } from "./ApproveRegistrationModal";
import { RejectRegistrationModal } from "./RejectRegistrationModal";
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
import { getQueryUrl, getFileUrl, API_CONFIG, apiFetch } from "@/config/api";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { useFilters } from "@/hooks/useFilters";
import { CUSTOMER_REGISTER_FILTER_FIELDS } from "@/config/filterFields";
import { FilterTriple } from "@/types/filter";
import Pagination, { usePagination } from "@/components/ui/Pagination";

type SortField =
  | "business_name"
  | "created_at"
  | "updated_at"
  | "status"
  | "type";
type SortDirection = "asc" | "desc";

const SNAP_KEY = "ekatalog_customer_registrations_snapshot";

// API Response type from backend
interface CustomerRegistrationApiResponse {
  id: number;
  name: string; // Registration code like REG20251231001
  user_id: number;
  owner_id: number;

  // Nested objects
  user?: {
    full_name: string;
  };
  owner?: {
    full_name: string;
    id: number;
    email: string;
    phone: string;
    place_of_birth: string;
    date_of_birth: string;
  };
  branch?: {
    branch_name: string;
    city: string;
    id: number;
  };

  // Business Info
  type: string; // "Badan" or "Perorangan"
  entity: string; // "PT", "CV", etc.
  business_name: string;
  nik: string;
  npwp?: string | null;
  branch_id: number;

  // Address
  address: string;
  province: string;
  city: string;
  district: string;
  sub_district: string;
  rt: string;
  rw: string;
  postal_code: string;

  // Support Data
  contact_person?: string | null;
  email?: string | null;
  fax?: string | null;
  factory_address?: string | null;

  // Documents
  ktp_image?: string | null;
  npwp_image?: string | null;

  // Status & Metadata
  status: string;
  docstatus: number;
  created_at: string;
  created_by?: number | { id: number; full_name: string };
  updated_at: string;
  updated_by?: number | { id: number; full_name: string };
}

export function CustomerRegistrationList() {
  const { token, isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState<CustomerRegistration[]>(
    []
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

  // Use filter system
  const { filters, setFilters } = useFilters({
    entity: "ekatalog_customer_register",
  });

  // Map API response to frontend type
  function mapToFrontendType(
    apiData: CustomerRegistrationApiResponse
  ): CustomerRegistration {
    return {
      id: apiData.id.toString(),

      // Owner info - extract from nested objects
      owner: {
        user_id: apiData.user_id,
        full_name:
          apiData.owner?.full_name ||
          apiData.user?.full_name ||
          `User ${apiData.user_id}`,
        phone: apiData.owner?.phone || "-",
        email: apiData.owner?.email || "-",
        place_of_birth: apiData.owner?.place_of_birth || "-",
        date_of_birth: apiData.owner?.date_of_birth || "-",
      },

      // Company info - extract branch name from nested object
      company: {
        business_type: `${apiData.type} - ${apiData.entity}`,
        name: apiData.business_name,
        nik: apiData.nik,
        npwp: apiData.npwp || undefined,
        branch_id: apiData.branch_id,
        branch_name:
          apiData.branch?.branch_name || `Branch ${apiData.branch_id}`,
        branch_city: apiData.branch?.city || "-",
      },

      // Address
      address: {
        full_address: apiData.address,
        province_name: apiData.province,
        city_name: apiData.city,
        district_name: apiData.district,
        village_name: apiData.sub_district,
        rt: apiData.rt,
        rw: apiData.rw,
        postal_code: apiData.postal_code,
      },

      // Support data
      support_data: {
        contact_person: apiData.contact_person || undefined,
        company_email: apiData.email || undefined,
        fax: apiData.fax || undefined,
        factory_address: apiData.factory_address || undefined,
      },

      // Documents
      documents: {
        ktp_photo: apiData.ktp_image
          ? {
              url: getFileUrl(apiData.ktp_image) || "",
              filename: apiData.ktp_image,
            }
          : undefined,
        npwp_photo: apiData.npwp_image
          ? {
              url: getFileUrl(apiData.npwp_image) || "",
              filename: apiData.npwp_image,
            }
          : undefined,
      },

      // Status - map to lowercase for consistency
      status: apiData.status.toLowerCase() as
        | "pending"
        | "approved"
        | "rejected"
        | "draft",
      submission_date: apiData.created_at,
      created_at: apiData.created_at,
      created_by:
        typeof apiData.created_by === "object" && apiData.created_by?.full_name
          ? apiData.created_by.full_name
          : undefined,
      updated_at: apiData.updated_at,
      updated_by:
        typeof apiData.updated_by === "object" && apiData.updated_by?.full_name
          ? apiData.updated_by.full_name
          : undefined,
    };
  }

  // Function to load data with filters and sorting
  const loadDataWithFilters = useCallback(
    async (
      filterTriples: FilterTriple[] = [],
      sort_by?: SortField,
      sort_order?: SortDirection
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
        } = {
          fields: [
            "*",
            "branch.branch_name",
            "branch.id",
            "branch.city",
            "user.full_name",
            "owner.full_name",
            "owner.email",
            "owner.place_of_birth",
            "owner.date_of_birth",
            "owner.phone",
            "created_by.full_name",
            "updated_by.full_name",
          ],
        };

        // Add filters if provided
        if (filterTriples.length > 0) {
          spec.filters = filterTriples;
        }

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
          token
        );

        if (res.ok) {
          const response = await res.json();
          const apiData: CustomerRegistrationApiResponse[] =
            response.data || [];
          const mapped = apiData.map((item) => mapToFrontendType(item));
          console.log("Loaded registrations:", mapped);
          setRegistrations(mapped);
          try {
            localStorage.setItem(SNAP_KEY, JSON.stringify(mapped));
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
    [isAuthenticated, token, sortField, sortDirection]
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
        handler
      );
  }, [loadDataWithFilters, filters, sortField, sortDirection]);

  // Handle filter apply
  const handleApplyFilters = useCallback(
    (newFilters: FilterTriple[]) => {
      console.log("[CustomerRegistrationList] Applying filters:", newFilters);
      setFilters(newFilters);
    },
    [setFilters]
  );

  // Filter locally based on search and status
  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations];

    // Filter by status
    if (selectedStatus !== "all") {
      if (selectedStatus === "pending") {
        // "pending" includes both "pending" and "draft" status
        filtered = filtered.filter(
          (reg) => reg.status === "pending" || reg.status === "draft"
        );
      } else {
        filtered = filtered.filter((reg) => reg.status === selectedStatus);
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.company.name.toLowerCase().includes(query) ||
          reg.owner.full_name.toLowerCase().includes(query) ||
          reg.company.nik.includes(query) ||
          reg.company.branch_name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [registrations, selectedStatus, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: registrations.length,
      pending: registrations.filter(
        (r) => r.status === "pending" || r.status === "draft"
      ).length,
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
  } = usePagination(filteredRegistrations, 10);

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

  const handleApproveSuccess = () => {
    setIsApproveModalOpen(false);
    setSelectedForAction(null);
    // Data will auto-reload via event listener
  };

  const handleRejectSuccess = () => {
    setIsRejectModalOpen(false);
    setSelectedForAction(null);
    // Data will auto-reload via event listener
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
            <div className="text-sm text-yellow-700 font-medium">Pending</div>
          </div>
          <div className="text-3xl font-bold text-yellow-900">
            {stats.pending}
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
              placeholder="Cari perusahaan, pemilik, NIK, atau cabang..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
          <FilterBuilder
            entity="ekatalog_customer_register"
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
                {sortField === "business_name" && "Nama Perusahaan"}
                {sortField === "created_at" && "Tanggal Dibuat"}
                {sortField === "updated_at" && "Tanggal Diupdate"}
                {sortField === "status" && "Status"}
                {sortField === "type" && "Tipe Bisnis"}
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
                        value: "business_name" as SortField,
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
                      { value: "type" as SortField, label: "Tipe Bisnis" },
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
      />

      {/* Approve Modal */}
      <ApproveRegistrationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        registration={selectedForAction}
        onSuccess={handleApproveSuccess}
      />

      {/* Reject Modal */}
      <RejectRegistrationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        registration={selectedForAction}
        onSuccess={handleRejectSuccess}
      />
    </div>
  );
}
