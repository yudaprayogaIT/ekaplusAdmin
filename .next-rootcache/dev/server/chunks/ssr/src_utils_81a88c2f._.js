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
];

//# sourceMappingURL=src_utils_81a88c2f._.js.map