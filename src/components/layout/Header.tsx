// src/components/layout/Header.tsx
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import useClickOutside from '@/lib/useClickOutside';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Header({ collapsed, setCollapsed }: HeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(notifRef, () => setNotificationOpen(false));

  return (
    <header className="w-full bg-white h-16 flex items-center justify-between px-6 sticky top-0 z-30 border-b border-gray-100 shadow-sm">
      {/* Left side - Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button - Modern Style */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed((prev) => !prev)}
          className="relative group p-2.5 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl transition-all duration-200 border border-red-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <div className="relative w-5 h-5 flex flex-col justify-center gap-1">
            <motion.span
              animate={{
                rotate: collapsed ? 0 : 45,
                y: collapsed ? 0 : 6,
              }}
              transition={{ duration: 0.2 }}
              className="w-5 h-0.5 bg-red-600 rounded-full origin-center"
            />
            <motion.span
              animate={{
                opacity: collapsed ? 1 : 0,
                scaleX: collapsed ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="w-5 h-0.5 bg-red-600 rounded-full"
            />
            <motion.span
              animate={{
                rotate: collapsed ? 0 : -45,
                y: collapsed ? 0 : -6,
              }}
              transition={{ duration: 0.2 }}
              className="w-5 h-0.5 bg-red-600 rounded-full origin-center"
            />
          </div>
        </motion.button>

        <h1 className="text-base md:text-xl font-semibold text-gray-800">Dashboard Admin</h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Help Icon */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Help"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
          </svg>
        </motion.button>

        {/* Notification */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotificationOpen((s) => !s)}
            className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            aria-expanded={notificationOpen}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.918 18 13V8a6 6 0 10-12 0v5c0 .918-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </motion.button>

          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-72 xl:w-80 bg-white rounded-xl shadow-xl ring-1 ring-gray-100 z-30 overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">3</span>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-gray-800 font-medium">Pesan system</p>
                        <p className="text-xs text-gray-500 mt-0.5">System update available</p>
                        <span className="text-xs text-gray-400 mt-1 block">2 min ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="8.5" cy="7" r="4"/>
                          <line x1="20" y1="8" x2="20" y2="14"/>
                          <line x1="23" y1="11" x2="17" y2="11"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-gray-800 font-medium">New member request</p>
                        <p className="text-xs text-gray-500 mt-0.5">John Doe wants to join</p>
                        <span className="text-xs text-gray-400 mt-1 block">15 min ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm text-gray-800 font-medium">Promo activated</p>
                        <p className="text-xs text-gray-500 mt-0.5">Flash sale is now live</p>
                        <span className="text-xs text-gray-400 mt-1 block">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <button className="w-full text-xs text-red-600 font-medium hover:text-red-700 transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            A
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs md:text-sm font-medium text-gray-800">Admin</span>
            <span className="text-[10px] md:text-xs text-gray-500">Superuser</span>
          </div>
        </div>
      </div>
    </header>
  );
}