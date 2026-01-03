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
import { GPDetailModal } from "@/components/global_party/GPDetailModal";
import { GCDetailModal } from "@/components/global_customer/GCDetailModal";
import { BCDetailModal } from "@/components/branch_customer/BCDetailModal";
import type {
  GlobalParty,
  GlobalCustomer,
  BranchCustomer,
} from "@/types/customer";

type MemberType = "all" | "gp" | "gc" | "bc";

interface UnifiedMember {
  type: "gp" | "gc" | "bc";
  id: number;
  name: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  entity: GlobalParty | GlobalCustomer | BranchCustomer;
}

export function MemberList() {
  const [activeTab, setActiveTab] = useState<MemberType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Detail modal state
  const [selectedGP, setSelectedGP] = useState<GlobalParty | null>(null);
  const [selectedGC, setSelectedGC] = useState<GlobalCustomer | null>(null);
  const [selectedBC, setSelectedBC] = useState<BranchCustomer | null>(null);

  // Combine all members into unified array
  const allMembers = useMemo<UnifiedMember[]>(() => {
    const members: UnifiedMember[] = [];

    // Add GPs
    mockGlobalParties.forEach((gp) => {
      members.push({
        type: "gp",
        id: gp.id,
        name: gp.name,
        owner_name: gp.owner_name,
        owner_phone: gp.owner_phone,
        owner_email: gp.owner_email,
        entity: gp,
      });
    });

    // Add GCs
    mockGlobalCustomers.forEach((gc) => {
      members.push({
        type: "gc",
        id: gc.id,
        name: gc.name,
        owner_name: gc.owner_name,
        owner_phone: gc.owner_phone,
        owner_email: gc.owner_email,
        entity: gc,
      });
    });

    // Add BCs
    mockBranchCustomers.forEach((bc) => {
      members.push({
        type: "bc",
        id: bc.id,
        name: bc.name,
        owner_name: bc.owner_name,
        owner_phone: bc.owner_phone,
        owner_email: bc.owner_email,
        entity: bc,
      });
    });

    return members;
  }, []);

  // Filter members by tab
  const filteredByTab = useMemo(() => {
    if (activeTab === "all") return allMembers;
    return allMembers.filter((m) => m.type === activeTab);
  }, [allMembers, activeTab]);

  // Filter by search query
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTab;

    const query = searchQuery.toLowerCase();
    return filteredByTab.filter((member) => {
      return (
        member.name.toLowerCase().includes(query) ||
        member.owner_name?.toLowerCase().includes(query) ||
        member.owner_phone?.toLowerCase().includes(query) ||
        member.owner_email?.toLowerCase().includes(query)
      );
    });
  }, [filteredByTab, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: allMembers.length,
      gp: mockGlobalParties.length,
      gc: mockGlobalCustomers.length,
      bc: mockBranchCustomers.length,
    };
  }, [allMembers.length]);

  const handleMemberClick = (member: UnifiedMember) => {
    if (member.type === "gp") {
      setSelectedGP(member.entity as GlobalParty);
    } else if (member.type === "gc") {
      setSelectedGC(member.entity as GlobalCustomer);
    } else if (member.type === "bc") {
      setSelectedBC(member.entity as BranchCustomer);
    }
  };

  const getTypeConfig = (type: "gp" | "gc" | "bc") => {
    switch (type) {
      case "gp":
        return {
          label: "GP",
          fullLabel: "Global Party",
          bgColor: "bg-purple-500",
          bgLight: "bg-purple-50",
          borderColor: "border-purple-200",
          hoverBorder: "hover:border-purple-400",
          textColor: "text-purple-700",
        };
      case "gc":
        return {
          label: "GC",
          fullLabel: "Global Customer",
          bgColor: "bg-blue-500",
          bgLight: "bg-blue-50",
          borderColor: "border-blue-200",
          hoverBorder: "hover:border-blue-400",
          textColor: "text-blue-700",
        };
      case "bc":
        return {
          label: "BC",
          fullLabel: "Branch Customer",
          bgColor: "bg-orange-500",
          bgLight: "bg-orange-50",
          borderColor: "border-orange-200",
          hoverBorder: "hover:border-orange-400",
          textColor: "text-orange-700",
        };
    }
  };

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
          Kelola semua member (Global Party, Global Customer, Branch Customer)
          dalam satu tampilan
        </p>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer"
          onClick={() => setActiveTab("all")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-100">Total Members</p>
            <FaUsers className="w-5 h-5 text-purple-200" />
          </div>
          <p className="text-4xl font-bold">{stats.total}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-6 text-white cursor-pointer"
          onClick={() => setActiveTab("gp")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-100">Global Party</p>
            <FaBuilding className="w-5 h-5 text-purple-200" />
          </div>
          <p className="text-4xl font-bold">{stats.gp}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer"
          onClick={() => setActiveTab("gc")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-100">Global Customer</p>
            <FaBuilding className="w-5 h-5 text-blue-200" />
          </div>
          <p className="text-4xl font-bold">{stats.gc}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white cursor-pointer"
          onClick={() => setActiveTab("bc")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-orange-100">
              Branch Customer
            </p>
            <FaStore className="w-5 h-5 text-orange-200" />
          </div>
          <p className="text-4xl font-bold">{stats.bc}</p>
        </motion.div>
      </div> */}

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === "all"
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Semua ({stats.total})
        </button>
        <button
          onClick={() => setActiveTab("gp")}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === "gp"
              ? "bg-purple-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          GP ({stats.gp})
        </button>
        <button
          onClick={() => setActiveTab("gc")}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === "gc"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          GC ({stats.gc})
        </button>
        <button
          onClick={() => setActiveTab("bc")}
          className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
            activeTab === "bc"
              ? "bg-orange-500 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          BC ({stats.bc})
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, owner, phone, atau email..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Member Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Menampilkan{" "}
            <span className="font-bold">{filteredMembers.length}</span> member
          </p>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member) => {
              const config = getTypeConfig(member.type);
              return (
                <motion.button
                  key={`${member.type}-${member.id}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleMemberClick(member)}
                  className={`bg-white rounded-2xl shadow-sm border-2 ${config.borderColor} ${config.hoverBorder} p-5 text-left transition-all hover:shadow-md group`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <FaBuilding className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold ${config.textColor} uppercase`}
                        >
                          {config.fullLabel}
                        </span>
                        <p className="text-xs text-gray-500">
                          ID: #{member.id}
                        </p>
                      </div>
                    </div>
                    <FaChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1">
                    {member.name}
                  </h3>

                  {/* Owner Info */}
                  {(member.owner_name ||
                    member.owner_phone ||
                    member.owner_email) && (
                    <div
                      className={`${config.bgLight} rounded-xl p-3 space-y-2`}
                    >
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        User Information
                      </p>

                      {member.owner_name && (
                        <div className="flex items-center gap-2">
                          <FaUser className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-700 font-medium line-clamp-1">
                            {member.owner_name}
                          </p>
                        </div>
                      )}

                      {member.owner_phone && (
                        <div className="flex items-center gap-2">
                          <FaPhone className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-700">
                            {member.owner_phone}
                          </p>
                        </div>
                      )}

                      {member.owner_email && (
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="w-3 h-3 text-gray-400" />
                          <p className="text-sm text-gray-700 line-clamp-1">
                            {member.owner_email}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* No Owner Info */}
                  {!member.owner_name &&
                    !member.owner_phone &&
                    !member.owner_email && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 italic">
                          Informasi owner belum tersedia
                        </p>
                      </div>
                    )}
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <FaSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">
              Tidak ada member ditemukan
            </p>
            <p className="text-sm text-gray-500">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}
      </div>

      {/* Detail Modals */}
      <GPDetailModal
        isOpen={selectedGP !== null}
        onClose={() => setSelectedGP(null)}
        gp={selectedGP}
        onGPUpdate={(updated) => {
          // Refresh data - in real app would refetch
          setSelectedGP(updated);
        }}
        onViewGC={(gc) => {
          setSelectedGP(null);
          setSelectedGC(gc);
        }}
        onViewBC={(bc) => {
          setSelectedGP(null);
          setSelectedBC(bc);
        }}
      />

      <GCDetailModal
        isOpen={selectedGC !== null}
        onClose={() => setSelectedGC(null)}
        gc={selectedGC}
        onViewGP={(gp) => {
          setSelectedGC(null);
          setSelectedGP(gp);
        }}
        onViewBC={(bc) => {
          setSelectedGC(null);
          setSelectedBC(bc);
        }}
      />

      <BCDetailModal
        isOpen={selectedBC !== null}
        onClose={() => setSelectedBC(null)}
        bc={selectedBC}
        onViewGP={(gp) => {
          setSelectedBC(null);
          setSelectedGP(gp);
        }}
        onViewGC={(gc) => {
          setSelectedBC(null);
          setSelectedGC(gc);
        }}
      />
    </div>
  );
}
