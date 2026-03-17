"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getApiUrl, getFileUrl } from "@/config/api";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaIdBadge,
  FaMapMarkerAlt,
  FaPhone,
  FaRedoAlt,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";

type UserMeApiResponse = {
  status?: string;
  code?: string;
  message?: string;
  data?: {
    id?: number;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    username?: string;
    email?: string;
    phone?: string;
    is_email_verified?: boolean;
    is_phone_verified?: boolean;
    is_system?: boolean;
    token_version?: number;
    status?: number | string;
    workflow_state?: string | null;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    postal_code?: string | null;
    country?: string | null;
    gender?: string | null;
    date_of_birth?: string | null;
    place_of_birth?: string | null;
    profile_pic?: string | null;
    referral_code?: string | null;
    referred_by?: string | null;
    google_id?: string | null;
    picture?: string | null;
    role?: string | null;
    last_login?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  };
};

type ProfileData = {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isSystem: boolean;
  tokenVersion: number;
  status: string;
  workflowState: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  profilePic: string;
  picture: string;
  referralCode: string;
  referredBy: string;
  googleId: string;
  role: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
};

function displayValue(value?: string | null) {
  if (!value) return "-";
  return value;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: value.includes("T") ? "short" : undefined,
  });
}

function formatPhone(value?: string | null) {
  if (!value) return "-";
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.startsWith("62")) return `0${cleaned.slice(2)}`;
  return cleaned;
}

function mapProfile(api: UserMeApiResponse["data"]): ProfileData {
  return {
    id: Number(api?.id || 0),
    fullName: api?.full_name || "-",
    firstName: api?.first_name || "",
    lastName: api?.last_name || "",
    username: api?.username || "-",
    email: api?.email || "-",
    phone: api?.phone || "-",
    isEmailVerified: Boolean(api?.is_email_verified),
    isPhoneVerified: Boolean(api?.is_phone_verified),
    isSystem: Boolean(api?.is_system),
    tokenVersion: Number(api?.token_version || 0),
    status:
      typeof api?.status === "number"
        ? api.status === 1
          ? "Active"
          : "Inactive"
        : api?.status || "-",
    workflowState: api?.workflow_state || "-",
    address: api?.address || "",
    city: api?.city || "",
    province: api?.province || "",
    postalCode: api?.postal_code || "",
    country: api?.country || "",
    gender: api?.gender || "",
    dateOfBirth: api?.date_of_birth || "",
    placeOfBirth: api?.place_of_birth || "",
    profilePic: api?.profile_pic || "",
    picture: api?.picture || "",
    referralCode: api?.referral_code || "",
    referredBy: api?.referred_by || "",
    googleId: api?.google_id || "",
    role: api?.role || "-",
    lastLogin: api?.last_login || "",
    createdAt: api?.created_at || "",
    updatedAt: api?.updated_at || "",
  };
}

export default function MyProfilePage() {
  const { token, currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USER_ME),
        { method: "GET", cache: "no-store" },
        token,
      );
      const json = (await res.json().catch(() => null)) as UserMeApiResponse | null;
      if (!res.ok || !json?.data) {
        throw new Error(
          json?.message || `Gagal memuat profil saya (${res.status})`,
        );
      }
      setProfile(mapProfile(json.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const avatarUrl = useMemo(() => {
    const fileValue = profile?.profilePic || profile?.picture || "";
    return getFileUrl(fileValue) || fileValue || "";
  }, [profile?.picture, profile?.profilePic]);

  const initials = useMemo(() => {
    const name = profile?.fullName || currentUser?.full_name || "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [currentUser?.full_name, profile?.fullName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-red-100 border-t-red-500" />
          <p className="text-sm font-medium text-slate-500">
            Memuat profil saya...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
          <div className="font-semibold">Gagal memuat profil</div>
          <p className="mt-1 text-sm">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => void loadProfile()}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200"
        >
          <FaRedoAlt className="h-4 w-4" />
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white shadow-xl shadow-red-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] border border-white/20 bg-white/10 text-2xl font-bold text-white shadow-lg backdrop-blur-sm"
              style={{
                backgroundColor:
                  currentUser?.profile_bg_color || "rgba(255,255,255,0.15)",
              }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={profile.fullName}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                <FaShieldAlt className="h-3 w-3" />
                Profil Saya
              </div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight">
                {profile.fullName}
              </h1>
              <p className="mt-1 text-sm text-red-50/90">
                @{profile.username} • {profile.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void loadProfile()}
            className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            <FaRedoAlt className="h-4 w-4" />
            Refresh Data
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
              Identitas
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Informasi akun
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                User ID
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {profile.id}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Username
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {profile.username}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaEnvelope className="h-3 w-3" />
                Email
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {profile.email}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaPhone className="h-3 w-3" />
                Phone
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatPhone(profile.phone)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaUser className="h-3 w-3" />
                Nama Depan
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.firstName)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Nama Belakang
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.lastName)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaCalendarAlt className="h-3 w-3" />
                Tanggal Lahir
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatDate(profile.dateOfBirth)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Tempat Lahir
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.placeOfBirth)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Gender
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.gender)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Workflow State
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.workflowState)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                Status
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Verifikasi & akses
              </h2>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Email Verified
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <FaCheckCircle className="h-4 w-4" />
                  {profile.isEmailVerified ? "Ya" : "Tidak"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Phone Verified
                </span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <FaCheckCircle className="h-4 w-4" />
                  {profile.isPhoneVerified ? "Ya" : "Tidak"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Status
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {profile.status}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Role
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {profile.role}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Token Version
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {profile.tokenVersion}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  System User
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {profile.isSystem ? "Ya" : "Bukan"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
                Lokasi
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Alamat pengguna
              </h2>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaMapMarkerAlt className="h-3 w-3" />
                Alamat
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.address)}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Kota
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {displayValue(profile.city)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Provinsi
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {displayValue(profile.province)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Kode Pos
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {displayValue(profile.postalCode)}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Negara
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {displayValue(profile.country)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
              Integrasi
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Koneksi akun
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Google ID
              </div>
              <div className="break-all text-sm font-semibold text-slate-900">
                {displayValue(profile.googleId)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Referral Code
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.referralCode)}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Referred By
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {displayValue(profile.referredBy)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
              Aktivitas
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Riwayat akun
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaClock className="h-3 w-3" />
                Last Login
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatDate(profile.lastLogin)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaIdBadge className="h-3 w-3" />
                Created At
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatDate(profile.createdAt)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <FaRedoAlt className="h-3 w-3" />
                Updated At
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatDate(profile.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
