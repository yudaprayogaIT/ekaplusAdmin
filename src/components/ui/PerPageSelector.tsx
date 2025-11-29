// src/components/ui/PerPageSelector.tsx
"use client";

import React from "react";
import { FaChevronDown } from "react-icons/fa";

type PerPageSelectorProps = {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
};

export default function PerPageSelector({
  value,
  onChange,
  options = [12, 24, 48, 96],
}: PerPageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap">
        Tampilkan:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-pointer"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
      </div>
      <span className="text-sm text-gray-600">per halaman</span>
    </div>
  );
}
