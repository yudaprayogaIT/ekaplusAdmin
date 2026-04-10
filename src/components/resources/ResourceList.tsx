"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaBoxes,
  FaLayerGroup,
  FaList,
  FaSearch,
  FaTags,
  FaTh,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getAuthHeaders } from "@/config/api";
import ResourceCard from "./ResourceCard";
import ResourceDetailModal from "./ResourceDetailModal";

export type AuthzResource = {
  ID: number;
  Module: string;
  Name: string;
  Slug: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type ResourceApiResponse = {
  status: string;
  code: string;
  message: string;
  data: AuthzResource[];
};

export function normalizeModuleName(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized || normalized === "[]") return "Unassigned";
  return normalized;
}

export function normalizeDescription(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized || normalized === "[]") return "-";
  return normalized;
}

export default function ResourceList() {
  const { token, isAuthenticated } = useAuth();
  const [resources, setResources] = useState<AuthzResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailResource, setDetailResource] = useState<AuthzResource | null>(null);

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

        const response = await apiFetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTHZ_RESOURCE}`,
          {
            method: "GET",
            cache: "no-store",
            headers: getAuthHeaders(token),
          }
        );

        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || `Failed to fetch resources (${response.status})`);
        }

        const result = (await response.json()) as ResourceApiResponse;
        if (!cancelled) {
          setResources(result.data || []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage.includes("Failed to fetch")) {
            setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
          } else if (errorMessage.includes("401")) {
            setError("Session expired. Silakan login kembali.");
          } else if (errorMessage.includes("403")) {
            setError("Akses ditolak. Anda tidak memiliki izin.");
          } else {
            setError(errorMessage);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token]);

  const modules = useMemo(() => {
    return Array.from(
      new Set(resources.map((item) => normalizeModuleName(item.Module)))
    ).sort((a, b) => a.localeCompare(b));
  }, [resources]);

  const displayedResources = useMemo(() => {
    return resources.filter((item) => {
      const normalizedModule = normalizeModuleName(item.Module);
      const matchesModule =
        moduleFilter === "all" || normalizedModule === moduleFilter;

      const keyword = searchQuery.trim().toLowerCase();
      const haystack = [
        item.Name,
        item.Slug,
        normalizedModule,
        normalizeDescription(item.Description),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !keyword || haystack.includes(keyword);
      return matchesModule && matchesSearch;
    });
  }, [moduleFilter, resources, searchQuery]);

  const resourceCountByModule = useMemo(() => {
    return modules.map((module) => ({
      module,
      total: resources.filter(
        (item) => normalizeModuleName(item.Module) === module
      ).length,
    }));
  }, [modules, resources]);

  function openDetail(resource: AuthzResource) {
    setDetailResource(resource);
    setDetailOpen(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat resources...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBoxes className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Error Loading Resources
            </h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Resources
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Daftar master resource untuk authorization dan workflow
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium mb-1">
                  Total Resources
                </p>
                <p className="text-3xl font-bold">{resources.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaBoxes className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">
                  Total Modules
                </p>
                <p className="text-3xl font-bold">{modules.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaLayerGroup className="w-7 h-7" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-100 text-sm font-medium mb-1">
                  Hasil Tampil
                </p>
                <p className="text-3xl font-bold">{displayedResources.length}</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                <FaTags className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari resource berdasarkan slug, nama, module..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              >
                <option value="all">Semua module</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="Grid View"
                >
                  <FaTh className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  title="List View"
                >
                  <FaList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {resourceCountByModule.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resourceCountByModule.map((item) => (
                <button
                  key={item.module}
                  type="button"
                  onClick={() =>
                    setModuleFilter((current) =>
                      current === item.module ? "all" : item.module
                    )
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    moduleFilter === item.module
                      ? "bg-cyan-600 text-white"
                      : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                  }`}
                >
                  {item.module} ({item.total})
                </button>
              ))}
            </div>
          )}
        </div>

        {displayedResources.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tidak ada resource
            </h3>
            <p className="text-sm text-gray-500">
              Coba ubah kata kunci pencarian atau filter module
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {displayedResources.map((resource) => (
              <ResourceCard
                key={resource.ID}
                resource={resource}
                viewMode={viewMode}
                onView={() => openDetail(resource)}
              />
            ))}
          </div>
        )}
      </div>

      <ResourceDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        resource={detailResource}
      />
    </div>
  );
}
