"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

type EntityDetailModalProps = {
  open: boolean;
  onClose: () => void;
  icon: ReactNode;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidthClassName?: string;
  accentClasses?: {
    iconBg?: string;
    iconText?: string;
  };
};

export default function EntityDetailModal({
  open,
  onClose,
  icon,
  eyebrow,
  title,
  subtitle,
  children,
  actions,
  maxWidthClassName = "max-w-2xl",
  accentClasses,
}: EntityDetailModalProps) {
  if (!open) return null;

  const iconBg = accentClasses?.iconBg || "bg-red-50";
  const iconText = accentClasses?.iconText || "text-red-600";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className={`relative z-10 w-full ${maxWidthClassName} bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto`}
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2.5 hover:bg-gray-100 rounded-xl transition-colors z-10"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>

            <div className="pr-12">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconBg} ${iconText}`}
                >
                  {icon}
                </div>
                <div>
                  {eyebrow ? (
                    <p className="text-sm text-gray-500">{eyebrow}</p>
                  ) : null}
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                </div>
              </div>

              {subtitle ? subtitle : null}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {children}
            {actions ? <div className="flex gap-3 pt-2">{actions}</div> : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
