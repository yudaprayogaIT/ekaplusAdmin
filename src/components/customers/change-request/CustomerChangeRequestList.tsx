"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FaBuilding,
  FaCalendarAlt,
  FaChevronDown,
  FaEye,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import FilterBuilder from "@/components/filters/FilterBuilder";
import { CUSTOMER_CHANGE_REQUEST_FILTER_FIELDS } from "@/config/filterFields";
import { useAuth } from "@/contexts/AuthContext";
import { useFilters } from "@/hooks/useFilters";
import type { FilterTriple } from "@/types/filter";
import { CustomerChangeRequestDetailModal } from "./CustomerChangeRequestDetailModal";
import type { CustomerChangeRequest } from "./types";

type SortField = "created_at" | "updated_at" | "applied_at" | "status" | "name";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 20;

interface ApiRow {
  id: number;
  name?: string | null;
  entity_id?: number | null;
  entity_type?: string | null;
  reason?: string | null;
  rejected_note?: string | null;
  status?: string | null;
  docstatus?: number | null;
  applied_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface NamedEntityRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
  gp_name?: string | null;
  gc_name?: string | null;
}

interface BranchCustomerRow {
  id: number;
  name?: string | null;
  gcid?: number | { id?: number; name?: string; gc_name?: string } | null;
  branch?:
    | number
    | { id?: number; branch_name?: string; city?: string }
    | null;
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string {
  if (explicitName?.trim()) return explicitName.trim();
  if (value && typeof value === "object" && value.full_name?.trim()) {
    return value.full_name.trim();
  }
  return "-";
}

function mapRow(row: ApiRow): CustomerChangeRequest {
  return {
    id: Number(row.id),
    name: row.name || `CCR-${row.id}`,
    entityId: Number(row.entity_id || 0),
    entityType: row.entity_type || "customer",
    entityDisplayName: `${entityTypeLabel(row.entity_type || "customer")} #${Number(row.entity_id || 0)}`,
    reason: row.reason || "",
    rejectedNote: row.rejected_note || "",
    status: row.status || "Draft",
    docstatus: Number(row.docstatus || 0),
    appliedAt: row.applied_at || null,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || row.created_at || null,
    createdBy: resolveUserName(row["created_by.full_name"], row.created_by),
    updatedBy: resolveUserName(row["updated_by.full_name"], row.updated_by),
  };
}

function entityTypeLabel(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizedEntityType(value: string):
  | "national_brand"
  | "group_parent"
  | "group_customer"
  | "branch_customer"
  | "unknown" {
  const normalized = value.trim().toLowerCase();
  if (["national_brand", "nb", "nbid"].includes(normalized)) {
    return "national_brand";
  }
  if (["group_parent", "gp", "gpid"].includes(normalized)) {
    return "group_parent";
  }
  if (["group_customer", "gc", "gcid"].includes(normalized)) {
    return "group_customer";
  }
  if (["branch_customer", "bc", "bcid"].includes(normalized)) {
    return "branch_customer";
  }
  return "unknown";
}

async function fetchEntityRows<T>(params: {
  endpoint: string;
  ids: number[];
  fields: string[];
  token: string;
}): Promise<T[]> {
  if (params.ids.length === 0) return [];
  const response = await apiFetch(
    getQueryUrl(params.endpoint, {
      fields: params.fields,
      filters: [["id", "in", params.ids]],
      limit: params.ids.length,
    }),
    { method: "GET", cache: "no-store" },
    params.token,
  );
  if (!response.ok) return [];
  const json = await response.json();
  return Array.isArray(json?.data) ? (json.data as T[]) : [];
}

async function enrichEntityDisplayNames(
  items: CustomerChangeRequest[],
  token: string,
): Promise<CustomerChangeRequest[]> {
  const idsFor = (type: ReturnType<typeof normalizedEntityType>) =>
    Array.from(
      new Set(
        items
          .filter((item) => normalizedEntityType(item.entityType) === type)
          .map((item) => item.entityId)
          .filter((id) => id > 0),
      ),
    );

  const nbIds = idsFor("national_brand");
  const gpIds = idsFor("group_parent");
  const gcIds = idsFor("group_customer");
  const bcIds = idsFor("branch_customer");

  const [nationalBrands, groupParents, directGroupCustomers, branchCustomers] =
    await Promise.all([
      fetchEntityRows<NamedEntityRow>({
        endpoint: API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
        ids: nbIds,
        fields: ["id", "name", "nb_name"],
        token,
      }),
      fetchEntityRows<NamedEntityRow>({
        endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
        ids: gpIds,
        fields: ["id", "name", "gp_name"],
        token,
      }),
      fetchEntityRows<NamedEntityRow>({
        endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
        ids: gcIds,
        fields: ["id", "name", "gc_name"],
        token,
      }),
      fetchEntityRows<BranchCustomerRow>({
        endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
        ids: bcIds,
        fields: ["id", "name", "gcid", "branch"],
        token,
      }),
    ]);

  const relatedGcIds = branchCustomers
    .map((row) =>
      row.gcid && typeof row.gcid === "object"
        ? Number(row.gcid.id || 0)
        : Number(row.gcid || 0),
    )
    .filter((id) => id > 0 && !directGroupCustomers.some((row) => row.id === id));
  const relatedGroupCustomers = await fetchEntityRows<NamedEntityRow>({
    endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
    ids: Array.from(new Set(relatedGcIds)),
    fields: ["id", "name", "gc_name"],
    token,
  });

  const nbMap = new Map(
    nationalBrands.map((row) => [row.id, row.nb_name || row.name || ""]),
  );
  const gpMap = new Map(
    groupParents.map((row) => [row.id, row.gp_name || row.name || ""]),
  );
  const gcMap = new Map(
    [...directGroupCustomers, ...relatedGroupCustomers].map((row) => [
      row.id,
      row.gc_name || row.name || "",
    ]),
  );
  const bcMap = new Map(
    branchCustomers.map((row) => {
      const gcObject =
        row.gcid && typeof row.gcid === "object" ? row.gcid : null;
      const gcId = gcObject ? Number(gcObject.id || 0) : Number(row.gcid || 0);
      const gcName = gcObject?.gc_name || gcObject?.name || gcMap.get(gcId) || "";
      const branchObject =
        row.branch && typeof row.branch === "object" ? row.branch : null;
      const branchLabel =
        row.name || branchObject?.city || branchObject?.branch_name || "";
      return [row.id, [gcName, branchLabel].filter(Boolean).join(" - ")] as const;
    }),
  );

  return items.map((item) => {
    const type = normalizedEntityType(item.entityType);
    const resolved =
      type === "national_brand"
        ? nbMap.get(item.entityId)
        : type === "group_parent"
          ? gpMap.get(item.entityId)
          : type === "group_customer"
            ? gcMap.get(item.entityId)
            : type === "branch_customer"
              ? bcMap.get(item.entityId)
              : undefined;
    return resolved ? { ...item, entityDisplayName: resolved } : item;
  });
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("reject") || normalized.includes("cancel")) {
    return "border-red-200 bg-red-100 text-red-700";
  }
  if (
    normalized.includes("sync") ||
    normalized.includes("approve") ||
    normalized.includes("applied")
  ) {
    return "border-emerald-200 bg-emerald-100 text-emerald-700";
  }
  if (normalized.includes("draft")) {
    return "border-amber-200 bg-amber-100 text-amber-700";
  }
  return "border-blue-200 bg-blue-100 text-blue-700";
}

export function CustomerChangeRequestList() {
  const { token, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const parsedRouteId = idParam && /^\d+$/.test(idParam) ? Number(idParam) : null;

  const [items, setItems] = useState<CustomerChangeRequest[]>([]);
  const [selectedItem, setSelectedItem] = useState<CustomerChangeRequest | null>(null);
  const [routeDetailId, setRouteDetailId] = useState<number | null>(parsedRouteId);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const directLoadRef = useRef<number | null>(null);
  const { filters, setFilters } = useFilters({
    entity: "customer_change_request",
  });

  useEffect(() => {
    setRouteDetailId(parsedRouteId);
  }, [parsedRouteId]);

  useEffect(() => {
    const handlePopState = () => {
      const value = new URLSearchParams(window.location.search).get("id");
      setRouteDetailId(value && /^\d+$/.test(value) ? Number(value) : null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      300,
    );
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  const loadData = useCallback(
    async (page: number, replace = false) => {
      if (replace) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        if (!token || !isAuthenticated) {
          setItems([]);
          setHasMore(false);
          return;
        }

        const requestFilters: FilterTriple[] = [...filters];
        if (selectedStatus !== "all") {
          requestFilters.push(["status", "=", selectedStatus]);
        }
        const spec: Record<string, unknown> = {
          fields: ["*", "created_by.full_name", "updated_by.full_name"],
          page,
          limit: PAGE_SIZE,
          order_by: [[sortField, sortDirection]],
        };
        if (requestFilters.length > 0) spec.filters = requestFilters;
        if (debouncedSearch) spec.search = debouncedSearch;

        const response = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CHANGE_REQUEST, spec),
          { method: "GET", cache: "no-store" },
          token,
        );
        if (!response.ok) {
          throw new Error(`Gagal memuat customer change request (${response.status})`);
        }

        const json = await response.json();
        const rows = Array.isArray(json?.data) ? (json.data as ApiRow[]) : [];
        const mapped = await enrichEntityDisplayNames(rows.map(mapRow), token);
        const perPage = Number(json?.meta?.per_page || PAGE_SIZE);

        setItems((current) =>
          replace
            ? mapped
            : [
                ...current,
                ...mapped.filter(
                  (item) => !current.some((existing) => existing.id === item.id),
                ),
              ],
        );
        setCurrentPage(page);
        setHasMore(rows.length >= perPage);
      } catch (loadError) {
        if (replace) setItems([]);
        setHasMore(false);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat customer change request",
        );
      } finally {
        if (replace) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [
      debouncedSearch,
      filters,
      isAuthenticated,
      selectedStatus,
      sortDirection,
      sortField,
      token,
    ],
  );

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    void loadData(1, true);
  }, [loadData]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadData(currentPage + 1, false);
        }
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [currentPage, hasMore, loadData, loading, loadingMore]);

  useEffect(() => {
    if (routeDetailId === null) {
      directLoadRef.current = null;
      setSelectedItem(null);
      return;
    }

    const loaded = items.find((item) => item.id === routeDetailId);
    if (loaded) {
      setSelectedItem(loaded);
      return;
    }
    if (!token || !isAuthenticated || directLoadRef.current === routeDetailId) return;

    directLoadRef.current = routeDetailId;
    const authToken = token;
    let cancelled = false;
    async function loadDirectItem() {
      try {
        const response = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CHANGE_REQUEST, {
            fields: ["*", "created_by.full_name", "updated_by.full_name"],
            filters: [["id", "=", routeDetailId]],
            limit: 1,
          }),
          { method: "GET", cache: "no-store" },
          authToken,
        );
        if (!response.ok || cancelled) return;
        const json = await response.json();
        const row = Array.isArray(json?.data) ? (json.data[0] as ApiRow | undefined) : undefined;
        if (row && !cancelled) {
          const [mapped] = await enrichEntityDisplayNames(
            [mapRow(row)],
            authToken,
          );
          if (!cancelled && mapped) setSelectedItem(mapped);
        }
      } catch {
        // The list remains usable if a stale/invalid detail URL is opened.
      }
    }
    void loadDirectItem();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, items, routeDetailId, token]);

  const openDetail = useCallback(
    (item: CustomerChangeRequest) => {
      setSelectedItem(item);
      setRouteDetailId(item.id);
      window.history.pushState(
        { ...window.history.state, ekaModalBase: "/customers/change-request" },
        "",
        `${pathname}?id=${item.id}`,
      );
    },
    [pathname],
  );

  const closeDetail = useCallback(() => {
    setSelectedItem(null);
    setRouteDetailId(null);
    if (window.history.state?.ekaModalBase === "/customers/change-request") {
      window.history.back();
      return;
    }
    router.replace("/customers/change-request");
  }, [router]);

  const sortOptions: Array<{ value: SortField; label: string }> = useMemo(
    () => [
      { value: "updated_at", label: "Tanggal Update" },
      { value: "created_at", label: "Tanggal Dibuat" },
      { value: "applied_at", label: "Tanggal Diterapkan" },
      { value: "status", label: "Status" },
      { value: "name", label: "Nomor Request" },
    ],
    [],
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
          <p className="text-sm font-medium text-gray-600">Memuat customer change request...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
          Customer Change Request
        </h1>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Pantau pengajuan dan detail perubahan data customer
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <FaSearch className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nomor request, customer, alasan, atau status..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm transition focus:border-transparent focus:ring-2 focus:ring-red-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            aria-label="Filter status"
            className="min-w-48 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 focus:border-transparent focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="Request">Request</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Syncing">Syncing</option>
            <option value="Sync">Sync</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
          <FilterBuilder
            entity="customer_change_request"
            config={CUSTOMER_CHANGE_REQUEST_FILTER_FIELDS}
            onApply={setFilters}
            initialFilters={filters}
          />
          <button
            type="button"
            onClick={() =>
              setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
            }
            title={sortDirection === "asc" ? "Urut naik" : "Urut turun"}
            className="rounded-lg bg-gray-100 p-3 text-gray-700 transition hover:bg-gray-200"
          >
            {sortDirection === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
          </button>
          <div className="relative">
            <select
              value={sortField}
              onChange={(event) => setSortField(event.target.value as SortField)}
              aria-label="Urutkan berdasarkan"
              className="appearance-none rounded-lg border-0 bg-gray-100 py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:ring-2 focus:ring-red-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void loadData(1, true)}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
          <FaBuilding className="mx-auto mb-3 text-4xl text-gray-300" />
          <p className="font-semibold text-gray-700">Data tidak ditemukan</p>
          <p className="mt-1 text-sm text-gray-500">Coba ubah kata pencarian atau filter.</p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-sm text-gray-500">
            Menampilkan {items.length} request
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => openDetail(item)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <FaBuilding />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-gray-900 transition group-hover:text-red-600">
                          {item.entityDisplayName}
                        </h2>
                        <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                          <span className="shrink-0">
                            {entityTypeLabel(item.entityType)}
                          </span>
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 shrink-0 rounded-full bg-gray-400"
                          />
                          <span className="truncate font-medium">
                            {item.name}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="mb-4 line-clamp-2 min-h-10 text-sm text-gray-700">
                    {item.reason || "Tidak ada alasan perubahan"}
                  </p>
                  <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" /> Dibuat: {formatDate(item.createdAt)} · {item.createdBy}
                    </p>
                    <p className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" /> Diupdate: {formatDate(item.updatedAt)} · {item.updatedBy}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openDetail(item);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-lg"
                  >
                    <FaEye /> Lihat Detail Perubahan
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {hasMore && <div ref={loadMoreRef} className="h-8" aria-hidden="true" />}
          {loadingMore && (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
            </div>
          )}
          {!hasMore && items.length > 0 && (
            <p className="py-8 text-center text-sm text-gray-400">Semua data sudah ditampilkan.</p>
          )}
        </>
      )}

      <CustomerChangeRequestDetailModal item={selectedItem} onClose={closeDetail} />
    </div>
  );
}
