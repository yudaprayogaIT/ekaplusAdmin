(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/group_parent/GPDetailModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GPDetailModal",
    ()=>GPDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function toNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number.parseInt(value, 10);
        if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
}
function formatCurrency(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value);
}
function formatDays(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return `${value} hari`;
}
function formatDateTime(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short"
    });
}
function resolveUserName(directName, value) {
    if (directName) return directName;
    if (value && typeof value === "object" && value.full_name) {
        return value.full_name;
    }
    return undefined;
}
function parseNullableInt(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseInt(trimmed, 10);
    return Number.isFinite(parsed) ? parsed : null;
}
function parseNullableFloat(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number.parseFloat(trimmed.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
}
function GPDetailModal({ isOpen, onClose, gp, onGPUpdate, onViewNB, onViewGC, onViewBC }) {
    _s();
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("hierarchy");
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editedName, setEditedName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedDescription, setEditedDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedCreditLimitActive, setEditedCreditLimitActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [editedCreditLimit, setEditedCreditLimit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedPaymentTermActive, setEditedPaymentTermActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [editedPaymentTerm, setEditedPaymentTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedLimitCustomerOverdueActive, setEditedLimitCustomerOverdueActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [editedLimitCustomerOverdue, setEditedLimitCustomerOverdue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loadingChildren, setLoadingChildren] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [childGCs, setChildGCs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [childBCs, setChildBCs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hierarchyGp, setHierarchyGp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [linkedNB, setLinkedNB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activityUsers, setActivityUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const syncEditState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GPDetailModal.useCallback[syncEditState]": (source)=>{
            setEditedName(source.name);
            setEditedDescription(source.description || "");
            setEditedCreditLimitActive(Number(source.credit_limit_active || 0));
            setEditedCreditLimit(source.credit_limit === null || source.credit_limit === undefined ? "" : String(source.credit_limit));
            setEditedPaymentTermActive(Number(source.payment_term_active || 0));
            setEditedPaymentTerm(source.payment_term === null || source.payment_term === undefined ? "" : String(source.payment_term));
            setEditedLimitCustomerOverdueActive(Number(source.limit_customer_overdue_active || 0));
            setEditedLimitCustomerOverdue(source.limit_customer_overdue === null || source.limit_customer_overdue === undefined ? "" : String(source.limit_customer_overdue));
        }
    }["GPDetailModal.useCallback[syncEditState]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GPDetailModal.useEffect": ()=>{
            if (isOpen && gp) {
                setActiveTab("hierarchy");
                setIsEditMode(false);
                syncEditState(gp);
            }
        }
    }["GPDetailModal.useEffect"], [
        gp,
        isOpen,
        syncEditState
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GPDetailModal.useEffect": ()=>{
            if (!isOpen) return;
            const handleKeyDown = {
                "GPDetailModal.useEffect.handleKeyDown": (event)=>{
                    if (event.key === "Escape") onClose();
                }
            }["GPDetailModal.useEffect.handleKeyDown"];
            window.addEventListener("keydown", handleKeyDown);
            return ({
                "GPDetailModal.useEffect": ()=>window.removeEventListener("keydown", handleKeyDown)
            })["GPDetailModal.useEffect"];
        }
    }["GPDetailModal.useEffect"], [
        isOpen,
        onClose
    ]);
    const loadChildren = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "GPDetailModal.useCallback[loadChildren]": async ()=>{
            if (!isOpen || !gp || !isAuthenticated || !token) return;
            setLoadingChildren(true);
            try {
                setHierarchyGp(null);
                const gpMetaRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT, {
                    fields: [
                        "id",
                        "nbid",
                        "description",
                        "created_by.full_name",
                        "updated_by.full_name",
                        "created_by",
                        "updated_by"
                    ],
                    filters: [
                        [
                            "id",
                            "=",
                            gp.id
                        ]
                    ],
                    limit: 1
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token);
                const gpMetaJson = gpMetaRes.ok ? await gpMetaRes.json() : {
                    data: []
                };
                const gpMeta = Array.isArray(gpMetaJson?.data) ? gpMetaJson.data[0] : undefined;
                const nbId = gpMeta && typeof gpMeta.nbid === "number" ? gpMeta.nbid : gpMeta?.nbid && typeof gpMeta.nbid === "object" ? toNumber(gpMeta.nbid.id) : undefined;
                setActivityUsers({
                    createdBy: resolveUserName(gpMeta?.["created_by.full_name"], gpMeta?.created_by),
                    updatedBy: resolveUserName(gpMeta?.["updated_by.full_name"], gpMeta?.updated_by)
                });
                if (!nbId) {
                    setLinkedNB(null);
                } else {
                    const nbRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND, {
                        fields: [
                            "id",
                            "name",
                            "nb_name"
                        ],
                        filters: [
                            [
                                "id",
                                "=",
                                nbId
                            ]
                        ],
                        limit: 1
                    }), {
                        method: "GET",
                        cache: "no-store"
                    }, token);
                    const nbJson = nbRes.ok ? await nbRes.json() : {
                        data: []
                    };
                    const nbRow = Array.isArray(nbJson?.data) ? nbJson.data[0] : undefined;
                    setLinkedNB(nbRow ? {
                        id: Number(nbRow.id),
                        code: nbRow.name || `NB${nbRow.id}`,
                        name: nbRow.nb_name || nbRow.name || "-",
                        credit_limit: nbRow.credit_limit ?? null,
                        payment_term: nbRow.payment_term ?? null,
                        disabled: nbRow.disabled ?? null,
                        created_at: nbRow.created_at || null,
                        updated_at: nbRow.updated_at || null
                    } : null);
                }
                const hierarchyResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`), {
                    method: "POST",
                    cache: "no-store",
                    body: JSON.stringify({
                        level: "gpid",
                        value: gp.id,
                        format: "full",
                        entities: [
                            "gp",
                            "gcs",
                            "bcs"
                        ],
                        query: {
                            bcs: {
                                fields: [
                                    "id",
                                    "name",
                                    "branch.city",
                                    "gcid"
                                ]
                            },
                            gcs: {
                                fields: [
                                    "id",
                                    "gc_name",
                                    "name"
                                ]
                            },
                            gp: {
                                fields: [
                                    "id",
                                    "gp_name",
                                    "credit_limit",
                                    "payment_term",
                                    "name"
                                ]
                            },
                            nb: {
                                fields: [
                                    "id",
                                    "nb_name"
                                ]
                            }
                        }
                    })
                }, token);
                if (!hierarchyResponse.ok) {
                    throw new Error(`Gagal memuat hierarchy Group Parent (${hierarchyResponse.status})`);
                }
                const hierarchyJson = await hierarchyResponse.json();
                const hierarchyData = hierarchyJson.data?.data;
                setHierarchyGp(hierarchyData?.gp || null);
                const hierarchyGcRows = Array.isArray(hierarchyData?.gcs) ? hierarchyData?.gcs || [] : [];
                const hierarchyBcRows = Array.isArray(hierarchyData?.bcs) ? hierarchyData?.bcs || [] : [];
                const mappedGCs = hierarchyGcRows.map({
                    "GPDetailModal.useCallback[loadChildren].mappedGCs": (row)=>({
                            id: Number(row.id),
                            code: row.name || undefined,
                            name: row.gc_name || row.name || "-",
                            gp_id: gp.id,
                            gp_name: gp.name,
                            gp_code: gp.code,
                            created_at: new Date(0).toISOString(),
                            updated_at: new Date(0).toISOString(),
                            disabled: 0
                        })
                }["GPDetailModal.useCallback[loadChildren].mappedGCs"]);
                setChildGCs(mappedGCs);
                const mappedBCs = hierarchyBcRows.map({
                    "GPDetailModal.useCallback[loadChildren].mappedBCs": (row)=>{
                        const gcId = toNumber(row._relations?.gcid?.id) || 0;
                        const gcCode = row._relations?.gcid?.name || undefined;
                        const gcName = row._relations?.gcid?.gc_name || row._relations?.gcid?.name || undefined;
                        const branchCity = row._relations?.branch?.city || undefined;
                        return {
                            id: Number(row.id),
                            code: row.name || undefined,
                            name: `${gcName || "GC"} - ${branchCity || "-"}`,
                            gc_id: gcId,
                            gc_name: gcName,
                            gc_code: gcCode,
                            gp_name: gp.name,
                            gp_code: gp.code,
                            branch_id: 0,
                            branch_city: branchCity,
                            created_at: new Date(0).toISOString(),
                            updated_at: new Date(0).toISOString(),
                            disabled: 0
                        };
                    }
                }["GPDetailModal.useCallback[loadChildren].mappedBCs"]);
                setChildBCs(mappedBCs);
            } catch  {
                setHierarchyGp(null);
                setChildGCs([]);
                setChildBCs([]);
            } finally{
                setLoadingChildren(false);
            }
        }
    }["GPDetailModal.useCallback[loadChildren]"], [
        gp,
        isAuthenticated,
        isOpen,
        token
    ]);
    const handleViewLinkedNb = async ()=>{
        if (!token || !linkedNB || !onViewNB) return;
        try {
            const [nbRes, hierarchyRes, memberRes] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND, {
                    fields: [
                        "id",
                        "name",
                        "nb_name",
                        "disabled",
                        "created_at",
                        "updated_at"
                    ],
                    filters: [
                        [
                            "id",
                            "=",
                            linkedNB.id
                        ]
                    ],
                    limit: 1
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_policy_hierarchy`), {
                    method: "POST",
                    cache: "no-store",
                    body: JSON.stringify({
                        level: "nbid",
                        value: linkedNB.id,
                        format: "full",
                        entities: [
                            "gps",
                            "gcs",
                            "bcs"
                        ],
                        query: {
                            bcs: {
                                fields: [
                                    "id",
                                    "name",
                                    "branch.city",
                                    "gcid"
                                ]
                            },
                            gcs: {
                                fields: [
                                    "id",
                                    "gc_name",
                                    "name"
                                ]
                            },
                            gps: {
                                fields: [
                                    "id",
                                    "gp_name",
                                    "name"
                                ]
                            },
                            nb: {
                                fields: [
                                    "id",
                                    "nb_name",
                                    "name"
                                ]
                            }
                        }
                    })
                }, token),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.MEMBER_OF, {
                    fields: [
                        "*",
                        "user.full_name"
                    ],
                    filters: [
                        [
                            "ref_type",
                            "=",
                            "nbid"
                        ],
                        [
                            "ref_id",
                            "=",
                            linkedNB.id
                        ]
                    ]
                }), {
                    method: "GET",
                    cache: "no-store"
                }, token)
            ]);
            if (!nbRes.ok || !hierarchyRes.ok) return;
            const nbJson = await nbRes.json();
            const nbRow = Array.isArray(nbJson?.data) ? nbJson.data[0] : undefined;
            const hierarchyJson = await hierarchyRes.json();
            const memberJson = memberRes.ok ? await memberRes.json() : {
                data: []
            };
            const owners = Array.isArray(memberJson?.data) ? memberJson.data.map((row)=>row.user?.full_name || null).filter((value)=>Boolean(value)) : [];
            const gps = Array.isArray(hierarchyJson.data?.data?.gps) ? hierarchyJson.data?.data?.gps || [] : [];
            const gcs = Array.isArray(hierarchyJson.data?.data?.gcs) ? hierarchyJson.data?.data?.gcs || [] : [];
            const bcs = Array.isArray(hierarchyJson.data?.data?.bcs) ? hierarchyJson.data?.data?.bcs || [] : [];
            onViewNB({
                id: linkedNB.id,
                code: nbRow?.name || linkedNB.code || `NB${linkedNB.id}`,
                name: nbRow?.nb_name || nbRow?.name || linkedNB.name || "-",
                disabled: Number(nbRow?.disabled || linkedNB.disabled || 0),
                created_at: nbRow?.created_at || linkedNB.created_at || new Date(0).toISOString(),
                updated_at: nbRow?.updated_at || linkedNB.updated_at || nbRow?.created_at || new Date(0).toISOString(),
                owners,
                active_gp_count: gps.length,
                active_gc_count: gcs.length,
                active_bc_count: bcs.length,
                active_gp_names: gps.map((row)=>row.gp_name || `GP ${row.id}`),
                active_gc_names: gcs.map((row)=>row.gc_name || `GC ${row.id}`),
                active_bc_names: bcs.map((row)=>{
                    const gcName = row._relations?.gcid?.gc_name || "GC";
                    const city = row._relations?.branch?.city || "-";
                    return `${gcName} - ${city}`;
                })
            });
        } catch  {
        // swallow for now; clicking should fail quietly
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GPDetailModal.useEffect": ()=>{
            void loadChildren();
        }
    }["GPDetailModal.useEffect"], [
        loadChildren
    ]);
    const handleEditClick = ()=>{
        if (!gp) return;
        syncEditState(gp);
        setActiveTab("hierarchy");
        setIsEditMode(true);
    };
    const handleCancelEdit = ()=>{
        if (!gp) return;
        syncEditState(gp);
        setIsEditMode(false);
    };
    const handleSaveEdit = async ()=>{
        if (!gp || !editedName.trim() || !token || !isAuthenticated) return;
        setIsSaving(true);
        try {
            const payload = {
                gp_name: editedName.trim(),
                description: editedDescription.trim() || null,
                credit_limit_active: editedCreditLimitActive,
                credit_limit: parseNullableFloat(editedCreditLimit),
                payment_term_active: editedPaymentTermActive,
                payment_term: parseNullableInt(editedPaymentTerm),
                limit_customer_overdue_active: editedLimitCustomerOverdueActive,
                limit_customer_overdue: parseNullableInt(editedLimitCustomerOverdue)
            };
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT, gp.id), {
                method: "PUT",
                body: JSON.stringify(payload),
                cache: "no-store"
            }, token);
            if (!res.ok) {
                throw new Error(`Failed to update Group Parent (${res.status})`);
            }
            onGPUpdate?.({
                ...gp,
                name: editedName.trim(),
                description: editedDescription.trim() || undefined,
                credit_limit_active: editedCreditLimitActive,
                credit_limit: parseNullableFloat(editedCreditLimit),
                payment_term_active: editedPaymentTermActive,
                payment_term: parseNullableInt(editedPaymentTerm),
                limit_customer_overdue_active: editedLimitCustomerOverdueActive,
                limit_customer_overdue: parseNullableInt(editedLimitCustomerOverdue),
                updated_at: new Date().toISOString()
            });
            setIsEditMode(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Gagal update Group Parent");
        } finally{
            setIsSaving(false);
        }
    };
    const detailTabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "GPDetailModal.useMemo[detailTabs]": ()=>[
                // {
                //   key: "company" as const,
                //   label: "Data Perusahaan",
                //   caption: "Identitas & owner",
                //   icon: <FaBuilding className="h-4 w-4" />,
                // },
                // {
                //   key: "finance" as const,
                //   label: "Data Keuangan",
                //   caption: "Credit & term",
                //   icon: <FaTags className="h-4 w-4" />,
                // },
                {
                    key: "hierarchy",
                    label: "Hierarki",
                    caption: "GC & BC turunan",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                        lineNumber: 652,
                        columnNumber: 15
                    }, this)
                },
                {
                    key: "activity",
                    label: "Aktivitas",
                    caption: "Riwayat data",
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClock"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                        lineNumber: 658,
                        columnNumber: 15
                    }, this)
                }
            ]
    }["GPDetailModal.useMemo[detailTabs]"], []);
    if (!gp) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
            onClick: (e)=>{
                if (e.target === e.currentTarget) onClose();
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
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
                className: "flex h-[94vh] w-full max-w-[96vw] 2xl:max-w-[1320px] flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl md:max-w-[92vw] md:rounded-3xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-purple-200 bg-gradient-to-r from-purple-600 via-purple-500 to-fuchsia-500 px-4 py-4 md:px-6 md:py-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-0 items-center gap-3 md:gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-purple-900/20 backdrop-blur-sm md:h-14 md:w-14",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                            className: "h-6 w-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                            lineNumber: 685,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                        lineNumber: 684,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "mb-1 text-xl font-bold text-white md:mb-2 md:text-2xl",
                                                children: "Group Parent Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                lineNumber: 688,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-purple-100",
                                                children: [
                                                    "GPID: ",
                                                    gp.code || `GP${gp.id}`
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                lineNumber: 691,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                        lineNumber: 687,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                lineNumber: 683,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                            lineNumber: 682,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                        lineNumber: 681,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-4 md:p-5 xl:p-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid min-h-0 gap-5 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:space-y-3 lg:overflow-visible lg:pb-0",
                                        children: detailTabs.map((tab)=>{
                                            const active = activeTab === tab.key;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setActiveTab(tab.key),
                                                className: `min-w-[190px] shrink-0 rounded-2xl border px-4 py-3 text-left transition-all lg:w-full ${active ? "border-purple-500 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-200/70" : "border-slate-200 bg-white text-slate-700 hover:border-purple-200 hover:bg-purple-50/70"}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-white/20 text-white" : "bg-slate-100 text-purple-600"}`,
                                                            children: tab.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 735,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold",
                                                                    children: tab.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 745,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-xs ${active ? "text-purple-100" : "text-slate-500"}`,
                                                                    children: tab.caption
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 748,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 744,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                    lineNumber: 734,
                                                    columnNumber: 27
                                                }, this)
                                            }, tab.key, false, {
                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                lineNumber: 724,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                        lineNumber: 720,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                    lineNumber: 719,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-h-0 space-y-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-3xl border border-white bg-white p-6 shadow-sm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-start justify-between gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold uppercase tracking-[0.28em] text-purple-500",
                                                                children: "Group Parent"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 767,
                                                                columnNumber: 25
                                                            }, this),
                                                            isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: editedName,
                                                                onChange: (e)=>setEditedName(e.target.value),
                                                                className: "mt-3 w-full rounded-2xl border border-purple-200 px-4 py-3 text-2xl font-bold text-slate-900 outline-none ring-0 focus:border-purple-400",
                                                                placeholder: "Masukkan nama group parent",
                                                                disabled: isSaving
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 771,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "mt-2 text-3xl font-bold text-slate-900",
                                                                children: gp.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 780,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-2 text-sm text-slate-500",
                                                                children: "Entitas induk untuk relasi group customer dan branch customer."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 784,
                                                                columnNumber: 25
                                                            }, this),
                                                            linkedNB && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "mt-3 text-sm text-slate-500",
                                                                children: [
                                                                    "Terhubung ke National Brand",
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-slate-900",
                                                                        children: linkedNB.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 791,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-indigo-600",
                                                                        children: [
                                                                            "(",
                                                                            linkedNB.code,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 794,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 789,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                        lineNumber: 766,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid min-w-[240px] gap-3 sm:grid-cols-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-2xl border border-violet-100 bg-violet-50 px-5 py-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-semibold uppercase tracking-wide text-violet-700",
                                                                        children: "Credit Limit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 802,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-3 text-2xl font-bold leading-none text-violet-900",
                                                                        children: formatCurrency(hierarchyGp?.credit_limit ?? gp.credit_limit)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 801,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-semibold uppercase tracking-wide text-cyan-700",
                                                                        children: "Payment Term"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 812,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "mt-3 text-2xl font-bold leading-none text-cyan-900",
                                                                        children: formatDays(hierarchyGp?.payment_term ?? gp.payment_term)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 815,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 811,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                        lineNumber: 800,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                lineNumber: 765,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                            lineNumber: 764,
                                            columnNumber: 19
                                        }, this),
                                        activeTab === "hierarchy" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid min-h-0 gap-4 xl:grid-cols-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "flex min-h-0 flex-col rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm xl:p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 1141,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1140,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500",
                                                                            children: "National Brand"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1144,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: linkedNB ? "Relasi induk" : "Belum terhubung"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1147,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1143,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1139,
                                                            columnNumber: 25
                                                        }, this),
                                                        linkedNB ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>void handleViewLinkedNb(),
                                                            className: "flex w-full items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-4 text-left text-sm text-slate-800 transition-all hover:border-indigo-300 hover:bg-indigo-100/80",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900",
                                                                            children: linkedNB.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1160,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-2 text-xs text-indigo-700",
                                                                            children: [
                                                                                "Limit: ",
                                                                                formatCurrency(linkedNB.credit_limit)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1163,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-xs text-indigo-700",
                                                                            children: [
                                                                                "Payment Term:",
                                                                                " ",
                                                                                formatDays(linkedNB.payment_term)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1166,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1159,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                    className: "ml-3 h-4 w-4 shrink-0 text-indigo-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1171,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1154,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm italic text-slate-500",
                                                            children: "Group Parent ini tidak terhubung ke National Brand."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1174,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                    lineNumber: 1138,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "flex min-h-0 flex-col rounded-3xl border border-blue-100 bg-white p-4 shadow-sm xl:p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaUsers"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 1183,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1182,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-blue-500",
                                                                            children: "Group Customer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1186,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: loadingChildren ? "Loading..." : `${childGCs.length} data terdaftar`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1189,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1185,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1181,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                                                            children: childGCs.length > 0 ? childGCs.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>onViewGC?.(item),
                                                                    className: "flex w-full items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-left text-sm text-slate-800 transition-all hover:border-blue-300 hover:bg-blue-100/80",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900",
                                                                                    children: item.name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                                    lineNumber: 1206,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-2 text-xs text-blue-700",
                                                                                    children: [
                                                                                        "GCID: ",
                                                                                        item.code || `GC${item.id}`
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                                    lineNumber: 1209,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1205,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                            className: "ml-3 h-4 w-4 shrink-0 text-blue-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1213,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, item.id, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1200,
                                                                    columnNumber: 31
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm italic text-slate-500",
                                                                children: "Belum ada GC terdaftar."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 1217,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1197,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                    lineNumber: 1180,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "flex min-h-0 flex-col rounded-3xl border border-orange-100 bg-white p-4 shadow-sm xl:p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaStore"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 1227,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1226,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-orange-500",
                                                                            children: "Branch Customer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1230,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: loadingChildren ? "Loading..." : `${childBCs.length} data terdaftar`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1233,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1229,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1225,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                                                            children: childBCs.length > 0 ? childBCs.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>onViewBC?.(item),
                                                                    className: "flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-left text-sm text-slate-800 transition-all hover:border-orange-300 hover:bg-orange-100/80",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900",
                                                                                    children: `${item.gc_name || item.gc_code || "GC"} - ${item.branch_city || item.branch_name || item.name || "-"}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                                    lineNumber: 1250,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-2 text-xs text-orange-700",
                                                                                    children: [
                                                                                        "BCID: ",
                                                                                        item.code || `BC${item.id}`,
                                                                                        " •",
                                                                                        " ",
                                                                                        item.branch_city || "-"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                                    lineNumber: 1258,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1249,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                            className: "ml-3 h-4 w-4 shrink-0 text-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1263,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, item.id, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1244,
                                                                    columnNumber: 31
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm italic text-slate-500",
                                                                children: "Belum ada BC terdaftar."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                lineNumber: 1267,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1241,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                    lineNumber: 1224,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                            lineNumber: 1137,
                                            columnNumber: 21
                                        }, this),
                                        activeTab === "activity" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "grid gap-4 md:grid-cols-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaClock"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 1281,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1280,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500",
                                                                            children: "Created"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1284,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: activityUsers.createdBy || gp.created_by || "System"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1287,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1283,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1279,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-slate-800",
                                                            children: formatDateTime(gp.created_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1294,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                    lineNumber: 1278,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-3xl border border-blue-100 bg-white p-5 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEdit"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                        lineNumber: 1302,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1301,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-blue-500",
                                                                            children: "Updated"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1305,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: activityUsers.updatedBy || gp.updated_by || "System"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                            lineNumber: 1308,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                                    lineNumber: 1304,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1300,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-slate-800",
                                                            children: formatDateTime(gp.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                            lineNumber: 1315,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                    lineNumber: 1299,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                            lineNumber: 1277,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                    lineNumber: 763,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                            lineNumber: 718,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                        lineNumber: 717,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end md:px-6",
                        children: [
                            isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCancelEdit,
                                        disabled: isSaving,
                                        className: "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 disabled:opacity-50 sm:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTimes"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                lineNumber: 1333,
                                                columnNumber: 21
                                            }, this),
                                            "Batal"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                        lineNumber: 1328,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void handleSaveEdit(),
                                        disabled: isSaving || !editedName.trim(),
                                        className: "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50 sm:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSave"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                                lineNumber: 1341,
                                                columnNumber: 21
                                            }, this),
                                            isSaving ? "Menyimpan..." : "Apply Changes"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                        lineNumber: 1336,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true),
                            !isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "w-full rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 sm:w-auto",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                                lineNumber: 1347,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                        lineNumber: 1325,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
                lineNumber: 675,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
            lineNumber: 669,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/group_parent/GPDetailModal.tsx",
        lineNumber: 667,
        columnNumber: 5
    }, this);
}
_s(GPDetailModal, "twzIuz677qwGUJwAIeBgweo31M8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = GPDetailModal;
var _c;
__turbopack_context__.k.register(_c, "GPDetailModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_group_parent_GPDetailModal_tsx_469e9bf9._.js.map