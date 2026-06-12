import {
  API_CONFIG,
  apiFetch,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";

export interface BranchConnectionInfo {
  id: number;
  url?: string;
  token?: string;
  branch_name?: string;
  city?: string;
}

export interface PaymentAccountInfo {
  name: string;
  nomor_rekening?: string;
  nama_rekening?: string;
  bank?: string;
}

export interface BranchErpListParams {
  branchId?: number | null;
  registrationId?: number | string | null;
  authToken?: string | null;
  resource: string;
  fields: string[];
  limit?: number;
  start?: number;
  filters?: unknown[];
}



interface BranchRow {
  id?: number | string | null;
  url?: string | null;
  token?: string | null;
  branch_name?: string | null;
  city?: string | null;
}

interface BranchCustomerRow {
  branch?: number | string | { id?: number | string | null } | null;
}

interface RekeningRow {
  name?: string | null;
  nomor_rekening?: string | null;
  nama_rekening?: string | null;
  bank?: string | null;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export function getTaxStatusLabel(value?: number | boolean | null): string {
  return Number(value || 0) === 1 ? "PKP" : "Non PKP";
}

export async function fetchBranchConnectionInfo(
  branchId: number,
  authToken: string,
): Promise<BranchConnectionInfo | null> {
  if (!branchId || !authToken) return null;

  const spec = {
    fields: ["id", "url", "token", "branch_name", "city"],
    filters: [["id", "=", branchId]],
    limit: 1,
  };

  const response = await apiFetch(
    getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, spec),
    { method: "GET", cache: "no-store" },
    authToken,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch branch connection (${response.status})`);
  }

  const json = await response.json();
  const row = (Array.isArray(json?.data) ? json.data[0] : null) as
    | BranchRow
    | null;

  const id = toNumber(row?.id);
  if (!row || !id) return null;

  return {
    id,
    url: row.url || undefined,
    token: row.token || undefined,
    branch_name: row.branch_name || undefined,
    city: row.city || undefined,
  };
}

export async function fetchBranchIdFromBranchCustomer(
  branchCustomerId: number,
  authToken: string,
): Promise<number | null> {
  if (!branchCustomerId || !authToken) return null;

  const response = await apiFetch(
    getResourceUrl(API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2, branchCustomerId),
    { method: "GET", cache: "no-store" },
    authToken,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch branch customer connection (${response.status})`,
    );
  }

  const json = await response.json();
  const row = (json?.data ?? null) as BranchCustomerRow | null;
  const branchValue =
    row?.branch && typeof row.branch === "object" ? row.branch.id : row?.branch;

  return toNumber(branchValue) ?? null;
}

export async function resolveBranchConnectionInfo(params: {
  branchId?: number | null;
  registrationId?: number | string | null;
  authToken?: string | null;
}): Promise<BranchConnectionInfo | null> {
  const branchId = params.branchId || 0;
  const registrationId = toNumber(params.registrationId);
  const authToken = params.authToken || "";

  if ((!branchId && !registrationId) || !authToken) return null;

  const resolvedBranchId =
    (registrationId
      ? await fetchBranchIdFromBranchCustomer(registrationId, authToken)
      : null) || branchId;

  if (!resolvedBranchId) return null;

  return fetchBranchConnectionInfo(resolvedBranchId, authToken);
}

export async function fetchBranchErpResourcePage<T extends object = Record<string, unknown>>(
  params: BranchErpListParams,
): Promise<T[]> {
  const branch = await resolveBranchConnectionInfo(params);
  if (!branch?.url || !branch.token) return [];

  const resourcePath = params.resource.startsWith("/")
    ? params.resource
    : `/api/resource/${params.resource}`;
  const url = new URL(resourcePath, branch.url);
  url.searchParams.set("fields", JSON.stringify(params.fields));
  url.searchParams.set("limit_page_length", String(params.limit || 20));
  url.searchParams.set("limit_start", String(params.start || 0));
  if (params.filters?.length) {
    url.searchParams.set("filters", JSON.stringify(params.filters));
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `token ${branch.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${params.resource} (${response.status})`);
  }

  const json = await response.json();
  return Array.isArray(json?.data) ? (json.data as T[]) : [];
}

export async function fetchPaymentAccountInfo(params: {
  branchId?: number | null;
  registrationId?: number | string | null;
  paymentAccount?: string | null;
  authToken?: string | null;
}): Promise<PaymentAccountInfo | null> {
  const paymentAccount = (params.paymentAccount || "").trim();

  if (!paymentAccount) return null;

  const rows = await fetchBranchErpResourcePage<RekeningRow>({
    ...params,
    resource: "Rekening",
    fields: ["name", "nomor_rekening", "nama_rekening", "bank"],
    limit: 1,
    start: 0,
    filters: [["name", "=", paymentAccount]],
  });

  const row = rows.find((item) => (item?.name || "").trim() === paymentAccount) || null;
  if (!row?.name) return null;

  return {
    name: row.name,
    nomor_rekening: row.nomor_rekening || undefined,
    nama_rekening: row.nama_rekening || undefined,
    bank: row.bank || undefined,
  };
}
