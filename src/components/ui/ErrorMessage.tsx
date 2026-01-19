// src/components/ui/ErrorMessage.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

interface ErrorMessageProps {
  /** HTTP error code (e.g., 404, 500, 403) */
  errorCode?: number;
  /** Custom error title */
  title?: string;
  /** Custom error message */
  message?: string;
  /** Optional callback for retry action */
  onRetry?: () => void;
  /** Show retry button */
  showRetry?: boolean;
  /** Custom class name for container */
  className?: string;
}

// Default error messages based on HTTP status codes
const ERROR_MESSAGES: Record<number, { title: string; message: string }> = {
  400: {
    title: "Permintaan Tidak Valid",
    message:
      "Data yang Anda kirimkan tidak sesuai dengan format yang diharapkan.",
  },
  401: {
    title: "Tidak Terautentikasi",
    message:
      "Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.",
  },
  403: {
    title: "Akses Ditolak",
    message:
      "Anda tidak memiliki izin untuk mengakses halaman atau resource ini.",
  },
  404: {
    title: "Data Tidak Ditemukan",
    message: "Data yang Anda cari tidak dapat ditemukan di server.",
  },
  500: {
    title: "Kesalahan Server",
    message:
      "Terjadi kesalahan pada server. Silakan coba lagi dalam beberapa saat.",
  },
  502: {
    title: "Gateway Error",
    message:
      "Server tidak dapat merespons permintaan Anda. Silakan coba lagi nanti.",
  },
  503: {
    title: "Layanan Tidak Tersedia",
    message:
      "Server sedang dalam pemeliharaan. Silakan coba lagi dalam beberapa saat.",
  },
};

export default function ErrorMessage({
  errorCode,
  title,
  message,
  onRetry,
  showRetry = true,
  className = "",
}: ErrorMessageProps) {
  // Get default message based on error code
  const defaultError = errorCode ? ERROR_MESSAGES[errorCode] : null;

  const displayTitle = title || defaultError?.title || "Terjadi Kesalahan";
  const displayMessage =
    message ||
    defaultError?.message ||
    "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.";

  return (
    <div
      className={`flex items-center justify-center px-4 md:py-4 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Error Illustration */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-64 h-64"
          >
            <Image
              src="/icons/errorMsg.svg"
              alt="Error Illustration"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Error Content */}
        <div className="text-center">
          {/* Error Code Badge */}
          {errorCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full mb-4"
            >
              <FaExclamationTriangle className="w-4 h-4" />
              <span className="text-sm font-semibold">Error {errorCode}</span>
            </motion.div>
          )}

          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-3"
          >
            {displayTitle}
          </motion.h1>

          {/* Error Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base md:text-lg text-gray-600 mb-8 max-w-lg mx-auto"
          >
            {displayMessage}
          </motion.p>

          {/* Action Buttons */}
          {showRetry && onRetry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-xl"
              >
                <FaRedo className="w-4 h-4" />
                <span>Coba Lagi</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Additional Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Jika masalah terus berlanjut, silakan hubungi administrator sistem.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
