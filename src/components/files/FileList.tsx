// src/components/files/FileList.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FileCard from "./FileCard";
import FileDetailModal from "./FileDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  FaFilter,
  FaSearch,
  FaList,
  FaTh,
  FaFolder,
  FaFileAlt,
  FaImage,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchFiles,
  deleteFile,
  type FileListMeta,
  type FileItem,
  isImageFile,
} from "@/services/fileService";

type ViewMode = "grid" | "list";
const PAGE_SIZE = 20;

export default function FileList() {
  const { token, isAuthenticated } = useAuth();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [meta, setMeta] = useState<FileListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<FileItem | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  const loadFiles = useCallback(
    async (nextPage: number, replace: boolean) => {
      if (isFetchingRef.current) {
        return;
      }

      if (!isAuthenticated || !token) {
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      isFetchingRef.current = true;

      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const response = await fetchFiles(token, {
          page: nextPage,
          limit: PAGE_SIZE,
        });

        setFiles((prev) =>
          replace
            ? response.data
            : [...prev, ...response.data.filter((item) => !prev.some((f) => f.uuid === item.uuid))]
        );
        setMeta(response.meta);
        setCurrentPage(nextPage);
        setHasMore(
          response.meta
            ? Number(response.meta.page) < Number(response.meta.total_pages)
            : response.data.length >= PAGE_SIZE
        );
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
        if (replace) {
          setFiles([]);
        }
        setHasMore(false);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [isAuthenticated, token]
  );

  useEffect(() => {
    setFiles([]);
    setMeta(null);
    setCurrentPage(1);
    setHasMore(true);
    void loadFiles(1, true);
  }, [loadFiles]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node || loading || loadingMore || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;
        void loadFiles(currentPage + 1, false);
      },
      {
        root: null,
        rootMargin: "240px 0px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [currentPage, hasMore, loadFiles, loading, loadingMore]);

  // Get unique folders for filter
  const uniqueFolders = useMemo(
    () => Array.from(new Set(files.map((f) => f.folder))).sort(),
    [files]
  );

  const imageCount = useMemo(
    () => files.filter((f) => isImageFile(f.mime_type)).length,
    [files]
  );

  // Filter and search files
  const filteredFiles = useMemo(
    () =>
      files.filter((file) => {
        const matchesSearch =
          searchQuery === "" ||
          file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.folder.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.uuid.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFolder =
          filterFolder === "all" || file.folder === filterFolder;

        const matchesType =
          filterType === "all" ||
          (filterType === "image" && isImageFile(file.mime_type)) ||
          (filterType === "other" && !isImageFile(file.mime_type));

        return matchesSearch && matchesFolder && matchesType;
      }),
    [files, filterFolder, filterType, searchQuery]
  );

  // Handle detail view
  const handleViewDetail = (file: FileItem) => {
    setDetailItem(file);
    setDetailOpen(true);
  };

  // Handle delete
  const handleDelete = async (file: FileItem) => {
    setConfirmTitle("Hapus File");
    setConfirmDesc(
      `Apakah Anda yakin ingin menghapus file "${file.file_name}"? Tindakan ini tidak dapat dibatalkan.`
    );
    actionRef.current = async () => {
      try {
        if (!token) throw new Error("Not authenticated");
        await deleteFile(file.uuid, token);
        setFiles((prev) => prev.filter((f) => f.uuid !== file.uuid));
        setMeta((prev) =>
          prev
            ? {
                ...prev,
                total: Math.max(0, prev.total - 1),
              }
            : prev
        );
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete file");
      }
    };
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (actionRef.current) {
      await actionRef.current();
      actionRef.current = null;
    }
    setConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                  <FaFolder className="w-6 h-6 text-white" />
                </div>
                File Management
              </h1>
              <p className="text-gray-600 mt-2">
                Kelola file dan gambar yang ada di sistem
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaFileAlt className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {meta?.total ?? files.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaImage className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Images</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {imageCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaFolder className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Folders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {uniqueFolders.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari file..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Folder Filter */}
              <div>
                <div className="relative">
                  <FaFolder className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterFolder}
                    onChange={(e) => setFilterFolder(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white transition-all"
                  >
                    <option value="all">Semua Folder</option>
                    {uniqueFolders.map((folder) => (
                      <option key={folder} value={folder}>
                        {folder}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <div className="relative">
                  <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white transition-all"
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="image">Gambar</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-600 mr-2">Tampilan:</span>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-red-100 text-red-600"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <FaTh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-red-100 text-red-600"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <FaList className="w-4 h-4" />
              </button>
              <span className="ml-auto text-sm text-gray-600">
                {filteredFiles.length} file(s) dari {files.length} loaded
              </span>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-600">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Files List */}
        {!loading && !error && (
          <>
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <FaFileAlt className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">Tidak ada file ditemukan</p>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.uuid}
                      file={file}
                      viewMode={viewMode}
                      onViewDetail={handleViewDetail}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {(hasMore || loadingMore) && (
                  <div ref={loaderRef} className="py-8 flex justify-center">
                    {loadingMore ? (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                        Memuat file berikutnya...
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Scroll ke bawah untuk memuat lebih banyak file
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <FileDetailModal
          isOpen={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setDetailItem(null);
          }}
          file={detailItem}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={confirmTitle}
        description={confirmDesc}
        variant="danger"
      />
    </div>
  );
}
