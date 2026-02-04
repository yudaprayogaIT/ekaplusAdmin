"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaBuilding,
  FaStore,
  FaSearch,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
} from "react-icons/fa";
import { mockGlobalParties } from "@/data/mockGlobalParties";
import { mockGlobalCustomers } from "@/data/mockGlobalCustomers";
import { mockBranchCustomers } from "@/data/mockBranchCustomers";
import { MemberDetailModal } from "./MemberDetailModal";
import type {
  GlobalParty,
  GlobalCustomer,
  BranchCustomer,
} from "@/types/customer";

interface UserMember {
  owner_name: string;
  owner_phone?: string;
  owner_email?: string;
  companies: {
    gps: GlobalParty[];
    gcs: GlobalCustomer[];
    bcs: BranchCustomer[];
  };
  totalCompanies: number;
}

export function MemberList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserMember | null>(null);

  // Group entities by owner (user)
  const userMembers = useMemo<UserMember[]>(() => {
    const userMap = new Map<string, UserMember>();

    // Process all entities and group by owner_name
    [...mockGlobalParties, ...mockGlobalCustomers, ...mockBranchCustomers].forEach((entity) => {
      if (!entity.owner_name) return;

      const key = entity.owner_name.toLowerCase();

      if (!userMap.has(key)) {
        userMap.set(key, {
          owner_name: entity.owner_name,
          owner_phone: entity.owner_phone,
          owner_email: entity.owner_email,
          companies: {
            gps: [],
            gcs: [],
            bcs: [],
          },
          totalCompanies: 0,
        });
      }

      const user = userMap.get(key)!;

      // Add to appropriate category
      if ("gc_id" in entity && "branch_id" in entity) {
        // BranchCustomer (has gc_id and branch_id)
        user.companies.bcs.push(entity as BranchCustomer);
      } else if ("gp_id" in entity) {
        // GlobalCustomer (has gp_id, but not gc_id)
        user.companies.gcs.push(entity as GlobalCustomer);
      } else {
        // GlobalParty (no gp_id, gc_id, or branch_id)
        user.companies.gps.push(entity as GlobalParty);
      }

      // Update contact info if more complete
      if (entity.owner_phone && !user.owner_phone) {
        user.owner_phone = entity.owner_phone;
      }
      if (entity.owner_email && !user.owner_email) {
        user.owner_email = entity.owner_email;
      }
    });

    // Calculate total companies for each user
    userMap.forEach((user) => {
      user.totalCompanies =
        user.companies.gps.length +
        user.companies.gcs.length +
        user.companies.bcs.length;
    });

    return Array.from(userMap.values()).sort((a, b) =>
      a.owner_name.localeCompare(b.owner_name)
    );
  }, []);

  // Filter by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return userMembers;

    const query = searchQuery.toLowerCase();
    return userMembers.filter((user) => {
      return (
        user.owner_name.toLowerCase().includes(query) ||
        user.owner_phone?.toLowerCase().includes(query) ||
        user.owner_email?.toLowerCase().includes(query)
      );
    });
  }, [userMembers, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalGPs = userMembers.reduce((sum, u) => sum + u.companies.gps.length, 0);
    const totalGCs = userMembers.reduce((sum, u) => sum + u.companies.gcs.length, 0);
    const totalBCs = userMembers.reduce((sum, u) => sum + u.companies.bcs.length, 0);

    return {
      totalUsers: userMembers.length,
      totalCompanies: totalGPs + totalGCs + totalBCs,
      avgCompaniesPerUser:
        userMembers.length > 0
          ? ((totalGPs + totalGCs + totalBCs) / userMembers.length).toFixed(1)
          : "0",
    };
  }, [userMembers]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <FaUsers className="w-6 h-6 text-white" />
          </div>
          Members Management
        </h1>
        <p className="text-gray-600 mt-2">
          Kelola semua member (user/owner) dan lihat perusahaan yang mereka miliki
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-100">Total Users</p>
            <FaUsers className="w-5 h-5 text-purple-200" />
          </div>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
          <p className="text-xs text-purple-100 mt-1">Unique owners</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-100">Total Companies</p>
            <FaBuilding className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-4xl font-bold">{stats.totalCompanies}</p>
          <p className="text-xs text-blue-100 mt-1">GP + GC + BC</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-100">Average</p>
            <FaStore className="w-5 h-5 text-orange-200" />
          </div>
          <p className="text-4xl font-bold">{stats.avgCompaniesPerUser}</p>
          <p className="text-xs text-orange-100 mt-1">Companies per user</p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, phone, atau email..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* User Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Menampilkan <span className="font-bold">{filteredUsers.length}</span> user
          </p>
        </div>

        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user, index) => (
              <motion.button
                key={`${user.owner_name}-${index}`}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedUser(user)}
                className="bg-white rounded-2xl shadow-sm border-2 border-purple-200 hover:border-purple-400 p-5 text-left transition-all hover:shadow-md group"
              >
                {/* User Avatar & Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <FaUser className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {user.owner_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {user.totalCompanies} perusahaan
                      </p>
                    </div>
                  </div>
                  <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </div>

                {/* Contact Info */}
                <div className="bg-purple-50 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Contact Information
                  </p>

                  {user.owner_phone && (
                    <div className="flex items-center gap-2">
                      <FaPhone className="w-3 h-3 text-purple-400" />
                      <p className="text-sm text-gray-700">{user.owner_phone}</p>
                    </div>
                  )}

                  {user.owner_email && (
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="w-3 h-3 text-purple-400" />
                      <p className="text-sm text-gray-700 line-clamp-1">
                        {user.owner_email}
                      </p>
                    </div>
                  )}

                  {!user.owner_phone && !user.owner_email && (
                    <p className="text-xs text-gray-500 italic">
                      Informasi kontak belum tersedia
                    </p>
                  )}
                </div>

                {/* Companies Summary */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {user.companies.gps.length > 0 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      {user.companies.gps.length} GP
                    </span>
                  )}
                  {user.companies.gcs.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {user.companies.gcs.length} GC
                    </span>
                  )}
                  {user.companies.bcs.length > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                      {user.companies.bcs.length} BC
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <FaSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">
              Tidak ada user ditemukan
            </p>
            <p className="text-sm text-gray-500">
              Coba ubah kata kunci pencarian
            </p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <MemberDetailModal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
}
