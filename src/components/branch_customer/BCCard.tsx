"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaBuilding,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaBan,
  FaLink,
  FaMapMarkerAlt,
} from "react-icons/fa";
import type { BranchCustomer } from "@/types/customer";

interface BCCardProps {
  bc: BranchCustomer;
  onViewDetails: () => void;
}

export function BCCard({ bc, onViewDetails }: BCCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaBuilding className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white line-clamp-1">
                {bc.name}
              </h3>
              <p className="text-sm text-orange-100">BCID: {bc.code || `BC${bc.id}`}</p>
            </div>
          </div>

          {/* Status Badge */}
          {bc.disabled === 1 ? (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <FaBan className="w-3 h-3" />
              Disabled
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
              <FaCheckCircle className="w-3 h-3" />
              Active
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        {/* Branch Info */}
        {bc.branch_city && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-green-600 font-medium">Branch</p>
              <p className="text-sm font-semibold text-green-900">
                {bc.branch_name} - {bc.branch_city}
              </p>
            </div>
          </div>
        )}

        {/* Linked GC */}
        {bc.gc_name && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <FaLink className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-blue-600 font-medium">Linked to GC</p>
              <p className="text-sm font-semibold text-blue-900">{bc.gc_name}</p>
            </div>
          </div>
        )}

        {/* Linked GP */}
        {bc.gp_name && (
          <div className="flex items-center gap-2 p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
            <FaLink className="w-3.5 h-3.5 text-purple-600" />
            <div className="flex-1">
              <p className="text-xs text-purple-600 font-medium">GP</p>
              <p className="text-sm font-semibold text-purple-900">{bc.gp_name}</p>
            </div>
          </div>
        )}

        {/* Created Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
          <FaClock className="w-4 h-4 text-gray-400" />
          <span>
            Created:{" "}
            {new Date(bc.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewDetails}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <FaEye className="w-4 h-4" />
          <span>View Details</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
