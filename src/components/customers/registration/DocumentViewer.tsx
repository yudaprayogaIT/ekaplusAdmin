"use client";

import React from "react";
import { HiArrowDownTray, HiXMark } from "react-icons/hi2";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  filename: string;
  title?: string;
}

export function DocumentViewer({
  isOpen,
  onClose,
  imageUrl,
  filename,
  title,
}: DocumentViewerProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-500 to-red-600">
          <h3 className="text-white font-semibold text-lg">{title || filename}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
              title="Download"
            >
              <HiArrowDownTray className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto bg-gray-50">
          <img
            src={imageUrl}
            alt={filename}
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Footer hint */}
        <div className="text-center px-6 py-3 text-gray-500 text-sm bg-gray-100 border-t border-gray-200">
          Click outside to close
        </div>
      </div>
    </div>
  );
}
