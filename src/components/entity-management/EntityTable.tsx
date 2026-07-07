"use client";

import { ReactNode } from "react";

export type EntityTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  cellClassName?: string;
  render: (item: T) => ReactNode;
};

type EntityTableProps<T> = {
  columns: EntityTableColumn<T>[];
  rows: T[];
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
  footer?: ReactNode;
};

export default function EntityTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  footer,
}: EntityTableProps<T>) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/80">
            <tr className="text-left">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 ${column.className || ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={
                  onRowClick
                    ? "cursor-pointer transition-colors hover:bg-red-50/40"
                    : ""
                }
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 ${column.cellClassName || ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footer ? (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm text-gray-500">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
