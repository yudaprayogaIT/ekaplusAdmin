"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";

type ActionResultType = "success" | "error";

interface ActionResultModalProps {
  isOpen: boolean;
  type?: ActionResultType;
  title: string;
  message: string;
  confirmLabel?: string;
  onClose: () => void;
}

export default function ActionResultModal({
  isOpen,
  type = "success",
  title,
  message,
  confirmLabel = "OK",
  onClose,
}: ActionResultModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            <div
              className={`px-5 py-4 flex items-center justify-between ${
                isSuccess
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-red-500 to-red-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  {isSuccess ? (
                    <FaCheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <FaExclamationTriangle className="w-5 h-5 text-white" />
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
              >
                <HiXMark className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="px-5 py-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>
            </div>

            <div className="px-5 pb-5 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 rounded-xl font-medium text-white ${
                  isSuccess
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

