// src/components/layout/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FaBars, FaCircleQuestion } from "react-icons/fa6";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import UserMenu from "@/components/auth/UserMenu";
import MenuSearch from "./MenuSearch";
import { getAllMenuItems } from "./Sidebar";

interface HeaderProps {
  onToggleSidebar: () => void;
  isMobile: boolean;
  sidebarCollapsed?: boolean;
}

export default function Header({ onToggleSidebar, isMobile, sidebarCollapsed = false }: HeaderProps) {
  const allMenuItems = getAllMenuItems();
  const pathname = usePathname();
  const isHelpPage = pathname === "/help";

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
          <div className="hidden md:block">
            <MenuSearch allMenuItems={allMenuItems} />
          </div>
        </div>

        {/* Right side - User Menu */}
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/help"
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm transition-all ${
                isHelpPage
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              }`}
              title="Buka halaman bantuan"
            >
              <FaCircleQuestion className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Link>
          </motion.div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
