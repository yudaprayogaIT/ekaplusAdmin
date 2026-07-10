module.exports = [
"[project]/src/components/group_customer/GCDetailModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GCDetailModal",
    ()=>GCDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/fetchAllQueryRows.ts [app-ssr] (ecmascript)");
"use client";
;
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
        "UD"
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
function toNumber(value) {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number.parseInt(value, 10);
        if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
}
function resolveUserName(directName, value) {
    if (directName) return directName;
    if (value && typeof value === "object" && value.full_name) return value.full_name;
    return undefined;
}
function formatDateTime(value) {
    if (!value) return "-";
    return new Date(value).toLocaleString("id-ID", {
        dateStyle: "long",
        timeStyle: "short"
    });
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
function detectAttachmentKind(url) {
    if (!url) return "file";
    const normalized = url.toLowerCase();
    if (normalized.endsWith(".png") || normalized.endsWith(".jpg") || normalized.endsWith(".jpeg") || normalized.endsWith(".webp") || normalized.endsWith(".gif")) {
        return "image";
    }
    if (normalized.endsWith(".pdf")) {
        return "pdf";
    }
    return "file";
}
function VerificationDocumentPreview({ url, token }) {
    const [blobUrl, setBlobUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [contentType, setContentType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let cancelled = false;
        let objectUrl = null;
        async function loadPreview() {
            if (!url || !token) {
                setBlobUrl(null);
                setContentType(null);
                setError(null);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])(url, {
                    method: "GET",
                    cache: "no-store"
                }, token);
                if (!response.ok) {
                    throw new Error(`Gagal memuat lampiran (${response.status})`);
                }
                const blob = await response.blob();
                objectUrl = URL.createObjectURL(blob);
                if (!cancelled) {
                    setBlobUrl(objectUrl);
                    setContentType(blob.type || response.headers.get("Content-Type"));
                }
            } catch (loadError) {
                if (!cancelled) {
                    setBlobUrl(null);
                    setContentType(null);
                    setError(loadError instanceof Error ? loadError.message : "Gagal memuat dokumen verifikasi");
                }
            } finally{
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        void loadPreview();
        return ()=>{
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [
        token,
        url
    ]);
    if (!url) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500",
            children: "Belum ada dokumen verifikasi."
        }, void 0, false, {
            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
            lineNumber: 330,
            columnNumber: 7
        }, this);
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500",
            children: "Memuat dokumen verifikasi..."
        }, void 0, false, {
            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
            lineNumber: 338,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-600",
            children: error
        }, void 0, false, {
            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
            lineNumber: 346,
            columnNumber: 7
        }, this);
    }
    const previewKind = contentType?.startsWith("image/") ? "image" : contentType === "application/pdf" ? "pdf" : detectAttachmentKind(url);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        children: [
            previewKind === "image" && blobUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: blobUrl,
                target: "_blank",
                rel: "noreferrer",
                className: "block overflow-hidden rounded-xl border border-slate-200 bg-slate-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-40 w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: blobUrl,
                        alt: "Dokumen verifikasi",
                        fill: true,
                        unoptimized: true,
                        className: "object-cover"
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 368,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                    lineNumber: 367,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                lineNumber: 361,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-40 flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl bg-rose-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600",
                        children: "PDF"
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 379,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm font-semibold text-slate-900",
                        children: "Dokumen verifikasi tersedia"
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-xs text-slate-500",
                        children: "Buka file untuk melihat isi lengkap"
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 385,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                lineNumber: 378,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500",
                                children: "Dokumen Verifikasi"
                            }, void 0, false, {
                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                lineNumber: 392,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm font-medium text-slate-900",
                                children: previewKind === "image" ? "Foto identitas" : "File PDF"
                            }, void 0, false, {
                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                lineNumber: 395,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: blobUrl || url,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700",
                        children: "Buka File"
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
        lineNumber: 359,
        columnNumber: 5
    }, this);
}
function policyLevelLabel(value) {
    if (value === "nbid") return "NB";
    if (value === "gpid") return "GP";
    if (value === "gcid") return "GC";
    if (value === "bcid") return "BC";
    return "-";
}
function GCDetailModal({ isOpen, onClose, gc, onGCUpdate, onViewGP, onViewBC }) {
    const { token, isAuthenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("company");
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editedName, setEditedName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedCompanyType, setEditedCompanyType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedCompanyTitle, setEditedCompanyTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedCompanyNameBase, setEditedCompanyNameBase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedCompanyNameSuffix, setEditedCompanyNameSuffix] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedDescription, setEditedDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerName, setEditedOwnerName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerPhone, setEditedOwnerPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerEmail, setEditedOwnerEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerPlaceOfBirth, setEditedOwnerPlaceOfBirth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editedOwnerDateOfBirth, setEditedOwnerDateOfBirth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [creditPolicyFields, setCreditPolicyFields] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        credit_limit_active: 0,
        credit_limit: null,
        payment_term_active: 0,
        payment_term: null,
        limit_customer_overdue_active: 0,
        limit_customer_overdue: null
    });
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [parentGP, setParentGP] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [linkedNB, setLinkedNB] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [childBCs, setChildBCs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activePolicy, setActivePolicy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        creditLimit: null,
        paymentTerm: null,
        overdue: null
    });
    const loadRelations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!isOpen || !gc || !isAuthenticated || !token) return;
        setActivePolicy({
            creditLimit: null,
            paymentTerm: null,
            overdue: null
        });
        const gcDetailRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER, {
            fields: [
                "id",
                "name",
                "gc_name",
                "description",
                "company_name",
                "company_title",
                "company_type",
                "credit_limit_active",
                "credit_limit",
                "payment_term_active",
                "payment_term",
                "limit_customer_overdue_active",
                "limit_customer_overdue",
                "owner_full_name",
                "owner_phone",
                "owner_email",
                "owner_place_of_birth",
                "owner_date_of_birth"
            ],
            filters: [
                [
                    "id",
                    "=",
                    gc.id
                ]
            ],
            limit: 1
        }), {
            method: "GET",
            cache: "no-store"
        }, token);
        const gcDetailJson = gcDetailRes.ok ? await gcDetailRes.json() : {
            data: []
        };
        const gcDetailRow = Array.isArray(gcDetailJson?.data) ? gcDetailJson.data[0] : undefined;
        const rawCompanyType = gcDetailRow?.company_type || "";
        const rawCompanyTitle = gcDetailRow?.company_title || "";
        const rawCompanyName = gcDetailRow?.company_name || gcDetailRow?.gc_name || gc.name || "";
        const companySplit = splitCompanyName(rawCompanyName, rawCompanyTitle);
        setEditedCompanyType(rawCompanyType);
        setEditedCompanyTitle(rawCompanyTitle);
        setEditedCompanyNameBase(companySplit.company_name_base);
        setEditedCompanyNameSuffix(companySplit.company_name_suffix);
        setEditedName(companySplit.company_name || rawCompanyName);
        setEditedDescription(gcDetailRow?.description || gc.description || "");
        setEditedOwnerName(gcDetailRow?.owner_full_name || gc.owner_name || "");
        setEditedOwnerPhone(gcDetailRow?.owner_phone || gc.owner_phone || "");
        setEditedOwnerEmail(gcDetailRow?.owner_email || gc.owner_email || "");
        setEditedOwnerPlaceOfBirth(gcDetailRow?.owner_place_of_birth || "");
        setEditedOwnerDateOfBirth(gcDetailRow?.owner_date_of_birth?.split("T")[0] || "");
        setCreditPolicyFields({
            credit_limit_active: Number(gcDetailRow?.credit_limit_active || 0),
            credit_limit: gcDetailRow?.credit_limit ?? null,
            payment_term_active: Number(gcDetailRow?.payment_term_active || 0),
            payment_term: gcDetailRow?.payment_term ?? null,
            limit_customer_overdue_active: Number(gcDetailRow?.limit_customer_overdue_active || 0),
            limit_customer_overdue: gcDetailRow?.limit_customer_overdue ?? null
        });
        if (gc.gp_id) {
            const gpRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_PARENT, {
                fields: [
                    "*",
                    "created_by.full_name",
                    "updated_by.full_name"
                ],
                filters: [
                    [
                        "id",
                        "=",
                        gc.gp_id
                    ]
                ],
                limit: 1
            }), {
                method: "GET",
                cache: "no-store"
            }, token);
            const gpJson = gpRes.ok ? await gpRes.json() : {
                data: []
            };
            const row = Array.isArray(gpJson?.data) ? gpJson.data[0] : undefined;
            setParentGP(row ? {
                id: Number(row.id),
                code: row.name || undefined,
                name: row.gp_name || row.name || "-",
                credit_limit_active: Number(row.credit_limit_active || 0),
                credit_limit: row.credit_limit ?? null,
                payment_term_active: Number(row.payment_term_active || 0),
                payment_term: row.payment_term ?? null,
                limit_customer_overdue_active: Number(row.limit_customer_overdue_active || 0),
                limit_customer_overdue: row.limit_customer_overdue ?? null,
                created_at: row.created_at || new Date(0).toISOString(),
                updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
                created_by: resolveUserName(row["created_by.full_name"], row.created_by),
                updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
                disabled: Number(row.disabled || 0)
            } : null);
            const nbId = row && typeof row.nbid === "number" ? row.nbid : row?.nbid && typeof row.nbid === "object" ? toNumber(row.nbid.id) : undefined;
            if (!nbId) {
                setLinkedNB(null);
            } else {
                const nbRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.NATIONAL_BRAND, {
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
                    name: nbRow.nb_name || nbRow.name || "-"
                } : null);
            }
        } else {
            setParentGP(null);
            setLinkedNB(null);
        }
        const policyRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2}/method/get_customer_policy_active`), {
            method: "POST",
            cache: "no-store",
            body: JSON.stringify({
                policy_id: String(gc.id),
                policy_type: "gcid"
            })
        }, token);
        if (policyRes.ok) {
            const policyJson = await policyRes.json();
            setActivePolicy({
                creditLimit: policyJson.data?.credit_limit || null,
                paymentTerm: policyJson.data?.payment_term || null,
                overdue: policyJson.data?.limit_overdue || null
            });
        }
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$fetchAllQueryRows$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllQueryRows"])({
            endpoint: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH_CUSTOMER_V2,
            spec: {
                fields: [
                    "*",
                    "created_by.full_name",
                    "updated_by.full_name"
                ],
                filters: [
                    [
                        "gcid",
                        "=",
                        gc.id
                    ]
                ]
            },
            token,
            errorMessage: "Gagal memuat child branch customer"
        });
        const branchIds = Array.from(new Set(rows.map((row)=>row.branch && typeof row.branch === "object" ? toNumber(row.branch.id) : toNumber(row.branch)).filter((id)=>typeof id === "number")));
        const branchMap = new Map();
        if (branchIds.length > 0) {
            const branchRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getQueryUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.BRANCH, {
                fields: [
                    "id",
                    "branch_name",
                    "city"
                ],
                filters: [
                    [
                        "id",
                        "in",
                        branchIds
                    ]
                ],
                limit: branchIds.length
            }), {
                method: "GET",
                cache: "no-store"
            }, token);
            if (branchRes.ok) {
                const branchJson = await branchRes.json();
                const branchRows = Array.isArray(branchJson?.data) ? branchJson.data : [];
                branchRows.forEach((row)=>{
                    branchMap.set(Number(row.id), {
                        name: row.branch_name || undefined,
                        city: row.city || undefined
                    });
                });
            }
        }
        const mapped = rows.map((row)=>{
            const branchId = row.branch && typeof row.branch === "object" ? toNumber(row.branch.id) || 0 : toNumber(row.branch) || 0;
            const branchRef = branchMap.get(branchId);
            const directBranchName = row.branch && typeof row.branch === "object" ? row.branch.branch_name : undefined;
            const directBranchCity = row.branch && typeof row.branch === "object" ? row.branch.city : undefined;
            return {
                id: Number(row.id),
                code: row.name || undefined,
                name: row.bcid_name || row.name || `${gc.name} - ${directBranchCity || branchRef?.city || "-"}`,
                gc_id: gc.id,
                gc_name: gc.name,
                gc_code: gc.code,
                gp_name: gc.gp_name,
                gp_code: gc.gp_code,
                credit_limit_active: Number(row.credit_limit_active || 0),
                credit_limit: row.credit_limit ?? null,
                payment_term_active: Number(row.payment_term_active || 0),
                payment_term: row.payment_term ?? null,
                limit_customer_overdue_active: Number(row.limit_customer_overdue_active || 0),
                limit_customer_overdue: row.limit_customer_overdue ?? null,
                branch_id: branchId,
                branch_name: directBranchName || branchRef?.name,
                branch_city: directBranchCity || branchRef?.city,
                owner_name: row.branch_owner || undefined,
                owner_phone: row.branch_owner_phone || undefined,
                owner_email: row.branch_owner_email || undefined,
                receipt_delivery_method: row.receipt_delivery_method || undefined,
                receipt_issued_at: row.receipt_issued_at || undefined,
                created_at: row.created_at || new Date(0).toISOString(),
                updated_at: row.updated_at || row.created_at || new Date(0).toISOString(),
                created_by: resolveUserName(row["created_by.full_name"], row.created_by),
                updated_by: resolveUserName(row["updated_by.full_name"], row.updated_by),
                disabled: Number(row.disabled || 0)
            };
        });
        setChildBCs(mapped);
    }, [
        gc,
        isAuthenticated,
        isOpen,
        token
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen && gc) {
            setActiveTab("company");
            setIsEditMode(false);
            setEditedName(gc.name || "");
            const split = splitCompanyName(gc.name || "", "");
            setEditedCompanyType("");
            setEditedCompanyTitle("");
            setEditedCompanyNameBase(split.company_name_base);
            setEditedCompanyNameSuffix(split.company_name_suffix);
            setEditedDescription(gc.description || "");
            setEditedOwnerName(gc.owner_name || "");
            setEditedOwnerPhone(gc.owner_phone || "");
            setEditedOwnerEmail(gc.owner_email || "");
            setEditedOwnerPlaceOfBirth("");
            setEditedOwnerDateOfBirth("");
        }
    }, [
        gc,
        isOpen
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void loadRelations();
    }, [
        loadRelations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isOpen) return;
        const handleKeyDown = (event)=>{
            if (event.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return ()=>window.removeEventListener("keydown", handleKeyDown);
    }, [
        isOpen,
        onClose
    ]);
    const companyTitleOptions = COMPANY_TITLE_OPTIONS_BY_TYPE[editedCompanyType] || [];
    const companySuffixOptions = COMPANY_SUFFIX_OPTIONS_BY_TITLE[editedCompanyTitle] || [];
    const isSuffixEditable = editedCompanyTitle === "Freelance";
    const setCompanyType = (type)=>{
        const nextTitles = COMPANY_TITLE_OPTIONS_BY_TYPE[type] || [];
        const nextTitle = type ? nextTitles[0] || "" : "";
        const nextSuffix = nextTitle ? (COMPANY_SUFFIX_OPTIONS_BY_TITLE[nextTitle] || [])[0] || "" : "";
        setEditedCompanyType(type);
        setEditedCompanyTitle(nextTitle);
        setEditedCompanyNameSuffix(nextSuffix);
        setEditedName(buildCompanyName(editedCompanyNameBase, nextSuffix));
    };
    const setCompanyTitle = (title)=>{
        const nextSuffix = (COMPANY_SUFFIX_OPTIONS_BY_TITLE[title] || [])[0] || "";
        setEditedCompanyTitle(title);
        setEditedCompanyNameSuffix(nextSuffix);
        setEditedName(buildCompanyName(editedCompanyNameBase, nextSuffix));
    };
    const setCompanyNameBase = (base)=>{
        setEditedCompanyNameBase(base);
        setEditedName(buildCompanyName(base, editedCompanyNameSuffix));
    };
    const setCompanyNameSuffix = (suffix)=>{
        setEditedCompanyNameSuffix(suffix);
        setEditedName(buildCompanyName(editedCompanyNameBase, suffix));
    };
    const handleEditClick = ()=>{
        setIsEditMode(true);
        setActiveTab("company");
    };
    const handleCancelEdit = ()=>{
        setIsEditMode(false);
        void loadRelations();
    };
    const handleSaveEdit = async ()=>{
        const finalName = buildCompanyName(editedCompanyNameBase, editedCompanyNameSuffix);
        if (!gc || !token || !isAuthenticated || !editedCompanyType || !editedCompanyTitle || !finalName) {
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                gc_name: finalName,
                description: editedDescription.trim() || null,
                company_name: finalName,
                company_title: editedCompanyTitle,
                company_type: editedCompanyType,
                credit_limit_active: creditPolicyFields.credit_limit_active,
                credit_limit: creditPolicyFields.credit_limit,
                payment_term_active: creditPolicyFields.payment_term_active,
                payment_term: creditPolicyFields.payment_term,
                limit_customer_overdue_active: creditPolicyFields.limit_customer_overdue_active,
                limit_customer_overdue: creditPolicyFields.limit_customer_overdue,
                owner_full_name: editedOwnerName.trim() || null,
                owner_phone: editedOwnerPhone.trim() || null,
                owner_email: editedOwnerEmail.trim() || null,
                owner_place_of_birth: editedOwnerPlaceOfBirth.trim() || null,
                owner_date_of_birth: editedOwnerDateOfBirth ? `${editedOwnerDateOfBirth}T00:00:00Z` : null
            };
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getResourceUrl"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.GROUP_CUSTOMER, gc.id), {
                method: "PUT",
                body: JSON.stringify(payload),
                cache: "no-store"
            }, token);
            if (!res.ok) {
                throw new Error(`Failed to update Group Customer (${res.status})`);
            }
            onGCUpdate?.({
                ...gc,
                name: finalName,
                description: editedDescription.trim() || undefined,
                credit_limit_active: creditPolicyFields.credit_limit_active,
                credit_limit: creditPolicyFields.credit_limit,
                payment_term_active: creditPolicyFields.payment_term_active,
                payment_term: creditPolicyFields.payment_term,
                limit_customer_overdue_active: creditPolicyFields.limit_customer_overdue_active,
                limit_customer_overdue: creditPolicyFields.limit_customer_overdue,
                owner_name: editedOwnerName.trim() || undefined,
                owner_phone: editedOwnerPhone.trim() || undefined,
                owner_email: editedOwnerEmail.trim() || undefined,
                updated_at: new Date().toISOString()
            });
            setIsEditMode(false);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Gagal update Group Customer");
        } finally{
            setIsSaving(false);
        }
    };
    const detailTabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>[
            {
                key: "company",
                label: "Data Perusahaan",
                caption: "Profil & pemilik",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUser"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                    lineNumber: 915,
                    columnNumber: 15
                }, this)
            },
            {
                key: "finance",
                label: "Data Keuangan",
                caption: "Credit & term",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTags"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                    lineNumber: 921,
                    columnNumber: 15
                }, this)
            },
            {
                key: "hierarchy",
                label: "Hierarki",
                caption: "Parent & branch",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUsers"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                    lineNumber: 927,
                    columnNumber: 15
                }, this)
            },
            {
                key: "activity",
                label: "Aktivitas",
                caption: "Riwayat data",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaClock"], {
                    className: "h-4 w-4"
                }, void 0, false, {
                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                    lineNumber: 933,
                    columnNumber: 15
                }, this)
            }
        ], []);
    const activeCreditSourceName = activePolicy.creditLimit?.active_level === "gpid" ? `${parentGP?.name || "Group Parent"} - ${parentGP?.code || (parentGP ? `GP${parentGP.id}` : "-")}` : activePolicy.creditLimit?.active_level === "nbid" ? `${linkedNB?.name || "National Brand"}${linkedNB?.code ? ` - ${linkedNB.code}` : ""}` : activePolicy.creditLimit?.active_level === "gcid" ? `${gc?.name || "Group Customer"} - ${gc?.code || (gc ? `GC${gc.id}` : "-")}` : "-";
    const activePaymentSourceName = activePolicy.paymentTerm?.active_level === "gpid" ? `${parentGP?.name || "Group Parent"} - ${parentGP?.code || (parentGP ? `GP${parentGP.id}` : "-")}` : activePolicy.paymentTerm?.active_level === "nbid" ? `${linkedNB?.name || "National Brand"}${linkedNB?.code ? ` - ${linkedNB.code}` : ""}` : activePolicy.paymentTerm?.active_level === "gcid" ? `${gc?.name || "Group Customer"} - ${gc?.code || (gc ? `GC${gc.id}` : "-")}` : "-";
    const hierarchyCreditValue = activePolicy.creditLimit?.active_level === "gpid" || activePolicy.creditLimit?.active_level === "nbid" ? formatCurrency(activePolicy.creditLimit?.value) : parentGP?.credit_limit != null ? formatCurrency(parentGP.credit_limit) : null;
    const hierarchyPaymentValue = activePolicy.paymentTerm?.active_level === "gpid" || activePolicy.paymentTerm?.active_level === "nbid" ? formatDays(activePolicy.paymentTerm?.value) : parentGP?.payment_term != null ? formatDays(parentGP.payment_term) : null;
    const hierarchyPolicySourceLabel = activePolicy.creditLimit?.active_level === "nbid" || activePolicy.paymentTerm?.active_level === "nbid" ? linkedNB?.name || "National Brand" : activePolicy.creditLimit?.active_level === "gpid" || activePolicy.paymentTerm?.active_level === "gpid" ? parentGP?.name || "Group Parent" : null;
    const attachmentUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFileUrl"])(gc?.identity_attachment);
    const renderReadOnlyField = (label, value, className = "")=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: className,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mb-1.5 text-[11px] font-medium text-slate-600",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                    lineNumber: 989,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
                    children: value || "-"
                }, void 0, false, {
                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                    lineNumber: 990,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
            lineNumber: 988,
            columnNumber: 5
        }, this);
    if (!gc) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
            onClick: (e)=>{
                if (e.target === e.currentTarget) onClose();
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-blue-200 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 py-4 md:px-6 md:py-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between gap-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex min-w-0 items-center gap-3 md:gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-lg shadow-blue-900/20 backdrop-blur-sm md:h-14 md:w-14",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                            className: "h-6 w-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                            lineNumber: 1017,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                        lineNumber: 1016,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "mb-1 text-xl font-bold text-white md:mb-2 md:text-2xl",
                                                children: "Group Customer Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                lineNumber: 1020,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-blue-100",
                                                children: [
                                                    "GCID: ",
                                                    gc.code || `GC${gc.id}`
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                lineNumber: 1023,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                        lineNumber: 1019,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                lineNumber: 1015,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                            lineNumber: 1014,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 1013,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-0 flex-1 overflow-y-auto bg-slate-50/70 p-4 md:p-5 xl:p-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid min-h-0 gap-5 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:space-y-3 lg:overflow-visible lg:pb-0",
                                        children: detailTabs.map((tab)=>{
                                            const active = activeTab === tab.key;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setActiveTab(tab.key),
                                                className: `min-w-[190px] shrink-0 rounded-2xl border px-4 py-3 text-left transition-all lg:w-full ${active ? "border-blue-500 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-200/70" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/70"}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-white/20 text-white" : "bg-slate-100 text-blue-600"}`,
                                                            children: tab.icon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1067,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold",
                                                                    children: tab.label
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1077,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: `text-xs ${active ? "text-blue-100" : "text-slate-500"}`,
                                                                    children: tab.caption
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1080,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1076,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1066,
                                                    columnNumber: 27
                                                }, this)
                                            }, tab.key, false, {
                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                lineNumber: 1056,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                        lineNumber: 1052,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                    lineNumber: 1051,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "min-h-0 space-y-5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-3xl border border-white bg-white p-6 shadow-sm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-start justify-between gap-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-semibold uppercase tracking-[0.28em] text-blue-500",
                                                            children: "Group Customer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1099,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "mt-2 text-3xl font-bold text-slate-900",
                                                            children: editedName || gc.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1102,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1098,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                lineNumber: 1097,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                            lineNumber: 1096,
                                            columnNumber: 19
                                        }, this),
                                        activeTab === "company" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-3xl border border-blue-100 bg-white p-6 shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-5 flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaUser"], {
                                                                className: "h-5 w-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                lineNumber: 1113,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1112,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-blue-500",
                                                                    children: "Data Perusahaan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1116,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xl font-bold text-slate-900",
                                                                    children: "Company and Owner"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1119,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1115,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1111,
                                                    columnNumber: 23
                                                }, this),
                                                isEditMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid gap-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-slate-500",
                                                                    children: "Profil Perusahaan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1128,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-4 grid gap-4 md:grid-cols-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                                    children: "Jenis Perusahaan"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1133,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                    value: editedCompanyType,
                                                                                    onChange: (e)=>setCompanyType(e.target.value),
                                                                                    className: "w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm",
                                                                                    disabled: isSaving,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "",
                                                                                            children: "Pilih Jenis Perusahaan"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                            lineNumber: 1144,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        COMPANY_TYPE_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                value: option,
                                                                                                children: option
                                                                                            }, option, false, {
                                                                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                                lineNumber: 1148,
                                                                                                columnNumber: 37
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1136,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1132,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                                    children: "Gelar Perusahaan"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1155,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                    value: editedCompanyTitle,
                                                                                    onChange: (e)=>setCompanyTitle(e.target.value),
                                                                                    className: "w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm",
                                                                                    disabled: isSaving || !editedCompanyType,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                            value: "",
                                                                                            children: "Pilih Gelar Perusahaan"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                            lineNumber: 1166,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        companyTitleOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                value: option,
                                                                                                children: option
                                                                                            }, option, false, {
                                                                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                                lineNumber: 1170,
                                                                                                columnNumber: 37
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1158,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1154,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "md:col-span-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                                    children: "Nama Perusahaan"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1177,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "grid gap-3 md:grid-cols-[minmax(0,1fr)_180px]",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            value: editedCompanyNameBase,
                                                                                            onChange: (e)=>setCompanyNameBase(e.target.value),
                                                                                            className: "rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm",
                                                                                            placeholder: "Nama inti perusahaan",
                                                                                            disabled: isSaving
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                            lineNumber: 1181,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        isSuffixEditable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                            value: editedCompanyNameSuffix,
                                                                                            onChange: (e)=>setCompanyNameSuffix(e.target.value),
                                                                                            className: "rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm",
                                                                                            disabled: isSaving,
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                    value: "",
                                                                                                    children: "Pilih Sebutan"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                                    lineNumber: 1200,
                                                                                                    columnNumber: 39
                                                                                                }, this),
                                                                                                companySuffixOptions.map((suffix)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                                        value: suffix,
                                                                                                        children: suffix
                                                                                                    }, suffix, false, {
                                                                                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                                        lineNumber: 1202,
                                                                                                        columnNumber: 41
                                                                                                    }, this))
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                            lineNumber: 1192,
                                                                                            columnNumber: 37
                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "text",
                                                                                            value: editedCompanyNameSuffix,
                                                                                            readOnly: true,
                                                                                            className: "rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm",
                                                                                            placeholder: "Sebutan"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                            lineNumber: 1208,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1180,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1176,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "md:col-span-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                                    children: "Nama Final"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1219,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    value: editedName,
                                                                                    readOnly: true,
                                                                                    className: "w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1222,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1218,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "md:col-span-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500",
                                                                                    children: "Description"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1230,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                    value: editedDescription,
                                                                                    onChange: (e)=>setEditedDescription(e.target.value),
                                                                                    className: "min-h-[96px] w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm",
                                                                                    placeholder: "Deskripsi group customer",
                                                                                    disabled: isSaving
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1233,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1229,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1131,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1127,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-slate-500",
                                                                    children: "Data Pemilik"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1246,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-4 grid gap-4 md:grid-cols-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: editedOwnerName,
                                                                            onChange: (e)=>setEditedOwnerName(e.target.value),
                                                                            placeholder: "Nama owner",
                                                                            className: "rounded-2xl border border-blue-200 px-4 py-3 text-sm",
                                                                            disabled: isSaving
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1250,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: editedOwnerPhone,
                                                                            onChange: (e)=>setEditedOwnerPhone(e.target.value),
                                                                            placeholder: "No. Telepon",
                                                                            className: "rounded-2xl border border-blue-200 px-4 py-3 text-sm",
                                                                            disabled: isSaving
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1260,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "email",
                                                                            value: editedOwnerEmail,
                                                                            onChange: (e)=>setEditedOwnerEmail(e.target.value),
                                                                            placeholder: "Email",
                                                                            className: "rounded-2xl border border-blue-200 px-4 py-3 text-sm",
                                                                            disabled: isSaving
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1270,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            value: editedOwnerPlaceOfBirth,
                                                                            onChange: (e)=>setEditedOwnerPlaceOfBirth(e.target.value),
                                                                            placeholder: "Tempat lahir",
                                                                            className: "rounded-2xl border border-blue-200 px-4 py-3 text-sm",
                                                                            disabled: isSaving
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1280,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "date",
                                                                            value: editedOwnerDateOfBirth,
                                                                            onChange: (e)=>setEditedOwnerDateOfBirth(e.target.value),
                                                                            className: "rounded-2xl border border-blue-200 px-4 py-3 text-sm md:col-span-2",
                                                                            disabled: isSaving
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1290,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1249,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1245,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1126,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid gap-4 xl:grid-cols-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                            className: "rounded-[28px] border border-slate-200 bg-slate-50/80 p-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-500",
                                                                    children: "Company Profile"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1305,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                    className: "mt-1 text-xl font-bold text-slate-900",
                                                                    children: "Informasi Perusahaan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1308,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-4 grid gap-3 md:grid-cols-2",
                                                                    children: [
                                                                        renderReadOnlyField("Nama Perusahaan", editedName || gc.name || "-", "md:col-span-2"),
                                                                        renderReadOnlyField("Tax Status", gc.tax_status === 1 ? "PKP" : "Non PKP"),
                                                                        renderReadOnlyField("NPWP", gc.npwp || "-"),
                                                                        renderReadOnlyField("Description", editedDescription || gc.description || "-", "md:col-span-2")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1311,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mb-1.5 text-[11px] font-medium text-slate-600",
                                                                            children: "Dokumen Verifikasi"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1337,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(VerificationDocumentPreview, {
                                                                            url: attachmentUrl,
                                                                            token: token
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1340,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1336,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1304,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                            className: "rounded-[28px] border border-slate-200 bg-slate-50/80 p-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-500",
                                                                    children: "Primary Contact"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1348,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                    className: "mt-1 text-xl font-bold text-slate-900",
                                                                    children: "Identitas Pemilik"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1351,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-4 grid gap-3 md:grid-cols-2",
                                                                    children: [
                                                                        renderReadOnlyField("Nama Owner", editedOwnerName || "-"),
                                                                        renderReadOnlyField("Telepon", editedOwnerPhone || "-"),
                                                                        renderReadOnlyField("Email", editedOwnerEmail || "-"),
                                                                        renderReadOnlyField("Tempat Lahir", editedOwnerPlaceOfBirth || "-"),
                                                                        renderReadOnlyField("Tanggal Lahir", editedOwnerDateOfBirth || "-", "md:col-span-2")
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1354,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1347,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1303,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                            lineNumber: 1110,
                                            columnNumber: 21
                                        }, this),
                                        activeTab === "finance" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTags"], {
                                                                className: "h-4 w-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                lineNumber: 1387,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1386,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold uppercase tracking-[0.24em] text-amber-500",
                                                                    children: "Data Keuangan"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1390,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "mt-1 text-[1.75rem] font-bold leading-tight text-slate-900",
                                                                    children: "Credit, Limit, and Payment"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1393,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1389,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1385,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-5 rounded-[24px] border border-slate-200 bg-[linear-gradient(135deg,#fff7ed_0%,#f8fafc_100%)] p-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap items-start justify-between gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[11px] font-bold uppercase tracking-[0.24em] text-amber-600",
                                                                            children: "Policy Aktif"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1402,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-sm text-slate-600",
                                                                            children: "Menunjukkan limit final yang dipakai dan asal setting policy-nya."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1405,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1401,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700",
                                                                    children: [
                                                                        "Shared ke ",
                                                                        childBCs.length,
                                                                        " BC"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1410,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1400,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mt-4 grid gap-3 lg:grid-cols-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl border border-amber-100 bg-white/90 p-3.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[10px] font-bold uppercase tracking-[0.22em] text-amber-600",
                                                                            children: "Credit Limit"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1417,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-2 text-[1.75rem] font-bold leading-none text-slate-900",
                                                                            children: formatCurrency(activePolicy.creditLimit?.value)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1420,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-2.5 flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white",
                                                                                    children: policyLevelLabel(activePolicy.creditLimit?.active_level)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1424,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-semibold text-slate-700 sm:text-sm",
                                                                                    children: activeCreditSourceName
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1429,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1423,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1416,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl border border-teal-100 bg-white/90 p-3.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-[10px] font-bold uppercase tracking-[0.22em] text-teal-600",
                                                                            children: "Payment Term"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1436,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-2 text-[1.75rem] font-bold leading-none text-slate-900",
                                                                            children: [
                                                                                activePolicy.paymentTerm?.value ?? "-",
                                                                                " ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-sm font-semibold text-slate-500",
                                                                                    children: "Hari"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1441,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1439,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "mt-2.5 flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white",
                                                                                    children: policyLevelLabel(activePolicy.paymentTerm?.active_level)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1446,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-semibold text-slate-700 sm:text-sm",
                                                                                    children: activePaymentSourceName
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1451,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1445,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1435,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1415,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1399,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                            lineNumber: 1384,
                                            columnNumber: 21
                                        }, this),
                                        activeTab === "hierarchy" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid min-h-0 gap-4 xl:grid-cols-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "flex min-h-0 min-w-0 flex-col rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm xl:p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaBuilding"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                        lineNumber: 1466,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1465,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500",
                                                                            children: "National Brand"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1469,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: linkedNB ? "Relasi induk" : "Belum terhubung"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1472,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1468,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1464,
                                                            columnNumber: 25
                                                        }, this),
                                                        linkedNB ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0 rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 text-sm text-slate-800",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900",
                                                                    children: linkedNB.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1480,
                                                                    columnNumber: 29
                                                                }, this),
                                                                activePolicy.creditLimit?.active_level === "nbid" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-2 text-xs text-indigo-700",
                                                                    children: [
                                                                        "Limit:",
                                                                        " ",
                                                                        formatCurrency(activePolicy.creditLimit?.value)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1485,
                                                                    columnNumber: 31
                                                                }, this),
                                                                activePolicy.paymentTerm?.active_level === "nbid" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-1 text-xs text-indigo-700",
                                                                    children: [
                                                                        "Payment Term:",
                                                                        " ",
                                                                        formatDays(activePolicy.paymentTerm?.value)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1494,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1479,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm italic text-slate-500",
                                                            children: "Group Customer ini tidak terhubung ke National Brand."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1501,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1463,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "flex min-h-0 min-w-0 flex-col rounded-3xl border border-purple-100 bg-white p-4 shadow-sm xl:p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaArrowUp"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                        lineNumber: 1511,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1510,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-purple-500",
                                                                            children: "Group Parent"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1514,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: parentGP ? "Parent langsung" : "Belum terhubung"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1517,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1513,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1509,
                                                            columnNumber: 25
                                                        }, this),
                                                        parentGP ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>onViewGP?.(parentGP),
                                                            className: "flex w-full min-w-0 items-center justify-between rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-left text-sm text-slate-800 transition-all hover:border-purple-300 hover:bg-purple-100/80",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900",
                                                                            children: parentGP.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1529,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-2 text-xs text-purple-700",
                                                                            children: [
                                                                                "GPID: ",
                                                                                parentGP.code || `GP${parentGP.id}`
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1532,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        hierarchyCreditValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-2 text-xs text-purple-700",
                                                                            children: [
                                                                                "Limit: ",
                                                                                hierarchyCreditValue
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1536,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        hierarchyPaymentValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-xs text-purple-700",
                                                                            children: [
                                                                                "Payment Term: ",
                                                                                hierarchyPaymentValue
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1541,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        hierarchyPolicySourceLabel && hierarchyPolicySourceLabel !== parentGP.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "mt-1 text-xs font-medium text-purple-500",
                                                                            children: [
                                                                                "Policy mengikuti",
                                                                                " ",
                                                                                hierarchyPolicySourceLabel
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1548,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1528,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                    className: "ml-3 h-4 w-4 shrink-0 text-purple-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1554,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1524,
                                                            columnNumber: 27
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm italic text-slate-500",
                                                            children: "Parent GP tidak ditemukan."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1557,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1508,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                                    className: "flex min-h-0 min-w-0 flex-col rounded-3xl border border-orange-100 bg-white p-4 shadow-sm xl:p-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaStore"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                        lineNumber: 1566,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1565,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-orange-500",
                                                                            children: "Branch Customer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1569,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: [
                                                                                childBCs.length,
                                                                                " data terdaftar"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1572,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1568,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1564,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "max-h-[58vh] space-y-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                                                            children: childBCs.length > 0 ? childBCs.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>onViewBC?.(item),
                                                                    className: "flex w-full min-w-0 items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-left text-sm text-slate-800 transition-all hover:border-orange-300 hover:bg-orange-100/80",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "min-w-0",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900",
                                                                                    children: `${item.gc_name || gc.name || "GC"} - ${item.branch_city || item.branch_name || item.name || "-"}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1587,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "mt-2 text-xs text-orange-700",
                                                                                    children: [
                                                                                        "BCID: ",
                                                                                        item.code || `BC${item.id}`,
                                                                                        " •",
                                                                                        " ",
                                                                                        item.branch_city || "-"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                                    lineNumber: 1595,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1586,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaChevronRight"], {
                                                                            className: "ml-3 h-4 w-4 shrink-0 text-orange-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1600,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, item.id, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1581,
                                                                    columnNumber: 31
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm italic text-slate-500",
                                                                children: "Belum ada BC terdaftar."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                lineNumber: 1604,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1578,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1563,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                            lineNumber: 1462,
                                            columnNumber: 21
                                        }, this),
                                        activeTab === "activity" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "grid gap-4 md:grid-cols-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaClock"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                        lineNumber: 1618,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1617,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500",
                                                                            children: "Created"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1621,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: gc.created_by || "System"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1624,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1620,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1616,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-slate-800",
                                                            children: formatDateTime(gc.created_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1629,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1615,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-3xl border border-blue-100 bg-white p-5 shadow-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "mb-4 flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500 text-white",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaEdit"], {
                                                                        className: "h-5 w-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                        lineNumber: 1637,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1636,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-semibold uppercase tracking-[0.24em] text-blue-500",
                                                                            children: "Updated"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1640,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm text-slate-500",
                                                                            children: gc.updated_by || "System"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                            lineNumber: 1643,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                                    lineNumber: 1639,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1635,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-slate-800",
                                                            children: formatDateTime(gc.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                            lineNumber: 1648,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                    lineNumber: 1634,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                            lineNumber: 1614,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                    lineNumber: 1095,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                            lineNumber: 1050,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 1049,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end md:px-6",
                        children: [
                            isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCancelEdit,
                                        disabled: isSaving,
                                        className: "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 disabled:opacity-50 sm:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaTimes"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                lineNumber: 1666,
                                                columnNumber: 21
                                            }, this),
                                            "Batal"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                        lineNumber: 1661,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void handleSaveEdit(),
                                        disabled: isSaving || !editedCompanyType || !editedCompanyTitle || !editedCompanyNameBase.trim() || !editedCompanyNameSuffix.trim(),
                                        className: "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50 sm:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FaSave"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                                lineNumber: 1680,
                                                columnNumber: 21
                                            }, this),
                                            isSaving ? "Menyimpan..." : "Apply Changes"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                        lineNumber: 1669,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true),
                            !isEditMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                className: "w-full rounded-2xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-300 sm:w-auto",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                                lineNumber: 1686,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                        lineNumber: 1658,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
                lineNumber: 1007,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
            lineNumber: 1001,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/group_customer/GCDetailModal.tsx",
        lineNumber: 999,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_group_customer_GCDetailModal_tsx_5f510358._.js.map