"use client";

import React, { useState, useMemo, useEffect } from "react";
import { RegistrationCard } from "./RegistrationCard";
import { RegistrationDetailModal } from "./RegistrationDetailModal";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { FaSearch, FaUserCheck, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getFileUrl,
  API_CONFIG,
  apiFetch,
} from "@/config/api";

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
  };
  branch?: {
    branch_name: string;
    id: number;
  };
  updated_by?: {
    full_name: string;
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
  created_by: number;
  updated_at: string;
  updated_by_id: number;
}

const SNAP_KEY = "ekatalog_customer_registrations_snapshot";

export function CustomerRegistrationList() {
  const { token, isAuthenticated } = useAuth();
  const [registrations, setRegistrations] = useState<CustomerRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRegistration, setSelectedRegistration] =
    useState<CustomerRegistration | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  // Map API response to frontend type
  function mapToFrontendType(apiData: CustomerRegistrationApiResponse): CustomerRegistration {
    return {
      id: apiData.id.toString(),

      // Owner info - extract from nested objects
      owner: {
        user_id: apiData.user_id,
        full_name: apiData.owner?.full_name || apiData.user?.full_name || `User ${apiData.user_id}`,
        phone: "-", // Not available in API
        email: apiData.email || "-",
        birth_place: "-", // Not available in API
        birth_date: "-", // Not available in API
      },

      // Company info - extract branch name from nested object
      company: {
        business_type: `${apiData.type} - ${apiData.entity}`,
        name: apiData.business_name,
        nik: apiData.nik,
        npwp: apiData.npwp || undefined,
        branch_id: apiData.branch_id,
        branch_name: apiData.branch?.branch_name || `Branch ${apiData.branch_id}`,
      },

      // Address
      address: {
        full_address: apiData.address,
        province_id: 0, // Not available in API
        province_name: apiData.province,
        city_id: 0,
        city_name: apiData.city,
        district_id: 0,
        district_name: apiData.district,
        village_id: 0,
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
        ktp_photo: apiData.ktp_image ? {
          url: getFileUrl(apiData.ktp_image) || '',
          filename: apiData.ktp_image,
        } : undefined,
        npwp_photo: apiData.npwp_image ? {
          url: getFileUrl(apiData.npwp_image) || '',
          filename: apiData.npwp_image,
        } : undefined,
      },

      // Status - map to lowercase for consistency
      status: apiData.status.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'draft',
      submission_date: apiData.created_at,
      created_at: apiData.created_at,
      updated_at: apiData.updated_at,
    };
  }

  // Load registrations from API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!isAuthenticated || !token) {
          setLoading(false);
          return;
        }

        // Build spec for query - include nested fields
        const spec = {
          fields: [
            "*",
            "branch.branch_name",
            "branch.id",
            "user.full_name",
            "owner.full_name",
            "updated_by.full_name"
          ],
        };

        const url = getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER, spec);
        const res = await apiFetch(url, {
          method: "GET",
          cache: "no-store",
        }, token);

        if (res.ok) {
          const response = await res.json();
          if (!cancelled) {
            const apiData: CustomerRegistrationApiResponse[] = response.data || [];
            const mapped = apiData.map(item => mapToFrontendType(item));
            console.log("Loaded registrations:", mapped);
            setRegistrations(mapped);
            try {
              localStorage.setItem(SNAP_KEY, JSON.stringify(mapped));
            } catch {}
          }
        } else {
          if (!cancelled) {
            setError(`Failed to fetch registrations (${res.status})`);
          }
        }
      } catch (err: unknown) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      if (!isAuthenticated || !token) return;

      try {
        const spec = {
          fields: [
            "*",
            "branch.branch_name",
            "branch.id",
            "user.full_name",
            "owner.full_name",
            "updated_by.full_name"
          ],
        };

        const url = getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER, spec);
        const res = await apiFetch(url, {
          method: "GET",
          cache: "no-store",
        }, token);

        if (res.ok) {
          const response = await res.json();
          const apiData: CustomerRegistrationApiResponse[] = response.data || [];
          const mapped = apiData.map(item => mapToFrontendType(item));
          setRegistrations(mapped);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mapped));
        }
      } catch (error) {
        console.error("Failed to reload registrations:", error);
      }
    }

    window.addEventListener("ekatalog:customer_registrations_update", handler);
    return () =>
      window.removeEventListener("ekatalog:customer_registrations_update", handler);
  }, [isAuthenticated, token]);

  // Filter locally based on search and status
  const filteredRegistrations = useMemo(() => {
    let filtered = [...registrations];

    // Filter by status
    if (selectedStatus !== "all") {
      if (selectedStatus === "pending") {
        // "pending" includes both "pending" and "draft" status
        filtered = filtered.filter((reg) => reg.status === "pending" || reg.status === "draft");
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
      pending: registrations.filter((r) => r.status === "pending" || r.status === "draft").length,
      approved: registrations.filter((r) => r.status === "approved").length,
      rejected: registrations.filter((r) => r.status === "rejected").length,
    };
  }, [registrations]);

  // Pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (registration: CustomerRegistration) => {
    setSelectedRegistration(registration);
    setIsDetailModalOpen(true);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
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
          <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      <RegistrationDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        registration={selectedRegistration}
      />
    </div>
  );
}
