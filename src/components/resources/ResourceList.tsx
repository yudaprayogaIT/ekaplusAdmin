"use client";

import { useEffect, useMemo, useState } from "react";
import { FaBoxes, FaTags } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getAuthHeaders } from "@/config/api";
import ResourceDetailModal from "./ResourceDetailModal";
import EntityPageHeader from "@/components/entity-management/EntityPageHeader";
import EntityTable, {
  EntityTableColumn,
} from "@/components/entity-management/EntityTable";

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
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailResource, setDetailResource] = useState<AuthzResource | null>(
    null,
  );

  const formatUpdatedAt = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

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
          },
        );

        if (!response.ok) {
          const message = await response.text();
          throw new Error(
            message || `Failed to fetch resources (${response.status})`,
          );
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

  const modules = useMemo(
    () =>
      Array.from(
        new Set(resources.map((item) => normalizeModuleName(item.Module))),
      ).sort((a, b) => a.localeCompare(b)),
    [resources],
  );

  const displayedResources = useMemo(
    () =>
      resources.filter((item) => {
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
      }),
    [moduleFilter, resources, searchQuery],
  );

  const resourceCountByModule = useMemo(
    () =>
      modules.map((module) => ({
        module,
        total: resources.filter(
          (item) => normalizeModuleName(item.Module) === module,
        ).length,
      })),
    [modules, resources],
  );

  function openDetail(resource: AuthzResource) {
    setDetailResource(resource);
    setDetailOpen(true);
  }

  const columns: EntityTableColumn<AuthzResource>[] = [
    {
      key: "name",
      header: "Resource Name",
      render: (resource) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
            <FaBoxes className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {resource.Name}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openDetail(resource);
              }}
              className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
            >
              Lihat detail
            </button>
          </div>
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      render: (resource) => (
        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {normalizeModuleName(resource.Module)}
        </span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (resource) => (
        <code className="inline-flex rounded bg-gray-100 px-2 py-1 text-[11px] text-gray-600">
          {resource.Slug}
        </code>
      ),
    },
    {
      key: "description",
      header: "Description",
      cellClassName: "text-sm text-gray-600",
      render: (resource) => (
        <p className="line-clamp-1">
          {normalizeDescription(resource.Description)}
        </p>
      ),
    },
    {
      key: "updated",
      header: "Updated At",
      className: "whitespace-nowrap",
      cellClassName: "text-sm text-gray-500 whitespace-nowrap",
      render: (resource) => formatUpdatedAt(resource.UpdatedAt),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
        <div className="mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-4">
      <div className="mx-auto space-y-6">
        <EntityPageHeader
          icon={<FaBoxes className="w-5 h-5" />}
          title="Resources"
          description="Daftar master resource untuk authorization dan workflow."
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari resource berdasarkan slug, nama, atau module..."
          // summary={
          //   <>
          //     <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
          //       Total {resources.length} resource
          //     </span>
          //     <span className="text-gray-500">
          //       {modules.length} module, {displayedResources.length} hasil
          //       tampil
          //     </span>
          //   </>
          // }
          accentClasses={{
            iconBg: "bg-cyan-50",
            iconText: "text-cyan-600",
            searchRing: "focus:ring-cyan-500",
          }}
        />

        {displayedResources.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTags className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tidak ada resource
            </h3>
            <p className="text-sm text-gray-500">
              Coba ubah kata kunci pencarian atau filter module
            </p>
          </div>
        ) : (
          <EntityTable
            columns={columns}
            rows={displayedResources}
            getRowKey={(resource) => resource.ID}
            onRowClick={openDetail}
            footer={
              <>
                <span>Click row untuk lihat detail resource</span>
                <span>Showing {displayedResources.length} resources</span>
              </>
            }
          />
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
