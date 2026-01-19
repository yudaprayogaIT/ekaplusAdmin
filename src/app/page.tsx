// src/app/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaUsers,
  FaShieldAlt,
  FaProjectDiagram,
  FaMapMarkerAlt,
  FaArrowRight,
  FaLock,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { Dashboard } from "@/components/dashboard";

type QuickAction = {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  permission?: string;
  permissions?: string[];
};

const quickActions: QuickAction[] = [
  {
    name: "Kelola Users",
    description: "Lihat dan kelola semua pengguna",
    href: "/users",
    icon: <FaUsers className="w-6 h-6" />,
    color: "bg-blue-500",
    permissions: ["users.view", "users.view_branch",],
  },
  {
    name: "Roles & Permissions",
    description: "Atur role dan hak akses",
    href: "/roles",
    icon: <FaShieldAlt className="w-6 h-6" />,
    color: "bg-amber-500",
    permission: "roles.view",
  },
  {
    name: "Workflow",
    description: "Kelola approval workflow",
    href: "/workflows",
    icon: <FaProjectDiagram className="w-6 h-6" />,
    color: "bg-purple-500",
    permission: "workflows.view",
  },
  {
    name: "Branches",
    description: "Kelola data cabang",
    href: "/branches",
    icon: <FaMapMarkerAlt className="w-6 h-6" />,
    color: "bg-green-500",
    // permission: "branches.view",
  },
];

function QuickActionCard({ action }: { action: QuickAction }) {
  const { hasPermission, hasAnyPermission, isAuthenticated } = useAuth();

  const hasAccess =
    !isAuthenticated ||
    (action.permission
      ? hasPermission(action.permission)
      : action.permissions
      ? hasAnyPermission(action.permissions)
      : true);

  if (!hasAccess) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100 opacity-50 cursor-not-allowed">
        <div className="w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center mb-4 text-gray-400">
          <FaLock className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-gray-400 text-lg mb-1">{action.name}</h3>
        <p className="text-sm text-gray-300 mb-4">{action.description}</p>
        <span className="text-xs text-gray-400">Akses tidak tersedia</span>
      </div>
    );
  }

  return (
    <Link href={action.href}>
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm cursor-pointer group"
      >
        <div
          className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}
        >
          {action.icon}
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-red-600 transition-colors">
          {action.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4">{action.description}</p>
        <div className="flex items-center text-red-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
          <span>Buka</span>
          <FaArrowRight className="w-3 h-3 ml-2" />
        </div>
      </motion.div>
    </Link>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isAuthenticated) {
    return (
      <div>
        {/* Simple Welcome Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />

            <div className="relative">
              <h1 className="text-3xl font-bold mb-2">
                Selamat Datang di EKA+ Admin
              </h1>
              <p className="text-red-100">
                Silakan login untuk mengakses dashboard
              </p>
            </div>
          </motion.div>
        </div>

        {/* Login Required Message - only when not logged in */}
        {!isAuthenticated && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaLock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 mb-1">
                  Login Diperlukan
                </h3>
                <p className="text-amber-700 text-sm">
                  Klik tombol <strong>Login</strong> di pojok kanan atas untuk
                  mengakses menu atau fitur EKA+ Admin
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.href} action={action} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}