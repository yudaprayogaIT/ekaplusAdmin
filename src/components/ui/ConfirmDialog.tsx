// src/components/ui/ConfirmDialog.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
};

const variantColors = {
  danger: {
    bg: "bg-red-100",
    icon: "text-red-600",
    button:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200",
  },
  warning: {
    bg: "bg-amber-100",
    icon: "text-amber-600",
    button:
      "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-200",
  },
  info: {
    bg: "bg-blue-100",
    icon: "text-blue-600",
    button:
      "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200",
  },
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const colors = variantColors[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
          >
            <div className="p-6">
              {/* Icon */}
              <div
                className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <FaExclamationTriangle className={`w-8 h-8 ${colors.icon}`} />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-center mb-6">{description}</p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-semibold shadow-lg transition-all ${colors.button}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
