"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBuilding,
  FaStore,
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
} from "react-icons/fa";
import {
  MemberDetailModal,
  type MemberCustomerRegistration,
  type MemberOfRef,
  type UserMember,
} from "./MemberDetailModal";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";

interface MemberOfApiResponse {
  id: number;
  user?:
    | number
    | { id?: number | string; full_name?: string; phone?: string; email?: string }
    | null;
  ref_type?: string | null;
  ref_id?: number | string | null;
  is_owner?: number | boolean | null;
  is_sharing?: number | boolean | null;
  share_from?: number | string | null;
}

interface CustomerRegisterApiResponse {
  id: number;
  source?: string | null;
  status?: string | null;
  owner?: number | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  company_name?: string | null;
  company_type?: string | null;
  company_title?: string | null;
  product_need?: string | null;
  ekaplus_user?: number | { id?: number | string; full_name?: string; email?: string; phone?: string } | null;
  branch_id?: number | { id?: number | string; branch_name?: string; city?: string } | null;
  branch_id_id?: number | null;
  nbid?: number | { id?: number; name?: string; nb_name?: string } | null;
  gpid?: number | { id?: number; name?: string; gp_name?: string } | null;
  gcid?: number | { id?: number; name?: string; gc_name?: string } | null;
  bcid?: number | { id?: number; name?: string; bc_name?: string } | null;
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

function extractUserId(value: unknown): string | undefined {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) {
    const id = (value as { id?: unknown }).id;
    if (id === null || id === undefined) return undefined;
    return String(id);
  }
  return undefined;
}

async function fetchNameMap(
  endpoint: string,
  ids: number[],
  nameField: string,
  token: string
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
      token
    );
    if (!res.ok) return result;

    const json = await res.json();
    const rows: Array<Record<string, unknown>> = Array.isArray(json?.data)
      ? json.data
      : [];
    rows.forEach((row: Record<string, unknown>) => {
      const id = toNumber(row?.id);
      if (!id) return;
      const label =
        (typeof row?.[nameField] === "string" && (row[nameField] as string)) ||
        (typeof row?.name === "string" && row.name) ||
        undefined;
      if (label) result.set(id, label);
    });
  } catch {
    // keep fallback display
  }

  return result;
}

export function MemberList() {
  const { token, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserMember | null>(null);
  const [memberRows, setMemberRows] = useState<MemberOfApiResponse[]>([]);
  const [customerRows, setCustomerRows] = useState<CustomerRegisterApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!isAuthenticated || !token) {
        setMemberRows([]);
        setCustomerRows([]);
        setLoading(false);
        return;
      }

      const memberSpec = { fields: ["*"], limit: 10000000 };
      const memberRes = await apiFetch(
        getQueryUrl(API_CONFIG.ENDPOINTS.MEMBER_OF, memberSpec),
        { method: "GET", cache: "no-store" },
        token
      );

      if (!memberRes.ok) throw new Error(`Failed to fetch members (${memberRes.status})`);
      const memberJson = await memberRes.json();

      const members: MemberOfApiResponse[] = Array.isArray(memberJson?.data)
        ? memberJson.data
        : [];

      const customerSpecs = [
        {
          fields: [
            "*",
            "ekaplus_user.full_name",
            "ekaplus_user.email",
            "ekaplus_user.phone",
            "branch_id.branch_name",
            "branch_id.city",
          ],
          limit: 10000000,
        },
        {
          fields: ["*"],
          limit: 10000000,
        },
      ];

      let customers: CustomerRegisterApiResponse[] = [];
      for (const customerSpec of customerSpecs) {
        const customerRes = await apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER, customerSpec),
          { method: "GET", cache: "no-store" },
          token
        );

        if (!customerRes.ok) {
          continue;
        }

        const customerJson = await customerRes.json();
        customers = Array.isArray(customerJson?.data) ? customerJson.data : [];
        break;
      }

      const nbIds = Array.from(
        new Set(customers.map((r) => extractLinkId(r.nbid)).filter((v): v is number => typeof v === "number"))
      );
      const gpIds = Array.from(
        new Set(customers.map((r) => extractLinkId(r.gpid)).filter((v): v is number => typeof v === "number"))
      );
      const gcIds = Array.from(
        new Set(customers.map((r) => extractLinkId(r.gcid)).filter((v): v is number => typeof v === "number"))
      );
      const bcIds = Array.from(
        new Set(customers.map((r) => extractLinkId(r.bcid)).filter((v): v is number => typeof v === "number"))
      );

      const [nbMap, gpMap, gcMap, bcMap] = await Promise.all([
        fetchNameMap(API_CONFIG.ENDPOINTS.NATIONAL_BRAND, nbIds, "nb_name", token),
        fetchNameMap(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpIds, "gp_name", token),
        fetchNameMap(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, gcIds, "gc_name", token),
        fetchNameMap(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, bcIds, "bc_name", token),
      ]);

      const enrichedCustomers = customers.map((row) => {
        const nbId = extractLinkId(row.nbid);
        const gpId = extractLinkId(row.gpid);
        const gcId = extractLinkId(row.gcid);
        const bcId = extractLinkId(row.bcid);

        const gcName =
          (row.gcid && typeof row.gcid === "object" && (row.gcid.gc_name || row.gcid.name)) ||
          (gcId ? gcMap.get(gcId) : undefined);

        const branchCity =
          (row.branch_id && typeof row.branch_id === "object" ? row.branch_id.city : undefined) ||
          "";

        const bcName =
          (row.bcid && typeof row.bcid === "object" && (row.bcid.bc_name || row.bcid.name)) ||
          (bcId ? bcMap.get(bcId) : undefined) ||
          (gcName && branchCity ? `${gcName} - ${branchCity}` : undefined);

        return {
          ...row,
          _resolved_nb_name:
            (row.nbid && typeof row.nbid === "object" && (row.nbid.nb_name || row.nbid.name)) ||
            (nbId ? nbMap.get(nbId) : undefined),
          _resolved_gp_name:
            (row.gpid && typeof row.gpid === "object" && (row.gpid.gp_name || row.gpid.name)) ||
            (gpId ? gpMap.get(gpId) : undefined),
          _resolved_gc_name: gcName,
          _resolved_bc_name: bcName,
        };
      });

      setMemberRows(members);
      setCustomerRows(enrichedCustomers);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setMemberRows([]);
      setCustomerRows([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const registrationsByUser = useMemo(() => {
    const map = new Map<string, MemberCustomerRegistration[]>();

    customerRows.forEach((row) => {
      const userIds = new Set<string>();
      const ekaplusUserId = extractUserId(row.ekaplus_user);
      if (ekaplusUserId) userIds.add(ekaplusUserId);
      const ownerId = row.owner !== null && row.owner !== undefined ? String(row.owner) : undefined;
      if (ownerId) userIds.add(ownerId);

      const registration: MemberCustomerRegistration = {
        id: Number(row.id),
        name: row.company_name || `Customer Register ${row.id}`,
        status: row.status || "Draft",
        source: row.source || undefined,
        owner_full_name: row.owner_full_name || undefined,
        owner_phone: row.owner_phone || undefined,
        owner_email: row.owner_email || undefined,
        branch_name:
          (row.branch_id && typeof row.branch_id === "object" ? row.branch_id.branch_name : undefined) ||
          (row.branch_id_id ? `Branch ${row.branch_id_id}` : undefined),
        branch_city:
          row.branch_id && typeof row.branch_id === "object" ? row.branch_id.city : undefined,
        company_type: row.company_type || undefined,
        company_title: row.company_title || undefined,
        product_need: row.product_need || undefined,
        nb_name: (row as CustomerRegisterApiResponse & { _resolved_nb_name?: string })._resolved_nb_name,
        gp_name: (row as CustomerRegisterApiResponse & { _resolved_gp_name?: string })._resolved_gp_name,
        gc_name: (row as CustomerRegisterApiResponse & { _resolved_gc_name?: string })._resolved_gc_name,
        bc_name: (row as CustomerRegisterApiResponse & { _resolved_bc_name?: string })._resolved_bc_name,
      };

      userIds.forEach((userId) => {
        if (!map.has(userId)) map.set(userId, []);
        map.get(userId)!.push(registration);
      });
    });

    map.forEach((rows) => {
      rows.sort((a, b) => b.id - a.id);
    });

    return map;
  }, [customerRows]);

  const userMembers = useMemo<UserMember[]>(() => {
    const userMap = new Map<string, UserMember>();

    memberRows.forEach((row) => {
      const userId =
        typeof row.user === "object"
          ? String(row.user?.id ?? "")
          : row.user !== null && row.user !== undefined
          ? String(row.user)
          : "";
      if (!userId) return;

      const ownerName =
        (typeof row.user === "object" && row.user?.full_name) || `User ${userId}`;
      const ownerPhone = typeof row.user === "object" ? row.user?.phone : undefined;
      const ownerEmail = typeof row.user === "object" ? row.user?.email : undefined;

      if (!userMap.has(userId)) {
        const registrations = registrationsByUser.get(userId) || [];
        userMap.set(userId, {
          user_id: userId,
          owner_name:
            ownerName || registrations[0]?.owner_full_name || `User ${userId}`,
          owner_phone: ownerPhone || registrations[0]?.owner_phone,
          owner_email: ownerEmail || registrations[0]?.owner_email,
          refs: [],
          counts: { nbid: 0, gpid: 0, gcid: 0, bcid: 0 },
          totalCompanies: 0,
          registrations,
        });
      }

      const user = userMap.get(userId)!;
      const ref: MemberOfRef = {
        id: row.id,
        ref_type: row.ref_type || "-",
        ref_id:
          typeof row.ref_id === "number"
            ? row.ref_id
            : Number.parseInt(String(row.ref_id ?? "0"), 10),
        is_owner: row.is_owner ?? 0,
        is_sharing: row.is_sharing ?? 0,
        share_from: row.share_from ?? null,
      };
      user.refs.push(ref);
      if (ref.ref_type === "nbid") user.counts.nbid += 1;
      if (ref.ref_type === "gpid") user.counts.gpid += 1;
      if (ref.ref_type === "gcid") user.counts.gcid += 1;
      if (ref.ref_type === "bcid") user.counts.bcid += 1;
      user.totalCompanies += 1;

      if (!user.owner_phone && ownerPhone) user.owner_phone = ownerPhone;
      if (!user.owner_email && ownerEmail) user.owner_email = ownerEmail;
    });

    return Array.from(userMap.values()).sort((a, b) =>
      a.owner_name.localeCompare(b.owner_name)
    );
  }, [memberRows, registrationsByUser]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return userMembers;
    const query = searchQuery.toLowerCase();
    return userMembers.filter(
      (user) =>
        user.owner_name.toLowerCase().includes(query) ||
        user.owner_phone?.toLowerCase().includes(query) ||
        user.owner_email?.toLowerCase().includes(query) ||
        user.user_id.toLowerCase().includes(query) ||
        user.registrations.some(
          (reg) =>
            reg.name.toLowerCase().includes(query) ||
            reg.branch_name?.toLowerCase().includes(query) ||
            reg.nb_name?.toLowerCase().includes(query) ||
            reg.gp_name?.toLowerCase().includes(query) ||
            reg.gc_name?.toLowerCase().includes(query) ||
            reg.bc_name?.toLowerCase().includes(query)
        )
    );
  }, [userMembers, searchQuery]);

  const stats = useMemo(() => {
    const totalCompanies = userMembers.reduce((sum, u) => sum + u.totalCompanies, 0);
    const totalRegistrations = userMembers.reduce(
      (sum, u) => sum + u.registrations.length,
      0
    );
    return {
      totalUsers: userMembers.length,
      totalCompanies,
      totalRegistrations,
      avgCompaniesPerUser:
        userMembers.length > 0 ? (totalCompanies / userMembers.length).toFixed(1) : "0",
    };
  }, [userMembers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <FaUsers className="w-6 h-6 text-white" />
          </div>
          Members Management
        </h1>
        <p className="text-gray-600 mt-2">
          Data member dari <span className="font-semibold">member_of</span> + profil lengkap dari <span className="font-semibold">customer_register</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-100">Total Users</p>
            <FaUsers className="w-5 h-5 text-purple-200" />
          </div>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
          <p className="text-xs text-purple-100 mt-1">Unique users</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-100">Total References</p>
            <FaBuilding className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-4xl font-bold">{stats.totalCompanies}</p>
          <p className="text-xs text-blue-100 mt-1">NB + GP + GC + BC</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-100">Customer Register</p>
            <FaStore className="w-5 h-5 text-orange-200" />
          </div>
          <p className="text-4xl font-bold">{stats.totalRegistrations}</p>
          <p className="text-xs text-orange-100 mt-1">Avg refs/user: {stats.avgCompaniesPerUser}</p>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari user, kontak, company, branch, NB/GP/GC/BC..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-bold">{filteredUsers.length}</span> user
          </p>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <motion.button
                key={user.user_id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedUser(user)}
                className="bg-white rounded-2xl shadow-sm border-2 border-purple-200 hover:border-purple-400 p-5 text-left transition-all hover:shadow-md group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FaUser className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{user.owner_name}</h3>
                      <p className="text-xs text-gray-500">User ID: {user.user_id}</p>
                    </div>
                  </div>
                  <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </div>

                <div className="bg-purple-50 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contact Information</p>
                  {user.owner_phone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-3 h-3 text-purple-400" />
                      <p className="text-sm text-gray-700">{user.owner_phone}</p>
                    </div>
                  )}
                  {user.owner_email && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-3 h-3 text-purple-400" />
                      <p className="text-sm text-gray-700 line-clamp-1">{user.owner_email}</p>
                    </div>
                  )}
                  {!user.owner_phone && !user.owner_email && (
                    <p className="text-xs text-gray-500 italic">Informasi kontak belum tersedia</p>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {user.counts.nbid > 0 && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">{user.counts.nbid} NB</span>
                  )}
                  {user.counts.gpid > 0 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">{user.counts.gpid} GP</span>
                  )}
                  {user.counts.gcid > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">{user.counts.gcid} GC</span>
                  )}
                  {user.counts.bcid > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">{user.counts.bcid} BC</span>
                  )}
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                    {user.registrations.length} Register
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <FaSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">Tidak ada user ditemukan</p>
            <p className="text-sm text-gray-500">Coba ubah kata kunci pencarian</p>
          </div>
        )}
      </div>

      <MemberDetailModal isOpen={selectedUser !== null} onClose={() => setSelectedUser(null)} user={selectedUser} />
    </div>
  );
}
