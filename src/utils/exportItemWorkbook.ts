"use client";

import type { CellValue, Worksheet } from "exceljs";
import { apiFetch, getApiUrl } from "@/config/api";

const XLSX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const EXPORT_SPEC = JSON.stringify({ fields: ["*"] });

const EXPORT_SOURCES = [
  { resource: "item", sheetName: "item" },
  { resource: "branch", sheetName: "branch" },
  { resource: "item_branches", sheetName: "item_branches" },
] as const;

const ITEM_OUTPUT_COLUMNS = [
  "id",
  "name",
  "status",
  "disabled",
  "docstatus",
  "item_category",
  "item_subcategory",
  "item_code",
  "item_name",
  "item_group",
  "uom",
  "image",
  "height",
  "length",
  "weight",
  "width",
  "standard_colly_item",
  "ppn_name",
  "uom_ppn",
  "item branches",
  "generator_item",
  "igen_created_by",
  "igen_updated_by",
  "last_item_updater",
] as const;

const ITEM_SOURCE_COLUMNS = new Set(
  ITEM_OUTPUT_COLUMNS.filter((column) => column !== "item branches"),
);

const BRANCH_OUTPUT_COLUMNS = ["id", "name", "city"] as const;
const ITEM_BRANCHES_OUTPUT_COLUMNS = ["id", "branch", "parent_id"] as const;

const OUTPUT_COLUMNS_BY_SHEET: Record<string, readonly string[]> = {
  item: ITEM_OUTPUT_COLUMNS,
  branch: BRANCH_OUTPUT_COLUMNS,
  item_branches: ITEM_BRANCHES_OUTPUT_COLUMNS,
};

const SOURCE_COLUMNS_BY_SHEET: Record<string, ReadonlySet<string>> = {
  item: ITEM_SOURCE_COLUMNS,
  branch: new Set(BRANCH_OUTPUT_COLUMNS),
  item_branches: new Set([
    ...ITEM_BRANCHES_OUTPUT_COLUMNS,
    // Tetap dibaca untuk memfilter tipe relasi, tetapi tidak ditulis ke output.
    "parent_type",
  ]),
};

type ExportSource = (typeof EXPORT_SOURCES)[number];
type PrimitiveCellValue = Exclude<CellValue, object> | Date;
type ExportRow = Record<string, PrimitiveCellValue>;

type ParsedWorksheet = {
  headers: string[];
  normalizedHeaders: string[];
  rows: ExportRow[];
};

export type ItemExportResult = {
  missingBranchRelations: number;
};

export type ItemExportProgress = {
  completed: number;
  total: number;
  label: string;
};

const ROW_BATCH_SIZE = 500;

function yieldToBrowser(): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, 0));
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function normalizeType(value: PrimitiveCellValue): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function asKey(value: PrimitiveCellValue): string | null {
  if (value === null || value === undefined || value === "") return null;
  const key = String(value).trim();
  return key || null;
}

function getCellPrimitive(value: CellValue): PrimitiveCellValue {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value;
  if (typeof value !== "object") return value;

  if ("result" in value) return getCellPrimitive(value.result ?? null);
  if ("richText" in value) {
    return value.richText.map((part) => part.text).join("");
  }
  if ("text" in value) return value.text;
  if ("error" in value) return value.error;

  return String(value);
}

async function parseWorksheet(
  worksheet: Worksheet,
  resourceName: string,
  includedHeaders?: ReadonlySet<string>,
): Promise<ParsedWorksheet> {
  if (worksheet.actualRowCount < 2) {
    throw new Error(`Data export ${resourceName} tidak ditemukan`);
  }

  const headers: string[] = [];
  const normalizedHeaders: string[] = [];
  const seenHeaders = new Set<string>();

  for (let column = 1; column <= worksheet.actualColumnCount; column += 1) {
    const header = worksheet.getRow(1).getCell(column).text.trim();
    if (!header) {
      throw new Error(
        `File ${resourceName} memiliki header kosong pada kolom ${column}`,
      );
    }

    const normalized = normalizeHeader(header);
    if (seenHeaders.has(normalized)) {
      throw new Error(`File ${resourceName} memiliki header duplikat: ${header}`);
    }
    seenHeaders.add(normalized);
    headers.push(header);
    normalizedHeaders.push(normalized);
  }

  const rows: ExportRow[] = [];
  for (
    let rowNumber = 2;
    rowNumber <= worksheet.actualRowCount;
    rowNumber += 1
  ) {
    const sourceRow = worksheet.getRow(rowNumber);
    const row: ExportRow = {};
    let hasValue = false;

    normalizedHeaders.forEach((header, index) => {
      if (includedHeaders && !includedHeaders.has(header)) return;
      const value = getCellPrimitive(sourceRow.getCell(index + 1).value);
      row[header] = value;
      if (value !== null && value !== "") hasValue = true;
    });

    if (hasValue) rows.push(row);

    if (rowNumber % ROW_BATCH_SIZE === 0) {
      await yieldToBrowser();
    }
  }

  if (rows.length === 0) {
    throw new Error(`Data export ${resourceName} tidak ditemukan`);
  }

  return { headers, normalizedHeaders, rows };
}

function requireHeaders(
  source: ParsedWorksheet,
  resourceName: string,
  requiredHeaders: string[],
): void {
  const missing = requiredHeaders.filter(
    (header) => !source.normalizedHeaders.includes(header),
  );
  if (missing.length > 0) {
    throw new Error(
      `File ${resourceName} tidak memiliki kolom wajib: ${missing.join(", ")}`,
    );
  }
}

/**
 * If parent_type exists, derive its item value from the exported data itself.
 * A single observed type is unambiguous. For mixed types, the type with the
 * most parent IDs present in the item export is selected.
 */
function deriveItemParentType(
  itemIds: Set<string>,
  relationRows: ExportRow[],
): string | null {
  const scoreByType = new Map<string, number>();

  relationRows.forEach((row) => {
    const type = normalizeType(row.parent_type);
    if (!type) return;
    const parentId = asKey(row.parent_id);
    const score = parentId && itemIds.has(parentId) ? 1 : 0;
    scoreByType.set(type, (scoreByType.get(type) ?? 0) + score);
  });

  if (scoreByType.size === 0) return null;
  if (scoreByType.size === 1) return scoreByType.keys().next().value ?? null;

  const ranked = [...scoreByType.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked[0][1] === 0 || ranked[0][1] === ranked[1][1]) {
    throw new Error(
      "Nilai parent_type item_branches tidak dapat ditentukan secara aman",
    );
  }
  return ranked[0][0];
}

export function buildItemBranchNames(
  itemRows: ExportRow[],
  branchRows: ExportRow[],
  relationRows: ExportRow[],
  hasParentType: boolean,
): { namesByItemId: Map<string, string[]>; missingBranchRelations: number } {
  const itemIds = new Set(
    itemRows.map((row) => asKey(row.id)).filter((id): id is string => !!id),
  );
  const branchCityById = new Map<string, string>();

  branchRows.forEach((row) => {
    const id = asKey(row.id);
    const city = asKey(row.city);
    if (id && city) branchCityById.set(id, city);
  });

  const itemParentType = hasParentType
    ? deriveItemParentType(itemIds, relationRows)
    : null;
  const namesByItemId = new Map<string, string[]>();
  const seenNamesByItemId = new Map<string, Set<string>>();
  let missingBranchRelations = 0;

  relationRows.forEach((row) => {
    if (
      itemParentType &&
      normalizeType(row.parent_type) !== itemParentType
    ) {
      return;
    }

    const itemId = asKey(row.parent_id);
    const branchId = asKey(row.branch);
    if (!itemId || !itemIds.has(itemId) || !branchId) return;

    const city = branchCityById.get(branchId);
    if (!city) {
      missingBranchRelations += 1;
      return;
    }

    let seenNames = seenNamesByItemId.get(itemId);
    if (!seenNames) {
      seenNames = new Set<string>();
      seenNamesByItemId.set(itemId, seenNames);
      namesByItemId.set(itemId, []);
    }

    if (!seenNames.has(city)) {
      seenNames.add(city);
      namesByItemId.get(itemId)?.push(city);
    }
  });

  return { namesByItemId, missingBranchRelations };
}

function styleWorksheet(worksheet: Worksheet, itemBranchesColumn?: number): void {
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: worksheet.columnCount },
  };

  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach((column, index) => {
    const headerLength = worksheet.getRow(1).getCell(index + 1).text.length;
    column.width =
      index + 1 === itemBranchesColumn
        ? 40
        : Math.max(12, Math.min(headerLength + 4, 24));
  });

  if (itemBranchesColumn) {
    worksheet.getColumn(itemBranchesColumn).numFmt = "@";
  }
}

async function fetchExportWorkbook(
  source: ExportSource,
  token: string,
): Promise<ArrayBuffer> {
  const query = new URLSearchParams({ spec: EXPORT_SPEC });
  const url = `${getApiUrl(`/api/resource/${source.resource}/export`)}?${query}`;
  const response = await apiFetch(
    url,
    { method: "POST", cache: "no-store" },
    token,
  );

  if (!response.ok) {
    throw new Error(
      `Gagal mengambil export ${source.sheetName} (HTTP ${response.status})`,
    );
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength === 0) {
    throw new Error(`File export ${source.sheetName} kosong`);
  }
  return buffer;
}

function localDateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function exportItemWorkbook(
  {
    token,
    onProgress,
  }: {
    token: string;
    onProgress?: (progress: ItemExportProgress) => void;
  },
): Promise<ItemExportResult> {
  const totalSteps = 9;
  let completed = 0;

  onProgress?.({ completed, total: totalSteps, label: "Menyiapkan export" });
  await yieldToBrowser();
  const ExcelJS = await import("exceljs");
  const downloaded = await Promise.all(
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

  const parsed = new Map<string, ParsedWorksheet>();
  for (const { source, buffer } of downloaded) {
    onProgress?.({
      completed,
      total: totalSteps,
      label: `Membaca ${source.sheetName}`,
    });
    await yieldToBrowser();

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(buffer);
    } catch {
      throw new Error(`Response export ${source.sheetName} bukan XLSX yang valid`);
    }
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error(`File ${source.sheetName} tidak memiliki worksheet`);
    }
    parsed.set(
      source.sheetName,
      await parseWorksheet(
        worksheet,
        source.sheetName,
        SOURCE_COLUMNS_BY_SHEET[source.sheetName],
      ),
    );
    completed += 1;
    onProgress?.({
      completed,
      total: totalSteps,
      label: `${source.sheetName} selesai dibaca`,
    });
  }

  const item = parsed.get("item");
  const branch = parsed.get("branch");
  const itemBranches = parsed.get("item_branches");
  if (!item || !branch || !itemBranches) {
    throw new Error("Sumber data export item tidak lengkap");
  }

  requireHeaders(item, "item", ["id"]);
  requireHeaders(branch, "branch", ["id", "city"]);
  requireHeaders(itemBranches, "item_branches", ["parent_id", "branch"]);

  const { namesByItemId, missingBranchRelations } = buildItemBranchNames(
    item.rows,
    branch.rows,
    itemBranches.rows,
    itemBranches.normalizedHeaders.includes("parent_type"),
  );
  completed += 1;
  onProgress?.({
    completed,
    total: totalSteps,
    label: "Menggabungkan item dan cabang",
  });
  await yieldToBrowser();

  const output = new ExcelJS.Workbook();
  output.creator = "EKAPLUS Admin";
  output.created = new Date();

  for (const source of EXPORT_SOURCES) {
    const sourceData = parsed.get(source.sheetName);
    if (!sourceData) continue;

    const worksheet = output.addWorksheet(source.sheetName);
    const isItem = source.sheetName === "item";
    const outputColumns = OUTPUT_COLUMNS_BY_SHEET[source.sheetName];
    worksheet.addRow([...outputColumns]);

    for (let rowIndex = 0; rowIndex < sourceData.rows.length; rowIndex += 1) {
      const row = sourceData.rows[rowIndex];
      let values: PrimitiveCellValue[];
      if (isItem) {
        const itemId = asKey(row.id);
        const names = itemId ? namesByItemId.get(itemId) ?? [] : [];
        values = ITEM_OUTPUT_COLUMNS.map((column) =>
          column === "item branches"
            ? names.length > 0
              ? names.join(", ")
              : "[]"
            : row[column],
        );
      } else {
        values = outputColumns.map((header) => row[header]);
      }
      worksheet.addRow(values);

      if ((rowIndex + 1) % ROW_BATCH_SIZE === 0) {
        await yieldToBrowser();
      }
    }

    styleWorksheet(
      worksheet,
      isItem ? ITEM_OUTPUT_COLUMNS.indexOf("item branches") + 1 : undefined,
    );
  }

  completed += 1;
  onProgress?.({
    completed,
    total: totalSteps,
    label: "Menyusun workbook",
  });
  await yieldToBrowser();

  onProgress?.({
    completed,
    total: totalSteps,
    label: "Membuat file Excel",
  });
  const workbookBuffer = await output.xlsx.writeBuffer();
  const url = URL.createObjectURL(
    new Blob([new Uint8Array(workbookBuffer)], { type: XLSX_MIME_TYPE }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `item_export_${localDateStamp(new Date())}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);

  onProgress?.({
    completed: totalSteps,
    total: totalSteps,
    label: "File Excel berhasil dibuat",
  });

  return { missingBranchRelations };
}
