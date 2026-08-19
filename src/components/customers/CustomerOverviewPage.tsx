"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getApiUrl, getQueryUrl } from "@/config/api";
import type {
  BranchCustomer,
  GroupCustomer,
  GroupParent,
} from "@/types/customer";
import {
  NBDetailModal,
  type NationalBrandDetailData,
} from "@/components/national_brand/NBDetailModal";
import { GPDetailModal } from "@/components/group_parent/GPDetailModal";
import { GCDetailModal } from "@/components/group_customer/GCDetailModal";
import { BCDetailModal } from "@/components/branch_customer/BCDetailModal";
import {
  FaBuilding,
  FaEye,
  FaRegBuilding,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaStore,
  FaTruck,
  FaChevronDown,
} from "react-icons/fa";

type CustomerType = "nb" | "gp" | "gc" | "bc";
type CustomerStatus = string;
type CustomerSortField = "updated_at" | "code" | "name";
type CustomerSortDirection = "desc" | "asc";

interface UnifiedCard {
  id: number;
  code: string;
  name: string;
  contact: string;
  branchLocation: string;
  monthlyVolume: string;
  status: CustomerStatus;
  type: CustomerType;
  segment: string;
  createdAt: string;
  detail:
    | { kind: "nb"; item: NationalBrandDetailData }
    | { kind: "gp"; item: GroupParent }
    | { kind: "gc"; item: GroupCustomer }
    | { kind: "bc"; item: BranchCustomer };
}

interface CustomerPolicyValue {
  active_id?: number | string | null;
  active_level?: string | null;
  value?: number | null;
}

interface CustomerPolicyResponseData {
  checked_id?: string | number | null;
  checked_type?: string | null;
  credit_limit?: CustomerPolicyValue | null;
  payment_term?: CustomerPolicyValue | null;
}

interface TabStats {
  nb: number;
  gp: number;
  gc: number;
  bc: number;
}

interface NationalBrandApiResponse {
  id: number;
  name?: string | null;
  nb_name?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface GroupParentApiResponse {
  id: number;
  name?: string | null;
  gp_name?: string | null;
  nbid?: number | { id?: number | string } | null;
  description?: string | null;
  credit_limit_active?: number | null;
  credit_limit?: number | null;
  payment_term_active?: number | null;
  payment_term?: number | null;
  limit_customer_overdue_active?: number | null;
  limit_customer_overdue?: number | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
  created_by?: number | { id?: number; full_name?: string } | null;
  updated_by?: number | { id?: number; full_name?: string } | null;
}

interface GroupCustomerApiResponse {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gpid?: number | { id?: number; name?: string; gp_name?: string } | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface BranchCustomerApiResponse {
  id: number;
  name?: string | null;
  gcid?:
    | number
    | { id?: number; name?: string; gc_name?: string; gpid?: number }
    | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
  branch_owner_email?: string | null;
  receipt_delivery_method?: string | null;
  receipt_issued_at?: string | null;
  status?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface BranchLookupRow {
  id: number;
  branch_name?: string | null;
  city?: string | null;
}

interface GroupCustomerLookupRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
  gp_name?: string | null;
}

interface QueryMeta {
  per_page?: number | string | null;
  total?: number | string | null;
  total_count?: number | string | null;
  count?: number | string | null;
  current_page?: number | string | null;
  last_page?: number | string | null;
}

interface TabDataState {
  cards: UnifiedCard[];
  currentPage: number;
  hasMore: boolean;
}

const DEFAULT_PAGE_SIZE = 20;

function createEmptyTabDataState(): Record<CustomerType, TabDataState> {
  return {
    nb: { cards: [], currentPage: 0, hasMore: true },
    gp: { cards: [], currentPage: 0, hasMore: true },
    gc: { cards: [], currentPage: 0, hasMore: true },
    bc: { cards: [], currentPage: 0, hasMore: true },
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

function extractLinkId(value: unknown): number | undefined {
  if (!value) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "object" && "id" in value) {
    return toNumber((value as { id?: unknown }).id);
  }
  return undefined;
}

function getStatus(value: unknown): CustomerStatus {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (normalized) return normalized;
  return "active";
}

function getDisabledFromStatus(status: unknown): number {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();
  return ["inactive", "disabled", "nonactive", "non-active"].includes(
    normalized,
  )
    ? 1
    : 0;
}

function extractMetaNumber(
  meta: QueryMeta | null | undefined,
  keys: Array<keyof QueryMeta>,
): number | undefined {
  for (const key of keys) {
    const parsed = toNumber(meta?.[key]);
    if (typeof parsed === "number") return parsed;
  }
  return undefined;
}

function getPerPage(meta: QueryMeta | null | undefined): number {
  return extractMetaNumber(meta, ["per_page"]) || DEFAULT_PAGE_SIZE;
}

function getTotalCount(
  meta: QueryMeta | null | undefined,
  fallback: number,
): number {
  return extractMetaNumber(meta, ["total", "total_count", "count"]) || fallback;
}

function getHasMore(
  meta: QueryMeta | null | undefined,
  pageRowsLength: number,
): boolean {
  const currentPage = extractMetaNumber(meta, ["current_page"]);
  const lastPage = extractMetaNumber(meta, ["last_page"]);
  if (
    typeof currentPage === "number" &&
    typeof lastPage === "number" &&
    lastPage > 0
  ) {
    return currentPage < lastPage;
  }
  return pageRowsLength >= getPerPage(meta);
}

function getOrderField(
  tab: CustomerType,
  sortField: CustomerSortField,
): string {
  if (sortField === "updated_at") return "updated_at";
  if (sortField === "code") return "name";
  if (tab === "nb") return "nb_name";
  if (tab === "gp") return "gp_name";
  if (tab === "gc") return "gc_name";
  return "name";
}

function resolveUserName(
  directName: string | null | undefined,
  value: number | { id?: number; full_name?: string } | null | undefined,
): string | undefined {
  if (directName) return directName;
  if (value && typeof value === "object" && value.full_name) {
    return value.full_name;
  }
  return undefined;
}

function statusBadgeClass(status: CustomerStatus): string {
  const normalized = status.trim().toLowerCase();
  if (["active", "aktif"].includes(normalized)) {
    return "bg-emerald-100 text-emerald-700";
  }
  if (["pending", "prospek", "prospect", "draft"].includes(normalized)) {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-rose-100 text-rose-700";
}

function formatCurrency(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return `Rp ${new Intl.NumberFormat("id-ID").format(Number(value))}`;
}

function formatDays(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }
  return `${new Intl.NumberFormat("id-ID").format(Number(value))} hari`;
}

function policyLevelLabel(level?: string | null): string {
  const normalized = String(level || "")
    .trim()
    .toLowerCase();
  if (normalized === "nbid") return "NB";
  if (normalized === "gpid") return "GP";
  if (normalized === "gcid") return "GC";
  if (normalized === "bcid") return "BC";
  return "-";
}

function getPolicyRequestParams(card: UnifiedCard): {
  policy_id: string;
  policy_type: "nbid" | "gpid" | "gcid" | "bcid";
} {
  if (card.type === "nb") {
    return { policy_id: String(card.id), policy_type: "nbid" };
  }
  if (card.type === "gp") {
    return { policy_id: String(card.id), policy_type: "gpid" };
  }
  if (card.type === "gc") {
    return { policy_id: String(card.id), policy_type: "gcid" };
  }
  return { policy_id: card.code, policy_type: "bcid" };
}

function getPolicyCacheKey(card: UnifiedCard): string {
  return `${card.type}:${card.code}`;
}

function iconWrapperClass(type: CustomerType): string {
  if (type === "nb") return "bg-blue-100 text-blue-500";
  if (type === "gp") return "bg-orange-100 text-orange-500";
  if (type === "gc") return "bg-purple-100 text-purple-500";
  return "bg-emerald-100 text-emerald-500";
}

function renderCardIcon(type: CustomerType) {
  if (type === "nb") return <FaRegBuilding className="h-4 w-4" />;
  if (type === "gp") return <FaBuilding className="h-4 w-4" />;
  if (type === "gc") return <FaTruck className="h-4 w-4" />;
  return <FaStore className="h-4 w-4" />;
}

export default function CustomerOverviewPage() {
  const { token, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<CustomerType>("bc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState<CustomerSortField>("updated_at");
  const [sortDirection, setSortDirection] =
    useState<CustomerSortDirection>("desc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabData, setTabData] = useState<Record<CustomerType, TabDataState>>(
    createEmptyTabDataState,
  );
  const [policyByCard, setPolicyByCard] = useState<
    Record<string, CustomerPolicyResponseData | null>
  >({});
  const [tabStats, setTabStats] = useState<TabStats>({
    nb: 0,
    gp: 0,
    gc: 0,
    bc: 0,
  });

  const [selectedNB, setSelectedNB] = useState<NationalBrandDetailData | null>(
    null,
  );
  const [selectedGP, setSelectedGP] = useState<GroupParent | null>(null);
  const [selectedGC, setSelectedGC] = useState<GroupCustomer | null>(null);
  const [selectedBC, setSelectedBC] = useState<BranchCustomer | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  const loadTabPage = useCallback(
    async (tab: CustomerType, page: number, replace = false) => {
      if (!isAuthenticated || !token) {
        setTabData(createEmptyTabDataState());
        setTabStats({ nb: 0, gp: 0, gc: 0, bc: 0 });
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      if (replace) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        const orderByField = getOrderField(tab, sortField);

        if (tab === "bc") {
          const trimmedSearch = debouncedSearch.trim();
          const baseBcSpec = {
            page,
            order_by: [[orderByField, sortDirection]],
          };

          const findMatchingGcIds = async (): Promise<number[]> => {
            const gcSearchRes = await apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
                fields: ["id"],
                search: trimmedSearch,
              }),
              { method: "GET", cache: "no-store" },
              token,
            );

            if (!gcSearchRes.ok) {
              throw new Error(
                `Failed to fetch group customer (${gcSearchRes.status})`,
              );
            }

            const gcSearchJson = await gcSearchRes.json();
            const gcSearchRows: GroupCustomerLookupRow[] = Array.isArray(
              gcSearchJson?.data,
            )
              ? gcSearchJson.data
              : [];

            return gcSearchRows
              .map((row) => toNumber(row.id))
              .filter((id): id is number => typeof id === "number");
          };

          let bcFilters: unknown[] | undefined;
          const searchesBcid = Boolean(trimmedSearch);
          if (trimmedSearch) {
            // The generic search for branch_customer does not consistently
            // include its ID field (`name`). Always check that field directly;
            // BCID prefixes and formats vary between branches.
            bcFilters = [["name", "like", `%${trimmedSearch.toUpperCase()}%`]];
          }

          const fetchBcPage = async (filters?: unknown[]) => {
            let response = await apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
                fields: [
                  "id",
                  "name",
                  "branch",
                  "gcid",
                  "status",
                  "updated_at",
                ],
                ...baseBcSpec,
                ...(filters ? { filters } : {}),
              }),
              { method: "GET", cache: "no-store" },
              token,
            );

            if (!response.ok && response.status >= 500) {
              response = await apiFetch(
                getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
                  fields: [
                    "id",
                    "name",
                    "branch",
                    "gcid",
                    "disabled",
                    "updated_at",
                  ],
                  ...baseBcSpec,
                  ...(filters ? { filters } : {}),
                }),
                { method: "GET", cache: "no-store" },
                token,
              );
            }

            if (!response.ok) {
              throw new Error(`Failed to fetch BC (${response.status})`);
            }

            const json = await response.json();
            const rows: BranchCustomerApiResponse[] = Array.isArray(json?.data)
              ? json.data
              : [];
            return {
              rows,
              meta: (json?.meta || null) as QueryMeta | null,
            };
          };

          let bcResult = await fetchBcPage(bcFilters);

          // If it is not a BCID match, retain the existing customer-name
          // search behavior through the related group customer.
          if (searchesBcid && bcResult.rows.length === 0) {
            const matchingGcIds = await findMatchingGcIds();
            if (matchingGcIds.length > 0) {
              bcResult = await fetchBcPage([["gcid", "in", matchingGcIds]]);
            }
          }

          const bcRows = bcResult.rows;
          const meta = bcResult.meta;

          const branchIds = Array.from(
            new Set(
              bcRows
                .map((row) =>
                  row.branch && typeof row.branch === "object"
                    ? toNumber(row.branch.id)
                    : toNumber(row.branch),
                )
                .filter((id): id is number => typeof id === "number"),
            ),
          );
          const gcIds = Array.from(
            new Set(
              bcRows
                .map((row) =>
                  row.gcid && typeof row.gcid === "object"
                    ? toNumber(row.gcid.id)
                    : toNumber(row.gcid),
                )
                .filter((id): id is number => typeof id === "number"),
            ),
          );

          const [branchLookupRes, gcLookupRes] = await Promise.allSettled([
            branchIds.length > 0
              ? apiFetch(
                  getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
                    fields: ["id", "branch_name", "city"],
                    filters: [["id", "in", branchIds]],
                    limit: branchIds.length,
                  }),
                  { method: "GET", cache: "no-store" },
                  token,
                )
              : Promise.resolve(null),
            gcIds.length > 0
              ? apiFetch(
                  getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
                    fields: ["id", "name", "gc_name"],
                    filters: [["id", "in", gcIds]],
                    limit: gcIds.length,
                  }),
                  { method: "GET", cache: "no-store" },
                  token,
                )
              : Promise.resolve(null),
          ]);

          const branchMap = new Map<number, { name?: string; city?: string }>();
          if (
            branchLookupRes.status === "fulfilled" &&
            branchLookupRes.value &&
            branchLookupRes.value.ok
          ) {
            const branchJson = await branchLookupRes.value.json();
            const branchRows: BranchLookupRow[] = Array.isArray(
              branchJson?.data,
            )
              ? branchJson.data
              : [];
            branchRows.forEach((row) => {
              branchMap.set(Number(row.id), {
                name: row.branch_name || undefined,
                city: row.city || undefined,
              });
            });
          }

          const gcMap = new Map<number, string>();
          if (
            gcLookupRes.status === "fulfilled" &&
            gcLookupRes.value &&
            gcLookupRes.value.ok
          ) {
            const gcJson = await gcLookupRes.value.json();
            const gcRows: GroupCustomerLookupRow[] = Array.isArray(gcJson?.data)
              ? gcJson.data
              : [];
            gcRows.forEach((row) => {
              gcMap.set(Number(row.id), row.gc_name || row.name || "-");
            });
          }

          const nextCards = bcRows.map((row) => {
            const gcId =
              row.gcid && typeof row.gcid === "object"
                ? toNumber(row.gcid.id) || 0
                : toNumber(row.gcid) || 0;
            const branchId =
              row.branch && typeof row.branch === "object"
                ? toNumber(row.branch.id) || 0
                : toNumber(row.branch) || 0;
            const directGcName =
              row.gcid && typeof row.gcid === "object"
                ? row.gcid.gc_name || row.gcid.name
                : undefined;
            const directBranchName =
              row.branch && typeof row.branch === "object"
                ? row.branch.branch_name
                : undefined;
            const directBranchCity =
              row.branch && typeof row.branch === "object"
                ? row.branch.city
                : undefined;
            const branchName =
              directBranchName || branchMap.get(branchId)?.name;
            const branchCity =
              directBranchCity || branchMap.get(branchId)?.city;
            const gcName = directGcName || gcMap.get(gcId) || "";
            const status =
              typeof row.status === "string" && row.status.trim()
                ? getStatus(row.status)
                : getStatus(
                    Number(row.disabled || 0) === 1 ? "inactive" : "active",
                  );
            const disabled = getDisabledFromStatus(status);
            const computedName =
              (gcName && branchCity
                ? `${gcName} - ${branchCity}`
                : undefined) ||
              row.name ||
              `BC ${row.id}`;

            const bc: BranchCustomer = {
              id: Number(row.id),
              name: row.name || `BC${row.id}`,
              gc_id: gcId,
              gc_name: gcName || undefined,
              branch_id: branchId,
              branch_name: branchName,
              branch_city: branchCity || undefined,
              created_at: row.updated_at || new Date(0).toISOString(),
              updated_at: row.updated_at || new Date(0).toISOString(),
              disabled,
            };

            return {
              id: bc.id,
              code: bc.name,
              name: computedName,
              contact: "-",
              branchLocation: bc.branch_city || bc.branch_name || "-",
              monthlyVolume: "-",
              status,
              type: "bc" as const,
              segment: "Branch",
              createdAt: bc.updated_at,
              detail: { kind: "bc" as const, item: bc },
            };
          });

          setTabData((current) => ({
            ...current,
            bc: {
              cards: replace
                ? nextCards
                : [
                    ...current.bc.cards,
                    ...nextCards.filter(
                      (card) =>
                        !current.bc.cards.some(
                          (existing) => existing.id === card.id,
                        ),
                    ),
                  ],
              currentPage: page,
              hasMore: getHasMore(meta, bcRows.length),
            },
          }));
          setTabStats((current) => ({
            ...current,
            bc: getTotalCount(meta, nextCards.length),
          }));
        } else if (tab === "gp") {
          const gpRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
              fields: ["*", "created_by.full_name", "updated_by.full_name"],
              page,
              ...(debouncedSearch ? { search: debouncedSearch } : {}),
              order_by: [[orderByField, sortDirection]],
            }),
            { method: "GET", cache: "no-store" },
            token,
          );

          if (!gpRes.ok) {
            throw new Error(`Failed to fetch GP (${gpRes.status})`);
          }

          const gpJson = await gpRes.json();
          const gpRows: GroupParentApiResponse[] = Array.isArray(gpJson?.data)
            ? gpJson.data
            : [];
          const meta = (gpJson?.meta || null) as QueryMeta | null;
          const nextCards = gpRows.map((row) => {
            const gp: GroupParent = {
              id: Number(row.id),
              name: row.name || `GP${row.id}`,
              gp_name: row.gp_name || "-",
              description: row.description || undefined,
              credit_limit_active: Number(row.credit_limit_active || 0),
              credit_limit: row.credit_limit ?? null,
              payment_term_active: Number(row.payment_term_active || 0),
              payment_term: row.payment_term ?? null,
              limit_customer_overdue_active: Number(
                row.limit_customer_overdue_active || 0,
              ),
              limit_customer_overdue: row.limit_customer_overdue ?? null,
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

            return {
              id: gp.id,
              code: gp.name,
              name: gp.gp_name,
              contact: "-",
              branchLocation: "Group Parent",
              monthlyVolume: "-",
              status: getStatus(
                Number(row.disabled || 0) === 1 ? "inactive" : "active",
              ),
              type: "gp" as const,
              segment: "Group",
              createdAt: gp.updated_at,
              detail: { kind: "gp" as const, item: gp },
            };
          });

          setTabData((current) => ({
            ...current,
            gp: {
              cards: replace
                ? nextCards
                : [
                    ...current.gp.cards,
                    ...nextCards.filter(
                      (card) =>
                        !current.gp.cards.some(
                          (existing) => existing.id === card.id,
                        ),
                    ),
                  ],
              currentPage: page,
              hasMore: getHasMore(meta, gpRows.length),
            },
          }));
          setTabStats((current) => ({
            ...current,
            gp: getTotalCount(meta, nextCards.length),
          }));
        } else if (tab === "gc") {
          const gcRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
              fields: ["*", "created_by.full_name", "updated_by.full_name"],
              page,
              ...(debouncedSearch ? { search: debouncedSearch } : {}),
              order_by: [[orderByField, sortDirection]],
            }),
            { method: "GET", cache: "no-store" },
            token,
          );

          if (!gcRes.ok) {
            throw new Error(`Failed to fetch GC (${gcRes.status})`);
          }

          const gcJson = await gcRes.json();
          const gcRows: GroupCustomerApiResponse[] = Array.isArray(gcJson?.data)
            ? gcJson.data
            : [];
          const meta = (gcJson?.meta || null) as QueryMeta | null;
          const gpIds = Array.from(
            new Set(
              gcRows
                .map((row) =>
                  row.gpid && typeof row.gpid === "object"
                    ? toNumber(row.gpid.id)
                    : toNumber(row.gpid),
                )
                .filter((id): id is number => typeof id === "number"),
            ),
          );
          const gpMap = new Map<number, { code?: string; name?: string }>();
          if (gpIds.length > 0) {
            const gpLookupRes = await apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
                fields: ["id", "name", "gp_name"],
                filters: [["id", "in", gpIds]],
                limit: gpIds.length,
              }),
              { method: "GET", cache: "no-store" },
              token,
            );
            if (gpLookupRes.ok) {
              const gpLookupJson = await gpLookupRes.json();
              const gpLookupRows: GroupCustomerLookupRow[] = Array.isArray(
                gpLookupJson?.data,
              )
                ? gpLookupJson.data
                : [];
              gpLookupRows.forEach((row) => {
                gpMap.set(Number(row.id), {
                  code: row.name || undefined,
                  name: row.gp_name || row.name || undefined,
                });
              });
            }
          }
          const nextCards = gcRows.map((row) => {
            const gpId = extractLinkId(row.gpid) || 0;
            const gc: GroupCustomer = {
              id: Number(row.id),
              name: row.name || `GC${row.id}`,
              gc_name: row.gc_name || "-",
              gp_id: gpId,
              gp_name:
                row.gpid && typeof row.gpid === "object"
                  ? row.gpid.gp_name || row.gpid.name
                  : gpMap.get(gpId)?.name,
              gp_code:
                (row.gpid && typeof row.gpid === "object"
                  ? row.gpid.name
                  : undefined) || gpMap.get(gpId)?.code,
              owner_name: row.owner_full_name || undefined,
              owner_phone: row.owner_phone || undefined,
              owner_email: row.owner_email || undefined,
              created_at: row.created_at || new Date(0).toISOString(),
              updated_at:
                row.updated_at || row.created_at || new Date(0).toISOString(),
              disabled: Number(row.disabled || 0),
            };

            return {
              id: gc.id,
              code: gc.name,
              name: gc.gc_name,
              contact: gc.owner_name || "-",
              branchLocation: "Group Customer",
              monthlyVolume: "-",
              status: getStatus(
                Number(row.disabled || 0) === 1 ? "inactive" : "active",
              ),
              type: "gc" as const,
              segment: "Channel",
              createdAt: gc.updated_at,
              detail: { kind: "gc" as const, item: gc },
            };
          });

          setTabData((current) => ({
            ...current,
            gc: {
              cards: replace
                ? nextCards
                : [
                    ...current.gc.cards,
                    ...nextCards.filter(
                      (card) =>
                        !current.gc.cards.some(
                          (existing) => existing.id === card.id,
                        ),
                    ),
                  ],
              currentPage: page,
              hasMore: getHasMore(meta, gcRows.length),
            },
          }));
          setTabStats((current) => ({
            ...current,
            gc: getTotalCount(meta, nextCards.length),
          }));
        } else {
          const nbRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
              fields: ["*"],
              page,
              ...(debouncedSearch ? { search: debouncedSearch } : {}),
              order_by: [[orderByField, sortDirection]],
            }),
            { method: "GET", cache: "no-store" },
            token,
          );

          if (!nbRes.ok) {
            throw new Error(`Failed to fetch NB (${nbRes.status})`);
          }

          const nbJson = await nbRes.json();
          const nbRows: NationalBrandApiResponse[] = Array.isArray(nbJson?.data)
            ? nbJson.data
            : [];
          const meta = (nbJson?.meta || null) as QueryMeta | null;
          const nextCards = nbRows.map((row) => {
            const id = Number(row.id);
            const code = row.name || `NB-${row.id}`;
            const name = row.nb_name || row.name || `NB ${row.id}`;
            const disabled = Number(row.disabled || 0);

            return {
              id,
              code,
              name,
              contact: "-",
              branchLocation: "National",
              monthlyVolume: "-",
              status: getStatus(disabled === 1 ? "inactive" : "active"),
              type: "nb" as const,
              segment: "National",
              createdAt:
                row.updated_at || row.created_at || new Date(0).toISOString(),
              detail: {
                kind: "nb" as const,
                item: {
                  id,
                  name: code,
                  nb_name: name,
                  disabled,
                  created_at: row.created_at || new Date(0).toISOString(),
                  updated_at:
                    row.updated_at ||
                    row.created_at ||
                    new Date(0).toISOString(),
                  owners: [],
                  active_gp_count: 0,
                  active_gc_count: 0,
                  active_bc_count: 0,
                  active_gp_names: [],
                  active_gc_names: [],
                  active_bc_names: [],
                },
              },
            };
          });

          setTabData((current) => ({
            ...current,
            nb: {
              cards: replace
                ? nextCards
                : [
                    ...current.nb.cards,
                    ...nextCards.filter(
                      (card) =>
                        !current.nb.cards.some(
                          (existing) => existing.id === card.id,
                        ),
                    ),
                  ],
              currentPage: page,
              hasMore: getHasMore(meta, nbRows.length),
            },
          }));
          setTabStats((current) => ({
            ...current,
            nb: getTotalCount(meta, nextCards.length),
          }));
        }

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat customer data",
        );
        if (replace) {
          setTabData((current) => ({
            ...current,
            [tab]: { cards: [], currentPage: 0, hasMore: false },
          }));
        }
      } finally {
        if (replace) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [debouncedSearch, isAuthenticated, sortDirection, sortField, token],
  );

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setTabData(createEmptyTabDataState());
      setTabStats({ nb: 0, gp: 0, gc: 0, bc: 0 });
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    setPolicyByCard({});
    void loadTabPage(activeTab, 1, true);
  }, [activeTab, isAuthenticated, loadTabPage, token]);

  const tabOptions = useMemo(
    () => [
      // {
      //   key: "all" as const,
      //   label: "All Customers",
      //   count: tabStats.nb + tabStats.gp + tabStats.gc + tabStats.bc,
      // },
      { key: "nb" as const, label: "National Brands", count: tabStats.nb },
      { key: "gp" as const, label: "Group Parents", count: tabStats.gp },
      { key: "gc" as const, label: "Group Customers", count: tabStats.gc },
      { key: "bc" as const, label: "Branch Customers", count: tabStats.bc },
    ],
    [tabStats],
  );

  const currentTabData = tabData[activeTab];

  const filteredCards = useMemo(() => {
    const normalizedSearch = debouncedSearch.toLowerCase();
    return currentTabData.cards.filter((item) => {
      if (!normalizedSearch) return true;
      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.code.toLowerCase().includes(normalizedSearch) ||
        item.branchLocation.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [currentTabData.cards, debouncedSearch]);

  const sortFieldLabel =
    sortField === "updated_at"
      ? "Terakhir Diupdate"
      : sortField === "code"
        ? "ID Customer"
        : "Nama Customer";

  const visibleCards = filteredCards;
  const hasMoreCards = currentTabData.hasMore;

  useEffect(() => {
    if (!isAuthenticated || !token || visibleCards.length === 0) return;

    const cardsToLoad = visibleCards.filter(
      (card) => !(getPolicyCacheKey(card) in policyByCard),
    );

    if (cardsToLoad.length === 0) return;

    let cancelled = false;

    async function loadPolicies() {
      const results = await Promise.allSettled(
        cardsToLoad.map(async (card) => {
          const { policy_id, policy_type } = getPolicyRequestParams(card);
          const response = await apiFetch(
            getApiUrl(
              `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_customer_policy_active`,
            ),
            {
              method: "POST",
              cache: "no-store",
              body: JSON.stringify({ policy_id, policy_type }),
            },
            token,
          );

          if (!response.ok) {
            throw new Error(
              `Gagal memuat policy ${card.type.toUpperCase()} ${card.code}`,
            );
          }

          const json = (await response.json()) as {
            data?: CustomerPolicyResponseData | null;
          };

          return {
            key: getPolicyCacheKey(card),
            data: json?.data || null,
          };
        }),
      );

      if (cancelled) return;

      setPolicyByCard((prev) => {
        const next = { ...prev };
        results.forEach((result, index) => {
          const key = getPolicyCacheKey(cardsToLoad[index]);
          next[key] = result.status === "fulfilled" ? result.value.data : null;
        });
        return next;
      });
    }

    void loadPolicies();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, policyByCard, token, visibleCards]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || loadingMore || !hasMoreCards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        void loadTabPage(activeTab, currentTabData.currentPage + 1, false);
      },
      {
        root: null,
        rootMargin: "240px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    activeTab,
    currentTabData.currentPage,
    hasMoreCards,
    loadTabPage,
    loading,
    loadingMore,
  ]);

  const openDetail = (card: UnifiedCard) => {
    if (card.detail.kind === "nb") {
      setSelectedNB(card.detail.item);
      return;
    }
    if (card.detail.kind === "gp") {
      setSelectedGP(card.detail.item);
      return;
    }
    if (card.detail.kind === "gc") {
      setSelectedGC(card.detail.item);
      return;
    }
    setSelectedBC(card.detail.item);
  };

  const handleGCUpdate = (updatedGC: GroupCustomer) => {
    setSelectedGC(updatedGC);
    setTabData((prev) => ({
      ...prev,
      gc: {
        ...prev.gc,
        cards: prev.gc.cards.map((card) =>
          card.id === updatedGC.id
            ? {
                ...card,
                name: updatedGC.name,
                contact: updatedGC.owner_name || "-",
                detail: { kind: "gc", item: updatedGC },
              }
            : card,
        ),
      },
    }));
  };

  const handleBCUpdate = (updatedBC: BranchCustomer) => {
    setSelectedBC(updatedBC);
    setTabData((prev) => ({
      ...prev,
      bc: {
        ...prev.bc,
        cards: prev.bc.cards.map((card) =>
          card.id === updatedBC.id
            ? {
                ...card,
                name: updatedBC.name,
                contact: updatedBC.owner_name || "-",
                branchLocation:
                  updatedBC.branch_city || updatedBC.branch_name || "-",
                detail: { kind: "bc", item: updatedBC },
              }
            : card,
        ),
      },
    }));
  };

  return (
    <div className="space-y-8">
      {/* <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <div className="mb-3 flex items-start justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-900">
              Total Customer
            </p>
            <FaToolbox className="text-orange-500" />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <p className="text-4xl font-black text-slate-900">
              {cards.length.toLocaleString("en-US")}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
              All Accounts
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-orange-200">
            <div className="h-1.5 w-3/4 rounded-full bg-orange-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="mb-3 flex items-start justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Active Customer
            </p>
            <FaHospital className="text-emerald-500" />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <p className="text-4xl font-black text-slate-900">
              {activeCount.toLocaleString("en-US")}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              {activeRatio.toFixed(1)}% of filtered
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-emerald-200">
            <div
              className="h-1.5 rounded-full bg-emerald-500"
              style={{ width: `${Math.max(activeRatio, 2)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="mb-3 flex items-start justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Inactive Customer
            </p>
            <FaRegBuilding className="text-blue-500" />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <p className="text-4xl font-black text-slate-900">
              {inactiveCount.toLocaleString("en-US")}
            </p>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
              {inactiveRatio.toFixed(1)}% of filtered
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-blue-200">
            <div
              className="h-1.5 rounded-full bg-blue-500"
              style={{ width: `${Math.max(inactiveRatio, 2)}%` }}
            />
          </div>
        </div>
      </section> */}

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-5 border-b border-slate-200 pb-3">
          {tabOptions.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`border-b-[3px] pb-2 text-sm font-bold transition-colors ${
                activeTab === tab.key
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-slate-500 hover:text-orange-500"
              }`}
            >
              {tab.label}{" "}
              {/* <span className="text-xs text-slate-400">({tab.count})</span> */}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          <label className="relative flex-1">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID or branch..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            />
          </label>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <button
              type="button"
              onClick={() =>
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200"
              title={sortDirection === "asc" ? "Urutan naik" : "Urutan turun"}
            >
              {sortDirection === "asc" ? (
                <FaSortAmountUp className="h-3.5 w-3.5" />
              ) : (
                <FaSortAmountDown className="h-3.5 w-3.5" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setSortFieldDropdownOpen(!sortFieldDropdownOpen)}
                className="flex h-11 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-medium text-slate-700 transition-all hover:bg-slate-200"
              >
                <span>{sortFieldLabel}</span>
                <FaChevronDown
                  className={`h-3 w-3 transition-transform ${
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
                      className="absolute left-0 top-full z-20 mt-2 min-w-[190px] rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
                    >
                      {[
                        {
                          value: "updated_at" as CustomerSortField,
                          label: "Terakhir Diupdate",
                        },
                        {
                          value: "code" as CustomerSortField,
                          label: "ID Customer",
                        },
                        {
                          value: "name" as CustomerSortField,
                          label: "Nama Customer",
                        },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSortField(option.value);
                            setSortFieldDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-slate-50 ${
                            sortField === option.value
                              ? "bg-orange-50 text-orange-600"
                              : "text-slate-700"
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

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Memuat data customers...
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && visibleCards.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Tidak ada data customer untuk filter ini.
          </div>
        )}

        {!loading && !error && visibleCards.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleCards.map((item) => (
              <article
                key={`${item.type}-${item.id}`}
                className="cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                onClick={() => openDetail(item)}
              >
                {(() => {
                  const policy = policyByCard[getPolicyCacheKey(item)];
                  const creditLimit = policy?.credit_limit;
                  const paymentTerm = policy?.payment_term;

                  return (
                    <>
                      <div className="h-1.5 bg-gradient-to-r from-orange-500 to-orange-400" />
                      <div className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconWrapperClass(item.type)}`}
                            >
                              {renderCardIcon(item.type)}
                            </div>
                            <div>
                              <p className="line-clamp-1 text-base font-bold text-slate-900">
                                {item.name}
                              </p>
                              <p className="text-xs font-semibold uppercase text-slate-500">
                                ID: {item.code}
                              </p>
                            </div>
                          </div>
                          {item.type === "bc" ? (
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusBadgeClass(item.status)}`}
                            >
                              {item.status}
                            </span>
                          ) : null}
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-violet-100 bg-violet-50/70 px-3 py-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700">
                              Credit Limit
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {formatCurrency(creditLimit?.value)}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold text-violet-700">
                              Level:{" "}
                              {policyLevelLabel(creditLimit?.active_level)}
                            </p>
                          </div>

                          <div className="rounded-xl border border-cyan-100 bg-cyan-50/70 px-3 py-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">
                              Payment Term
                            </p>
                            <p className="mt-1 text-sm font-bold text-slate-900">
                              {formatDays(paymentTerm?.value)}
                            </p>
                            <p className="mt-1 text-[11px] font-semibold text-cyan-700">
                              Level:{" "}
                              {policyLevelLabel(paymentTerm?.active_level)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(item);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-orange-500"
                  >
                    <FaEye className="h-3 w-3" />
                    VIEW DETAILS
                  </button>
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(item);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline"
                  >
                    <FaEdit className="h-3 w-3" />
                    EDIT
                  </button> */}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-1 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            Showing {visibleCards.length} of{" "}
            {tabStats[activeTab] || filteredCards.length} customers
          </p>
          <p>
            {hasMoreCards
              ? "Scroll ke bawah untuk memuat lebih banyak"
              : "Semua data sudah tampil"}
          </p>
        </div>

        {!loading && !error && hasMoreCards ? (
          <div
            ref={loadMoreRef}
            className="flex h-16 items-center justify-center text-sm text-slate-400"
          >
            {loadingMore
              ? "Memuat data berikutnya..."
              : "Siap memuat data berikutnya..."}
          </div>
        ) : null}
      </section>

      <NBDetailModal
        isOpen={selectedNB !== null}
        onClose={() => setSelectedNB(null)}
        item={selectedNB}
        onViewGP={(gp) => {
          setSelectedNB(null);
          setSelectedGP(gp);
        }}
        onViewGC={(gc) => {
          setSelectedNB(null);
          setSelectedGC(gc);
        }}
        onViewBC={(bc) => {
          setSelectedNB(null);
          setSelectedBC(bc);
        }}
      />

      <GPDetailModal
        isOpen={selectedGP !== null}
        onClose={() => setSelectedGP(null)}
        gp={selectedGP}
        onViewNB={(nb) => {
          setSelectedGP(null);
          setSelectedNB(nb);
        }}
        onViewGC={(gc) => {
          setSelectedGP(null);
          setSelectedGC(gc);
        }}
        onViewBC={(bc) => {
          setSelectedGP(null);
          setSelectedBC(bc);
        }}
      />

      <GCDetailModal
        isOpen={selectedGC !== null}
        onClose={() => setSelectedGC(null)}
        gc={selectedGC}
        onGCUpdate={handleGCUpdate}
        onViewGP={(gp) => {
          setSelectedGC(null);
          setSelectedGP(gp);
        }}
        onViewBC={(bc) => {
          setSelectedGC(null);
          setSelectedBC(bc);
        }}
      />

      <BCDetailModal
        isOpen={selectedBC !== null}
        onClose={() => setSelectedBC(null)}
        bc={selectedBC}
        onBCUpdate={handleBCUpdate}
        onViewBC={(bc) => {
          setSelectedBC(bc);
        }}
        onViewGP={(gp) => {
          setSelectedBC(null);
          setSelectedGP(gp);
        }}
        onViewGC={(gc) => {
          setSelectedBC(null);
          setSelectedGC(gc);
        }}
      />
    </div>
  );
}
