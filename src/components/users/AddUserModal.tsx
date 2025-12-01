// src/components/users/AddUserModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import type { User, Role } from "./UserList";

const SNAP_KEY = "ekaplus_users_snapshot";

const GENDER_OPTIONS = ["Laki-laki", "Perempuan"];
const STATUS_OPTIONS = ["active", "inactive", "suspended"];

export default function AddUserModal({
  open,
  onClose,
  initial,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  initial?: User | null;
  roles: Role[];
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
  const [roleId, setRoleId] = useState("role_004");
  const [status, setStatus] = useState("active");
  const [profileBgColor, setProfileBgColor] = useState("#EF4444");
  const [saving, setSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<"basic" | "address" | "settings">(
    "basic"
  );

  useEffect(() => {
    if (initial) {
      setFirstName(initial.first_name ?? "");
      setLastName(initial.last_name ?? "");
      setUsername(initial.username ?? "");
      setEmail(initial.email ?? "");
      setPhone(initial.phone ?? "");
      setPassword("");
      setGender(initial.gender ?? "Laki-laki");
      setDateOfBirth(initial.date_of_birth ?? "");
      setBirthPlace(initial.birth_place ?? "");
      setAddress(initial.address ?? "");
      setCity(initial.city ?? "");
      setProvince(initial.province ?? "");
      setPostalCode(initial.postal_code ?? "");
      setRoleId(initial.role_id ?? "role_004");
      setStatus(initial.status ?? "active");
      setProfileBgColor(initial.profile_bg_color ?? "#EF4444");
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
      setRoleId("role_004");
      setStatus("active");
      setProfileBgColor("#EF4444");
    }
    setActiveTab("basic");
  }, [initial, open]);

  // Auto-generate username from name
  useEffect(() => {
    if (!initial && firstName && lastName) {
      const auto = `${firstName}${lastName}`.toLowerCase().replace(/\s+/g, "");
      setUsername(auto);
    }
  }, [firstName, lastName, initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const selectedRole = roles.find((r) => r.id === roleId);
    const now = new Date().toISOString();

    const payload: Partial<User> = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gender,
      date_of_birth: dateOfBirth,
      birth_place: birthPlace.trim(),
      address: address.trim() || null,
      city: city.trim() || null,
      province: province.trim() || null,
      postal_code: postalCode.trim() || null,
      country: "Indonesia",
      role_id: roleId,
      role: selectedRole?.name || "user",
      status,
      profile_bg_color: profileBgColor,
      updated_at: now,
    };

    if (password) {
      payload.password = password; // In real app, this should be hashed
    }

    try {
      const raw = localStorage.getItem(SNAP_KEY);
      let list: User[] = raw ? JSON.parse(raw) : [];

      if (initial && initial.id) {
        list = list.map((u) =>
          u.id === initial.id
            ? ({ ...u, ...payload, id: initial.id } as User)
            : u
        );
      } else {
        const newUser: User = {
          id: `user_${Date.now()}`,
          ...payload,
          password: password || "default_password",
          is_email_verified: false,
          is_phone_verified: false,
          email_verified_at: null,
          phone_verified_at: null,
          profile_pic: null,
          picture: null,
          google_id: null,
          google_access_token: null,
          google_refresh_token: null,
          google_token_expiry: null,
          referral_code: null,
          referred_by: null,
          branch_id: null,
          workflow_state: "registered",
          active_customer_id: null,
          token_version: 0,
          last_login: null,
          created_by: "admin",
          updated_by: null,
          created_at: now,
          is_system: false,
        } as User;
        list.push(newUser);
      }

      localStorage.setItem(SNAP_KEY, JSON.stringify(list));
      window.dispatchEvent(new Event("ekaplus:users_update"));
    } catch (error) {
      console.error("Failed to save user:", error);
    }

    setSaving(false);
    onClose();
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
                    {initial ? "Edit User" : "Tambah User Baru"}
                  </h3>
                  <p className="text-red-100 text-sm">
                    {initial
                      ? "Perbarui informasi user"
                      : "Lengkapi form untuk menambahkan user"}
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

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("basic")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === "basic"
                    ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaUser className="w-4 h-4 inline-block mr-2" />
                Informasi Dasar
              </button>
              <button
                onClick={() => setActiveTab("address")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === "address"
                    ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaMapMarkerAlt className="w-4 h-4 inline-block mr-2" />
                Alamat
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all ${
                  activeTab === "settings"
                    ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaLock className="w-4 h-4 inline-block mr-2" />
                Pengaturan
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="p-6 max-h-[calc(90vh-220px)] overflow-y-auto"
            >
              {/* Basic Info Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Depan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Belakang <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Username & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={username}
                        onChange={(e) =>
                          setUsername(
                            e.target.value.toLowerCase().replace(/\s+/g, "")
                          )
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="johndoe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        No. Telepon <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder="6281234567890"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password{" "}
                        {!initial && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                          placeholder={
                            initial ? "Kosongkan jika tidak diubah" : "••••••••"
                          }
                          required={!initial}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender, DOB, Birth Place */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      >
                        {GENDER_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tanggal Lahir
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          type="date"
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tempat Lahir
                      </label>
                      <input
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="Jakarta"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === "address" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                      rows={3}
                      placeholder="Jl. Sudirman No. 123, RT 01/RW 02"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kota/Kabupaten
                      </label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="Jakarta Selatan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Provinsi
                      </label>
                      <input
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="DKI Jakarta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kode Pos
                      </label>
                      <input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {roles.map((role) => (
                        <label
                          key={role.id}
                          className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                          />
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-2"
                            style={{ backgroundColor: role.color }}
                          >
                            <span className="text-lg font-bold">
                              {role.display_name[0]}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {role.display_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            Level {role.level}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      {STATUS_OPTIONS.map((s) => (
                        <label
                          key={s}
                          className={`flex-1 flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all capitalize ${
                            status === s
                              ? s === "active"
                                ? "border-green-500 bg-green-50 text-green-700"
                                : s === "inactive"
                                ? "border-gray-500 bg-gray-50 text-gray-700"
                                : "border-red-500 bg-red-50 text-red-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={s}
                            checked={status === s}
                            onChange={(e) => setStatus(e.target.value)}
                            className="sr-only"
                          />
                          <span className="font-medium">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Profile Color */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Warna Profil
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setProfileBgColor(color)}
                          className={`w-10 h-10 rounded-xl transition-all ${
                            profileBgColor === color
                              ? "ring-4 ring-offset-2 ring-gray-400 scale-110"
                              : "hover:scale-105"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t-2 border-gray-100">
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
