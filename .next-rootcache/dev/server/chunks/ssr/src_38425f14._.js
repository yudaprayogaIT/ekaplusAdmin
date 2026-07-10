module.exports = [
"[project]/src/utils/fetchAllQueryRows.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAllQueryRows",
    ()=>fetchAllQueryRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-ssr] (ecmascript)");
"use client";
;
const DEFAULT_PAGE_SIZE = 20;
async function fetchAllQueryRows({ endpoint, spec, token, requestInit, errorMessage }) {
    const rows = [];
    let page = 1;
    while(true){
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(endpoint, {
            ...spec,
            page
        }), {
            method: "GET",
            cache: "no-store",
            ...requestInit
        }, token);
        if (!response.ok) {
            throw new Error(errorMessage || `Failed to fetch ${endpoint} (${response.status})`);
        }
        const json = await response.json();
        const pageRows = Array.isArray(json?.data) ? json.data : [];
        rows.push(...pageRows);
        const perPage = Number(json?.meta?.per_page || DEFAULT_PAGE_SIZE);
        if (pageRows.length < perPage || pageRows.length === 0) {
            break;
        }
        page += 1;
    }
    return rows;
}
}),
"[project]/src/utils/paymentAccount.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchBranchConnectionInfo",
    ()=>fetchBranchConnectionInfo,
    "fetchBranchErpResourcePage",
    ()=>fetchBranchErpResourcePage,
    "fetchBranchIdFromBranchCustomer",
    ()=>fetchBranchIdFromBranchCustomer,
    "fetchPaymentAccountInfo",
    ()=>fetchPaymentAccountInfo,
    "getTaxStatusLabel",
    ()=>getTaxStatusLabel,
    "resolveBranchConnectionInfo",
    ()=>resolveBranchConnectionInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-ssr] (ecmascript)");
;
function toNumber(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
        const parsed = Number.parseInt(value, 10);
        if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
}
function getTaxStatusLabel(value) {
    return Number(value || 0) === 1 ? "PKP" : "Non PKP";
}
async function fetchBranchConnectionInfo(branchId, authToken) {
    if (!branchId || !authToken) return null;
    const spec = {
        fields: [
            "id",
            "url",
            "token",
            "branch_name",
            "city"
        ],
        filters: [
            [
                "id",
                "=",
                branchId
            ]
        ],
        limit: 1
    };
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH, spec), {
        method: "GET",
        cache: "no-store"
    }, authToken);
    if (!response.ok) {
        throw new Error(`Failed to fetch branch connection (${response.status})`);
    }
    const json = await response.json();
    const row = Array.isArray(json?.data) ? json.data[0] : null;
    const id = toNumber(row?.id);
    if (!row || !id) return null;
    return {
        id,
        url: row.url || undefined,
        token: row.token || undefined,
        branch_name: row.branch_name || undefined,
        city: row.city || undefined
    };
}
async function fetchBranchIdFromBranchCustomer(branchCustomerId, authToken) {
    if (!branchCustomerId || !authToken) return null;
    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2, branchCustomerId), {
        method: "GET",
        cache: "no-store"
    }, authToken);
    if (!response.ok) {
        throw new Error(`Failed to fetch branch customer connection (${response.status})`);
    }
    const json = await response.json();
    const row = json?.data ?? null;
    const branchValue = row?.branch && typeof row.branch === "object" ? row.branch.id : row?.branch;
    return toNumber(branchValue) ?? null;
}
async function resolveBranchConnectionInfo(params) {
    const branchId = params.branchId || 0;
    const registrationId = toNumber(params.registrationId);
    const authToken = params.authToken || "";
    if (!branchId && !registrationId || !authToken) return null;
    const resolvedBranchId = (registrationId ? await fetchBranchIdFromBranchCustomer(registrationId, authToken) : null) || branchId;
    if (!resolvedBranchId) return null;
    return fetchBranchConnectionInfo(resolvedBranchId, authToken);
}
async function fetchBranchErpResourcePage(params) {
    const branch = await resolveBranchConnectionInfo(params);
    if (!branch?.url || !branch.token) return [];
    const resourcePath = params.resource.startsWith("/") ? params.resource : `/api/resource/${params.resource}`;
    const url = new URL(resourcePath, branch.url);
    url.searchParams.set("fields", JSON.stringify(params.fields));
    url.searchParams.set("limit_page_length", String(params.limit || 20));
    url.searchParams.set("limit_start", String(params.start || 0));
    if (params.filters?.length) {
        url.searchParams.set("filters", JSON.stringify(params.filters));
    }
    const response = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
            Authorization: `token ${branch.token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${params.resource} (${response.status})`);
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
}
async function fetchPaymentAccountInfo(params) {
    const paymentAccount = (params.paymentAccount || "").trim();
    if (!paymentAccount) return null;
    const rows = await fetchBranchErpResourcePage({
        ...params,
        resource: "Rekening",
        fields: [
            "name",
            "nomor_rekening",
            "nama_rekening",
            "bank"
        ],
        limit: 1,
        start: 0,
        filters: [
            [
                "name",
                "=",
                paymentAccount
            ]
        ]
    });
    const row = rows.find((item)=>(item?.name || "").trim() === paymentAccount) || null;
    if (!row?.name) return null;
    return {
        name: row.name,
        nomor_rekening: row.nomor_rekening || undefined,
        nama_rekening: row.nama_rekening || undefined,
        bank: row.bank || undefined
    };
}
}),
"[project]/src/utils/filterUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/utils/filterUtils.ts
__turbopack_context__.s([
    "deletePreset",
    ()=>deletePreset,
    "filtersToUrlParam",
    ()=>filtersToUrlParam,
    "generateFilterId",
    ()=>generateFilterId,
    "loadFiltersFromStorage",
    ()=>loadFiltersFromStorage,
    "loadPresets",
    ()=>loadPresets,
    "saveFiltersToStorage",
    ()=>saveFiltersToStorage,
    "savePreset",
    ()=>savePreset,
    "stateToTriple",
    ()=>stateToTriple,
    "tripleToState",
    ()=>tripleToState,
    "urlParamToFilters",
    ()=>urlParamToFilters
]);
function stateToTriple(filters) {
    const result = [];
    filters.forEach((f)=>{
        // Validate filter has required data
        const isValid = (()=>{
            // For "is" and "is not" operators, we don't need a value
            if (f.operator === "is" || f.operator === "is not") {
                return f.field && f.operator;
            }
            // For "between" operator, need both values in array
            if (f.operator === "between") {
                return f.field && Array.isArray(f.value) && f.value[0] && f.value[1];
            }
            // For other operators, we need field, operator, and value
            return f.field && f.operator && f.value !== undefined && f.value !== "";
        })();
        if (!isValid) return;
        // Convert filter to Goback triple(s)
        if (f.operator === "is" || f.operator === "is not") {
            // For image field, map to explicit null checks to match API expectation
            if (f.field === "image") {
                const desired = typeof f.value === "string" ? f.value : "set";
                const op = desired === "not set" ? "=" : "!=";
                result.push([
                    f.field,
                    op,
                    "null"
                ]);
            } else {
                // For other fields, use Goback convention
                // "is" -> ["field", "is", "set"]
                // "is not" -> ["field", "is", "not set"]
                const value = f.operator === "is" ? "set" : "not set";
                result.push([
                    f.field,
                    "is",
                    value
                ]);
            }
        } else if (f.operator === "between") {
            // Goback doesn't support "between" operator
            // Convert to two separate filters: >= and <=
            const [startDate, endDate] = f.value;
            result.push([
                f.field,
                ">=",
                startDate
            ]);
            result.push([
                f.field,
                "<=",
                endDate
            ]);
        } else {
            // Standard filter
            result.push([
                f.field,
                f.operator,
                f.value
            ]);
        }
    });
    return result;
}
function tripleToState(triples) {
    return triples.map((triple, idx)=>{
        const [field, operator, value] = triple;
        if (field === "image" && value === "null") {
            if (operator === "=") {
                return {
                    id: `filter-${idx}-${Date.now()}`,
                    field,
                    operator: "is",
                    value: "not set"
                };
            }
            if (operator === "!=") {
                return {
                    id: `filter-${idx}-${Date.now()}`,
                    field,
                    operator: "is",
                    value: "set"
                };
            }
        }
        return {
            id: `filter-${idx}-${Date.now()}`,
            field,
            operator,
            value
        };
    });
}
// Helper: Unicode-safe base64 encode
function base64Encode(str) {
    // Convert string to UTF-8 bytes then to base64
    const utf8Bytes = new TextEncoder().encode(str);
    const binaryString = Array.from(utf8Bytes, (byte)=>String.fromCharCode(byte)).join("");
    return btoa(binaryString);
}
// Helper: Unicode-safe base64 decode
function base64Decode(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for(let i = 0; i < binaryString.length; i++){
        bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}
function filtersToUrlParam(filters) {
    try {
        const jsonString = JSON.stringify(filters);
        return base64Encode(jsonString);
    } catch  {
        return "";
    }
}
function urlParamToFilters(param) {
    if (!param) return [];
    try {
        // Try base64 decode first
        const jsonString = base64Decode(param);
        return JSON.parse(jsonString);
    } catch  {
        // Fallback to legacy URL encoded format
        try {
            return JSON.parse(decodeURIComponent(param));
        } catch  {
            return [];
        }
    }
}
function saveFiltersToStorage(entity, filters) {
    const key = `filter_${entity}_last`;
    localStorage.setItem(key, JSON.stringify(filters));
}
function loadFiltersFromStorage(entity) {
    const key = `filter_${entity}_last`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch  {
        return [];
    }
}
function savePreset(preset) {
    const key = `filter_preset_${preset.entity}`;
    const existing = loadPresets(preset.entity);
    existing.push(preset);
    localStorage.setItem(key, JSON.stringify(existing));
}
function loadPresets(entity) {
    const key = `filter_preset_${entity}`;
    const stored = localStorage.getItem(key);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch  {
        return [];
    }
}
function deletePreset(entity, presetId) {
    const presets = loadPresets(entity).filter((p)=>p.id !== presetId);
    const key = `filter_preset_${entity}`;
    localStorage.setItem(key, JSON.stringify(presets));
}
function generateFilterId() {
    return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
}),
"[project]/src/types/customerRegistration.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "REJECTION_REASONS",
    ()=>REJECTION_REASONS
]);
const REJECTION_REASONS = [
    {
        code: "incomplete_data",
        label: "Data tidak lengkap"
    },
    {
        code: "invalid_document",
        label: "Dokumen tidak valid"
    },
    {
        code: "fake_customer",
        label: "Customer siluman/iseng"
    },
    {
        code: "duplicate_customer",
        label: "Customer sudah terdaftar"
    },
    {
        code: "other",
        label: "Lainnya"
    }
];
}),
"[project]/src/hooks/useFilters.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFilters",
    ()=>useFilters
]);
// src/hooks/useFilters.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$filterUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/filterUtils.ts [app-ssr] (ecmascript)");
;
;
function useFilters(options) {
    const { entity, onFiltersChange, initialFilters } = options;
    // Initialize with initialFilters if provided to avoid timing issues on page refresh
    const [filters, setFiltersInternal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialFilters || []);
    const [initialized, setInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const onFiltersChangeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onFiltersChange);
    // // Debug logging
    // useEffect(() => {
    //   console.log(`[useFilters:${entity}] 🔍 Initialized:`, initialized);
    //   console.log(`[useFilters:${entity}] 🔍 Initial filters:`, initialFilters);
    //   console.log(`[useFilters:${entity}] 🔍 Current filters:`, filters);
    // }, [entity, initialized, initialFilters, filters]);
    // Update ref when callback changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        onFiltersChangeRef.current = onFiltersChange;
    }, [
        onFiltersChange
    ]);
    // Initialize filters from initialFilters, URL params, or localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        let loadedFilters;
        // Check URL params (legacy support)
        const urlParams = undefined;
        const filterParam = undefined;
    // DON'T call onFiltersChange here to avoid infinite loop
    // onFiltersChange should only be called when user explicitly applies filters
    }, [
        entity,
        initialized,
        initialFilters
    ]);
    // Update URL params when filters change
    const setFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newFilters)=>{
        setFiltersInternal(newFilters);
        // Save to localStorage
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$filterUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveFiltersToStorage"])(entity, newFilters);
        // Update URL params
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Call onFiltersChange callback using ref
        if (onFiltersChangeRef.current) {
            onFiltersChangeRef.current(newFilters);
        }
    }, [
        entity
    ]);
    // Clear all filters
    const clearFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setFilters([]);
    }, [
        setFilters
    ]);
    // Check if there are active filters
    const hasActiveFilters = filters.length > 0;
    return {
        filters,
        setFilters,
        clearFilters,
        hasActiveFilters
    };
}
}),
"[project]/src/config/filterFields.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/config/filterFields.ts
__turbopack_context__.s([
    "BRANCH_CUSTOMER_FILTER_FIELDS",
    ()=>BRANCH_CUSTOMER_FILTER_FIELDS,
    "BRANCH_FILTER_FIELDS",
    ()=>BRANCH_FILTER_FIELDS,
    "CATEGORY_FILTER_FIELDS",
    ()=>CATEGORY_FILTER_FIELDS,
    "CUSTOMER_REGISTER_FILTER_FIELDS",
    ()=>CUSTOMER_REGISTER_FILTER_FIELDS,
    "GROUP_CUSTOMER_FILTER_FIELDS",
    ()=>GROUP_CUSTOMER_FILTER_FIELDS,
    "GROUP_PARENT_FILTER_FIELDS",
    ()=>GROUP_PARENT_FILTER_FIELDS,
    "ITEM_FILTER_FIELDS",
    ()=>ITEM_FILTER_FIELDS,
    "PRODUCT_FILTER_FIELDS",
    ()=>PRODUCT_FILTER_FIELDS,
    "USER_FILTER_FIELDS",
    ()=>USER_FILTER_FIELDS,
    "VARIANT_FILTER_FIELDS",
    ()=>VARIANT_FILTER_FIELDS,
    "WISHLIST_FILTER_FIELDS",
    ()=>WISHLIST_FILTER_FIELDS
]);
const PRODUCT_FILTER_FIELDS = {
    entity: "product",
    fields: [
        {
            field: "product_name",
            label: "Product Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "item_category",
            label: "Category",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "category"
        },
        {
            field: "hot_deals",
            label: "Hot Deals",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 1,
                    label: "Yes"
                },
                {
                    value: 0,
                    label: "No"
                }
            ]
        },
        {
            field: "disabled",
            label: "Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Enabled"
                },
                {
                    value: 1,
                    label: "Disabled"
                }
            ]
        },
        {
            field: "variants",
            label: "Has Variants",
            type: "relation",
            operators: [
                "is",
                "is not"
            ]
        },
        // Audit Trail filters
        {
            field: "created_by",
            label: "Created By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "created_at",
            label: "Created Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        },
        {
            field: "updated_by",
            label: "Updated By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "updated_at",
            label: "Updated Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        }
    ]
};
const ITEM_FILTER_FIELDS = {
    entity: "item",
    fields: [
        {
            field: "item_name",
            label: "Item Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "item_code",
            label: "Item Code",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "item_category",
            label: "Category",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "item_group",
            label: "Item Group",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "ekatalog_type",
            label: "Type",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "item_color",
            label: "Color",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "image",
            label: "Image",
            type: "string",
            operators: [
                "is"
            ]
        },
        {
            field: "disabled",
            label: "Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Enabled"
                },
                {
                    value: 1,
                    label: "Disabled"
                }
            ]
        },
        // Audit Trail filters
        {
            field: "created_by",
            label: "Created By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "created_at",
            label: "Created Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        },
        {
            field: "updated_by",
            label: "Updated By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "updated_at",
            label: "Updated Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        }
    ]
};
const VARIANT_FILTER_FIELDS = {
    entity: "variant",
    fields: [
        {
            field: "name",
            label: "Variant Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "item",
            label: "Item",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "item"
        },
        {
            field: "parent_id",
            label: "Product",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "product"
        },
        {
            field: "item_category",
            label: "Category",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "category"
        },
        {
            field: "idx",
            label: "Display Order",
            type: "number",
            operators: [
                "=",
                "!=",
                ">",
                ">=",
                "<",
                "<="
            ]
        },
        // Audit Trail filters
        {
            field: "created_by",
            label: "Created By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "created_at",
            label: "Created Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        },
        {
            field: "updated_by",
            label: "Updated By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "updated_at",
            label: "Updated Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        }
    ]
};
const USER_FILTER_FIELDS = {
    entity: "user",
    fields: [
        {
            field: "full_name",
            label: "Full Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "username",
            label: "Username",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "email",
            label: "Email",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "phone",
            label: "Phone",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "role",
            label: "Role",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "status",
            label: "Status",
            type: "select",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            options: [
                {
                    value: "active",
                    label: "Active"
                },
                {
                    value: "inactive",
                    label: "Inactive"
                },
                {
                    value: "pending",
                    label: "Pending"
                },
                {
                    value: "suspended",
                    label: "Suspended"
                }
            ]
        },
        {
            field: "is_email_verified",
            label: "Email Verified",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: true,
                    label: "Yes"
                },
                {
                    value: false,
                    label: "No"
                }
            ]
        },
        {
            field: "is_phone_verified",
            label: "Phone Verified",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: true,
                    label: "Yes"
                },
                {
                    value: false,
                    label: "No"
                }
            ]
        }
    ]
};
const CATEGORY_FILTER_FIELDS = {
    entity: "category",
    fields: [
        {
            field: "category_name",
            label: "Category Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "disabled",
            label: "Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Enabled"
                },
                {
                    value: 1,
                    label: "Disabled"
                }
            ]
        }
    ]
};
const BRANCH_FILTER_FIELDS = {
    entity: "branch",
    fields: [
        {
            field: "branch_name",
            label: "Branch Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "area",
            label: "Area",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "island",
            label: "Island",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "kota",
            label: "City",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "disabled",
            label: "Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Enabled"
                },
                {
                    value: 1,
                    label: "Disabled"
                }
            ]
        }
    ]
};
const WISHLIST_FILTER_FIELDS = {
    entity: "wishlist",
    fields: [
        {
            field: "name",
            label: "Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "item",
            label: "Item",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "item"
        },
        {
            field: "user_id",
            label: "User",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "user"
        },
        {
            field: "status",
            label: "Status",
            type: "select",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            options: [
                {
                    value: "Draft",
                    label: "Draft"
                },
                {
                    value: "Submitted",
                    label: "Submitted"
                },
                {
                    value: "Approved",
                    label: "Approved"
                },
                {
                    value: "Cancelled",
                    label: "Cancelled"
                }
            ]
        },
        {
            field: "docstatus",
            label: "Document Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Draft"
                },
                {
                    value: 1,
                    label: "Submitted"
                },
                {
                    value: 2,
                    label: "Cancelled"
                }
            ]
        }
    ]
};
const CUSTOMER_REGISTER_FILTER_FIELDS = {
    entity: "customer_register",
    fields: [
        {
            field: "owner_full_name",
            label: "Owner Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "owner_phone",
            label: "Owner Phone",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "owner_email",
            label: "Owner Email",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "company_name",
            label: "Company Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "company_title",
            label: "Company Title",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "company_type",
            label: "Business Type",
            type: "select",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            options: [
                {
                    value: "Company",
                    label: "Company"
                },
                {
                    value: "Individual",
                    label: "Individual"
                }
            ]
        },
        {
            field: "product_need",
            label: "Product Need",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "branch_id",
            label: "Branch",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "branch"
        },
        {
            field: "company_city",
            label: "City",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "company_province",
            label: "Province",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "status",
            label: "Status",
            type: "select",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            options: [
                {
                    value: "Draft",
                    label: "Draft"
                },
                {
                    value: "Pending",
                    label: "Pending"
                },
                {
                    value: "Approved",
                    label: "Approved"
                },
                {
                    value: "Rejected",
                    label: "Rejected"
                }
            ]
        },
        {
            field: "docstatus",
            label: "Document Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Draft"
                },
                {
                    value: 1,
                    label: "Submitted"
                },
                {
                    value: 2,
                    label: "Cancelled"
                }
            ]
        },
        // Audit Trail filters
        {
            field: "created_at",
            label: "Created Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        },
        {
            field: "updated_at",
            label: "Updated Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        }
    ]
};
const GROUP_PARENT_FILTER_FIELDS = {
    entity: "ekatalog_group_parent",
    fields: [
        {
            field: "name",
            label: "GP Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "disabled",
            label: "Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Enabled"
                },
                {
                    value: 1,
                    label: "Disabled"
                }
            ]
        },
        // Audit Trail filters
        {
            field: "created_by",
            label: "Created By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "created_at",
            label: "Created Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        },
        {
            field: "updated_by",
            label: "Updated By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "updated_at",
            label: "Updated Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        }
    ]
};
const GROUP_CUSTOMER_FILTER_FIELDS = {
    entity: "ekatalog_group_customer",
    fields: [
        {
            field: "name",
            label: "GC Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "gp_id",
            label: "Group Parent",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "ekatalog_group_parent"
        },
        {
            field: "disabled",
            label: "Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Enabled"
                },
                {
                    value: 1,
                    label: "Disabled"
                }
            ]
        },
        // Audit Trail filters
        {
            field: "created_by",
            label: "Created By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "created_at",
            label: "Created Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        },
        {
            field: "updated_by",
            label: "Updated By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "updated_at",
            label: "Updated Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        }
    ]
};
const BRANCH_CUSTOMER_FILTER_FIELDS = {
    entity: "ekatalog_branch_customer",
    fields: [
        {
            field: "name",
            label: "BC Name",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "gc_id",
            label: "Group Customer",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "ekatalog_group_customer"
        },
        {
            field: "branch_id",
            label: "Branch",
            type: "relation",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ],
            relationEntity: "branch"
        },
        {
            field: "branch_city",
            label: "Branch City",
            type: "string",
            operators: [
                "=",
                "!=",
                "like",
                "not like"
            ]
        },
        {
            field: "disabled",
            label: "Status",
            type: "select",
            operators: [
                "="
            ],
            options: [
                {
                    value: 0,
                    label: "Enabled"
                },
                {
                    value: 1,
                    label: "Disabled"
                }
            ]
        },
        // Audit Trail filters
        {
            field: "created_by",
            label: "Created By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "created_at",
            label: "Created Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        },
        {
            field: "updated_by",
            label: "Updated By (User ID)",
            type: "number",
            operators: [
                "=",
                "!=",
                "in",
                "not in"
            ]
        },
        {
            field: "updated_at",
            label: "Updated Date",
            type: "date",
            operators: [
                "=",
                ">",
                ">=",
                "<",
                "<=",
                "between"
            ]
        }
    ]
};
}),
"[project]/src/lib/customerRegistrationApproveTour.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CUSTOMER_REGISTRATION_APPROVE_TOUR_ID",
    ()=>CUSTOMER_REGISTRATION_APPROVE_TOUR_ID,
    "consumePendingCustomerRegistrationApproveTour",
    ()=>consumePendingCustomerRegistrationApproveTour,
    "customerRegistrationApproveTourDummy",
    ()=>customerRegistrationApproveTourDummy,
    "setPendingCustomerRegistrationApproveTour",
    ()=>setPendingCustomerRegistrationApproveTour
]);
"use client";
const CUSTOMER_REGISTRATION_APPROVE_TOUR_PENDING_KEY = "ekaplus-customer-registration-approve-tour-pending";
const CUSTOMER_REGISTRATION_APPROVE_TOUR_ID = "tour-registration-001";
const customerRegistrationApproveTourDummy = {
    id: CUSTOMER_REGISTRATION_APPROVE_TOUR_ID,
    registration_number: "REG-TOUR-001",
    source: "tour",
    ekaplus_user: {
        id: 99001,
        full_name: "Demo Tour User",
        email: "demo.tour@ekaplus.test"
    },
    user: {
        user_id: 99001,
        full_name: "Jaka Tarub",
        phone: "081234567890",
        email: "jaka.tarub@example.com",
        date_of_birth: "1988-04-17",
        place_of_birth: "Surabaya"
    },
    company: {
        company_type: "Company",
        company_title: "Toko",
        business_type: "Company - Toko",
        name: "TOKO DEMO SEJAHTERA ABADI TK",
        nik: "-",
        npwp: "012345678-901000",
        tax_status: 1,
        tax_status_label: "PKP",
        branch_id: 77,
        branch_name: "Ekatunggal Branch",
        branch_city: "Surabaya",
        product_need: "Furniture"
    },
    address: {
        full_address: "Jl. Raya Industri No. 88, Rungkut",
        province_name: "Jawa Timur",
        city_name: "Surabaya",
        district_name: "Rungkut",
        village_name: "Kali Rungkut",
        rt: "-",
        rw: "-",
        postal_code: "60293"
    },
    support_data: {
        contact_person: "Budi Santoso",
        company_email: "sales@demosejahtera.co.id",
        payment_method: "Transfer",
        payment_account: "BCA",
        more_information: "Data ini dipakai khusus untuk simulasi tour approval.",
        sales_team: "Surabaya Team",
        erp_customer_group: "DISTRIBUTOR"
    },
    branch_owner: {
        full_name: "Rina Wulandari",
        phone: "081298765432",
        email: "rina.wulandari@example.com",
        place_of_birth: "Malang",
        date_of_birth: "1990-09-22"
    },
    master_links: {
        nb_manual: "EKA TOUR",
        gp_manual: "DEMO SEJAHTERA GROUP"
    },
    same_as_company_address: false,
    shipping_addresses: [
        {
            id: 1,
            label: "Gudang Utama",
            address: "Jl. Margomulyo Pergudangan Blok A-12",
            city: "Surabaya",
            province: "Jawa Timur",
            district: "Tandes",
            village: "Balongsari",
            postal_code: "60186",
            pic_name: "Rina Wulandari",
            pic_phone: "081298765432",
            is_default: 1,
            parent_id: 1
        }
    ],
    documents: {},
    status: "request",
    docstatus: 0,
    submission_date: "2026-07-08T08:00:00.000Z",
    created_at: "2026-07-08T08:00:00.000Z",
    created_by_id: 99001,
    created_by: "Demo Tour User",
    updated_at: "2026-07-08T08:00:00.000Z",
    updated_by_id: 99001,
    updated_by: "Demo Tour User"
};
function setPendingCustomerRegistrationApproveTour() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function consumePendingCustomerRegistrationApproveTour() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const value = undefined;
}
}),
"[project]/src/lib/driverTour.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createDriverTour",
    ()=>createDriverTour,
    "waitForElement",
    ()=>waitForElement,
    "waitForElementToDisappear",
    ()=>waitForElementToDisappear
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$driver$2e$js$2f$dist$2f$driver$2e$js$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/driver.js/dist/driver.js.mjs [app-ssr] (ecmascript)");
"use client";
;
function createDriverTour(config) {
    const customOnPopoverRender = config?.onPopoverRender;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$driver$2e$js$2f$dist$2f$driver$2e$js$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["driver"])({
        animate: true,
        allowClose: true,
        allowKeyboardControl: true,
        overlayOpacity: 0.42,
        smoothScroll: true,
        stagePadding: 10,
        stageRadius: 18,
        showProgress: true,
        nextBtnText: "Lanjut",
        prevBtnText: "Sebelumnya",
        doneBtnText: "Selesai",
        popoverClass: "app-driver-popover",
        onPopoverRender: (popover, opts)=>{
            popover.closeButton.textContent = "Lewati";
            popover.closeButton.setAttribute("aria-label", "Lewati tour");
            popover.closeButton.classList.add("app-driver-skip-btn");
            customOnPopoverRender?.(popover, opts);
        },
        ...config
    });
}
async function waitForElement(selector, { timeout = 4000, interval = 100 } = {}) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const startedAt = undefined;
}
async function waitForElementToDisappear(selector, { timeout = 4000, interval = 100 } = {}) {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const startedAt = undefined;
}
}),
];

//# sourceMappingURL=src_38425f14._.js.map