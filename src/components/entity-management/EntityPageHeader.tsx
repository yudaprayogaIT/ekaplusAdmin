"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaSearch } from "react-icons/fa";

type EntityPageHeaderProps = {
  icon: ReactNode;
  title: string;
  description: string;
  addLabel?: string;
  onAdd?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  summary?: ReactNode;
  rightInfo?: ReactNode;
  accentClasses?: {
    iconBg?: string;
    iconText?: string;
    buttonBg?: string;
    buttonShadow?: string;
    searchRing?: string;
  };
};

export default function EntityPageHeader({
  icon,
  title,
  description,
  addLabel,
  onAdd,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  summary,
  rightInfo,
  accentClasses,
}: EntityPageHeaderProps) {
  const iconBg = accentClasses?.iconBg || "bg-red-50";
  const iconText = accentClasses?.iconText || "text-red-600";
  const buttonBg =
    accentClasses?.buttonBg || "bg-gradient-to-r from-red-600 to-red-700";
  const buttonShadow = accentClasses?.buttonShadow || "shadow-red-200";
  const searchRing = accentClasses?.searchRing || "focus:ring-red-500";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBg} ${iconText}`}
            >
              {icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>

          {summary ? (
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {summary}
            </div>
          ) : null}
        </div>

        {addLabel && onAdd ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAdd}
            className={`flex items-center justify-center self-end gap-2 px-3 py-2 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium ${buttonBg} ${buttonShadow}`}
          >
            <FaPlus className="w-4 h-4" />
            <span className="text-sm">{addLabel}</span>
          </motion.button>
        ) : null}
      </div>

      {typeof searchQuery === "string" && onSearchChange ? (
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className={`w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all ${searchRing}`}
            />
          </div>

          {rightInfo ? <div className="text-sm text-gray-500">{rightInfo}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
