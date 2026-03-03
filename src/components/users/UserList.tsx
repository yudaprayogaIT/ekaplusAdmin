// src/components/users/UserList.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import UserCard from "./UserCard";
import AddUserModal from "./AddUserModal";
import UserDetailModal from "./UserDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaSortAmountDown,
  FaUsers,
  FaUserShield,
  FaUserTie,
  FaUserCog,
  FaLock,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { apiFetch } from "@/config/api";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  gender: string;
  date_of_birth: string;
  birth_place: string;
  profile_pic: string | null;
  profile_bg_color: string | null;
  picture: string | null;
  google_id: string | null;
  google_access_token: string | null;
  google_refresh_token: string | null;
  google_token_expiry: string | null;
  referral_code: string | null;
  referred_by: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  role_id: string;
  role: string;
  branch_id: string | null;
  status: string;
  workflow_state: string | null;
  active_customer_id: string | null;
  token_version: number;
  last_login: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  is_system: boolean;
};

export type Role = {
  id: string;
  name: string;
  display_name: string;
  description: string;
  level: number;
  color: string;
  icon: string;
  is_system: boolean;
  can_be_deleted: boolean;
  status: string;
};

type SortOption = 'name-asc' | 'name-desc' | 'created-asc' | 'created-desc' | 'role-asc' | 'role-desc';

const DATA_URL = "/data/users.json";
const ROLES_URL = "/data/roles.json";
const SNAP_KEY = "ekaplus_users_snapshot";

export default function UserList() {
  const { hasPermission, currentRole, currentUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('created-desc');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<User | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<User | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Permission checks
  const canViewUsers = hasPermission('users.view') || hasPermission('users.view_branch');
  const canCreateUsers = hasPermission('users.create');
  const canEditUsers = hasPermission('users.edit');
  const canDeleteUsers = hasPermission('users.delete');

  // Load users and roles - only if authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      
      try {
        // Load users
        const usersRes = await apiFetch(DATA_URL, { cache: "no-store" });
        if (usersRes.ok) {
          const data = await usersRes.json();
          if (!cancelled) {
            const usersList = data.users || [];
            setUsers(usersList);
            try { localStorage.setItem(SNAP_KEY, JSON.stringify(usersList)); } catch {}
          }
        } else {
          if (!cancelled) setError(`Failed to fetch users (${usersRes.status})`);
        }

        // Load roles
        const rolesRes = await apiFetch(ROLES_URL, { cache: "no-store" });
        if (rolesRes.ok) {
          const rolesData = await rolesRes.json();
          if (!cancelled) {
            setRoles(rolesData.roles || []);
          }
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try { setUsers(JSON.parse(raw) as User[]); } catch {}
    }
    window.addEventListener("ekaplus:users_update", handler);
    return () => window.removeEventListener("ekaplus:users_update", handler);
  }, []);

  function saveSnapshot(arr: User[]) {
    try { localStorage.setItem(SNAP_KEY, JSON.stringify(arr)); } catch {}
    window.dispatchEvent(new Event("ekaplus:users_update"));
  }

  function promptDeleteUser(user: User) {
    if (user.is_system) {
      alert("User sistem tidak dapat dihapus!");
      return;
    }
    setConfirmTitle("Hapus User");
    setConfirmDesc(`Yakin ingin menghapus user "${user.full_name}"?`);
    actionRef.current = async () => {
      const next = users.filter((x) => x.id !== user.id);
      setUsers(next);
      saveSnapshot(next);
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }
  
  function handleEdit(user: User) {
    setModalInitial(user);
    setModalOpen(true);
  }

  function openDetail(user: User) {
    setDetailItem(user);
    setDetailOpen(true);
  }
  
  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(user: User) {
    closeDetail();
    setTimeout(() => handleEdit(user), 80);
  }
  
  function onDetailDelete(user: User) {
    closeDetail();
    setTimeout(() => promptDeleteUser(user), 80);
  }

  async function confirmOk() {
    setConfirmOpen(false);
    if (actionRef.current) { 
      await actionRef.current(); 
      actionRef.current = null; 
    }
  }
  
  function confirmCancel() { 
    actionRef.current = null; 
    setConfirmOpen(false); 
  }

  // Get role info
  function getRoleInfo(roleName: string): Role | undefined {
    return roles.find(r => r.name === roleName);
  }

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login required
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Login Diperlukan</h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Users.
            Klik tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaUsers className="w-4 h-4" />
            <span>Data users dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  // Check permission
  if (!canViewUsers) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Akses Ditolak</h2>
          <p className="text-gray-600">
            Anda tidak memiliki permission untuk melihat data Users.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat data users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      </div>
    );
  }

  // Get unique status for filters
  const statusList = ['active', 'inactive', 'suspended'];

  // Filter users based on permissions
  let filteredUsers = users;

  // Admin cabang can only see users in their branch
  if (currentRole?.name === 'admin_cabang' && currentUser?.branch_id) {
    filteredUsers = filteredUsers.filter(u => 
      u.branch_id === currentUser.branch_id || u.role === 'customer'
    );
  }
  
  if (searchQuery.trim()) {
    filteredUsers = filteredUsers.filter(u => 
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (selectedRole) {
    filteredUsers = filteredUsers.filter(u => u.role === selectedRole);
  }

  if (selectedStatus) {
    filteredUsers = filteredUsers.filter(u => u.status === selectedStatus);
  }

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.full_name.localeCompare(b.full_name);
      case 'name-desc':
        return b.full_name.localeCompare(a.full_name);
      case 'created-asc':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'created-desc':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'role-asc':
        return (getRoleInfo(a.role)?.level || 0) - (getRoleInfo(b.role)?.level || 0);
      case 'role-desc':
        return (getRoleInfo(b.role)?.level || 0) - (getRoleInfo(a.role)?.level || 0);
      default:
        return 0;
    }
  });

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'administrator').length,
    adminPusat: users.filter(u => u.role === 'admin_pusat').length,
    adminCabang: users.filter(u => u.role === 'admin_cabang').length,
    regularUsers: users.filter(u => u.role === 'customer').length,
    active: users.filter(u => u.status === 'active').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Users</h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola pengguna aplikasi EKA+
          </p>
        </div>
        
        {/* Only show Add button if user has permission */}
        {canCreateUsers ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah User</span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed">
            <FaLock className="w-4 h-4" />
            <span>Tambah User</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-700 font-medium">Total Users</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <FaUserShield className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">Administrator</span>
          </div>
          <div className="text-2xl font-bold text-amber-900">{stats.admins}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FaUserTie className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-purple-700 font-medium">Admin Pusat</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">{stats.adminPusat}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <FaUserCog className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700 font-medium">Admin Cabang</span>
          </div>
          <div className="text-2xl font-bold text-green-900">{stats.adminCabang}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-700 font-medium">Customer</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.regularUsers}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border-2 border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-700 font-medium">Active</span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">{stats.active}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search, Sort & View Toggle */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, email, telepon, atau username..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="created-desc">Terbaru</option>
                <option value="created-asc">Terlama</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="role-desc">Role: Tertinggi</option>
                <option value="role-asc">Role: Terendah</option>
              </select>
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaTh className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <FaFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            
            {/* Role Filter */}
            <button
              onClick={() => setSelectedRole(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedRole === null
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Role
            </button>
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedRole === role.name
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedRole === role.name ? { backgroundColor: role.color } : {}}
              >
                {role.display_name}
              </button>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Status Filter */}
            {statusList.map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap capitalize ${
                  selectedStatus === status
                    ? status === 'active' 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : status === 'inactive'
                      ? 'bg-gray-500 text-white shadow-lg shadow-gray-200'
                      : 'bg-red-500 text-white shadow-lg shadow-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Active Filters Info */}
          {(searchQuery || selectedRole || selectedStatus || sortBy !== 'created-desc') && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">Filter aktif:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Pencarian: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedRole && (
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getRoleInfo(selectedRole)?.color || '#6B7280' }}
                >
                  Role: {getRoleInfo(selectedRole)?.display_name}
                </span>
              )}
              {selectedStatus && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  selectedStatus === 'active' ? 'bg-green-100 text-green-700' :
                  selectedStatus === 'inactive' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  Status: {selectedStatus}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole(null);
                  setSelectedStatus(null);
                  setSortBy('created-desc');
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                Reset Semua
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Users Display */}
      {sortedUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada user</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada user yang ditambahkan'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {sortedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              role={getRoleInfo(user.role)}
              viewMode={viewMode}
              onEdit={() => handleEdit(user)}
              onDelete={() => promptDeleteUser(user)}
              onView={() => openDetail(user)}
              canEdit={canEditUsers}
              canDelete={canDeleteUsers}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddUserModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initial={modalInitial}
        roles={roles}
      />
      
      <UserDetailModal 
        open={detailOpen} 
        onClose={closeDetail} 
        user={detailItem} 
        role={detailItem ? getRoleInfo(detailItem.role) : undefined}
        onEdit={onDetailEdit} 
        onDelete={onDetailDelete}
        canEdit={canEditUsers}
        canDelete={canDeleteUsers}
      />

      <ConfirmDialog 
        open={confirmOpen} 
        title={confirmTitle} 
        description={confirmDesc} 
        onConfirm={confirmOk} 
        onCancel={confirmCancel} 
        confirmLabel="Ya, Hapus" 
        cancelLabel="Batal" 
      />
    </div>
  );
}