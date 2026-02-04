// src/components/files/FileCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaEye,
  FaTrash,
  FaFile,
  FaImage,
  FaFolder,
  FaCalendar,
} from "react-icons/fa";
import {
  type FileItem,
  getFilePreviewUrl,
  formatFileSize,
  isImageFile,
  getFileTypeBadgeColor,
  getFolderBadgeColor,
} from "@/services/fileService";

interface FileCardProps {
  file: FileItem;
  viewMode: "grid" | "list";
  onViewDetail: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
}

export default function FileCard({
  file,
  viewMode,
  onViewDetail,
  onDelete,
}: FileCardProps) {
  const isImage = isImageFile(file.mime_type);
  const previewUrl = getFilePreviewUrl(file.file_url);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ y: -2 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border-2 border-gray-100 hover:border-red-200 p-4"
      >
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            {isImage ? (
              <img
                src={previewUrl}
                alt={file.file_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaFile className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate mb-1">
              {file.file_name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getFolderBadgeColor(file.folder)}`}>
                <FaFolder className="w-3 h-3" />
                {file.folder}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getFileTypeBadgeColor(file.mime_type)}`}>
                {file.mime_type}
              </span>
              <span className="text-xs text-gray-500">{formatFileSize(file.file_size)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewDetail(file)}
              className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Lihat Detail"
            >
              <FaEye className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(file)}
              className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus"
            >
              <FaTrash className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border-2 border-gray-100 hover:border-red-200 overflow-hidden"
    >
      {/* Image Preview */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {isImage ? (
          <img
            src={previewUrl}
            alt={file.file_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaFile className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* File Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getFileTypeBadgeColor(file.mime_type)} backdrop-blur-sm bg-opacity-90`}>
            {isImage ? <FaImage className="w-3 h-3" /> : <FaFile className="w-3 h-3" />}
            {isImage ? "Image" : "File"}
          </span>
        </div>
      </div>

      {/* File Details */}
      <div className="p-4">
        {/* File Name */}
        <h3 className="font-semibold text-gray-900 mb-2 truncate" title={file.file_name}>
          {file.file_name}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getFolderBadgeColor(file.folder)}`}>
            <FaFolder className="w-3 h-3" />
            {file.folder}
          </span>
        </div>

        {/* File Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{formatFileSize(file.file_size)}</span>
          <span className="flex items-center gap-1">
            <FaCalendar className="w-3 h-3" />
            {new Date(file.created_at).toLocaleDateString("id-ID")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetail(file)}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold shadow-lg shadow-blue-200 hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <FaEye className="w-4 h-4" />
            Detail
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(file)}
            className="p-2.5 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Hapus"
          >
            <FaTrash className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
