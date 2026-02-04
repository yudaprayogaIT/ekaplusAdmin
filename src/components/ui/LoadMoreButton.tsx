// src/components/ui/LoadMoreButton.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

type LoadMoreButtonProps = {
  onClick: () => void;
  loading?: boolean;
  hasMore: boolean;
  currentCount: number;
  totalCount: number;
};

export default function LoadMoreButton({
  onClick,
  loading = false,
  hasMore,
  currentCount,
  totalCount,
}: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">
            Semua data telah dimuat ({totalCount} items)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="mb-4">
        <span className="text-sm text-gray-600">
          Menampilkan{" "}
          <span className="font-semibold text-gray-900">{currentCount}</span>{" "}
          dari
          <span className="font-semibold text-gray-900">
            {" "}
            {totalCount}
          </span>{" "}
          items
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <FaSpinner className="w-5 h-5 animate-spin" />
            <span>Memuat...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span>Muat Lebih Banyak</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
