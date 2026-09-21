"use client";

import {
  API_CONFIG,
  apiFetch,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

export type MissingCustomerContactType = "group_customer" | "branch_customer";
export type MissingCustomerContactAction =
  | "link_existing"
  | "create_new"
  | "missing_data";

export type MissingCustomerContactRow = {
  customerType: MissingCustomerContactType;
  parentId: number;
  code: string;
  customerName: string;
  contactName: string;
  phone: string;
  normalizedPhone: string;
  action: MissingCustomerContactAction;
  existingContactId?: number;
};

export type CustomerContactScanResult = {
  scannedAt: string;
  otherPositionId: number;
  groupCustomers: MissingCustomerContactRow[];
  branchCustomers: MissingCustomerContactRow[];
};

export type CustomerContactGenerationProgress = {
  completed: number;
  total: number;
  label: string;
};

export type CustomerContactGenerationFailure = {
  customerType: MissingCustomerContactType;
  parentId: number;
  code: string;
  message: string;
};

export type CustomerContactGenerationResult = {
  linkedExistingContact: number;
  createdContactAndLinked: number;
  skippedExistingRelation: number;
  skippedMissingData: number;
  failed: CustomerContactGenerationFailure[];
};

type IdValue = number | string | { id?: number | string } | null;

type GroupCustomerRow = {
  id: number | string;
  name?: string | null;
  gc_name?: string | null;
  owner_full_name?: string | null;
  owner_phone?: string | null;
};

type BranchCustomerRow = {
  id: number | string;
  name?: string | null;
  gcid?:
    | number
    | string
    | { id?: number | string; name?: string; gc_name?: string }
    | null;
  "gcid.gc_name"?: string | null;
  branch_owner?: string | null;
  branch_owner_phone?: string | null;
};

type CustomerContactRow = {
  id: number | string;
  parent_id?: number | string | null;
  parent_type?: string | null;
};

type ContactIdentityRow = {
  id: number | string;
  contact_id?: IdValue;
  channel?: string | null;
  handle?: string | null;
};

type ContactRow = {
  id: number | string;
};

type CustomerPositionRow = {
  id: number | string;
  position_name?: string | null;
  disabled?: number | string | null;
};

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

export function normalizeCustomerContactPhone(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("0062")) digits = digits.slice(2);
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

function relationKey(parentType: string, parentId: number): string {
  return `${parentType.trim().toLowerCase()}:${parentId}`;
}

function getResponseId(json: unknown): number {
  if (!json || typeof json !== "object") return 0;
  const data = (json as { data?: unknown }).data;
  if (!data || typeof data !== "object") return 0;
  return toNumber((data as { id?: unknown }).id);
}

async function postResource(
  endpoint: string,
  payload: Record<string, unknown>,
  token: string,
  errorMessage: string,
): Promise<Record<string, unknown>> {
  const response = await apiFetch(
    getResourceUrl(endpoint),
    {
      method: "POST",
      body: JSON.stringify(payload),
      cache: "no-store",
    },
    token,
  );
  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const message = typeof json.message === "string" ? json.message : errorMessage;
    throw new Error(`${message} (${response.status})`);
  }
  return json;
}

async function fetchGenerationLookups(token: string) {
  const [identities, contacts, positions] = await Promise.all([
    fetchAllQueryRows<ContactIdentityRow>({
      endpoint: API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES,
      spec: {
        fields: ["id", "contact_id", "channel", "handle"],
        filters: [["channel", "=", "whatsapp"]],
        limit: 100,
      },
      token,
      errorMessage: "Gagal mengambil contact identities",
    }),
    fetchAllQueryRows<ContactRow>({
      endpoint: API_CONFIG.ENDPOINTS.CONTACT,
      spec: { fields: ["id"], limit: 100 },
      token,
      errorMessage: "Gagal mengambil contact",
    }),
    fetchAllQueryRows<CustomerPositionRow>({
      endpoint: API_CONFIG.ENDPOINTS.CUSTOMER_POSITION,
      spec: {
        fields: ["id", "position_name", "disabled"],
        filters: [["position_name", "=", "Other"]],
        limit: 20,
      },
      token,
      errorMessage: "Gagal mengambil customer position Other",
    }),
  ]);

  const contactIds = new Set(contacts.map((row) => toNumber(row.id)).filter(Boolean));
  const identityByPhone = new Map<string, number>();
  identities.forEach((identity) => {
    if (identity.channel?.trim().toLowerCase() !== "whatsapp") return;
    const phone = normalizeCustomerContactPhone(identity.handle || "");
    const contactId = toNumber(identity.contact_id);
    if (phone && contactId && contactIds.has(contactId) && !identityByPhone.has(phone)) {
      identityByPhone.set(phone, contactId);
    }
  });

  const otherPosition = positions.find(
    (position) =>
      position.position_name?.trim().toLowerCase() === "other" &&
      Number(position.disabled || 0) !== 1,
  );
  const otherPositionId = toNumber(otherPosition?.id);
  if (!otherPositionId) {
    throw new Error('Customer position aktif dengan nama "Other" tidak ditemukan.');
  }

  return { contactIds, identityByPhone, otherPositionId };
}

function buildMissingRow(
  customerType: MissingCustomerContactType,
  parentId: number,
  code: string | null | undefined,
  customerName: string | null | undefined,
  contactName: string | null | undefined,
  phone: string | null | undefined,
  identityByPhone: Map<string, number>,
): MissingCustomerContactRow {
  const cleanName = contactName?.trim() || "";
  const cleanPhone = phone?.trim() || "";
  const normalizedPhone = normalizeCustomerContactPhone(cleanPhone);
  const existingContactId = normalizedPhone
    ? identityByPhone.get(normalizedPhone)
    : undefined;
  const action: MissingCustomerContactAction =
    !cleanName || !normalizedPhone
      ? "missing_data"
      : existingContactId
        ? "link_existing"
        : "create_new";

  return {
    customerType,
    parentId,
    code: code?.trim() || `${customerType === "group_customer" ? "GC" : "BC"}${parentId}`,
    customerName: customerName?.trim() || "-",
    contactName: cleanName,
    phone: cleanPhone,
    normalizedPhone,
    action,
    existingContactId,
  };
}

export async function scanMissingCustomerContacts({
  token,
  roleName,
}: {
  token: string;
  roleName: string | null | undefined;
}): Promise<CustomerContactScanResult> {
  assertAdministrator(roleName);

  const [groupCustomers, branchCustomers, relations, lookups] = await Promise.all([
    fetchAllQueryRows<GroupCustomerRow>({
      endpoint: API_CONFIG.ENDPOINTS.GROUP_CUSTOMER,
      spec: {
        fields: ["id", "name", "gc_name", "owner_full_name", "owner_phone"],
        limit: 100,
      },
      token,
      errorMessage: "Gagal mengambil group customer",
    }),
    fetchAllQueryRows<BranchCustomerRow>({
      endpoint: API_CONFIG.ENDPOINTS.BRANCH_CUSTOMER_V2,
      spec: {
        fields: [
          "id",
          "name",
          "gcid",
          "gcid.gc_name",
          "branch_owner",
          "branch_owner_phone",
        ],
        limit: 100,
      },
      token,
      errorMessage: "Gagal mengambil branch customer",
    }),
    fetchAllQueryRows<CustomerContactRow>({
      endpoint: API_CONFIG.ENDPOINTS.CUSTOMER_CONTACT,
      spec: {
        fields: ["id", "parent_id", "parent_type"],
        filters: [
          ["parent_type", "in", ["group_customer", "branch_customer"]],
        ],
        limit: 100,
      },
      token,
      errorMessage: "Gagal mengambil customer contact",
    }),
    fetchGenerationLookups(token),
  ]);

  const relatedParents = new Set(
    relations
      .map((relation) =>
        relationKey(relation.parent_type || "", toNumber(relation.parent_id)),
      )
      .filter((key) => !key.endsWith(":0")),
  );

  const missingGroups = groupCustomers
    .map((row) => ({ row, id: toNumber(row.id) }))
    .filter(({ id }) => id && !relatedParents.has(relationKey("group_customer", id)))
    .map(({ row, id }) =>
      buildMissingRow(
        "group_customer",
        id,
        row.name,
        row.gc_name,
        row.owner_full_name,
        row.owner_phone,
        lookups.identityByPhone,
      ),
    );

  const missingBranches = branchCustomers
    .map((row) => ({ row, id: toNumber(row.id) }))
    .filter(({ id }) => id && !relatedParents.has(relationKey("branch_customer", id)))
    .map(({ row, id }) => {
      const gcName =
        row["gcid.gc_name"] ||
        (row.gcid && typeof row.gcid === "object" ? row.gcid.gc_name : undefined);
      return buildMissingRow(
        "branch_customer",
        id,
        row.name,
        gcName || row.name,
        row.branch_owner,
        row.branch_owner_phone,
        lookups.identityByPhone,
      );
    });

  return {
    scannedAt: new Date().toISOString(),
    otherPositionId: lookups.otherPositionId,
    groupCustomers: missingGroups,
    branchCustomers: missingBranches,
  };
}

async function hasCustomerContactRelation(
  row: MissingCustomerContactRow,
  token: string,
): Promise<boolean> {
  const response = await apiFetch(
    getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CONTACT, {
      fields: ["id"],
      filters: [
        ["parent_type", "=", row.customerType],
        ["parent_id", "=", row.parentId],
      ],
      limit: 1,
    }),
    { method: "GET", cache: "no-store" },
    token,
  );
  if (!response.ok) {
    throw new Error(`Gagal mengecek ulang customer contact (${response.status})`);
  }
  const json = await response.json().catch(() => ({}));
  return Array.isArray(json?.data) && json.data.length > 0;
}

export async function generateMissingCustomerContacts({
  token,
  roleName,
  scanResult,
  onProgress,
}: {
  token: string;
  roleName: string | null | undefined;
  scanResult: CustomerContactScanResult;
  onProgress?: (progress: CustomerContactGenerationProgress) => void;
}): Promise<CustomerContactGenerationResult> {
  assertAdministrator(roleName);
  const rows = [...scanResult.groupCustomers, ...scanResult.branchCustomers];
  const result: CustomerContactGenerationResult = {
    linkedExistingContact: 0,
    createdContactAndLinked: 0,
    skippedExistingRelation: 0,
    skippedMissingData: 0,
    failed: [],
  };
  const lookups = await fetchGenerationLookups(token);

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    onProgress?.({
      completed: index,
      total: rows.length,
      label: `Memproses ${row.code}`,
    });

    if (!row.contactName || !row.normalizedPhone) {
      result.skippedMissingData += 1;
      continue;
    }

    try {
      if (await hasCustomerContactRelation(row, token)) {
        result.skippedExistingRelation += 1;
        continue;
      }

      let contactId = lookups.identityByPhone.get(row.normalizedPhone) || 0;
      let createdContact = false;

      if (!contactId || !lookups.contactIds.has(contactId)) {
        const contactJson = await postResource(
          API_CONFIG.ENDPOINTS.CONTACT,
          {
            full_name: row.contactName,
            display_name: row.contactName,
          },
          token,
          `Gagal membuat contact ${row.contactName}`,
        );
        contactId = getResponseId(contactJson);
        if (!contactId) throw new Error("ID contact baru tidak ditemukan pada response.");

        await postResource(
          API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES,
          {
            contact_id: contactId,
            handle: row.normalizedPhone,
            channel: "whatsapp",
          },
          token,
          `Gagal membuat contact identity ${row.normalizedPhone}`,
        );
        lookups.contactIds.add(contactId);
        lookups.identityByPhone.set(row.normalizedPhone, contactId);
        createdContact = true;
      }

      await postResource(
        API_CONFIG.ENDPOINTS.CUSTOMER_CONTACT,
        {
          parent_type: row.customerType,
          parent_id: row.parentId,
          contact_id: contactId,
          position_id: lookups.otherPositionId,
          title: "whatsapp",
          is_primary: 0,
          parent_field: "customer_contact",
          idx: 1,
        },
        token,
        `Gagal menghubungkan contact ke ${row.code}`,
      );

      if (createdContact) result.createdContactAndLinked += 1;
      else result.linkedExistingContact += 1;
    } catch (error) {
      result.failed.push({
        customerType: row.customerType,
        parentId: row.parentId,
        code: row.code,
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
