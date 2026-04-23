"use client";

import {
  API_CONFIG,
  apiFetch,
  getQueryUrl,
} from "@/config/api";

export type PolicyType = "nbid" | "gpid" | "gcid" | "bcid";

export interface EntityOption {
  id: number;
  label: string;
}

export interface NationalBrandRow {
  id: number;
  name?: string | null;
  nb_name?: string | null;
}

export interface GroupParentRow {
  id: number;
  name?: string | null;
  gp_name?: string | null;
}

export interface GroupCustomerRow {
  id: number;
  name?: string | null;
  gc_name?: string | null;
}

export interface BranchCustomerRow {
  id: number;
  name?: string | null;
  gcid?: number | { id?: number; gc_name?: string; name?: string } | null;
  branch?: number | { id?: number; branch_name?: string; city?: string } | null;
}

export interface BranchRow {
  id: number;
  branch_name?: string | null;
  city?: string | null;
}

export function buildBranchCustomerLabel(
  row: BranchCustomerRow,
  gcMap: Map<number, string>,
  branchMap: Map<number, string>,
): string {
  const gcObject = row.gcid && typeof row.gcid === "object" ? row.gcid : null;
  const branchObject =
    row.branch && typeof row.branch === "object" ? row.branch : null;

  const gcId = gcObject ? Number(gcObject.id || 0) : Number(row.gcid || 0);
  const branchId = branchObject
    ? Number(branchObject.id || 0)
    : Number(row.branch || 0);
  const gcName = gcObject?.gc_name || gcObject?.name || gcMap.get(gcId) || "";
  const branchName =
    branchObject?.city ||
    branchObject?.branch_name ||
    branchMap.get(branchId) ||
    "";
  const combined = [gcName, branchName].filter(Boolean).join(" - ");

  return combined || row.name || `Branch Customer ${row.id}`;
}

export function policyTypeLabel(value?: string | null): string {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "nbid") return "National Brand";
  if (normalized === "gpid") return "Group Parent";
  if (normalized === "gcid") return "Group Customer";
  if (normalized === "bcid") return "Branch Customer";
  return normalized || "-";
}

export function formatRequestDate(value?: string | null): string {
  const rawValue = value || new Date().toISOString();
  const date = new Date(rawValue);

  if (Number.isNaN(date.getTime())) {
    return rawValue;
  }

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function buildDirectorWhatsappText(params: {
  policyName: string;
  requestDate: string;
  creditLimitText: string;
  paymentTermText: string;
}): string {
  const {
    policyName,
    requestDate,
    creditLimitText,
    paymentTermText,
  } = params;

  return [
    "Selamat siang Bapak/Ibu,",
    "",
    "Dengan hormat,",
    `Nama Group: ${policyName}`,
    `Tanggal Pengajuan: ${requestDate}`,
    `Request Credit Limit: ${creditLimitText}`,
    `Request Payment Term: ${paymentTermText}`,
    "",
    "Bersama ini kami menyampaikan pengajuan perubahan fasilitas kredit customer sebagaimana rincian tersebut di atas.",
    'Apabila Bapak/Ibu berkenan menyetujui pengajuan tersebut, mohon konfirmasi dengan membalas "Setuju" pada pesan ini.',
    "",
    "Atas perhatian dan konfirmasinya, kami ucapkan terima kasih.",
  ].join("\n");
}

export async function resolvePolicyDisplayName(params: {
  token: string;
  policyType?: string | null;
  policyId?: number | null;
}): Promise<string> {
  const { token, policyType, policyId } = params;
  const normalizedType = String(policyType || "").trim().toLowerCase() as PolicyType;
  const numericPolicyId = Number(policyId || 0);

  if (!token || !numericPolicyId) {
    return "-";
  }

  switch (normalizedType) {
    case "nbid": {
      const response = await apiFetch(
        getQueryUrl(
          `${API_CONFIG.ENDPOINTS.NATIONAL_BRAND}/${numericPolicyId}`,
          { fields: ["id", "nb_name"] },
        ),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!response.ok) {
        throw new Error(`Gagal memuat national brand (${response.status})`);
      }

      const json = await response.json();
      const row = (json?.data || null) as NationalBrandRow | null;
      return row?.nb_name || row?.name || `National Brand ${numericPolicyId}`;
    }
    case "gpid": {
      const response = await apiFetch(
        getQueryUrl(
          `${API_CONFIG.ENDPOINTS.GROUP_PARENT}/${numericPolicyId}`,
          { fields: ["id", "gp_name"] },
        ),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!response.ok) {
        throw new Error(`Gagal memuat group parent (${response.status})`);
      }

      const json = await response.json();
      const row = (json?.data || null) as GroupParentRow | null;
      return row?.gp_name || row?.name || `Group Parent ${numericPolicyId}`;
    }
    case "gcid": {
      const response = await apiFetch(
        getQueryUrl(
          `${API_CONFIG.ENDPOINTS.GROUP_CUSTOMER}/${numericPolicyId}`,
          { fields: ["id", "gc_name"] },
        ),
        { method: "GET", cache: "no-store" },
        token,
      );

      if (!response.ok) {
        throw new Error(`Gagal memuat group customer (${response.status})`);
      }

      const json = await response.json();
      const row = (json?.data || null) as GroupCustomerRow | null;
      return row?.gc_name || row?.name || `Group Customer ${numericPolicyId}`;
    }
    case "bcid": {
      const [bcResponse, gcResponse, branchResponse] = await Promise.all([
        apiFetch(
          getQueryUrl(
            `${API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2}/${numericPolicyId}`,
            { fields: ["id", "name", "gcid", "branch"] },
          ),
          { method: "GET", cache: "no-store" },
          token,
        ),
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.GROUP_CUSTOMER, {
            fields: ["id", "name", "gc_name"],
            page: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        ),
        apiFetch(
          getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
            fields: ["id", "branch_name", "city"],
            page: 1,
          }),
          { method: "GET", cache: "no-store" },
          token,
        ),
      ]);

      if (!bcResponse.ok) {
        throw new Error(`Gagal memuat branch customer (${bcResponse.status})`);
      }
      if (!gcResponse.ok) {
        throw new Error(`Gagal memuat group customer (${gcResponse.status})`);
      }
      if (!branchResponse.ok) {
        throw new Error(`Gagal memuat branch (${branchResponse.status})`);
      }

      const [bcJson, gcJson, branchJson] = await Promise.all([
        bcResponse.json(),
        gcResponse.json(),
        branchResponse.json(),
      ]);

      const row = (bcJson?.data || null) as BranchCustomerRow | null;
      const groupCustomers = (Array.isArray(gcJson?.data)
        ? gcJson.data
        : []) as GroupCustomerRow[];
      const branches = (Array.isArray(branchJson?.data)
        ? branchJson.data
        : []) as BranchRow[];

      const gcMap = new Map(
        groupCustomers.map((item) => [
          item.id,
          item.gc_name || item.name || `Group Customer ${item.id}`,
        ]),
      );
      const branchMap = new Map(
        branches.map((item) => [
          item.id,
          item.city || item.branch_name || `Branch ${item.id}`,
        ]),
      );

      return row
        ? buildBranchCustomerLabel(row, gcMap, branchMap)
        : `Branch Customer ${numericPolicyId}`;
    }
    default:
      return "-";
  }
}
