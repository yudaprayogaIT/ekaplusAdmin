import { API_CONFIG, apiFetch, getQueryUrl } from "@/config/api";

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

interface BranchRow {
  id?: number | string | null;
  url?: string | null;
  token?: string | null;
  branch_name?: string | null;
  city?: string | null;
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

export async function fetchPaymentAccountInfo(params: {
  branchId?: number | null;
  paymentAccount?: string | null;
  authToken?: string | null;
}): Promise<PaymentAccountInfo | null> {
  const branchId = params.branchId || 0;
  const paymentAccount = (params.paymentAccount || "").trim();
  const authToken = params.authToken || "";

  if (!branchId || !paymentAccount || !authToken) return null;

  const branch = await fetchBranchConnectionInfo(branchId, authToken);
  if (!branch?.url || !branch.token) return null;

  const rekeningUrl = new URL("/api/resource/Rekening", branch.url);
  rekeningUrl.searchParams.set(
    "fields",
    JSON.stringify(["name", "nomor_rekening", "nama_rekening", "bank"]),
  );
  rekeningUrl.searchParams.set(
    "filters",
    JSON.stringify([["name", "=", paymentAccount]]),
  );

  const response = await fetch(rekeningUrl.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: branch.token,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rekening (${response.status})`);
  }

  const json = await response.json();
  const row = (Array.isArray(json?.data) ? json.data[0] : null) as
    | RekeningRow
    | null;

  if (!row?.name) return null;

  return {
    name: row.name,
    nomor_rekening: row.nomor_rekening || undefined,
    nama_rekening: row.nama_rekening || undefined,
    bank: row.bank || undefined,
  };
}
