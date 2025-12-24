// src/components/ui/UnsavedChangesDialog.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

type UnsavedChangesDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function UnsavedChangesDialog({
  open,
  onConfirm,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Icon */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 flex items-center justify-center border-b border-orange-200">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Data Belum Disimpan
              </h3>
              <p className="text-gray-600 mb-6">
                Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar
                tanpa menyimpan?
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all"
                >
                  Kembali
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg transition-all"
                >
                  Keluar Tanpa Simpan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
