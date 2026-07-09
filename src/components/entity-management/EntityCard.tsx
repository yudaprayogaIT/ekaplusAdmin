"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type EntityCardProps = {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  description?: ReactNode;
  detailLabel?: string;
  onView?: () => void;
  actions?: ReactNode;
  accentClasses?: {
    iconBg?: string;
    iconText?: string;
    hoverBorder?: string;
    hoverText?: string;
    detailText?: string;
  };
};

export default function EntityCard({
  icon,
  title,
  subtitle,
  description,
  detailLabel = "Detail",
  onView,
  actions,
  accentClasses,
}: EntityCardProps) {
  const iconBg = accentClasses?.iconBg || "bg-red-50";
  const iconText = accentClasses?.iconText || "text-red-600";
  const hoverBorder = accentClasses?.hoverBorder || "hover:border-red-200";
  const hoverText = accentClasses?.hoverText || "group-hover:text-red-600";
  const detailText = accentClasses?.detailText || "text-red-600 hover:text-red-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onView}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer transition-all group hover:shadow-md ${hoverBorder}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg} ${iconText}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`font-bold text-gray-900 text-base md:text-lg line-clamp-1 transition-colors ${hoverText}`}
              >
                {title}
              </h3>
              {subtitle ? <div className="mt-1">{subtitle}</div> : null}
            </div>

            {onView ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                className={`text-sm font-medium ${detailText}`}
              >
                {detailLabel}
              </button>
            ) : null}
          </div>

          {description ? (
            <div className="mt-3 text-sm text-gray-600">{description}</div>
          ) : null}

          {actions ? (
            <div className="mt-4 flex gap-2 pt-4 border-t border-gray-100">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
