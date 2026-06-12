"use client";

import { motion } from "framer-motion";
import { FaBoxes, FaEye, FaLayerGroup, FaTag } from "react-icons/fa";
import {
  AuthzResource,
  normalizeDescription,
  normalizeModuleName,
} from "./ResourceList";

type Props = {
  resource: AuthzResource;
  viewMode: "grid" | "list";
  onView: () => void;
};

export default function ResourceCard({ resource, viewMode, onView }: Props) {
  const moduleName = normalizeModuleName(resource.Module);
  const description = normalizeDescription(resource.Description);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaBoxes className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {resource.Name}
                </h3>
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                  #{resource.ID}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono truncate">
                {resource.Slug}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                <span>{moduleName}</span>
                <span className="text-gray-300">•</span>
                <span className="truncate">{description}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onView}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="View Details"
          >
            <FaEye className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <FaBoxes className="w-7 h-7 text-white" />
        </div>
        <button
          onClick={onView}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          title="View Details"
        >
          <FaEye className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate">
            {resource.Name}
          </h3>
          <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-bold">
            #{resource.ID}
          </span>
        </div>
        <p className="text-sm text-gray-500 font-mono truncate mb-3">
          {resource.Slug}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-cyan-50 p-3">
          <div className="flex items-center gap-2 text-cyan-700 mb-1">
            <FaLayerGroup className="w-3 h-3" />
            <span className="text-xs font-semibold">Module</span>
          </div>
          <p className="text-sm font-bold text-cyan-900 truncate">{moduleName}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-700 mb-1">
            <FaTag className="w-3 h-3" />
            <span className="text-xs font-semibold">Slug</span>
          </div>
          <p className="text-sm font-bold text-slate-900 truncate">
            {resource.Slug}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
