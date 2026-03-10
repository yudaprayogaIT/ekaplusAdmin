"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CustomerRegistration } from "@/types/customerRegistration";
import { FaBuilding, FaUser, FaMapMarkerAlt, FaEye, FaSyncAlt } from "react-icons/fa";

interface RegistrationCardProps {
  registration: CustomerRegistration;
  onViewDetails: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
  syncLabel?: string;
  syncReadOnly?: boolean;
}

export function RegistrationCard({
  registration,
  onViewDetails,
  onSync,
  isSyncing = false,
  syncLabel = "Sync",
  syncReadOnly = false,
}: RegistrationCardProps) {
  const getStatusBadgeClass = (docstatus?: number) => {
    if (docstatus === 1) return "bg-green-100 text-green-700 border-green-200";
    if (docstatus === 2) return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatSubmissionDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  const sagaStatus = (registration.sync_info?.saga_status || "").toLowerCase();
  const hasSagaStatus = Boolean(sagaStatus);
  const canShowSyncButton =
    Boolean(onSync) && hasSagaStatus && sagaStatus !== "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(239, 68, 68, 0.15)",
      }}
      onClick={onViewDetails}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Header with Status */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaBuilding className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
              {registration.company.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {!canShowSyncButton && (
              <div
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getStatusBadgeClass(
                  registration.docstatus,
                )}`}
              >
                {getStatusLabel(registration.status)}
              </div>
            )}
            {canShowSyncButton && onSync && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!syncReadOnly && !isSyncing) onSync();
                }}
                disabled={syncReadOnly || isSyncing}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  syncReadOnly
                    ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                }`}
                title={
                  syncReadOnly
                    ? "Sinkronisasi sudah berhasil"
                    : `${syncLabel} ke ERP/CRM/Ekaplus`
                }
              >
                <FaSyncAlt className={isSyncing ? "animate-spin" : ""} />
                <span>{isSyncing ? "Syncing..." : syncLabel}</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 uppercase">
            Source: {registration.source || "-"}
          </span>
          <span className="text-xs text-gray-500 font-medium truncate">
            {registration.company.business_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Owner */}
        <div className="flex items-center gap-2">
          <FaUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-700 font-medium truncate">
            {registration.user.full_name}
          </span>
        </div>

        {/* Branch */}
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {registration.company.branch_name} (
            {registration.company.branch_city})
          </span>
        </div>

        {/* Submission Date */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">
            No Reg:{" "}
            <span className="font-medium text-gray-700">
              {registration.registration_number || registration.id}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Submitted:{" "}
            <span className="font-medium text-gray-700">
              {formatSubmissionDate(registration.submission_date)}
            </span>
          </p>
        </div>

        {/* View Details Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
        >
          <FaEye className="w-4 h-4" />
          <span>View Details</span>
        </motion.button>
      </div>
    </motion.div>
  );
}



