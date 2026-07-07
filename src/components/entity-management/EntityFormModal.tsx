"use client";

import { FormEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSave, FaTimes } from "react-icons/fa";

type EntityFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
  loading?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
  maxWidthClassName?: string;
  accentClasses?: {
    iconBg?: string;
    buttonBg?: string;
  };
};

export default function EntityFormModal({
  open,
  onClose,
  onSubmit,
  icon,
  title,
  subtitle,
  children,
  loading = false,
  submitLabel = "Simpan",
  loadingLabel = "Menyimpan...",
  maxWidthClassName = "max-w-2xl",
  accentClasses,
}: EntityFormModalProps) {
  if (!open) return null;

  const iconBg =
    accentClasses?.iconBg || "bg-gradient-to-br from-red-500 to-red-600";
  const buttonBg =
    accentClasses?.buttonBg || "bg-gradient-to-r from-red-500 to-red-600";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${iconBg}`}
              >
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600">{subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            {children}

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${buttonBg}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{loadingLabel}</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    <span>{submitLabel}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
