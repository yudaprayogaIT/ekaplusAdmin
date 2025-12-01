// src/components/users/UserCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaGoogle,
  FaShieldAlt,
} from "react-icons/fa";
import type { User, Role } from "./UserList";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UserCard({
  user,
  role,
  viewMode = "grid",
  onEdit,
  onDelete,
  onView,
  canEdit = true,
  canDelete = true,
}: {
  user: User;
  role?: Role;
  viewMode?: "grid" | "list";
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const bgColor = user.profile_bg_color || role?.color || "#6B7280";

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 4 }}
        onClick={() => onView?.()}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer transition-all group hover:shadow-lg"
      >
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg"
            style={{ backgroundColor: bgColor }}
          >
            {user.profile_pic || user.picture ? (
              <img
                src={user.profile_pic || user.picture || ""}
                alt={user.full_name}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              getInitials(user.full_name)
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">
                    {user.full_name}
                  </h3>
                  {user.is_system && (
                    <FaShieldAlt
                      className="w-3.5 h-3.5 text-amber-500"
                      title="System User"
                    />
                  )}
                  {user.google_id && (
                    <FaGoogle
                      className="w-3.5 h-3.5 text-blue-500"
                      title="Google Account"
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>

              {/* Role Badge */}
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                style={{ backgroundColor: role?.color || "#6B7280" }}
              >
                {role?.display_name || user.role}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <FaEnvelope className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate max-w-[200px]">{user.email}</span>
                {user.is_email_verified ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <FaTimesCircle className="w-3 h-3 text-gray-300" />
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <FaPhone className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.phone}</span>
                {user.is_phone_verified ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <FaTimesCircle className="w-3 h-3 text-gray-300" />
                )}
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : user.status === "inactive"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {canEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all"
              >
                <FaEdit className="w-4 h-4 text-gray-600 hover:text-red-600" />
              </motion.button>
            )}

            {canDelete && !user.is_system && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="p-2.5 rounded-lg bg-red-50 border-2 border-red-100 hover:bg-red-100 transition-all"
              >
                <FaTrash className="w-4 h-4 text-red-600" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => onView?.()}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all group"
    >
      {/* Header with gradient */}
      <div
        className="h-20 relative overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {user.is_system && (
            <span
              className="p-1.5 bg-amber-500/90 backdrop-blur-sm rounded-lg"
              title="System User"
            >
              <FaShieldAlt className="w-3 h-3 text-white" />
            </span>
          )}
          {user.google_id && (
            <span
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg"
              title="Google Account"
            >
              <FaGoogle className="w-3 h-3 text-blue-500" />
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm capitalize ${
              user.status === "active"
                ? "bg-green-500/90 text-white"
                : user.status === "inactive"
                ? "bg-gray-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* Avatar */}
      <div className="relative -mt-10 px-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl border-4 border-white"
          style={{ backgroundColor: bgColor }}
        >
          {user.profile_pic || user.picture ? (
            <img
              src={user.profile_pic || user.picture || ""}
              alt={user.full_name}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            getInitials(user.full_name)
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-3">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg mb-0.5 line-clamp-1 group-hover:text-red-600 transition-colors">
            {user.full_name}
          </h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>

        {/* Role Badge */}
        <div className="mb-4">
          <span
            className="inline-flex px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: role?.color || "#6B7280" }}
          >
            {role?.display_name || user.role}
          </span>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaEnvelope className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span className="truncate">{user.email}</span>
            {user.is_email_verified ? (
              <FaCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
            ) : (
              <FaTimesCircle className="w-3 h-3 text-gray-300 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaPhone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <span>{user.phone}</span>
            {user.is_phone_verified ? (
              <FaCheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
            ) : (
              <FaTimesCircle className="w-3 h-3 text-gray-300 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-xs text-gray-400 mb-4">
          Bergabung: {formatDate(user.created_at)}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {canEdit ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 transition-all group/btn"
            >
              <FaEdit className="w-3.5 h-3.5 text-gray-600 group-hover/btn:text-red-600 transition-colors" />
              <span className="text-sm font-semibold text-gray-700 group-hover/btn:text-red-600 transition-colors">
                Edit
              </span>
            </motion.button>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-50 border-2 border-gray-100 text-gray-400 cursor-not-allowed">
              <FaEdit className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold">Edit</span>
            </div>
          )}

          {canDelete && !user.is_system && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all"
            >
              <FaTrash className="w-3.5 h-3.5 text-red-600" />
              <span className="text-sm font-semibold text-red-600">Hapus</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
