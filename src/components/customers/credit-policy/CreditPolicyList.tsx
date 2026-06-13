"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaClock,
  FaDatabase,
  FaEye,
  FaHistory,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getResourceUrl } from "@/config/api";
import Pagination, { usePagination } from "@/components/ui/Pagination";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import { CreditPolicyFormModal } from "./CreditPolicyFormModal";

type CreditPolicyScope = "active" | "all" | "inactive";
type EntityType = "nbid" | "gpid" | "gcid" | "bcid";

interface CreditPolicyApiResponse {
  id: number;
  name?: string | null;
  entity_type?: EntityType | null;
  entity_id?: number | null;
  credit_limit?: number | null;
  payment_term?: number | null;
  limit_customer_overdue?: number | null;
  is_active?: number | boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: number | { full_name?: string } | null;
  updated_by?: number | { full_name?: string } | null;
  "created_by.full_name"?: string | null;
  "updated_by.full_name"?: string | null;
}

interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
}

interface GroupCustomerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
}

interface BranchCustomerRow {
  id: number;
  name?: string | null;
  gcid?: number | { id?: number; gc_name?: string; name?: string } | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
}

interface BranchRow {
  id: number;
  branch_name?: string | null;
  city?: string | null;
}

export interface CreditPolicyListItem {
  id: number;
  code: string;
  entityType: EntityType;
  entityTypeLabel: string;
  entityId: number;
  entityDisplayName: string;
  creditLimit: number;
  paymentTerm: number;
  limitCustomerOverdue: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface EntityOption {
  id: number;
  label: string;
}

export interface CreditPolicyLookups {
  nbid: EntityOption[];
  gpid: EntityOption[];
  gcid: EntityOption[];
  bcid: EntityOption[];
}

function resolveUserName(
  explicitName: string | null | undefined,
  value: number | { full_name?: string } | null | undefined,
): string {
  if (explicitName) return explicitName;
  if (value && typeof value === "object" && value.full_name) {
    return value.full_name;
  }
  if (typeof value === "number") return `User ${value}`;
  return "System";
}

function entityTypeLabel(value: EntityType): string {
  if (value === "nbid") return "National Brand";
  if (value === "gpid") return "Group Parent";
  if (value === "gcid") return "Group Customer";
  return "Branch Customer";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value?: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildBranchCustomerLabel(
  row: BranchCustomerRow,
  gcMap: Map<number, string>,
  branchMap: Map<number, string>,
): string {
  const gcObject = row.gcid && typeof row.gcid === "object" ? row.gcid : null;
  const branchObject = row.branch && typeof row.branch === "object" ? row.branch : null;
  const gcId =
    gcObject ? Number(gcObject.id || 0) : Number(row.gcid || 0);
  const branchId =
    branchObject ? Number(branchObject.id || 0) : Number(row.branch || 0);
  const gcName =
    gcObject?.gc_name || gcObject?.name || gcMap.get(gcId) || "";
  const branchName =
    branchObject?.city || branchObject?.branch_name || branchMap.get(branchId) || "";
  const combined = [gcName, branchName].filter(Boolean).join(" - ");
  return combined || row.name || `Branch Customer ${row.id}`;
}

async function loadLookups(token: string): Promise<CreditPolicyLookups> {
  const [nbs, gps, gcs, bcs, branches] = await Promise.all([
    fetchAllQueryRows<NationalBrandRow>({
      endpoint: API_CONFIG.ENDPOINTS.NATIONAL_BRAND,
      spec: { fields: ["id", "name", "nb_name"] },
      token,
      errorMessage: "Failed to fetch national brand",
    }),
    fetchAllQueryRows<GroupParentRow>({
      endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
      spec: { fields: ["id", "name", "gp_name"] },
      token,
      errorMessage: "Failed to fetch group parent",
    }),
    fetchAllQueryRows<GroupCustomerRow>({
      endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
      spec: { fields: ["id", "name", "gc_name"] },
      token,
      errorMessage: "Failed to fetch group customer",
    }),
    fetchAllQueryRows<BranchCustomerRow>({
      endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
      spec: { fields: ["id", "name", "gcid", "branch"] },
      token,
      errorMessage: "Failed to fetch branch customer",
    }),
    fetchAllQueryRows<BranchRow>({
      endpoint: API_CONFIG.ENDPOINTS.BRANCH,
      spec: { fields: ["id", "branch_name", "city"] },
      token,
      errorMessage: "Failed to fetch branch",
    }),
  ]);
  const gcMap = new Map(
    gcs.map((row) => [row.id, row.gc_name || row.name || `Group Customer ${row.id}`]),
  );
  const branchMap = new Map(
    branches.map((row) => [row.id, row.city || row.branch_name || `Branch ${row.id}`]),
  );

  return {
    nbid: nbs.map((row) => ({ id: row.id, label: row.nb_name || row.name || `National Brand ${row.id}` })),
    gpid: gps.map((row) => ({ id: row.id, label: row.gp_name || row.name || `Group Parent ${row.id}` })),
    gcid: gcs.map((row) => ({ id: row.id, label: row.gc_name || row.name || `Group Customer ${row.id}` })),
    bcid: bcs.map((row) => ({
      id: row.id,
      label: buildBranchCustomerLabel(row, gcMap, branchMap),
    })),
  };
}

export function CreditPolicyList() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CreditPolicyListItem[]>([]);
  const [lookups, setLookups] = useState<CreditPolicyLookups>({
    nbid: [],
    gpid: [],
    gcid: [],
    bcid: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scope, setScope] = useState<CreditPolicyScope>("active");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CreditPolicyListItem | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token || !isAuthenticated) {
        setItems([]);
        return;
      }

      const [rows, lookupData] = await Promise.all([
        fetchAllQueryRows<CreditPolicyApiResponse>({
          endpoint: API_CONFIG.ENDPOINTS.CREDIT_POLICY,
          spec: {
            fields: ["*", "created_by.full_name", "updated_by.full_name"],
          },
          token,
          errorMessage: "Failed to fetch credit policy",
        }),
        loadLookups(token),
      ]);

      const lookupMap: Record<EntityType, Map<number, string>> = {
        nbid: new Map(lookupData.nbid.map((item) => [item.id, item.label])),
        gpid: new Map(lookupData.gpid.map((item) => [item.id, item.label])),
        gcid: new Map(lookupData.gcid.map((item) => [item.id, item.label])),
        bcid: new Map(lookupData.bcid.map((item) => [item.id, item.label])),
      };

      const mapped = rows
        .filter((row): row is CreditPolicyApiResponse & { entity_type: EntityType } =>
          row.entity_type === "nbid" ||
          row.entity_type === "gpid" ||
          row.entity_type === "gcid" ||
          row.entity_type === "bcid",
        )
        .map((row) => {
          const entityId = Number(row.entity_id || 0);
          const code = row.name || `CREDPOL-${row.id}`;
          return {
            id: row.id,
            code,
            entityType: row.entity_type,
            entityTypeLabel: entityTypeLabel(row.entity_type),
            entityId,
            entityDisplayName:
              lookupMap[row.entity_type].get(entityId) ||
              `${entityTypeLabel(row.entity_type)} ${entityId}`,
            creditLimit: Number(row.credit_limit || 0),
            paymentTerm: Number(row.payment_term || 0),
            limitCustomerOverdue: Number(row.limit_customer_overdue || 0),
            isActive: Number(row.is_active ?? 0) === 1 || row.is_active === true,
            createdAt: row.created_at || new Date(0).toISOString(),
            updatedAt: row.updated_at || row.created_at || new Date(0).toISOString(),
            createdBy: resolveUserName(row["created_by.full_name"], row.created_by),
            updatedBy: resolveUserName(row["updated_by.full_name"], row.updated_by),
          };
        })
        .sort((left, right) => {
          if (left.isActive !== right.isActive) return left.isActive ? -1 : 1;
          return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
        });

      setLookups(lookupData);
      setItems(mapped);
    } catch (loadError) {
      setItems([]);
      setError(
        loadError instanceof Error ? loadError.message : "Gagal memuat credit policy",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      const scopeMatch =
        scope === "all" ? true : scope === "active" ? item.isActive : !item.isActive;
      if (!scopeMatch) return false;
      if (!query) return true;
      return (
        item.code.toLowerCase().includes(query) ||
        item.entityTypeLabel.toLowerCase().includes(query) ||
        item.entityDisplayName.toLowerCase().includes(query)
      );
    });
  }, [items, scope, searchQuery]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((item) => item.isActive).length,
      inactive: items.filter((item) => !item.isActive).length,
    }),
    [items],
  );

  const {
    currentPage,
    totalPages,
    paginatedItems,
    totalItems,
    itemsPerPage,
    setCurrentPage,
  } = usePagination(filteredItems, 12);

  const openCreate = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: CreditPolicyListItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleSave = useCallback(
    async (payload: {
      id?: number;
      entityType: EntityType;
      entityId: number;
      creditLimit: number;
      paymentTerm: number;
      limitCustomerOverdue: number;
      isActive: boolean;
    }) => {
      if (!token) throw new Error("Not authenticated");
      setSaving(true);
      try {
        const isEditing = Boolean(payload.id);
        const saveResponse = await apiFetch(
          getResourceUrl(
            API_CONFIG.ENDPOINTS.CREDIT_POLICY,
            isEditing ? payload.id : undefined,
          ),
          {
            method: isEditing ? "PUT" : "POST",
            body: JSON.stringify({
              entity_type: payload.entityType,
              entity_id: payload.entityId,
              credit_limit: payload.creditLimit,
              payment_term: payload.paymentTerm,
              limit_customer_overdue: payload.limitCustomerOverdue,
              is_active: payload.isActive ? 1 : 0,
            }),
            cache: "no-store",
          },
          token,
        );

        if (!saveResponse.ok) {
          const saveJson = await saveResponse.json().catch(() => ({}));
          throw new Error(
            saveJson?.message ||
              `Failed to ${isEditing ? "update" : "create"} credit policy (${saveResponse.status})`,
          );
        }

        if (payload.isActive) {
          const duplicates = items.filter(
            (item) =>
              item.id !== payload.id &&
              item.entityType === payload.entityType &&
              item.entityId === payload.entityId &&
              item.isActive,
          );
          await Promise.all(
            duplicates.map(async (item) => {
              const deactivateResponse = await apiFetch(
                getResourceUrl(API_CONFIG.ENDPOINTS.CREDIT_POLICY, item.id),
                {
                  method: "PUT",
                  body: JSON.stringify({ is_active: 0 }),
                  cache: "no-store",
                },
                token,
              );
              if (!deactivateResponse.ok) {
                throw new Error(
                  `Failed to deactivate previous active policy (${deactivateResponse.status})`,
                );
              }
            }),
          );
        }

        setModalOpen(false);
        setSelectedItem(null);
        await loadData();
      } finally {
        setSaving(false);
      }
    },
    [items, loadData, token],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Credit Policy</h1>
          <p className="text-sm text-gray-600 md:text-base">
            Kelola credit limit dan payment term berdasarkan entity customer
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:from-red-600 hover:to-red-700"
        >
          <FaPlus className="h-4 w-4" />
          Tambah Credit Policy
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaDatabase className="h-4 w-4 text-blue-700" />
            <div className="text-sm font-medium text-blue-700">Total Policy</div>
          </div>
          <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaCheckCircle className="h-4 w-4 text-emerald-700" />
            <div className="text-sm font-medium text-emerald-700">Active</div>
          </div>
          <div className="text-3xl font-bold text-emerald-900">{stats.active}</div>
        </div>
        <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-5">
          <div className="mb-1 flex items-center gap-2">
            <FaHistory className="h-4 w-4 text-amber-700" />
            <div className="text-sm font-medium text-amber-700">History</div>
          </div>
          <div className="text-3xl font-bold text-amber-900">{stats.inactive}</div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <FaSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari code, entity type, atau entity..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-red-300 focus:bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            ["active", "Active", "bg-emerald-500"],
            ["all", "All", "bg-blue-500"],
            ["inactive", "Inactive", "bg-amber-500"],
          ] as const).map(([value, label, activeClass]) => {
            const isActive = scope === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setScope(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? `${activeClass} text-white shadow`
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-red-600">
            <span className="text-sm font-medium">Error: {error}</span>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
          <FaClock className="mx-auto mb-4 h-10 w-10 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-800">Belum ada credit policy</h3>
          <p className="mt-2 text-sm text-gray-500">
            Tambahkan policy baru atau ubah filter untuk melihat histori.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Code",
                    "Entity Type",
                    "Entity",
                    "Credit Limit",
                    "Payment Term",
                    "Overdue Limit",
                    "Status",
                    "Updated",
                    "Action",
                  ].map((label) => (
                    <th
                      key={label}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50/80"
                  >
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.code}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.entityTypeLabel}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.entityDisplayName}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(item.creditLimit)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.paymentTerm} hari</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{item.limitCustomerOverdue}</td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.isActive ? "Current" : "History"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{formatDate(item.updatedAt)}</td>
                    <td className="px-4 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <FaEye className="h-3.5 w-3.5" />
                        Buat Versi Baru
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      )}

      <CreditPolicyFormModal
        open={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setSelectedItem(null);
        }}
        initial={selectedItem}
        lookups={lookups}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
