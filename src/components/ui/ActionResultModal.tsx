"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";

type ActionResultType = "success" | "error";

interface ActionResultDetail {
  label: string;
  value: string;
}

interface ActionResultModalProps {
  isOpen: boolean;
  type?: ActionResultType;
  title: string;
  message: string;
  description?: string;
  details?: ActionResultDetail[];
  confirmLabel?: string;
  onClose: () => void;
}

export default function ActionResultModal({
  isOpen,
  type = "success",
  title,
  message,
  description,
  details,
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

            <div className="px-5 py-6">
              <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                {isSuccess ? (
                  <FaCheckCircle className="w-7 h-7 text-green-600" />
                ) : (
                  <FaExclamationTriangle className="w-7 h-7 text-red-600" />
                )}
              </div>

              <p className="text-xl font-bold text-gray-900 text-center whitespace-pre-line">
                {message}
              </p>

              {description && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  {description}
                </p>
              )}

              {details && details.length > 0 && (
                <div className="mt-5 rounded-xl border border-gray-200 overflow-hidden">
                  {details.map((detail, idx) => (
                    <div
                      key={`${detail.label}-${idx}`}
                      className={`px-4 py-3 flex items-start justify-between gap-3 ${
                        idx !== details.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                        {detail.label}
                      </p>
                      <p className="text-sm text-gray-900 font-semibold text-right whitespace-pre-line">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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

