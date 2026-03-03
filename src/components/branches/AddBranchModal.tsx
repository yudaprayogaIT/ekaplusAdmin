// src/components/branches/AddBranchModal.tsx
"use client";

import React, {
  useEffect,
  useState,
} from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  getResourceUrl,
  getAuthHeadersFormData,
  API_CONFIG,
  apiFetch,
} from "@/config/api";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import UnsavedChangesDialog from "@/components/ui/UnsavedChangesDialog";

type Branch = {
  id?: number;
  name: string;
  city: string; // Changed from 'daerah' to match API
  address: string;
  lat: number;
  lng: number;
  island: string; // Changed from 'pulau' to match API
  area: string; // Changed from 'wilayah' to match API
  url: string;
  token: string;
  disabled: number;
};

const ISLAND_OPTIONS = [
  "Sumatra",
  "Jawa",
  "Kalimantan",
  "Sulawesi",
  "Nusa Tenggara",
  "Papua",
  "Maluku",
];
const AREA_OPTIONS = ["Barat", "Timur"];

export default function AddBranchModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Branch | null;
}) {
  const { token: authToken } = useAuth();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [island, setIsland] = useState("Jawa");
  const [area, setArea] = useState("Barat");
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [disabled, setDisabled] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track initial state for dirty checking
  const [initialState, setInitialState] = useState({
    name: "",
    city: "",
    address: "",
    lat: "",
    lng: "",
    island: "Jawa",
    area: "Barat",
    url: "",
    token: "",
    disabled: 0,
  });

  // Check if form is dirty
  const isDirty =
    name !== initialState.name ||
    city !== initialState.city ||
    address !== initialState.address ||
    lat !== initialState.lat ||
    lng !== initialState.lng ||
    island !== initialState.island ||
    area !== initialState.area ||
    url !== initialState.url ||
    token !== initialState.token ||
    disabled !== initialState.disabled;

  // Unsaved changes hook
  const { showConfirm, handleClose, handleConfirmClose, handleCancelClose } =
    useUnsavedChanges({ isDirty, onClose });

  useEffect(() => {
    setError(null);
    if (initial) {
      setName(initial.name ?? "");
      setCity(initial.city ?? "");
      setAddress(initial.address ?? "");
      setLat(String(initial.lat ?? ""));
      setLng(String(initial.lng ?? ""));
      setIsland(initial.island ?? "Jawa");
      setArea(initial.area ?? "Barat");
      setUrl(initial.url ?? "");
      setToken(initial.token ?? "");
      setDisabled(initial.disabled ?? 0);

      // Set initial state for dirty checking
      setInitialState({
        name: initial.name ?? "",
        city: initial.city ?? "",
        address: initial.address ?? "",
        lat: String(initial.lat ?? ""),
        lng: String(initial.lng ?? ""),
        island: initial.island ?? "Jawa",
        area: initial.area ?? "Barat",
        url: initial.url ?? "",
        token: initial.token ?? "",
        disabled: initial.disabled ?? 0,
      });
    } else {
      setName("");
      setCity("");
      setAddress("");
      setLat("");
      setLng("");
      setIsland("Jawa");
      setArea("Barat");
      setUrl("");
      setToken("");
      setDisabled(0);

      // Set initial state for dirty checking
      setInitialState({
        name: "",
        city: "",
        address: "",
        lat: "",
        lng: "",
        island: "Jawa",
        area: "Barat",
        url: "",
        token: "",
        disabled: 0,
      });
    }
  }, [initial, open]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!saving) {
          // Trigger form submission
          const form = document.querySelector("form");
          if (form) {
            form.requestSubmit();
          }
        }
      }
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        if (!saving) {
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, saving, handleClose]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!authToken) {
        throw new Error("Not authenticated");
      }

      // Prepare FormData for API
      const formData = new FormData();
      formData.append("branch_name", name.trim());
      formData.append("city", city.trim());
      formData.append("address", address.trim());
      formData.append("lat", lat.trim());
      formData.append("lng", lng.trim());
      formData.append("island", island);
      formData.append("area", area);
      formData.append("url", url.trim());
      formData.append("token", token.trim());
      formData.append("disabled", disabled.toString());

      const headers = getAuthHeadersFormData(authToken);

      let response;

      if (initial && initial.id) {
        // UPDATE existing branch
        response = await apiFetch(
          getResourceUrl(API_CONFIG.ENDPOINTS.BRANCH, initial.id),
          {
            method: "PUT",
            headers,
            body: formData,
          }
        );
      } else {
        // CREATE new branch
        response = await apiFetch(getResourceUrl(API_CONFIG.ENDPOINTS.BRANCH), {
          method: "POST",
          headers,
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to save branch (${response.status})`
        );
      }

      const result = await response.json();
      console.log("Branch saved successfully:", result);

      // Trigger reload in BranchList
      window.dispatchEvent(new Event("ekatalog:branches_update"));

      setSaving(false);
      onClose();
    } catch (err: unknown) {
      console.error("Failed to save branch:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-1">
                    {initial ? "Edit Cabang" : "Tambah Cabang Baru"}
                  </h3>
                  <p className="text-red-100 text-sm">
                    {initial
                      ? "Perbarui informasi cabang"
                      : "Lengkapi form untuk menambahkan cabang"}
                  </p>
                  <p className="text-red-200 text-xs mt-1 opacity-80">
                    💡 Tekan{" "}
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      Ctrl+S
                    </kbd>{" "}
                    untuk simpan atau{" "}
                    <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                      Esc
                    </kbd>{" "}
                    untuk batal
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto"
            >
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Name & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Cabang <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Ekatunggal Tunas Mandiri"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kota <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Bogor"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                  rows={3}
                  placeholder="Jl. Pahlawan No.29A, Sanja..."
                  required
                />
              </div>

              {/* Lat & Lng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      type="number"
                      step="any"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="3.5262415"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      type="number"
                      step="any"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="98.78782"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Island & Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pulau <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={island}
                    onChange={(e) => setIsland(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    {ISLAND_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    {AREA_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* URL & Token */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Website
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      type="url"
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="https://etm.example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    API Token
                  </label>
                  <input
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="token:key"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={disabled}
                  onChange={(e) => setDisabled(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                >
                  <option value={0}>Aktif</option>
                  <option value={1}>Nonaktif</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-1 md:px-6 md:py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1 md:px-8 md:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>
                      {initial ? "Simpan Perubahan" : "Tambah Cabang"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Unsaved Changes Dialog */}
          <UnsavedChangesDialog
            open={showConfirm}
            onConfirm={handleConfirmClose}
            onCancel={handleCancelClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
