"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getApiUrl, getFileUrl } from "@/config/api";
import {
  FeatureTourStep,
  clearPendingFeatureTourStep,
  getPendingFeatureTourStep,
  isFeatureTourSeen,
  markFeatureTourSeen,
  profileFeatureTourConfig,
  setPendingFeatureTourStep as storePendingFeatureTourStep,
} from "@/lib/featureTour";
import {
  createDriverSteps,
  createDriverTour,
  waitForElement,
  waitForElementToDisappear,
} from "@/lib/driverTour";
import {
  createProfileHeaderTourSteps,
  createProfilePageTourSteps,
  getProfilePageTourStartIndex,
  PROFILE_TOUR_SELECTORS,
  type ProfilePageTourStep,
} from "@/lib/profileFeatureTour";
import {
  createResetPasswordTourSteps,
  getResetPasswordTourStartIndex,
  RESET_PASSWORD_TOUR_SELECTORS,
} from "@/lib/resetPasswordTour";
import ActionResultModal from "@/components/ui/ActionResultModal";
import type { Driver } from "driver.js";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaEdit,
  FaEye,
  FaEyeSlash,
  FaHistory,
  FaLink,
  FaLock,
  FaMapMarkerAlt,
  FaRedoAlt,
  FaShieldAlt,
  FaSignInAlt,
  FaSpinner,
  FaTimes,
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
    district?: string | null;
    village?: string | null;
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
  district: string;
  village: string;
  province: string;
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

type EditProfileFormState = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  province: string;
  city: string;
  district: string;
  village: string;
  country: string;
};

type ResetPasswordFormState = {
  newPassword: string;
  confirmPassword: string;
};

type ResultState = {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  description?: string;
};

type PendingCloseTarget = "edit" | "reset" | null;
type ProfileFeatureTourEntryStep = ProfilePageTourStep | "password";

type WilayahOption = {
  code: string;
  name: string;
};

const WILAYAH_BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

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

function formatJoinedDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });
}

function formatPhone(value?: string | null) {
  if (!value) return "-";
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.startsWith("62")) return `0${cleaned.slice(2)}`;
  return cleaned;
}

function normalizePhoneForApi(value: string) {
  const cleaned = value.replace(/\D/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("0")) return `62${cleaned.slice(1)}`;
  return cleaned;
}

function normalizeStatus(value?: string | null) {
  if (!value) return "-";
  return value.toString().trim().toUpperCase();
}

function normalizeName(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function toInputDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function matchByName(options: WilayahOption[], value?: string | null) {
  const target = normalizeName(value);
  if (!target) return null;
  return (
    options.find((option) => normalizeName(option.name) === target) || null
  );
}

async function fetchWilayah(path: string): Promise<WilayahOption[]> {
  const res = await fetch(`${WILAYAH_BASE_URL}/${path}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed loading wilayah (${res.status})`);
  }
  const json = await res.json();
  const rows: Array<{ code?: string; id?: string; name?: string }> =
    Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  return rows
    .map((row) => ({
      code: String(row.code || row.id || ""),
      name: String(row.name || ""),
    }))
    .filter((row) => Boolean(row.code && row.name));
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
    district: api?.district || "",
    village: api?.village || "",
    province: api?.province || "",
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

function createEditForm(profile: ProfileData): EditProfileFormState {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    username: profile.username,
    email: profile.email,
    phone: formatPhone(profile.phone),
    gender: profile.gender,
    dateOfBirth: toInputDate(profile.dateOfBirth),
    placeOfBirth: profile.placeOfBirth,
    address: profile.address,
    province: profile.province,
    city: profile.city,
    district: profile.district,
    village: profile.village,
    country: profile.country || "Indonesia",
  };
}

function createEmptyResetForm(): ResetPasswordFormState {
  return {
    newPassword: "",
    confirmPassword: "",
  };
}

function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  widthClass = "max-w-2xl",
  centered = false,
  dataTour,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  widthClass?: string;
  centered?: boolean;
  dataTour?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow || "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] overflow-y-auto bg-black/35 px-4 py-8 backdrop-blur-sm md:py-10"
      onClick={onClose}
    >
      <div
        className={`min-h-full ${centered ? "flex items-center justify-center" : "flex items-start justify-center"}`}
      >
        <div
          className={`relative w-full ${widthClass} max-h-[calc(100vh-4rem)] overflow-hidden rounded-[20px] bg-white shadow-2xl md:max-h-[calc(100vh-5rem)]`}
          onClick={(event) => event.stopPropagation()}
          data-tour={dataTour}
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                {icon}
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-slate-950">
                  {title}
                </h3>
                {subtitle ? (
                  <p className="mt-0.5 text-[13px] text-slate-500">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto md:max-h-[calc(100vh-9.5rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  icon,
  danger = false,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        danger
          ? "inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          : "inline-flex items-center gap-2 rounded-xl border border-[#dfc3bf] bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-[#f6f7f9]"
      }
    >
      {icon}
      {children}
    </button>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#b7a09e] bg-white p-5 md:p-6">
      <h3 className="mb-6 flex items-center gap-2 text-[18px] font-semibold text-slate-950">
        <span className="text-[15px] text-red-500">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function DetailField({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#5f7391]">
        {label}
      </p>
      <div
        className={`text-[14px] leading-6 ${
          muted ? "italic text-slate-500" : "font-medium text-slate-950"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: string }) {
  const normalized = normalizeStatus(value);
  const activeValues = new Set(["ACTIVE", "AKTIF", "YA", "YES", "VERIFIED"]);
  const isActive = activeValues.has(normalized);

  return (
    <span
      className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${
        isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
      }`}
    >
      {value}
    </span>
  );
}

function StatusRow({
  label,
  value,
  badge = false,
}: {
  label: string;
  value: React.ReactNode;
  badge?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-slate-200 py-2 last:border-b-0 last:pb-0">
      <span className="text-[13px] text-slate-500">{label}</span>
      {badge && typeof value === "string" ? (
        <StatusBadge value={value} />
      ) : (
        <span className="text-[13px] font-medium text-slate-950">{value}</span>
      )}
    </li>
  );
}

function TimelineItem({
  label,
  value,
  icon,
  active = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="relative flex items-start gap-4">
      <div
        className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
          active
            ? "border-red-600 bg-red-600 text-white"
            : "border-slate-300 bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-[13px] text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function PasswordStrength({ value }: { value: string }) {
  const hasMinLength = value.length >= 8;
  const hasNumber = /\d/.test(value);
  const score = [hasMinLength, hasNumber].filter(Boolean).length;
  const widthClass = score === 0 ? "w-0" : score === 1 ? "w-1/2" : "w-full";
  const label = score <= 1 ? "Weak" : "Strong";
  const colorClass = score <= 1 ? "bg-amber-400" : "bg-emerald-500";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[12px] text-slate-500">
        <span>Password Strength</span>
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${widthClass} ${colorClass} transition-all`} />
      </div>
      <div className="mt-3 space-y-1.5 text-[12px] text-slate-600">
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full border ${hasMinLength ? "border-indigo-500 bg-indigo-500" : "border-slate-400"}`}
          />
          <span>Minimum 8 characters</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full border ${hasNumber ? "border-indigo-500 bg-indigo-500" : "border-slate-400"}`}
          />
          <span>At least one number</span>
        </div>
      </div>
    </div>
  );
}

function UnsavedChangesModal({
  open,
  onContinueEditing,
  onDiscard,
}: {
  open: boolean;
  onContinueEditing: () => void;
  onDiscard: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-[18px] font-semibold text-slate-950">
            Perubahan Belum Disimpan
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Ada perubahan yang belum disave. Kamu mau lanjutkan mengedit atau
            langsung tutup tanpa save?
          </p>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4">
          <button
            type="button"
            onClick={onContinueEditing}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Lanjutkan Mengedit
          </button>
          <button
            type="button"
            onClick={onDiscard}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Tutup Tanpa Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  const { token, currentUser } = useAuth();
  const router = useRouter();
  const profileFileInputRef = useRef<HTMLInputElement | null>(null);
  const editActionRef = useRef<HTMLDivElement | null>(null);
  const resetActionRef = useRef<HTMLDivElement | null>(null);
  const photoActionRef = useRef<HTMLButtonElement | null>(null);
  const profileTourDriverRef = useRef<Driver | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditProfileFormState | null>(null);
  const [resetForm, setResetForm] = useState<ResetPasswordFormState>(
    createEmptyResetForm(),
  );
  const [editError, setEditError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [regencies, setRegencies] = useState<WilayahOption[]>([]);
  const [districts, setDistricts] = useState<WilayahOption[]>([]);
  const [villages, setVillages] = useState<WilayahOption[]>([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [regencyCode, setRegencyCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [villageCode, setVillageCode] = useState("");
  const [wilayahLoading, setWilayahLoading] = useState(false);
  const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(
    null,
  );
  const [selectedProfilePreview, setSelectedProfilePreview] =
    useState<string>("");
  const [pendingCloseTarget, setPendingCloseTarget] =
    useState<PendingCloseTarget>(null);
  const [featureTourOpen, setFeatureTourOpen] = useState(false);
  const [featureTourEntryStep, setFeatureTourEntryStep] =
    useState<ProfileFeatureTourEntryStep>("edit");
  const [hasSeenFeatureTour, setHasSeenFeatureTour] = useState(true);
  const [resultState, setResultState] = useState<ResultState>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });
  const regencyCache = useRef<Record<string, WilayahOption[]>>({});
  const districtCache = useRef<Record<string, WilayahOption[]>>({});
  const villageCache = useRef<Record<string, WilayahOption[]>>({});
  const profileTourFinalizingRef = useRef(false);

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
      const json = (await res
        .json()
        .catch(() => null)) as UserMeApiResponse | null;
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

  useEffect(() => {
    if (!profile || typeof window === "undefined") return;
    const pendingStep = getPendingFeatureTourStep(profileFeatureTourConfig);
    const hasSeenTour = isFeatureTourSeen(profileFeatureTourConfig);

    if (
      pendingStep === "edit" ||
      pendingStep === "photo" ||
      pendingStep === "form" ||
      pendingStep === "save" ||
      pendingStep === "password"
    ) {
      setHasSeenFeatureTour(false);

      const timer = window.setTimeout(() => {
        setFeatureTourEntryStep(pendingStep);
        setFeatureTourOpen(true);
      }, 450);

      return () => window.clearTimeout(timer);
    }

    if (hasSeenTour) {
      setHasSeenFeatureTour(true);
      return;
    }

    setHasSeenFeatureTour(false);
  }, [profile]);

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

  useEffect(() => {
    if (!profile) return;
    setEditForm(createEditForm(profile));
  }, [profile]);

  const isEditDirty = useMemo(() => {
    if (!profile || !editForm) return false;
    const baseline = createEditForm(profile);
    return (
      JSON.stringify(editForm) !== JSON.stringify(baseline) ||
      selectedProfileFile !== null
    );
  }, [editForm, profile, selectedProfileFile]);

  const isResetDirty = useMemo(() => {
    return Boolean(resetForm.newPassword || resetForm.confirmPassword);
  }, [resetForm]);

  useEffect(() => {
    if (!selectedProfileFile) {
      setSelectedProfilePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedProfileFile);
    setSelectedProfilePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedProfileFile]);

  const getRegencies = useCallback(async (nextProvinceCode: string) => {
    if (!nextProvinceCode) return [];
    if (regencyCache.current[nextProvinceCode]) {
      return regencyCache.current[nextProvinceCode];
    }
    const rows = await fetchWilayah(`regencies/${nextProvinceCode}.json`);
    regencyCache.current[nextProvinceCode] = rows;
    return rows;
  }, []);

  const getDistricts = useCallback(async (nextRegencyCode: string) => {
    if (!nextRegencyCode) return [];
    if (districtCache.current[nextRegencyCode]) {
      return districtCache.current[nextRegencyCode];
    }
    const rows = await fetchWilayah(`districts/${nextRegencyCode}.json`);
    districtCache.current[nextRegencyCode] = rows;
    return rows;
  }, []);

  const getVillages = useCallback(async (nextDistrictCode: string) => {
    if (!nextDistrictCode) return [];
    if (villageCache.current[nextDistrictCode]) {
      return villageCache.current[nextDistrictCode];
    }
    const rows = await fetchWilayah(`villages/${nextDistrictCode}.json`);
    villageCache.current[nextDistrictCode] = rows;
    return rows;
  }, []);

  const hydrateWilayahSelections = useCallback(
    async (form: EditProfileFormState) => {
      setWilayahLoading(true);
      try {
        const provinceRows =
          provinces.length > 0
            ? provinces
            : await fetchWilayah("provinces.json");
        setProvinces(provinceRows);

        const matchedProvince = matchByName(provinceRows, form.province);
        const nextProvinceCode = matchedProvince?.code || "";
        setProvinceCode(nextProvinceCode);

        if (!nextProvinceCode) {
          setRegencies([]);
          setDistricts([]);
          setVillages([]);
          setRegencyCode("");
          setDistrictCode("");
          setVillageCode("");
          return;
        }

        const regencyRows = await getRegencies(nextProvinceCode);
        setRegencies(regencyRows);
        const matchedRegency = matchByName(regencyRows, form.city);
        const nextRegencyCode = matchedRegency?.code || "";
        setRegencyCode(nextRegencyCode);

        if (!nextRegencyCode) {
          setDistricts([]);
          setVillages([]);
          setDistrictCode("");
          setVillageCode("");
          return;
        }

        const districtRows = await getDistricts(nextRegencyCode);
        setDistricts(districtRows);
        const matchedDistrict = matchByName(districtRows, form.district);
        const nextDistrictCode = matchedDistrict?.code || "";
        setDistrictCode(nextDistrictCode);

        if (!nextDistrictCode) {
          setVillages([]);
          setVillageCode("");
          return;
        }

        const villageRows = await getVillages(nextDistrictCode);
        setVillages(villageRows);
        const matchedVillage = matchByName(villageRows, form.village);
        setVillageCode(matchedVillage?.code || "");
      } finally {
        setWilayahLoading(false);
      }
    },
    [getDistricts, getRegencies, getVillages, provinces],
  );

  const openEditModal = useCallback(() => {
    if (!profile) return;
    const nextForm = createEditForm(profile);
    setEditError(null);
    setSelectedProfileFile(null);
    setSelectedProfilePreview("");
    setEditForm(nextForm);
    setEditOpen(true);
    void hydrateWilayahSelections(nextForm);
  }, [hydrateWilayahSelections, profile]);

  const openResetModal = useCallback(() => {
    setResetError(null);
    setResetForm(createEmptyResetForm());
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setResetOpen(true);
  }, []);

  const closeEditImmediately = useCallback(() => {
    setEditOpen(false);
    setPendingCloseTarget(null);
    setSelectedProfileFile(null);
    setSelectedProfilePreview("");
    setEditError(null);
    if (profile) {
      setEditForm(createEditForm(profile));
    }
  }, [profile]);

  const closeResetImmediately = useCallback(() => {
    setResetOpen(false);
    setPendingCloseTarget(null);
    setResetError(null);
    setResetForm(createEmptyResetForm());
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }, []);

  const requestCloseEdit = useCallback(() => {
    if (editSubmitting) return;
    if (isEditDirty) {
      setPendingCloseTarget("edit");
      return;
    }
    closeEditImmediately();
  }, [closeEditImmediately, editSubmitting, isEditDirty]);

  const requestCloseReset = useCallback(() => {
    if (resetSubmitting) return;
    if (isResetDirty) {
      setPendingCloseTarget("reset");
      return;
    }
    closeResetImmediately();
  }, [closeResetImmediately, isResetDirty, resetSubmitting]);

  const setEditField = useCallback(
    <K extends keyof EditProfileFormState>(
      field: K,
      value: EditProfileFormState[K],
    ) => {
      setEditForm((current) =>
        current ? { ...current, [field]: value } : current,
      );
    },
    [],
  );

  const setResetField = useCallback(
    <K extends keyof ResetPasswordFormState>(
      field: K,
      value: ResetPasswordFormState[K],
    ) => {
      setResetForm((current) => ({ ...current, [field]: value }));
    },
    [],
  );

  const onProvinceChange = useCallback(
    async (nextProvinceCode: string) => {
      const selected =
        provinces.find((item) => item.code === nextProvinceCode) || null;
      setProvinceCode(nextProvinceCode);
      setRegencyCode("");
      setDistrictCode("");
      setVillageCode("");
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
      setEditField("province", selected?.name || "");
      setEditField("city", "");
      setEditField("district", "");
      setEditField("village", "");
      if (!nextProvinceCode) return;

      setWilayahLoading(true);
      try {
        const rows = await getRegencies(nextProvinceCode);
        setRegencies(rows);
      } catch (err) {
        setEditError(
          err instanceof Error ? err.message : "Gagal memuat kota/kabupaten.",
        );
      } finally {
        setWilayahLoading(false);
      }
    },
    [getRegencies, provinces, setEditField],
  );

  const onRegencyChange = useCallback(
    async (nextRegencyCode: string) => {
      const selected =
        regencies.find((item) => item.code === nextRegencyCode) || null;
      setRegencyCode(nextRegencyCode);
      setDistrictCode("");
      setVillageCode("");
      setDistricts([]);
      setVillages([]);
      setEditField("city", selected?.name || "");
      setEditField("district", "");
      setEditField("village", "");
      if (!nextRegencyCode) return;

      setWilayahLoading(true);
      try {
        const rows = await getDistricts(nextRegencyCode);
        setDistricts(rows);
      } catch (err) {
        setEditError(
          err instanceof Error ? err.message : "Gagal memuat kecamatan.",
        );
      } finally {
        setWilayahLoading(false);
      }
    },
    [getDistricts, regencies, setEditField],
  );

  const onDistrictChange = useCallback(
    async (nextDistrictCode: string) => {
      const selected =
        districts.find((item) => item.code === nextDistrictCode) || null;
      setDistrictCode(nextDistrictCode);
      setVillageCode("");
      setVillages([]);
      setEditField("district", selected?.name || "");
      setEditField("village", "");
      if (!nextDistrictCode) return;

      setWilayahLoading(true);
      try {
        const rows = await getVillages(nextDistrictCode);
        setVillages(rows);
      } catch (err) {
        setEditError(
          err instanceof Error ? err.message : "Gagal memuat kelurahan/desa.",
        );
      } finally {
        setWilayahLoading(false);
      }
    },
    [districts, getVillages, setEditField],
  );

  const onVillageChange = useCallback(
    (nextVillageCode: string) => {
      const selected =
        villages.find((item) => item.code === nextVillageCode) || null;
      setVillageCode(nextVillageCode);
      setEditField("village", selected?.name || "");
    },
    [setEditField, villages],
  );

  const setPendingFeatureTourStep = useCallback((step: FeatureTourStep) => {
    storePendingFeatureTourStep(profileFeatureTourConfig, step);
  }, []);

  const persistFeatureTour = useCallback(() => {
    markFeatureTourSeen(profileFeatureTourConfig);
    setHasSeenFeatureTour(true);
  }, []);

  useEffect(() => {
    if (!featureTourOpen || typeof window === "undefined") return;

    let cancelled = false;
    profileTourFinalizingRef.current = false;

    const finishTour = () => {
      profileTourFinalizingRef.current = true;
      clearPendingFeatureTourStep(profileFeatureTourConfig);
      closeEditImmediately();
      closeResetImmediately();
      profileTourDriverRef.current?.destroy();
      profileTourDriverRef.current = null;
    };

    const startTour = async () => {
      if (featureTourEntryStep === "password") {
        closeEditImmediately();
        closeResetImmediately();
      } else if (featureTourEntryStep === "edit") {
        closeEditImmediately();
        closeResetImmediately();
        await waitForElementToDisappear("[data-tour='profile-edit-modal']", {
          timeout: 1000,
          interval: 50,
        });
        const editTarget = await waitForElement(PROFILE_TOUR_SELECTORS.edit, {
          timeout: 4000,
          interval: 100,
        });
        if (cancelled || !editTarget) return;
      } else if (featureTourEntryStep === "photo") {
        openEditModal();
        const photoTarget = await waitForElement(PROFILE_TOUR_SELECTORS.photo, {
          timeout: 4000,
          interval: 100,
        });
        if (cancelled || !photoTarget) return;
      } else if (featureTourEntryStep === "form") {
        openEditModal();
        const formTarget = await waitForElement(PROFILE_TOUR_SELECTORS.form, {
          timeout: 4000,
          interval: 100,
        });
        if (cancelled || !formTarget) return;
      } else if (featureTourEntryStep === "save") {
        openEditModal();
        const saveTarget = await waitForElement(PROFILE_TOUR_SELECTORS.save, {
          timeout: 4000,
          interval: 100,
        });
        if (cancelled || !saveTarget) return;
      } else if (featureTourEntryStep !== "edit") {
        closeEditImmediately();
      }

      if (cancelled) return;

      const goBackToProfileMenuStep = () => {
        closeEditImmediately();
        closeResetImmediately();
        setPendingFeatureTourStep(featureTourEntryStep);
        window.setTimeout(() => {
          profileTourDriverRef.current?.movePrevious();
        }, 50);
      };

      const headerSteps = createProfileHeaderTourSteps({
        openProfile: () => {
          profileTourDriverRef.current?.moveNext();
        },
        skipTour: finishTour,
      });

      const pageSteps =
        featureTourEntryStep === "password"
          ? createResetPasswordTourSteps({
              driverRef: profileTourDriverRef,
              backToMenu: goBackToProfileMenuStep,
              goToResetModal: async () => {
                closeEditImmediately();
                openResetModal();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.modal,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              goToResetForm: async () => {
                openResetModal();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.newPassword,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              goToResetConfirm: async () => {
                openResetModal();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.confirmPassword,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              goToResetSubmit: async () => {
                openResetModal();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.submit,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              backToResetButton: async () => {
                closeResetImmediately();
                closeEditImmediately();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.trigger,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              backToResetModal: async () => {
                closeEditImmediately();
                openResetModal();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.modal,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              backToResetNewPassword: async () => {
                closeEditImmediately();
                openResetModal();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.newPassword,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              backToResetConfirm: async () => {
                closeEditImmediately();
                openResetModal();
                setPendingFeatureTourStep("password");
                const target = await waitForElement(
                  RESET_PASSWORD_TOUR_SELECTORS.confirmPassword,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              finishTour,
            })
          : createProfilePageTourSteps({
              driverRef: profileTourDriverRef,
              backToMenu: goBackToProfileMenuStep,
              goToPhoto: async () => {
                openEditModal();
                setPendingFeatureTourStep("photo");
                const target = await waitForElement(
                  PROFILE_TOUR_SELECTORS.photo,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              goToForm: async () => {
                openEditModal();
                setPendingFeatureTourStep("form");
                const target = await waitForElement(
                  PROFILE_TOUR_SELECTORS.form,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              goToSave: async () => {
                openEditModal();
                setPendingFeatureTourStep("save");
                const target = await waitForElement(
                  PROFILE_TOUR_SELECTORS.save,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              backToEdit: async () => {
                closeEditImmediately();
                closeResetImmediately();
                setPendingFeatureTourStep("edit");
                const target = await waitForElement(
                  PROFILE_TOUR_SELECTORS.edit,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              backToPhoto: async () => {
                closeResetImmediately();
                openEditModal();
                setPendingFeatureTourStep("photo");
                const target = await waitForElement(
                  PROFILE_TOUR_SELECTORS.photo,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              backToForm: async () => {
                closeResetImmediately();
                openEditModal();
                setPendingFeatureTourStep("form");
                const target = await waitForElement(
                  PROFILE_TOUR_SELECTORS.form,
                  {
                    timeout: 4000,
                    interval: 100,
                  },
                );
                return Boolean(target);
              },
              finishTour,
            });

      profileTourDriverRef.current?.destroy();
      profileTourDriverRef.current = createDriverTour({
        onDestroyed: () => {
          profileTourDriverRef.current = null;

          if (profileTourFinalizingRef.current) {
            profileTourFinalizingRef.current = false;
            setFeatureTourOpen(false);
            persistFeatureTour();
          }
        },
        steps: createDriverSteps([...headerSteps, ...pageSteps]),
      });

      profileTourDriverRef.current.drive(
        featureTourEntryStep === "password"
          ? getResetPasswordTourStartIndex() + headerSteps.length
          : getProfilePageTourStartIndex(featureTourEntryStep) +
              headerSteps.length,
      );
    };

    void startTour();

    return () => {
      cancelled = true;
      profileTourFinalizingRef.current = false;
      profileTourDriverRef.current?.destroy();
      profileTourDriverRef.current = null;
    };
  }, [
    closeEditImmediately,
    closeResetImmediately,
    featureTourEntryStep,
    featureTourOpen,
    openEditModal,
    openResetModal,
    persistFeatureTour,
    router,
    setPendingFeatureTourStep,
  ]);

  const onProfileFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setEditError("File foto profil harus berupa gambar.");
        event.target.value = "";
        return;
      }

      setEditError(null);
      setSelectedProfileFile(file);
    },
    [],
  );

  const handleEditSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!token || !editForm) return;

      setEditError(null);

      if (!editForm.firstName.trim()) {
        setEditError("First name wajib diisi.");
        return;
      }
      if (!editForm.username.trim()) {
        setEditError("Username wajib diisi.");
        return;
      }
      if (!editForm.email.trim()) {
        setEditError("Email wajib diisi.");
        return;
      }

      const payload = {
        first_name: editForm.firstName.trim(),
        last_name: editForm.lastName.trim(),
        full_name:
          `${editForm.firstName.trim()} ${editForm.lastName.trim()}`.trim(),
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        phone: normalizePhoneForApi(editForm.phone),
        gender: editForm.gender.trim(),
        date_of_birth: editForm.dateOfBirth || null,
        place_of_birth: editForm.placeOfBirth.trim(),
        address: editForm.address.trim(),
        city: editForm.city.trim(),
        province: editForm.province.trim(),
        district: editForm.district.trim(),
        village: editForm.village.trim(),
        country: editForm.country.trim(),
      };

      const requestBody =
        selectedProfileFile !== null
          ? (() => {
              const formData = new FormData();
              Object.entries(payload).forEach(([key, value]) => {
                formData.append(key, value ?? "");
              });
              formData.append("profile_pic", selectedProfileFile);
              return formData;
            })()
          : JSON.stringify(payload);

      setEditSubmitting(true);
      try {
        const res = await apiFetch(
          getApiUrl(API_CONFIG.ENDPOINTS.USER_ME),
          {
            method: "PUT",
            body: requestBody,
          },
          token,
        );
        const json = (await res
          .json()
          .catch(() => null)) as UserMeApiResponse | null;
        if (!res.ok || !json?.data) {
          throw new Error(
            json?.message || `Gagal update profil (${res.status})`,
          );
        }

        const mappedProfile = mapProfile(json.data);
        const nextProfile: ProfileData = {
          ...mappedProfile,
          address: mappedProfile.address || payload.address,
          city: mappedProfile.city || payload.city,
          province: mappedProfile.province || payload.province,
          district: mappedProfile.district || payload.district,
          village: mappedProfile.village || payload.village,
          country: mappedProfile.country || payload.country,
        };
        setProfile(nextProfile);
        setEditForm(createEditForm(nextProfile));
        setSelectedProfileFile(null);
        setSelectedProfilePreview("");
        setEditOpen(false);
        localStorage.setItem(
          "ekaplus_user_data",
          JSON.stringify({
            ...(currentUser || {}),
            first_name: json.data.first_name || "",
            last_name: json.data.last_name || "",
            full_name: json.data.full_name || "",
            username: json.data.username || "",
            email: json.data.email || "",
            phone: json.data.phone || "",
            gender: json.data.gender || "",
            date_of_birth: json.data.date_of_birth || "",
            birth_place: json.data.place_of_birth || "",
            profile_pic: json.data.profile_pic || null,
            city: json.data.city || "",
            province: json.data.province || "",
            district: json.data.district || "",
            village: json.data.village || "",
            address: json.data.address || "",
            country: json.data.country || nextProfile.country || "Indonesia",
            role: json.data.role || currentUser?.role || "",
            workflow_state:
              json.data.workflow_state || currentUser?.workflow_state || null,
            status: String(json.data.status ?? currentUser?.status ?? ""),
            is_system: Boolean(json.data.is_system ?? currentUser?.is_system),
            updated_at: json.data.updated_at || currentUser?.updated_at || "",
          }),
        );
        setResultState({
          isOpen: true,
          type: "success",
          title: "Profil diperbarui",
          message: json.message || "User updated successfully",
          description: "Perubahan profil sudah tersimpan.",
        });
      } catch (err) {
        setEditError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat update profil.",
        );
      } finally {
        setEditSubmitting(false);
      }
    },
    [currentUser, editForm, selectedProfileFile, token],
  );

  const handleResetSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!token) return;

      setResetError(null);

      const { newPassword, confirmPassword } = resetForm;
      if (newPassword.length < 8) {
        setResetError("New password minimal 8 karakter.");
        return;
      }
      if (!/\d/.test(newPassword)) {
        setResetError("New password harus mengandung minimal satu angka.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setResetError("Confirm password belum sama dengan new password.");
        return;
      }

      const payload = {
        new_password: newPassword,
        confirm_password: confirmPassword,
        password: newPassword,
      };

      setResetSubmitting(true);
      try {
        const res = await apiFetch(
          getApiUrl(API_CONFIG.ENDPOINTS.USER_ME),
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token,
        );
        const json = (await res.json().catch(() => null)) as {
          message?: string;
          data?: UserMeApiResponse["data"];
        } | null;
        if (!res.ok) {
          throw new Error(
            json?.message || `Gagal reset password (${res.status})`,
          );
        }

        setResetOpen(false);
        setResetForm(createEmptyResetForm());
        setResultState({
          isOpen: true,
          type: "success",
          title: "Password diperbarui",
          message: json?.message || "Password berhasil diperbarui",
          description: "Password akun kamu sudah berhasil diganti.",
        });
      } catch (err) {
        setResetError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat update password.",
        );
      } finally {
        setResetSubmitting(false);
      }
    },
    [resetForm, token],
  );

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
          className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <FaRedoAlt className="h-4 w-4" />
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!profile || !editForm) return null;

  return (
    <>
      <div className="space-y-5 pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
          {/* <div className="flex items-center gap-2 text-[14px] text-slate-500">
            <span>User Management</span>
            <FaChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-medium text-slate-950">Profile Detail</span>
          </div> */}

          <div className="flex flex-wrap gap-3">
            <div
              ref={editActionRef}
              data-tour="profile-edit-action"
              className="relative"
            >
              <ActionButton
                icon={<FaEdit className="h-3.5 w-3.5" />}
                onClick={openEditModal}
              >
                Edit Profile
                {/* {!hasSeenFeatureTour ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                    New
                  </span>
                ) : null} */}
              </ActionButton>
            </div>
            <div
              ref={resetActionRef}
              data-tour="profile-reset-action"
              className="relative"
            >
              <ActionButton
                icon={<FaLock className="h-3.5 w-3.5" />}
                danger
                onClick={openResetModal}
              >
                Reset Password
                {/* {!hasSeenFeatureTour ? (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    New
                  </span>
                ) : null} */}
              </ActionButton>
            </div>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-[#8d7b79] bg-white p-6 md:p-7">
          <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-56 w-56 rounded-full bg-gradient-to-br from-red-100/70 to-transparent blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative shrink-0">
              <div
                className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 text-2xl font-bold text-slate-700 shadow-sm"
                style={{
                  backgroundColor:
                    avatarUrl || !currentUser?.profile_bg_color
                      ? undefined
                      : currentUser.profile_bg_color,
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
              <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div className="relative z-10 flex-1 text-center md:text-left">
              <div className="mb-1 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <h2 className="text-[30px] font-bold leading-[38px] tracking-[-0.02em] text-slate-950">
                  {profile.fullName}
                </h2>
                <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-red-500">
                  {displayValue(profile.role)}
                </span>
              </div>

              <p className="mb-4 text-[14px] text-slate-500">{profile.email}</p>

              <div className="flex flex-wrap justify-center gap-4 text-[12px] text-slate-500 md:justify-start">
                <div className="flex items-center gap-1.5">
                  <FaCalendarAlt className="h-3.5 w-3.5 text-red-400" />
                  <span>Joined {formatJoinedDate(profile.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="h-3.5 w-3.5 text-red-400" />
                  <span>{displayValue(profile.country)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <SectionCard title="Identitas (Account Info)" icon={<FaUser />}>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <DetailField label="User ID" value={profile.id} />
                <DetailField label="Username" value={profile.username} />
                <DetailField
                  label="First Name"
                  value={displayValue(profile.firstName)}
                />
                <DetailField
                  label="Last Name"
                  value={displayValue(profile.lastName)}
                />
                <DetailField
                  label="Email"
                  value={
                    <div className="flex items-center gap-2">
                      <span>{profile.email}</span>
                      {profile.isEmailVerified && (
                        <FaCheckCircle className="h-3.5 w-3.5 text-green-600" />
                      )}
                    </div>
                  }
                />
                <DetailField
                  label="Phone"
                  value={
                    <div className="flex items-center gap-2">
                      <span>{formatPhone(profile.phone)}</span>
                      {profile.isPhoneVerified && (
                        <FaCheckCircle className="h-3.5 w-3.5 text-green-600" />
                      )}
                    </div>
                  }
                />
                <DetailField
                  label="Date of Birth"
                  value={formatDate(profile.dateOfBirth)}
                />
                <DetailField
                  label="Place of Birth"
                  value={displayValue(profile.placeOfBirth)}
                  muted={!profile.placeOfBirth}
                />
                <DetailField
                  label="Gender"
                  value={displayValue(profile.gender)}
                  muted={!profile.gender}
                />
              </div>
            </SectionCard>

            <SectionCard title="Integrasi (Connections)" icon={<FaLink />}>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                <DetailField
                  label="Google ID"
                  value={
                    <span className="inline-block break-all rounded bg-slate-100 px-2 py-1 font-mono text-[13px]">
                      {displayValue(profile.googleId)}
                    </span>
                  }
                />
                <DetailField
                  label="Referral Code"
                  value={displayValue(profile.referralCode)}
                  muted={!profile.referralCode}
                />
                <DetailField
                  label="Referred By"
                  value={displayValue(profile.referredBy)}
                  muted={!profile.referredBy}
                />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5">
            <SectionCard title="Status & Akses" icon={<FaShieldAlt />}>
              <ul className="space-y-0">
                <StatusRow
                  label="Workflow State"
                  value={profile.workflowState}
                  badge
                />
                <StatusRow label="Status" value={profile.status} badge />
                <StatusRow label="Role" value={profile.role} />
                <StatusRow label="Token Version" value={profile.tokenVersion} />
                <StatusRow
                  label="System User"
                  value={profile.isSystem ? "Ya" : "Tidak"}
                />
              </ul>
            </SectionCard>

            <SectionCard title="Alamat Pengguna" icon={<FaMapMarkerAlt />}>
              <div className="space-y-4">
                <DetailField
                  label="Alamat Lengkap"
                  value={displayValue(profile.address)}
                  muted={!profile.address}
                />
                <div className="grid grid-cols-2 gap-4">
                  <DetailField
                    label="Province"
                    value={displayValue(profile.province)}
                    muted={!profile.province}
                  />
                  <DetailField
                    label="City"
                    value={displayValue(profile.city)}
                    muted={!profile.city}
                  />
                  <DetailField
                    label="District"
                    value={displayValue(profile.district)}
                    muted={!profile.district}
                  />
                  <DetailField
                    label="Village"
                    value={displayValue(profile.village)}
                    muted={!profile.village}
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Riwayat Akun" icon={<FaHistory />}>
              <div className="relative pl-0 before:absolute before:left-[9px] before:top-1 before:h-[calc(100%-20px)] before:w-px before:bg-slate-200">
                <TimelineItem
                  label="Last Login"
                  value={formatDate(profile.lastLogin)}
                  icon={<FaSignInAlt />}
                  active
                />
                <TimelineItem
                  label="Updated At"
                  value={formatDate(profile.updatedAt)}
                  icon={<FaRedoAlt />}
                />
                <TimelineItem
                  label="Created At"
                  value={formatDate(profile.createdAt)}
                  icon={<FaCalendarAlt />}
                />
              </div>
            </SectionCard>
          </div>
        </section>
      </div>

      <ModalShell
        open={editOpen}
        onClose={requestCloseEdit}
        title="Edit Profile"
        subtitle="Perbarui informasi profil akun kamu."
        icon={<FaEdit className="h-4 w-4" />}
        widthClass="max-w-5xl"
        dataTour="profile-edit-modal"
      >
        <form onSubmit={handleEditSubmit} className="px-5 py-5 md:px-6 md:py-6">
          {editError ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {editError}
            </div>
          ) : null}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-[28px] font-bold tracking-[-0.02em] text-slate-950">
                Edit Profile
              </h4>
              <p className="mt-1 text-[14px] text-slate-500">
                Update your personal information and address.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={requestCloseEdit}
                disabled={editSubmitting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                data-tour="profile-save-action"
                type="submit"
                disabled={editSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-70"
              >
                {editSubmitting ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  <FaEdit className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex w-full flex-col items-center rounded-2xl border border-slate-300 bg-[#fbfbfc] p-6 text-center shadow-sm">
                <div className="relative mb-4">
                  <input
                    ref={profileFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onProfileFileChange}
                    className="hidden"
                  />
                  <div
                    className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 text-3xl font-bold text-slate-700 shadow-md"
                    style={{
                      backgroundColor:
                        selectedProfilePreview ||
                        avatarUrl ||
                        !currentUser?.profile_bg_color
                          ? undefined
                          : currentUser.profile_bg_color,
                    }}
                  >
                    {selectedProfilePreview || avatarUrl ? (
                      <Image
                        src={selectedProfilePreview || avatarUrl}
                        alt={profile.fullName}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <button
                    ref={photoActionRef}
                    data-tour="profile-photo-action"
                    type="button"
                    onClick={() => profileFileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                  >
                    <FaEdit className="h-4 w-4 " />
                  </button>
                </div>
                <h5 className="text-[18px] font-semibold text-slate-950">
                  {profile.fullName}
                </h5>
                <p className="mt-1 text-[13px] text-slate-500">
                  {profile.role || "User"}
                </p>
                <p className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-[12px] text-slate-600 ">
                  @{profile.username}
                </p>
                {selectedProfileFile ? (
                  <p className="mt-3 text-[12px] text-slate-500 ">
                    Foto baru: {selectedProfileFile.name}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-8">
              <div
                data-tour="profile-form-section"
                className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm"
              >
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <FaUser className="h-4 w-4 text-slate-500" />
                  <h5 className="text-[18px] font-semibold text-slate-950">
                    Identitas{" "}
                    <span className="font-normal text-slate-500">
                      (Account Info)
                    </span>
                  </h5>
                </div>
                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      First Name
                    </span>
                    <input
                      value={editForm.firstName}
                      onChange={(e) =>
                        setEditField("firstName", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Last Name
                    </span>
                    <input
                      value={editForm.lastName}
                      onChange={(e) => setEditField("lastName", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Username
                    </span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        @
                      </span>
                      <input
                        value={editForm.username}
                        disabled
                        className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 py-2 pl-7 pr-3 text-[14px] text-slate-500 outline-none"
                      />
                    </div>
                    <span className="text-[12px] text-slate-500">
                      Username cannot be changed.
                    </span>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Email
                    </span>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditField("email", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Phone
                    </span>
                    <input
                      value={editForm.phone}
                      onChange={(e) => setEditField("phone", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Date of Birth
                    </span>
                    <input
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={(e) =>
                        setEditField("dateOfBirth", e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 md:col-span-2">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Gender
                    </span>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditField("gender", e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    >
                      <option value="">Pilih gender</option>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-6 py-4">
                  <FaMapMarkerAlt className="h-4 w-4 text-slate-500" />
                  <h5 className="text-[18px] font-semibold text-slate-950">
                    Alamat Pengguna{" "}
                    <span className="font-normal text-slate-500">
                      (Location)
                    </span>
                  </h5>
                </div>
                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5 md:col-span-2">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Full Address
                    </span>
                    <textarea
                      rows={3}
                      value={editForm.address}
                      onChange={(e) => setEditField("address", e.target.value)}
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Province
                    </span>
                    <select
                      value={provinceCode}
                      onChange={(e) => void onProvinceChange(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300"
                    >
                      <option value="">
                        {wilayahLoading && provinces.length === 0
                          ? "Loading provinces..."
                          : "Pilih Provinsi"}
                      </option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      City
                    </span>
                    <select
                      value={regencyCode}
                      onChange={(e) => void onRegencyChange(e.target.value)}
                      disabled={!provinceCode}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="">
                        {provinceCode
                          ? "Pilih Kota/Kabupaten"
                          : "Pilih provinsi terlebih dahulu"}
                      </option>
                      {regencies.map((regency) => (
                        <option key={regency.code} value={regency.code}>
                          {regency.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      District
                    </span>
                    <select
                      value={districtCode}
                      onChange={(e) => void onDistrictChange(e.target.value)}
                      disabled={!regencyCode}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="">
                        {regencyCode
                          ? "Pilih Kecamatan"
                          : "Pilih kota terlebih dahulu"}
                      </option>
                      {districts.map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-500">
                      Village
                    </span>
                    <select
                      value={villageCode}
                      onChange={(e) => onVillageChange(e.target.value)}
                      disabled={!districtCode}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[14px] text-slate-900 outline-none transition focus:border-red-400 focus:ring-1 focus:ring-red-300 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                      <option value="">
                        {districtCode
                          ? "Pilih Kelurahan/Desa"
                          : "Pilih kecamatan terlebih dahulu"}
                      </option>
                      {villages.map((village) => (
                        <option key={village.code} value={village.code}>
                          {village.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </ModalShell>

      <ModalShell
        open={resetOpen}
        onClose={requestCloseReset}
        title="Reset Password"
        subtitle="Secure your Precision Admin account."
        icon={<FaLock className="h-4 w-4" />}
        widthClass="max-w-md"
        centered
        dataTour="profile-reset-modal"
      >
        <form onSubmit={handleResetSubmit} className="space-y-5 px-5 py-5">
          {resetError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {resetError}
            </div>
          ) : null}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              New Password
            </span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={resetForm.newPassword}
                onChange={(e) => setResetField("newPassword", e.target.value)}
                placeholder="Enter new password"
                data-tour="profile-reset-new-password"
                className="w-full rounded-xl border border-[#e8c9c6] py-2.5 pl-10 pr-11 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
              <FaLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowNewPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showNewPassword ? (
                  <FaEyeSlash className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          <PasswordStrength value={resetForm.newPassword} />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Confirm New Password
            </span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={resetForm.confirmPassword}
                onChange={(e) =>
                  setResetField("confirmPassword", e.target.value)
                }
                placeholder="Re-enter new password"
                data-tour="profile-reset-confirm-password"
                className="w-full rounded-xl border border-[#e8c9c6] py-2.5 pl-10 pr-11 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
              <FaLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-4 w-4" />
                ) : (
                  <FaEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={requestCloseReset}
              disabled={resetSubmitting}
              className="rounded-xl border border-[#dfc3bf] px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={resetSubmitting}
              data-tour="profile-reset-submit"
              className="inline-flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:opacity-70"
            >
              {resetSubmitting ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Update Password</span>
                  <FaArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </ModalShell>

      <ActionResultModal
        isOpen={resultState.isOpen}
        type={resultState.type}
        title={resultState.title}
        message={resultState.message}
        description={resultState.description}
        onClose={() =>
          setResultState((current) => ({
            ...current,
            isOpen: false,
          }))
        }
      />

      <UnsavedChangesModal
        open={pendingCloseTarget !== null}
        onContinueEditing={() => setPendingCloseTarget(null)}
        onDiscard={() => {
          if (pendingCloseTarget === "edit") {
            closeEditImmediately();
            return;
          }
          if (pendingCloseTarget === "reset") {
            closeResetImmediately();
          }
        }}
      />
    </>
  );
}
