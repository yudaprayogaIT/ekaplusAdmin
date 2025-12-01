// src/components/branches/AddBranchModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

type Branch = {
  id?: number;
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

const SNAP_KEY = "ekatalog_branches_snapshot";

const PULAU_OPTIONS = [
  "Jawa",
  "Sumatra",
  "Kalimantan",
  "Sulawesi",
  "Nusa Tenggara",
  "Papua",
  "Maluku",
];
const WILAYAH_OPTIONS = ["Barat", "Timur"];

export default function AddBranchModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Branch | null;
}) {
  const [name, setName] = useState("");
  const [daerah, setDaerah] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [pulau, setPulau] = useState("Jawa");
  const [wilayah, setWilayah] = useState("Barat");
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("token:key");
  const [disabled, setDisabled] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setDaerah(initial.daerah ?? "");
      setAddress(initial.address ?? "");
      setLat(String(initial.lat ?? ""));
      setLng(String(initial.lng ?? ""));
      setPulau(initial.pulau ?? "Jawa");
      setWilayah(initial.wilayah ?? "Barat");
      setUrl(initial.url ?? "");
      setToken(initial.token ?? "token:key");
      setDisabled(initial.disabled ?? 0);
    } else {
      setName("");
      setDaerah("");
      setAddress("");
      setLat("");
      setLng("");
      setPulau("Jawa");
      setWilayah("Barat");
      setUrl("");
      setToken("token:key");
      setDisabled(0);
    }
  }, [initial, open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload: Omit<Branch, "id"> = {
      name: name.trim(),
      daerah: daerah.trim(),
      address: address.trim(),
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
      pulau,
      wilayah,
      url: url.trim(),
      token: token.trim(),
      disabled,
    };

    try {
      const raw = localStorage.getItem(SNAP_KEY);
      let list: Branch[] = raw ? JSON.parse(raw) : [];

      if (initial && initial.id) {
        list = list.map((b) =>
          b.id === initial.id ? { ...b, ...payload, id: initial.id } : b
        );
      } else {
        const maxId = list.reduce(
          (m: number, it: Branch) => Math.max(m, Number(it.id) || 0),
          0
        );
        const newBranch: Branch = {
          id: maxId + 1,
          ...payload,
        };
        list.push(newBranch);
      }

      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekatalog:branches_update"));
    } catch (error) {
      console.error("Failed to save branch:", error);
    }

    setSaving(false);
    onClose();
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
            onClick={onClose}
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
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
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
              {/* Name & Daerah */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Cabang <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Ekatunggal Tunas Medan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Daerah <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={daerah}
                    onChange={(e) => setDaerah(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Medan"
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
                  placeholder="Kompleks Golden Star No. 8C, Limau Manis..."
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
                      placeholder="98.7878248"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pulau & Wilayah */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pulau <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={pulau}
                    onChange={(e) => setPulau(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    {PULAU_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wilayah <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    {WILAYAH_OPTIONS.map((w) => (
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
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl hover:shadow-red-200 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
