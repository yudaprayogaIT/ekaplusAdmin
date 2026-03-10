"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";
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
  FaHospital,
  FaRegBuilding,
  FaSearch,
  FaStore,
  FaToolbox,
  FaTruck,
} from "react-icons/fa";

type CustomerTab = "all" | "nb" | "gp" | "gc" | "bc";
type CustomerType = Exclude<CustomerTab, "all">;
type CustomerStatus = "active" | "pending" | "inactive";

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

const ITEMS_PER_PAGE = 6;

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
  const [activeTab, setActiveTab] = useState<CustomerTab>("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

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
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, {
                fields: ["*"],
                limit: 10000000,
              }),
              { method: "GET", cache: "no-store" },
              token,
            ),
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, {
                fields: ["*", "created_by.full_name", "updated_by.full_name"],
                limit: 10000000,
              }),
              { method: "GET", cache: "no-store" },
              token,
            ),
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
                fields: ["*", "created_by.full_name", "updated_by.full_name"],
                limit: 10000000,
              }),
              { method: "GET", cache: "no-store" },
              token,
            ),
            apiFetch(
              getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, {
                fields: ["*", "created_by.full_name", "updated_by.full_name"],
                limit: 10000000,
              }),
              { method: "GET", cache: "no-store" },
              token,
            ),
          ]);

        const errors: string[] = [];
        let failedMainRequests = 0;

        const parseRows = async <T,>(
          result: PromiseSettledResult<Response>,
          label: "NB" | "GP" | "GC" | "BC",
        ): Promise<T[]> => {
          if (result.status === "rejected") {
            errors.push(`Failed to fetch ${label} (network error)`);
            failedMainRequests += 1;
            return [];
          }
          if (!result.value.ok) {
            errors.push(`Failed to fetch ${label} (${result.value.status})`);
            failedMainRequests += 1;
            return [];
          }
          const json = await result.value.json();
          return Array.isArray(json?.data) ? json.data : [];
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
      {
        key: "all" as const,
        label: "All Customers",
        count: tabStats.nb + tabStats.gp + tabStats.gc + tabStats.bc,
      },
      { key: "nb" as const, label: "NB Accounts", count: tabStats.nb },
      { key: "gp" as const, label: "GP Accounts", count: tabStats.gp },
      { key: "gc" as const, label: "GC Accounts", count: tabStats.gc },
      { key: "bc" as const, label: "Branch Leads", count: tabStats.bc },
    ],
    [tabStats],
  );

  const filteredCards = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return cards.filter((item) => {
      const matchesTab = activeTab === "all" || item.type === activeTab;
      if (!matchesTab) return false;
      if (!normalizedSearch) return true;
      return (
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.code.toLowerCase().includes(normalizedSearch) ||
        item.branchLocation.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [activeTab, cards, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCards.length / ITEMS_PER_PAGE),
  );
  const clampedPage = Math.min(currentPage, totalPages);
  const paginatedCards = filteredCards.slice(
    (clampedPage - 1) * ITEMS_PER_PAGE,
    clampedPage * ITEMS_PER_PAGE,
  );

  const activeCount = filteredCards.filter(
    (card) => card.status === "active",
  ).length;
  const inactiveCount = filteredCards.filter(
    (card) => card.status === "inactive",
  ).length;
  const activeRatio = filteredCards.length
    ? (activeCount / filteredCards.length) * 100
    : 0;
  const inactiveRatio = filteredCards.length
    ? (inactiveCount / filteredCards.length) * 100
    : 0;

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
            branchLocation: updatedBC.branch_city || updatedBC.branch_name || "-",
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
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
      </section>

      <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-5 border-b border-slate-200 pb-3 lg:border-b-0 lg:pb-0">
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
          <label className="flex h-11 w-full items-center rounded-xl border border-slate-200 bg-slate-50 px-3 lg:max-w-sm">
            <FaSearch className="mr-2 text-sm text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID or branch..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
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
        {!loading && !error && paginatedCards.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Tidak ada data customer untuk filter ini.
          </div>
        )}

        {!loading && !error && paginatedCards.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paginatedCards.map((item) => (
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
            Showing{" "}
            {filteredCards.length === 0
              ? 0
              : (clampedPage - 1) * ITEMS_PER_PAGE + 1}{" "}
            to {Math.min(clampedPage * ITEMS_PER_PAGE, filteredCards.length)} of{" "}
            {filteredCards.length} customers
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={clampedPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="rounded-lg border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 font-bold text-white">
              {clampedPage}
            </button>
            <button
              disabled={clampedPage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              className="rounded-lg border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
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
