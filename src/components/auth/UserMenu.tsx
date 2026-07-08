// src/components/auth/UserMenu.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";
import { getFileUrl } from "@/config/api";
import { FaKey, FaSignInAlt } from "react-icons/fa";

export default function UserMenu() {
  const { currentUser, currentRole, permissions, isAuthenticated, isLoading } =
    useAuth();
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl =
    getFileUrl(currentUser?.profile_pic) || currentUser?.profile_pic || "";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
        <div className="hidden space-y-1 md:block">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLoginForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-200 transition-all hover:shadow-xl"
        >
          <FaSignInAlt className="h-4 w-4" />
          <span>Login</span>
        </motion.button>

        <LoginForm
          open={showLoginForm}
          onClose={() => setShowLoginForm(false)}
        />
      </>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/profile")}
        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md cursor-pointer"
      >
        <div
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-sm font-bold text-white"
          style={{
            backgroundColor:
              currentUser?.profile_bg_color || currentRole?.color || "#6B7280",
          }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={currentUser?.full_name || "User avatar"}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : currentUser ? (
            getInitials(currentUser.full_name)
          ) : (
            "?"
          )}
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-semibold leading-tight text-gray-800">
            {currentUser?.full_name}
          </p>
          <p
            className="text-xs font-medium leading-tight"
            style={{ color: currentRole?.color || "#6B7280" }}
          >
            {currentRole?.display_name}
          </p>
        </div>

        <div className="hidden items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 lg:flex">
          <FaKey className="h-3 w-3 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">
            {permissions.length}
          </span>
        </div>
      </motion.button>

      <LoginForm open={showLoginForm} onClose={() => setShowLoginForm(false)} />
    </>
  );
}
