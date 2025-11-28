// src/components/branches/BranchList.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import BranchCard from "./BranchCard";
import AddBranchModal from "./AddBranchModal";
import BranchDetailModal from "./BranchDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { FaPlus, FaFilter, FaSearch, FaList, FaMapMarkedAlt, FaSortAmountDown } from "react-icons/fa";
import { motion } from "framer-motion";

type Branch = {
  id: number;
  name: string;
  daerah: string;
  address: string;
  lat: number;
  lng: number;
  pulau: string;
  wilayah: string;
  url: string;
  token: string;
  disabled: number;
};

type SortOption = 'name-asc' | 'name-desc' | 'daerah-asc' | 'daerah-desc' | 'id-asc' | 'id-desc';

const DATA_URL = "/data/branches.json";
const SNAP_KEY = "ekatalog_branches_snapshot";

export default function BranchList() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilayah, setSelectedWilayah] = useState<string | null>(null);
  const [selectedPulau, setSelectedPulau] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('id-asc');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Branch | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Branch | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Load branches
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      
      try {
        const res = await fetch(DATA_URL, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json() as Branch[];
          if (!cancelled) {
            setBranches(data);
            try { localStorage.setItem(SNAP_KEY, JSON.stringify(data)); } catch {}
          }
        } else {
          if (!cancelled) setError(`Failed to fetch branches (${res.status})`);
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Listen for updates
  useEffect(() => {
    function handler() {
      const raw = localStorage.getItem(SNAP_KEY);
      if (!raw) return;
      try { setBranches(JSON.parse(raw) as Branch[]); } catch {}
    }
    window.addEventListener("ekatalog:branches_update", handler);
    return () => window.removeEventListener("ekatalog:branches_update", handler);
  }, []);

  function saveSnapshot(arr: Branch[]) {
    try { localStorage.setItem(SNAP_KEY, JSON.stringify(arr)); } catch {}
    window.dispatchEvent(new Event("ekatalog:branches_update"));
  }

  function promptDeleteBranch(branch: Branch) {
    setConfirmTitle("Hapus Cabang");
    setConfirmDesc(`Yakin ingin menghapus cabang "${branch.name}"?`);
    actionRef.current = async () => {
      const next = branches.filter((x) => x.id !== branch.id);
      setBranches(next);
      saveSnapshot(next);
    };
    setConfirmOpen(true);
  }

  function handleAdd() {
    setModalInitial(null);
    setModalOpen(true);
  }
  
  function handleEdit(branch: Branch) {
    setModalInitial(branch);
    setModalOpen(true);
  }

  function openDetail(branch: Branch) {
    setDetailItem(branch);
    setDetailOpen(true);
  }
  
  function closeDetail() {
    setDetailOpen(false);
    setDetailItem(null);
  }

  function onDetailEdit(branch: Branch) {
    closeDetail();
    setTimeout(() => handleEdit(branch), 80);
  }
  
  function onDetailDelete(branch: Branch) {
    closeDetail();
    setTimeout(() => promptDeleteBranch(branch), 80);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Memuat data cabang...</p>
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

  // Get unique wilayah and pulau for filters
  const wilayahList = Array.from(new Set(branches.map(b => b.wilayah)));
  const pulauList = Array.from(new Set(branches.map(b => b.pulau)));

  // Filter branches
  let filteredBranches = branches;
  
  if (searchQuery.trim()) {
    filteredBranches = filteredBranches.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.daerah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  if (selectedWilayah) {
    filteredBranches = filteredBranches.filter(b => b.wilayah === selectedWilayah);
  }

  if (selectedPulau) {
    filteredBranches = filteredBranches.filter(b => b.pulau === selectedPulau);
  }

  // Sort branches
  const sortedBranches = [...filteredBranches].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'daerah-asc':
        return a.daerah.localeCompare(b.daerah);
      case 'daerah-desc':
        return b.daerah.localeCompare(a.daerah);
      case 'id-asc':
        return a.id - b.id;
      case 'id-desc':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Group by wilayah
  const groupedByWilayah = wilayahList.map(wilayah => ({
    wilayah,
    branches: sortedBranches.filter(b => b.wilayah === wilayah)
  })).filter(group => group.branches.length > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Branches</h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola cabang Ekatunggal di seluruh Indonesia
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
        >
          <FaPlus className="w-4 h-4" />
          <span>Tambah Cabang</span>
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">Total Cabang</div>
          <div className="text-3xl font-bold text-blue-900">{branches.length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">Wilayah Barat</div>
          <div className="text-3xl font-bold text-green-900">
            {branches.filter(b => b.wilayah === 'Barat').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">Wilayah Timur</div>
          <div className="text-3xl font-bold text-purple-900">
            {branches.filter(b => b.wilayah === 'Timur').length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <div className="text-sm text-orange-700 font-medium mb-1">Pulau</div>
          <div className="text-3xl font-bold text-orange-900">{pulauList.length}</div>
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
                placeholder="Cari cabang, daerah, atau alamat..."
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
                <option value="id-asc">ID: Terlama</option>
                <option value="id-desc">ID: Terbaru</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="daerah-asc">Daerah: A-Z</option>
                <option value="daerah-desc">Daerah: Z-A</option>
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
                <FaMapMarkedAlt className="w-5 h-5" />
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
            
            {/* Wilayah Filter */}
            <button
              onClick={() => setSelectedWilayah(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedWilayah === null
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Wilayah
            </button>
            {wilayahList.map(wilayah => (
              <button
                key={wilayah}
                onClick={() => setSelectedWilayah(wilayah)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedWilayah === wilayah
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {wilayah}
              </button>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Pulau Filter */}
            {pulauList.map(pulau => (
              <button
                key={pulau}
                onClick={() => setSelectedPulau(selectedPulau === pulau ? null : pulau)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedPulau === pulau
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {pulau}
              </button>
            ))}
          </div>

          {/* Active Filters Info */}
          {(searchQuery || selectedWilayah || selectedPulau || sortBy !== 'id-asc') && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-500">Filter aktif:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Pencarian: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedWilayah && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Wilayah: {selectedWilayah}
                </span>
              )}
              {selectedPulau && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  Pulau: {selectedPulau}
                </span>
              )}
              {sortBy !== 'id-asc' && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                  Sort: {sortBy.split('-').join(' ').toUpperCase()}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedWilayah(null);
                  setSelectedPulau(null);
                  setSortBy('id-asc');
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
              >
                Reset Semua
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Branches Display */}
      {sortedBranches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada cabang</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada cabang yang ditambahkan'}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedByWilayah.map(({ wilayah, branches: wilayahBranches }) => (
            <section key={wilayah}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Wilayah {wilayah}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {wilayahBranches.length} cabang di wilayah {wilayah.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {wilayahBranches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    viewMode={viewMode}
                    onEdit={() => handleEdit(branch)}
                    onDelete={() => promptDeleteBranch(branch)}
                    onView={() => openDetail(branch)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddBranchModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        initial={modalInitial}
      />
      
      <BranchDetailModal 
        open={detailOpen} 
        onClose={closeDetail} 
        branch={detailItem} 
        onEdit={onDetailEdit} 
        onDelete={onDetailDelete} 
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