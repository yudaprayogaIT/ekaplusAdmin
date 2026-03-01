"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaSave, FaPlus, FaTrash } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type { CustomerRegistration, CustomerRegistrationShippingAddress } from "@/types/customerRegistration";
import { useAuth } from "@/contexts/AuthContext";
import { API_CONFIG, apiFetch, getQueryUrl, getResourceUrl } from "@/config/api";

interface EditRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: () => void;
}

interface BranchOption {
  id: number;
  branch_name: string;
  city?: string;
}

interface ShippingApiRow {
  id?: number;
  parent_id?: number;
  label?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  postal_code?: string | null;
  country?: string | null;
  pic_name?: string | null;
  pic_phone?: string | null;
  is_default?: number | boolean | null;
}

interface WilayahOption {
  code: string;
  name: string;
}

interface ShippingAreaState {
  provinceCode: string;
  regencyCode: string;
  regencies: WilayahOption[];
  districts: WilayahOption[];
}

interface FormState {
  owner_full_name: string;
  owner_phone: string;
  owner_email: string;
  owner_place_of_birth: string;
  owner_date_of_birth: string;
  branch_owner: string;
  branch_owner_phone: string;
  branch_owner_email: string;
  branch_owner_place_of_birth: string;
  branch_owner_date_of_birth: string;
  company_type: string;
  company_title: string;
  company_name: string;
  product_need: string;
  branch_id: number | null;
  company_address: string;
  company_province: string;
  company_city: string;
  company_district: string;
  company_postal_code: string;
  same_as_company_address: boolean;
  shipping_addresses: CustomerRegistrationShippingAddress[];
}

const COMPANY_TYPE_OPTIONS = ["Company", "Individual"];
const COMPANY_TITLE_OPTIONS = ["Toko", "Home Industri", "Freelance", "PT", "CV", "UD"];
const PRODUCT_NEED_OPTIONS = ["Bahan Baku Springbed & Sofa", "Furniture"];
const WILAYAH_BASE_URL = "https://wilayah.id/api";

function toInputDate(value?: string) {
  if (!value || value === "-") return "";
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return value.split("T")[0] || "";
}

function emptyShipping(): CustomerRegistrationShippingAddress {
  return {
    label: "",
    address: "",
    city: "",
    province: "",
    district: "",
    postal_code: "",
    pic_name: "",
    pic_phone: "",
    is_default: 0,
  };
}

function payloadShipping(addr: CustomerRegistrationShippingAddress) {
  return {
    label: addr.label || "",
    pic_name: addr.pic_name || "",
    pic_phone: addr.pic_phone || "",
    address: addr.address || "",
    city: addr.city || "",
    district: addr.district || "",
    postal_code: addr.postal_code || "",
    province: addr.province || "",
    is_default: addr.is_default ? 1 : 0,
  };
}

function normalizeName(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function matchByName(options: WilayahOption[], value?: string | null) {
  const target = normalizeName(value);
  if (!target) return null;
  return options.find((opt) => normalizeName(opt.name) === target) || null;
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
  const rows: Array<{ code?: string; name?: string }> = Array.isArray(json?.data)
    ? json.data
    : [];
  const mapped: WilayahOption[] = rows.map((row) => ({
    code: String(row.code || ""),
    name: String(row.name || ""),
  }));
  return mapped.filter((row: WilayahOption) => Boolean(row.code && row.name));
}

function emptyShippingAreaState(): ShippingAreaState {
  return {
    provinceCode: "",
    regencyCode: "",
    regencies: [],
    districts: [],
  };
}

export function EditRegistrationModal({ isOpen, onClose, registration, onSuccess }: EditRegistrationModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [form, setForm] = useState<FormState | null>(null);
  const [snapshot, setSnapshot] = useState("");
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [companyProvinceCode, setCompanyProvinceCode] = useState("");
  const [companyRegencyCode, setCompanyRegencyCode] = useState("");
  const [companyRegencies, setCompanyRegencies] = useState<WilayahOption[]>([]);
  const [companyDistricts, setCompanyDistricts] = useState<WilayahOption[]>([]);
  const [shippingAreaStates, setShippingAreaStates] = useState<ShippingAreaState[]>([]);
  const [isLoadingWilayah, setIsLoadingWilayah] = useState(false);
  const [sameAsOwner, setSameAsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    if (!form || !snapshot) return false;
    return JSON.stringify(form) !== snapshot;
  }, [form, snapshot]);
  const isWilayahApiAvailable = provinces.length > 0;

  const regencyCache = useRef<Record<string, WilayahOption[]>>({});
  const districtCache = useRef<Record<string, WilayahOption[]>>({});

  const getRegencies = async (provinceCode: string) => {
    if (!provinceCode) return [];
    if (regencyCache.current[provinceCode]) return regencyCache.current[provinceCode];
    const rows = await fetchWilayah(`regencies/${provinceCode}.json`);
    regencyCache.current[provinceCode] = rows;
    return rows;
  };

  const getDistricts = async (regencyCode: string) => {
    if (!regencyCode) return [];
    if (districtCache.current[regencyCode]) return districtCache.current[regencyCode];
    const rows = await fetchWilayah(`districts/${regencyCode}.json`);
    districtCache.current[regencyCode] = rows;
    return rows;
  };

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      if (!isOpen || !registration || !token || !isAuthenticated) return;
      setIsLoading(true);
      setIsLoadingWilayah(true);
      setError(null);
      try {
        const shippingSpec = {
          fields: ["*"],
          filters: [["parent_id", "=", Number(registration.id)]],
        };
        const branchSpec = { fields: ["id", "branch_name", "city"], limit: 1000000 };
        const [shippingRes, branchRes, provinceRows] = await Promise.all([
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, shippingSpec),
            { method: "GET", cache: "no-store" },
            token
          ),
          apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.BRANCH, branchSpec),
            { method: "GET", cache: "no-store" },
            token
          ),
          fetchWilayah("provinces.json").catch(() => [] as WilayahOption[]),
        ]);
        if (!branchRes.ok) throw new Error(`Failed to fetch branches (${branchRes.status})`);

        let shippingRows: ShippingApiRow[] = [];
        if (shippingRes.ok) {
          const shippingJson = await shippingRes.json();
          shippingRows = Array.isArray(shippingJson?.data) ? shippingJson.data : [];
        } else {
          // Fallback: some backend deployments reject filters, fetch all then filter client-side
          const fallbackRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, { fields: ["*"] }),
            { method: "GET", cache: "no-store" },
            token
          );
          if (!fallbackRes.ok) {
            throw new Error(`Failed to fetch shipping (${shippingRes.status})`);
          }
          const fallbackJson = await fallbackRes.json();
          const allRows: ShippingApiRow[] = Array.isArray(fallbackJson?.data)
            ? fallbackJson.data
            : [];
          shippingRows = allRows.filter(
            (row) => Number(row.parent_id || 0) === Number(registration.id)
          );
        }

        const branchJson = await branchRes.json();
        const branchRows: BranchOption[] = Array.isArray(branchJson?.data) ? branchJson.data : [];

        const shipping = shippingRows.map((x) => ({
          id: x.id,
          parent_id: x.parent_id,
          label: x.label || "",
          address: x.address || "",
          city: x.city || "",
          province: x.province || "",
          district: x.district || "",
          postal_code: x.postal_code || "",
          country: x.country || "",
          pic_name: x.pic_name || "",
          pic_phone: x.pic_phone || "",
          is_default: x.is_default ? 1 : 0,
        }));

        const initial: FormState = {
          owner_full_name: registration.user.full_name || "",
          owner_phone: registration.user.phone || "",
          owner_email: registration.user.email || "",
          owner_place_of_birth: registration.user.place_of_birth || "",
          owner_date_of_birth: toInputDate(registration.user.date_of_birth),
          branch_owner: registration.branch_owner?.full_name || "",
          branch_owner_phone: registration.branch_owner?.phone || "",
          branch_owner_email: registration.branch_owner?.email || "",
          branch_owner_place_of_birth: registration.branch_owner?.place_of_birth || "",
          branch_owner_date_of_birth: toInputDate(registration.branch_owner?.date_of_birth),
          company_type: registration.company.company_type || "",
          company_title: registration.company.company_title || "",
          company_name: registration.company.name || "",
          product_need: registration.company.product_need || "",
          branch_id: registration.company.branch_id || null,
          company_address: registration.address.full_address || "",
          company_province: registration.address.province_name || "",
          company_city: registration.address.city_name || "",
          company_district: registration.address.district_name || "",
          company_postal_code: registration.address.postal_code || "",
          same_as_company_address: Boolean(registration.same_as_company_address),
          shipping_addresses: shipping,
        };

        const companyProvince = matchByName(provinceRows, initial.company_province);
        const nextCompanyProvinceCode = companyProvince?.code || "";
        let nextCompanyRegencies: WilayahOption[] = [];
        let nextCompanyRegencyCode = "";
        let nextCompanyDistricts: WilayahOption[] = [];
        if (nextCompanyProvinceCode && provinceRows.length > 0) {
          nextCompanyRegencies = await getRegencies(nextCompanyProvinceCode);
          const companyRegency = matchByName(nextCompanyRegencies, initial.company_city);
          nextCompanyRegencyCode = companyRegency?.code || "";
          if (nextCompanyRegencyCode) {
            nextCompanyDistricts = await getDistricts(nextCompanyRegencyCode);
          }
        }

        const nextShippingAreaStates: ShippingAreaState[] = provinceRows.length > 0
          ? await Promise.all(
              initial.shipping_addresses.map(async (addr) => {
                const province = matchByName(provinceRows, addr.province);
                if (!province) return emptyShippingAreaState();
                const regencies = await getRegencies(province.code);
                const regency = matchByName(regencies, addr.city);
                if (!regency) {
                  return {
                    provinceCode: province.code,
                    regencyCode: "",
                    regencies,
                    districts: [],
                  };
                }
                const districts = await getDistricts(regency.code);
                return {
                  provinceCode: province.code,
                  regencyCode: regency.code,
                  regencies,
                  districts,
                };
              })
            )
          : initial.shipping_addresses.map(() => emptyShippingAreaState());

        if (!cancelled) {
          setBranches(branchRows);
          setProvinces(provinceRows);
          setCompanyProvinceCode(nextCompanyProvinceCode);
          setCompanyRegencyCode(nextCompanyRegencyCode);
          setCompanyRegencies(nextCompanyRegencies);
          setCompanyDistricts(nextCompanyDistricts);
          setShippingAreaStates(nextShippingAreaStates);
          setForm(initial);
          setSnapshot(JSON.stringify(initial));
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat data edit");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingWilayah(false);
        }
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [isOpen, registration, token, isAuthenticated]);

  useEffect(() => {
    if (!sameAsOwner) return;
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        branch_owner: prev.owner_full_name,
        branch_owner_phone: prev.owner_phone,
        branch_owner_email: prev.owner_email,
        branch_owner_place_of_birth: prev.owner_place_of_birth,
        branch_owner_date_of_birth: prev.owner_date_of_birth,
      };
    });
  }, [sameAsOwner, form?.owner_full_name, form?.owner_phone, form?.owner_email, form?.owner_place_of_birth, form?.owner_date_of_birth]);

  useEffect(() => {
    if (!form) return;
    setShippingAreaStates((prev) => {
      if (prev.length === form.shipping_addresses.length) return prev;
      const next = [...prev];
      while (next.length < form.shipping_addresses.length) {
        next.push(emptyShippingAreaState());
      }
      return next.slice(0, form.shipping_addresses.length);
    });
  }, [form]);

  if (!registration || !form) return null;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  const updateShip = (idx: number, patch: Partial<CustomerRegistrationShippingAddress>) => setForm((prev) => {
    if (!prev) return prev;
    const next = [...prev.shipping_addresses];
    next[idx] = { ...next[idx], ...patch };
    return { ...prev, shipping_addresses: next };
  });
  const addShip = () => {
    setForm((prev) => prev ? { ...prev, shipping_addresses: [...prev.shipping_addresses, emptyShipping()] } : prev);
    setShippingAreaStates((prev) => [...prev, emptyShippingAreaState()]);
  };
  const removeShip = (idx: number) => {
    setForm((prev) => prev ? { ...prev, shipping_addresses: prev.shipping_addresses.filter((_, i) => i !== idx) } : prev);
    setShippingAreaStates((prev) => prev.filter((_, i) => i !== idx));
  };
  const setDefaultShip = (idx: number) => setForm((prev) => prev ? { ...prev, shipping_addresses: prev.shipping_addresses.map((x, i) => ({ ...x, is_default: i === idx ? 1 : 0 })) } : prev);

  const onCompanyProvinceChange = async (provinceCode: string) => {
    const selected = provinces.find((x) => x.code === provinceCode) || null;
    setCompanyProvinceCode(provinceCode);
    setCompanyRegencyCode("");
    setCompanyDistricts([]);
    setField("company_province", selected?.name || "");
    setField("company_city", "");
    setField("company_district", "");
    if (!provinceCode) {
      setCompanyRegencies([]);
      return;
    }
    try {
      const rows = await getRegencies(provinceCode);
      setCompanyRegencies(rows);
    } catch (e) {
      setCompanyRegencies([]);
      setError(e instanceof Error ? e.message : "Gagal memuat kota/kabupaten");
    }
  };

  const onCompanyRegencyChange = async (regencyCode: string) => {
    const selected = companyRegencies.find((x) => x.code === regencyCode) || null;
    setCompanyRegencyCode(regencyCode);
    setField("company_city", selected?.name || "");
    setField("company_district", "");
    if (!regencyCode) {
      setCompanyDistricts([]);
      return;
    }
    try {
      const rows = await getDistricts(regencyCode);
      setCompanyDistricts(rows);
    } catch (e) {
      setCompanyDistricts([]);
      setError(e instanceof Error ? e.message : "Gagal memuat kecamatan");
    }
  };

  const onCompanyDistrictChange = (districtCode: string) => {
    const selected = companyDistricts.find((x) => x.code === districtCode) || null;
    setField("company_district", selected?.name || "");
  };

  const onShippingProvinceChange = async (idx: number, provinceCode: string) => {
    const selected = provinces.find((x) => x.code === provinceCode) || null;
    updateShip(idx, { province: selected?.name || "", city: "", district: "" });
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        provinceCode,
        regencyCode: "",
        regencies: [],
        districts: [],
      };
      return next;
    });
    if (!provinceCode) return;
    try {
      const regencies = await getRegencies(provinceCode);
      setShippingAreaStates((prev) => {
        const next = [...prev];
        next[idx] = {
          provinceCode,
          regencyCode: "",
          regencies,
          districts: [],
        };
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat kota/kabupaten alamat pengiriman");
    }
  };

  const onShippingRegencyChange = async (idx: number, regencyCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const selected = state.regencies.find((x) => x.code === regencyCode) || null;
    updateShip(idx, { city: selected?.name || "", district: "" });
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        ...state,
        regencyCode,
        districts: [],
      };
      return next;
    });
    if (!regencyCode) return;
    try {
      const districts = await getDistricts(regencyCode);
      setShippingAreaStates((prev) => {
        const next = [...prev];
        const current = next[idx] || emptyShippingAreaState();
        next[idx] = {
          ...current,
          regencyCode,
          districts,
        };
        return next;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat kecamatan alamat pengiriman");
    }
  };

  const onShippingDistrictChange = (idx: number, districtCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const selected = state.districts.find((x) => x.code === districtCode) || null;
    updateShip(idx, { district: selected?.name || "" });
  };

  const validate = () => {
    if (!form.owner_full_name.trim()) return "Nama pemilik wajib diisi";
    if (!form.owner_phone.trim()) return "No HP pemilik wajib diisi";
    if (!form.owner_email.trim()) return "Email pemilik wajib diisi";
    if (!form.branch_owner.trim()) return "Nama PIC branch wajib diisi";
    if (!form.branch_owner_phone.trim()) return "No PIC branch wajib diisi";
    if (!form.branch_owner_email.trim()) return "Email PIC branch wajib diisi";
    if (!form.company_type.trim()) return "Jenis perusahaan wajib diisi";
    if (!form.company_title.trim()) return "Gelar perusahaan wajib diisi";
    if (!form.company_name.trim()) return "Nama perusahaan wajib diisi";
    if (!form.product_need.trim()) return "Kebutuhan produk wajib diisi";
    if (!form.branch_id) return "Cabang wajib dipilih";
    if (!form.company_address.trim()) return "Alamat perusahaan wajib diisi";
    if (!form.company_province.trim()) return "Provinsi perusahaan wajib diisi";
    if (!form.company_city.trim()) return "Kota perusahaan wajib diisi";
    if (!form.company_district.trim()) return "Kecamatan perusahaan wajib diisi";
    if (!form.company_postal_code.trim()) return "Kode pos perusahaan wajib diisi";
    if (!form.same_as_company_address) {
      for (let i = 0; i < form.shipping_addresses.length; i += 1) {
        const s = form.shipping_addresses[i];
        if (!s.label?.trim() || !s.address?.trim() || !s.city?.trim() || !s.province?.trim()) {
          return `Data alamat pengiriman #${i + 1} belum lengkap`;
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    if (!token || !isAuthenticated) return;
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const payload = {
        owner_full_name: form.owner_full_name,
        owner_phone: form.owner_phone,
        owner_email: form.owner_email,
        owner_place_of_birth: form.owner_place_of_birth,
        owner_date_of_birth: form.owner_date_of_birth || null,
        branch_owner: form.branch_owner,
        branch_owner_phone: form.branch_owner_phone,
        branch_owner_email: form.branch_owner_email,
        branch_owner_place_of_birth: form.branch_owner_place_of_birth || null,
        branch_owner_date_of_birth: form.branch_owner_date_of_birth || null,
        company_type: form.company_type,
        company_title: form.company_title,
        company_name: form.company_name,
        product_need: form.product_need,
        branch_id: form.branch_id,
        company_address: form.company_address,
        company_province: form.company_province,
        company_city: form.company_city,
        company_district: form.company_district,
        company_postal_code: form.company_postal_code,
        same_as_company_address: form.same_as_company_address ? 1 : 0,
        customer_shipping_address: form.same_as_company_address ? [] : form.shipping_addresses.map(payloadShipping),
      };

      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER, registration.id),
        { method: "PUT", cache: "no-store", body: JSON.stringify(payload) },
        token
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const msg = (json && typeof json === "object" && "message" in json && typeof json.message === "string" && json.message) || `Failed to update registration (${res.status})`;
        throw new Error(msg);
      }
      window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaEdit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Edit Data Registrasi</h2>
                  <p className="text-sm text-orange-100">ID: #{registration.id}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-5">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                Admin bisa edit semua field untuk verifikasi ulang via telepon.
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID</div>
                  <div className="font-medium">{registration.ekaplus_user?.id || "-"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama User</div>
                  <div className="font-medium">{registration.ekaplus_user?.full_name || "-"}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email User</div>
                  <div className="font-medium">{registration.ekaplus_user?.email || "-"}</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold mb-3">Identitas Pemilik/Pimpinan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Nama Pemilik *</label>
                    <input value={form.owner_full_name} onChange={(e) => setField("owner_full_name", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">No. Handphone Pemilik *</label>
                    <input value={form.owner_phone} onChange={(e) => setField("owner_phone", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Email Pemilik *</label>
                    <input value={form.owner_email} onChange={(e) => setField("owner_email", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Tempat Lahir Pemilik *</label>
                    <input value={form.owner_place_of_birth} onChange={(e) => setField("owner_place_of_birth", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Tanggal Lahir Pemilik *</label>
                    <input type="date" value={form.owner_date_of_birth} onChange={(e) => setField("owner_date_of_birth", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Identitas PIC Branch</h3>
                  <label className="text-sm inline-flex items-center gap-2">
                    <input type="checkbox" checked={sameAsOwner} onChange={(e) => setSameAsOwner(e.target.checked)} />
                    Sama dengan pemilik
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Nama PIC Branch *</label>
                    <input value={form.branch_owner} onChange={(e) => setField("branch_owner", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Nomor PIC Branch *</label>
                    <input value={form.branch_owner_phone} onChange={(e) => setField("branch_owner_phone", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Email PIC Branch *</label>
                    <input value={form.branch_owner_email} onChange={(e) => setField("branch_owner_email", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Tempat Lahir PIC Branch</label>
                    <input value={form.branch_owner_place_of_birth} onChange={(e) => setField("branch_owner_place_of_birth", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Tanggal Lahir PIC Branch</label>
                    <input type="date" value={form.branch_owner_date_of_birth} onChange={(e) => setField("branch_owner_date_of_birth", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold mb-3">Informasi Perusahaan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Jenis Perusahaan *</label>
                    <select value={form.company_type} onChange={(e) => setField("company_type", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg bg-white">
                      <option value="">Pilih Jenis Perusahaan</option>
                      {COMPANY_TYPE_OPTIONS.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Gelar Perusahaan *</label>
                    <select value={form.company_title} onChange={(e) => setField("company_title", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg bg-white">
                      <option value="">Pilih Gelar Perusahaan</option>
                      {COMPANY_TITLE_OPTIONS.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Nama Perusahaan *</label>
                    <input value={form.company_name} onChange={(e) => setField("company_name", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Kebutuhan Produk *</label>
                    <select value={form.product_need} onChange={(e) => setField("product_need", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg bg-white">
                      <option value="">Pilih Kebutuhan Produk</option>
                      {PRODUCT_NEED_OPTIONS.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Pilih Cabang *</label>
                    <select value={form.branch_id ?? ""} onChange={(e) => setField("branch_id", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2.5 border rounded-lg bg-white">
                      <option value="">Pilih Cabang</option>
                      {branches.map((b) => <option key={b.id} value={b.id}>{b.branch_name}{b.city ? ` - ${b.city}` : ""}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold mb-3">Alamat Perusahaan</h3>
                {!isLoadingWilayah && !isWilayahApiAvailable && (
                  <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800">
                    API wilayah tidak bisa diakses dari browser ini (CORS). Gunakan input manual.
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Alamat Lengkap *</label>
                    <textarea rows={3} value={form.company_address} onChange={(e) => setField("company_address", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Provinsi *</label>
                    {isWilayahApiAvailable ? (
                      <select
                        value={companyProvinceCode}
                        onChange={(e) => void onCompanyProvinceChange(e.target.value)}
                        className="w-full px-3 py-2.5 border rounded-lg bg-white"
                        disabled={isLoadingWilayah}
                      >
                        <option value="">{isLoadingWilayah ? "Memuat provinsi..." : "Pilih Provinsi"}</option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.code}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={form.company_province}
                        onChange={(e) => setField("company_province", e.target.value)}
                        className="w-full px-3 py-2.5 border rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Kota/Kabupaten *</label>
                    {isWilayahApiAvailable ? (
                      <select
                        value={companyRegencyCode}
                        onChange={(e) => void onCompanyRegencyChange(e.target.value)}
                        className="w-full px-3 py-2.5 border rounded-lg bg-white"
                        disabled={!companyProvinceCode}
                      >
                        <option value="">{companyProvinceCode ? "Pilih Kota/Kabupaten" : "Pilih provinsi terlebih dahulu"}</option>
                        {companyRegencies.map((city) => (
                          <option key={city.code} value={city.code}>{city.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={form.company_city}
                        onChange={(e) => setField("company_city", e.target.value)}
                        className="w-full px-3 py-2.5 border rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Kecamatan *</label>
                    {isWilayahApiAvailable ? (
                      <select
                        value={
                          companyDistricts.find((x) => normalizeName(x.name) === normalizeName(form.company_district))?.code || ""
                        }
                        onChange={(e) => onCompanyDistrictChange(e.target.value)}
                        className="w-full px-3 py-2.5 border rounded-lg bg-white"
                        disabled={!companyRegencyCode}
                      >
                        <option value="">{companyRegencyCode ? "Pilih Kecamatan" : "Pilih kota/kabupaten terlebih dahulu"}</option>
                        {companyDistricts.map((district) => (
                          <option key={district.code} value={district.code}>{district.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={form.company_district}
                        onChange={(e) => setField("company_district", e.target.value)}
                        className="w-full px-3 py-2.5 border rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-1">Kode Pos *</label>
                    <input value={form.company_postal_code} onChange={(e) => setField("company_postal_code", e.target.value)} className="w-full px-3 py-2.5 border rounded-lg" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold">Alamat Pengiriman</h3>
                    <p className="text-xs text-gray-500 mt-1">Data dari API customer_register_address: {form.shipping_addresses.length} alamat</p>
                  </div>
                  <label className="text-sm inline-flex items-center gap-2">
                    <input type="checkbox" checked={form.same_as_company_address} onChange={(e) => setField("same_as_company_address", e.target.checked)} />
                    Sama dengan alamat perusahaan
                  </label>
                </div>
                {form.same_as_company_address ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-2">
                      Alamat Pengiriman Mengikuti Alamat Perusahaan
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="md:col-span-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase">Alamat Lengkap</div>
                        <div className="font-medium text-gray-900">{form.company_address || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase">Provinsi</div>
                        <div className="font-medium text-gray-900">{form.company_province || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase">Kota/Kabupaten</div>
                        <div className="font-medium text-gray-900">{form.company_city || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase">Kecamatan</div>
                        <div className="font-medium text-gray-900">{form.company_district || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase">Kode Pos</div>
                        <div className="font-medium text-gray-900">{form.company_postal_code || "-"}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {form.shipping_addresses.map((s, i) => (
                      <div key={`${s.id || "new"}-${i}`} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-sm">Alamat Pengiriman {i + 1}</div>
                          <div className="flex items-center gap-2">
                            <label className="text-xs inline-flex items-center gap-1">
                              <input type="checkbox" checked={Boolean(s.is_default)} onChange={() => setDefaultShip(i)} />
                              Default
                            </label>
                            <button onClick={() => removeShip(i)} className="p-1.5 text-red-600 hover:bg-red-100 rounded">
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Label Alamat</label>
                            <input value={s.label || ""} onChange={(e) => updateShip(i, { label: e.target.value })} className="w-full px-3 py-2 border rounded" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Nama Penanggung Jawab</label>
                            <input value={s.pic_name || ""} onChange={(e) => updateShip(i, { pic_name: e.target.value })} className="w-full px-3 py-2 border rounded" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">No HP Penanggung Jawab</label>
                            <input value={s.pic_phone || ""} onChange={(e) => updateShip(i, { pic_phone: e.target.value })} className="w-full px-3 py-2 border rounded" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Kode Pos</label>
                            <input value={s.postal_code || ""} onChange={(e) => updateShip(i, { postal_code: e.target.value })} className="w-full px-3 py-2 border rounded" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Provinsi</label>
                            {isWilayahApiAvailable ? (
                              <select
                                value={shippingAreaStates[i]?.provinceCode || ""}
                                onChange={(e) => void onShippingProvinceChange(i, e.target.value)}
                                className="w-full px-3 py-2 border rounded bg-white"
                                disabled={isLoadingWilayah}
                              >
                                <option value="">{isLoadingWilayah ? "Memuat provinsi..." : "Pilih Provinsi"}</option>
                                {provinces.map((p) => (
                                  <option key={p.code} value={p.code}>{p.name}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={s.province || ""}
                                onChange={(e) => updateShip(i, { province: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                              />
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Kota/Kabupaten</label>
                            {isWilayahApiAvailable ? (
                              <select
                                value={shippingAreaStates[i]?.regencyCode || ""}
                                onChange={(e) => void onShippingRegencyChange(i, e.target.value)}
                                className="w-full px-3 py-2 border rounded bg-white"
                                disabled={!shippingAreaStates[i]?.provinceCode}
                              >
                                <option value="">
                                  {shippingAreaStates[i]?.provinceCode ? "Pilih Kota/Kabupaten" : "Pilih provinsi terlebih dahulu"}
                                </option>
                                {(shippingAreaStates[i]?.regencies || []).map((city) => (
                                  <option key={city.code} value={city.code}>{city.name}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={s.city || ""}
                                onChange={(e) => updateShip(i, { city: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                              />
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Kecamatan</label>
                            {isWilayahApiAvailable ? (
                              <select
                                value={
                                  (shippingAreaStates[i]?.districts || []).find((x) => normalizeName(x.name) === normalizeName(s.district))?.code || ""
                                }
                                onChange={(e) => onShippingDistrictChange(i, e.target.value)}
                                className="w-full px-3 py-2 border rounded bg-white"
                                disabled={!shippingAreaStates[i]?.regencyCode}
                              >
                                <option value="">
                                  {shippingAreaStates[i]?.regencyCode ? "Pilih Kecamatan" : "Pilih kota/kabupaten terlebih dahulu"}
                                </option>
                                {(shippingAreaStates[i]?.districts || []).map((district) => (
                                  <option key={district.code} value={district.code}>{district.name}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={s.district || ""}
                                onChange={(e) => updateShip(i, { district: e.target.value })}
                                className="w-full px-3 py-2 border rounded"
                              />
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Alamat Lengkap</label>
                            <textarea rows={2} value={s.address || ""} onChange={(e) => updateShip(i, { address: e.target.value })} className="w-full px-3 py-2 border rounded" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={addShip} className="w-full px-4 py-2.5 border-2 border-dashed border-orange-300 rounded-lg text-orange-700 hover:bg-orange-50 flex items-center justify-center gap-2">
                      <FaPlus className="w-3.5 h-3.5" />
                      Tambah Alamat Pengiriman
                    </button>
                  </div>
                )}
              </div>

              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
              {hasChanges && <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">Ada perubahan yang belum disimpan</div>}
            </div>

            <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-between items-center gap-3">
              <button onClick={onClose} disabled={isSaving} className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 disabled:opacity-50">Batal</button>
              <motion.button whileHover={!isSaving ? { scale: 1.02 } : {}} whileTap={!isSaving ? { scale: 0.98 } : {}} onClick={handleSave} disabled={isSaving || !hasChanges || isLoading} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl disabled:opacity-50 flex items-center gap-2">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
