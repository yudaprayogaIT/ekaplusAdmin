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
  for (let rowNumber = 2; rowNumber <= worksheet.actualRowCount; rowNumber += 1) {
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

function buildCustomerSummary(sourceRows: Map<string, DataRow[]>): unknown[][] {
  const nationalBrands = createLookup(sourceRows.get("national_brand") || []);
  const groupParents = createLookup(sourceRows.get("group_parent") || []);
  const groupCustomers = createLookup(sourceRows.get("group_customer") || []);
  const branches = createLookup(sourceRows.get("branch") || []);
  const addressesByBc = new Map<string, DataRow>();

  (sourceRows.get("customer_address") || []).forEach((address) => {
    if (Number(address.idx) !== 1) return;
    const parentKey = asKey(address.parent_id);
    if (parentKey && !addressesByBc.has(parentKey)) {
      addressesByBc.set(parentKey, address);
    }
  });

  return (sourceRows.get("branch_customer") || []).map((branchCustomer) => {
    const groupCustomer = findLinkedRow(groupCustomers, branchCustomer.gcid);
    const groupParent = findLinkedRow(groupParents, groupCustomer?.gpid);
    const nationalBrand = findLinkedRow(nationalBrands, groupParent?.nbid);
    const branch = findLinkedRow(branches, branchCustomer.branch);
    const address = addressesByBc.get(asKey(branchCustomer.id) || "");

    return [
      valueOrNull(firstValue(groupCustomer?.gc_name, branchCustomer.customer_name)),
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
      valueOrNull(firstValue(branchCustomer.limit, branchCustomer.credit_limit)),
      valueOrNull(firstValue(branchCustomer.top, branchCustomer.payment_term)),
      valueOrNull(address?.address),
      valueOrNull(address?.province),
      valueOrNull(address?.city),
      valueOrNull(address?.district),
      valueOrNull(address?.village),
    ];
  });
}

function styleWorksheet(worksheet: Worksheet, preferredWidths?: number[]): void {
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
    "limit",
    "TOP",
    "address",
    "province",
    "city",
    "district",
    "village",
  ]);
  summary.addRows(buildCustomerSummary(sourceRows));
  styleWorksheet(
    summary,
    [28, 18, 14, 18, 14, 14, 28, 14, 28, 14, 28, 18, 12, 42, 18, 18, 20, 20],
  );
  summary.getColumn(12).numFmt = "#,##0";
  summary.getColumn(13).numFmt = "0";
  summary.getColumn(5).numFmt = "@";
  summary.getColumn(6).numFmt = "@";
  summary.getColumn(8).numFmt = "@";
  summary.getColumn(10).numFmt = "@";

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
  link.download = `customer_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
