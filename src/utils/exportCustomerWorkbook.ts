"use client";

import type { CellValue, Worksheet } from "exceljs";
import { apiFetch, getApiUrl } from "@/config/api";

const NULL_VALUE = "null";

const EXPORT_SOURCES = [
  { resource: "national_brand", sheetName: "national_brand" },
  { resource: "group_parent", sheetName: "group_parent" },
  { resource: "group_customer", sheetName: "group_customer" },
  { resource: "branch_customer", sheetName: "branch_customer" },
  { resource: "customer_address", sheetName: "customer_address" },
  { resource: "branch", sheetName: "branch" },
] as const;

type ExportSource = (typeof EXPORT_SOURCES)[number];
type DataRow = Record<string, unknown>;

export type CustomerExportProgress = {
  completed: number;
  total: number;
  label: string;
};

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function getCellPrimitive(value: CellValue): unknown {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value !== "object") return value;

  if ("result" in value) return value.result ?? null;
  if ("richText" in value) {
    return value.richText.map((part) => part.text).join("");
  }
  if ("text" in value) return value.text;

  return String(value);
}

function worksheetToRows(worksheet: Worksheet): DataRow[] {
  const headers: string[] = [];
  worksheet.getRow(1).eachCell({ includeEmpty: true }, (cell, column) => {
    headers[column] = normalizeHeader(cell.text || `column_${column}`);
  });

  const rows: DataRow[] = [];
  for (
    let rowNumber = 2;
    rowNumber <= worksheet.actualRowCount;
    rowNumber += 1
  ) {
    const worksheetRow = worksheet.getRow(rowNumber);
    const row: DataRow = {};
    let hasValue = false;

    headers.forEach((header, column) => {
      if (!header || column === 0) return;
      const value = getCellPrimitive(worksheetRow.getCell(column).value);
      row[header] = value;
      if (value !== null && value !== "") hasValue = true;
    });

    if (hasValue) rows.push(row);
  }

  return rows;
}

function asKey(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.trim() || null;
  return String(value).trim() || null;
}

function addLookupKeys(map: Map<string, DataRow>, row: DataRow): void {
  [row.id, row.name].forEach((value) => {
    const key = asKey(value);
    if (key) map.set(key, row);
  });
}

function createLookup(rows: DataRow[]): Map<string, DataRow> {
  const lookup = new Map<string, DataRow>();
  rows.forEach((row) => addLookupKeys(lookup, row));
  return lookup;
}

function findLinkedRow(
  lookup: Map<string, DataRow>,
  value: unknown,
): DataRow | undefined {
  const key = asKey(value);
  return key ? lookup.get(key) : undefined;
}

function valueOrNull(value: unknown): unknown {
  return value === null || value === undefined || value === ""
    ? NULL_VALUE
    : value;
}

function firstValue(...values: unknown[]): unknown {
  return values.find(
    (value) => value !== null && value !== undefined && value !== "",
  );
}

function isActiveFlag(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value !== "string") return false;
  return ["1", "true", "yes", "active", "aktif"].includes(
    value.trim().toLowerCase(),
  );
}

function hasValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== "";
}

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

function formatReadableDate(value: unknown): unknown {
  if (!hasValue(value)) return null;

  let year: number | undefined;
  let month: number | undefined;
  let day: number | undefined;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    year = value.getUTCFullYear();
    month = value.getUTCMonth() + 1;
    day = value.getUTCDate();
  } else if (typeof value === "string") {
    const normalized = value.trim();
    const yearFirst = normalized.match(/^(\d{4})[-/]([01]?\d)[-/]([0-3]?\d)/);
    const dayFirst = normalized.match(/^([0-3]?\d)[-/]([01]?\d)[-/](\d{4})/);

    if (yearFirst) {
      year = Number(yearFirst[1]);
      month = Number(yearFirst[2]);
      day = Number(yearFirst[3]);
    } else if (dayFirst) {
      day = Number(dayFirst[1]);
      month = Number(dayFirst[2]);
      year = Number(dayFirst[3]);
    }
  }

  if (
    !year ||
    !month ||
    !day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return value;
  }

  return `${day} ${INDONESIAN_MONTHS[month - 1]} ${year}`;
}

function resolvePolicyValue(
  groupParent: DataRow | undefined,
  nationalBrand: DataRow | undefined,
  valueField: "credit_limit" | "payment_term",
): { value: unknown; level: "GP" | "NB" | null } {
  const activeField = `${valueField}_active`;
  const gpValue = groupParent?.[valueField];
  const nbValue = nationalBrand?.[valueField];
  const hasActiveMetadata =
    Boolean(groupParent && Object.hasOwn(groupParent, activeField)) ||
    Boolean(nationalBrand && Object.hasOwn(nationalBrand, activeField));

  if (isActiveFlag(groupParent?.[activeField])) {
    return { value: gpValue, level: "GP" };
  }
  if (isActiveFlag(nationalBrand?.[activeField])) {
    return { value: nbValue, level: "NB" };
  }

  if (hasActiveMetadata) return { value: null, level: null };

  // Mendukung export lama yang belum menyertakan penanda *_active.
  if (hasValue(gpValue)) return { value: gpValue, level: "GP" };
  if (hasValue(nbValue)) return { value: nbValue, level: "NB" };
  return { value: null, level: null };
}

function buildCustomerSummary(sourceRows: Map<string, DataRow[]>): unknown[][] {
  const nationalBrands = createLookup(sourceRows.get("national_brand") || []);
  const groupParents = createLookup(sourceRows.get("group_parent") || []);
  const groupCustomers = createLookup(sourceRows.get("group_customer") || []);
  const branches = createLookup(sourceRows.get("branch") || []);
  const officeAddressesByBc = new Map<string, DataRow>();
  const shippingAddressesByBc = new Map<string, DataRow>();

  (sourceRows.get("customer_address") || []).forEach((address) => {
    const addressIndex = Number(address.idx);
    const addressLookup =
      addressIndex === 1
        ? officeAddressesByBc
        : addressIndex === 2
          ? shippingAddressesByBc
          : null;
    if (!addressLookup) return;

    const parentKey = asKey(address.parent_id);
    if (parentKey && !addressLookup.has(parentKey)) {
      addressLookup.set(parentKey, address);
    }
  });

  return (sourceRows.get("branch_customer") || []).map((branchCustomer) => {
    const groupCustomer = findLinkedRow(groupCustomers, branchCustomer.gcid);
    const groupParent = findLinkedRow(groupParents, groupCustomer?.gpid);
    const nationalBrand = findLinkedRow(nationalBrands, groupParent?.nbid);
    const branch = findLinkedRow(branches, branchCustomer.branch);
    const branchCustomerId = asKey(branchCustomer.id) || "";
    const branchCustomerName = asKey(branchCustomer.name) || "";
    const officeAddress =
      officeAddressesByBc.get(branchCustomerId) ||
      officeAddressesByBc.get(branchCustomerName);
    const shippingAddress =
      shippingAddressesByBc.get(branchCustomerId) ||
      shippingAddressesByBc.get(branchCustomerName);
    const creditLimit = resolvePolicyValue(
      groupParent,
      nationalBrand,
      "credit_limit",
    );
    const paymentTerm = resolvePolicyValue(
      groupParent,
      nationalBrand,
      "payment_term",
    );

    return [
      valueOrNull(
        firstValue(groupCustomer?.gc_name, branchCustomer.customer_name),
      ),
      valueOrNull(branch?.city),
      valueOrNull(branchCustomer.status),
      valueOrNull(branchCustomer.sales_team),
      valueOrNull(branchCustomer.name),
      valueOrNull(groupCustomer?.name),
      valueOrNull(groupCustomer?.gc_name),
      valueOrNull(groupParent?.name),
      valueOrNull(groupParent?.gp_name),
      valueOrNull(nationalBrand?.name),
      valueOrNull(nationalBrand?.nb_name),
      valueOrNull(creditLimit.value),
      valueOrNull(creditLimit.level),
      valueOrNull(paymentTerm.value),
      valueOrNull(paymentTerm.level),
      valueOrNull(groupCustomer?.owner_full_name),
      valueOrNull(groupCustomer?.owner_phone),
      valueOrNull(groupCustomer?.owner_place_of_birth),
      valueOrNull(formatReadableDate(groupCustomer?.owner_date_of_birth)),
      valueOrNull(branchCustomer.branch_owner),
      valueOrNull(branchCustomer.branch_owner_phone),
      valueOrNull(branchCustomer.branch_owner_place_of_birth),
      valueOrNull(
        formatReadableDate(branchCustomer.branch_owner_date_of_birth),
      ),
      valueOrNull(officeAddress?.pic_name),
      valueOrNull(officeAddress?.pic_phone),
      valueOrNull(officeAddress?.address),
      valueOrNull(officeAddress?.province),
      valueOrNull(officeAddress?.city),
      valueOrNull(officeAddress?.district),
      valueOrNull(officeAddress?.village),
      valueOrNull(shippingAddress?.pic_name),
      valueOrNull(shippingAddress?.pic_phone),
      valueOrNull(shippingAddress?.address),
      valueOrNull(shippingAddress?.province),
      valueOrNull(shippingAddress?.city),
      valueOrNull(shippingAddress?.district),
      valueOrNull(shippingAddress?.village),
    ];
  });
}

function styleCustomerSummary(worksheet: Worksheet): void {
  const groupHeader = worksheet.getRow(1);
  const columnHeader = worksheet.getRow(2);

  groupHeader.height = 22;
  columnHeader.height = 24;
  columnHeader.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF17365D" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  worksheet.mergeCells("P1:S1");
  worksheet.mergeCells("T1:W1");
  worksheet.mergeCells("X1:AD1");
  worksheet.mergeCells("AE1:AK1");
  worksheet.getCell("P1").value = "Owner Group Customer";
  worksheet.getCell("T1").value = "PIC Branch Customer";
  worksheet.getCell("X1").value = "Alamat Kantor";
  worksheet.getCell("AE1").value = "Alamat Shipping";
  [
    worksheet.getCell("P1"),
    worksheet.getCell("T1"),
    worksheet.getCell("X1"),
    worksheet.getCell("AE1"),
  ].forEach((cell) => {
    cell.font = { bold: true, color: { argb: "FF000000" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  [24, 31].forEach((columnNumber) => {
    for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber += 1) {
      const cell = worksheet.getCell(rowNumber, columnNumber);
      cell.border = {
        ...cell.border,
        left: { style: "medium", color: { argb: "FF17365D" } },
      };
    }
  });

  worksheet.autoFilter = {
    from: { row: 2, column: 1 },
    to: { row: 2, column: worksheet.columnCount },
  };
  worksheet.views = [{ state: "frozen", ySplit: 2 }];

  const preferredWidths = [
    28, 18, 14, 18, 14, 14, 28, 14, 28, 14, 28, 18, 20, 12, 22,
    24, 18, 22, 22,
    24, 18, 22, 22,
    22, 18, 42, 18, 18, 20, 20,
    22, 18, 42, 18, 18, 20, 20,
  ];
  worksheet.columns.forEach((column, index) => {
    column.width = preferredWidths[index] || 12;
  });
}

function styleWorksheet(
  worksheet: Worksheet,
  preferredWidths?: number[],
): void {
  const header = worksheet.getRow(1);
  header.height = 24;
  header.eachCell({ includeEmpty: false }, (cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF17365D" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  if (worksheet.columnCount > 0) {
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columnCount },
    };
  }
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  worksheet.columns.forEach((column, index) => {
    if (preferredWidths?.[index]) {
      column.width = preferredWidths[index];
      return;
    }

    let width = 10;
    column.eachCell?.({ includeEmpty: false }, (cell) => {
      width = Math.max(width, Math.min(cell.text.length + 2, 40));
    });
    column.width = width;
  });
}

async function fetchExportWorkbook(
  source: ExportSource,
  token: string,
): Promise<ArrayBuffer> {
  const endpoint = `${getApiUrl(`/api/resource/${source.resource}/export`)}?`;
  const response = await apiFetch(
    endpoint,
    { method: "POST", cache: "no-store" },
    token,
  );

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil export ${source.sheetName} (${response.status})`,
    );
  }

  return response.arrayBuffer();
}

export async function exportCustomerWorkbook({
  token,
  onProgress,
}: {
  token: string;
  onProgress?: (progress: CustomerExportProgress) => void;
}): Promise<void> {
  const ExcelJS = await import("exceljs");
  const totalSteps = EXPORT_SOURCES.length + 2;
  let completed = 0;

  const exports = await Promise.all(
    EXPORT_SOURCES.map(async (source) => {
      const buffer = await fetchExportWorkbook(source, token);
      completed += 1;
      onProgress?.({
        completed,
        total: totalSteps,
        label: `Mengambil ${source.sheetName}`,
      });
      return { source, buffer };
    }),
  );

  const outputWorkbook = new ExcelJS.Workbook();
  outputWorkbook.creator = "EKAPLUS Admin";
  outputWorkbook.created = new Date();
  const summary = outputWorkbook.addWorksheet("customer_summary");
  const sourceRows = new Map<string, DataRow[]>();

  for (const { source, buffer } of exports) {
    const sourceWorkbook = new ExcelJS.Workbook();
    await sourceWorkbook.xlsx.load(buffer);
    const sourceWorksheet = sourceWorkbook.worksheets[0];
    if (!sourceWorksheet) {
      throw new Error(`File ${source.sheetName} tidak memiliki worksheet`);
    }

    sourceRows.set(source.sheetName, worksheetToRows(sourceWorksheet));
    const targetWorksheet = outputWorkbook.addWorksheet(source.sheetName);
    sourceWorksheet.eachRow({ includeEmpty: false }, (row) => {
      const values: CellValue[] = [];
      row.eachCell({ includeEmpty: true }, (cell, column) => {
        values[column] = cell.value;
      });
      targetWorksheet.addRow(values);
    });
    styleWorksheet(targetWorksheet);
  }

  completed += 1;
  onProgress?.({
    completed,
    total: totalSteps,
    label: "Menyusun customer_summary",
  });

  summary.addRow(new Array(37).fill(""));
  summary.addRow([
    "CUSTOMER",
    "branch",
    "Status",
    "sales team",
    "bcid",
    "gcid",
    "gcname",
    "gpid",
    "gpname",
    "nbid",
    "nbname",
    "credit limit",
    "level credit limit",
    "payment term",
    "level payment term",
    "Owner Name",
    "Owner Phone",
    "Owner Place of Birth",
    "Owner Date of Birth",
    "PIC Name",
    "PIC Phone",
    "PIC Place of Birth",
    "PIC Date of Birth",
    "PIC Name",
    "PIC Phone",
    "address",
    "province",
    "city",
    "district",
    "village",
    "PIC Name",
    "PIC Phone",
    "address",
    "province",
    "city",
    "district",
    "village",
  ]);
  summary.addRows(buildCustomerSummary(sourceRows));
  styleCustomerSummary(summary);
  summary.getColumn(12).numFmt = "#,##0";
  summary.getColumn(14).numFmt = "0";
  summary.getColumn(5).numFmt = "@";
  summary.getColumn(6).numFmt = "@";
  summary.getColumn(8).numFmt = "@";
  summary.getColumn(10).numFmt = "@";
  summary.getColumn(17).numFmt = "@";
  summary.getColumn(21).numFmt = "@";
  summary.getColumn(25).numFmt = "@";
  summary.getColumn(32).numFmt = "@";

  onProgress?.({
    completed: totalSteps,
    total: totalSteps,
    label: "Membuat file Excel",
  });
  const output = await outputWorkbook.xlsx.writeBuffer();
  const bytes = new Uint8Array(output);
  const url = URL.createObjectURL(
    new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `customer_ekaplus_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
