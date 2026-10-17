"use client";

import {
  API_CONFIG,
  apiFetch,
  getResourceUrl,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

export type IdentityAttachmentScanAction =
  | "ready"
  | "already_synced"
  | "conflict"
  | "missing_group_parent";

export interface IdentityAttachmentScanRow {
  customerRegisterId: number;
  customerRegisterCode: string;
  customerRegisterName?: string;
  gpid: number | null;
  gpCode?: string;
  gpName?: string;
  customerRegisterAttachment: string;
  groupParentAttachment?: string | null;
  action: IdentityAttachmentScanAction;
}

export interface IdentityAttachmentScanResult {
  scannedAt: string;
  rows: IdentityAttachmentScanRow[];
  total: number;
  ready: number;
  alreadySynced: number;
  conflict: number;
  missingGroupParent: number;
}

export interface IdentityAttachmentSyncProgress {
  completed: number;
  total: number;
  label: string;
}

export interface IdentityAttachmentSyncFailure {
  customerRegisterId: number;
  customerRegisterCode: string;
  gpid?: number;
  message: string;
}

export type IdentityAttachmentConflictResolution =
  | "keep_existing"
  | "use_register";

export type IdentityAttachmentConflictResolutions = Record<
  number,
  IdentityAttachmentConflictResolution
>;

export interface IdentityAttachmentSyncResult {
  updated: number;
  overwritten: number;
  keptExisting: number;
  alreadySynced: number;
  conflict: number;
  skippedMissingGroupParent: number;
  failed: IdentityAttachmentSyncFailure[];
}

type LinkValue = number | string | { id?: number | string } | null;

interface CustomerRegisterRow {
  id: number | string;
  name?: string | null;
  company_name?: string | null;
  gpid?: LinkValue;
  identity_attachment?: string | null;
}

interface GroupParentRow {
  id: number | string;
  name?: string | null;
  gp_name?: string | null;
  identity_attachment?: string | null;
}

function assertAdministrator(roleName: string | null | undefined): void {
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

export function normalizeIdentityAttachment(
  value?: string | null,
): string | null {
  return value?.trim() || null;
}

function getAction(
  sourceAttachment: string,
  groupParent: GroupParentRow | undefined,
): IdentityAttachmentScanAction {
  if (!groupParent) return "missing_group_parent";
  const targetAttachment = normalizeIdentityAttachment(
    groupParent.identity_attachment,
  );
  if (!targetAttachment) return "ready";
  return targetAttachment === sourceAttachment ? "already_synced" : "conflict";
}

function summarizeRows(
  rows: IdentityAttachmentScanRow[],
): IdentityAttachmentScanResult {
  return {
    scannedAt: new Date().toISOString(),
    rows,
    total: rows.length,
    ready: rows.filter((row) => row.action === "ready").length,
    alreadySynced: rows.filter((row) => row.action === "already_synced").length,
    conflict: rows.filter((row) => row.action === "conflict").length,
    missingGroupParent: rows.filter(
      (row) => row.action === "missing_group_parent",
    ).length,
  };
}

export async function scanCustomerRegisterIdentityAttachments({
  token,
  roleName,
}: {
  token: string;
  roleName: string | null | undefined;
}): Promise<IdentityAttachmentScanResult> {
  assertAdministrator(roleName);

  const registrations = await fetchAllQueryRows<CustomerRegisterRow>({
    endpoint: API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER,
    spec: {
      fields: ["id", "name", "company_name", "gpid", "identity_attachment"],
      limit: 100,
    },
    token,
    errorMessage: "Gagal mengambil customer register",
  });

  const withAttachments = registrations
    .map((registration) => ({
      registration,
      attachment: normalizeIdentityAttachment(
        registration.identity_attachment,
      ),
      gpid: toNumber(registration.gpid),
    }))
    .filter(
      (item): item is typeof item & { attachment: string } =>
        item.attachment !== null,
    );
  const gpIds = Array.from(
    new Set(withAttachments.map((item) => item.gpid).filter(Boolean)),
  );
  const groupParents = gpIds.length
    ? await fetchAllQueryRows<GroupParentRow>({
        endpoint: API_CONFIG.ENDPOINTS.GROUP_PARENT,
        spec: {
          fields: ["id", "name", "gp_name", "identity_attachment"],
          filters: [["id", "in", gpIds]],
          limit: 100,
        },
        token,
        errorMessage: "Gagal mengambil group parent",
      })
    : [];
  const groupParentById = new Map(
    groupParents.map((groupParent) => [toNumber(groupParent.id), groupParent]),
  );

  const rows = withAttachments.map(
    ({ registration, attachment, gpid }): IdentityAttachmentScanRow => {
      const groupParent = gpid ? groupParentById.get(gpid) : undefined;
      return {
        customerRegisterId: toNumber(registration.id),
        customerRegisterCode:
          registration.name?.trim() || `CR${registration.id}`,
        customerRegisterName: registration.company_name?.trim() || undefined,
        gpid: gpid || null,
        gpCode: groupParent?.name?.trim() || undefined,
        gpName: groupParent?.gp_name?.trim() || undefined,
        customerRegisterAttachment: attachment,
        groupParentAttachment: normalizeIdentityAttachment(
          groupParent?.identity_attachment,
        ),
        action: getAction(attachment, groupParent),
      };
    },
  );

  return summarizeRows(rows);
}

function responseMessage(json: unknown, fallback: string): string {
  if (json && typeof json === "object" && "message" in json) {
    const message = (json as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

async function fetchGroupParent(
  gpid: number,
  token: string,
): Promise<GroupParentRow | null> {
  const response = await apiFetch(
    getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, gpid),
    { method: "GET", cache: "no-store" },
    token,
  );
  const json = (await response.json().catch(() => ({}))) as {
    data?: GroupParentRow | GroupParentRow[];
    message?: string;
  };
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(
      responseMessage(json, `Gagal mengecek ulang Group Parent (${response.status})`),
    );
  }
  if (Array.isArray(json.data)) return json.data[0] || null;
  return json.data || null;
}

export async function syncCustomerRegisterIdentityAttachments({
  token,
  roleName,
  scanResult,
  conflictResolutions = {},
  onProgress,
}: {
  token: string;
  roleName: string | null | undefined;
  scanResult: IdentityAttachmentScanResult;
  conflictResolutions?: IdentityAttachmentConflictResolutions;
  onProgress?: (progress: IdentityAttachmentSyncProgress) => void;
}): Promise<IdentityAttachmentSyncResult> {
  assertAdministrator(roleName);
  const overwriteAttachmentByGp = new Map<number, string>();
  const invalidOverwriteGpIds = new Set<number>();
  scanResult.rows.forEach((row) => {
    if (
      row.action !== "conflict" ||
      !row.gpid ||
      conflictResolutions[row.customerRegisterId] !== "use_register"
    ) {
      return;
    }
    const selectedAttachment = overwriteAttachmentByGp.get(row.gpid);
    if (
      selectedAttachment &&
      selectedAttachment !== row.customerRegisterAttachment
    ) {
      invalidOverwriteGpIds.add(row.gpid);
      return;
    }
    overwriteAttachmentByGp.set(row.gpid, row.customerRegisterAttachment);
  });

  const rows = scanResult.rows.filter(
    (row) =>
      row.action === "ready" ||
      (row.action === "conflict" &&
        Boolean(conflictResolutions[row.customerRegisterId])),
  );
  const result: IdentityAttachmentSyncResult = {
    updated: 0,
    overwritten: 0,
    keptExisting: 0,
    alreadySynced: 0,
    conflict: scanResult.rows.filter(
      (row) =>
        row.action === "conflict" &&
        !conflictResolutions[row.customerRegisterId],
    ).length,
    skippedMissingGroupParent: 0,
    failed: [],
  };

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    onProgress?.({
      completed: index,
      total: rows.length,
      label: `Memproses ${row.customerRegisterCode}`,
    });

    if (!row.gpid) {
      result.skippedMissingGroupParent += 1;
      continue;
    }

    if (
      row.action === "conflict" &&
      conflictResolutions[row.customerRegisterId] === "use_register" &&
      invalidOverwriteGpIds.has(row.gpid)
    ) {
      result.failed.push({
        customerRegisterId: row.customerRegisterId,
        customerRegisterCode: row.customerRegisterCode,
        gpid: row.gpid,
        message: `${row.gpCode || `GP${row.gpid}`} dipilih untuk ditimpa oleh lebih dari satu attachment Register. Pilih hanya satu attachment pemenang.`,
      });
      continue;
    }

    try {
      const currentGroupParent = await fetchGroupParent(row.gpid, token);
      if (!currentGroupParent) {
        result.skippedMissingGroupParent += 1;
        continue;
      }

      const currentAttachment = normalizeIdentityAttachment(
        currentGroupParent.identity_attachment,
      );
      const resolution = conflictResolutions[row.customerRegisterId];
      if (currentAttachment === row.customerRegisterAttachment) {
        result.alreadySynced += 1;
        continue;
      }

      if (row.action === "conflict" && resolution === "keep_existing") {
        result.keptExisting += 1;
        continue;
      }

      const overwriteAuthorized =
        row.action === "conflict" && resolution === "use_register";
      if (currentAttachment && !overwriteAuthorized) {
        result.conflict += 1;
        continue;
      }

      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.GROUP_PARENT, row.gpid),
        {
          method: "PUT",
          body: JSON.stringify({
            identity_attachment: row.customerRegisterAttachment,
          }),
          cache: "no-store",
        },
        token,
      );
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          responseMessage(
            json,
            `Gagal memperbarui Group Parent (${response.status})`,
          ),
        );
      }
      if (currentAttachment && overwriteAuthorized) result.overwritten += 1;
      else result.updated += 1;
    } catch (error) {
      result.failed.push({
        customerRegisterId: row.customerRegisterId,
        customerRegisterCode: row.customerRegisterCode,
        gpid: row.gpid,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  onProgress?.({
    completed: rows.length,
    total: rows.length,
    label: "Proses selesai",
  });
  return result;
}
