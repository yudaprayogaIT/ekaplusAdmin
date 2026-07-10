(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/customers/registration/EditRegistrationModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EditRegistrationModal",
    ()=>EditRegistrationModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi2$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/hi2/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/fetchAllQueryRows.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const COMPANY_TYPE_OPTIONS = [
    "Company",
    "Individual"
];
const COMPANY_TITLE_OPTIONS_BY_TYPE = {
    Individual: [
        "Home Industri",
        "Toko",
        "Freelance"
    ],
    Company: [
        "PT",
        "CV",
        "UD",
        "Toko"
    ]
};
const COMPANY_SUFFIX_OPTIONS_BY_TITLE = {
    "Home Industri": [
        "HI"
    ],
    Toko: [
        "TK"
    ],
    Freelance: [
        "BP",
        "IBU"
    ],
    PT: [
        "PT"
    ],
    CV: [
        "CV"
    ],
    UD: [
        "UD"
    ]
};
const PRODUCT_NEED_OPTIONS = [
    "Bahan Baku Springbed & Sofa",
    "Furniture"
];
const ADDRESS_TYPE_OPTIONS = [
    "Shipping",
    "Billing",
    "Other",
    "Warehouse",
    "Office",
    "Personal",
    "Shop"
];
const WILAYAH_BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";
function toInputDate(value) {
    if (!value || value === "-") return "";
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return value.split("T")[0] || "";
}
function cleanInputValue(value) {
    if (!value || value === "-") return "";
    return value;
}
function toNullableText(value) {
    const normalized = cleanInputValue(value).trim();
    return normalized ? normalized : null;
}
function isCompanyAddressShippingRow(row) {
    const label = normalizeName(row?.label);
    return label === "alamat perusahaan" || label === "alamatperusahaan";
}
function payloadShipping(addr) {
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
        is_default: addr.is_default ? 1 : 0
    };
}
function normalizeName(value) {
    return (value || "").trim().toLowerCase();
}
function buildCompanyName(base, suffix) {
    return `${(base || "").trim()} ${(suffix || "").trim()}`.trim();
}
function splitCompanyName(fullName, title) {
    const full = (fullName || "").trim();
    const titleOptions = COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [];
    if (!full) {
        return {
            company_name_base: "",
            company_name_suffix: titleOptions[0] || "",
            company_name: ""
        };
    }
    for (const suffix of titleOptions){
        if (full.toUpperCase().endsWith(` ${suffix.toUpperCase()}`)) {
            const base = full.slice(0, full.length - suffix.length).trim();
            return {
                company_name_base: base,
                company_name_suffix: suffix,
                company_name: buildCompanyName(base, suffix)
            };
        }
    }
    return {
        company_name_base: full,
        company_name_suffix: titleOptions[0] || "",
        company_name: buildCompanyName(full, titleOptions[0] || "")
    };
}
function matchByName(options, value) {
    const target = normalizeName(value);
    if (!target) return null;
    return options.find((opt)=>normalizeName(opt.name) === target) || null;
}
async function fetchWilayah(path) {
    const res = await fetch(`${WILAYAH_BASE_URL}/${path}`, {
        method: "GET",
        cache: "no-store"
    });
    if (!res.ok) {
        throw new Error(`Failed loading wilayah (${res.status})`);
    }
    const json = await res.json();
    const rows = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    const mapped = rows.map((row)=>({
            code: String(row.code || row.id || ""),
            name: String(row.name || "")
        }));
    return mapped.filter((row)=>Boolean(row.code && row.name));
}
function emptyShippingAreaState() {
    return {
        provinceCode: "",
        regencyCode: "",
        districtCode: "",
        villageCode: "",
        regencies: [],
        districts: [],
        villages: []
    };
}
const sectionCardClass = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";
const fieldClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100";
const readOnlyFieldClass = "w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-700";
const checkboxClass = "h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400";
function getBranchLabel(branches, branchId) {
    if (!branchId) return "-";
    const branch = branches.find((item)=>item.id === branchId);
    if (!branch) return String(branchId);
    return `${branch.branch_name}${branch.city ? ` - ${branch.city}` : ""}`;
}
function isShippingSameAsCompanyAddress(company, shipping) {
    return normalizeName(company.company_address) === normalizeName(shipping.address) && normalizeName(company.company_city) === normalizeName(shipping.city) && normalizeName(company.company_province) === normalizeName(shipping.province) && normalizeName(company.company_district) === normalizeName(shipping.district) && normalizeName(company.company_village) === normalizeName(shipping.village);
}
function isSameAsOwnerInitialState(form) {
    return cleanInputValue(form.owner_full_name) === cleanInputValue(form.branch_owner) && cleanInputValue(form.owner_phone) === cleanInputValue(form.branch_owner_phone) && cleanInputValue(form.owner_email) === cleanInputValue(form.branch_owner_email) && cleanInputValue(form.owner_place_of_birth) === cleanInputValue(form.branch_owner_place_of_birth) && cleanInputValue(form.owner_date_of_birth) === cleanInputValue(form.branch_owner_date_of_birth);
}
function EditRegistrationModal({ isOpen, onClose, registration, onSuccess, demoMode = false, onDemoSave }) {
    _s();
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [snapshot, setSnapshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [branches, setBranches] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [provinces, setProvinces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [companyProvinceCode, setCompanyProvinceCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [companyRegencyCode, setCompanyRegencyCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [companyDistrictCode, setCompanyDistrictCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [companyVillageCode, setCompanyVillageCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [companyRegencies, setCompanyRegencies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [companyDistricts, setCompanyDistricts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [companyVillages, setCompanyVillages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [shippingAreaStates, setShippingAreaStates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [sameAsCompanyAddressItems, setSameAsCompanyAddressItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingWilayah, setIsLoadingWilayah] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sameAsOwner, setSameAsOwner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const hasChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EditRegistrationModal.useMemo[hasChanges]": ()=>{
            if (!form || !snapshot) return false;
            return JSON.stringify(form) !== snapshot;
        }
    }["EditRegistrationModal.useMemo[hasChanges]"], [
        form,
        snapshot
    ]);
    const isWilayahApiAvailable = provinces.length > 0;
    const shippingAddressesLength = form?.shipping_addresses.length ?? 0;
    const sameAsCompanyAddressItemsKey = sameAsCompanyAddressItems.map((value)=>value ? "1" : "0").join(",");
    const companyAreaOptionsKey = [
        companyProvinceCode,
        companyRegencyCode,
        companyDistrictCode,
        companyVillageCode,
        companyRegencies.length,
        companyDistricts.length,
        companyVillages.length
    ].join("|");
    const regencyCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const districtCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const villageCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const formRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sameAsCompanyAddressItemsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const companyAreaSnapshotRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        companyProvinceCode: "",
        companyRegencyCode: "",
        companyDistrictCode: "",
        companyVillageCode: "",
        companyRegencies: [],
        companyDistricts: [],
        companyVillages: []
    });
    const getRegencies = async (provinceCode)=>{
        if (!provinceCode) return [];
        if (regencyCache.current[provinceCode]) return regencyCache.current[provinceCode];
        const rows = await fetchWilayah(`regencies/${provinceCode}.json`);
        regencyCache.current[provinceCode] = rows;
        return rows;
    };
    const getDistricts = async (regencyCode)=>{
        if (!regencyCode) return [];
        if (districtCache.current[regencyCode]) return districtCache.current[regencyCode];
        const rows = await fetchWilayah(`districts/${regencyCode}.json`);
        districtCache.current[regencyCode] = rows;
        return rows;
    };
    const getVillages = async (districtCode)=>{
        if (!districtCode) return [];
        if (villageCache.current[districtCode]) return villageCache.current[districtCode];
        const rows = await fetchWilayah(`villages/${districtCode}.json`);
        villageCache.current[districtCode] = rows;
        return rows;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRegistrationModal.useEffect": ()=>{
            let cancelled = false;
            async function loadData() {
                if (!isOpen || !registration) return;
                setIsLoading(true);
                setIsLoadingWilayah(true);
                setError(null);
                try {
                    if (demoMode) {
                        const shipping = (registration.shipping_addresses || []).map({
                            "EditRegistrationModal.useEffect.loadData.shipping": (x)=>({
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
                                    is_default: x.is_default ? 1 : 0
                                })
                        }["EditRegistrationModal.useEffect.loadData.shipping"]);
                        const initial = {
                            owner_full_name: cleanInputValue(registration.user.full_name),
                            owner_phone: cleanInputValue(registration.user.phone),
                            owner_email: cleanInputValue(registration.user.email),
                            owner_place_of_birth: cleanInputValue(registration.user.place_of_birth),
                            owner_date_of_birth: toInputDate(registration.user.date_of_birth),
                            branch_owner: cleanInputValue(registration.branch_owner?.full_name),
                            branch_owner_phone: cleanInputValue(registration.branch_owner?.phone),
                            branch_owner_email: cleanInputValue(registration.branch_owner?.email),
                            branch_owner_place_of_birth: cleanInputValue(registration.branch_owner?.place_of_birth),
                            branch_owner_date_of_birth: toInputDate(registration.branch_owner?.date_of_birth),
                            company_type: cleanInputValue(registration.company.company_type),
                            company_title: cleanInputValue(registration.company.company_title),
                            ...splitCompanyName(cleanInputValue(registration.company.name), cleanInputValue(registration.company.company_title)),
                            product_need: cleanInputValue(registration.company.product_need),
                            branch_id: registration.company.branch_id || null,
                            company_address: cleanInputValue(registration.address.full_address),
                            company_province: cleanInputValue(registration.address.province_name),
                            company_city: cleanInputValue(registration.address.city_name),
                            company_district: cleanInputValue(registration.address.district_name),
                            company_village: cleanInputValue(registration.address.village_name),
                            shipping_addresses: shipping
                        };
                        if (!cancelled) {
                            setBranches([
                                {
                                    id: registration.company.branch_id,
                                    branch_name: registration.company.branch_name,
                                    city: registration.company.branch_city
                                }
                            ]);
                            setProvinces([]);
                            setCompanyProvinceCode("");
                            setCompanyRegencyCode("");
                            setCompanyDistrictCode("");
                            setCompanyVillageCode("");
                            setCompanyRegencies([]);
                            setCompanyDistricts([]);
                            setCompanyVillages([]);
                            setShippingAreaStates(initial.shipping_addresses.map({
                                "EditRegistrationModal.useEffect.loadData": ()=>emptyShippingAreaState()
                            }["EditRegistrationModal.useEffect.loadData"]));
                            setSameAsCompanyAddressItems(shipping.map({
                                "EditRegistrationModal.useEffect.loadData": (addr)=>isShippingSameAsCompanyAddress(initial, addr)
                            }["EditRegistrationModal.useEffect.loadData"]));
                            setSameAsOwner(isSameAsOwnerInitialState(initial));
                            setForm(initial);
                            setSnapshot(JSON.stringify(initial));
                        }
                        return;
                    }
                    if (!token || !isAuthenticated) return;
                    const shippingSpec = {
                        fields: [
                            "*"
                        ],
                        filters: [
                            [
                                "parent_id",
                                "=",
                                Number(registration.id)
                            ]
                        ]
                    };
                    const branchSpec = {
                        fields: [
                            "id",
                            "branch_name",
                            "city"
                        ]
                    };
                    const [shippingRes, branchRes, provinceRows] = await Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, shippingSpec), {
                            method: "GET",
                            cache: "no-store"
                        }, token),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
                            endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH,
                            spec: branchSpec,
                            token,
                            errorMessage: "Failed to fetch branches"
                        }),
                        fetchWilayah("provinces.json").catch({
                            "EditRegistrationModal.useEffect.loadData": ()=>[]
                        }["EditRegistrationModal.useEffect.loadData"])
                    ]);
                    let shippingRows = [];
                    if (shippingRes.ok) {
                        const shippingJson = await shippingRes.json();
                        shippingRows = Array.isArray(shippingJson?.data) ? shippingJson.data : [];
                    } else {
                        // Fallback: some backend deployments reject filters, fetch all then filter client-side
                        const fallbackRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER_ADDRESS, {
                            fields: [
                                "*"
                            ]
                        }), {
                            method: "GET",
                            cache: "no-store"
                        }, token);
                        if (!fallbackRes.ok) {
                            throw new Error(`Failed to fetch shipping (${shippingRes.status})`);
                        }
                        const fallbackJson = await fallbackRes.json();
                        const allRows = Array.isArray(fallbackJson?.data) ? fallbackJson.data : [];
                        shippingRows = allRows.filter({
                            "EditRegistrationModal.useEffect.loadData": (row)=>Number(row.parent_id || 0) === Number(registration.id)
                        }["EditRegistrationModal.useEffect.loadData"]);
                    }
                    const branchRows = Array.isArray(branchRes) ? branchRes : [];
                    const shipping = shippingRows.filter({
                        "EditRegistrationModal.useEffect.loadData.shipping": (row)=>!isCompanyAddressShippingRow(row)
                    }["EditRegistrationModal.useEffect.loadData.shipping"]).map({
                        "EditRegistrationModal.useEffect.loadData.shipping": (x)=>({
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
                                is_default: x.is_default ? 1 : 0
                            })
                    }["EditRegistrationModal.useEffect.loadData.shipping"]);
                    const initial = {
                        owner_full_name: cleanInputValue(registration.user.full_name),
                        owner_phone: cleanInputValue(registration.user.phone),
                        owner_email: cleanInputValue(registration.user.email),
                        owner_place_of_birth: cleanInputValue(registration.user.place_of_birth),
                        owner_date_of_birth: toInputDate(registration.user.date_of_birth),
                        branch_owner: cleanInputValue(registration.branch_owner?.full_name),
                        branch_owner_phone: cleanInputValue(registration.branch_owner?.phone),
                        branch_owner_email: cleanInputValue(registration.branch_owner?.email),
                        branch_owner_place_of_birth: cleanInputValue(registration.branch_owner?.place_of_birth),
                        branch_owner_date_of_birth: toInputDate(registration.branch_owner?.date_of_birth),
                        company_type: cleanInputValue(registration.company.company_type),
                        company_title: cleanInputValue(registration.company.company_title),
                        ...splitCompanyName(cleanInputValue(registration.company.name), cleanInputValue(registration.company.company_title)),
                        product_need: cleanInputValue(registration.company.product_need),
                        branch_id: registration.company.branch_id || null,
                        company_address: cleanInputValue(registration.address.full_address),
                        company_province: cleanInputValue(registration.address.province_name),
                        company_city: cleanInputValue(registration.address.city_name),
                        company_district: cleanInputValue(registration.address.district_name),
                        company_village: cleanInputValue(registration.address.village_name),
                        shipping_addresses: shipping
                    };
                    const companyProvince = matchByName(provinceRows, initial.company_province);
                    const nextCompanyProvinceCode = companyProvince?.code || "";
                    let nextCompanyRegencies = [];
                    let nextCompanyRegencyCode = "";
                    let nextCompanyDistricts = [];
                    let nextCompanyDistrictCode = "";
                    let nextCompanyVillages = [];
                    let nextCompanyVillageCode = "";
                    if (nextCompanyProvinceCode && provinceRows.length > 0) {
                        nextCompanyRegencies = await getRegencies(nextCompanyProvinceCode);
                        const companyRegency = matchByName(nextCompanyRegencies, initial.company_city);
                        nextCompanyRegencyCode = companyRegency?.code || "";
                        if (nextCompanyRegencyCode) {
                            nextCompanyDistricts = await getDistricts(nextCompanyRegencyCode);
                            const companyDistrict = matchByName(nextCompanyDistricts, initial.company_district);
                            nextCompanyDistrictCode = companyDistrict?.code || "";
                            if (nextCompanyDistrictCode) {
                                nextCompanyVillages = await getVillages(nextCompanyDistrictCode);
                                const companyVillage = matchByName(nextCompanyVillages, initial.company_village);
                                nextCompanyVillageCode = companyVillage?.code || "";
                            }
                        }
                    }
                    const nextShippingAreaStates = provinceRows.length > 0 ? await Promise.all(initial.shipping_addresses.map({
                        "EditRegistrationModal.useEffect.loadData": async (addr)=>{
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
                                    villages: []
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
                                    villages: []
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
                                villages
                            };
                        }
                    }["EditRegistrationModal.useEffect.loadData"])) : initial.shipping_addresses.map({
                        "EditRegistrationModal.useEffect.loadData": ()=>emptyShippingAreaState()
                    }["EditRegistrationModal.useEffect.loadData"]);
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
                        setSameAsCompanyAddressItems(shipping.map({
                            "EditRegistrationModal.useEffect.loadData": (addr)=>isShippingSameAsCompanyAddress(initial, addr)
                        }["EditRegistrationModal.useEffect.loadData"]));
                        setSameAsOwner(isSameAsOwnerInitialState(initial));
                        setForm(initial);
                        setSnapshot(JSON.stringify(initial));
                    }
                } catch (err) {
                    if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat data edit");
                } finally{
                    if (!cancelled) {
                        setIsLoading(false);
                        setIsLoadingWilayah(false);
                    }
                }
            }
            loadData();
            return ({
                "EditRegistrationModal.useEffect": ()=>{
                    cancelled = true;
                }
            })["EditRegistrationModal.useEffect"];
        }
    }["EditRegistrationModal.useEffect"], [
        demoMode,
        isOpen,
        registration,
        token,
        isAuthenticated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRegistrationModal.useEffect": ()=>{
            formRef.current = form;
        }
    }["EditRegistrationModal.useEffect"], [
        form
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRegistrationModal.useEffect": ()=>{
            sameAsCompanyAddressItemsRef.current = sameAsCompanyAddressItems;
        }
    }["EditRegistrationModal.useEffect"], [
        sameAsCompanyAddressItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRegistrationModal.useEffect": ()=>{
            companyAreaSnapshotRef.current = {
                companyProvinceCode,
                companyRegencyCode,
                companyDistrictCode,
                companyVillageCode,
                companyRegencies,
                companyDistricts,
                companyVillages
            };
        }
    }["EditRegistrationModal.useEffect"], [
        companyProvinceCode,
        companyRegencyCode,
        companyDistrictCode,
        companyVillageCode,
        companyRegencies,
        companyDistricts,
        companyVillages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRegistrationModal.useEffect": ()=>{
            if (!sameAsOwner) return;
            setForm({
                "EditRegistrationModal.useEffect": (prev)=>{
                    if (!prev) return prev;
                    return {
                        ...prev,
                        branch_owner: prev.owner_full_name,
                        branch_owner_phone: prev.owner_phone,
                        branch_owner_email: prev.owner_email,
                        branch_owner_place_of_birth: prev.owner_place_of_birth,
                        branch_owner_date_of_birth: prev.owner_date_of_birth
                    };
                }
            }["EditRegistrationModal.useEffect"]);
        }
    }["EditRegistrationModal.useEffect"], [
        sameAsOwner,
        form?.owner_full_name,
        form?.owner_phone,
        form?.owner_email,
        form?.owner_place_of_birth,
        form?.owner_date_of_birth
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRegistrationModal.useEffect": ()=>{
            setShippingAreaStates({
                "EditRegistrationModal.useEffect": (prev)=>{
                    if (prev.length === shippingAddressesLength) return prev;
                    const next = [
                        ...prev
                    ];
                    while(next.length < shippingAddressesLength){
                        next.push(emptyShippingAreaState());
                    }
                    return next.slice(0, shippingAddressesLength);
                }
            }["EditRegistrationModal.useEffect"]);
            setSameAsCompanyAddressItems({
                "EditRegistrationModal.useEffect": (prev)=>{
                    if (prev.length === shippingAddressesLength) return prev;
                    const next = [
                        ...prev
                    ];
                    while(next.length < shippingAddressesLength){
                        next.push(false);
                    }
                    return next.slice(0, shippingAddressesLength);
                }
            }["EditRegistrationModal.useEffect"]);
        }
    }["EditRegistrationModal.useEffect"], [
        shippingAddressesLength
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditRegistrationModal.useEffect": ()=>{
            const currentForm = formRef.current;
            const sameAsItems = sameAsCompanyAddressItemsRef.current;
            const companyAreaSnapshot = companyAreaSnapshotRef.current;
            if (!currentForm) return;
            if (!sameAsItems.some(Boolean)) return;
            setForm({
                "EditRegistrationModal.useEffect": (prev)=>{
                    if (!prev) return prev;
                    const nextShippingAddresses = prev.shipping_addresses.map({
                        "EditRegistrationModal.useEffect.nextShippingAddresses": (address, idx)=>sameAsItems[idx] ? {
                                ...address,
                                address: prev.company_address,
                                city: prev.company_city,
                                province: prev.company_province,
                                district: prev.company_district,
                                village: prev.company_village
                            } : address
                    }["EditRegistrationModal.useEffect.nextShippingAddresses"]);
                    const hasChanged = nextShippingAddresses.some({
                        "EditRegistrationModal.useEffect.hasChanged": (address, idx)=>address.address !== prev.shipping_addresses[idx]?.address || address.city !== prev.shipping_addresses[idx]?.city || address.province !== prev.shipping_addresses[idx]?.province || address.district !== prev.shipping_addresses[idx]?.district || address.village !== prev.shipping_addresses[idx]?.village
                    }["EditRegistrationModal.useEffect.hasChanged"]);
                    if (!hasChanged) return prev;
                    return {
                        ...prev,
                        shipping_addresses: nextShippingAddresses
                    };
                }
            }["EditRegistrationModal.useEffect"]);
            setShippingAreaStates({
                "EditRegistrationModal.useEffect": (prev)=>{
                    let hasChanged = false;
                    const next = prev.map({
                        "EditRegistrationModal.useEffect.next": (state, idx)=>{
                            if (!sameAsItems[idx]) return state;
                            const updatedState = {
                                ...state,
                                provinceCode: companyAreaSnapshot.companyProvinceCode,
                                regencyCode: companyAreaSnapshot.companyRegencyCode,
                                districtCode: companyAreaSnapshot.companyDistrictCode,
                                villageCode: companyAreaSnapshot.companyVillageCode,
                                regencies: companyAreaSnapshot.companyRegencies,
                                districts: companyAreaSnapshot.companyDistricts,
                                villages: companyAreaSnapshot.companyVillages
                            };
                            if (updatedState.provinceCode !== state.provinceCode || updatedState.regencyCode !== state.regencyCode || updatedState.districtCode !== state.districtCode || updatedState.villageCode !== state.villageCode || updatedState.regencies !== state.regencies || updatedState.districts !== state.districts || updatedState.villages !== state.villages) {
                                hasChanged = true;
                            }
                            return updatedState;
                        }
                    }["EditRegistrationModal.useEffect.next"]);
                    return hasChanged ? next : prev;
                }
            }["EditRegistrationModal.useEffect"]);
        }
    }["EditRegistrationModal.useEffect"], [
        form?.company_address,
        form?.company_city,
        form?.company_province,
        form?.company_district,
        form?.company_village,
        shippingAddressesLength,
        sameAsCompanyAddressItemsKey,
        companyAreaOptionsKey
    ]);
    if (!registration || !form) return null;
    const setField = (key, value)=>setForm((prev)=>prev ? {
                ...prev,
                [key]: value
            } : prev);
    const updateShip = (idx, patch)=>setForm((prev)=>{
            if (!prev) return prev;
            const next = [
                ...prev.shipping_addresses
            ];
            next[idx] = {
                ...next[idx],
                ...patch
            };
            return {
                ...prev,
                shipping_addresses: next
            };
        });
    const removeShip = (idx)=>{
        setForm((prev)=>prev ? {
                ...prev,
                shipping_addresses: prev.shipping_addresses.filter((_, i)=>i !== idx)
            } : prev);
        setShippingAreaStates((prev)=>prev.filter((_, i)=>i !== idx));
        setSameAsCompanyAddressItems((prev)=>prev.filter((_, i)=>i !== idx));
    };
    const setDefaultShip = (idx)=>setForm((prev)=>prev ? {
                ...prev,
                shipping_addresses: prev.shipping_addresses.map((x, i)=>({
                        ...x,
                        is_default: i === idx ? 1 : 0
                    }))
            } : prev);
    const toggleSameAsCompanyAddressItem = (idx, checked)=>{
        setSameAsCompanyAddressItems((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = checked;
            return next;
        });
        if (!checked) return;
        updateShip(idx, {
            address: form.company_address,
            city: form.company_city,
            province: form.company_province,
            district: form.company_district,
            village: form.company_village
        });
        setShippingAreaStates((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = {
                ...next[idx] || emptyShippingAreaState(),
                provinceCode: companyProvinceCode,
                regencyCode: companyRegencyCode,
                districtCode: companyDistrictCode,
                villageCode: companyVillageCode,
                regencies: companyRegencies,
                districts: companyDistricts,
                villages: companyVillages
            };
            return next;
        });
    };
    const onCompanyProvinceChange = async (provinceCode)=>{
        const selected = provinces.find((x)=>x.code === provinceCode) || null;
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
    const onCompanyRegencyChange = async (regencyCode)=>{
        const selected = companyRegencies.find((x)=>x.code === regencyCode) || null;
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
    const onCompanyDistrictChange = async (districtCode)=>{
        const selected = companyDistricts.find((x)=>x.code === districtCode) || null;
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
    const onCompanyVillageChange = (villageCode)=>{
        const selected = companyVillages.find((x)=>x.code === villageCode) || null;
        setCompanyVillageCode(villageCode);
        setField("company_village", selected?.name || "");
    };
    const onShippingProvinceChange = async (idx, provinceCode)=>{
        const selected = provinces.find((x)=>x.code === provinceCode) || null;
        updateShip(idx, {
            province: selected?.name || "",
            city: "",
            district: "",
            village: ""
        });
        setShippingAreaStates((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = {
                provinceCode,
                regencyCode: "",
                districtCode: "",
                villageCode: "",
                regencies: [],
                districts: [],
                villages: []
            };
            return next;
        });
        if (!provinceCode) return;
        try {
            const regencies = await getRegencies(provinceCode);
            setShippingAreaStates((prev)=>{
                const next = [
                    ...prev
                ];
                next[idx] = {
                    provinceCode,
                    regencyCode: "",
                    districtCode: "",
                    villageCode: "",
                    regencies,
                    districts: [],
                    villages: []
                };
                return next;
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat kota/kabupaten alamat pengiriman");
        }
    };
    const onShippingRegencyChange = async (idx, regencyCode)=>{
        const state = shippingAreaStates[idx] || emptyShippingAreaState();
        const selected = state.regencies.find((x)=>x.code === regencyCode) || null;
        updateShip(idx, {
            city: selected?.name || "",
            district: "",
            village: ""
        });
        setShippingAreaStates((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = {
                ...state,
                regencyCode,
                districtCode: "",
                villageCode: "",
                districts: [],
                villages: []
            };
            return next;
        });
        if (!regencyCode) return;
        try {
            const districts = await getDistricts(regencyCode);
            setShippingAreaStates((prev)=>{
                const next = [
                    ...prev
                ];
                const current = next[idx] || emptyShippingAreaState();
                next[idx] = {
                    ...current,
                    regencyCode,
                    districtCode: "",
                    villageCode: "",
                    districts,
                    villages: []
                };
                return next;
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat kecamatan alamat pengiriman");
        }
    };
    const onShippingDistrictChange = async (idx, districtCode)=>{
        const state = shippingAreaStates[idx] || emptyShippingAreaState();
        const selected = state.districts.find((x)=>x.code === districtCode) || null;
        updateShip(idx, {
            district: selected?.name || "",
            village: ""
        });
        setShippingAreaStates((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = {
                ...state,
                districtCode,
                villageCode: "",
                villages: []
            };
            return next;
        });
        if (!districtCode) return;
        try {
            const villages = await getVillages(districtCode);
            setShippingAreaStates((prev)=>{
                const next = [
                    ...prev
                ];
                const current = next[idx] || emptyShippingAreaState();
                next[idx] = {
                    ...current,
                    districtCode,
                    villageCode: "",
                    villages
                };
                return next;
            });
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal memuat kelurahan alamat pengiriman");
        }
    };
    const onShippingVillageChange = (idx, villageCode)=>{
        const state = shippingAreaStates[idx] || emptyShippingAreaState();
        const selected = state.villages.find((x)=>x.code === villageCode) || null;
        updateShip(idx, {
            village: selected?.name || ""
        });
        setShippingAreaStates((prev)=>{
            const next = [
                ...prev
            ];
            next[idx] = {
                ...state,
                villageCode
            };
            return next;
        });
    };
    const companyTitleOptions = COMPANY_TITLE_OPTIONS_BY_TYPE[form.company_type] || [];
    const currentSuffixOptions = COMPANY_SUFFIX_OPTIONS_BY_TITLE[form.company_title] || [];
    const isSuffixEditable = form.company_title === "Freelance";
    const setCompanyType = (type)=>{
        const nextTitles = COMPANY_TITLE_OPTIONS_BY_TYPE[type] || [];
        const nextTitle = type ? nextTitles[0] || "" : "";
        const nextSuffix = nextTitle ? (COMPANY_SUFFIX_OPTIONS_BY_TITLE[nextTitle] || [])[0] || "" : "";
        setForm((prev)=>{
            if (!prev) return prev;
            return {
                ...prev,
                company_type: type,
                company_title: nextTitle,
                company_name_suffix: nextSuffix,
                company_name: buildCompanyName(prev.company_name_base, nextSuffix)
            };
        });
    };
    const setCompanyTitle = (title)=>{
        const nextSuffix = (COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [])[0] || "";
        setForm((prev)=>{
            if (!prev) return prev;
            return {
                ...prev,
                company_title: title,
                company_name_suffix: nextSuffix,
                company_name: buildCompanyName(prev.company_name_base, nextSuffix)
            };
        });
    };
    const setCompanyNameBase = (base)=>{
        setForm((prev)=>{
            if (!prev) return prev;
            return {
                ...prev,
                company_name_base: base,
                company_name: buildCompanyName(base, prev.company_name_suffix)
            };
        });
    };
    const setCompanyNameSuffix = (suffix)=>{
        setForm((prev)=>{
            if (!prev) return prev;
            return {
                ...prev,
                company_name_suffix: suffix,
                company_name: buildCompanyName(prev.company_name_base, suffix)
            };
        });
    };
    const validate = ()=>{
        if (!form.owner_full_name.trim()) return "Nama pemilik wajib diisi";
        if (!form.owner_phone.trim()) return "No HP pemilik wajib diisi";
        if (!form.branch_owner.trim()) return "Nama PIC branch wajib diisi";
        if (!form.branch_owner_phone.trim()) return "No PIC branch wajib diisi";
        if (!form.company_type.trim()) return "Jenis perusahaan wajib diisi";
        if (!form.company_title.trim()) return "Gelar perusahaan wajib diisi";
        if (!form.company_name_base.trim()) return "Nama perusahaan wajib diisi";
        if (!form.company_name_suffix.trim()) return "Sebutan perusahaan wajib diisi";
        if (!form.product_need.trim()) return "Kebutuhan produk wajib diisi";
        if (!form.branch_id) return "Cabang wajib dipilih";
        if (!form.company_address.trim()) return "Alamat perusahaan wajib diisi";
        if (!form.company_province.trim()) return "Provinsi perusahaan wajib diisi";
        if (!form.company_city.trim()) return "Kota perusahaan wajib diisi";
        if (!form.company_district.trim()) return "Kecamatan perusahaan wajib diisi";
        if (!form.company_village.trim()) return "Kelurahan perusahaan wajib diisi";
        for(let i = 0; i < form.shipping_addresses.length; i += 1){
            const s = form.shipping_addresses[i];
            if (!s.label?.trim() || !s.type?.trim() || !s.address?.trim() || !s.city?.trim() || !s.province?.trim() || !s.district?.trim() || !s.village?.trim()) {
                return `Data alamat pengiriman #${i + 1} belum lengkap`;
            }
        }
        return null;
    };
    const handleSave = async ()=>{
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        setError(null);
        setIsSaving(true);
        try {
            const nextCompanyName = buildCompanyName(form.company_name_base, form.company_name_suffix);
            if (demoMode) {
                const selectedBranch = branches.find((item)=>item.id === form.branch_id);
                const nextRegistration = {
                    ...registration,
                    user: {
                        ...registration.user,
                        full_name: form.owner_full_name.trim(),
                        phone: form.owner_phone.trim(),
                        email: form.owner_email.trim(),
                        place_of_birth: form.owner_place_of_birth.trim(),
                        date_of_birth: form.owner_date_of_birth || registration.user.date_of_birth
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
                        branch_city: selectedBranch?.city || registration.company.branch_city
                    },
                    address: {
                        ...registration.address,
                        full_address: form.company_address.trim(),
                        province_name: form.company_province.trim(),
                        city_name: form.company_city.trim(),
                        district_name: form.company_district.trim(),
                        village_name: form.company_village.trim()
                    },
                    branch_owner: {
                        full_name: form.branch_owner.trim(),
                        phone: form.branch_owner_phone.trim(),
                        email: form.branch_owner_email.trim(),
                        place_of_birth: form.branch_owner_place_of_birth.trim(),
                        date_of_birth: form.branch_owner_date_of_birth || registration.branch_owner?.date_of_birth || ""
                    },
                    shipping_addresses: form.shipping_addresses,
                    updated_at: new Date().toISOString()
                };
                onDemoSave?.(nextRegistration);
                onSuccess();
                onClose();
                return;
            }
            if (!token || !isAuthenticated) return;
            const rawApplicantOwnerId = registration.ekaplus_user?.id;
            const applicantOwnerId = typeof rawApplicantOwnerId === "number" ? rawApplicantOwnerId : Number.parseInt(String(rawApplicantOwnerId || ""), 10);
            const fallbackOwnerId = Number(registration.created_by_id || 0) || Number(registration.user.user_id || 0);
            const payload = {
                owner: Number.isFinite(applicantOwnerId) && applicantOwnerId > 0 ? applicantOwnerId : fallbackOwnerId > 0 ? fallbackOwnerId : undefined,
                owner_full_name: form.owner_full_name.trim(),
                owner_phone: form.owner_phone.trim(),
                owner_email: toNullableText(form.owner_email),
                owner_place_of_birth: toNullableText(form.owner_place_of_birth),
                owner_date_of_birth: form.owner_date_of_birth || null,
                branch_owner: form.branch_owner.trim(),
                branch_owner_phone: form.branch_owner_phone.trim(),
                branch_owner_email: toNullableText(form.branch_owner_email),
                branch_owner_place_of_birth: toNullableText(form.branch_owner_place_of_birth),
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
                customer_shipping_address: form.shipping_addresses.map(payloadShipping)
            };
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.CUSTOMER_REGISTER, registration.id), {
                method: "PUT",
                cache: "no-store",
                body: JSON.stringify(payload)
            }, token);
            if (!res.ok) {
                const json = await res.json().catch(()=>null);
                const msg = json && typeof json === "object" && "message" in json && typeof json.message === "string" && json.message || `Failed to update registration (${res.status})`;
                throw new Error(msg);
            }
            window.dispatchEvent(new Event("ekatalog:customer_registrations_update"));
            onSuccess();
            onClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Gagal menyimpan perubahan");
        } finally{
            setIsSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
            onClick: (e)=>{
                if (e.target === e.currentTarget) onClose();
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                "data-tour": demoMode ? "customer-register-edit-modal" : undefined,
                initial: {
                    opacity: 0,
                    scale: 0.95
                },
                animate: {
                    opacity: 1,
                    scale: 1
                },
                exit: {
                    opacity: 0,
                    scale: 0.95
                },
                className: "flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-12 w-12 items-center justify-center rounded-xl bg-white/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEdit"], {
                                            className: "w-6 h-6 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                            lineNumber: 1369,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1368,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold text-white",
                                                children: "Edit Data Registrasi"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1372,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-orange-100",
                                                children: [
                                                    "No: ",
                                                    registration.registration_number || registration.id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1375,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1371,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1367,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "data-tour": demoMode ? "customer-register-close-edit-button" : undefined,
                                onClick: onClose,
                                className: "rounded-lg p-2 transition hover:bg-white/20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$hi2$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HiXMark"], {
                                    className: "w-6 h-6 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                    lineNumber: 1387,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1380,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                        lineNumber: 1366,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 space-y-5 overflow-y-auto bg-slate-50 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm md:grid-cols-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                children: "User ID"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1394,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium",
                                                children: registration.ekaplus_user?.id || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1397,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1393,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                children: "Nama User"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1402,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium",
                                                children: registration.ekaplus_user?.full_name || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1405,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1401,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                children: "Email User"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1410,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-medium",
                                                children: registration.ekaplus_user?.email || "-"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1413,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1409,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1392,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: sectionCardClass,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "mb-4 text-lg font-bold text-slate-900",
                                        children: "Identitas Pemilik"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1420,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Nama Pemilik ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1426,
                                                                columnNumber: 36
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1425,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.owner_full_name,
                                                        onChange: (e)=>setField("owner_full_name", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1428,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1424,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "No. Handphone Pemilik",
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1439,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1437,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.owner_phone,
                                                        onChange: (e)=>setField("owner_phone", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1441,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1436,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: "Email Pemilik"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1448,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.owner_email,
                                                        onChange: (e)=>setField("owner_email", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1451,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1447,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: "Tempat Lahir Pemilik"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1458,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.owner_place_of_birth,
                                                        onChange: (e)=>setField("owner_place_of_birth", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1461,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1457,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Tanggal Lahir Pemilik",
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1472,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        value: form.owner_date_of_birth,
                                                        onChange: (e)=>setField("owner_date_of_birth", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1474,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1469,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1423,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1419,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: sectionCardClass,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold text-slate-900",
                                                children: "Identitas PIC Branch"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1488,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "inline-flex items-center gap-2 text-sm text-slate-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: sameAsOwner,
                                                        onChange: (e)=>setSameAsOwner(e.target.checked),
                                                        className: checkboxClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1492,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Sama dengan pemilik"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1491,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1487,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Nama PIC Branch ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1504,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1503,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.branch_owner,
                                                        onChange: (e)=>setField("branch_owner", e.target.value),
                                                        className: sameAsOwner ? readOnlyFieldClass : fieldClass,
                                                        readOnly: sameAsOwner,
                                                        disabled: sameAsOwner
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1506,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1502,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Nomor PIC Branch ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1516,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1515,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.branch_owner_phone,
                                                        onChange: (e)=>setField("branch_owner_phone", e.target.value),
                                                        className: sameAsOwner ? readOnlyFieldClass : fieldClass,
                                                        readOnly: sameAsOwner,
                                                        disabled: sameAsOwner
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1518,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1514,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: "Email PIC Branch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1529,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.branch_owner_email,
                                                        onChange: (e)=>setField("branch_owner_email", e.target.value),
                                                        className: sameAsOwner ? readOnlyFieldClass : fieldClass,
                                                        readOnly: sameAsOwner,
                                                        disabled: sameAsOwner
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1532,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1528,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: "Tempat Lahir PIC Branch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1543,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.branch_owner_place_of_birth,
                                                        onChange: (e)=>setField("branch_owner_place_of_birth", e.target.value),
                                                        className: sameAsOwner ? readOnlyFieldClass : fieldClass,
                                                        readOnly: sameAsOwner,
                                                        disabled: sameAsOwner
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1546,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1542,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: "Tanggal Lahir PIC Branch"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1557,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        value: form.branch_owner_date_of_birth,
                                                        onChange: (e)=>setField("branch_owner_date_of_birth", e.target.value),
                                                        className: sameAsOwner ? readOnlyFieldClass : fieldClass,
                                                        disabled: sameAsOwner
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1560,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1556,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1501,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1486,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: sectionCardClass,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "mb-4 text-lg font-bold text-slate-900",
                                        children: "Informasi Perusahaan"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1574,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Jenis Perusahaan ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1580,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1579,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: form.company_type,
                                                        onChange: (e)=>setCompanyType(e.target.value),
                                                        className: fieldClass,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Pilih Jenis Perusahaan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1587,
                                                                columnNumber: 23
                                                            }, this),
                                                            COMPANY_TYPE_OPTIONS.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    children: x
                                                                }, x, false, {
                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                    lineNumber: 1589,
                                                                    columnNumber: 25
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1582,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1578,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Gelar Perusahaan ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1595,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1594,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: form.company_title,
                                                        onChange: (e)=>setCompanyTitle(e.target.value),
                                                        className: fieldClass,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Pilih Gelar Perusahaan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1602,
                                                                columnNumber: 23
                                                            }, this),
                                                            companyTitleOptions.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    children: x
                                                                }, x, false, {
                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                    lineNumber: 1604,
                                                                    columnNumber: 25
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1597,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1593,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Nama Perusahaan ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1610,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1609,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 gap-2 md:grid-cols-12",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                "data-tour": demoMode ? "customer-register-company-name-input" : undefined,
                                                                value: form.company_name_base,
                                                                onChange: (e)=>setCompanyNameBase(e.target.value),
                                                                className: `md:col-span-8 ${fieldClass}`,
                                                                placeholder: "Nama inti perusahaan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1613,
                                                                columnNumber: 23
                                                            }, this),
                                                            isSuffixEditable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: form.company_name_suffix,
                                                                onChange: (e)=>setCompanyNameSuffix(e.target.value),
                                                                className: `md:col-span-4 ${fieldClass}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Pilih Sebutan"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1630,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    currentSuffixOptions.map((suffix)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: suffix,
                                                                            children: suffix
                                                                        }, suffix, false, {
                                                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                            lineNumber: 1632,
                                                                            columnNumber: 29
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1625,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                value: form.company_name_suffix,
                                                                readOnly: true,
                                                                className: `md:col-span-4 ${readOnlyFieldClass}`,
                                                                placeholder: "Sebutan"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1638,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1612,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 font-semibold text-amber-900",
                                                        children: buildCompanyName(form.company_name_base, form.company_name_suffix) || "-"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1646,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1608,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Kebutuhan Produk ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1655,
                                                                columnNumber: 40
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1654,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: form.product_need,
                                                        onChange: (e)=>setField("product_need", e.target.value),
                                                        className: fieldClass,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "Pilih Kebutuhan Produk"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1662,
                                                                columnNumber: 23
                                                            }, this),
                                                            PRODUCT_NEED_OPTIONS.map((x)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    children: x
                                                                }, x, false, {
                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                    lineNumber: 1664,
                                                                    columnNumber: 25
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1657,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1653,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: "Cabang"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1669,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: getBranchLabel(branches, form.branch_id),
                                                        readOnly: true,
                                                        className: readOnlyFieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1672,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1668,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1577,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1573,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: sectionCardClass,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "mb-4 text-lg font-bold text-slate-900",
                                        children: "Alamat Perusahaan"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1682,
                                        columnNumber: 17
                                    }, this),
                                    !isLoadingWilayah && !isWilayahApiAvailable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800",
                                        children: "API wilayah tidak bisa diakses dari browser ini. Gunakan input manual."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1686,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-4 md:grid-cols-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Alamat Lengkap ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1694,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1693,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        rows: 3,
                                                        value: form.company_address,
                                                        onChange: (e)=>setField("company_address", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1696,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1692,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Provinsi ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1707,
                                                                columnNumber: 32
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1706,
                                                        columnNumber: 21
                                                    }, this),
                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: companyProvinceCode,
                                                        onChange: (e)=>void onCompanyProvinceChange(e.target.value),
                                                        className: fieldClass,
                                                        disabled: isLoadingWilayah,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: isLoadingWilayah ? "Memuat provinsi..." : "Pilih Provinsi"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1718,
                                                                columnNumber: 25
                                                            }, this),
                                                            provinces.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: p.code,
                                                                    children: p.name
                                                                }, p.code, false, {
                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                    lineNumber: 1724,
                                                                    columnNumber: 27
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1710,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.company_province,
                                                        onChange: (e)=>setField("company_province", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1730,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1705,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Kabupaten/Kota ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1741,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1740,
                                                        columnNumber: 21
                                                    }, this),
                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: companyRegencyCode,
                                                        onChange: (e)=>void onCompanyRegencyChange(e.target.value),
                                                        className: fieldClass,
                                                        disabled: !companyProvinceCode,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: companyProvinceCode ? "Pilih Kota/Kabupaten" : "Pilih provinsi terlebih dahulu"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1752,
                                                                columnNumber: 25
                                                            }, this),
                                                            companyRegencies.map((city)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: city.code,
                                                                    children: city.name
                                                                }, city.code, false, {
                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                    lineNumber: 1758,
                                                                    columnNumber: 27
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1744,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.company_city,
                                                        onChange: (e)=>setField("company_city", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1764,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1739,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Kecamatan ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1775,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1774,
                                                        columnNumber: 21
                                                    }, this),
                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: companyDistrictCode,
                                                        onChange: (e)=>void onCompanyDistrictChange(e.target.value),
                                                        className: fieldClass,
                                                        disabled: !companyRegencyCode,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: companyRegencyCode ? "Pilih Kecamatan" : "Pilih kota/kabupaten terlebih dahulu"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1788,
                                                                columnNumber: 25
                                                            }, this),
                                                            companyDistricts.map((district)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: district.code,
                                                                    children: district.name
                                                                }, district.code, false, {
                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                    lineNumber: 1794,
                                                                    columnNumber: 27
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1778,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.company_district,
                                                        onChange: (e)=>setField("company_district", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1800,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1773,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "mb-1 block text-sm font-semibold text-slate-700",
                                                        children: [
                                                            "Kelurahan ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1811,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1810,
                                                        columnNumber: 21
                                                    }, this),
                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: companyVillageCode,
                                                        onChange: (e)=>onCompanyVillageChange(e.target.value),
                                                        className: fieldClass,
                                                        disabled: !companyDistrictCode,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: companyDistrictCode ? "Pilih Kelurahan" : "Pilih kecamatan terlebih dahulu"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1820,
                                                                columnNumber: 25
                                                            }, this),
                                                            companyVillages.map((village)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: village.code,
                                                                    children: village.name
                                                                }, village.code, false, {
                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                    lineNumber: 1826,
                                                                    columnNumber: 27
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1814,
                                                        columnNumber: 23
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        value: form.company_village,
                                                        onChange: (e)=>setField("company_village", e.target.value),
                                                        className: fieldClass
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1832,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1809,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1691,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1681,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: sectionCardClass,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-bold text-slate-900",
                                                    children: "Alamat Pengiriman"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                    lineNumber: 1847,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 text-xs text-slate-500",
                                                    children: [
                                                        "Data aktif untuk pengiriman:",
                                                        " ",
                                                        form.shipping_addresses.length,
                                                        " alamat"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                    lineNumber: 1850,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                            lineNumber: 1846,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1845,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-4",
                                        children: form.shipping_addresses.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "rounded-2xl border border-slate-200 bg-slate-50 p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mb-3 flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm font-semibold text-slate-900",
                                                                children: [
                                                                    "Alamat Pengiriman ",
                                                                    i + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1863,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "inline-flex items-center gap-2 text-xs text-slate-700",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: Boolean(sameAsCompanyAddressItems[i]),
                                                                                onChange: (e)=>toggleSameAsCompanyAddressItem(i, e.target.checked),
                                                                                className: checkboxClass
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                lineNumber: 1868,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            "Sama dengan alamat perusahaan"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1867,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "inline-flex items-center gap-1 text-xs text-slate-700",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: Boolean(s.is_default),
                                                                                onChange: ()=>setDefaultShip(i),
                                                                                className: checkboxClass
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                lineNumber: 1882,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            "Default"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1881,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>removeShip(i),
                                                                        className: "rounded-lg p-1.5 text-red-600 transition hover:bg-red-100",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTrash"], {
                                                                            className: "w-3 h-3"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                            lineNumber: 1894,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1890,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1866,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1862,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 gap-3 md:grid-cols-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Label Alamat"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1900,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: s.label || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                label: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1903,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1899,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Tipe Alamat"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1913,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: s.type || "Shipping",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                type: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i]),
                                                                        children: ADDRESS_TYPE_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: option,
                                                                                children: option
                                                                            }, option, false, {
                                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                lineNumber: 1925,
                                                                                columnNumber: 33
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1916,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1912,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Nama Penanggung Jawab"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1932,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: s.pic_name || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                pic_name: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1935,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1931,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "No HP Penanggung Jawab"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1945,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: s.pic_phone || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                pic_phone: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1948,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1944,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "md:col-span-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Alamat Lengkap"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1958,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                        rows: 2,
                                                                        value: s.address || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                address: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1961,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1957,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Provinsi"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1973,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: shippingAreaStates[i]?.provinceCode || "",
                                                                        onChange: (e)=>void onShippingProvinceChange(i, e.target.value),
                                                                        className: fieldClass,
                                                                        disabled: isLoadingWilayah || Boolean(sameAsCompanyAddressItems[i]),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: isLoadingWilayah ? "Memuat provinsi..." : "Pilih Provinsi"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                lineNumber: 1993,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            provinces.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: p.code,
                                                                                    children: p.name
                                                                                }, p.code, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                    lineNumber: 1999,
                                                                                    columnNumber: 35
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 1977,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: s.province || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                province: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2005,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 1972,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Kabupaten/Kota"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2016,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: shippingAreaStates[i]?.regencyCode || "",
                                                                        onChange: (e)=>void onShippingRegencyChange(i, e.target.value),
                                                                        className: fieldClass,
                                                                        disabled: !shippingAreaStates[i]?.provinceCode || Boolean(sameAsCompanyAddressItems[i]),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: shippingAreaStates[i]?.provinceCode ? "Pilih Kota/Kabupaten" : "Pilih provinsi terlebih dahulu"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                lineNumber: 2034,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            (shippingAreaStates[i]?.regencies || []).map((city)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: city.code,
                                                                                    children: city.name
                                                                                }, city.code, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                    lineNumber: 2041,
                                                                                    columnNumber: 37
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2020,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: s.city || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                city: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2048,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 2015,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Kecamatan"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2059,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: shippingAreaStates[i]?.districtCode || "",
                                                                        onChange: (e)=>void onShippingDistrictChange(i, e.target.value),
                                                                        className: fieldClass,
                                                                        disabled: !shippingAreaStates[i]?.regencyCode || Boolean(sameAsCompanyAddressItems[i]),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: shippingAreaStates[i]?.regencyCode ? "Pilih Kecamatan" : "Pilih kota/kabupaten terlebih dahulu"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                lineNumber: 2074,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            (shippingAreaStates[i]?.districts || []).map((district)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: district.code,
                                                                                    children: district.name
                                                                                }, district.code, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                    lineNumber: 2081,
                                                                                    columnNumber: 37
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2063,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: s.district || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                district: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2091,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 2058,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "mb-1 block text-xs font-semibold text-slate-600",
                                                                        children: "Kelurahan"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2102,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    isWilayahApiAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: shippingAreaStates[i]?.villageCode || "",
                                                                        onChange: (e)=>onShippingVillageChange(i, e.target.value),
                                                                        className: fieldClass,
                                                                        disabled: !shippingAreaStates[i]?.districtCode || Boolean(sameAsCompanyAddressItems[i]),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "",
                                                                                children: shippingAreaStates[i]?.districtCode ? "Pilih Kelurahan" : "Pilih kecamatan terlebih dahulu"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                lineNumber: 2117,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            (shippingAreaStates[i]?.villages || []).map((village)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                    value: village.code,
                                                                                    children: village.name
                                                                                }, village.code, false, {
                                                                                    fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                                    lineNumber: 2124,
                                                                                    columnNumber: 37
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2106,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        value: s.village || "",
                                                                        onChange: (e)=>updateShip(i, {
                                                                                village: e.target.value
                                                                            }),
                                                                        className: fieldClass,
                                                                        disabled: Boolean(sameAsCompanyAddressItems[i])
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                        lineNumber: 2134,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                                lineNumber: 2101,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                        lineNumber: 1898,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, `${s.id || "new"}-${i}`, true, {
                                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                                lineNumber: 1858,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                        lineNumber: 1856,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 1844,
                                columnNumber: 15
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 2151,
                                columnNumber: 17
                            }, this),
                            hasChanges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700",
                                children: "Ada perubahan yang belum disimpan"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 2156,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                        lineNumber: 1391,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                disabled: isSaving,
                                className: "rounded-xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-300 disabled:opacity-50",
                                children: "Batal"
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 2163,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                "data-tour": demoMode ? "customer-register-save-edit-button" : undefined,
                                whileHover: !isSaving ? {
                                    scale: 1.02
                                } : {},
                                whileTap: !isSaving ? {
                                    scale: 0.98
                                } : {},
                                onClick: handleSave,
                                disabled: isSaving || !hasChanges || isLoading,
                                className: "flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 font-medium text-white disabled:opacity-50",
                                children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                            lineNumber: 2182,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Menyimpan..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                            lineNumber: 2183,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSave"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                            lineNumber: 2187,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Simpan Perubahan"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                            lineNumber: 2188,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                                lineNumber: 2170,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                        lineNumber: 2162,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
                lineNumber: 1359,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
            lineNumber: 1353,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/customers/registration/EditRegistrationModal.tsx",
        lineNumber: 1351,
        columnNumber: 5
    }, this);
}
_s(EditRegistrationModal, "B3LIm8EGGwH6YG55eL4soVJs8t0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = EditRegistrationModal;
var _c;
__turbopack_context__.k.register(_c, "EditRegistrationModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_customers_registration_EditRegistrationModal_tsx_0e09214a._.js.map