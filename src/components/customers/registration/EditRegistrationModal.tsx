"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import type {
  CustomerRegistration,
  CustomerRegistrationShippingAddress,
} from "@/types/customerRegistration";
import { useAuth } from "@/contexts/AuthContext";
import {
  API_CONFIG,
  apiFetch,
  getQueryUrl,
  getResourceUrl,
} from "@/config/api";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";

interface EditRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: CustomerRegistration | null;
  onSuccess: () => void;
  demoMode?: boolean;
  onDemoSave?: (registration: CustomerRegistration) => void;
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
  type?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  district?: string | null;
  village?: string | null;
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
  districtCode: string;
  villageCode: string;
  regencies: WilayahOption[];
  districts: WilayahOption[];
  villages: WilayahOption[];
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
  company_name_base: string;
  company_name_suffix: string;
  company_name: string;
  product_need: string;
  branch_id: number | null;
  company_address: string;
  company_province: string;
  company_city: string;
  company_district: string;
  company_village: string;
  shipping_addresses: CustomerRegistrationShippingAddress[];
}

const COMPANY_TYPE_OPTIONS = ["Company", "Individual"];
const COMPANY_TITLE_OPTIONS_BY_TYPE: Record<string, string[]> = {
  Individual: ["Home Industri", "Toko", "Freelance"],
  Company: ["PT", "CV", "UD", "Toko"],
};
const COMPANY_SUFFIX_OPTIONS_BY_TITLE: Record<string, string[]> = {
  "Home Industri": ["HI"],
  Toko: ["TK"],
  Freelance: ["BP", "IBU"],
  PT: ["PT"],
  CV: ["CV"],
  UD: ["UD"],
};
const PRODUCT_NEED_OPTIONS = ["Bahan Baku Springbed & Sofa", "Furniture"];
const ADDRESS_TYPE_OPTIONS = [
  "Shipping",
  "Billing",
  "Other",
  "Warehouse",
  "Office",
  "Personal",
  "Shop",
];
const WILAYAH_BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

function toInputDate(value?: string) {
  if (!value || value === "-") return "";
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return value.split("T")[0] || "";
}

function cleanInputValue(value?: string | null) {
  if (!value || value === "-") return "";
  return value;
}

function toNullableText(value?: string | null) {
  const normalized = cleanInputValue(value).trim();
  return normalized ? normalized : null;
}

function isCompanyAddressShippingRow(row?: ShippingApiRow | null) {
  const label = normalizeName(row?.label);
  return label === "alamat perusahaan" || label === "alamatperusahaan";
}

function payloadShipping(addr: CustomerRegistrationShippingAddress) {
  return {
    label: cleanInputValue(addr.label).trim(),
    type: cleanInputValue(addr.type) || "Shipping",
    pic_name: toNullableText(addr.pic_name),
    pic_phone: toNullableText(addr.pic_phone),
    address: cleanInputValue(addr.address).trim(),
    city: cleanInputValue(addr.city).trim(),
    district: cleanInputValue(addr.district).trim(),
    village: cleanInputValue(addr.village).trim(),
    province: cleanInputValue(addr.province).trim(),
    is_default: addr.is_default ? 1 : 0,
  };
}

function normalizeName(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function buildCompanyName(base: string, suffix: string) {
  return `${(base || "").trim()} ${(suffix || "").trim()}`.trim();
}

function splitCompanyName(fullName: string, title: string) {
  const full = (fullName || "").trim();
  const titleOptions = COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [];
  if (!full) {
    return {
      company_name_base: "",
      company_name_suffix: titleOptions[0] || "",
      company_name: "",
    };
  }

  for (const suffix of titleOptions) {
    if (full.toUpperCase().endsWith(` ${suffix.toUpperCase()}`)) {
      const base = full.slice(0, full.length - suffix.length).trim();
      return {
        company_name_base: base,
        company_name_suffix: suffix,
        company_name: buildCompanyName(base, suffix),
      };
    }
  }

  return {
    company_name_base: full,
    company_name_suffix: titleOptions[0] || "",
    company_name: buildCompanyName(full, titleOptions[0] || ""),
  };
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
  const rows: Array<{ code?: string; id?: string; name?: string }> =
    Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
  const mapped: WilayahOption[] = rows.map((row) => ({
    code: String(row.code || row.id || ""),
    name: String(row.name || ""),
  }));
  return mapped.filter((row: WilayahOption) => Boolean(row.code && row.name));
}

function emptyShippingAreaState(): ShippingAreaState {
  return {
    provinceCode: "",
    regencyCode: "",
    districtCode: "",
    villageCode: "",
    regencies: [],
    districts: [],
    villages: [],
  };
}

const sectionCardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const readOnlyFieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700";
const checkboxClass =
  "h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400";

function getBranchLabel(
  branches: BranchOption[],
  branchId: number | null | undefined,
) {
  if (!branchId) return "-";
  const branch = branches.find((item) => item.id === branchId);
  if (!branch) return String(branchId);
  return `${branch.branch_name}${branch.city ? ` - ${branch.city}` : ""}`;
}

function isShippingSameAsCompanyAddress(
  company: Pick<
    FormState,
    | "company_address"
    | "company_city"
    | "company_province"
    | "company_district"
    | "company_village"
  >,
  shipping: CustomerRegistrationShippingAddress,
) {
  return (
    normalizeName(company.company_address) === normalizeName(shipping.address) &&
    normalizeName(company.company_city) === normalizeName(shipping.city) &&
    normalizeName(company.company_province) === normalizeName(shipping.province) &&
    normalizeName(company.company_district) === normalizeName(shipping.district) &&
    normalizeName(company.company_village) === normalizeName(shipping.village)
  );
}

function isSameAsOwnerInitialState(form: Pick<
  FormState,
  | "owner_full_name"
  | "owner_phone"
  | "owner_email"
  | "owner_place_of_birth"
  | "owner_date_of_birth"
  | "branch_owner"
  | "branch_owner_phone"
  | "branch_owner_email"
  | "branch_owner_place_of_birth"
  | "branch_owner_date_of_birth"
>) {
  return (
    cleanInputValue(form.owner_full_name) === cleanInputValue(form.branch_owner) &&
    cleanInputValue(form.owner_phone) === cleanInputValue(form.branch_owner_phone) &&
    cleanInputValue(form.owner_email) === cleanInputValue(form.branch_owner_email) &&
    cleanInputValue(form.owner_place_of_birth) ===
      cleanInputValue(form.branch_owner_place_of_birth) &&
    cleanInputValue(form.owner_date_of_birth) ===
      cleanInputValue(form.branch_owner_date_of_birth)
  );
}

export function EditRegistrationModal({
  isOpen,
  onClose,
  registration,
  onSuccess,
  demoMode = false,
  onDemoSave,
}: EditRegistrationModalProps) {
  const { token, isAuthenticated } = useAuth();
  const [form, setForm] = useState<FormState | null>(null);
  const [snapshot, setSnapshot] = useState("");
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [companyProvinceCode, setCompanyProvinceCode] = useState("");
  const [companyRegencyCode, setCompanyRegencyCode] = useState("");
  const [companyDistrictCode, setCompanyDistrictCode] = useState("");
  const [companyVillageCode, setCompanyVillageCode] = useState("");
  const [companyRegencies, setCompanyRegencies] = useState<WilayahOption[]>([]);
  const [companyDistricts, setCompanyDistricts] = useState<WilayahOption[]>([]);
  const [companyVillages, setCompanyVillages] = useState<WilayahOption[]>([]);
  const [shippingAreaStates, setShippingAreaStates] = useState<
    ShippingAreaState[]
  >([]);
  const [sameAsCompanyAddressItems, setSameAsCompanyAddressItems] = useState<
    boolean[]
  >([]);
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
  const shippingAddressesLength = form?.shipping_addresses.length ?? 0;
  const sameAsCompanyAddressItemsKey = sameAsCompanyAddressItems
    .map((value) => (value ? "1" : "0"))
    .join(",");
  const companyAreaOptionsKey = [
    companyProvinceCode,
    companyRegencyCode,
    companyDistrictCode,
    companyVillageCode,
    companyRegencies.length,
    companyDistricts.length,
    companyVillages.length,
  ].join("|");

  const regencyCache = useRef<Record<string, WilayahOption[]>>({});
  const districtCache = useRef<Record<string, WilayahOption[]>>({});
  const villageCache = useRef<Record<string, WilayahOption[]>>({});
  const formRef = useRef<FormState | null>(null);
  const sameAsCompanyAddressItemsRef = useRef<boolean[]>([]);
  const companyAreaSnapshotRef = useRef({
    companyProvinceCode: "",
    companyRegencyCode: "",
    companyDistrictCode: "",
    companyVillageCode: "",
    companyRegencies: [] as WilayahOption[],
    companyDistricts: [] as WilayahOption[],
    companyVillages: [] as WilayahOption[],
  });

  const getRegencies = async (provinceCode: string) => {
    if (!provinceCode) return [];
    if (regencyCache.current[provinceCode])
      return regencyCache.current[provinceCode];
    const rows = await fetchWilayah(`regencies/${provinceCode}.json`);
    regencyCache.current[provinceCode] = rows;
    return rows;
  };

  const getDistricts = async (regencyCode: string) => {
    if (!regencyCode) return [];
    if (districtCache.current[regencyCode])
      return districtCache.current[regencyCode];
    const rows = await fetchWilayah(`districts/${regencyCode}.json`);
    districtCache.current[regencyCode] = rows;
    return rows;
  };

  const getVillages = async (districtCode: string) => {
    if (!districtCode) return [];
    if (villageCache.current[districtCode])
      return villageCache.current[districtCode];
    const rows = await fetchWilayah(`villages/${districtCode}.json`);
    villageCache.current[districtCode] = rows;
    return rows;
  };

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      if (!isOpen || !registration) return;
      setIsLoading(true);
      setIsLoadingWilayah(true);
      setError(null);
      try {
        if (demoMode) {
          const shipping = (registration.shipping_addresses || []).map((x) => ({
            id: x.id,
            parent_id: x.parent_id,
            label: cleanInputValue(x.label),
            type: cleanInputValue(x.type) || "Shipping",
            address: cleanInputValue(x.address),
            city: cleanInputValue(x.city),
            province: cleanInputValue(x.province),
            district: cleanInputValue(x.district),
            village: cleanInputValue(x.village),
            country: cleanInputValue(x.country),
            pic_name: cleanInputValue(x.pic_name),
            pic_phone: cleanInputValue(x.pic_phone),
            is_default: x.is_default ? 1 : 0,
          }));

          const initial: FormState = {
            owner_full_name: cleanInputValue(registration.user.full_name),
            owner_phone: cleanInputValue(registration.user.phone),
            owner_email: cleanInputValue(registration.user.email),
            owner_place_of_birth: cleanInputValue(registration.user.place_of_birth),
            owner_date_of_birth: toInputDate(registration.user.date_of_birth),
            branch_owner: cleanInputValue(registration.branch_owner?.full_name),
            branch_owner_phone: cleanInputValue(registration.branch_owner?.phone),
            branch_owner_email: cleanInputValue(registration.branch_owner?.email),
            branch_owner_place_of_birth: cleanInputValue(
              registration.branch_owner?.place_of_birth,
            ),
            branch_owner_date_of_birth: toInputDate(
              registration.branch_owner?.date_of_birth,
            ),
            company_type: cleanInputValue(registration.company.company_type),
            company_title: cleanInputValue(registration.company.company_title),
            ...splitCompanyName(
              cleanInputValue(registration.company.name),
              cleanInputValue(registration.company.company_title),
            ),
            product_need: cleanInputValue(registration.company.product_need),
            branch_id: registration.company.branch_id || null,
            company_address: cleanInputValue(registration.address.full_address),
            company_province: cleanInputValue(registration.address.province_name),
            company_city: cleanInputValue(registration.address.city_name),
            company_district: cleanInputValue(registration.address.district_name),
            company_village: cleanInputValue(registration.address.village_name),
            shipping_addresses: shipping,
          };

          if (!cancelled) {
            setBranches([
              {
                id: registration.company.branch_id,
                branch_name: registration.company.branch_name,
                city: registration.company.branch_city,
              },
            ]);
            setProvinces([]);
            setCompanyProvinceCode("");
            setCompanyRegencyCode("");
            setCompanyDistrictCode("");
            setCompanyVillageCode("");
            setCompanyRegencies([]);
            setCompanyDistricts([]);
            setCompanyVillages([]);
            setShippingAreaStates(
              initial.shipping_addresses.map(() => emptyShippingAreaState()),
            );
            setSameAsCompanyAddressItems(
              shipping.map((addr) =>
                isShippingSameAsCompanyAddress(initial, addr),
              ),
            );
            setSameAsOwner(isSameAsOwnerInitialState(initial));
            setForm(initial);
            setSnapshot(JSON.stringify(initial));
          }
          return;
        }
        if (!token || !isAuthenticated) return;

        const shippingSpec = {
          fields: ["*"],
          filters: [["parent_id", "=", Number(registration.id)]],
        };
        const branchSpec = { fields: ["id", "branch_name", "city"] };
        const [shippingRes, branchRes, provinceRows] = await Promise.all([
          apiFetch(
            getQueryUrl(
              API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS,
              shippingSpec,
            ),
            { method: "GET", cache: "no-store" },
            token,
          ),
          fetchAllQueryRows<BranchOption>({
            endpoint: API_CONFIG.ENDPOINTS.BRANCH,
            spec: branchSpec,
            token,
            errorMessage: "Failed to fetch branches",
          }),
          fetchWilayah("provinces.json").catch(() => [] as WilayahOption[]),
        ]);

        let shippingRows: ShippingApiRow[] = [];
        if (shippingRes.ok) {
          const shippingJson = await shippingRes.json();
          shippingRows = Array.isArray(shippingJson?.data)
            ? shippingJson.data
            : [];
        } else {
          // Fallback: some backend deployments reject filters, fetch all then filter client-side
          const fallbackRes = await apiFetch(
            getQueryUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, {
              fields: ["*"],
            }),
            { method: "GET", cache: "no-store" },
            token,
          );
          if (!fallbackRes.ok) {
            throw new Error(`Failed to fetch shipping (${shippingRes.status})`);
          }
          const fallbackJson = await fallbackRes.json();
          const allRows: ShippingApiRow[] = Array.isArray(fallbackJson?.data)
            ? fallbackJson.data
            : [];
          shippingRows = allRows.filter(
            (row) => Number(row.parent_id || 0) === Number(registration.id),
          );
        }

        const branchRows: BranchOption[] = Array.isArray(branchRes)
          ? branchRes
          : [];

        const shipping = shippingRows
          .filter((row) => !isCompanyAddressShippingRow(row))
          .map((x) => ({
            id: x.id,
            parent_id: x.parent_id,
            label: cleanInputValue(x.label),
            type: cleanInputValue(x.type) || "Shipping",
            address: cleanInputValue(x.address),
            city: cleanInputValue(x.city),
            province: cleanInputValue(x.province),
            district: cleanInputValue(x.district),
            village: cleanInputValue(x.village),
            country: cleanInputValue(x.country),
            pic_name: cleanInputValue(x.pic_name),
            pic_phone: cleanInputValue(x.pic_phone),
            is_default: x.is_default ? 1 : 0,
          }));

        const initial: FormState = {
          owner_full_name: cleanInputValue(registration.user.full_name),
          owner_phone: cleanInputValue(registration.user.phone),
          owner_email: cleanInputValue(registration.user.email),
          owner_place_of_birth: cleanInputValue(registration.user.place_of_birth),
          owner_date_of_birth: toInputDate(registration.user.date_of_birth),
          branch_owner: cleanInputValue(registration.branch_owner?.full_name),
          branch_owner_phone: cleanInputValue(registration.branch_owner?.phone),
          branch_owner_email: cleanInputValue(registration.branch_owner?.email),
          branch_owner_place_of_birth: cleanInputValue(
            registration.branch_owner?.place_of_birth,
          ),
          branch_owner_date_of_birth: toInputDate(
            registration.branch_owner?.date_of_birth,
          ),
          company_type: cleanInputValue(registration.company.company_type),
          company_title: cleanInputValue(registration.company.company_title),
          ...splitCompanyName(
            cleanInputValue(registration.company.name),
            cleanInputValue(registration.company.company_title),
          ),
          product_need: cleanInputValue(registration.company.product_need),
          branch_id: registration.company.branch_id || null,
          company_address: cleanInputValue(registration.address.full_address),
          company_province: cleanInputValue(registration.address.province_name),
          company_city: cleanInputValue(registration.address.city_name),
          company_district: cleanInputValue(registration.address.district_name),
          company_village: cleanInputValue(registration.address.village_name),
          shipping_addresses: shipping,
        };

        const companyProvince = matchByName(
          provinceRows,
          initial.company_province,
        );
        const nextCompanyProvinceCode = companyProvince?.code || "";
        let nextCompanyRegencies: WilayahOption[] = [];
        let nextCompanyRegencyCode = "";
        let nextCompanyDistricts: WilayahOption[] = [];
        let nextCompanyDistrictCode = "";
        let nextCompanyVillages: WilayahOption[] = [];
        let nextCompanyVillageCode = "";
        if (nextCompanyProvinceCode && provinceRows.length > 0) {
          nextCompanyRegencies = await getRegencies(nextCompanyProvinceCode);
          const companyRegency = matchByName(
            nextCompanyRegencies,
            initial.company_city,
          );
          nextCompanyRegencyCode = companyRegency?.code || "";
          if (nextCompanyRegencyCode) {
            nextCompanyDistricts = await getDistricts(nextCompanyRegencyCode);
            const companyDistrict = matchByName(
              nextCompanyDistricts,
              initial.company_district,
            );
            nextCompanyDistrictCode = companyDistrict?.code || "";
            if (nextCompanyDistrictCode) {
              nextCompanyVillages = await getVillages(nextCompanyDistrictCode);
              const companyVillage = matchByName(
                nextCompanyVillages,
                initial.company_village,
              );
              nextCompanyVillageCode = companyVillage?.code || "";
            }
          }
        }

        const nextShippingAreaStates: ShippingAreaState[] =
          provinceRows.length > 0
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
                      districtCode: "",
                      villageCode: "",
                      regencies,
                      districts: [],
                      villages: [],
                    };
                  }
                  const districts = await getDistricts(regency.code);
                  const district = matchByName(districts, addr.district);
                  if (!district) {
                    return {
                      provinceCode: province.code,
                      regencyCode: regency.code,
                      districtCode: "",
                      villageCode: "",
                      regencies,
                      districts,
                      villages: [],
                    };
                  }
                  const villages = await getVillages(district.code);
                  const village = matchByName(villages, addr.village);
                  return {
                    provinceCode: province.code,
                    regencyCode: regency.code,
                    districtCode: district.code,
                    villageCode: village?.code || "",
                    regencies,
                    districts,
                    villages,
                  };
                }),
              )
            : initial.shipping_addresses.map(() => emptyShippingAreaState());

        if (!cancelled) {
          setBranches(branchRows);
          setProvinces(provinceRows);
          setCompanyProvinceCode(nextCompanyProvinceCode);
          setCompanyRegencyCode(nextCompanyRegencyCode);
          setCompanyDistrictCode(nextCompanyDistrictCode);
          setCompanyVillageCode(nextCompanyVillageCode);
          setCompanyRegencies(nextCompanyRegencies);
          setCompanyDistricts(nextCompanyDistricts);
          setCompanyVillages(nextCompanyVillages);
          setShippingAreaStates(nextShippingAreaStates);
          setSameAsCompanyAddressItems(
            shipping.map((addr) =>
              isShippingSameAsCompanyAddress(initial, addr),
            ),
          );
          setSameAsOwner(isSameAsOwnerInitialState(initial));
          setForm(initial);
          setSnapshot(JSON.stringify(initial));
        }
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Gagal memuat data edit",
          );
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
  }, [demoMode, isOpen, registration, token, isAuthenticated]);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  useEffect(() => {
    sameAsCompanyAddressItemsRef.current = sameAsCompanyAddressItems;
  }, [sameAsCompanyAddressItems]);

  useEffect(() => {
    companyAreaSnapshotRef.current = {
      companyProvinceCode,
      companyRegencyCode,
      companyDistrictCode,
      companyVillageCode,
      companyRegencies,
      companyDistricts,
      companyVillages,
    };
  }, [
    companyProvinceCode,
    companyRegencyCode,
    companyDistrictCode,
    companyVillageCode,
    companyRegencies,
    companyDistricts,
    companyVillages,
  ]);

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
  }, [
    sameAsOwner,
    form?.owner_full_name,
    form?.owner_phone,
    form?.owner_email,
    form?.owner_place_of_birth,
    form?.owner_date_of_birth,
  ]);

  useEffect(() => {
    setShippingAreaStates((prev) => {
      if (prev.length === shippingAddressesLength) return prev;
      const next = [...prev];
      while (next.length < shippingAddressesLength) {
        next.push(emptyShippingAreaState());
      }
      return next.slice(0, shippingAddressesLength);
    });
    setSameAsCompanyAddressItems((prev) => {
      if (prev.length === shippingAddressesLength) return prev;
      const next = [...prev];
      while (next.length < shippingAddressesLength) {
        next.push(false);
      }
      return next.slice(0, shippingAddressesLength);
    });
  }, [shippingAddressesLength]);

  useEffect(() => {
    const currentForm = formRef.current;
    const sameAsItems = sameAsCompanyAddressItemsRef.current;
    const companyAreaSnapshot = companyAreaSnapshotRef.current;
    if (!currentForm) return;
    if (!sameAsItems.some(Boolean)) return;
    setForm((prev) => {
      if (!prev) return prev;
      const nextShippingAddresses = prev.shipping_addresses.map((address, idx) =>
        sameAsItems[idx]
          ? {
              ...address,
              address: prev.company_address,
              city: prev.company_city,
              province: prev.company_province,
              district: prev.company_district,
              village: prev.company_village,
            }
          : address,
      );
      const hasChanged = nextShippingAddresses.some(
        (address, idx) =>
          address.address !== prev.shipping_addresses[idx]?.address ||
          address.city !== prev.shipping_addresses[idx]?.city ||
          address.province !== prev.shipping_addresses[idx]?.province ||
          address.district !== prev.shipping_addresses[idx]?.district ||
          address.village !== prev.shipping_addresses[idx]?.village,
      );
      if (!hasChanged) return prev;
      return {
        ...prev,
        shipping_addresses: nextShippingAddresses,
      };
    });
    setShippingAreaStates((prev) => {
      let hasChanged = false;
      const next = prev.map((state, idx) => {
        if (!sameAsItems[idx]) return state;
        const updatedState = {
          ...state,
          provinceCode: companyAreaSnapshot.companyProvinceCode,
          regencyCode: companyAreaSnapshot.companyRegencyCode,
          districtCode: companyAreaSnapshot.companyDistrictCode,
          villageCode: companyAreaSnapshot.companyVillageCode,
          regencies: companyAreaSnapshot.companyRegencies,
          districts: companyAreaSnapshot.companyDistricts,
          villages: companyAreaSnapshot.companyVillages,
        };
        if (
          updatedState.provinceCode !== state.provinceCode ||
          updatedState.regencyCode !== state.regencyCode ||
          updatedState.districtCode !== state.districtCode ||
          updatedState.villageCode !== state.villageCode ||
          updatedState.regencies !== state.regencies ||
          updatedState.districts !== state.districts ||
          updatedState.villages !== state.villages
        ) {
          hasChanged = true;
        }
        return updatedState;
      });
      return hasChanged ? next : prev;
    });
  }, [
    form?.company_address,
    form?.company_city,
    form?.company_province,
    form?.company_district,
    form?.company_village,
    shippingAddressesLength,
    sameAsCompanyAddressItemsKey,
    companyAreaOptionsKey,
  ]);

  if (!registration || !form) return null;

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  const updateShip = (
    idx: number,
    patch: Partial<CustomerRegistrationShippingAddress>,
  ) =>
    setForm((prev) => {
      if (!prev) return prev;
      const next = [...prev.shipping_addresses];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, shipping_addresses: next };
    });
  const removeShip = (idx: number) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            shipping_addresses: prev.shipping_addresses.filter(
              (_, i) => i !== idx,
            ),
          }
        : prev,
    );
    setShippingAreaStates((prev) => prev.filter((_, i) => i !== idx));
    setSameAsCompanyAddressItems((prev) => prev.filter((_, i) => i !== idx));
  };
  const setDefaultShip = (idx: number) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            shipping_addresses: prev.shipping_addresses.map((x, i) => ({
              ...x,
              is_default: i === idx ? 1 : 0,
            })),
          }
        : prev,
    );

  const toggleSameAsCompanyAddressItem = (idx: number, checked: boolean) => {
    setSameAsCompanyAddressItems((prev) => {
      const next = [...prev];
      next[idx] = checked;
      return next;
    });
    if (!checked) return;
    updateShip(idx, {
      address: form.company_address,
      city: form.company_city,
      province: form.company_province,
      district: form.company_district,
      village: form.company_village,
    });
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        ...(next[idx] || emptyShippingAreaState()),
        provinceCode: companyProvinceCode,
        regencyCode: companyRegencyCode,
        districtCode: companyDistrictCode,
        villageCode: companyVillageCode,
        regencies: companyRegencies,
        districts: companyDistricts,
        villages: companyVillages,
      };
      return next;
    });
  };

  const onCompanyProvinceChange = async (provinceCode: string) => {
    const selected = provinces.find((x) => x.code === provinceCode) || null;
    setCompanyProvinceCode(provinceCode);
    setCompanyRegencyCode("");
    setCompanyDistrictCode("");
    setCompanyVillageCode("");
    setCompanyDistricts([]);
    setCompanyVillages([]);
    setField("company_province", selected?.name || "");
    setField("company_city", "");
    setField("company_district", "");
    setField("company_village", "");
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
    const selected =
      companyRegencies.find((x) => x.code === regencyCode) || null;
    setCompanyRegencyCode(regencyCode);
    setCompanyDistrictCode("");
    setCompanyVillageCode("");
    setCompanyVillages([]);
    setField("company_city", selected?.name || "");
    setField("company_district", "");
    setField("company_village", "");
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

  const onCompanyDistrictChange = async (districtCode: string) => {
    const selected =
      companyDistricts.find((x) => x.code === districtCode) || null;
    setCompanyDistrictCode(districtCode);
    setCompanyVillageCode("");
    setField("company_district", selected?.name || "");
    setField("company_village", "");
    if (!districtCode) {
      setCompanyVillages([]);
      return;
    }
    try {
      const rows = await getVillages(districtCode);
      setCompanyVillages(rows);
    } catch (e) {
      setCompanyVillages([]);
      setError(e instanceof Error ? e.message : "Gagal memuat kelurahan");
    }
  };

  const onCompanyVillageChange = (villageCode: string) => {
    const selected = companyVillages.find((x) => x.code === villageCode) || null;
    setCompanyVillageCode(villageCode);
    setField("company_village", selected?.name || "");
  };

  const onShippingProvinceChange = async (
    idx: number,
    provinceCode: string,
  ) => {
    const selected = provinces.find((x) => x.code === provinceCode) || null;
    updateShip(idx, {
      province: selected?.name || "",
      city: "",
      district: "",
      village: "",
    });
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        provinceCode,
        regencyCode: "",
        districtCode: "",
        villageCode: "",
        regencies: [],
        districts: [],
        villages: [],
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
          districtCode: "",
          villageCode: "",
          regencies,
          districts: [],
          villages: [],
        };
        return next;
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal memuat kota/kabupaten alamat pengiriman",
      );
    }
  };

  const onShippingRegencyChange = async (idx: number, regencyCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const selected =
      state.regencies.find((x) => x.code === regencyCode) || null;
    updateShip(idx, { city: selected?.name || "", district: "", village: "" });
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        ...state,
        regencyCode,
        districtCode: "",
        villageCode: "",
        districts: [],
        villages: [],
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
          districtCode: "",
          villageCode: "",
          districts,
          villages: [],
        };
        return next;
      });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal memuat kecamatan alamat pengiriman",
      );
    }
  };

  const onShippingDistrictChange = async (idx: number, districtCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const selected =
      state.districts.find((x) => x.code === districtCode) || null;
    updateShip(idx, { district: selected?.name || "", village: "" });
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        ...state,
        districtCode,
        villageCode: "",
        villages: [],
      };
      return next;
    });
    if (!districtCode) return;
    try {
      const villages = await getVillages(districtCode);
      setShippingAreaStates((prev) => {
        const next = [...prev];
        const current = next[idx] || emptyShippingAreaState();
        next[idx] = {
          ...current,
          districtCode,
          villageCode: "",
          villages,
        };
        return next;
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Gagal memuat kelurahan alamat pengiriman",
      );
    }
  };

  const onShippingVillageChange = (idx: number, villageCode: string) => {
    const state = shippingAreaStates[idx] || emptyShippingAreaState();
    const selected = state.villages.find((x) => x.code === villageCode) || null;
    updateShip(idx, { village: selected?.name || "" });
    setShippingAreaStates((prev) => {
      const next = [...prev];
      next[idx] = {
        ...state,
        villageCode,
      };
      return next;
    });
  };

  const companyTitleOptions =
    COMPANY_TITLE_OPTIONS_BY_TYPE[form.company_type] || [];
  const currentSuffixOptions =
    COMPANY_SUFFIX_OPTIONS_BY_TITLE[form.company_title] || [];
  const isSuffixEditable = form.company_title === "Freelance";

  const setCompanyType = (type: string) => {
    const nextTitles = COMPANY_TITLE_OPTIONS_BY_TYPE[type] || [];
    const nextTitle = type ? nextTitles[0] || "" : "";
    const nextSuffix = nextTitle
      ? (COMPANY_SUFFIX_OPTIONS_BY_TITLE[nextTitle] || [])[0] || ""
      : "";
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        company_type: type,
        company_title: nextTitle,
        company_name_suffix: nextSuffix,
        company_name: buildCompanyName(prev.company_name_base, nextSuffix),
      };
    });
  };

  const setCompanyTitle = (title: string) => {
    const nextSuffix = (COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [])[0] || "";
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        company_title: title,
        company_name_suffix: nextSuffix,
        company_name: buildCompanyName(prev.company_name_base, nextSuffix),
      };
    });
  };

  const setCompanyNameBase = (base: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        company_name_base: base,
        company_name: buildCompanyName(base, prev.company_name_suffix),
      };
    });
  };

  const setCompanyNameSuffix = (suffix: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        company_name_suffix: suffix,
        company_name: buildCompanyName(prev.company_name_base, suffix),
      };
    });
  };

  const validate = () => {
    if (!form.owner_full_name.trim()) return "Nama pemilik wajib diisi";
    if (!form.owner_phone.trim()) return "No HP pemilik wajib diisi";
    if (!form.branch_owner.trim()) return "Nama PIC branch wajib diisi";
    if (!form.branch_owner_phone.trim()) return "No PIC branch wajib diisi";
    if (!form.company_type.trim()) return "Jenis perusahaan wajib diisi";
    if (!form.company_title.trim()) return "Gelar perusahaan wajib diisi";
    if (!form.company_name_base.trim()) return "Nama perusahaan wajib diisi";
    if (!form.company_name_suffix.trim())
      return "Sebutan perusahaan wajib diisi";
    if (!form.product_need.trim()) return "Kebutuhan produk wajib diisi";
    if (!form.branch_id) return "Cabang wajib dipilih";
    if (!form.company_address.trim()) return "Alamat perusahaan wajib diisi";
    if (!form.company_province.trim()) return "Provinsi perusahaan wajib diisi";
    if (!form.company_city.trim()) return "Kota perusahaan wajib diisi";
    if (!form.company_district.trim())
      return "Kecamatan perusahaan wajib diisi";
    if (!form.company_village.trim()) return "Kelurahan perusahaan wajib diisi";
    for (let i = 0; i < form.shipping_addresses.length; i += 1) {
      const s = form.shipping_addresses[i];
      if (
        !s.label?.trim() ||
        !s.type?.trim() ||
        !s.address?.trim() ||
        !s.city?.trim() ||
        !s.province?.trim() ||
        !s.district?.trim() ||
        !s.village?.trim()
      ) {
        return `Data alamat pengiriman #${i + 1} belum lengkap`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      const nextCompanyName = buildCompanyName(
        form.company_name_base,
        form.company_name_suffix,
      );
      if (demoMode) {
        const selectedBranch = branches.find((item) => item.id === form.branch_id);
        const nextRegistration: CustomerRegistration = {
          ...registration,
          user: {
            ...registration.user,
            full_name: form.owner_full_name.trim(),
            phone: form.owner_phone.trim(),
            email: form.owner_email.trim(),
            place_of_birth: form.owner_place_of_birth.trim(),
            date_of_birth: form.owner_date_of_birth || registration.user.date_of_birth,
          },
          company: {
            ...registration.company,
            company_type: form.company_type.trim(),
            company_title: form.company_title.trim(),
            business_type: `${form.company_type.trim()} - ${form.company_title.trim()}`,
            name: nextCompanyName,
            product_need: form.product_need.trim(),
            branch_id: form.branch_id || registration.company.branch_id,
            branch_name: selectedBranch?.branch_name || registration.company.branch_name,
            branch_city: selectedBranch?.city || registration.company.branch_city,
          },
          address: {
            ...registration.address,
            full_address: form.company_address.trim(),
            province_name: form.company_province.trim(),
            city_name: form.company_city.trim(),
            district_name: form.company_district.trim(),
            village_name: form.company_village.trim(),
          },
          branch_owner: {
            full_name: form.branch_owner.trim(),
            phone: form.branch_owner_phone.trim(),
            email: form.branch_owner_email.trim(),
            place_of_birth: form.branch_owner_place_of_birth.trim(),
            date_of_birth:
              form.branch_owner_date_of_birth ||
              registration.branch_owner?.date_of_birth ||
              "",
          },
          shipping_addresses: form.shipping_addresses,
          updated_at: new Date().toISOString(),
        };
        onDemoSave?.(nextRegistration);
        onSuccess();
        onClose();
        return;
      }
      if (!token || !isAuthenticated) return;

      const rawApplicantOwnerId = registration.ekaplus_user?.id;
      const applicantOwnerId =
        typeof rawApplicantOwnerId === "number"
          ? rawApplicantOwnerId
          : Number.parseInt(String(rawApplicantOwnerId || ""), 10);
      const fallbackOwnerId =
        Number(registration.created_by_id || 0) ||
        Number(registration.user.user_id || 0);
      const payload = {
        owner:
          Number.isFinite(applicantOwnerId) && applicantOwnerId > 0
            ? applicantOwnerId
            : fallbackOwnerId > 0
              ? fallbackOwnerId
              : undefined,
        owner_full_name: form.owner_full_name.trim(),
        owner_phone: form.owner_phone.trim(),
        owner_email: toNullableText(form.owner_email),
        owner_place_of_birth: toNullableText(form.owner_place_of_birth),
        owner_date_of_birth: form.owner_date_of_birth || null,
        branch_owner: form.branch_owner.trim(),
        branch_owner_phone: form.branch_owner_phone.trim(),
        branch_owner_email: toNullableText(form.branch_owner_email),
        branch_owner_place_of_birth: toNullableText(
          form.branch_owner_place_of_birth,
        ),
        branch_owner_date_of_birth: form.branch_owner_date_of_birth || null,
        company_type: form.company_type.trim(),
        company_title: form.company_title.trim(),
        company_name: nextCompanyName,
        product_need: form.product_need.trim(),
        branch_id: form.branch_id,
        company_address: form.company_address.trim(),
        company_province: form.company_province.trim(),
        company_city: form.company_city.trim(),
        company_district: form.company_district.trim(),
        company_village: form.company_village.trim(),
        same_as_company_address: 0,
        customer_shipping_address: form.shipping_addresses.map(payloadShipping),
      };

      const res = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_REGISTER, registration.id),
        { method: "PUT", cache: "no-store", body: JSON.stringify(payload) },
        token,
      );
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        const msg =
          (json &&
            typeof json === "object" &&
            "message" in json &&
            typeof json.message === "string" &&
            json.message) ||
          `Failed to update registration (${res.status})`;
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
            data-tour={demoMode ? "customer-register-edit-modal" : undefined}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <FaEdit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Edit Data Registrasi
                  </h2>
                  <p className="text-sm text-orange-100">
                    No: {registration.registration_number || registration.id}
                  </p>
                </div>
              </div>
              <button
                data-tour={
                  demoMode ? "customer-register-close-edit-button" : undefined
                }
                onClick={onClose}
                className="rounded-lg p-2 transition hover:bg-white/20"
              >
                <HiXMark className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-6">
              <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    User ID
                  </div>
                  <div className="font-medium">
                    {registration.ekaplus_user?.id || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nama User
                  </div>
                  <div className="font-medium">
                    {registration.ekaplus_user?.full_name || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email User
                  </div>
                  <div className="font-medium">
                    {registration.ekaplus_user?.email || "-"}
                  </div>
                </div>
              </div>

              <div className={sectionCardClass}>
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Identitas Pemilik
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Nama Pemilik <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.owner_full_name}
                      onChange={(e) =>
                        setField("owner_full_name", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      No. Handphone Pemilik{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.owner_phone}
                      onChange={(e) => setField("owner_phone", e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Email Pemilik
                    </label>
                    <input
                      value={form.owner_email}
                      onChange={(e) => setField("owner_email", e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Tempat Lahir Pemilik
                    </label>
                    <input
                      value={form.owner_place_of_birth}
                      onChange={(e) =>
                        setField("owner_place_of_birth", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Tanggal Lahir Pemilik{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.owner_date_of_birth}
                      onChange={(e) =>
                        setField("owner_date_of_birth", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>

              <div className={sectionCardClass}>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Identitas PIC Branch
                  </h3>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={sameAsOwner}
                      onChange={(e) => setSameAsOwner(e.target.checked)}
                      className={checkboxClass}
                    />
                    Sama dengan pemilik
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Nama PIC Branch <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.branch_owner}
                      onChange={(e) => setField("branch_owner", e.target.value)}
                      className={sameAsOwner ? readOnlyFieldClass : fieldClass}
                      readOnly={sameAsOwner}
                      disabled={sameAsOwner}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Nomor PIC Branch <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.branch_owner_phone}
                      onChange={(e) =>
                        setField("branch_owner_phone", e.target.value)
                      }
                      className={sameAsOwner ? readOnlyFieldClass : fieldClass}
                      readOnly={sameAsOwner}
                      disabled={sameAsOwner}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Email PIC Branch
                    </label>
                    <input
                      value={form.branch_owner_email}
                      onChange={(e) =>
                        setField("branch_owner_email", e.target.value)
                      }
                      className={sameAsOwner ? readOnlyFieldClass : fieldClass}
                      readOnly={sameAsOwner}
                      disabled={sameAsOwner}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Tempat Lahir PIC Branch
                    </label>
                    <input
                      value={form.branch_owner_place_of_birth}
                      onChange={(e) =>
                        setField("branch_owner_place_of_birth", e.target.value)
                      }
                      className={sameAsOwner ? readOnlyFieldClass : fieldClass}
                      readOnly={sameAsOwner}
                      disabled={sameAsOwner}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Tanggal Lahir PIC Branch
                    </label>
                    <input
                      type="date"
                      value={form.branch_owner_date_of_birth}
                      onChange={(e) =>
                        setField("branch_owner_date_of_birth", e.target.value)
                      }
                      className={sameAsOwner ? readOnlyFieldClass : fieldClass}
                      disabled={sameAsOwner}
                    />
                  </div>
                </div>
              </div>

              <div className={sectionCardClass}>
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Informasi Perusahaan
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Jenis Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.company_type}
                      onChange={(e) => setCompanyType(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Pilih Jenis Perusahaan</option>
                      {COMPANY_TYPE_OPTIONS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Gelar Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.company_title}
                      onChange={(e) => setCompanyTitle(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Pilih Gelar Perusahaan</option>
                      {companyTitleOptions.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                      <input
                        data-tour={
                          demoMode
                            ? "customer-register-company-name-input"
                            : undefined
                        }
                        value={form.company_name_base}
                        onChange={(e) => setCompanyNameBase(e.target.value)}
                        className={`md:col-span-8 ${fieldClass}`}
                        placeholder="Nama inti perusahaan"
                      />
                      {isSuffixEditable ? (
                        <select
                          value={form.company_name_suffix}
                          onChange={(e) => setCompanyNameSuffix(e.target.value)}
                          className={`md:col-span-4 ${fieldClass}`}
                        >
                          <option value="">Pilih Sebutan</option>
                          {currentSuffixOptions.map((suffix) => (
                            <option key={suffix} value={suffix}>
                              {suffix}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          value={form.company_name_suffix}
                          readOnly
                          className={`md:col-span-4 ${readOnlyFieldClass}`}
                          placeholder="Sebutan"
                        />
                      )}
                    </div>
                    <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 font-semibold text-amber-900">
                      {buildCompanyName(
                        form.company_name_base,
                        form.company_name_suffix,
                      ) || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Kebutuhan Produk <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.product_need}
                      onChange={(e) => setField("product_need", e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Pilih Kebutuhan Produk</option>
                      {PRODUCT_NEED_OPTIONS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Cabang
                    </label>
                    <input
                      value={getBranchLabel(branches, form.branch_id)}
                      readOnly
                      className={readOnlyFieldClass}
                    />
                  </div>
                </div>
              </div>

              <div className={sectionCardClass}>
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Alamat Perusahaan
                </h3>
                {!isLoadingWilayah && !isWilayahApiAvailable && (
                  <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    API wilayah tidak bisa diakses dari browser ini. Gunakan
                    input manual.
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.company_address}
                      onChange={(e) =>
                        setField("company_address", e.target.value)
                      }
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    {isWilayahApiAvailable ? (
                      <select
                        value={companyProvinceCode}
                        onChange={(e) =>
                          void onCompanyProvinceChange(e.target.value)
                        }
                        className={fieldClass}
                        disabled={isLoadingWilayah}
                      >
                        <option value="">
                          {isLoadingWilayah
                            ? "Memuat provinsi..."
                            : "Pilih Provinsi"}
                        </option>
                        {provinces.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={form.company_province}
                        onChange={(e) =>
                          setField("company_province", e.target.value)
                        }
                        className={fieldClass}
                      />
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Kabupaten/Kota <span className="text-red-500">*</span>
                    </label>
                    {isWilayahApiAvailable ? (
                      <select
                        value={companyRegencyCode}
                        onChange={(e) =>
                          void onCompanyRegencyChange(e.target.value)
                        }
                        className={fieldClass}
                        disabled={!companyProvinceCode}
                      >
                        <option value="">
                          {companyProvinceCode
                            ? "Pilih Kota/Kabupaten"
                            : "Pilih provinsi terlebih dahulu"}
                        </option>
                        {companyRegencies.map((city) => (
                          <option key={city.code} value={city.code}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={form.company_city}
                        onChange={(e) =>
                          setField("company_city", e.target.value)
                        }
                        className={fieldClass}
                      />
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Kecamatan <span className="text-red-500">*</span>
                    </label>
                    {isWilayahApiAvailable ? (
                      <select
                        value={
                          companyDistrictCode
                        }
                        onChange={(e) =>
                          void onCompanyDistrictChange(e.target.value)
                        }
                        className={fieldClass}
                        disabled={!companyRegencyCode}
                      >
                        <option value="">
                          {companyRegencyCode
                            ? "Pilih Kecamatan"
                            : "Pilih kota/kabupaten terlebih dahulu"}
                        </option>
                        {companyDistricts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={form.company_district}
                        onChange={(e) =>
                          setField("company_district", e.target.value)
                        }
                        className={fieldClass}
                      />
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-700">
                      Kelurahan <span className="text-red-500">*</span>
                    </label>
                    {isWilayahApiAvailable ? (
                      <select
                        value={companyVillageCode}
                        onChange={(e) => onCompanyVillageChange(e.target.value)}
                        className={fieldClass}
                        disabled={!companyDistrictCode}
                      >
                        <option value="">
                          {companyDistrictCode
                            ? "Pilih Kelurahan"
                            : "Pilih kecamatan terlebih dahulu"}
                        </option>
                        {companyVillages.map((village) => (
                          <option key={village.code} value={village.code}>
                            {village.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={form.company_village}
                        onChange={(e) =>
                          setField("company_village", e.target.value)
                        }
                        className={fieldClass}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className={sectionCardClass}>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Alamat Pengiriman
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Data aktif untuk pengiriman:{" "}
                      {form.shipping_addresses.length} alamat
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                    {form.shipping_addresses.map((s, i) => (
                      <div
                        key={`${s.id || "new"}-${i}`}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-sm font-semibold text-slate-900">
                            Alamat Pengiriman {i + 1}
                          </div>
                          <div className="flex items-center gap-3">
                            <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                              <input
                                type="checkbox"
                                checked={Boolean(sameAsCompanyAddressItems[i])}
                                onChange={(e) =>
                                  toggleSameAsCompanyAddressItem(
                                    i,
                                    e.target.checked,
                                  )
                                }
                                className={checkboxClass}
                              />
                              Sama dengan alamat perusahaan
                            </label>
                            <label className="inline-flex items-center gap-1 text-xs text-slate-700">
                              <input
                                type="checkbox"
                                checked={Boolean(s.is_default)}
                                onChange={() => setDefaultShip(i)}
                                className={checkboxClass}
                              />
                              Default
                            </label>
                            <button
                              onClick={() => removeShip(i)}
                              className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-100"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Label Alamat
                            </label>
                            <input
                              value={s.label || ""}
                              onChange={(e) =>
                                updateShip(i, { label: e.target.value })
                              }
                              className={fieldClass}
                              disabled={Boolean(sameAsCompanyAddressItems[i])}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Tipe Alamat
                            </label>
                            <select
                              value={s.type || "Shipping"}
                              onChange={(e) =>
                                updateShip(i, { type: e.target.value })
                              }
                              className={fieldClass}
                              disabled={Boolean(sameAsCompanyAddressItems[i])}
                            >
                              {ADDRESS_TYPE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Nama Penanggung Jawab
                            </label>
                            <input
                              value={s.pic_name || ""}
                              onChange={(e) =>
                                updateShip(i, { pic_name: e.target.value })
                              }
                              className={fieldClass}
                              disabled={Boolean(sameAsCompanyAddressItems[i])}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              No HP Penanggung Jawab
                            </label>
                            <input
                              value={s.pic_phone || ""}
                              onChange={(e) =>
                                updateShip(i, { pic_phone: e.target.value })
                              }
                              className={fieldClass}
                              disabled={Boolean(sameAsCompanyAddressItems[i])}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Alamat Lengkap
                            </label>
                            <textarea
                              rows={2}
                              value={s.address || ""}
                              onChange={(e) =>
                                updateShip(i, { address: e.target.value })
                              }
                              className={fieldClass}
                              disabled={Boolean(sameAsCompanyAddressItems[i])}
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Provinsi
                            </label>
                            {isWilayahApiAvailable ? (
                              <select
                                value={
                                  shippingAreaStates[i]?.provinceCode || ""
                                }
                                onChange={(e) =>
                                  void onShippingProvinceChange(
                                    i,
                                    e.target.value,
                                  )
                                }
                                className={fieldClass}
                                disabled={
                                  isLoadingWilayah ||
                                  Boolean(sameAsCompanyAddressItems[i])
                                }
                              >
                                <option value="">
                                  {isLoadingWilayah
                                    ? "Memuat provinsi..."
                                    : "Pilih Provinsi"}
                                </option>
                                {provinces.map((p) => (
                                  <option key={p.code} value={p.code}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                value={s.province || ""}
                                onChange={(e) =>
                                  updateShip(i, { province: e.target.value })
                                }
                                className={fieldClass}
                                disabled={Boolean(sameAsCompanyAddressItems[i])}
                              />
                            )}
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Kabupaten/Kota
                            </label>
                            {isWilayahApiAvailable ? (
                              <select
                                value={shippingAreaStates[i]?.regencyCode || ""}
                                onChange={(e) =>
                                  void onShippingRegencyChange(
                                    i,
                                    e.target.value,
                                  )
                                }
                                className={fieldClass}
                                disabled={
                                  !shippingAreaStates[i]?.provinceCode ||
                                  Boolean(sameAsCompanyAddressItems[i])
                                }
                              >
                                <option value="">
                                  {shippingAreaStates[i]?.provinceCode
                                    ? "Pilih Kota/Kabupaten"
                                    : "Pilih provinsi terlebih dahulu"}
                                </option>
                                {(shippingAreaStates[i]?.regencies || []).map(
                                  (city) => (
                                    <option key={city.code} value={city.code}>
                                      {city.name}
                                    </option>
                                  ),
                                )}
                              </select>
                            ) : (
                              <input
                                value={s.city || ""}
                                onChange={(e) =>
                                  updateShip(i, { city: e.target.value })
                                }
                                className={fieldClass}
                                disabled={Boolean(sameAsCompanyAddressItems[i])}
                              />
                            )}
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Kecamatan
                            </label>
                            {isWilayahApiAvailable ? (
                              <select
                                value={shippingAreaStates[i]?.districtCode || ""}
                                onChange={(e) =>
                                  void onShippingDistrictChange(i, e.target.value)
                                }
                                className={fieldClass}
                                disabled={
                                  !shippingAreaStates[i]?.regencyCode ||
                                  Boolean(sameAsCompanyAddressItems[i])
                                }
                              >
                                <option value="">
                                  {shippingAreaStates[i]?.regencyCode
                                    ? "Pilih Kecamatan"
                                    : "Pilih kota/kabupaten terlebih dahulu"}
                                </option>
                                {(shippingAreaStates[i]?.districts || []).map(
                                  (district) => (
                                    <option
                                      key={district.code}
                                      value={district.code}
                                    >
                                      {district.name}
                                    </option>
                                  ),
                                )}
                              </select>
                            ) : (
                              <input
                                value={s.district || ""}
                                onChange={(e) =>
                                  updateShip(i, { district: e.target.value })
                                }
                                className={fieldClass}
                                disabled={Boolean(sameAsCompanyAddressItems[i])}
                              />
                            )}
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-slate-600">
                              Kelurahan
                            </label>
                            {isWilayahApiAvailable ? (
                              <select
                                value={shippingAreaStates[i]?.villageCode || ""}
                                onChange={(e) =>
                                  onShippingVillageChange(i, e.target.value)
                                }
                                className={fieldClass}
                                disabled={
                                  !shippingAreaStates[i]?.districtCode ||
                                  Boolean(sameAsCompanyAddressItems[i])
                                }
                              >
                                <option value="">
                                  {shippingAreaStates[i]?.districtCode
                                    ? "Pilih Kelurahan"
                                    : "Pilih kecamatan terlebih dahulu"}
                                </option>
                                {(shippingAreaStates[i]?.villages || []).map(
                                  (village) => (
                                    <option
                                      key={village.code}
                                      value={village.code}
                                    >
                                      {village.name}
                                    </option>
                                  ),
                                )}
                              </select>
                            ) : (
                              <input
                                value={s.village || ""}
                                onChange={(e) =>
                                  updateShip(i, { village: e.target.value })
                                }
                                className={fieldClass}
                                disabled={Boolean(sameAsCompanyAddressItems[i])}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {hasChanges && (
                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
                  Ada perubahan yang belum disimpan
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="rounded-xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-300 disabled:opacity-50"
              >
                Batal
              </button>
              <motion.button
                data-tour={
                  demoMode ? "customer-register-save-edit-button" : undefined
                }
                whileHover={!isSaving ? { scale: 1.02 } : {}}
                whileTap={!isSaving ? { scale: 0.98 } : {}}
                onClick={handleSave}
                disabled={isSaving || !hasChanges || isLoading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 font-medium text-white disabled:opacity-50"
              >
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
