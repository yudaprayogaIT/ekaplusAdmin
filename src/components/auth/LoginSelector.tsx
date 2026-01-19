// src/components/auth/LoginSelector.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaShieldAlt, FaUserTie, FaUserCog, FaUser, FaSignInAlt, 
  FaSignOutAlt, FaCheckCircle, FaKey 
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

// Demo password untuk quick login
const DEMO_PASSWORD = "admin123";

type UserOption = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  role_display: string;
  role_color: string;
  profile_bg_color: string | null;
};

type UserData = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  role_id: string;
  status: string;
  profile_bg_color: string | null;
};

type RoleData = {
  id: string;
  name: string;
  display_name: string;
  color: string;
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  administrator: <FaShieldAlt className="w-6 h-6" />,
  admin_pusat: <FaUserTie className="w-6 h-6" />,
  admin_cabang: <FaUserCog className="w-6 h-6" />,
  customer: <FaUser className="w-6 h-6" />,
};

const ROLE_COLORS: Record<string, string> = {
  administrator: "#F59E0B",
  admin_pusat: "#8B5CF6",
  admin_cabang: "#10B981",
  customer: "#6B7280",
};

export default function LoginSelector() {
  const { currentUser, currentRole, permissions, login, logout, isLoading, isAuthenticated } = useAuth();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [loggingIn, setLoggingIn] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        // Try localStorage first
        const snap = localStorage.getItem("ekaplus_users_snapshot");
        let usersList: UserData[] = [];
        
        if (snap) {
          usersList = JSON.parse(snap);
        } else {
          const res = await fetch("/data/users.json");
          if (res.ok) {
            const data = await res.json();
            usersList = data.users || [];
          }
        }

        // Load roles for display names
        const rolesRes = await fetch("/data/roles.json");
        let roles: RoleData[] = [];
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          roles = rolesData.roles || [];
        }

        const options: UserOption[] = usersList
          .filter((u: UserData) => u.status === 'active')
          .map((u: UserData) => {
            const role = roles.find(r => r.name === u.role || r.id === u.role_id);
            return {
              id: u.id,
              username: u.username,
              full_name: u.full_name,
              email: u.email,
              role: u.role,
              role_display: role?.display_name || u.role,
              role_color: role?.color || ROLE_COLORS[u.role] || "#6B7280",
              profile_bg_color: u.profile_bg_color,
            };
          });

        // Sort by role level (admin first)
        const roleOrder = ['administrator', 'admin_pusat', 'admin_cabang', 'customer'];
        options.sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role));

        setUsers(options);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    }
    loadUsers();
  }, []);

  async function handleLogin(user: UserOption) {
    setLoggingIn(user.id);
    setLoginError(null);
    
    try {
      // Login menggunakan username dan demo password
      const result = await login(user.username, DEMO_PASSWORD);
      
      // Handle both boolean and LoginResult return types
      if (typeof result === 'boolean') {
        if (result) {
          setShowSelector(false);
        } else {
          setLoginError("Login gagal. Pastikan password benar.");
        }
      } else if (typeof result === 'object' && result !== null) {
        if (result.success) {
          setShowSelector(false);
        } else {
          setLoginError(result.message || "Login gagal");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Terjadi kesalahan saat login");
    } finally {
      setLoggingIn(null);
    }
  }

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Login Button / User Info */}
      <div className="fixed top-4 right-4 z-50">
        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-3">
            {/* User Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: currentUser.profile_bg_color || currentRole?.color || '#6B7280' }}
              >
                {getInitials(currentUser.full_name)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800">{currentUser.full_name}</p>
                <p 
                  className="text-xs font-medium"
                  style={{ color: currentRole?.color || '#6B7280' }}
                >
                  {currentRole?.display_name}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg">
                <FaKey className="w-3 h-3 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">{permissions.length} perms</span>
              </div>
            </motion.div>

            {/* Switch / Logout Buttons */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSelector(true)}
              className="p-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
              title="Switch User"
            >
              <FaSignInAlt className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="p-3 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="w-5 h-5" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSelector(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-medium"
          >
            <FaSignInAlt className="w-5 h-5" />
            <span>Login</span>
          </motion.button>
        )}
      </div>

      {/* Login Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setShowSelector(false)} 
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden z-10 relative"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white">
                <h3 className="text-2xl font-bold mb-1">Pilih Akun untuk Login</h3>
                <p className="text-red-100 text-sm">
                  Pilih user dengan role berbeda untuk testing permission (password: {DEMO_PASSWORD})
                </p>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              {/* User List */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                  {users.map((user) => (
                    <motion.button
                      key={user.id}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleLogin(user)}
                      disabled={loggingIn !== null}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        currentUser?.id === user.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      } ${loggingIn === user.id ? 'opacity-50' : ''}`}
                    >
                      {/* Avatar */}
                      <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                        style={{ backgroundColor: user.profile_bg_color || user.role_color }}
                      >
                        {ROLE_ICONS[user.role] || <FaUser className="w-6 h-6" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{user.full_name}</h4>
                          {currentUser?.id === user.id && (
                            <FaCheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          @{user.username} • {user.email}
                        </p>
                        <span 
                          className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: user.role_color }}
                        >
                          {user.role_display}
                        </span>
                      </div>

                      {/* Loading / Arrow */}
                      <div className="flex-shrink-0">
                        {loggingIn === user.id ? (
                          <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Tidak ada user yang tersedia</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setShowSelector(false)}
                  className="w-full px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}