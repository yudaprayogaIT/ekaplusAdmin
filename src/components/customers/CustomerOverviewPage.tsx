"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
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
  FaEdit,
  FaEye,
  FaRegBuilding,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaStore,
  FaTruck,
  FaChevronDown,
} from "react-icons/fa";

type CustomerTab = "all" | "nb" | "gp" | "gc" | "bc";
type CustomerType = Exclude<CustomerTab, "all">;
type CustomerStatus = "active" | "pending" | "inactive";
type CustomerSortField = "created_at" | "code" | "name";
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
  owner_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  disabled?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
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
  bcid_name?: string | null;
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
}

const ITEMS_PER_BATCH = 20;

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

function getStatus(disabled: unknown): CustomerStatus {
  return Number(disabled || 0) === 1 ? "inactive" : "active";
}

function statusBadgeClass(status: CustomerStatus): string {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
}

function typeBadgeClass(type: CustomerType): string {
  if (type === "gp") return "bg-orange-100 text-orange-700";
  if (type === "gc") return "bg-emerald-100 text-emerald-700";
  if (type === "bc") return "bg-indigo-100 text-indigo-700";
  return "bg-blue-100 text-blue-700";
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
  const [activeTab, setActiveTab] = useState<CustomerTab>("bc");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<CustomerSortField>("created_at");
  const [sortDirection, setSortDirection] =
    useState<CustomerSortDirection>("desc");
  const [sortFieldDropdownOpen, setSortFieldDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<UnifiedCard[]>([]);
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
    setVisibleCount(ITEMS_PER_BATCH);
  }, [activeTab, search, sortField, sortDirection]);

  useEffect(() => {
    async function loadData() {
      if (!isAuthenticated || !token) {
        setCards([]);
        setTabStats({ nb: 0, gp: 0, gc: 0, bc: 0 });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const [nbResult, gpResult, gcResult, bcResult] =
          await Promise.allSettled([
            fetchAllQueryRows<NationalBrandApiResponse>({
              endpoint: API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
              spec: { fields: ["*"] },
              token,
              errorMessage: "Failed to fetch NB",
            }),
            fetchAllQueryRows<GroupParentApiResponse>({
              endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
              spec: { fields: ["*", "created_by.full_name", "updated_by.full_name"] },
              token,
              errorMessage: "Failed to fetch GP",
            }),
            fetchAllQueryRows<GroupCustomerApiResponse>({
              endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
              spec: { fields: ["*", "created_by.full_name", "updated_by.full_name"] },
              token,
              errorMessage: "Failed to fetch GC",
            }),
            fetchAllQueryRows<BranchCustomerApiResponse>({
              endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
              spec: { fields: ["*", "created_by.full_name", "updated_by.full_name"] },
              token,
              errorMessage: "Failed to fetch BC",
            }),
          ]);

        const errors: string[] = [];
        let failedMainRequests = 0;

        const parseRows = async <T,>(
          result: PromiseSettledResult<T[]>,
          label: "NB" | "GP" | "GC" | "BC",
        ): Promise<T[]> => {
          if (result.status === "rejected") {
            errors.push(`Failed to fetch ${label} (network error)`);
            failedMainRequests += 1;
            return [];
          }
          return Array.isArray(result.value) ? result.value : [];
        };

        const [nbRows, gpRows, gcRows, bcRows] = await Promise.all([
          parseRows<NationalBrandApiResponse>(nbResult, "NB"),
          parseRows<GroupParentApiResponse>(gpResult, "GP"),
          parseRows<GroupCustomerApiResponse>(gcResult, "GC"),
          parseRows<BranchCustomerApiResponse>(bcResult, "BC"),
        ]);

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
        const gcIdsForBc = Array.from(
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
          gcIdsForBc.length > 0
            ? apiFetch(
                getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
                  fields: ["id", "name", "gc_name"],
                  filters: [["id", "in", gcIdsForBc]],
                  limit: gcIdsForBc.length,
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

        const gcMap = new Map<number, string>();
        if (
          gcLookupRes.status === "fulfilled" &&
          gcLookupRes.value &&
          gcLookupRes.value.ok
        ) {
          const gcLookupJson = await gcLookupRes.value.json();
          const rows: GroupCustomerLookupRow[] = Array.isArray(
            gcLookupJson?.data,
          )
            ? gcLookupJson.data
            : [];
          rows.forEach((row) => {
            gcMap.set(Number(row.id), row.gc_name || row.name || "-");
          });
        }

        const gpByNb = new Map<number, GroupParentApiResponse[]>();
        gpRows.forEach((gpRow) => {
          const nbId = extractLinkId(gpRow.nbid);
          if (!nbId) return;
          if (!gpByNb.has(nbId)) gpByNb.set(nbId, []);
          gpByNb.get(nbId)?.push(gpRow);
        });

        const gcByGp = new Map<number, GroupCustomerApiResponse[]>();
        gcRows.forEach((gcRow) => {
          const gpId = extractLinkId(gcRow.gpid);
          if (!gpId) return;
          if (!gcByGp.has(gpId)) gcByGp.set(gpId, []);
          gcByGp.get(gpId)?.push(gcRow);
        });

        const bcByGc = new Map<number, BranchCustomerApiResponse[]>();
        bcRows.forEach((bcRow) => {
          const gcId = extractLinkId(bcRow.gcid);
          if (!gcId) return;
          if (!bcByGc.has(gcId)) bcByGc.set(gcId, []);
          bcByGc.get(gcId)?.push(bcRow);
        });

        const nbCards: UnifiedCard[] = nbRows.map((row) => {
          const id = Number(row.id);
          const code = row.name || `NB-${row.id}`;
          const name = row.nb_name || row.name || `NB ${row.id}`;
          const gpCandidates = gpByNb.get(id) || [];
          const activeGps = gpCandidates.filter(
            (x) => Number(x.disabled || 0) !== 1,
          );
          const gcCandidates = activeGps.flatMap(
            (x) => gcByGp.get(Number(x.id)) || [],
          );
          const activeGcs = gcCandidates.filter(
            (x) => Number(x.disabled || 0) !== 1,
          );
          const bcCandidates = activeGcs.flatMap(
            (x) => bcByGc.get(Number(x.id)) || [],
          );
          const activeBcs = bcCandidates.filter(
            (x) => Number(x.disabled || 0) !== 1,
          );

          return {
            id,
            code,
            name,
            contact: "-",
            branchLocation: "National",
            monthlyVolume: "-",
            status: getStatus(row.disabled),
            type: "nb",
            segment: "National",
            createdAt: row.created_at || new Date(0).toISOString(),
            detail: {
              kind: "nb",
              item: {
                id,
                code,
                name,
                disabled: Number(row.disabled || 0),
                created_at: row.created_at || new Date().toISOString(),
                updated_at:
                  row.updated_at || row.created_at || new Date().toISOString(),
                owners: [],
                active_gp_count: activeGps.length,
                active_gc_count: activeGcs.length,
                active_bc_count: activeBcs.length,
                active_gp_names: activeGps.map(
                  (x) => x.gp_name || x.name || "-",
                ),
                active_gc_names: activeGcs.map(
                  (x) => x.gc_name || x.name || "-",
                ),
                active_bc_names: activeBcs.map(
                  (x) => x.bcid_name || x.name || "-",
                ),
              },
            },
          };
        });

        const gpCards: UnifiedCard[] = gpRows.map((row) => {
          const gp: GroupParent = {
            id: Number(row.id),
            code: row.name || undefined,
            name: row.gp_name || row.name || "-",
            owner_name: row.owner_name || undefined,
            owner_phone: row.owner_phone || undefined,
            owner_email: row.owner_email || undefined,
            created_at: row.created_at || new Date(0).toISOString(),
            updated_at:
              row.updated_at || row.created_at || new Date(0).toISOString(),
            disabled: Number(row.disabled || 0),
          };

          return {
            id: gp.id,
            code: gp.code || `GP-${gp.id}`,
            name: gp.name,
            contact: gp.owner_name || "-",
            branchLocation: "Group Parent",
            monthlyVolume: "-",
            status: getStatus(row.disabled),
            type: "gp",
            segment: "Group",
            createdAt: gp.created_at,
            detail: { kind: "gp", item: gp },
          };
        });

        const gcCards: UnifiedCard[] = gcRows.map((row) => {
          const gpId = extractLinkId(row.gpid) || 0;
          const gc: GroupCustomer = {
            id: Number(row.id),
            code: row.name || undefined,
            name: row.gc_name || row.name || "-",
            gp_id: gpId,
            gp_name:
              row.gpid && typeof row.gpid === "object"
                ? row.gpid.gp_name || row.gpid.name
                : undefined,
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
            code: gc.code || `GC-${gc.id}`,
            name: gc.name,
            contact: gc.owner_name || "-",
            branchLocation: "Group Customer",
            monthlyVolume: "-",
            status: getStatus(row.disabled),
            type: "gc",
            segment: "Channel",
            createdAt: gc.created_at,
            detail: { kind: "gc", item: gc },
          };
        });

        const bcCards: UnifiedCard[] = bcRows.map((row) => {
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
          const directBranchCity =
            row.branch && typeof row.branch === "object"
              ? row.branch.city
              : undefined;
          const branchCity = directBranchCity || branchMap.get(branchId)?.city;
          const gcName = directGcName || gcMap.get(gcId) || "";

          const computedName =
            row.bcid_name ||
            (gcName && branchCity ? `${gcName} - ${branchCity}` : undefined) ||
            row.name ||
            `BC ${row.id}`;

          const bc: BranchCustomer = {
            id: Number(row.id),
            code: row.name || undefined,
            name: computedName,
            gc_id: gcId,
            gc_name: gcName || undefined,
            branch_id: branchId,
            branch_name: branchMap.get(branchId)?.name,
            branch_city: branchCity || undefined,
            owner_name: row.branch_owner || undefined,
            owner_phone: row.branch_owner_phone || undefined,
            owner_email: row.branch_owner_email || undefined,
            receipt_delivery_method: row.receipt_delivery_method || undefined,
            receipt_issued_at: row.receipt_issued_at || undefined,
            created_at: row.created_at || new Date(0).toISOString(),
            updated_at:
              row.updated_at || row.created_at || new Date(0).toISOString(),
            disabled: Number(row.disabled || 0),
          };

          return {
            id: bc.id,
            code: bc.code || `BC-${bc.id}`,
            name: bc.name,
            contact: bc.owner_name || "-",
            branchLocation: bc.branch_city || bc.branch_name || "-",
            monthlyVolume: "-",
            status: getStatus(row.disabled),
            type: "bc",
            segment: "Branch",
            createdAt: bc.created_at,
            detail: { kind: "bc", item: bc },
          };
        });

        const nextStats: TabStats = {
          nb: nbCards.length,
          gp: gpCards.length,
          gc: gcCards.length,
          bc: bcCards.length,
        };

        setTabStats(nextStats);
        setCards([...nbCards, ...gpCards, ...gcCards, ...bcCards]);
        if (failedMainRequests >= 4 && errors.length > 0) {
          setError(errors.join(" | "));
        } else {
          setError(null);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat customer data",
        );
        setCards([]);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [isAuthenticated, token]);

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

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = cards.filter((item) => {
      const matchesTab = item.type === activeTab;
      if (!matchesTab) return false;
      if (!normalizedSearch) return true;
      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.code.toLowerCase().includes(normalizedSearch) ||
        item.branchLocation.toLowerCase().includes(normalizedSearch)
      );
    });

    filtered.sort((left, right) => {
      if (sortField === "created_at") {
        const leftValue = new Date(left.createdAt).getTime();
        const rightValue = new Date(right.createdAt).getTime();
        return sortDirection === "desc"
          ? rightValue - leftValue
          : leftValue - rightValue;
      }

      const leftValue =
        sortField === "code"
          ? left.code.toLowerCase()
          : left.name.toLowerCase();
      const rightValue =
        sortField === "code"
          ? right.code.toLowerCase()
          : right.name.toLowerCase();

      const compared = leftValue.localeCompare(rightValue, undefined, {
        numeric: true,
        sensitivity: "base",
      });
      return sortDirection === "desc" ? -compared : compared;
    });

    return filtered;
  }, [activeTab, cards, search, sortDirection, sortField]);

  const sortFieldLabel =
    sortField === "created_at"
      ? "Tanggal Dibuat"
      : sortField === "code"
        ? "ID Customer"
        : "Nama Customer";

  const visibleCards = filteredCards.slice(0, visibleCount);
  const hasMoreCards = visibleCards.length < filteredCards.length;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loading || !hasMoreCards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_BATCH, filteredCards.length),
        );
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
  }, [filteredCards.length, hasMoreCards, loading, visibleCount]);

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
    setCards((prev) =>
      prev.map((card) => {
        if (card.type === "gc" && card.id === updatedGC.id) {
          return {
            ...card,
            name: updatedGC.name,
            contact: updatedGC.owner_name || "-",
            detail: { kind: "gc", item: updatedGC },
          };
        }
        if (card.type === "nb" && card.detail.kind === "nb") {
          const oldName =
            prev.find((x) => x.type === "gc" && x.id === updatedGC.id)?.name ||
            "";
          return {
            ...card,
            detail: {
              kind: "nb",
              item: {
                ...card.detail.item,
                active_gc_names: card.detail.item.active_gc_names.map((name) =>
                  name === oldName ? updatedGC.name : name,
                ),
              },
            },
          };
        }
        return card;
      }),
    );
  };

  const handleBCUpdate = (updatedBC: BranchCustomer) => {
    setSelectedBC(updatedBC);
    setCards((prev) =>
      prev.map((card) => {
        if (card.type === "bc" && card.id === updatedBC.id) {
          return {
            ...card,
            name: updatedBC.name,
            contact: updatedBC.owner_name || "-",
            branchLocation:
              updatedBC.branch_city || updatedBC.branch_name || "-",
            detail: { kind: "bc", item: updatedBC },
          };
        }
        if (card.type === "nb" && card.detail.kind === "nb") {
          const oldName =
            prev.find((x) => x.type === "bc" && x.id === updatedBC.id)?.name ||
            "";
          return {
            ...card,
            detail: {
              kind: "nb",
              item: {
                ...card.detail.item,
                active_bc_names: card.detail.item.active_bc_names.map((name) =>
                  name === oldName ? updatedBC.name : name,
                ),
              },
            },
          };
        }
        return card;
      }),
    );
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
              <span className="text-xs text-slate-400">({tab.count})</span>
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
                          value: "created_at" as CustomerSortField,
                          label: "Tanggal Dibuat",
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
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm cursor-pointer"
                onClick={() => openDetail(item)}
              >
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
                        <p className="line-clamp-1 text-xl font-bold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          ID: {item.code}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${statusBadgeClass(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Contact</span>
                      <span className="font-semibold text-slate-900">
                        {item.contact}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Branch Location</span>
                      <span className="font-semibold text-slate-900">
                        {item.branchLocation}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Monthly Volume</span>
                      <span className="font-bold text-orange-500">
                        {item.monthlyVolume}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase ${typeBadgeClass(item.type)}`}
                    >
                      {item.type} Account
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-600">
                      {item.segment}
                    </span>
                  </div>
                </div>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(item);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-500 hover:underline"
                  >
                    <FaEdit className="h-3 w-3" />
                    EDIT
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-1 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            Showing {visibleCards.length} of {filteredCards.length} customers
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
            Memuat data berikutnya...
          </div>
        ) : null}
      </section>

      <NBDetailModal
        isOpen={selectedNB !== null}
        onClose={() => setSelectedNB(null)}
        item={selectedNB}
      />

      <GPDetailModal
        isOpen={selectedGP !== null}
        onClose={() => setSelectedGP(null)}
        gp={selectedGP}
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
