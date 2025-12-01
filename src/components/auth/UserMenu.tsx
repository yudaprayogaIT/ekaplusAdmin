// src/components/auth/UserMenu.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaKey,
  FaChevronDown,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";
import LoginForm from "./LoginForm";

export default function UserMenu() {
  const {
    currentUser,
    currentRole,
    permissions,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />
        <div className="hidden md:block space-y-1">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
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
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium text-sm"
        >
          <FaSignInAlt className="w-4 h-4" />
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
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 px-3 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{
              backgroundColor:
                currentUser?.profile_bg_color ||
                currentRole?.color ||
                "#6B7280",
            }}
          >
            {currentUser ? getInitials(currentUser.full_name) : "?"}
          </div>

          {/* User Info */}
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {currentUser?.full_name}
            </p>
            <p
              className="text-xs font-medium leading-tight"
              style={{ color: currentRole?.color || "#6B7280" }}
            >
              {currentRole?.display_name}
            </p>
          </div>

          {/* Permission count badge */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
            <FaKey className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">
              {permissions.length}
            </span>
          </div>

          <FaChevronDown
            className={`w-3 h-3 text-gray-400 transition-transform ${
              showDropdown ? "rotate-180" : ""
            }`}
          />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                {/* User Info Header */}
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{
                        backgroundColor:
                          currentUser?.profile_bg_color ||
                          currentRole?.color ||
                          "#6B7280",
                      }}
                    >
                      {currentUser ? getInitials(currentUser.full_name) : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {currentUser?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currentUser?.email}
                      </p>
                      <span
                        className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${currentRole?.color}20`,
                          color: currentRole?.color,
                        }}
                      >
                        {currentRole?.display_name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Navigate to profile
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaUserCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Profil Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Navigate to settings
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaCog className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Pengaturan</span>
                  </button>

                  <div className="my-2 border-t border-gray-100" />

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <LoginForm open={showLoginForm} onClose={() => setShowLoginForm(false)} />
    </>
  );
}
