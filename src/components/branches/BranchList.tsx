// src/components/branches/BranchList.tsx
"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import BranchCard from "./BranchCard";
import AddBranchModal from "./AddBranchModal";
import BranchDetailModal from "./BranchDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  useAuth,
} from "@/contexts/AuthContext";
import {
  getQueryUrl,
  getResourceUrl,
  getAuthHeaders,
  API_CONFIG,
  apiFetch,
} from "@/config/api";
import {
  FaPlus,
  FaFilter,
  FaSearch,
  FaList,
  FaMapMarkedAlt,
  FaSortAmountDown,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

export type Branch = {
  id: number;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  island: string;
  area: string;
  url: string;
  token: string;
  disabled: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string | number;
  updated_by?: string | number;
  owner?: string | number;
};

// API Response structure from SQL backend
type BranchAPIResponse = {
  status: string;
  code: string;
  message: string;
  data: Array<{
    id: number;
    branch_name: string; // API uses branch_name, we map to name
    city: string;
    address: string;
    lat: string; // API returns string, we convert to number
    lng: string; // API returns string, we convert to number
    island: string;
    area: string;
    url: string;
    token: string;
    disabled: number;
    created_at: string;
    updated_at: string;
    created_by: number | { id?: number; full_name?: string };
    updated_by: number | { id?: number; full_name?: string };
    owner: number | { id?: number; full_name?: string };
    status: string;
    docstatus: number;
  }>;
  meta: Record<string, unknown>;
};

type SortOption =
  | "name-asc"
  | "name-desc"
  | "kota-asc"
  | "kota-desc"
  | "id-asc"
  | "id-desc";

const SNAP_KEY = "ekatalog_branches_snapshot";

export default function BranchList() {
  const {
    hasPermission,
    isAuthenticated,
    isLoading: authLoading,
    token,
  } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code?: number; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("id-asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<Branch | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Branch | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Permission checks
  // const canViewBranches = hasPermission('branches.view');
  const canManageBranches = hasPermission("branches.manage");

  // Extract data loading logic into reusable function
  const loadBranches = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
        fields: [
          "*",
          "created_by.full_name",
          "updated_by.full_name",
          "owner.full_name",
        ],
      });
      const headers = getAuthHeaders(token);

      const res = await apiFetch(DATA_URL, {
        method: "GET",
        cache: "no-store",
        headers,
      });

      if (res.ok) {
        const response = (await res.json()) as BranchAPIResponse;

        // Map API response to Branch type
        const mappedBranches: Branch[] = response.data.map((item) => ({
          id: item.id,
          name: item.branch_name, // Map branch_name to name
          city: item.city,
          address: item.address,
          lat: parseFloat(item.lat) || 0, // Convert string to number
          lng: parseFloat(item.lng) || 0, // Convert string to number
          island: item.island,
          area: item.area,
          url: item.url,
          token: item.token,
          disabled: item.disabled,
          created_at: item.created_at,
          updated_at: item.updated_at,
          created_by:
            typeof item.created_by === "object"
              ? item.created_by.full_name || "Unknown"
              : item.created_by,
          updated_by:
            typeof item.updated_by === "object"
              ? item.updated_by.full_name || "Unknown"
              : item.updated_by,
          owner:
            typeof item.owner === "object"
              ? item.owner.full_name || "Unknown"
              : item.owner,
        }));

        console.log("Loaded branches:", mappedBranches);
        setBranches(mappedBranches);
        try {
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedBranches));
        } catch (e) {
          console.error("Failed to save snapshot:", e);
        }
      } else {
        const errorCode = res.status;
        let errorMessage = "";

        if (res.status === 401) {
          errorMessage = "Session expired. Silakan login kembali.";
        } else if (res.status === 403) {
          errorMessage = "Akses ditolak. Anda tidak memiliki izin.";
        } else {
          errorMessage = `Gagal memuat data branches.`;
        }

        setError({ code: errorCode, message: errorMessage });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes("Failed to fetch")) {
        setError({
          message: "Tidak dapat terhubung ke server. Periksa koneksi Anda atau pastikan backend berjalan."
        });
      } else {
        setError({ message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load branches on mount - only if authenticated and has token
  useEffect(() => {
    loadBranches();
  }, [isAuthenticated, token]);

  // Listen for updates - reload from API when triggered
  useEffect(() => {
    async function handler() {
      // Reload from API instead of localStorage
      if (!isAuthenticated || !token) return;

      try {
        const DATA_URL = getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, {
          fields: [
            "*",
            "created_by.full_name",
            "updated_by.full_name",
            "owner.full_name",
          ],
        });
        const headers = getAuthHeaders(token);

        const res = await apiFetch(DATA_URL, {
          method: "GET",
          cache: "no-store",
          headers,
        });

        if (res.ok) {
          const response = (await res.json()) as BranchAPIResponse;

          const mappedBranches: Branch[] = response.data.map((item) => ({
            id: item.id,
            name: item.branch_name,
            city: item.city,
            address: item.address,
            lat: parseFloat(item.lat) || 0,
            lng: parseFloat(item.lng) || 0,
            island: item.island,
            area: item.area,
            url: item.url,
            token: item.token,
            disabled: item.disabled,
            created_at: item.created_at,
            updated_at: item.updated_at,
            created_by:
              typeof item.created_by === "object"
                ? item.created_by.full_name || "Unknown"
                : item.created_by,
            updated_by:
              typeof item.updated_by === "object"
                ? item.updated_by.full_name || "Unknown"
                : item.updated_by,
            owner:
              typeof item.owner === "object"
                ? item.owner.full_name || "Unknown"
                : item.owner,
          }));

          setBranches(mappedBranches);
          localStorage.setItem(SNAP_KEY, JSON.stringify(mappedBranches));
        }
      } catch (error) {
        console.error("Failed to reload branches:", error);
      }
    }

    window.addEventListener("ekatalog:branches_update", handler);
    return () =>
      window.removeEventListener("ekatalog:branches_update", handler);
  }, [isAuthenticated, token]);

  function saveSnapshot(arr: Branch[]) {
    try {
      localStorage.setItem(SNAP_KEY, JSON.stringify(arr));
    } catch {}
    window.dispatchEvent(new Event("ekatalog:branches_update"));
  }

  function promptDeleteBranch(branch: Branch) {
    setConfirmTitle("Hapus Cabang");
    setConfirmDesc(`Yakin ingin menghapus cabang "${branch.name}"?`);
    actionRef.current = async () => {
      try {
        if (!token) {
          throw new Error("Not authenticated");
        }

        const headers = getAuthHeaders(token);

        const response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.BRANCH, branch.id),
          {
            method: "DELETE",
            headers,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Failed to delete branch (${response.status})`
          );
        }

        console.log("Branch deleted successfully");

        // Remove from local state
        const next = branches.filter((x) => x.id !== branch.id);
        setBranches(next);
        saveSnapshot(next);
      } catch (err: unknown) {
        console.error("Failed to delete branch:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError({message: errorMessage});
      }
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Diperlukan
          </h2>
          <p className="text-gray-600 mb-6">
            Silakan login terlebih dahulu untuk mengakses data Branches. Klik
            tombol Login di pojok kanan atas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-200 text-sm">
            <FaMapMarkerAlt className="w-4 h-4" />
            <span>Data cabang dilindungi untuk keamanan</span>
          </div>
        </div>
      </div>
    );
  }

  // Check permission
  // if (!canViewBranches) {
  //   return (
  //     <div className="flex items-center justify-center py-20">
  //       <div className="text-center max-w-md mx-auto">
  //         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
  //           <FaLock className="w-10 h-10 text-gray-400" />
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-800 mb-3">Akses Ditolak</h2>
  //         <p className="text-gray-600">
  //           Anda tidak memiliki permission untuk melihat data Branches.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat data cabang...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        errorCode={error.code}
        message={error.message}
        onRetry={loadBranches}
        showRetry={true}
      />
    );
  }

  // Get unique wilayah and pulau for filters
  const areaList = Array.from(new Set(branches.map((b) => b.area)));
  const islandList = Array.from(new Set(branches.map((b) => b.island)));

  // Filter branches
  let filteredBranches = branches;

  if (searchQuery.trim()) {
    filteredBranches = filteredBranches.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (selectedArea) {
    filteredBranches = filteredBranches.filter((b) => b.area === selectedArea);
  }

  if (selectedIsland) {
    filteredBranches = filteredBranches.filter(
      (b) => b.island === selectedIsland
    );
  }

  // Sort branches
  const sortedBranches = [...filteredBranches].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "kota-asc":
        return a.city.localeCompare(b.city);
      case "kota-desc":
        return b.city.localeCompare(a.city);
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Group by wilayah
  const groupedByArea = areaList
    .map((area) => ({
      area,
      branches: sortedBranches.filter((b) => b.area === area),
    }))
    .filter((group) => group.branches.length > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Branches
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Kelola cabang Ekatunggal di seluruh Indonesia
          </p>
        </div>

        {canManageBranches ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
          >
            <FaPlus className="w-4 h-4" />
            <span>Tambah Cabang</span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed">
            <FaLock className="w-4 h-4" />
            <span>Tambah Cabang</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
          <div className="text-sm text-blue-700 font-medium mb-1">
            Total Cabang
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {branches.length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
          <div className="text-sm text-green-700 font-medium mb-1">
            Area Barat
          </div>
          <div className="text-3xl font-bold text-green-900">
            {branches.filter((b) => b.area === "Barat").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200">
          <div className="text-sm text-purple-700 font-medium mb-1">
            Area Timur
          </div>
          <div className="text-3xl font-bold text-purple-900">
            {branches.filter((b) => b.area === "Timur").length}
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border-2 border-orange-200">
          <div className="text-sm text-orange-700 font-medium mb-1">Pulau</div>
          <div className="text-3xl font-bold text-orange-900">
            {islandList.length}
          </div>
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
                placeholder="Cari cabang, kota, atau alamat..."
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="id-asc">ID: Terlama</option>
                <option value="id-desc">ID: Terbaru</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
                <option value="kota-asc">Kota: A-Z</option>
                <option value="kota-desc">Kota: Z-A</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaMapMarkedAlt className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <FaFilter className="w-4 h-4 text-gray-400 flex-shrink-0" />

            {/* Area Filter */}
            <button
              onClick={() => setSelectedArea(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                selectedArea === null
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Semua Area
            </button>
            {areaList.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedArea === area
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Area {area}
              </button>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-2 hidden md:block" />

            {/* Island Filter */}
            {islandList.map((island) => (
              <button
                key={island}
                onClick={() =>
                  setSelectedIsland(selectedIsland === island ? null : island)
                }
                className={`overf px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedIsland === island
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {island}
              </button>
            ))}

            {/* Reset Filter Button - Show if any filter is active */}
            {(searchQuery || selectedArea || selectedIsland) && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-2" />
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedArea(null);
                    setSelectedIsland(null);
                  }}
                  className="px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap bg-orange-100 text-orange-700 hover:bg-orange-200 border-2 border-orange-300 flex items-center gap-2"
                >
                  <span className="text-lg">×</span>
                  <span>Reset Filter</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Branches Display */}
      {sortedBranches.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaSearch className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tidak ada cabang
          </h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "Coba ubah kata kunci pencarian"
              : "Belum ada cabang yang ditambahkan"}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedByArea.map(({ area, branches: areaBranches }) => (
            <section key={area}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Area {area}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {areaBranches.length} cabang di area {area.toLowerCase()}
                  </p>
                </div>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {areaBranches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    viewMode={viewMode}
                    onEdit={() => handleEdit(branch)}
                    onDelete={() => promptDeleteBranch(branch)}
                    onView={() => openDetail(branch)}
                    canEdit={canManageBranches}
                    canDelete={canManageBranches}
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
        canEdit={canManageBranches}
        canDelete={canManageBranches}
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
