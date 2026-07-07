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
import type { IntegrationTokenInfo, User, Role } from "./UserList";
import Image from "next/image";
import { getFileUrl } from "@/config/api";

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
  integrationToken?: IntegrationTokenInfo;
  viewMode?: "grid" | "list";
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const bgColor = role?.color || "#6B7280";
  const avatarUrl =
    getFileUrl(user.profile_pic || user.picture) ||
    user.profile_pic ||
    user.picture ||
    "";

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: 2 }}
        onClick={() => onView?.()}
        className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-red-100 hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
            style={{ backgroundColor: bgColor }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user.full_name}
                width={100}
                height={100}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              getInitials(user.full_name)
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-red-600 sm:text-base">
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
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>@{user.username}</span>
                  <span className="text-gray-300">•</span>
                  <span>Gabung {formatDate(user.created_at)}</span>
                </div>
              </div>

              <span
                className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{ backgroundColor: role?.color || "#6B7280" }}
              >
                {role?.display_name || user.role}
              </span>
            </div>

            <div className="grid gap-2 text-sm text-gray-600 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center">
              <div className="flex min-w-0 items-center gap-1.5">
                <FaEnvelope className="w-3.5 h-3.5 text-gray-400" />
                <span className="truncate">{user.email}</span>
                {user.is_email_verified ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <FaTimesCircle className="w-3 h-3 text-gray-300" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <FaPhone className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.phone}</span>
                {user.is_phone_verified ? (
                  <FaCheckCircle className="w-3 h-3 text-green-500" />
                ) : (
                  <FaTimesCircle className="w-3 h-3 text-gray-300" />
                )}
              </div>
              <div className="flex gap-2 md:justify-end">
                {canEdit ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FaEdit className="h-3 w-3" />
                      Edit
                    </span>
                  </motion.button>
                ) : null}

                {canDelete && !user.is_system ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:bg-red-100"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FaTrash className="h-3 w-3" />
                      Hapus
                    </span>
                  </motion.button>
                ) : null}
              </div>
            </div>
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
        y: -4,
        boxShadow: "0 16px 32px -12px rgba(0, 0, 0, 0.12)",
      }}
      onClick={() => onView?.()}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all"
    >
      <div
        className="relative h-14 overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

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
      </div>

      <div className="relative -mt-7 px-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl border-4 border-white text-lg font-bold text-white shadow-lg"
          style={{ backgroundColor: bgColor }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={user.full_name}
              width={200}
              height={200}
              className="w-full h-full rounded-xl object-cover"
            />
          ) : (
            getInitials(user.full_name)
          )}
        </div>
      </div>

      <div className="p-4 pt-3">
        <div className="mb-2">
          <h3 className="mb-0.5 line-clamp-1 text-base font-bold text-gray-900 transition-colors group-hover:text-red-600">
            {user.full_name}
          </h3>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>

        <div className="mb-3">
          <span
            className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
            style={{ backgroundColor: role?.color || "#6B7280" }}
          >
            {role?.display_name || user.role}
          </span>
        </div>

        <div className="mb-3 space-y-2">
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

        <div className="mb-3 text-xs text-gray-400">
          Bergabung: {formatDate(user.created_at)}
        </div>

        <div className="flex gap-2 border-t border-gray-100 pt-3">
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

          {/* {canDelete && !user.is_system && (
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
          )} */}
        </div>
      </div>
    </motion.div>
  );
}
