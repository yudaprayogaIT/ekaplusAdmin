// src/components/layout/MenuSearch.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { MenuItem } from "./Sidebar";

interface MenuSearchProps {
  allMenuItems: MenuItem[];
}

export default function MenuSearch({ allMenuItems }: MenuSearchProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const { isAuthenticated, hasPermission, hasAnyPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter menu items based on search query and permissions
  const filteredMenus = allMenuItems.filter((item) => {
    // Check authentication
    if (item.requireAuth && !isAuthenticated) return false;

    // Check permissions
    if (item.permission && !hasPermission(item.permission)) return false;
    if (item.permissions && !hasAnyPermission(item.permissions)) return false;

    // Check search query
    if (!searchQuery.trim()) return false;

    const query = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToMenu = useCallback((item: MenuItem) => {
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    if (active) {
      router.refresh();
    } else {
      router.push(item.href);
    }
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  }, [pathname, router]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredMenus.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredMenus[selectedIndex]) {
          navigateToMenu(filteredMenus[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredMenus, selectedIndex, navigateToMenu]);

  // Global shortcut: Ctrl/Cmd + K focuses menu search like Tailwind docs
  useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        if (searchQuery.trim()) {
          setIsOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleGlobalShortcut);
    return () => document.removeEventListener("keydown", handleGlobalShortcut);
  }, [searchQuery]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(value.trim().length > 0);
  }

  function clearSearch() {
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={searchRef} className="relative w-64 lg:w-80">
      {/* Search Input */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border-2 transition-all ${
          isOpen
            ? "border-red-300 ring-2 ring-red-100"
            : "border-gray-200 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-100"
        }`}
      >
        <FaSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
          placeholder="Cari menu, fitur... (Ctrl+K)"
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
            aria-label="Clear search"
          >
            <FaTimes className="w-3 h-3 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {filteredMenus.length > 0 ? (
              <div className="py-2">
                {filteredMenus.map((item, index) => (
                  <button
                    key={item.href}
                    onClick={() => navigateToMenu(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                      index === selectedIndex
                        ? "bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500"
                        : "hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                        index === selectedIndex
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {typeof item.icon === "string" ? (
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={16}
                          height={16}
                        />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div
                        className={`text-sm font-medium ${
                          index === selectedIndex
                            ? "text-red-700"
                            : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </div>
                      {item.category && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {item.category}
                        </div>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <div className="flex-shrink-0">
                        <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                          Enter
                        </kbd>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaSearch className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  Tidak ada menu ditemukan
                </p>
                <p className="text-xs text-gray-400">
                  Coba kata kunci lain atau periksa ejaan
                </p>
              </div>
            )}

            {/* Keyboard Hints */}
            {filteredMenus.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">
                      ↑↓
                    </kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">
                      Enter
                    </kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-xs">
                    Esc
                  </kbd>
                  Close
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
