// src/components/files/FileDetailModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaFile,
  FaFolder,
  FaCalendar,
  FaClock,
  FaFingerprint,
  FaImage,
} from "react-icons/fa";
import FilePreviewImage from "./FilePreviewImage";
import {
  type FileItem,
  formatFileSize,
  isImageFile,
  getFolderBadgeColor,
  getFileTypeBadgeColor,
} from "@/services/fileService";

interface FileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileItem;
}

export default function FileDetailModal({
  isOpen,
  onClose,
  file,
}: FileDetailModalProps) {
  const isImage = isImageFile(file.mime_type);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [imageZoomOrigin, setImageZoomOrigin] = useState({ x: 50, y: 50 });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                onClose();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

                {/* Header Content */}
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      {isImage ? (
                        <FaImage className="w-8 h-8 text-white" />
                      ) : (
                        <FaFile className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Detail File
                      </h2>
                      <p className="text-red-100 text-sm">
                        Informasi lengkap tentang file
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <FaTimes className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Preview Section */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                      Preview
                    </h3>
                    <div className="rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                      {isImage ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreviewOpen(true);
                              setImageZoomed(false);
                              setImageZoomOrigin({ x: 50, y: 50 });
                            }}
                            className="block w-full text-left transition hover:bg-white"
                          >
                            <div className="relative aspect-video w-full bg-white">
                              <FilePreviewImage
                                file={file}
                                alt={file.file_name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </button>
                          <p className="px-4 py-3 text-xs text-gray-500">
                            Klik gambar untuk melihat preview lebih besar.
                          </p>
                        </>
                      ) : (
                        <div className="aspect-video flex items-center justify-center">
                          <div className="text-center">
                            <FaFile className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">
                              No preview available
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                              {file.mime_type}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4">
                      Informasi File
                    </h3>
                    <div className="space-y-4">
                      {/* File Name */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaFile className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 mb-1">
                              File Name
                            </p>
                            <p className="font-semibold text-gray-900 break-all">
                              {file.file_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Folder */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaFolder className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 mb-1">Folder</p>
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${getFolderBadgeColor(file.folder)}`}
                            >
                              {file.folder}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* File Type & Size */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-600 mb-2">
                            File Type
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getFileTypeBadgeColor(file.mime_type)}`}
                          >
                            {file.mime_type}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-600 mb-2">
                            File Size
                          </p>
                          <p className="font-semibold text-gray-900">
                            {formatFileSize(file.file_size)}
                          </p>
                        </div>
                      </div>

                      {/* UUID */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FaFingerprint className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 mb-1">UUID</p>
                            <p className="font-mono text-xs text-gray-900 break-all">
                              {file.uuid}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaCalendar className="w-4 h-4 text-gray-600" />
                            <p className="text-xs text-gray-600">Created</p>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {new Date(file.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(file.created_at).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FaClock className="w-4 h-4 text-gray-600" />
                            <p className="text-xs text-gray-600">Updated</p>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {new Date(file.updated_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(file.updated_at).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {file.description && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-600 mb-2">
                            Description
                          </p>
                          <p className="text-gray-900">{file.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              {/* <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDelete(file)}
                  className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
                >
                  <FaTrash className="w-4 h-4" />
                  Hapus File
                </motion.button>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                  >
                    Tutup
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <FaDownload className="w-4 h-4" />
                    Download
                  </motion.button>
                </div>
              </div> */}
            </motion.div>
          </div>

          <AnimatePresence>
            {imagePreviewOpen && isImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-100/90 p-4 backdrop-blur-sm"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    setImagePreviewOpen(false);
                    setImageZoomed(false);
                    setImageZoomOrigin({ x: 50, y: 50 });
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreviewOpen(false);
                      setImageZoomed(false);
                      setImageZoomOrigin({ x: 50, y: 50 });
                    }}
                    className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                  <div
                    className={`relative h-[80vh] w-full overflow-hidden bg-slate-100 ${
                      imageZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                    }`}
                    onDoubleClick={(event) => {
                      const rect = event.currentTarget.getBoundingClientRect();
                      const x = ((event.clientX - rect.left) / rect.width) * 100;
                      const y = ((event.clientY - rect.top) / rect.height) * 100;

                      setImageZoomOrigin({ x, y });
                      setImageZoomed((prev) => !prev);
                    }}
                    onMouseMove={(event) => {
                      if (!imageZoomed) return;

                      const rect = event.currentTarget.getBoundingClientRect();
                      const x = ((event.clientX - rect.left) / rect.width) * 100;
                      const y = ((event.clientY - rect.top) / rect.height) * 100;

                      setImageZoomOrigin({
                        x: Math.min(100, Math.max(0, x)),
                        y: Math.min(100, Math.max(0, y)),
                      });
                    }}
                  >
                    <FilePreviewImage
                      file={file}
                      alt={file.file_name}
                      fill
                      className={`object-contain transition-transform duration-200 ${
                        imageZoomed ? "scale-[1.8]" : "scale-100"
                      }`}
                      style={{
                        transformOrigin: `${imageZoomOrigin.x}% ${imageZoomOrigin.y}%`,
                      }}
                    />
                    <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      {imageZoomed
                        ? "Arahkan mouse ke area yang ingin dilihat, double click untuk reset zoom."
                        : "Double click untuk zoom."}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
