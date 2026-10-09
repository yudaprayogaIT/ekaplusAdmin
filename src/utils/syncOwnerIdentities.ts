"use client";

import { API_CONFIG, apiFetch, getResourceUrl } from "@/config/api";
import type { OwnerIdentityValues } from "@/components/group_parent/CopyOwnerIdentityModal";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

export type OwnerIdentityScanAction =
  | "ready"
  | "need_review"
  | "no_data"
  | "already_same"
  | "gp_different";

export interface OwnerIdentityGcCandidate extends OwnerIdentityValues {
  id: number;
  code: string;
  name: string;
}

export interface OwnerIdentityScanRow {
  gpId: number;
  gpCode: string;
  gpName: string;
  currentIdentity: OwnerIdentityValues;
  candidates: OwnerIdentityGcCandidate[];
  uniqueIdentityCount: number;
  candidateIdentity?: OwnerIdentityValues;
  action: OwnerIdentityScanAction;
}

export interface OwnerIdentityScanResult {
  scannedAt: string;
  rows: OwnerIdentityScanRow[];
  total: number;
  ready: number;
  needReview: number;
  noData: number;
  alreadySame: number;
  gpDifferent: number;
}

export interface OwnerIdentitySyncProgress {
  completed: number;
  total: number;
  label: string;
}

export interface OwnerIdentitySyncResult {
  updated: number;
  alreadySame: number;
  skippedReview: number;
  failed: Array<{ gpId: number; gpCode: string; message: string }>;
  updatedGpIds: number[];
  alreadySameGpIds: number[];
}

interface GroupParentRow extends OwnerIdentityValues {
  id: number | string;
  name?: string | null;
  gp_name?: string | null;
  owner_full_name?: string | null;
}

interface GroupCustomerRow {
  id: number | string;
  name?: string | null;
  gc_name?: string | null;
  company_name?: string | null;
  gpid?: number | string | { id?: number | string } | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
  owner_email?: string | null;
  owner_place_of_birth?: string | null;
  owner_date_of_birth?: string | null;
}

const OWNER_KEYS: Array<keyof OwnerIdentityValues> = [
  "owner_name",
  "owner_phone",
  "owner_email",
  "owner_place_of_birth",
  "owner_date_of_birth",
];

function assertAdministrator(roleName?: string | null): void {
  if (roleName?.trim().toLowerCase() !== "administrator") {
    throw new Error("Hanya Administrator yang dapat menjalankan proses ini.");
  }
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "id" in value) {
    return toNumber((value as { id?: unknown }).id);
  }
  return 0;
}

function clean(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalize(key: keyof OwnerIdentityValues, value?: string | null): string {
  const normalized =
    key === "owner_date_of_birth" ? clean(value).split("T")[0] : clean(value);
  return key === "owner_email" ? normalized.toLowerCase() : normalized;
}

export function ownerIdentitySignature(identity: OwnerIdentityValues): string {
  return OWNER_KEYS.map((key) => normalize(key, identity[key])).join("\u0000");
}

export function hasOwnerIdentity(identity: OwnerIdentityValues): boolean {
  return OWNER_KEYS.some((key) => clean(identity[key]).length > 0);
}

function identityFromGp(row: GroupParentRow): OwnerIdentityValues {
  return {
    owner_name: row.owner_full_name || row.owner_name,
    owner_phone: row.owner_phone,
    owner_email: row.owner_email,
    owner_place_of_birth: row.owner_place_of_birth,
    owner_date_of_birth: row.owner_date_of_birth,
  };
}

function candidateFromGc(row: GroupCustomerRow): OwnerIdentityGcCandidate {
  return {
    id: toNumber(row.id),
    code: clean(row.name) || `GC${row.id}`,
    name: clean(row.company_name) || clean(row.gc_name) || "-",
    owner_name: row.owner_full_name,
    owner_phone: row.owner_phone,
    owner_email: row.owner_email,
    owner_place_of_birth: row.owner_place_of_birth,
    owner_date_of_birth: row.owner_date_of_birth,
  };
}

function classify(
  currentIdentity: OwnerIdentityValues,
  candidates: OwnerIdentityGcCandidate[],
): Pick<OwnerIdentityScanRow, "action" | "uniqueIdentityCount" | "candidateIdentity"> {
  const validCandidates = candidates.filter(hasOwnerIdentity);
  if (!validCandidates.length) {
    return { action: "no_data", uniqueIdentityCount: 0 };
  }
  const unique = new Map<string, OwnerIdentityGcCandidate>();
  validCandidates.forEach((candidate) => {
    const signature = ownerIdentitySignature(candidate);
    if (!unique.has(signature)) unique.set(signature, candidate);
  });
  if (unique.size > 1) {
    return { action: "need_review", uniqueIdentityCount: unique.size };
  }
  const candidateIdentity = Array.from(unique.values())[0];
  if (ownerIdentitySignature(currentIdentity) === ownerIdentitySignature(candidateIdentity)) {
    return { action: "already_same", uniqueIdentityCount: 1, candidateIdentity };
  }
  if (hasOwnerIdentity(currentIdentity)) {
    return { action: "gp_different", uniqueIdentityCount: 1, candidateIdentity };
  }
  return { action: "ready", uniqueIdentityCount: 1, candidateIdentity };
}

export function summarizeOwnerIdentityRows(
  rows: OwnerIdentityScanRow[],
): OwnerIdentityScanResult {
  return {
    scannedAt: new Date().toISOString(),
    rows,
    total: rows.length,
    ready: rows.filter((row) => row.action === "ready").length,
    needReview: rows.filter((row) => row.action === "need_review").length,
    noData: rows.filter((row) => row.action === "no_data").length,
    alreadySame: rows.filter((row) => row.action === "already_same").length,
    gpDifferent: rows.filter((row) => row.action === "gp_different").length,
  };
}

async function fetchRows(token: string): Promise<{
  groupParents: GroupParentRow[];
  groupCustomers: GroupCustomerRow[];
}> {
  const [groupParents, groupCustomers] = await Promise.all([
    fetchAllQueryRows<GroupParentRow>({
      endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
      spec: {
        // Use the resource's existing field set. Some deployments do not
        // expose every optional owner field through an explicit query list.
        fields: ["*"],
        limit: 100,
      },
      token,
      errorMessage: "Gagal mengambil Group Parent untuk owner identity checker",
    }),
    fetchAllQueryRows<GroupCustomerRow>({
      endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
      spec: {
        fields: [
          "id",
          "name",
          "gc_name",
          "company_name",
          "gpid",
          "owner_full_name",
          "owner_phone",
          "owner_email",
          "owner_place_of_birth",
          "owner_date_of_birth",
        ],
        limit: 100,
      },
      token,
      errorMessage: "Gagal mengambil Group Customer",
    }),
  ]);
  return { groupParents, groupCustomers };
}

export async function scanOwnerIdentities({
  token,
  roleName,
}: {
  token: string;
  roleName?: string | null;
}): Promise<OwnerIdentityScanResult> {
  assertAdministrator(roleName);
  const { groupParents, groupCustomers } = await fetchRows(token);
  const candidatesByGp = new Map<number, OwnerIdentityGcCandidate[]>();
  groupCustomers.forEach((gc) => {
    const gpId = toNumber(gc.gpid);
    if (!gpId) return;
    const candidates = candidatesByGp.get(gpId) || [];
    candidates.push(candidateFromGc(gc));
    candidatesByGp.set(gpId, candidates);
  });

  return summarizeOwnerIdentityRows(
    groupParents.map((gp) => {
      const gpId = toNumber(gp.id);
      const currentIdentity = identityFromGp(gp);
      const candidates = candidatesByGp.get(gpId) || [];
      return {
        gpId,
        gpCode: clean(gp.name) || `GP${gp.id}`,
        gpName: clean(gp.gp_name) || "-",
        currentIdentity,
        candidates,
        ...classify(currentIdentity, candidates),
      };
    }),
  );
}

async function scanOneGp(
  gpId: number,
  token: string,
): Promise<OwnerIdentityScanRow | null> {
  const [gpResponse, candidates] = await Promise.all([
    apiFetch(getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpId), { method: "GET", cache: "no-store" }, token),
    fetchAllQueryRows<GroupCustomerRow>({
      endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
      spec: {
        fields: ["id", "name", "gc_name", "company_name", "gpid", "owner_full_name", "owner_phone", "owner_email", "owner_place_of_birth", "owner_date_of_birth"],
        filters: [["gpid", "=", gpId]],
        limit: 100,
      },
      token,
      errorMessage: `Gagal mengecek ulang GC untuk GP ${gpId}`,
    }),
  ]);
  if (!gpResponse.ok) throw new Error(`Gagal mengecek ulang Group Parent (${gpResponse.status})`);
  const json = await gpResponse.json();
  const gp: GroupParentRow | undefined = Array.isArray(json?.data) ? json.data[0] : json?.data;
  if (!gp) return null;
  const currentIdentity = identityFromGp(gp);
  const mappedCandidates = candidates.map(candidateFromGc);
  return {
    gpId,
    gpCode: clean(gp.name) || `GP${gpId}`,
    gpName: clean(gp.gp_name) || "-",
    currentIdentity,
    candidates: mappedCandidates,
    ...classify(currentIdentity, mappedCandidates),
  };
}

function updatePayload(identity: OwnerIdentityValues): Record<string, string | null> {
  const date = normalize("owner_date_of_birth", identity.owner_date_of_birth);
  const ownerName = clean(identity.owner_name) || null;
  return {
    // Both API resources use owner_full_name. owner_name is only the
    // normalized frontend property used by the GroupParent type.
    owner_full_name: ownerName,
    owner_phone: clean(identity.owner_phone) || null,
    owner_email: clean(identity.owner_email) || null,
    owner_place_of_birth: clean(identity.owner_place_of_birth) || null,
    // group_parent.owner_date_of_birth is a SQL DATE column.
    owner_date_of_birth: date || null,
  };
}

async function responseErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const json = (await response.json().catch(() => null)) as
    | { message?: unknown; error?: unknown }
    | null;
  if (typeof json?.message === "string" && json.message.trim()) {
    return json.message;
  }
  if (typeof json?.error === "string" && json.error.trim()) {
    return json.error;
  }
  return fallback;
}

class SystemicOwnerIdentitySyncError extends Error {}

export async function syncReadyOwnerIdentities({
  token,
  roleName,
  scanResult,
  onProgress,
}: {
  token: string;
  roleName?: string | null;
  scanResult: OwnerIdentityScanResult;
  onProgress?: (progress: OwnerIdentitySyncProgress) => void;
}): Promise<OwnerIdentitySyncResult> {
  assertAdministrator(roleName);
  const readyRows = scanResult.rows.filter((row) => row.action === "ready");
  const result: OwnerIdentitySyncResult = {
    updated: 0,
    alreadySame: 0,
    skippedReview: 0,
    failed: [],
    updatedGpIds: [],
    alreadySameGpIds: [],
  };

  for (let index = 0; index < readyRows.length; index += 1) {
    const original = readyRows[index];
    onProgress?.({ completed: index, total: readyRows.length, label: `Memproses ${original.gpCode}` });
    try {
      const current = await scanOneGp(original.gpId, token);
      if (!current) throw new Error("Group Parent tidak ditemukan");
      if (current.action === "already_same") {
        result.alreadySame += 1;
        result.alreadySameGpIds.push(current.gpId);
        continue;
      }
      if (current.action !== "ready" || !current.candidateIdentity) {
        result.skippedReview += 1;
        continue;
      }
      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, current.gpId),
        { method: "PUT", cache: "no-store", body: JSON.stringify(updatePayload(current.candidateIdentity)) },
        token,
      );
      if (!response.ok) {
        const message = await responseErrorMessage(
          response,
          `Gagal memperbarui Group Parent (${response.status})`,
        );
        if (response.status >= 500) {
          throw new SystemicOwnerIdentitySyncError(
            `${current.gpCode}: ${message}. Proses dihentikan agar tidak mengulangi error server pada GP lainnya.`,
          );
        }
        throw new Error(message);
      }
      result.updated += 1;
      result.updatedGpIds.push(current.gpId);
    } catch (error) {
      if (error instanceof SystemicOwnerIdentitySyncError) throw error;
      result.failed.push({
        gpId: original.gpId,
        gpCode: original.gpCode,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
  onProgress?.({ completed: readyRows.length, total: readyRows.length, label: "Proses selesai" });
  return result;
}
