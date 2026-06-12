"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import type { Role, User, UserMutationPayload } from "./UserList";

const GENDER_OPTIONS = ["Laki-laki", "Perempuan"];
const STATUS_OPTIONS = ["active", "inactive"];

export default function AddUserModal({
  open,
  onClose,
  initial,
  roles,
  saving,
  error,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  initial?: User | null;
  roles: Role[];
  saving: boolean;
  error: string | null;
  onSubmit: (payload: UserMutationPayload) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [roleId, setRoleId] = useState("");
  const [status, setStatus] = useState("active");
  const [profileBgColor, setProfileBgColor] = useState("#EF4444");
  const [activeTab, setActiveTab] = useState<"basic" | "address" | "settings">(
    "basic",
  );

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setFirstName(initial.first_name ?? "");
      setLastName(initial.last_name ?? "");
      setUsername(initial.username ?? "");
      setEmail(initial.email ?? "");
      setPhone(initial.phone ?? "");
      setPassword("");
      setGender(initial.gender ?? "Laki-laki");
      setDateOfBirth(initial.date_of_birth ? initial.date_of_birth.slice(0, 10) : "");
      setBirthPlace(initial.birth_place ?? "");
      setAddress(initial.address ?? "");
      setCity(initial.city ?? "");
      setProvince(initial.province ?? "");
      setPostalCode(initial.postal_code ?? "");
      setRoleId(initial.role_id || roles.find((role) => role.name === initial.role)?.id || "");
      setStatus(initial.status ?? "active");
    } else {
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setGender("Laki-laki");
      setDateOfBirth("");
      setBirthPlace("");
      setAddress("");
      setCity("");
      setProvince("");
      setPostalCode("");
      setRoleId(roles[0]?.id ?? "");
      setStatus("active");
    }

    setActiveTab("basic");
  }, [initial, open, roles]);

  useEffect(() => {
    if (!initial && firstName && lastName) {
      const auto = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, "");
      setUsername(auto);
    }
  }, [firstName, lastName, initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const selectedRole = roles.find((role) => role.id === roleId);

    await onSubmit({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim() || undefined,
      gender,
      date_of_birth: dateOfBirth || null,
      birth_place: birthPlace.trim() || null,
      address: address.trim() || null,
      city: city.trim() || null,
      province: province.trim() || null,
      postal_code: postalCode.trim() || null,
      country: "Indonesia",
      role_id: roleId || null,
      role: selectedRole?.name || initial?.role || "user",
      status,
    });
  }

  const colorOptions = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#F97316",
    "#84CC16",
  ];

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
            onClick={() => {
              if (!saving) onClose();
            }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-white">
              <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-black/10" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="mb-1 text-2xl font-bold">
                    {initial ? "Edit User" : "Tambah User Baru"}
                  </h3>
                  <p className="text-sm text-red-100">
                    {initial
                      ? "Perbarui informasi user"
                      : "Lengkapi form untuk menambahkan user"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl p-2 transition-colors hover:bg-white/20 disabled:opacity-50"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === "basic"
                    ? "border-b-2 border-red-600 bg-red-50 text-red-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <FaUser className="mr-2 inline-block h-4 w-4" />
                Informasi Dasar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("address")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === "address"
                    ? "border-b-2 border-red-600 bg-red-50 text-red-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <FaMapMarkerAlt className="mr-2 inline-block h-4 w-4" />
                Alamat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === "settings"
                    ? "border-b-2 border-red-600 bg-red-50 text-red-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <FaLock className="mr-2 inline-block h-4 w-4" />
                Pengaturan
              </button>
            </div>

            <form onSubmit={submit} className="max-h-[calc(90vh-220px)] overflow-y-auto p-6">
              {error ? (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Nama Depan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder="John"
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Nama Belakang <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        placeholder="Doe"
                        required
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        placeholder="johndoe"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder="john@example.com"
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        No. Telepon <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder="6281234567890"
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Password {!initial && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder={initial ? "Kosongkan jika tidak diubah" : "••••••••"}
                          required={!initial}
                          disabled={saving}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        disabled={saving}
                      >
                        {GENDER_OPTIONS.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Tanggal Lahir
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          type="date"
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          disabled={saving}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Tempat Lahir
                      </label>
                      <input
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        placeholder="Jakarta"
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "address" && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Alamat Lengkap
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                      rows={3}
                      placeholder="Jl. Sudirman No. 123, RT 01/RW 02"
                      disabled={saving}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Kota/Kabupaten
                      </label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        placeholder="Jakarta Selatan"
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Provinsi
                      </label>
                      <input
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        placeholder="DKI Jakarta"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Kode Pos
                      </label>
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        placeholder="12345"
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {roles.map((role) => (
                        <label
                          key={role.id}
                          className={`relative flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-all ${
                            roleId === role.id
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role.id}
                            checked={roleId === role.id}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="sr-only"
                            disabled={saving}
                          />
                          <div
                            className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: role.color }}
                          >
                            <span className="text-lg font-bold">{role.display_name[0]}</span>
                          </div>
                          <span className="text-center text-sm font-medium text-gray-800">
                            {role.display_name}
                          </span>
                          <span className="text-xs text-gray-500">{role.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      {STATUS_OPTIONS.map((item) => (
                        <label
                          key={item}
                          className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 p-4 capitalize transition-all ${
                            status === item
                              ? item === "active"
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-500 bg-gray-50 text-gray-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={item}
                            checked={status === item}
                            onChange={(e) => setStatus(e.target.value)}
                            className="sr-only"
                            disabled={saving}
                          />
                          <span className="font-medium">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Warna Profil
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setProfileBgColor(color)}
                          className={`h-10 w-10 rounded-xl transition-all ${
                            profileBgColor === color
                              ? "scale-110 ring-4 ring-gray-400 ring-offset-2"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                          disabled={saving}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3 border-t-2 border-gray-100 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-3 font-semibold text-white transition-all hover:shadow-xl hover:shadow-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>{initial ? "Simpan Perubahan" : "Tambah User"}</span>
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
