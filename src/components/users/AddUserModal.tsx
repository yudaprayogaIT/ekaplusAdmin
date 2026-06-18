"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaPlug,
  FaChevronDown,
  FaSearch,
  FaServer,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import type { Role, User, UserMutationPayload } from "./UserList";

const GENDER_OPTIONS = [
  { label: "Laki-laki", value: "male" },
  { label: "Perempuan", value: "female" },
];

function toCapitalizedInput(value: string): string {
  return value
    .split(" ")
    .map((part) =>
      part ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase() : part,
    )
    .join(" ");
}

function toTitleCaseName(...parts: string[]): string {
  return parts
    .flatMap((part) => part.split(/\s+/))
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizeRoleMatch(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase().replace(/[_\s-]+/g, "");
}

export default function AddUserModal({
  open,
  onClose,
  onDismissError,
  initial,
  initialRoleIds = [],
  roles,
  saving,
  error,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onDismissError: () => void;
  initial?: User | null;
  initialRoleIds?: string[];
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
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [roleQuery, setRoleQuery] = useState("");
  const [rolePickerOpen, setRolePickerOpen] = useState(false);
  const [isSystem, setIsSystem] = useState(false);
  const [generateIntegrationToken, setGenerateIntegrationToken] =
    useState(false);
  const [integrationTokenName, setIntegrationTokenName] = useState("");
  const [integrationTokenNameTouched, setIntegrationTokenNameTouched] =
    useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "address">("basic");
  const rolePickerRef = useRef<HTMLDivElement | null>(null);
  const roleSearchInputRef = useRef<HTMLInputElement | null>(null);

  const initialSelectedRoleIds = useMemo(() => {
    if (!initial) return [];

    const directIds = [...new Set([...initialRoleIds, initial.role_id].filter(Boolean))] as string[];
    if (directIds.length > 0) return directIds;

    const initialRoleValue = normalizeRoleMatch(initial.role);
    if (!initialRoleValue) return [];

    const matchedRole = roles.find((role) => {
      const candidates = [
        normalizeRoleMatch(role.id),
        normalizeRoleMatch(role.name),
        normalizeRoleMatch(role.display_name),
      ];
      return candidates.includes(initialRoleValue);
    });

    return matchedRole?.id ? [matchedRole.id] : [];
  }, [initial, initialRoleIds, roles]);

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setFirstName(initial.first_name ?? "");
      setLastName(initial.last_name ?? "");
      setUsername(initial.username ?? "");
      setEmail(initial.email ?? "");
      setPhone(initial.phone ?? "");
      setPassword("");
      setShowPassword(false);
      setGender(initial.gender?.toLowerCase() === "female" ? "female" : "male");
      setDateOfBirth(
        initial.date_of_birth ? initial.date_of_birth.slice(0, 10) : "",
      );
      setBirthPlace(initial.birth_place ?? "");
      setAddress(initial.address ?? "");
      setCity(initial.city ?? "");
      setProvince(initial.province ?? "");
      setPostalCode(initial.postal_code ?? "");
      setRoleIds(initialSelectedRoleIds);
      setRoleQuery("");
      setRolePickerOpen(false);
      setIsSystem(Boolean(initial.is_system));
      setGenerateIntegrationToken(false);
      setIntegrationTokenName("");
      setIntegrationTokenNameTouched(false);
    } else {
      setFirstName("");
      setLastName("");
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setShowPassword(false);
      setGender("male");
      setDateOfBirth("");
      setBirthPlace("");
      setAddress("");
      setCity("");
      setProvince("");
      setPostalCode("");
      setRoleIds([]);
      setRoleQuery("");
      setRolePickerOpen(false);
      setIsSystem(false);
      setGenerateIntegrationToken(false);
      setIntegrationTokenName("");
      setIntegrationTokenNameTouched(false);
    }

    setActiveTab("basic");
  }, [initial, initialSelectedRoleIds, open, roles]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        rolePickerRef.current &&
        !rolePickerRef.current.contains(event.target as Node)
      ) {
        setRolePickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!rolePickerOpen) return;
    const timer = window.setTimeout(() => {
      roleSearchInputRef.current?.focus();
    }, 30);
    return () => window.clearTimeout(timer);
  }, [rolePickerOpen]);

  const filteredRoles = useMemo(() => {
    const query = roleQuery.trim().toLowerCase();
    if (!query) return roles;
    return roles.filter((role) =>
      [role.display_name, role.name].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [roleQuery, roles]);

  const selectedRoles = useMemo(
    () => roles.filter((role) => roleIds.includes(role.id)),
    [roleIds, roles],
  );

  const suggestedIntegrationTokenName = useMemo(
    () => toTitleCaseName(firstName.trim(), lastName.trim()),
    [firstName, lastName],
  );

  useEffect(() => {
    if (!generateIntegrationToken || integrationTokenNameTouched) return;
    setIntegrationTokenName(suggestedIntegrationTokenName);
  }, [
    generateIntegrationToken,
    integrationTokenNameTouched,
    suggestedIntegrationTokenName,
  ]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const primaryRole = selectedRoles[0] ?? null;

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
      role_id: primaryRole?.id || null,
      role_ids: roleIds,
      initial_role_ids: initialSelectedRoleIds,
      role: primaryRole?.name || initial?.role || "user",
      is_system: isSystem ? 1 : 0,
      generate_integration_token: generateIntegrationToken,
      integration_token_name: generateIntegrationToken
        ? integrationTokenName.trim() || null
        : null,
    });
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
            </div>

            <form
              onSubmit={submit}
              className="max-h-[calc(90vh-220px)] overflow-y-auto p-6"
            >
              {activeTab === "basic" && (
                <div className="relative space-y-6">
                  {rolePickerOpen ? (
                    <div className="pointer-events-none absolute inset-0 z-10 rounded-3xl bg-white/40 backdrop-blur-[3px]" />
                  ) : null}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Nama Depan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={firstName}
                          onChange={(e) =>
                            setFirstName(toCapitalizedInput(e.target.value))
                          }
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
                        onChange={(e) =>
                          setLastName(toCapitalizedInput(e.target.value))
                        }
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
                        onChange={(e) =>
                          setUsername(
                            e.target.value.toLowerCase().replace(/\s+/g, ""),
                          )
                        }
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        placeholder="johndoe"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Email
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder="john@example.com"
                          disabled={saving}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        No. Telepon
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/[^\d+]/g, ""))
                          }
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder="08xxxxxxxxxx"
                          disabled={saving}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Nomor yang diawali <code>0</code> otomatis dikirim
                        sebagai <code>62</code>.
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Password{" "}
                        {!initial && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          minLength={6}
                          className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-12 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder={
                            initial ? "Kosongkan jika tidak diubah" : "••••••••"
                          }
                          required={!initial}
                          disabled={saving}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition-colors hover:text-red-500"
                          disabled={saving}
                          aria-label={
                            showPassword
                              ? "Sembunyikan password"
                              : "Lihat password"
                          }
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-4 w-4" />
                          ) : (
                            <FaEye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        {initial
                          ? "Kosongkan jika password tidak ingin diubah. Minimal 6 karakter jika diisi."
                          : "Password minimal 6 karakter."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                        disabled={saving}
                      >
                        {GENDER_OPTIONS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
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

                  <div className="relative z-20 rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-800">
                        Role User
                      </p>
                      <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                        Wajib
                      </div>
                    </div>

                    <div className="relative" ref={rolePickerRef}>
                      <button
                        type="button"
                        onClick={() => setRolePickerOpen((open) => !open)}
                        disabled={saving}
                        className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3 text-left transition-all ${
                          rolePickerOpen
                            ? "border-red-300 shadow-sm"
                            : "border-red-100 hover:border-red-200"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                            style={{
                              backgroundColor:
                                selectedRoles[0]?.color || "#9CA3AF",
                            }}
                          >
                            {selectedRoles.length > 1
                              ? selectedRoles.length
                              : selectedRoles[0]?.display_name?.[0] || "R"}
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                              Role terpilih
                            </p>
                            <p className="truncate text-sm font-semibold text-gray-800">
                              {selectedRoles.length === 0
                                ? initial
                                  ? "Role lama dipertahankan"
                                  : "Belum dipilih"
                                : selectedRoles.length === 1
                                  ? selectedRoles[0].display_name
                                  : `${selectedRoles.length} role dipilih`}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {selectedRoles.length === 0
                                ? initial
                                  ? "Simpan tanpa memilih ulang jika role user tidak diubah"
                                  : "Pilih satu atau beberapa role untuk user ini"
                                : selectedRoles
                                    .map((role) => role.name)
                                    .join(", ")}
                            </p>
                          </div>
                        </div>

                        <FaChevronDown
                          className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${
                            rolePickerOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {rolePickerOpen ? (
                        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] w-[95%] mx-auto z-20 rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl shadow-gray-200/70">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                              {filteredRoles.length} role ditemukan
                            </span>
                            {roleQuery ? (
                              <button
                                type="button"
                                onClick={() => setRoleQuery("")}
                                className="text-xs font-medium text-red-500 transition-colors hover:text-red-600"
                              >
                                Reset cari
                              </button>
                            ) : null}
                          </div>

                          <div className="relative mb-3">
                            <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                              ref={roleSearchInputRef}
                              value={roleQuery}
                              onChange={(e) => setRoleQuery(e.target.value)}
                              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                              placeholder="Cari role..."
                              disabled={saving}
                            />
                          </div>

                          <div className="grid max-h-72 grid-cols-1 gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                            {filteredRoles.map((role) => (
                              <label
                                key={role.id}
                                className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                                  roleIds.includes(role.id)
                                    ? "border-red-500 bg-red-50 shadow-sm"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  name="role_ids"
                                  value={role.id}
                                  checked={roleIds.includes(role.id)}
                                  onChange={(e) => {
                                    const { checked, value } = e.target;
                                    setRoleIds((current) =>
                                      checked
                                        ? [...current, value]
                                        : current.filter(
                                            (roleId) => roleId !== value,
                                          ),
                                    );
                                  }}
                                  className="sr-only"
                                  disabled={saving}
                                />
                                <div
                                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white"
                                  style={{ backgroundColor: role.color }}
                                >
                                  <span className="text-lg font-bold">
                                    {role.display_name[0]}
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-medium text-gray-800">
                                    {role.display_name}
                                  </span>
                                  <span className="block truncate text-xs text-gray-500">
                                    {role.name}
                                  </span>
                                </div>
                                {roleIds.includes(role.id) ? (
                                  <FaCheckCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
                                ) : null}
                              </label>
                            ))}
                          </div>

                          {filteredRoles.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-500">
                              Role tidak ditemukan.
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Is System <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col gap-3 md:flex-row">
                      {[
                        {
                          value: false,
                          label: "False",
                          description:
                            "Tidak bisa login ke e-panel. Hanya tersimpan sebagai user biasa.",
                        },
                        {
                          value: true,
                          label: "True",
                          description: "Bisa login ke e-panel.",
                        },
                      ].map((item) => (
                        <label
                          key={String(item.value)}
                          className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border-2 p-4 transition-all ${
                            isSystem === item.value
                              ? "border-red-500 bg-red-50 text-red-700"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="is_system"
                            checked={isSystem === item.value}
                            onChange={() => setIsSystem(item.value)}
                            className="sr-only"
                            disabled={saving}
                          />
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 font-semibold">
                              <FaServer className="h-4 w-4" />
                              <span>{item.label}</span>
                            </div>
                            <p className="mt-1 text-xs opacity-80">
                              {item.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={generateIntegrationToken}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setGenerateIntegrationToken(checked);
                          if (!checked) {
                            setIntegrationTokenNameTouched(false);
                            setIntegrationTokenName("");
                            return;
                          }
                          if (!integrationTokenNameTouched) {
                            setIntegrationTokenName(
                              suggestedIntegrationTokenName,
                            );
                          }
                        }}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                        disabled={saving}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                          <FaPlug className="h-4 w-4 text-red-500" />
                          <span>Generate Integration Token</span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                            Opsional
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Kalau aktif, setelah user berhasil dibuat dan role
                          terpasang, sistem akan langsung membuat integration
                          token untuk user ini.
                        </p>
                      </div>
                    </label>

                    {generateIntegrationToken ? (
                      <div className="mt-4 space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          Nama Integration Token
                        </label>
                        <input
                          value={integrationTokenName}
                          onChange={(e) => {
                            setIntegrationTokenNameTouched(true);
                            setIntegrationTokenName(e.target.value);
                          }}
                          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm transition-all focus:border-red-500 focus:ring-2 focus:ring-red-500"
                          placeholder={
                            suggestedIntegrationTokenName ||
                            "Contoh: Andi Saputra"
                          }
                          disabled={saving}
                          required={generateIntegrationToken}
                        />
                        <p className="text-xs text-gray-500">
                          Default nama token mengikuti nama depan dan belakang,
                          tapi tetap bisa kamu edit manual.
                        </p>
                      </div>
                    ) : null}
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
                      disabled={saving || (!initial && roleIds.length === 0)}
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

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex items-center justify-center p-6"
                >
                  <div
                    className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                    onClick={onDismissError}
                  />

                  <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 12 }}
                    transition={{ type: "spring", duration: 0.28 }}
                    className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
                  >
                    <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-100">
                        Error
                      </p>
                      <h4 className="mt-1 text-xl font-bold">
                        Gagal Menyimpan User
                      </h4>
                    </div>

                    <div className="space-y-5 p-6">
                      <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700">
                        {error}
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={onDismissError}
                          className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-red-200"
                        >
                          Mengerti
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
