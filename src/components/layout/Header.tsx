// src/components/layout/Header.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaBars, FaSearch } from "react-icons/fa";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import UserMenu from "@/components/auth/UserMenu";

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobile: boolean;
  sidebarCollapsed?: boolean;
}

export default function Header({ onToggleSidebar, isMobile, sidebarCollapsed = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - Menu toggle */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
            title={isMobile ? "Open menu" : sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMobile ? (
              <FaBars className="w-5 h-5" />
            ) : sidebarCollapsed ? (
              <RiMenuUnfoldLine className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <RiMenuFoldLine className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            )}
          </motion.button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100 transition-all w-64 lg:w-80">
            <FaSearch className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu, fitur..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center gap-3">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}